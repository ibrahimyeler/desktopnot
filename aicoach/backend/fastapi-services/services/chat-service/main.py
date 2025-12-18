from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx
from datetime import datetime

app = FastAPI(title="Chat Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://auth-service:8001")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

class Message(BaseModel):
    role: str  # user, assistant, system
    content: str
    timestamp: Optional[datetime] = None

class ChatRequest(BaseModel):
    coach_id: str
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    conversation_id: str
    messages: List[Message]
    usage: Optional[dict] = None

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/chat/message")
async def send_message(
    request: ChatRequest,
    authorization: str = Header(None),
    user_id: str = Header(None, alias="X-User-ID")
):
    """
    Send a message to a coach and get AI response
    """
    # Validate user
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Get coach details from coach service
    async with httpx.AsyncClient() as client:
        try:
            coach_response = await client.get(
                f"http://coach-service:8003/coaches/{request.coach_id}",
                headers={"X-User-ID": user_id}
            )
            if coach_response.status_code != 200:
                raise HTTPException(status_code=404, detail="Coach not found")
            coach = coach_response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to fetch coach: {str(e)}")
    
    # Generate AI response
    try:
        response = await generate_ai_response(
            message=request.message,
            system_prompt=coach.get("system_prompt", ""),
            config=coach.get("config", {})
        )
        
        return ChatResponse(
            conversation_id=request.conversation_id or "new",
            messages=[
                Message(role="user", content=request.message, timestamp=datetime.now()),
                Message(role="assistant", content=response["content"], timestamp=datetime.now())
            ],
            usage=response.get("usage")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

async def generate_ai_response(message: str, system_prompt: str, config: dict):
    """
    Generate AI response using configured provider
    """
    provider = config.get("provider", "openai")
    model = config.get("model", "gpt-4")
    
    if provider == "openai":
        return await generate_openai_response(message, system_prompt, model)
    elif provider == "anthropic":
        return await generate_anthropic_response(message, system_prompt, model)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

async def generate_openai_response(message: str, system_prompt: str, model: str):
    """Generate response using OpenAI"""
    import openai
    
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")
    
    client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
    
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        return {
            "content": response.choices[0].message.content,
            "usage": {
                "tokens": response.usage.total_tokens,
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI error: {str(e)}")

async def generate_anthropic_response(message: str, system_prompt: str, model: str):
    """Generate response using Anthropic"""
    import anthropic
    
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="Anthropic API key not configured")
    
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    
    try:
        response = await client.messages.create(
            model=model,
            max_tokens=1000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": message}
            ]
        )
        
        return {
            "content": response.content[0].text,
            "usage": {
                "tokens": response.usage.input_tokens + response.usage.output_tokens,
                "prompt_tokens": response.usage.input_tokens,
                "completion_tokens": response.usage.output_tokens
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anthropic error: {str(e)}")

@app.get("/chat/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_id: str = Header(None, alias="X-User-ID")
):
    """Get conversation history"""
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    # In production, fetch from Redis/PostgreSQL
    return {"conversation_id": conversation_id, "messages": []}

@app.delete("/chat/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user_id: str = Header(None, alias="X-User-ID")
):
    """Delete a conversation"""
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return {"message": "Conversation deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8100)

