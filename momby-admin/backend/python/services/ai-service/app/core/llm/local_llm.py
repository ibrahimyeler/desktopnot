from langchain_community.llms import Ollama
from app.core.config import settings


def get_ollama_llm(model: str = "llama2", temperature: float = None):
    """Get local Ollama LLM instance"""
    return Ollama(
        model=model,
        base_url=settings.OLLAMA_BASE_URL,
        temperature=temperature or settings.TEMPERATURE
    )

