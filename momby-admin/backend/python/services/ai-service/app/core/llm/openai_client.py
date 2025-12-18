from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from app.core.config import settings


def get_openai_llm(model: str = None, temperature: float = None):
    """Get OpenAI LLM instance"""
    return ChatOpenAI(
        model=model or settings.DEFAULT_LLM_MODEL,
        temperature=temperature or settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
        openai_api_key=settings.OPENAI_API_KEY
    )


def get_openai_embeddings():
    """Get OpenAI embeddings instance"""
    return OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        openai_api_key=settings.OPENAI_API_KEY
    )

