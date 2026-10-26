"""
Daily Site Assistant API Routes.
Provides weather-aware daily assistance and site advisories.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.ai_service import get_daily_assistance
from config import settings

router = APIRouter(prefix="/api/assistant", tags=["Daily Assistant"])


class SiteInput(BaseModel):
    """Input schema for daily site assistance."""
    location: str = Field(..., description="Site location")
    weather: Optional[str] = Field(default="", description="Current weather conditions")
    temperature: Optional[str] = Field(default="", description="Current temperature")
    current_phase: Optional[str] = Field(default="", description="Current construction phase")
    planned_activities: Optional[str] = Field(default="", description="Planned activities for today")
    worker_count: Optional[int] = Field(default=None, ge=0, description="Number of workers on site")
    concerns: Optional[str] = Field(default="", description="Special concerns")


@router.post("/daily-briefing")
async def get_daily_briefing(site_input: SiteInput):
    """
    Generate a daily site briefing with weather-aware advisory.

    Returns weather alerts, daily checklist, activity recommendations, and safety reminders.
    """
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    try:
        result = await get_daily_assistance(site_input.model_dump())
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant failed: {str(e)}")
