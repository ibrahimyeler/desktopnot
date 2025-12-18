from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
from pydantic import BaseModel
from app.services.ai_service import AIService

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    user_id: str
    context: Optional[dict] = None


class RecommendationRequest(BaseModel):
    user_id: str
    user_profile: dict
    content_history: list = []
    week: Optional[int] = None


class SummarizeRequest(BaseModel):
    content: str
    max_length: Optional[int] = 200


@router.post("/chat")
async def chat(request: ChatRequest):
    """AI assistant chat endpoint"""
    service = AIService()
    result = await service.chat(
        user_id=request.user_id,
        question=request.question,
        context=request.context
    )
    return result


@router.post("/recommendations")
async def get_recommendations(request: RecommendationRequest):
    """Get personalized content recommendations"""
    service = AIService()
    recommendations = await service.get_recommendations(
        user_id=request.user_id,
        user_profile=request.user_profile,
        content_history=request.content_history,
        week=request.week
    )
    return recommendations


@router.get("/weekly-content/{week}")
async def get_weekly_content(week: int, user_id: str):
    """Get weekly content based on pregnancy week"""
    service = AIService()
    content = await service.get_weekly_content(user_id=user_id, week=week)
    return content


@router.post("/summarize")
async def summarize(request: SummarizeRequest):
    """Summarize content"""
    service = AIService()
    summary = await service.summarize(
        content=request.content,
        max_length=request.max_length
    )
    return {"summary": summary}


@router.post("/analyze-sentiment")
async def analyze_sentiment(content: str):
    """Analyze sentiment of content"""
    service = AIService()
    sentiment = await service.analyze_sentiment(content)
    return sentiment

