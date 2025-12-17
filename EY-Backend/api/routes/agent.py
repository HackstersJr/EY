from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import httpx
import os

router = APIRouter()

# N8N Base URL (Internal Docker Network)
N8N_BASE_URL = os.getenv("N8N_BASE_URL", "http://n8n:5678/webhook")

# --- Request Models ---

class ChatRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

class SchedulingRequest(BaseModel):
    user_id: str
    vehicle_id: str
    preferred_date: str
    service_center_id: str

class AnalysisRequest(BaseModel):
    vehicle_id: str

class FeedbackRequest(BaseModel):
    appointment_id: str
    rating: int
    comments: str

class ManufacturingRequest(BaseModel):
    context: Optional[Dict[str, Any]] = None

class OEMRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None

# --- Helper Function ---

async def forward_to_n8n(endpoint: str, payload: dict):
    url = f"{N8N_BASE_URL}/{endpoint}"
    try:
        async with httpx.AsyncClient() as client:
            # Increase timeout for AI agents
            response = await client.post(url, json=payload, timeout=60.0)
            
            # n8n might return 200 even on logical errors, but check status code
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"n8n Error: {response.text}")
            
            # Return JSON response
            return response.json()
            
    except httpx.RequestError as e:
        raise HTTPException(status_code=503, detail=f"Failed to connect to n8n: {str(e)}")
    except Exception as e:
        # Catch JSON decode errors or other issues
        error_detail = str(e)
        if 'response' in locals() and response:
             error_detail += f" | Response Body: {response.text[:500]}"
        raise HTTPException(status_code=500, detail=error_detail)

# --- Endpoints ---

@router.post("/agent/chat")
async def chat_agent(request: ChatRequest):
    """
    Customer Engagement Agent
    """
    # Map 'query' from frontend to 'message' for n8n
    payload = {
        "message": request.query,
        "user_id": request.context.get("user_id", "anonymous") if request.context else "anonymous"
    }
    return await forward_to_n8n("agent/chat", payload)

@router.post("/agent/scheduling")
async def scheduling_agent(request: SchedulingRequest):
    """
    Vehicle Service Scheduling Agent
    """
    return await forward_to_n8n("agent/scheduling", request.dict())

@router.post("/agent/analysis")
async def analysis_agent(request: AnalysisRequest):
    """
    Data Analysis Agent
    """
    return await forward_to_n8n("agent/analysis", request.dict())

@router.post("/agent/feedback")
async def feedback_agent(request: FeedbackRequest):
    """
    Feedback Collection Agent
    """
    return await forward_to_n8n("agent/feedback", request.dict())

@router.post("/agent/manufacturing")
async def manufacturing_agent(request: ManufacturingRequest):
    """
    Manufacturing Insights Agent
    """
    return await forward_to_n8n("agent/manufacturing", request.dict() if request else {})

@router.post("/agent/oem")
async def oem_agent(request: OEMRequest):
    """
    OEM Insights Agent (Proxies to Analysis Agent with OEM context or specific OEM workflow)
    For now, reusing Data Analysis workflow but passing query as 'message'
    """
    # We might need a specific OEM workflow in n8n, but let's try to reuse analysis or chat 
    # If we reuse Analysis, it expects 'vehicle_id'. 
    # Let's route to the Master Agent (chat) but with context=OEM so it can decide.
    # Actually, let's assume we reuse the Chat Agent but with role=OEM.
    
    payload = {
        "query": request.query,
        "message": request.query,
        "role": "OEM_ANALYST", 
        "context": request.context or {}
    }
    # Using the same webhook as customer chat for now to get AI response capability
    # The prompt in valid agent should handle "OEM" role if configured, otherwise we need a new workflow.
    # PROPOSAL: Use a new webhook 'agent/oem' and I will create that workflow if it doesn't exist.
    return await forward_to_n8n("agent/oem-db", payload)
