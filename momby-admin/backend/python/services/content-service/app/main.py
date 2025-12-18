from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import posts, categories, media, search

app = FastAPI(
    title="Momby Content Service",
    description="Content management and blog service for Momby platform",
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
app.include_router(posts.router, prefix="/api/v1/posts", tags=["posts"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(media.router, prefix="/api/v1/media", tags=["media"])
app.include_router(search.router, prefix="/api/v1/search", tags=["search"])


@app.get("/")
async def root():
    return {
        "service": "content-service",
        "status": "healthy",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

