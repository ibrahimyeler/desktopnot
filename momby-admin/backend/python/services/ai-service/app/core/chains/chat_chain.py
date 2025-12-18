from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from app.core.llm.openai_client import get_openai_llm
from app.services.vector_store import get_vector_store
from app.services.prompt_templates import PREGNANCY_ASSISTANT_PROMPT


class ChatChain:
    def __init__(self, user_id: str, llm=None):
        self.user_id = user_id
        self.llm = llm or get_openai_llm()
        self.vector_store = get_vector_store()
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        # Custom prompt template
        self.prompt = PromptTemplate(
            input_variables=["chat_history", "question", "context"],
            template=PREGNANCY_ASSISTANT_PROMPT
        )
        
        # Create chain
        self.chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=self.vector_store.as_retriever(
                search_kwargs={"k": 5}
            ),
            memory=self.memory,
            return_source_documents=True,
            combine_docs_chain_kwargs={"prompt": self.prompt}
        )
    
    async def chat(self, question: str, context: dict = None):
        """Process chat question"""
        result = await self.chain.ainvoke({
            "question": question,
            "chat_history": self.memory.chat_memory.messages
        })
        
        return {
            "answer": result["answer"],
            "sources": [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                }
                for doc in result.get("source_documents", [])
            ]
        }

