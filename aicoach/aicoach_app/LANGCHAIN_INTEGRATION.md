# LangChain Entegrasyonu

Bu dokümantasyon, Gofocus uygulamasında LangChain entegrasyonunun nasıl yapılacağını açıklar.

## Genel Bakış

LangChain, Flutter uygulamasında doğrudan çalışmaz. LangChain Python veya JavaScript backend'de çalışmalı ve Flutter uygulaması HTTP API üzerinden iletişim kurmalıdır.

## Mimari

```
Flutter App → HTTP API → LangChain Backend (Python/Node.js)
```

## Backend API Endpoint'leri

LangChain backend'iniz şu endpoint'leri sağlamalıdır:

### 1. Chat Endpoint
```http
POST /api/langchain/chat
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": "What is React?"}
  ],
  "model": "gpt-4",
  "system": "You are a helpful assistant",
  "tools": ["web_search", "calculator"],
  "memory_type": "conversation_buffer"
}

Response:
{
  "response": "React is a JavaScript library...",
  "tokens_used": 150,
  "execution_time_ms": 1200
}
```

### 2. Chain Execution
```http
POST /api/langchain/chains/{chain_id}/run
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "inputs": {
    "question": "What is the weather in Istanbul?",
    "user_id": "123"
  }
}

Response:
{
  "output": "...",
  "intermediate_steps": [...],
  "tokens_used": 200
}
```

### 3. Agent Run
```http
POST /api/langchain/agents/{agent_id}/run
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "query": "Search for latest AI news and summarize top 3",
  "tools": ["web_search", "summarizer"]
}

Response:
{
  "output": "...",
  "intermediate_steps": [
    {
      "tool": "web_search",
      "input": "...",
      "output": "..."
    }
  ],
  "tokens_used": 500
}
```

### 4. Vector Store Search
```http
GET /api/langchain/vector-stores/{store_id}/search?query=react&k=5
Authorization: Bearer <api_key>

Response:
{
  "results": [
    {
      "content": "...",
      "metadata": {...},
      "score": 0.95
    }
  ]
}
```

### 5. Health Check
```http
GET /api/langchain/health
Authorization: Bearer <api_key>

Response:
{
  "status": "healthy",
  "version": "0.1.0"
}
```

### 6. Available Models
```http
GET /api/langchain/models
Authorization: Bearer <api_key>

Response:
{
  "models": [
    "gpt-4",
    "gpt-3.5-turbo",
    "claude-3-opus",
    "claude-3-sonnet",
    "gemini-pro"
  ]
}
```

## Backend Örnekleri

### Python FastAPI Örneği

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from langchain.chains import LLMChain
from langchain.agents import initialize_agent
from langchain.memory import ConversationBufferMemory
from langchain.llms import OpenAI

app = FastAPI()
security = HTTPBearer()

class ChatRequest(BaseModel):
    messages: list
    model: str = "gpt-4"
    system: str = None
    tools: list = []
    memory_type: str = "conversation_buffer"

class ChatResponse(BaseModel):
    response: str
    tokens_used: int
    execution_time_ms: int

