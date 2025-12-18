from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = []
    featured_image: Optional[str] = None
    is_published: bool = False


class PostCreate(PostBase):
    author_id: str


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category_id: Optional[str] = None
    tags: Optional[List[str]] = None
    featured_image: Optional[str] = None
    is_published: Optional[bool] = None


class PostResponse(PostBase):
    id: str
    author_id: str
    slug: str
    view_count: int = 0
    like_count: int = 0
    comment_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

