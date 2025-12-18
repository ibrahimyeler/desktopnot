from langchain.vectorstores import Pinecone, Weaviate, Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from app.core.config import settings
from app.core.llm.openai_client import get_openai_embeddings
import pinecone


def get_vector_store():
    """Get vector store based on configuration"""
    if settings.VECTOR_STORE_TYPE == "pinecone":
        return get_pinecone_store()
    elif settings.VECTOR_STORE_TYPE == "weaviate":
        return get_weaviate_store()
    elif settings.VECTOR_STORE_TYPE == "chroma":
        return get_chroma_store()
    else:
        raise ValueError(f"Unknown vector store type: {settings.VECTOR_STORE_TYPE}")


def get_pinecone_store():
    """Get Pinecone vector store"""
    if not settings.PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY not configured")
    
    # Initialize Pinecone
    pinecone.init(
        api_key=settings.PINECONE_API_KEY,
        environment=settings.PINECONE_ENVIRONMENT
    )
    
    embeddings = get_openai_embeddings()
    
    return Pinecone.from_existing_index(
        index_name=settings.PINECONE_INDEX_NAME,
        embedding=embeddings
    )


def get_weaviate_store():
    """Get Weaviate vector store"""
    if not settings.WEAVIATE_URL:
        raise ValueError("WEAVIATE_URL not configured")
    
    embeddings = get_openai_embeddings()
    
    return Weaviate.from_existing_index(
        url=settings.WEAVIATE_URL,
        index_name=settings.PINECONE_INDEX_NAME,
        embedding=embeddings
    )


def get_chroma_store():
    """Get Chroma vector store"""
    # Use sentence transformers for local embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name=settings.SENTENCE_TRANSFORMERS_MODEL
    )
    
    return Chroma(
        persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        embedding_function=embeddings
    )

