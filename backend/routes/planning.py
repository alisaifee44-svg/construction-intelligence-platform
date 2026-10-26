"""
Construction Project Planning API Routes.
Handles project planning requests with material estimation and scheduling.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.ai_service import plan_project
from config import settings

router = APIRouter(prefix="/api/planning", tags=["Project Planning"])


class ProjectInput(BaseModel):
    """Input schema for project planning."""
    project_type: str = Field(..., description="Type of construction project")
    description: str = Field(..., description="Detailed project description")
    location: Optional[str] = Field(default="", description="Project location")
    area_sqft: Optional[float] = Field(default=None, gt=0, description="Project area in sq ft")
    floors: Optional[int] = Field(default=1, ge=1, description="Number of floors")
    construction_type: Optional[str] = Field(default="", description="Construction type (RCC, steel, etc.)")
    budget_range: Optional[str] = Field(default="", description="Budget range")
    timeline: Optional[str] = Field(default="", description="Preferred timeline")
    special_requirements: Optional[str] = Field(default="", description="Special requirements")


@router.post("/create")
async def create_project_plan(project_input: ProjectInput):
    """
    Generate a comprehensive construction project plan.

    Returns material estimates, cost calculations, task schedules, and risk factors.
    """
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    try:
        result = await plan_project(project_input.model_dump())
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Planning failed: {str(e)}")
