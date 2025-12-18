# Gofocus Veritabanı Şeması

## Genel Bakış
Bu dokümantasyon, Gofocus (AI Coach) uygulaması için önerilen veritabanı şemasını içermektedir.

## Tablolar

### 1. users (Kullanıcılar)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    photo_url TEXT,
    auth_provider VARCHAR(50) NOT NULL, -- 'email', 'google', 'apple'
    auth_provider_id VARCHAR(255), -- Google/Apple user ID
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_provider ON users(auth_provider, auth_provider_id);
```

### 2. coaches (Koçlar)
```sql
CREATE TABLE coaches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'finance', 'fitness', 'career', etc.
    description TEXT,
    icon VARCHAR(10), -- Emoji icon
    system_prompt TEXT,
    api_key TEXT, -- Encrypted API key
    model VARCHAR(50) DEFAULT 'gpt-4',
    config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false, -- Varsayılan koçlar için
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_coaches_category ON coaches(category);
```

### 3. conversations (Konuşmalar)
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    title VARCHAR(255),
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_coach_id ON conversations(coach_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
```

### 4. messages (Mesajlar)
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    tokens_used INTEGER,
    model_used VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 5. goals (Hedefler)
```sql
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'finance', 'fitness', etc.
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50), -- 'kg', 'TL', 'saat', etc.
    deadline DATE,
    progress_percentage INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_coach_id ON goals(coach_id);
CREATE INDEX idx_goals_status ON goals(status);
```

### 6. notes (Notlar)
```sql
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    category VARCHAR(50),
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_coach_id ON notes(coach_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
```

### 7. todos (Yapılacaklar)
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high'
    due_date TIMESTAMP,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_coach_id ON todos(coach_id);
CREATE INDEX idx_todos_is_completed ON todos(is_completed);
CREATE INDEX idx_todos_due_date ON todos(due_date);
```

### 8. fitness_workouts (Fitness Antrenmanlar)
```sql
CREATE TABLE fitness_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workout_date DATE NOT NULL,
    workout_type VARCHAR(100), -- 'Üst Vücut', 'Alt Vücut', etc.
    duration_minutes INTEGER,
    calories_burned INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fitness_workouts_user_id ON fitness_workouts(user_id);
CREATE INDEX idx_fitness_workouts_workout_date ON fitness_workouts(workout_date DESC);
```

### 9. fitness_exercises (Fitness Egzersizler)
```sql
CREATE TABLE fitness_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES fitness_workouts(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sets INTEGER,
    reps INTEGER,
    weight DECIMAL(5,2),
    duration_seconds INTEGER,
    rest_seconds INTEGER,
    muscle_group VARCHAR(100),
    notes TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fitness_exercises_workout_id ON fitness_exercises(workout_id);
```

### 10. fitness_progress (Fitness İlerleme)
```sql
CREATE TABLE fitness_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    measurement_date DATE NOT NULL,
    weight_kg DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass_kg DECIMAL(5,2),
    measurements JSONB, -- {chest: 98, waist: 84, arms: 32, etc.}
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fitness_progress_user_id ON fitness_progress(user_id);
CREATE INDEX idx_fitness_progress_measurement_date ON fitness_progress(measurement_date DESC);
```

### 11. fitness_nutrition (Fitness Beslenme)
```sql
CREATE TABLE fitness_nutrition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL,
    meal_type VARCHAR(50), -- 'breakfast', 'lunch', 'dinner', 'snack'
    meal_time TIME,
    calories INTEGER,
    protein_g DECIMAL(6,2),
    carbs_g DECIMAL(6,2),
    fat_g DECIMAL(6,2),
    foods JSONB, -- Array of food items
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fitness_nutrition_user_id ON fitness_nutrition(user_id);
CREATE INDEX idx_fitness_nutrition_meal_date ON fitness_nutrition(meal_date DESC);
```

### 12. software_projects (Yazılım Projeleri)
```sql
CREATE TABLE software_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tech_stack TEXT[], -- ['React', 'TypeScript', 'Node.js']
    github_url TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'paused', 'archived'
    progress_percentage INTEGER DEFAULT 0,
    start_date DATE,
    end_date DATE,
    metadata JSONB DEFAULT '{}', -- Commits, stars, forks, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_software_projects_user_id ON software_projects(user_id);
CREATE INDEX idx_software_projects_status ON software_projects(status);
```

### 13. software_skills (Yazılım Becerileri)
```sql
CREATE TABLE software_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    technology VARCHAR(100) NOT NULL, -- 'React', 'Flutter', 'Go', 'Python', etc.
    proficiency_percentage INTEGER DEFAULT 0,
    category VARCHAR(50), -- 'frontend', 'backend', 'mobile', 'ai', etc.
    years_of_experience DECIMAL(3,1),
    last_used_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, technology)
);

