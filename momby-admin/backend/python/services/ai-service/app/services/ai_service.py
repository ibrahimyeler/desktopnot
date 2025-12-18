from app.core.chains.chat_chain import ChatChain
from app.core.chains.recommendation_chain import RecommendationChain
from app.core.chains.summarization_chain import SummarizationChain
from app.services.conversation_memory import ConversationMemory
from app.core.database import get_mongodb
from typing import Optional, Dict
import uuid


class AIService:
    def __init__(self):
        self.chat_chains: Dict[str, ChatChain] = {}
    
    async def chat(
        self,
        user_id: str,
        question: str,
        context: Optional[dict] = None,
        conversation_id: Optional[str] = None
    ):
        """Process chat question"""
        # Get or create chat chain for user
        if user_id not in self.chat_chains:
            self.chat_chains[user_id] = ChatChain(user_id=user_id)
        
        chain = self.chat_chains[user_id]
        
        # Process question
        result = await chain.chat(question=question, context=context)
        
        # Save to conversation history
        mongodb = get_mongodb()
        if mongodb:
            memory = ConversationMemory(mongodb)
            
            if not conversation_id:
                conversation_id = await memory.create_conversation(user_id=user_id)
            
            await memory.save_message(
                user_id=user_id,
                conversation_id=conversation_id,
                role="user",
                content=question
            )
            
            await memory.save_message(
                user_id=user_id,
                conversation_id=conversation_id,
                role="assistant",
                content=result["answer"],
                metadata={"sources": result.get("sources", [])}
            )
        
        return {
            "answer": result["answer"],
            "sources": result.get("sources", []),
            "conversation_id": conversation_id
        }
    
    async def get_recommendations(
        self,
        user_id: str,
        user_profile: dict,
        content_history: list = [],
        week: Optional[int] = None
    ):
        """Get personalized recommendations"""
        chain = RecommendationChain()
        recommendations = await chain.get_recommendations(
            user_profile=user_profile,
            content_history=content_history,
            week=week
        )
        return recommendations
    
    async def get_weekly_content(self, user_id: str, week: int):
        """Get weekly content based on pregnancy week"""
        # This would typically query content service or vector store
        # For now, return placeholder
        return {
            "week": week,
            "content": [],
            "recommendations": []
        }
    
    async def summarize(self, content: str, max_length: int = 200):
        """Summarize content"""
        chain = SummarizationChain()
        summary = await chain.summarize(content=content, max_length=max_length)
        return summary
    
    async def analyze_sentiment(self, content: str):
        """Analyze sentiment of content"""
        # Placeholder for sentiment analysis
        # Would typically use a sentiment analysis model or LLM
        return {
            "sentiment": "positive",
            "score": 0.85
        }

