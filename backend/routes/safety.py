"""
Safety Monitoring API Routes.
Handles construction site image uploads and safety analysis.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.ai_service import analyze_safety
from config import settings

router = APIRouter(prefix="/api/safety", tags=["Safety Monitoring"])


@router.post("/analyze")
async def analyze_site_safety(
    image: UploadFile = File(..., description="Construction site image"),
    context: str = Form(default="", description="Additional context about the site")
):
    """
    Analyze a construction site image for safety hazards.

    Accepts an image upload and optional context text.
    Returns structured JSON with hazards, PPE compliance, and recommendations.
    """
    # Validate API configuration
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    # Validate file type
    if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type: {image.content_type}. Allowed types: {settings.ALLOWED_IMAGE_TYPES}"
        )

    # Read and validate image size
    image_bytes = await image.read()
    if len(image_bytes) > settings.MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large. Maximum size: {settings.MAX_IMAGE_SIZE_MB}MB"
        )

    try:
        result = await analyze_safety(image_bytes, context)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
