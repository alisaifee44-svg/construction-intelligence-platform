"""
AI-Powered Multimodal Construction Intelligence Platform — Backend Entry Point.

FastAPI server that provides AI-driven construction intelligence services including:
- Construction Site Safety Monitoring
- Structural Crack Detection & Analysis
- Real Estate Valuation
- Construction Project Planning
- Daily Site Assistance & Weather Advisory
- Construction Knowledge Assistant
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import safety, crack, valuation, planning, assistant, knowledge

# ─── Application Setup ───────────────────────────────────────────────────────

app = FastAPI(
    title="Construction Intelligence Platform API",
    description="AI-Powered Multimodal Construction Intelligence Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS Configuration ──────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routes ─────────────────────────────────────────────────────────

app.include_router(safety.router)
app.include_router(crack.router)
app.include_router(valuation.router)
app.include_router(planning.router)
app.include_router(assistant.router)
app.include_router(knowledge.router)


# ─── Root Endpoint ────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    """Health check and API info endpoint."""
    return {
        "platform": "AI-Powered Multimodal Construction Intelligence Platform",
        "version": "1.0.0",
        "status": "running",
        "ai_configured": settings.is_configured,
        "endpoints": {
            "safety_analysis": "/api/safety/analyze",
            "crack_detection": "/api/crack/analyze",
            "real_estate_valuation": "/api/valuation/evaluate",
            "project_planning": "/api/planning/create",
            "daily_assistant": "/api/assistant/daily-briefing",
            "knowledge_assistant": "/api/knowledge/ask",
            "docs": "/docs",
        }
    }


@app.get("/api/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "ai_service": "configured" if settings.is_configured else "not_configured",
        "model": settings.MODEL_NAME,
    }


# ─── Run Server ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
