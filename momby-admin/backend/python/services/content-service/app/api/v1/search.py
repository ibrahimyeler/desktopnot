from fastapi import APIRouter, Query, Depends
from typing import Optional
from app.services.search_service import SearchService

router = APIRouter()


@router.get("/")
async def search(
    q: str = Query(..., description="Search query"),
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20
):
    """Search posts, categories, and content"""
    service = SearchService()
    results = await service.search(query=q, category=category, skip=skip, limit=limit)
    return results

