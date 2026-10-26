"""
Crack Detection and Analysis API Routes.
Handles structural crack image uploads and AI-powered analysis.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.ai_service import analyze_cracks
from config import settings

router = APIRouter(prefix="/api/crack", tags=["Crack Detection"])


@router.post("/analyze")
async def analyze_structural_cracks(
    image: UploadFile = File(..., description="Image of structural cracks"),
    context: str = Form(default="", description="Additional context about the structure")
):
    """
    Analyze structural cracks in uploaded images.

    Returns crack type, severity, probable cause, and corrective actions.
    """
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid image type: {image.content_type}. Allowed types: {settings.ALLOWED_IMAGE_TYPES}"
        )

    image_bytes = await image.read()
    if len(image_bytes) > settings.MAX_IMAGE_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Image too large. Maximum size: {settings.MAX_IMAGE_SIZE_MB}MB"
        )

    try:
        result = await analyze_cracks(image_bytes, context)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