CREATE INDEX idx_software_skills_user_id ON software_skills(user_id);
CREATE INDEX idx_software_skills_technology ON software_skills(technology);
```

### 14. learning_resources (Öğrenme Kaynakları)
```sql
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    resource_type VARCHAR(50), -- 'course', 'video', 'article', 'book', 'podcast'
    category VARCHAR(50),
    url TEXT,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'abandoned'
    progress_percentage INTEGER DEFAULT 0,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_learning_resources_user_id ON learning_resources(user_id);
CREATE INDEX idx_learning_resources_coach_id ON learning_resources(coach_id);
CREATE INDEX idx_learning_resources_status ON learning_resources(status);
```

### 15. finance_transactions (Finans İşlemleri)
```sql
CREATE TABLE finance_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'investment', 'savings'
    category VARCHAR(100),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    description TEXT,
    transaction_date DATE NOT NULL,
    payment_method VARCHAR(50),
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_finance_transactions_user_id ON finance_transactions(user_id);
CREATE INDEX idx_finance_transactions_date ON finance_transactions(transaction_date DESC);
CREATE INDEX idx_finance_transactions_type ON finance_transactions(transaction_type);
```

### 16. finance_portfolio (Finans Portföy)
```sql
CREATE TABLE finance_portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'stock', 'crypto', 'bond', 'real_estate', etc.
    asset_name VARCHAR(255) NOT NULL,
    symbol VARCHAR(50),
    quantity DECIMAL(12,4),
    average_price DECIMAL(10,2),
    current_price DECIMAL(10,2),
    total_value DECIMAL(12,2),
    profit_loss DECIMAL(10,2),
    profit_loss_percentage DECIMAL(5,2),
    last_updated TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_finance_portfolio_user_id ON finance_portfolio(user_id);
CREATE INDEX idx_finance_portfolio_asset_type ON finance_portfolio(asset_type);
```

### 17. analytics (Analitik)
```sql
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'coach_interaction', 'goal_created', 'workout_completed', etc.
    event_category VARCHAR(50),
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created_at ON analytics(created_at);
```

### 18. user_settings (Kullanıcı Ayarları)
```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    theme VARCHAR(20) DEFAULT 'system', -- 'light', 'dark', 'system'
    language VARCHAR(10) DEFAULT 'tr',
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

## İlişkiler Özeti

```
users (1) ──── (N) coaches
users (1) ──── (N) conversations
users (1) ──── (N) goals
users (1) ──── (N) notes
users (1) ──── (N) todos
users (1) ──── (N) fitness_workouts
users (1) ──── (N) fitness_progress
users (1) ──── (N) fitness_nutrition
users (1) ──── (N) software_projects
users (1) ──── (N) software_skills
users (1) ──── (N) learning_resources
users (1) ──── (N) finance_transactions
users (1) ──── (N) finance_portfolio
users (1) ──── (N) analytics
users (1) ──── (1) user_settings

coaches (1) ──── (N) conversations
coaches (1) ──── (N) goals
coaches (1) ──── (N) notes
coaches (1) ──── (N) todos
coaches (1) ──── (N) learning_resources

conversations (1) ──── (N) messages

fitness_workouts (1) ──── (N) fitness_exercises
```

## Notlar ve Öneriler

