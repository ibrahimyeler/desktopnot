from typing import Optional, List
from elasticsearch import AsyncElasticsearch
from app.core.config import settings


class SearchService:
    def __init__(self):
        self.es_client = AsyncElasticsearch([settings.ELASTICSEARCH_URL])
        self.index_name = "momby_content"
    
    async def search(
        self,
        query: str,
        category: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> dict:
        """Search posts and content using Elasticsearch"""
        search_body = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^2", "content", "excerpt"]
                }
            },
            "from": skip,
            "size": limit
        }
        
        if category:
            search_body["query"] = {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": query,
                                "fields": ["title^2", "content", "excerpt"]
                            }
                        }
                    ],
                    "filter": [
                        {"term": {"category": category}}
                    ]
                }
            }
        
        response = await self.es_client.search(
            index=self.index_name,
            body=search_body
        )
        
        return {
            "query": query,
            "total": response["hits"]["total"]["value"],
            "results": [hit["_source"] for hit in response["hits"]["hits"]]
        }

