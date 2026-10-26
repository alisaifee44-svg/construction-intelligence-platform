"""
Construction Knowledge Assistant API Routes.
Provides expert answers to construction-related questions.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from services.ai_service import get_knowledge_response
from config import settings

router = APIRouter(prefix="/api/knowledge", tags=["Knowledge Assistant"])


class QuestionInput(BaseModel):
    """Input schema for knowledge queries."""
    question: str = Field(..., min_length=5, description="Construction-related question")
    context: Optional[str] = Field(default="", description="Additional context")


@router.post("/ask")
async def ask_knowledge_question(question_input: QuestionInput):
    """
    Answer construction-related questions with expert knowledge.

    Returns comprehensive answer with key points, best practices, and references.
    """
    if not settings.is_configured:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set your GEMINI_API_KEY in the .env file."
        )

    try:
        result = await get_knowledge_response(question_input.question, question_input.context)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge query failed: {str(e)}")
