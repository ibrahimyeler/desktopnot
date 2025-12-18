from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from app.core.llm.openai_client import get_openai_llm
from app.services.vector_store import get_vector_store
import json


RECOMMENDATION_PROMPT = """
Kullanıcı profili: {user_profile}
İçerik geçmişi: {content_history}
Hamilelik haftası: {week}

Bu kullanıcı için en uygun 5 içerik öner. 
Sadece JSON formatında cevap ver:
{{
    "recommendations": [
        {{
            "id": "content-id",
            "title": "Content Title",
            "reason": "Why this is recommended"
        }}
    ]
}}
"""


class RecommendationChain:
    def __init__(self, llm=None):
        self.llm = llm or get_openai_llm()
        self.vector_store = get_vector_store()
        self.prompt = PromptTemplate(
            input_variables=["user_profile", "content_history", "week"],
            template=RECOMMENDATION_PROMPT
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)
    
    async def get_recommendations(
        self,
        user_profile: dict,
        content_history: list,
        week: int = None
    ):
        """Get personalized content recommendations"""
        result = await self.chain.ainvoke({
            "user_profile": json.dumps(user_profile),
            "content_history": json.dumps(content_history),
            "week": week or 0
        })
        
        try:
            recommendations = json.loads(result["text"])
            return recommendations
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {"recommendations": []}

