"""
Real Estate Valuation API Routes.
Handles property valuation requests with structured input.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.ai_service import evaluate_property
from config import settings

router = APIRouter(prefix="/api/valuation", tags=["Real Estate Valuation"])


class PropertyInput(BaseModel):
    """Input schema for property valuation."""
    location: str = Field(..., description="Property location/address")
    property_type: str = Field(..., description="Type of property (residential, commercial, etc.)")
    area_sqft: float = Field(..., gt=0, description="Area in square feet")
    bedrooms: Optional[int] = Field(default=None, ge=0, description="Number of bedrooms")
    bathrooms: Optional[int] = Field(default=None, ge=0, description="Number of bathrooms")
    year_built: Optional[int] = Field(default=None, description="Year the property was built")
    condition: Optional[str] = Field(default="average", description="Property condition")
    amenities: Optional[str] = Field(default="", description="Available amenities")
    additional_notes: Optional[str] = Field(default="", description="Additional notes")


@router.post("/evaluate")
async def evaluate_real_estate(property_input: PropertyInput):
    """
    Evaluate real estate property value based on provided details.

    Accepts structured property information and returns AI-generated valuation.
    """
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    try:
        result = await evaluate_property(property_input.model_dump())
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Valuation failed: {str(e)}")
