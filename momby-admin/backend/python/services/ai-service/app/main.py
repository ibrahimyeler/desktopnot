from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import ai, conversations

app = FastAPI(
    title="Momby AI Service",
    description="AI assistant and personalized recommendations service for Momby platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(conversations.router, prefix="/api/v1/ai/conversations", tags=["conversations"])


@app.get("/")
async def root():
    return {
        "service": "ai-service",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

