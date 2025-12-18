from langchain_anthropic import ChatAnthropic
from app.core.config import settings


def get_anthropic_llm(model: str = "claude-3-opus-20240229", temperature: float = None):
    """Get Anthropic Claude LLM instance"""
    return ChatAnthropic(
        model=model,
        temperature=temperature or settings.TEMPERATURE,
        max_tokens=settings.MAX_TOKENS,
        anthropic_api_key=settings.ANTHROPIC_API_KEY
    )