@app.post("/api/langchain/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    # Validate API key
    api_key = credentials.credentials
    if not validate_api_key(api_key):
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    # Initialize LLM
    llm = OpenAI(temperature=0.7, openai_api_key=request.model)
    
    # Initialize memory
    memory = ConversationBufferMemory()
    for msg in request.messages[:-1]:
        if msg["role"] == "user":
            memory.chat_memory.add_user_message(msg["content"])
        else:
            memory.chat_memory.add_ai_message(msg["content"])
    
    # Generate response
    import time
    start_time = time.time()
    response = llm(request.messages[-1]["content"])
    execution_time = int((time.time() - start_time) * 1000)
    
    return ChatResponse(
        response=response,
        tokens_used=estimate_tokens(response),
        execution_time_ms=execution_time
    )

@app.get("/api/langchain/health")
async def health(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return {"status": "healthy", "version": "0.1.0"}
```

### Node.js Express Örneği

```javascript
const express = require('express');
const { ChatOpenAI } = require('langchain/chat_models/openai');
const { ConversationChain } = require('langchain/chains');
const { BufferMemory } = require('langchain/memory');

const app = express();
app.use(express.json());

function authenticate(req, res, next) {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  if (!validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  req.apiKey = apiKey;
  next();
}

app.post('/api/langchain/chat', authenticate, async (req, res) => {
  const { messages, model, system, tools } = req.body;
  
  const llm = new ChatOpenAI({
    modelName: model || 'gpt-4',
    temperature: 0.7,
  });
  
  const memory = new BufferMemory();
  // Add conversation history to memory
  
  const chain = new ConversationChain({ llm, memory });
  
  const startTime = Date.now();
  const response = await chain.call({
    input: messages[messages.length - 1].content,
  });
  const executionTime = Date.now() - startTime;
  
  res.json({
    response: response.response,
    tokens_used: estimateTokens(response),
    execution_time_ms: executionTime,
  });
});

app.get('/api/langchain/health', authenticate, (req, res) => {
  res.json({ status: 'healthy', version: '0.1.0' });
});
```

## Flutter Entegrasyonu

### LangChain Provider Kullanımı

```dart
import 'package:provider/provider.dart';
import '../services/langchain_provider.dart';

// LangChain provider oluştur
final langchainProvider = LangChainProvider(
  apiKey: 'your-api-key',
  baseUrl: 'https://your-backend.com/api/langchain',
);

// Chat mesajı gönder
final response = await langchainProvider.sendMessage(
  message: 'What is React?',
  conversationHistory: messages,
  modelId: 'gpt-4',
  additionalParams: {
    'system': 'You are a software development coach',
    'tools': ['web_search', 'code_executor'],
  },
);

// Chain çalıştır
final result = await langchainProvider.executeChain(
  chainId: 'financial-analysis-chain',
  inputs: {
    'user_query': 'Analyze my portfolio',
    'user_id': '123',
  },
);

// Agent çalıştır
final agentResult = await langchainProvider.runAgent(
  agentId: 'fitness-coach-agent',
  query: 'Create a workout plan for me',
  tools: ['workout_planner', 'nutrition_calculator'],
);

// Vector store'da arama yap
final searchResults = await langchainProvider.searchVectorStore(
  vectorStoreId: 'knowledge-base',
  query: 'React hooks',
  k: 5,
);
```

### Koç Servisinde Kullanım

```dart
// CoachService içinde
AIProvider? getProviderForCoach(Coach coach) {
  final apiKey = coach.config['apiKey'] as String? ?? '';
  final providerType = coach.config['provider'] as String? ?? 'openai';
  
  if (providerType == 'langchain') {
    final baseUrl = coach.config['baseUrl'] as String? ?? 
                    'http://localhost:8000/api/langchain';
    return LangChainProvider(apiKey: apiKey, baseUrl: baseUrl);
  }
  
  // Diğer provider'lar...
}
```

## Önerilen LangChain Araçları

### Finance Coach için
- `stock_price_lookup`: Hisseler için fiyat sorgulama
- `currency_converter`: Döviz çevirme
- `financial_calculator`: Finansal hesaplamalar
- `news_aggregator`: Finansal haberler

### Fitness Coach için
- `calorie_calculator`: Kalori hesaplama
- `workout_planner`: Antrenman planı oluşturma
- `nutrition_analyzer`: Beslenme analizi
- `progress_tracker`: İlerleme takibi

### Software Coach için
- `code_executor`: Kod çalıştırma
- `documentation_searcher`: Dokümantasyon arama
- `api_tester`: API test etme
- `code_reviewer`: Kod inceleme

### Genel
- `web_search`: Web arama
- `calculator`: Hesaplama
- `calendar`: Takvim işlemleri
- `database_query`: Veritabanı sorgulama

## Vector Store Kurulumu

### Pinecone Örneği
```python
from langchain.vectorstores import Pinecone
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vectorstore = Pinecone.from_existing_index(
    index_name="gofocus-knowledge",
    embedding=embeddings
)
```

### Chroma Örneği
```python
from langchain.vectorstores import Chroma

vectorstore = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings
)
```

## Güvenlik

1. **API Key Yönetimi**: API key'ler şifrelenmiş olarak saklanmalı
2. **Rate Limiting**: API endpoint'lerinde rate limiting uygulanmalı
3. **Input Validation**: Tüm input'lar validate edilmeli
4. **Error Handling**: Hassas bilgiler error mesajlarında gösterilmemeli

## Performans

1. **Caching**: Sık kullanılan sorgular cache'lenmeli (Redis)
2. **Async Processing**: Uzun süren işlemler async yapılmalı
3. **Connection Pooling**: Veritabanı bağlantıları pool edilmeli
4. **Monitoring**: Execution time ve token kullanımı loglanmalı

## Test Etme

```bash
# Backend'i başlat
cd backend
python -m uvicorn main:app --reload

# Flutter uygulamasını çalıştır
flutter run

# Test endpoint'lerini kontrol et
curl -X GET http://localhost:8000/api/langchain/health \
  -H "Authorization: Bearer your-api-key"
```

## Sonraki Adımlar

1. Backend API'yi kurun (Python FastAPI veya Node.js Express)
2. LangChain zincirlerini ve agent'ları oluşturun
3. Vector store'u yapılandırın
4. Tool'ları implement edin
5. Flutter uygulamasında LangChain provider'ı test edin

