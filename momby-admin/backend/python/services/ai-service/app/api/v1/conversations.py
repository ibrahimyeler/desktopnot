from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.services.conversation_memory import ConversationMemory
from app.core.database import get_mongodb

router = APIRouter()


@router.get("/")
async def get_conversations(
    user_id: str = Query(...),
    skip: int = 0,
    limit: int = 20
):
    """Get all conversations for a user"""
    mongodb = get_mongodb()
    if not mongodb:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    memory = ConversationMemory(mongodb)
    conversations = await memory.get_user_conversations(
        user_id=user_id,
        skip=skip,
        limit=limit
    )
    return conversations


@router.get("/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = 50
):
    """Get messages for a specific conversation"""
    mongodb = get_mongodb()
    if not mongodb:
        raise HTTPException(status_code=500, detail="Database not connected")
    
    memory = ConversationMemory(mongodb)
    messages = await memory.get_conversation_messages(
        conversation_id=conversation_id,
        limit=limit
    )
    return messages

