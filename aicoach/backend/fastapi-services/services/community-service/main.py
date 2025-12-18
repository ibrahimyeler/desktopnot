from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os

app = FastAPI(title="Community Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Post(BaseModel):
    id: str
    user_id: str
    category: str
    title: str
    content: str
    author: str
    created_at: datetime
    likes: int = 0
    comments: int = 0
    is_featured: bool = False

class CreatePostRequest(BaseModel):
    category: str
    title: str
    content: str

class CommentRequest(BaseModel):
    content: str

# In-memory storage (use database in production)
posts_db = []
comments_db = []

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/community/posts")
async def get_posts(
    category: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    """Get community posts with optional filtering"""
    filtered_posts = posts_db
    
    if category:
        filtered_posts = [p for p in posts_db if p["category"] == category]
    
    # Sort by featured first, then by created_at
    filtered_posts = sorted(
        filtered_posts,
        key=lambda x: (not x.get("is_featured", False), x["created_at"]),
        reverse=True
    )
    
    return {
        "posts": filtered_posts[offset:offset+limit],
        "total": len(filtered_posts)
    }

@app.get("/community/posts/featured")
async def get_featured_posts(limit: int = 5):
    """Get featured posts"""
    featured = [p for p in posts_db if p.get("is_featured", False)]
    return {
        "posts": featured[:limit],
        "total": len(featured)
    }

@app.get("/community/posts/{post_id}")
async def get_post(post_id: str):
    """Get a single post by ID"""
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get comments for this post
    comments = [c for c in comments_db if c["post_id"] == post_id]
    post["comments_list"] = comments
    
    return post

@app.post("/community/posts")
async def create_post(
    request: CreatePostRequest,
    x_user_id: str = Header(None, alias="X-User-ID"),
    x_username: str = Header(None, alias="X-Username")
):
    """Create a new community post"""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    new_post = {
        "id": f"post_{len(posts_db) + 1}",
        "user_id": x_user_id,
        "author": x_username or "Anonymous",
        "category": request.category,
        "title": request.title,
        "content": request.content,
        "created_at": datetime.now().isoformat(),
        "likes": 0,
        "comments": 0,
        "is_featured": False
    }
    
    posts_db.append(new_post)
    return new_post

@app.post("/community/posts/{post_id}/like")
async def like_post(
    post_id: str,
    x_user_id: str = Header(None, alias="X-User-ID")
):
    """Like/unlike a post"""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post["likes"] = post.get("likes", 0) + 1
    return {"message": "Post liked", "likes": post["likes"]}

@app.post("/community/posts/{post_id}/comments")
async def add_comment(
    post_id: str,
    request: CommentRequest,
    x_user_id: str = Header(None, alias="X-User-ID"),
    x_username: str = Header(None, alias="X-Username")
):
    """Add a comment to a post"""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = {
        "id": f"comment_{len(comments_db) + 1}",
        "post_id": post_id,
        "user_id": x_user_id,
        "author": x_username or "Anonymous",
        "content": request.content,
        "created_at": datetime.now().isoformat()
    }
    
    comments_db.append(new_comment)
    post["comments"] = post.get("comments", 0) + 1
    
    return new_comment

@app.get("/community/categories")
async def get_categories():
    """Get all available categories"""
    categories = [
        {"id": "finance", "name": "Finans", "icon": "💰", "count": 0},
        {"id": "health", "name": "Sağlık", "icon": "🏥", "count": 0},
        {"id": "sport", "name": "Spor", "icon": "💪", "count": 0},
        {"id": "career", "name": "Kariyer", "icon": "💼", "count": 0}
    ]
    
    # Count posts per category
    for category in categories:
        category["count"] = len([p for p in posts_db if p["category"] == category["id"]])
    
    return {"categories": categories}

@app.get("/community/stats")
async def get_community_stats():
    """Get community statistics"""
    stats = {
        "total_members": 1234,
        "active_topics": 56,
        "total_messages": 789,
        "categories": len([c for c in get_categories() if c.get("count", 0) > 0]),
        "total_posts": len(posts_db),
        "featured_posts": len([p for p in posts_db if p.get("is_featured", False)])
    }
    return stats

@app.delete("/community/posts/{post_id}")
async def delete_post(
    post_id: str,
    x_user_id: str = Header(None, alias="X-User-ID")
):
    """Delete a post (only by author)"""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    post = next((p for p in posts_db if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if post["user_id"] != x_user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    posts_db.remove(post)
    
    # Also delete related comments
    global comments_db
    comments_db = [c for c in comments_db if c["post_id"] != post_id]
    
    return {"message": "Post deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8300)

