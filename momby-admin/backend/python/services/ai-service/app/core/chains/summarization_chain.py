from langchain.chains.summarize import load_summarize_chain
from langchain.text_splitter import RecursiveCharacterTextSplitter
from app.core.llm.openai_client import get_openai_llm


class SummarizationChain:
    def __init__(self, llm=None, chain_type="map_reduce"):
        self.llm = llm or get_openai_llm()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.chain = load_summarize_chain(
            llm=self.llm,
            chain_type=chain_type
        )
    
    async def summarize(self, content: str, max_length: int = 200):
        """Summarize content"""
        # Split text into chunks
        docs = self.text_splitter.create_documents([content])
        
        # Summarize
        summary = await self.chain.ainvoke(docs)
        
        # Limit length if needed
        if len(summary["output_text"]) > max_length:
            summary["output_text"] = summary["output_text"][:max_length] + "..."
        
        return summary["output_text"]

