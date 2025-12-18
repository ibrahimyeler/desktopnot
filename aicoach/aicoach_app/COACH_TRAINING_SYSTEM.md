# 🎓 Kapsamlı Koç Eğitim Sistemi - Rehber

Bu dokümantasyon, AI Coach uygulamanızda profesyonel seviyede koç eğitimi için kullanabileceğiniz tüm yöntemleri ve teknolojileri detaylı olarak açıklar.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Eğitim Yöntemleri Karşılaştırması](#eğitim-yöntemleri-karşılaştırması)
3. [1. RAG (Retrieval Augmented Generation)](#1-rag-retrieval-augmented-generation)
4. [2. Fine-Tuning](#2-fine-tuning)
5. [3. LangChain Agents & Chains](#3-langchain-agents--chains)
6. [4. Few-Shot Learning](#4-few-shot-learning)
7. [5. Multi-Agent Systems](#5-multi-agent-systems)
8. [6. Knowledge Base & Vector Database](#6-knowledge-base--vector-database)
9. [7. Hybrid Approach (Önerilen)](#7-hybrid-approach-önerilen)
10. [Implementasyon Rehberi](#implementasyon-rehberi)
11. [Maliyet Analizi](#maliyet-analizi)
12. [Performans Optimizasyonu](#performans-optimizasyonu)

---

## 🎯 Genel Bakış

### Mevcut Durum
- ✅ Basit `systemPrompt` yapısı
- ✅ OpenAI provider entegrasyonu
- ✅ LangChain hazırlığı (tam implement edilmemiş)
- ⚠️ Eğitim sistemi eksik

### Hedef
- 🎯 Profesyonel seviyede koç eğitimi
- 🎯 Domain-specific bilgi entegrasyonu
- 🎯 Dinamik öğrenme ve adaptasyon
- 🎯 Çoklu veri kaynağı desteği
- 🎯 Kişiselleştirilmiş koçluk deneyimi

---

## 📊 Eğitim Yöntemleri Karşılaştırması

| Yöntem | Karmaşıklık | Maliyet | Hız | Kalite | Kullanım Durumu |
|--------|-------------|---------|-----|--------|-----------------|
| **RAG** | ⭐⭐ | 💰💰 | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ Önerilen |
| **Fine-Tuning** | ⭐⭐⭐⭐ | 💰💰💰💰 | ⚡⚡ | ⭐⭐⭐⭐⭐ | Özel durumlar |
| **LangChain** | ⭐⭐⭐ | 💰💰 | ⚡⚡⚡ | ⭐⭐⭐⭐ | ✅ Önerilen |
| **Few-Shot** | ⭐ | 💰 | ⚡⚡⚡⚡ | ⭐⭐⭐ | Hızlı başlangıç |
| **Multi-Agent** | ⭐⭐⭐⭐⭐ | 💰💰💰 | ⚡⚡ | ⭐⭐⭐⭐⭐ | İleri seviye |
| **Hybrid** | ⭐⭐⭐⭐ | 💰💰💰 | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ✅ En İyi |

---

## 1. RAG (Retrieval Augmented Generation)

### 🎯 Ne İçin Kullanılır?
- Domain-specific bilgi entegrasyonu
- Güncel bilgi erişimi
- Büyük dokümantasyon kullanımı
- Dinamik bilgi güncellemeleri

### ✅ Avantajlar
- ✅ Hızlı implementasyon
- ✅ Güncel bilgi desteği
- ✅ Düşük maliyet
- ✅ Kolay güncelleme
- ✅ Çoklu veri kaynağı

### ❌ Dezavantajlar
- ❌ Context window limiti
- ❌ Embedding kalitesi önemli
- ❌ Vector DB gereksinimi

### 🏗️ Mimari

```
User Query
    ↓
Query Embedding (OpenAI/Cohere)
    ↓
Vector Database Search (Pinecone/Chroma/Qdrant)
    ↓
Retrieve Top K Documents
    ↓
Context + Query → LLM
    ↓
Final Response
```

### 📦 Gerekli Teknolojiler

#### Vector Database Seçenekleri

**1. Pinecone** (Önerilen - Production)
- ✅ Managed service
- ✅ Yüksek performans
- ✅ Kolay entegrasyon
- 💰 Ücretli (free tier var)

**2. Qdrant** (Önerilen - Self-hosted)
- ✅ Open source
- ✅ Yüksek performans
- ✅ Docker desteği
- ✅ Ücretsiz

**3. Chroma** (Development)
- ✅ Kolay kurulum
- ✅ Python/JS desteği
- ⚠️ Production için optimize değil

**4. Weaviate** (Enterprise)
- ✅ GraphQL API
- ✅ Çoklu veri tipi
- 💰 Ücretli

#### Embedding Modelleri

**1. OpenAI `text-embedding-3-large`** (Önerilen)
- ✅ En yüksek kalite
- ✅ 3072 boyut
- 💰 Ücretli

**2. OpenAI `text-embedding-3-small`**
- ✅ İyi kalite
- ✅ 1536 boyut
- 💰 Daha ucuz

**3. Cohere `embed-english-v3.0`**
- ✅ Çoklu dil desteği
- ✅ İyi kalite
- 💰 Ücretli

**4. Sentence Transformers** (Self-hosted)
- ✅ Ücretsiz
- ✅ Offline çalışabilir
- ⚠️ Daha düşük kalite

### 💻 Implementasyon Örneği

#### Backend (Python FastAPI)

```python
from fastapi import FastAPI, HTTPException
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import pinecone

app = FastAPI()

# Initialize embeddings
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# Initialize Pinecone
pinecone.init(api_key="your-api-key", environment="us-east1-gcp")
index_name = "coach-knowledge-base"

# Create vector store
vectorstore = Pinecone.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

# Create QA chain
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(temperature=0.7),
    chain_type="stuff",
    retriever=vectorstore.as_retriever(
        search_kwargs={"k": 5}  # Top 5 documents
    ),
    return_source_documents=True
)

@app.post("/api/coach/rag-query")
async def rag_query(query: str, coach_id: str):
    # Add coach-specific context
    enhanced_query = f"""
    You are a {coach_id} coach. Answer the following question using 
    the provided context and your knowledge:
    
    Question: {query}
    """
    
    result = qa_chain({"query": enhanced_query})
    
    return {
        "answer": result["result"],
        "sources": [
            {
                "content": doc.page_content[:200],
                "metadata": doc.metadata
            }
            for doc in result["source_documents"]
        ]
    }
```

#### Flutter Entegrasyonu

```dart
// lib/services/rag_service.dart
class RAGService {
  final String baseUrl;
  final String apiKey;
  
  RAGService({required this.baseUrl, required this.apiKey});
  
  Future<RAGResponse> query({
    required String query,
    required String coachId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/coach/rag-query'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'query': query,
        'coach_id': coachId,
      }),
    );
    
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return RAGResponse.fromJson(data);
    } else {
      throw Exception('RAG query failed');
    }
  }
}
```

### 📚 Knowledge Base Hazırlama

#### 1. Dokümantasyon Toplama

```python
# knowledge_base_builder.py
import os
from langchain.document_loaders import (
    DirectoryLoader,
    PyPDFLoader,
    TextLoader,
    CSVLoader,
)

def load_documents(directory: str):
    """Load all documents from directory"""
    loaders = {
        '.pdf': PyPDFLoader,
        '.txt': TextLoader,
        '.csv': CSVLoader,
    }
    
    documents = []
    for ext, loader_class in loaders.items():
        loader = DirectoryLoader(
            directory,
            glob=f"**/*{ext}",
            loader_cls=loader_class
        )
        documents.extend(loader.load())
    
    return documents
```

#### 2. Chunking & Embedding

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Pinecone

def build_knowledge_base(documents, index_name="coach-kb"):
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )
    
    chunks = text_splitter.split_documents(documents)
    
    # Create embeddings
    embeddings = OpenAIEmbeddings(model="text-embedding-3-large")
    
    # Store in Pinecone
    vectorstore = Pinecone.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name=index_name
    )
    
    return vectorstore
```

---

## 2. Fine-Tuning

### 🎯 Ne İçin Kullanılır?
- Özel davranış öğrenme
- Domain-specific terminoloji
- Tutarlı stil
- Marka sesi

### ✅ Avantajlar
- ✅ Yüksek kalite
- ✅ Tutarlı çıktı
- ✅ Özel davranış

### ❌ Dezavantajlar
- ❌ Yüksek maliyet
- ❌ Uzun eğitim süresi
- ❌ Güncelleme zorluğu
- ❌ Büyük veri seti gereksinimi

### 📊 Fine-Tuning Süreci

#### 1. Veri Hazırlama

```json
{
  "messages": [
    {
      "role": "system",
      "content": "Sen bir odak ve planlama koçusun..."
    },
    {
      "role": "user",
      "content": "Bugün çok dağınığım, ne yapmalıyım?"
    },
    {
      "role": "assistant",
      "content": "Dağınıklık hissettiğinde, önce nefes al ve dur. Şimdi 3 kritik görevi belirle ve bunlara odaklan. Pomodoro tekniği ile 25 dakika çalış, 5 dakika mola ver..."
    }
  ]
}
```

#### 2. OpenAI Fine-Tuning

```python
import openai

# Prepare training data
training_data = [
    {
        "messages": [
            {"role": "system", "content": "..."},
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."}
        ]
    }
    # ... more examples
]

# Upload training file
with open("training_data.jsonl", "w") as f:
    for item in training_data:
        f.write(json.dumps(item) + "\n")

file_response = openai.File.create(
    file=open("training_data.jsonl", "rb"),
    purpose="fine-tune"
)

# Create fine-tuning job
job = openai.FineTuningJob.create(
    training_file=file_response.id,
    model="gpt-4",  # or "gpt-3.5-turbo"
)

# Check status
status = openai.FineTuningJob.retrieve(job.id)
print(status.status)  # "running", "succeeded", "failed"
```

#### 3. Kullanım

```python
# Use fine-tuned model
response = openai.ChatCompletion.create(
    model="ft:gpt-4:your-org:custom-model-id",
    messages=[
        {"role": "user", "content": "..."}
    ]
)
```

### 💰 Maliyet Tahmini

- **Eğitim:** ~$3-10 per 1K examples (gpt-3.5-turbo)
- **Kullanım:** ~2x normal model fiyatı
- **Örnek:** 10K examples → ~$30-100 eğitim + kullanım maliyeti

---

## 3. LangChain Agents & Chains

### 🎯 Ne İçin Kullanılır?
- Kompleks görevler
- Araç kullanımı
- Dinamik karar verme
- Multi-step işlemler

### 🏗️ Agent Tipleri

#### 1. ReAct Agent (Önerilen)

```python
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
from langchain.llms import OpenAI

# Define tools
tools = [
    Tool(
        name="Pomodoro Timer",
        func=lambda x: start_pomodoro(x),
        description="Start a pomodoro timer for X minutes"
    ),
    Tool(
        name="Task Creator",
        func=lambda x: create_task(x),
        description="Create a new task with description"
    ),
    Tool(
        name="Calendar Check",
        func=lambda x: check_calendar(x),
        description="Check calendar for date"
    ),
]

# Initialize agent
agent = initialize_agent(
    tools=tools,
    llm=OpenAI(temperature=0.7),
    agent=AgentType.REACT_DOCSTORE,
    verbose=True
)

# Use agent
response = agent.run(
    "Bugün 3 saat odaklanmak istiyorum. "
    "Bana bir plan hazırla ve pomodoro başlat."
)
```

#### 2. Custom Chain

```python
from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate

# Chain 1: Analyze user goal
goal_analysis_prompt = PromptTemplate(
    input_variables=["user_query"],
    template="""
    Analyze the user's goal and extract:
    1. Main objective
    2. Time available
    3. Priority level
    
    User query: {user_query}
    """
)

goal_chain = LLMChain(
    llm=OpenAI(),
    prompt=goal_analysis_prompt
)

# Chain 2: Create plan
plan_creation_prompt = PromptTemplate(
    input_variables=["goal_analysis"],
    template="""
    Based on this analysis, create a detailed plan:
    
    {goal_analysis}
    """
)

plan_chain = LLMChain(
    llm=OpenAI(),
    prompt=plan_creation_prompt
)

# Combine chains
overall_chain = SimpleSequentialChain(
    chains=[goal_chain, plan_chain],
    verbose=True
)

# Execute
result = overall_chain.run("Bugün 3 saat odaklanmak istiyorum")
```

### 💻 Flutter Entegrasyonu

```dart
// lib/services/langchain_agent_service.dart
class LangChainAgentService {
  Future<String> runAgent({
    required String query,
    required String coachId,
    List<String> tools = const [],
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/langchain/agents/run'),
      headers: {
        'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'query': query,
        'coach_id': coachId,
        'tools': tools,
      }),
    );
    
    final data = jsonDecode(response.body);
    return data['output'];
  }
}
```

---

## 4. Few-Shot Learning

### 🎯 Ne İçin Kullanılır?
- Hızlı prototipleme
- Küçük veri setleri
- Hızlı iterasyon
- Düşük maliyet

### 💻 Implementasyon

```python
# Few-shot examples
few_shot_examples = """
Example 1:
User: "Bugün çok dağınığım"
Coach: "Dağınıklık hissettiğinde, önce dur ve nefes al. Şimdi 3 kritik görevi belirle ve bunlara odaklan. Pomodoro tekniği ile başla."

Example 2:
User: "Motivasyonum düşük"
Coach: "Motivasyon düşük olduğunda, küçük bir başarı ile başla. 5 dakikalık bir görev tamamla ve momentum kazan. Başarılarını görselleştir."

Example 3:
User: "Zamanımı yönetemiyorum"
Coach: "Zaman yönetimi için önce zamanını nasıl harcadığını analiz et. Sonra zaman bloklama tekniği kullan. Önemli görevleri sabah saatlerine planla."
"""

system_prompt = f"""
Sen bir odak ve planlama koçusun. Aşağıdaki örnekleri takip ederek kullanıcıya yardımcı ol:

{few_shot_examples}

Şimdi kullanıcının sorusuna benzer şekilde cevap ver.
"""
```

---

## 5. Multi-Agent Systems

### 🎯 Ne İçin Kullanılır?
- Kompleks problemler
- Uzmanlaşmış agent'lar
- Paralel işlemler
- Yüksek kalite

### 🏗️ Mimari

```
User Query
    ↓
Orchestrator Agent
    ↓
    ├─→ Focus Coach Agent
    ├─→ Planning Agent
    ├─→ Motivation Agent
    └─→ Analytics Agent
    ↓
Response Aggregator
    ↓
Final Response
```

### 💻 Implementasyon

```python
from langchain.agents import AgentExecutor
from langchain.agents import create_openai_functions_agent

# Focus Coach Agent
focus_coach_prompt = """
You are a focus coach. Help users improve their focus and concentration.
"""

focus_agent = create_openai_functions_agent(
    llm=OpenAI(),
    tools=focus_tools,
    prompt=focus_coach_prompt
)

# Planning Agent
planning_agent_prompt = """
You are a planning expert. Create detailed plans and schedules.
"""

planning_agent = create_openai_functions_agent(
    llm=OpenAI(),
    tools=planning_tools,
    prompt=planning_agent_prompt
)

# Orchestrator
orchestrator_prompt = """
You are an orchestrator. Route user queries to the appropriate agent:
- Focus questions → Focus Coach Agent
- Planning questions → Planning Agent
- General questions → Use all agents and combine responses
"""

# Execute
def route_query(query):
    # Determine which agent(s) to use
    if "odak" in query.lower():
        return focus_agent.run(query)
    elif "plan" in query.lower():
        return planning_agent.run(query)
    else:
        # Use multiple agents
        focus_response = focus_agent.run(query)
        planning_response = planning_agent.run(query)
        return combine_responses(focus_response, planning_response)
```

---

## 6. Knowledge Base & Vector Database

### 📚 Knowledge Base İçeriği

#### Koç Türlerine Göre Bilgi Kaynakları

**Focus & Planning Coach:**
- Pomodoro tekniği dokümantasyonu
- Zaman yönetimi metodolojileri
- Odaklanma teknikleri
- Görev önceliklendirme stratejileri

**English Coach:**
- Gramer kuralları
- Kelime listeleri
- Konuşma pratiği senaryoları
- Kültürel notlar

**Finance Coach:**
- Finansal kavramlar
- Yatırım stratejileri
- Bütçe yönetimi teknikleri
- Finansal haberler (RSS feed)

### 🔧 Vector Database Kurulumu

#### Qdrant (Önerilen - Self-hosted)

```bash
# Docker ile kurulum
docker run -p 6333:6333 qdrant/qdrant

# Python client
pip install qdrant-client
```

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

client = QdrantClient(host="localhost", port=6333)

# Create collection
client.create_collection(
    collection_name="coach-knowledge",
    vectors_config=VectorParams(
        size=1536,  # OpenAI embedding size
        distance=Distance.COSINE
    )
)
```

---

## 7. Hybrid Approach (Önerilen)

### 🎯 Kapsamlı Çözüm

**Tüm yöntemleri birleştiren hibrit yaklaşım:**

```
User Query
    ↓
Query Router (LangChain Agent)
    ↓
    ├─→ Simple Query → Few-Shot Learning
    ├─→ Domain Query → RAG (Vector DB)
    ├─→ Complex Query → Multi-Agent System
    └─→ Specialized → Fine-Tuned Model
    ↓
Response Combiner
    ↓
Final Response
```

### 🏗️ Mimari

```python
class HybridCoachSystem:
    def __init__(self):
        self.rag_service = RAGService()
        self.fine_tuned_model = "ft:gpt-4:..."
        self.few_shot_prompts = FewShotPrompts()
        self.agent_system = MultiAgentSystem()
    
    async def query(self, user_query: str, coach_id: str):
        # 1. Classify query complexity
        complexity = await self.classify_query(user_query)
        
        # 2. Route to appropriate system
        if complexity == "simple":
            return await self.few_shot_prompts.answer(user_query)
        elif complexity == "domain_specific":
            return await self.rag_service.query(user_query, coach_id)
        elif complexity == "complex":
            return await self.agent_system.run(user_query)
        else:
            # Use fine-tuned model
            return await self.fine_tuned_model.generate(user_query)
```

---

## 💻 Implementasyon Rehberi

### Adım 1: Vector Database Kurulumu

```bash
# Qdrant kurulumu
docker run -p 6333:6333 qdrant/qdrant

# Pinecone (cloud)
# https://www.pinecone.io/ - Sign up
```

### Adım 2: Backend API Oluşturma

```bash
# Python FastAPI projesi
mkdir coach-training-backend
cd coach-training-backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn langchain openai qdrant-client
```

### Adım 3: Knowledge Base Hazırlama

```python
# knowledge_base_builder.py
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from qdrant_client import QdrantClient

def build_knowledge_base():
    # 1. Load documents
    loader = DirectoryLoader("./knowledge_base", glob="**/*.md")
    documents = loader.load()
    
    # 2. Split into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    
    # 3. Create embeddings
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    
    # 4. Store in Qdrant
    client = QdrantClient(host="localhost", port=6333)
    
    for i, chunk in enumerate(chunks):
        embedding = embeddings.embed_query(chunk.page_content)
        client.upsert(
            collection_name="coach-knowledge",
            points=[{
                "id": i,
                "vector": embedding,
                "payload": {
                    "content": chunk.page_content,
                    "source": chunk.metadata.get("source", ""),
                }
            }]
        )
```

### Adım 4: Flutter Entegrasyonu

```dart
// lib/services/hybrid_coach_service.dart
class HybridCoachService {
  final RAGService _ragService;
  final LangChainService _langChainService;
  
  Future<String> query({
    required String query,
    required String coachId,
  }) async {
    // Determine query type
    final queryType = await _classifyQuery(query);
    
    switch (queryType) {
      case QueryType.simple:
        return await _fewShotAnswer(query, coachId);
      case QueryType.domainSpecific:
        return await _ragService.query(query: query, coachId: coachId);
      case QueryType.complex:
        return await _langChainService.runAgent(
          query: query,
          coachId: coachId,
        );
    }
  }
}
```

---

## 💰 Maliyet Analizi

### RAG Yaklaşımı
- **Embedding:** ~$0.0001 per 1K tokens
- **Vector DB:** Qdrant (ücretsiz) veya Pinecone ($70/ay)
- **LLM:** Normal API fiyatları
- **Toplam:** ~$50-200/ay (orta kullanım)

### Fine-Tuning Yaklaşımı
- **Eğitim:** $3-10 per 1K examples
- **Kullanım:** 2x normal model fiyatı
- **Toplam:** ~$200-500/ay (orta kullanım)

### Hybrid Yaklaşım
- **RAG:** $50-200/ay
- **Fine-Tuning:** $100-300/ay (sadece özel koçlar için)
- **LangChain:** $50-100/ay
- **Toplam:** ~$200-600/ay

---

## 🚀 Performans Optimizasyonu

### 1. Caching

```python
from functools import lru_cache
import redis

redis_client = redis.Redis(host='localhost', port=6379)

@lru_cache(maxsize=1000)
def cached_rag_query(query_hash: str):
    # Check Redis first
    cached = redis_client.get(query_hash)
    if cached:
        return json.loads(cached)
    
    # Execute RAG query
    result = rag_query(query)
    
    # Cache for 1 hour
    redis_client.setex(query_hash, 3600, json.dumps(result))
    return result
```

### 2. Async Processing

```python
import asyncio
from langchain.async_llms import AsyncOpenAI

async def parallel_queries(queries):
    tasks = [rag_query(q) for q in queries]
    return await asyncio.gather(*tasks)
```

### 3. Batch Embedding

```python
# Batch embeddings (daha ucuz)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
batch_embeddings = embeddings.embed_documents(texts)  # Batch işlem
```

---

## 📋 Önerilen Yaklaşım

### 🎯 Kısa Vadeli (1-2 Hafta)
1. ✅ **RAG sistemi kurulumu** (Qdrant + OpenAI embeddings)
2. ✅ **Knowledge base hazırlama** (Markdown dosyaları)
3. ✅ **Backend API** (FastAPI)
4. ✅ **Flutter entegrasyonu**

### 🎯 Orta Vadeli (1-2 Ay)
1. ✅ **LangChain agents** ekleme
2. ✅ **Few-shot learning** optimizasyonu
3. ✅ **Caching** sistemi
4. ✅ **Performance monitoring**

### 🎯 Uzun Vadeli (3-6 Ay)
1. ✅ **Fine-tuning** (özel koçlar için)
2. ✅ **Multi-agent systems**
3. ✅ **Advanced analytics**
4. ✅ **A/B testing**

---

## 🎓 Sonuç

**En iyi yaklaşım:** **Hybrid System**
- RAG → Domain bilgileri için
- LangChain Agents → Kompleks görevler için
- Few-Shot → Hızlı cevaplar için
- Fine-Tuning → Özel koçlar için (opsiyonel)

Bu yaklaşım ile:
- ✅ Yüksek kaliteli koçluk
- ✅ Güncel bilgi erişimi
- ✅ Esnek ve ölçeklenebilir sistem
- ✅ Makul maliyet

---

**Son Güncelleme:** 2024
**Versiyon:** 1.0.0

