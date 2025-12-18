from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "AI Service"
    DEBUG: bool = False
    
    # LLM APIs
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    
    # Vector Database
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: Optional[str] = None
    PINECONE_INDEX_NAME: str = "momby-content"
    
    WEAVIATE_URL: Optional[str] = None
    
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    
    # MongoDB (for conversation history)
    MONGODB_URL: str = "mongodb://localhost:27017/momby_ai"
    
    # Embeddings
    EMBEDDING_MODEL: str = "text-embedding-3-small"  # OpenAI or sentence-transformers
    SENTENCE_TRANSFORMERS_MODEL: str = "all-MiniLM-L6-v2"
    
    # LLM Settings
    DEFAULT_LLM_MODEL: str = "gpt-4"  # gpt-4, gpt-3.5-turbo, claude-3-opus, ollama:llama2
    MAX_TOKENS: int = 2000
    TEMPERATURE: float = 0.7
    
    # Vector Store Settings
    VECTOR_STORE_TYPE: str = "pinecone"  # pinecone, weaviate, chroma
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://admin.momby.com"
    ]
    
    # RAG Settings
    TOP_K_RESULTS: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

