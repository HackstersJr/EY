from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import ingestion, agent

app = FastAPI(
    title="EY Telematics Backend",
    description="Multi-Agent Predictive Maintenance Platform API",
    version="0.1.0"
)

app.include_router(ingestion.router, prefix="/api", tags=["Ingestion"])
app.include_router(agent.router, prefix="/api", tags=["Agent"])

# CORS Configuration
origins = [
    "http://localhost:3000", # Customer Frontend
    "http://localhost:3001", # OEM Frontend
    "http://localhost:3002", # Manufacturer Frontend
    "http://localhost:3005", # Manufacturer Frontend (New Port)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to EY Telematics Backend"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
