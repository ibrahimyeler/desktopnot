from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

mongodb_client: AsyncIOMotorClient = None


def get_mongodb():
    """Get MongoDB client"""
    return mongodb_client


async def connect_to_mongo():
    """Create database connection"""
    global mongodb_client
    mongodb_client = AsyncIOMotorClient(settings.MONGODB_URL)
    return mongodb_client


async def close_mongo_connection():
    """Close database connection"""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()