### Güvenlik
- Hassas veriler (API keys, finansal bilgiler) şifreli saklanmalı
- `auth_provider_id` unique constraint eklenebilir
- Soft delete için `deleted_at` kolonu eklenebilir

### Performans
- Sık sorgulanan kolonlar için indexler eklendi
- JSONB kolonları için GIN indexler eklenebilir
- Partitioning düşünülebilir (messages, analytics gibi büyük tablolar için)

### Ölçeklenebilirlik
- Read replicas için hazır
- Cache stratejisi önerilir (Redis, vb.)
- File storage için S3 benzeri çözüm kullanılmalı

### 19. langchain_chains (LangChain Zincirleri)
```sql
CREATE TABLE langchain_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    chain_name VARCHAR(255) NOT NULL,
    chain_type VARCHAR(100), -- 'sequential', 'parallel', 'conditional', 'custom'
    description TEXT,
    chain_config JSONB NOT NULL, -- LangChain chain configuration
    tools TEXT[], -- Array of tool names
    memory_config JSONB DEFAULT '{}', -- Conversation memory settings
    variables JSONB DEFAULT '{}', -- Input variables
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_chains_user_id ON langchain_chains(user_id);
CREATE INDEX idx_langchain_chains_coach_id ON langchain_chains(coach_id);
CREATE INDEX idx_langchain_chains_chain_type ON langchain_chains(chain_type);
```

### 20. langchain_tools (LangChain Araçları)
```sql
CREATE TABLE langchain_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    tool_type VARCHAR(100) NOT NULL, -- 'function', 'api', 'database', 'web_search', 'calculator', etc.
    description TEXT,
    tool_config JSONB NOT NULL, -- Tool configuration (API endpoints, function definitions, etc.)
    category VARCHAR(50), -- 'finance', 'fitness', 'software', 'general'
    is_custom BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tool_name)
);

CREATE INDEX idx_langchain_tools_user_id ON langchain_tools(user_id);
CREATE INDEX idx_langchain_tools_tool_type ON langchain_tools(tool_type);
CREATE INDEX idx_langchain_tools_category ON langchain_tools(category);
```

### 21. langchain_memory (LangChain Bellek)
```sql
CREATE TABLE langchain_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    memory_type VARCHAR(50) NOT NULL, -- 'conversation_buffer', 'summary', 'entity', 'vector_store'
    memory_data JSONB NOT NULL, -- Stored memory content
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_memory_user_id ON langchain_memory(user_id);
CREATE INDEX idx_langchain_memory_coach_id ON langchain_memory(coach_id);
CREATE INDEX idx_langchain_memory_conversation_id ON langchain_memory(conversation_id);
CREATE INDEX idx_langchain_memory_type ON langchain_memory(memory_type);
```

### 22. langchain_agents (LangChain Ajanları)
```sql
CREATE TABLE langchain_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    agent_name VARCHAR(255) NOT NULL,
    agent_type VARCHAR(100), -- 'zero_shot', 'react', 'plan_and_execute', 'self_ask_with_search'
    system_prompt TEXT,
    tools TEXT[], -- Available tools for this agent
    max_iterations INTEGER DEFAULT 15,
    agent_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_agents_user_id ON langchain_agents(user_id);
CREATE INDEX idx_langchain_agents_coach_id ON langchain_agents(coach_id);
```

### 23. langchain_vector_stores (LangChain Vektör Depoları)
```sql
CREATE TABLE langchain_vector_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    store_name VARCHAR(255) NOT NULL,
    store_type VARCHAR(100), -- 'pinecone', 'weaviate', 'chroma', 'faiss', 'qdrant'
    embedding_model VARCHAR(100), -- 'text-embedding-ada-002', 'sentence-transformers', etc.
    collection_name VARCHAR(255),
    metadata JSONB DEFAULT '{}', -- Connection info, dimensions, etc.
    document_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_vector_stores_user_id ON langchain_vector_stores(user_id);
CREATE INDEX idx_langchain_vector_stores_coach_id ON langchain_vector_stores(coach_id);
```

