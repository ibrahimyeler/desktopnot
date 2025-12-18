from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import os
import httpx

app = FastAPI(title="Analytics Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/analytics/user/{user_id}/overview")
async def get_user_overview(
    user_id: str,
    x_user_id: str = Header(None, alias="X-User-ID"),
    days: int = 30
):
    """Get user analytics overview"""
    if x_user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Fetch data from various services
    async with httpx.AsyncClient() as client:
        stats_response = await client.get(
            f"http://user-service:8002/users/{user_id}/stats",
            headers={"X-User-ID": user_id}
        )
        stats = stats_response.json() if stats_response.status_code == 200 else {}
    
    # Calculate trends
    overview = {
        "user_id": user_id,
        "period": f"Last {days} days",
        "stats": stats,
        "trends": {
            "coaches_growth": calculate_growth_rate(stats.get("total_coaches", 0)),
            "goals_completion_rate": calculate_completion_rate(
                stats.get("completed_goals", 0),
                stats.get("active_goals", 0) + stats.get("completed_goals", 0)
            ),
            "activity_score": calculate_activity_score(stats),
        },
        "insights": generate_insights(stats)
    }
    
    return overview

@app.get("/analytics/user/{user_id}/activity")
async def get_user_activity(
    user_id: str,
    x_user_id: str = Header(None, alias="X-User-ID"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Get detailed activity timeline"""
    if x_user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Mock activity data
    activity = {
        "user_id": user_id,
        "period": {
            "start": start_date or (datetime.now() - timedelta(days=30)).isoformat(),
            "end": end_date or datetime.now().isoformat()
        },
        "events": [
            {
                "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(),
                "type": "chat_message",
                "description": "Sent message to Finans Koçu",
                "coach": "Finans Koçu"
            },
            {
                "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
                "type": "goal_created",
                "description": "Created goal: Haftalık Bütçe",
                "category": "finance"
            }
        ]
    }
    
    return activity

@app.get("/analytics/coach/{coach_id}/usage")
async def get_coach_usage(
    coach_id: str,
    x_user_id: str = Header(None, alias="X-User-ID")
):
    """Get coach usage statistics"""
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    usage = {
        "coach_id": coach_id,
        "total_messages": 45,
        "total_sessions": 12,
        "average_session_duration": 15.5,  # minutes
        "last_used": datetime.now().isoformat(),
        "most_active_days": ["Monday", "Wednesday", "Friday"],
        "top_topics": ["bütçe", "tasarruf", "yatırım"]
    }
    
    return usage

def calculate_growth_rate(current_value: int) -> float:
    """Calculate growth rate percentage"""
    return min(current_value * 5.0, 100.0)

def calculate_completion_rate(completed: int, total: int) -> float:
    """Calculate completion rate percentage"""
    if total == 0:
        return 0.0
    return (completed / total) * 100.0

def calculate_activity_score(stats: dict) -> int:
    """Calculate overall activity score"""
    base_score = (
        stats.get("total_coaches", 0) * 10 +
        stats.get("active_goals", 0) * 15 +
        stats.get("chat_messages", 0) * 2 +
        stats.get("community_posts", 0) * 5
    )
    return min(base_score, 100)

def generate_insights(stats: dict) -> List[str]:
    """Generate insights based on user stats"""
    insights = []
    
    if stats.get("total_coaches", 0) == 0:
        insights.append("🎯 Henüz koç eklemediniz. İlk koçunuzu oluşturarak kişisel gelişiminize başlayın!")
    elif stats.get("total_coaches", 0) < 3:
        insights.append("🌱 Harika başlangıç! Daha fazla koç ekleyerek hedeflerinizi genişletebilirsiniz.")
    
    completion_rate = calculate_completion_rate(
        stats.get("completed_goals", 0),
        stats.get("active_goals", 0) + stats.get("completed_goals", 0)
    )
    
    if completion_rate >= 80:
        insights.append("🏆 Mükemmel! Hedeflerinizin çoğunu tamamlıyorsunuz. Devam edin!")
    elif completion_rate >= 50:
        insights.append("💪 İyi gidiyorsunuz! Hedeflerinize ulaşmak için devam edin.")
    
    if stats.get("chat_messages", 0) < 10:
        insights.append("💬 Koçlarınızla daha fazla konuşarak size özel öneriler alabilirsiniz.")
    
    if not insights:
        insights.append("📊 Aktiviteniz dengeli görünüyor. Yeni hedefler belirleyerek devam edin!")
    
    return insights

@app.get("/analytics/community/trends")
async def get_community_trends():
    """Get community-wide trends"""
    trends = {
        "top_topics": [
            {"topic": "Finans", "posts": 156, "growth": 12.5},
            {"topic": "Sağlık", "posts": 132, "growth": 8.3},
            {"topic": "Spor", "posts": 98, "growth": 15.2},
            {"topic": "Kariyer", "posts": 87, "growth": 5.6}
        ],
        "active_users": {
            "total": 1234,
            "new_today": 12,
            "new_this_week": 89
        },
        "engagement": {
            "avg_likes_per_post": 24.5,
            "avg_comments_per_post": 8.7,
            "top_post_likes": 145
        }
    }
    
    return trends

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8200)

