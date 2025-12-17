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
        raise HTTPException(status_code=500, detail=str(e))

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
