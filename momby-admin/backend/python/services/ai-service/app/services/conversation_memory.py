from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from typing import List, Optional
from datetime import datetime
import uuid


class ConversationMemory:
    def __init__(self, mongodb_client: AsyncIOMotorClient):
        self.db = mongodb_client.momby_ai
        self.conversations = self.db.conversations
        self.messages = self.db.messages
    
    async def save_message(
        self,
        user_id: str,
        conversation_id: str,
        role: str,
        content: str,
        metadata: dict = None
    ):
        """Save a message to conversation history"""
        message = {
            "_id": str(uuid.uuid4()),
            "conversation_id": conversation_id,
            "user_id": user_id,
            "role": role,  # user, assistant
            "content": content,
            "metadata": metadata or {},
            "created_at": datetime.utcnow()
        }
        
        await self.messages.insert_one(message)
        return message
    
    async def get_conversation_messages(
        self,
        conversation_id: str,
        limit: int = 50
    ) -> List[dict]:
        """Get messages for a conversation"""
        cursor = self.messages.find(
            {"conversation_id": conversation_id}
        ).sort("created_at", -1).limit(limit)
        
        messages = await cursor.to_list(length=limit)
        return list(reversed(messages))  # Reverse to get chronological order
    
    async def create_conversation(
        self,
        user_id: str,
        title: str = None
    ) -> str:
        """Create a new conversation"""
        conversation = {
            "_id": str(uuid.uuid4()),
            "user_id": user_id,
            "title": title or "New Conversation",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await self.conversations.insert_one(conversation)
        return conversation["_id"]
    
    async def get_user_conversations(
        self,
        user_id: str,
        skip: int = 0,
        limit: int = 20
    ) -> List[dict]:
        """Get all conversations for a user"""
        cursor = self.conversations.find(
            {"user_id": user_id}
        ).sort("updated_at", -1).skip(skip).limit(limit)
        
        return await cursor.to_list(length=limit)

