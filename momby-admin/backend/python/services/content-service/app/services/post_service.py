from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
import uuid


class PostService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 20,
        category_id: Optional[str] = None
    ) -> List[Post]:
        """Get posts with pagination and optional filtering"""
        query = self.db.query(Post)
        
        if category_id:
            query = query.filter(Post.category_id == uuid.UUID(category_id))
        
        query = query.filter(Post.is_published == True)
        query = query.order_by(Post.created_at.desc())
        
        posts = query.offset(skip).limit(limit).all()
        return posts
    
    async def get_post_by_id(self, post_id: str) -> Optional[Post]:
        """Get a single post by ID"""
        return self.db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
    
    async def create_post(self, post_data: PostCreate) -> Post:
        """Create a new post"""
        # Generate slug from title
        slug = post_data.title.lower().replace(" ", "-")
        
        db_post = Post(
            **post_data.dict(),
            slug=slug,
            id=uuid.uuid4()
        )
        
        self.db.add(db_post)
        self.db.commit()
        self.db.refresh(db_post)
        return db_post
    
    async def update_post(self, post_id: str, post_data: PostUpdate) -> Optional[Post]:
        """Update an existing post"""
        post = self.db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
        
        if not post:
            return None
        
        update_data = post_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(post, field, value)
        
        self.db.commit()
        self.db.refresh(post)
        return post
    
    async def delete_post(self, post_id: str) -> bool:
        """Delete a post"""
        post = self.db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
        
        if not post:
            return False
        
        self.db.delete(post)
        self.db.commit()
        return True
    
    async def like_post(self, post_id: str) -> Optional[Post]:
        """Increment like count for a post"""
        post = self.db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
        
        if not post:
            return None
        
        post.like_count += 1
        self.db.commit()
        self.db.refresh(post)
        return post
    
    async def add_comment(self, post_id: str, comment: dict) -> Optional[Post]:
        """Add a comment to a post"""
        post = self.db.query(Post).filter(Post.id == uuid.UUID(post_id)).first()
        
        if not post:
            return None
        
        post.comment_count += 1
        self.db.commit()
        self.db.refresh(post)
        return post