### 24. langchain_documents (LangChain Belgeleri)
```sql
CREATE TABLE langchain_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vector_store_id UUID REFERENCES langchain_vector_stores(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- Document metadata (source, author, date, etc.)
    embedding_vector VECTOR(1536), -- Embedding vector (dimension depends on model)
    chunk_index INTEGER,
    page_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_documents_vector_store_id ON langchain_documents(vector_store_id);
-- Note: Vector similarity search indexes should be created based on vector store type
```

### 25. langchain_executions (LangChain Çalıştırmaları)
```sql
CREATE TABLE langchain_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    chain_id UUID REFERENCES langchain_chains(id) ON DELETE SET NULL,
    agent_id UUID REFERENCES langchain_agents(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    execution_type VARCHAR(50), -- 'chain', 'agent', 'tool'
    input_data JSONB NOT NULL,
    output_data JSONB,
    intermediate_steps JSONB, -- Agent reasoning steps
    tokens_used INTEGER,
    execution_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'failed', 'cancelled'
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_langchain_executions_user_id ON langchain_executions(user_id);
CREATE INDEX idx_langchain_executions_chain_id ON langchain_executions(chain_id);
CREATE INDEX idx_langchain_executions_agent_id ON langchain_executions(agent_id);
CREATE INDEX idx_langchain_executions_conversation_id ON langchain_executions(conversation_id);
CREATE INDEX idx_langchain_executions_status ON langchain_executions(status);
```

### 26. langchain_retrievers (LangChain Retrievers)
```sql
CREATE TABLE langchain_retrievers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vector_store_id UUID REFERENCES langchain_vector_stores(id) ON DELETE CASCADE,
    retriever_type VARCHAR(100), -- 'similarity', 'mmr', 'contextual', 'time_weighted'
    retriever_config JSONB DEFAULT '{}', -- k, fetch_k, lambda_mult, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_langchain_retrievers_user_id ON langchain_retrievers(user_id);
CREATE INDEX idx_langchain_retrievers_vector_store_id ON langchain_retrievers(vector_store_id);
```

## LangChain Özel İlişkiler

```
users (1) ──── (N) langchain_chains
users (1) ──── (N) langchain_tools
users (1) ──── (N) langchain_memory
users (1) ──── (N) langchain_agents
users (1) ──── (N) langchain_vector_stores
users (1) ──── (N) langchain_executions
users (1) ──── (N) langchain_retrievers

coaches (1) ──── (N) langchain_chains
coaches (1) ──── (N) langchain_memory
coaches (1) ──── (N) langchain_agents
coaches (1) ──── (N) langchain_vector_stores

conversations (1) ──── (N) langchain_memory
conversations (1) ──── (N) langchain_executions

langchain_vector_stores (1) ──── (N) langchain_documents
langchain_vector_stores (1) ──── (N) langchain_retrievers
```

## LangChain Özel Notlar

### Backend Entegrasyonu
- LangChain Python/JavaScript ile backend'de çalışmalı
- Flutter uygulaması LangChain API'ye HTTP istekleri göndermeli
- REST veya GraphQL API kullanılabilir

### Önerilen LangChain Araçları
- **Finance**: Stock price lookup, currency converter, financial calculator
- **Fitness**: Calorie calculator, workout planner, nutrition analyzer
- **Software**: Code executor, documentation searcher, API tester
- **General**: Web search, database query, calculator, calendar

### Vector Store Seçimi
- **Pinecone**: Managed, scalable, production-ready
- **Weaviate**: Self-hosted, flexible
- **Chroma**: Lightweight, easy setup
- **FAISS**: Local, fast (for smaller datasets)

### Eksik Olabilecek Özellikler
- Community/forum özellikleri için ayrı tablolar
- Subscription/premium özellikler için `subscriptions` tablosu
- Push notification tokens için `device_tokens` tablosu
- Social features için `friends`, `follows` tabloları
- LangChain streaming responses için `langchain_streams` tablosu
- LangChain callback handlers için `langchain_callbacks` tablosu

