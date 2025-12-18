from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.services.post_service import PostService

router = APIRouter()


@router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = 0,
    limit: int = 20,
    category_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all posts with pagination and optional filtering"""
    service = PostService(db)
    posts = await service.get_posts(skip=skip, limit=limit, category_id=category_id)
    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, db: Session = Depends(get_db)):
    """Get a single post by ID"""
    service = PostService(db)
    post = await service.get_post_by_id(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, db: Session = Depends(get_db)):
    """Create a new post"""
    service = PostService(db)
    new_post = await service.create_post(post)
    return new_post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    post: PostUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing post"""
    service = PostService(db)
    updated_post = await service.update_post(post_id, post)
    if not updated_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return updated_post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, db: Session = Depends(get_db)):
    """Delete a post"""
    service = PostService(db)
    success = await service.delete_post(post_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )


@router.post("/{post_id}/like", response_model=PostResponse)
async def like_post(post_id: str, db: Session = Depends(get_db)):
    """Like a post"""
    service = PostService(db)
    post = await service.like_post(post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return post


@router.post("/{post_id}/comment")
async def add_comment(
    post_id: str,
    comment: dict,
    db: Session = Depends(get_db)
):
    """Add a comment to a post"""
    service = PostService(db)
    result = await service.add_comment(post_id, comment)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return result

