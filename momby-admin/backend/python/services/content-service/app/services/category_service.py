from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate
import uuid


class CategoryService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_categories(self) -> List[Category]:
        """Get all categories"""
        return self.db.query(Category).all()
    
    async def get_category_by_id(self, category_id: str) -> Optional[Category]:
        """Get a single category by ID"""
        return self.db.query(Category).filter(Category.id == uuid.UUID(category_id)).first()
    
    async def create_category(self, category_data: CategoryCreate) -> Category:
        """Create a new category"""
        db_category = Category(
            **category_data.dict(),
            id=uuid.uuid4()
        )
        
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category
    
    async def update_category(self, category_id: str, category_data: CategoryUpdate) -> Optional[Category]:
        """Update an existing category"""
        category = self.db.query(Category).filter(Category.id == uuid.UUID(category_id)).first()
        
        if not category:
            return None
        
        update_data = category_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(category, field, value)
        
        self.db.commit()
        self.db.refresh(category)
        return category
    
    async def delete_category(self, category_id: str) -> bool:
        """Delete a category"""
        category = self.db.query(Category).filter(Category.id == uuid.UUID(category_id)).first()
        
        if not category:
            return False
        
        self.db.delete(category)
        self.db.commit()
        return True

