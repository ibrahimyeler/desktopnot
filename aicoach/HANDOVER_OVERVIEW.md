# Gofocus AI Coach - Complete Project Handover Document

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Project Status:** Development/Staging  
**Confidentiality:** Internal Use Only

---

## Executive Summary

**Gofocus** is a comprehensive AI-powered personal development coaching platform consisting of:
- **Mobile Application** (Flutter) - Cross-platform iOS/Android app
- **Admin Web Panel** (Next.js 16 + React 19) - Management dashboard
- **Backend Microservices** (Go + Python/FastAPI) - Cloud-native architecture
- **Database Layer** (PostgreSQL + Redis) - Multi-tenant data storage

The platform enables users to create, manage, and interact with AI-powered coaches across multiple domains (finance, fitness, health, career, software development, etc.) using modern LLM providers (OpenAI, Anthropic, Google).

**Key Innovation:** Multi-provider AI aggregation with LangChain integration, comprehensive goal tracking, community features, and specialized coaching workflows.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Project Structure](#project-structure)
3. [Core Components Deep Dive](#core-components-deep-dive)
4. [Third-Party Integrations & API Keys](#third-party-integrations--api-keys)
5. [Security Audit & Vulnerabilities](#security-audit--vulnerabilities)
6. [Developer Onboarding](#developer-onboarding)
7. [Deployment & Infrastructure](#deployment--infrastructure)
8. [Next Steps & Priority Actions](#next-steps--priority-actions)

---

## System Architecture

### Overall Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐           ┌────────────────────────┐  │
│  │ Flutter Mobile  │           │  Next.js Admin Panel  │  │
│  │    (iOS/Android)│           │   (Web Dashboard)      │  │
│  └────────┬────────┘           └───────────┬────────────┘  │
│           │                                │                │
└───────────┼────────────────────────────────┼────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                   API Gateway (Nginx)                       │
│                   Load Balancing & Routing                  │
└─────────────────────────────────────────────────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Microservices Backend                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Service │  │ User Service │  │Coach Service │     │
│  │    (Go)      │  │    (Go)      │  │    (Go)      │     │
│  │   Port:8001  │  │   Port:8002  │  │   Port:8003  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Chat Service  │  │Analytics Svc │  │Community Svc │     │
│  │ (FastAPI)    │  │  (FastAPI)   │  │  (FastAPI)   │     │
│  │  Port:8100   │  │  Port:8200   │  │  Port:8300   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
            │                                │
            ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                  Data Layer                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL Databases                                  │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐        │ │
│  │  │ auth-db    │ │  user-db   │ │ coach-db   │        │ │
│  │  │ Port:5433  │ │ Port:5434  │ │ Port:5435  │        │ │
│  │  └────────────┘ └────────────┘ └────────────┘        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Redis Cache                                           │ │
│  │  Port:6379                                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│              External AI Providers                          │
├─────────────────────────────────────────────────────────────┤
│  OpenAI (GPT-4) | Anthropic (Claude) | Google (Gemini)     │
│  LangChain Backend (Optional)                              │
└─────────────────────────────────────────────────────────────┘
```

### Communication Flow

**Mobile App → Backend:**
- REST API calls via Nginx gateway
- JWT token-based authentication
- Coach-specific AI conversations via Chat Service

**Admin Panel → Backend:**
- Same API endpoints as mobile app
- Enhanced dashboard features
- System monitoring capabilities

**Inter-Service Communication:**
- HTTP/REST (synchronous)
- Redis pub/sub (asynchronous, planned)
- Shared PostgreSQL connections

---

## Project Structure

### Repository Layout

```
aicoach/
├── aicoach_app/                    # Flutter Mobile Application
│   ├── lib/
│   │   ├── main.dart               # App entry point
│   │   ├── models/                 # Data models (Coach, ChatMessage, AIModel)
│   │   ├── screens/                # UI screens (16 screens)
│   │   ├── widgets/                # Reusable UI components (20+ widgets)
│   │   ├── services/               # Business logic & API clients
│   │   └── components/             # Specialized components
│   │       ├── fitness/            # Fitness coach specific UI
│   │       └── software/           # Software coach specific UI
│   ├── assets/                     # Images, fonts
│   ├── android/                    # Android native config
│   ├── ios/                        # iOS native config
│   ├── pubspec.yaml                # Dependencies
│   └── README.md
│
├── aicoach_admin/                  # Next.js Admin Panel
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing → redirects to login
│   │   ├── login/
│   │   │   └── page.tsx            # Admin login
│   │   └── dashboard/
│   │       └── page.tsx            # Main dashboard
│   ├── package.json
│   └── next.config.ts
│
├── backend/                        # Microservices Backend
│   ├── docker-compose.yml          # Orchestration config
│   ├── go-services/
│   │   ├── services/
│   │   │   ├── auth-service/       # Authentication & JWT
│   │   │   ├── user-service/       # User management
│   │   │   └── coach-service/      # Coach CRUD
│   │   └── go.mod
│   ├── fastapi-services/
│   │   ├── services/
│   │   │   ├── chat-service/       # AI chat orchestration
│   │   │   ├── analytics-service/  # Analytics & reporting
│   │   │   └── community-service/  # Community features
│   │   └── requirements.txt
│   └── nginx/                      # Gateway config (missing)
│
└── HANDOVER_OVERVIEW.md            # This document
```

### Technology Stack

#### Frontend (Mobile)
- **Framework:** Flutter 3.9.2+
- **Language:** Dart
- **State Management:** Provider
- **HTTP Client:** http ^1.2.0
- **Storage:** SharedPreferences ^2.2.2
- **Markdown:** flutter_markdown ^0.6.18
- **Auth:** google_sign_in ^6.2.1, sign_in_with_apple ^6.1.3

#### Frontend (Admin)
- **Framework:** Next.js 16.0.1 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4
- **React:** 19.2.0
- **Font:** Geist (Vercel)

#### Backend (Go Services)
- **Language:** Go 1.21
- **Framework:** Gin
- **Database:** PostgreSQL (lib/pq)
- **JWT:** golang-jwt/jwt/v5
- **Crypto:** bcrypt
- **UUID:** google/uuid

#### Backend (Python Services)
- **Framework:** FastAPI 0.104.1
- **ASGI Server:** Uvicorn
- **Database:** SQLAlchemy 2.0, psycopg2
- **LLM Clients:** OpenAI 1.3.5, Anthropic 0.7.8, Google Generative AI
- **Cache:** Redis 5.0.1
- **Validation:** Pydantic 2.5
- **HTTP:** httpx 0.25.2

#### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL 15-alpine (3 instances)
- **Cache:** Redis 7-alpine
- **Gateway:** Nginx Alpine
- **Orchestration:** Docker Compose (Development)

---

## Core Components Deep Dive

### Mobile Application (Flutter)

#### Key Screens

**1. Splash Screen** (`splash_screen.dart`)
- Animated brain logo with glow effects
- Initial data loading
- Navigation to login/main based on auth state

**2. Login Screen** (`login_screen.dart`)
- Email/password authentication
- Google Sign-In integration
- Apple Sign-In (iOS only)
- Modern gradient design with brain-themed branding

**3. Main Screen** (`main_screen.dart`)
- Bottom navigation bar with 6 sections
- IndexedStack for state preservation
- Sections: Home, Coaches, Community, Goals, History, Profile

**4. Home Screen** (`home_screen.dart`)
- Welcome header
- Quick actions section
- Recent chats preview
- Stats overview cards

**5. Coach List Screen** (`coach_list_screen.dart`)
- Horizontal scrolling coach cards
- Create new coach button
- Coach categories (Finance, Fitness, Health, Software)
- Navigation to chat/detail screens

**6. Coach Chat Screen** (`coach_chat_screen.dart`)
- Real-time AI conversation interface
- Markdown rendering
- Message history
- Loading states and error handling
- Multi-provider AI support

**7. Create Coach Onboarding** (`create_coach_onboarding_screen.dart`)
- Multi-step wizard (10 steps)
- Coach configuration (name, category, icon, personality, system prompt)
- Provider selection
- API key configuration

**8. Goals Screen** (`goals_screen.dart`)
- Progress tracking with animated circular progress
- Goal creation dialog
- Category-based organization
- Completion states

**9. Community Screen** (`community_screen.dart`)
- Post categories
- Featured posts
- Like/comment interactions
- Create post functionality

**10. Profile Screen** (`profile_screen.dart`)
- User information display
- Premium badge (Gofocus Pro)
- Analytics card
- Settings navigation

**11. Finance Detail Screen** (`finance_detail_screen.dart`)
- Multi-tab interface: News, Notes, Todos, Goals
- Financial tracking features

**12. Fitness Detail Screen** (`components/fitness/fitness_detail_screen.dart`)
- Workouts tab
- Progress tab (measurements, weight tracking)
- Nutrition tab

**13. Software Detail Screen** (`components/software/software_detail_screen.dart`)
- Technologies tab (skill tracking)
- Projects tab (portfolio)
- Learning tab (resources)

#### Services Layer

**CoachService** (`services/coach_service.dart`)
- Coach CRUD operations
- SharedPreferences persistence
- Default coaches initialization
- Provider factory method

**ChatService** (`services/chat_service.dart`)
- Message history management
- AI provider orchestration
- Error handling

**AuthService** (`services/auth_service.dart`)
- Google Sign-In wrapper
- Apple Sign-In wrapper
- OAuth flow management

**AI Providers**
- `OpenAIProvider` - GPT-4 integration
- `AnthropicProvider` - Claude integration
- `GoogleProvider` - Gemini integration
- `LangChainProvider` - Backend LangChain API

#### Widgets

**Reusable Components (20+ widgets):**
- `CoachCard` / `CoachCardHorizontal`
- `AssistantSection`
- `StatsOverviewSection`
- `QuickActionsSection`
- `ProfileHeaderSection`
- `CommunityFeaturedPostsSection`
- Custom buttons, text fields, etc.

### Admin Panel (Next.js)

**Current Features:**
- Login page with brain-themed animation
- Dashboard placeholder
- Token-based authentication
- Mock auth (demo credentials)

**Planned Features:**
- User management
- Coach analytics
- System monitoring
- Content moderation

### Backend Services

#### Auth Service (Go)

**Responsibilities:**
- User registration/login
- Password hashing (bcrypt)
- JWT token generation/validation
- Email uniqueness enforcement

**Key Endpoints:**
- `POST /auth/register` - Create account
- `POST /auth/login` - Authenticate
- `GET /auth/validate` - Verify token
- `GET /health` - Service health

**Security Features:**
- bcrypt password hashing (10 rounds)
- JWT with 7-day expiration
- CORS middleware

**Vulnerabilities:**
- Default JWT secret in code
- CORS allows all origins
- No rate limiting
- No password complexity requirements

#### User Service (Go)

**Responsibilities:**
- User profile management
- Stats aggregation
- CRUD operations on profiles

**Key Endpoints:**
- `GET /users/:id` - Get profile
- `PUT /users/:id` - Update profile
- `GET /users/:id/stats` - Get statistics
- `DELETE /users/:id` - Delete account

**Authentication:** JWT middleware required

#### Coach Service (Go)

**Responsibilities:**
- Coach CRUD
- User-to-coach mapping
- Config storage (JSONB)

**Key Endpoints:**
- `POST /coaches` - Create coach
- `GET /coaches` - List user's coaches
- `GET /coaches/:id` - Get coach details
- `PUT /coaches/:id` - Update coach
- `DELETE /coaches/:id` - Delete coach

#### Chat Service (FastAPI)

**Responsibilities:**
- AI conversation orchestration
- Multi-provider abstraction
- Conversation history management
- Response generation

**Key Endpoints:**
- `POST /chat/message` - Send message
- `GET /health` - Service health

**AI Provider Logic:**
- Supports OpenAI, Anthropic
- Configurable per-coach provider
- System prompt injection
- Token usage tracking

**Integration:**
- Calls Coach Service to get configuration
- Uses Redis for caching (planned)
- Environment variable API keys

#### Analytics Service (FastAPI)

**Status:** Structure exists, implementation minimal

**Planned:**
- Usage analytics
- Goal completion rates
- Coach engagement metrics
- Revenue tracking

#### Community Service (FastAPI)

**Status:** Structure exists, implementation minimal

**Planned:**
- Post creation/management
- Categories
- Likes/comments
- Moderation

---

## Third-Party Integrations & API Keys

### AI/LLM Providers

#### 1. **OpenAI (GPT-4, GPT-3.5)**

**Purpose:** Primary AI conversation provider

**Integration Points:**
- `aicoach_app/lib/services/openai_provider.dart` (Flutter client)
- `backend/fastapi-services/services/chat-service/main.py` (backend)

**Required API Keys:**
- `OPENAI_API_KEY` - Environment variable

**Usage:**
- Chat completions
- Model: configurable per coach (default: gpt-4)
- Temperature: 0.7
- Max tokens: 2000 (client), 1000 (backend)

**Cost Implications:**
- GPT-4: ~$0.03/1K input tokens, ~$0.06/1K output tokens
- Estimate: $0.20-2.00 per conversation session

**Vendor Lock Risk:** HIGH
- OpenAI API is proprietary
- No open-source alternative at same quality
- Migration path: Use generic AIProvider interface

**Configuration:**
```dart
// Flutter
final provider = OpenAIProvider(apiKey: coach.config['apiKey']);
final response = await provider.sendMessage(
  message: userMessage,
  conversationHistory: history,
  modelId: 'gpt-4',
);

// Backend (FastAPI)
client = openai.AsyncOpenAI(api_key=OPENAI_API_KEY)
response = await client.chat.completions.create(
    model=model,
    messages=messages,
    temperature=0.7,
)
```

#### 2. **Anthropic (Claude)**

**Purpose:** Alternative AI provider

**Integration Points:**
- `aicoach_app/lib/services/anthropic_provider.dart`
- `backend/fastapi-services/services/chat-service/main.py`

**Required API Keys:**
- `ANTHROPIC_API_KEY` - Environment variable

**Usage:**
- Chat completions
- Model: claude-3-opus-20240229, claude-3-sonnet, claude-3-haiku
- Max tokens: 2048

**Cost Implications:**
- Claude 3 Opus: $15/1M input, $75/1M output
- Claude 3 Sonnet: $3/1M input, $15/1M output
- Claude 3 Haiku: $0.25/1M input, $1.25/1M output

**Vendor Lock Risk:** HIGH

#### 3. **Google (Gemini)**

**Purpose:** Cost-effective AI provider

**Integration Points:**
- `aicoach_app/lib/services/google_provider.dart`
- FastAPI integration (planned)

**Required API Keys:**
- `GOOGLE_API_KEY` - Environment variable

**Usage:**
- Chat completions
- Model: gemini-pro, gemini-pro-vision

**Cost Implications:**
- Gemini Pro: Free tier available, $0.0005 per 1K characters

**Vendor Lock Risk:** MEDIUM

#### 4. **LangChain (Backend Integration)**

**Purpose:** Advanced AI workflows, chains, agents

**Integration Points:**
- `aicoach_app/lib/services/langchain_provider.dart`
- Backend service not yet implemented

**Required Configuration:**
- LangChain backend API URL
- Auth token

**Planned Features:**
- Chain execution
- Agent workflows
- Vector stores (RAG)
- Tool calling

**Vendor Lock Risk:** LOW (LangChain is framework, not vendor)

**Database Tables:** See `DATABASE_SCHEMA.md` sections 19-26

### Authentication Providers

#### 5. **Google Sign-In**

**Purpose:** OAuth social login

**Integration Points:**
- `aicoach_app/lib/services/auth_service.dart`
- Flutter package: `google_sign_in ^6.2.1`

**Configuration:**
- iOS: `ios/Runner/Info.plist` - REVERSED_CLIENT_ID
- Android: `android/app/google-services.json`
- Flutter: `GoogleSignIn(scopes: ['email', 'profile'])`

**Data Collected:**
- Email, display name, photo URL
- ID token, access token

**Privacy Implications:**
- User data shared with Google
- Must comply with Google OAuth policies

**Vendor Lock Risk:** MEDIUM

#### 6. **Apple Sign-In**

**Purpose:** iOS-specific OAuth

**Integration Points:**
- `aicoach_app/lib/services/auth_service.dart`
- Flutter package: `sign_in_with_apple ^6.1.3`

**Configuration:**
- iOS: Requires Apple Developer account
- Capabilities: Sign in with Apple enabled

**Data Collected:**
- User ID, email (optional), name
- Identity token, authorization code

**Privacy Implications:**
- Privacy-focused authentication
- No user tracking

**Vendor Lock Risk:** HIGH (iOS-only)

### Infrastructure Services

#### 7. **PostgreSQL**

**Purpose:** Primary database

**Instances:**
- auth-db (Port 5433)
- user-db (Port 5434)
- coach-db (Port 5435)

**Version:** PostgreSQL 15-alpine

**Configuration:**
- Username: postgres
- Password: postgres (⚠️ CHANGE IN PRODUCTION)
- No SSL (⚠️ ADD SSL IN PRODUCTION)

**Vendor Lock Risk:** LOW (open-source, portable)

#### 8. **Redis**

**Purpose:** Caching, session storage, pub/sub

**Version:** Redis 7-alpine

**Configuration:**
- Port: 6379
- No password (⚠️ ADD IN PRODUCTION)
- No TLS

**Usage:**
- Chat session caching (planned)
- Rate limiting (planned)
- Pub/sub for real-time features (planned)

**Vendor Lock Risk:** LOW (open-source, many alternatives)

#### 9. **Nginx**

**Purpose:** API gateway, reverse proxy, load balancing

**Status:** ⚠️ CONFIGURATION FILE MISSING

**Expected Features:**
- Route distribution to services
- SSL termination
- Rate limiting
- Request/response logging

**Vendor Lock Risk:** LOW

### Environment Variables Summary

#### Mobile App (`aicoach_app`)
No environment variables needed (API keys stored in SharedPreferences per-coach)

#### Backend Services

**Auth Service:**
```bash
PORT=8001
DATABASE_URL=postgres://postgres:postgres@auth-db:5432/authdb?sslmode=disable
JWT_SECRET=your-secret-key-change-in-production
```

**User Service:**
```bash
PORT=8002
DATABASE_URL=postgres://postgres:postgres@user-db:5432/userdb?sslmode=disable
```

**Coach Service:**
```bash
PORT=8003
DATABASE_URL=postgres://postgres:postgres@coach-db:5432/coachdb?sslmode=disable
```

**Chat Service:**
```bash
AUTH_SERVICE_URL=http://auth-service:8001
REDIS_URL=redis://redis:6379
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

**Analytics Service:**
```bash
REDIS_URL=redis://redis:6379
```

**Community Service:**
```bash
# TBD
```

**Nginx Gateway:**
```bash
# TBD
```

---

## Security Audit & Vulnerabilities

### 🔴 CRITICAL ISSUES

#### 1. Hardcoded JWT Secret

**Location:** `backend/go-services/services/auth-service/main.go:46`

```go
jwtSecret = []byte("default-secret-change-in-production")
```

**Risk:** Anyone can forge JWT tokens, impersonate users, escalate privileges.

**Impact:** Complete authentication bypass.

**Fix:**
```go
// Add to init()
jwtSecret = []byte(os.Getenv("JWT_SECRET"))
if len(jwtSecret) == 0 {
    log.Fatal("JWT_SECRET environment variable must be set")
}
```

**Priority:** P0 - Must fix before deployment

#### 2. Weak Database Credentials

**Location:** `backend/docker-compose.yml:9-10, 28-29, 47-48`

```yaml
POSTGRES_USER: postgres
POSTGRES_PASSWORD: postgres
```

**Risk:** Default credentials are public knowledge.

**Impact:** Database compromise, data exfiltration, data modification.

**Fix:**
```yaml
# Use Docker secrets or environment variable injection
POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```
Generate strong passwords: `openssl rand -base64 32`

**Priority:** P0 - Must fix before deployment

#### 3. No SSL/TLS on Database Connections

**Location:** All database URLs contain `sslmode=disable`

**Risk:** Man-in-the-middle attacks, credential interception.

**Impact:** Data breach, authentication compromise.

**Fix:**
```go
DATABASE_URL=postgres://user:pass@host:5432/db?sslmode=require
```

**Priority:** P0 - Must fix before production

#### 4. No Password Complexity Requirements

**Location:** `backend/go-services/services/auth-service/main.go:31`

```go
Password string `json:"password" binding:"required,min=6"`
```

**Risk:** Weak passwords, brute-force attacks.

**Impact:** Account takeover.

**Fix:**
- Minimum 8 characters
- Require uppercase, lowercase, number, special character
- Check against common password lists

**Priority:** P1 - Fix before public launch

#### 5. No Rate Limiting

**Location:** All services

**Risk:** Brute-force attacks, DDoS, resource exhaustion.

**Impact:** Service degradation, cost escalation.

**Fix:**
- Implement rate limiting middleware (e.g., tollbooth for Go, slowapi for Python)
- Per-IP limits
- Per-user limits (after authentication)

**Priority:** P1 - Implement before scaling

#### 6. CORS Allows All Origins

**Location:**
- `backend/go-services/services/auth-service/main.go:253`
- `backend/go-services/services/user-service/main.go` (authMiddleware)
- All FastAPI services

```go
c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
```

**Risk:** CSRF attacks, credential theft.

**Impact:** Unauthorized actions on behalf of users.

**Fix:**
```go
// Only allow specific origins
allowedOrigins := []string{
    "https://app.gofocus.com",
    "https://admin.gofocus.com",
    "http://localhost:3000", // Dev only
}
origin := c.Request.Header.Get("Origin")
if contains(allowedOrigins, origin) {
    c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
}
```

**Priority:** P1 - Fix before deployment

#### 7. No Input Sanitization

**Location:** All user input endpoints

**Risk:** SQL injection, XSS, command injection.

**Impact:** Data breach, code execution.

**Fix:**
- Use parameterized queries (already doing this in Go)
- Validate all inputs (use Pydantic models in Python)
- Sanitize outputs (escape HTML, etc.)

**Priority:** P1 - Audit all endpoints

#### 8. API Keys Stored in SharedPreferences

**Location:** `aicoach_app/lib/services/coach_service.dart`

**Risk:** API keys accessible to anyone with device access, including malware.

**Impact:** Cost escalation, quota exhaustion.

**Fix:**
- Use secure storage (iOS Keychain, Android Keystore)
- Encrypt at rest
- Move API key management to backend

**Priority:** P1 - Implement secure storage

#### 9. Redis No Password

**Location:** `backend/docker-compose.yml:64`

**Risk:** Redis command injection, data modification.

**Impact:** Cache poisoning, data corruption.

**Fix:**
```yaml
command: redis-server --requirepass ${REDIS_PASSWORD}
```

**Priority:** P1 - Add authentication

#### 10. Missing Environment Files

**Location:** Root directory

**Risk:** No documentation of required environment variables, team members may use defaults.

**Impact:** Configuration drift, security holes.

**Fix:** Create `.env.example` files for each service with required variables.

**Priority:** P2 - Add documentation

### 🟡 MEDIUM PRIORITY ISSUES

#### 11. JWT Token Expiration Too Long

**Location:** `backend/go-services/services/auth-service/main.go:231`

```go
"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
```

**Risk:** Stolen tokens remain valid for 7 days.

**Fix:** Reduce to 24 hours, implement refresh tokens.

**Priority:** P2

#### 12. No Session Management

**Location:** Auth service

**Risk:** Cannot revoke tokens, log out users.

**Fix:** Implement token blacklist (Redis).

**Priority:** P2

#### 13. No Logging/Monitoring

**Location:** All services

**Risk:** Cannot detect attacks, troubleshoot issues.

**Fix:** Add structured logging (JSON), integrate with monitoring (Prometheus, Grafana).

**Priority:** P2

#### 14. No Health Check Timeouts

**Location:** `backend/go-services/services/auth-service/main.go:240`

```go
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
```

**Good:** Timeouts exist, but should be configurable.

**Priority:** P3

#### 15. Shared Global JWT Secret

**Location:** Auth service

**Risk:** Single point of failure, cannot rotate keys without downtime.

**Fix:** Use key rotation, separate keys per environment.

**Priority:** P3

### 🟢 LOW PRIORITY / BEST PRACTICES

#### 16. No HTTPS in Development

**Status:** Acceptable for local development.

**Fix:** Add mkcert for local HTTPS.

**Priority:** P4

#### 17. No Database Migrations

**Location:** All services create tables with `CREATE TABLE IF NOT EXISTS`

**Risk:** Schema drift, deployment issues.

**Fix:** Use migration tool (golang-migrate, Alembic).

**Priority:** P3

#### 18. No API Versioning

**Location:** All endpoints

**Risk:** Breaking changes affect clients.

**Fix:** Add version prefix: `/api/v1/auth/login`.

**Priority:** P3

#### 19. Insufficient Error Messages

**Location:** All services

**Risk:** Information leakage, user confusion.

**Fix:** Sanitize error messages, log detailed errors server-side only.

**Priority:** P3

### Security Recommendations Summary

**Immediate Actions (Before Deployment):**
1. Remove hardcoded JWT secret
2. Change default database passwords
3. Enable SSL on database connections
4. Add CORS origin whitelist
5. Implement rate limiting
6. Add password complexity requirements
7. Secure API key storage
8. Add Redis password

**Short-Term (1-4 Weeks):**
9. Add input validation everywhere
10. Implement token blacklist
11. Reduce JWT expiration
12. Add structured logging
13. Create .env.example files
14. Database migrations

**Medium-Term (1-3 Months):**
15. API versioning
16. Advanced monitoring
17. Web Application Firewall (WAF)
18. Penetration testing
19. Security audit by third party

**Long-Term:**
20. HSM for key management
21. Zero-trust architecture
22. Automated security scanning (SAST, DAST)
23. Bug bounty program

---

## Developer Onboarding

### Prerequisites

**Required Software:**
1. **Docker Desktop** (v4.0+)
   - Download: https://www.docker.com/products/docker-desktop/
   - Purpose: Container orchestration

2. **Flutter SDK** (v3.9.2+)
   - Download: https://flutter.dev/docs/get-started/install
   - Purpose: Mobile app development

3. **Go** (v1.21+)
   - Download: https://go.dev/dl/
   - Purpose: Backend Go services

4. **Python** (v3.9+)
   - Download: https://www.python.org/downloads/
   - Purpose: Backend FastAPI services

5. **Node.js & npm** (v18+)
   - Download: https://nodejs.org/
   - Purpose: Admin panel development

6. **PostgreSQL Client** (optional)
   - pgAdmin or psql CLI
   - Purpose: Database inspection

7. **IDE/Editor:**
   - VS Code (recommended)
     - Extensions: Flutter, Go, Python, Docker
   - Or: Android Studio, Xcode

8. **Git**
   - Already installed on most systems

### Initial Setup

#### 1. Clone Repository

```bash
git clone <repository-url>
cd aicoach
```

#### 2. Backend Setup

**Start Infrastructure:**

```bash
cd backend

# Copy environment template (create this file)
cp .env.example .env

# Edit .env with your API keys
# Required:
# - OPENAI_API_KEY=sk-...
# - ANTHROPIC_API_KEY=sk-ant-...
# - JWT_SECRET=$(openssl rand -base64 32)

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f auth-service
```

**Expected output:**
```
✅ auth-service running on port 8001
✅ user-service running on port 8002
✅ coach-service running on port 8003
✅ chat-service running on port 8100
✅ analytics-service running on port 8200
✅ community-service running on port 8300
✅ nginx-gateway running on port 80
✅ 3 PostgreSQL databases running
✅ Redis running
```

**Verify Health:**

```bash
curl http://localhost:8001/health
# Expected: {"status":"healthy"}

curl http://localhost:8100/health
# Expected: {"status":"healthy"}
```

#### 3. Mobile App Setup

```bash
cd aicoach_app

# Install dependencies
flutter pub get

# Check for devices
flutter devices

# Run on iOS simulator
flutter run -d "iPhone 15 Pro"

# Or run on Android emulator
flutter run -d "Pixel 6"
```

**Common Issues:**
- **iOS Pods not installed:** `cd ios && pod install`
- **Android SDK missing:** Install via Android Studio
- **Flutter doctor:** Run `flutter doctor` to diagnose

#### 4. Admin Panel Setup

```bash
cd aicoach_admin

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### Environment Variables

**Create `.env` files:**

**backend/.env:**
```bash
# JWT Configuration
JWT_SECRET=change-me-to-random-string

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Google (Gemini)
GOOGLE_API_KEY=AIza...

# PostgreSQL Passwords
POSTGRES_PASSWORD=change-me-to-strong-password
REDIS_PASSWORD=change-me-to-strong-password

# Database URLs (auto-configured by docker-compose)
# Override if needed:
# DATABASE_URL_AUTH=...
# DATABASE_URL_USER=...
# DATABASE_URL_COACH=...
```

**⚠️ CRITICAL:** Never commit `.env` files to git.

### Development Workflow

#### Running Locally

**Option 1: Full Stack**
```bash
# Terminal 1: Backend
cd backend && docker-compose up

# Terminal 2: Mobile
cd aicoach_app && flutter run

# Terminal 3: Admin
cd aicoach_admin && npm run dev
```

**Option 2: Services Individually**

```bash
# Go services
cd backend/go-services/services/auth-service
go run main.go

# FastAPI services
cd backend/fastapi-services/services/chat-service
uvicorn main:app --reload --port 8100
```

#### Testing

**Backend:**
```bash
# Go services
cd backend/go-services/services/auth-service
go test ./...

# FastAPI services
cd backend/fastapi-services/services/chat-service
pytest

# Integration tests
docker-compose -f docker-compose.test.yml up
```

**Mobile:**
```bash
cd aicoach_app
flutter test
flutter run --integration-test
```

**Admin:**
```bash
cd aicoach_admin
npm test
```

### Common Pitfalls

**1. Port Conflicts**
- Error: `bind: address already in use`
- Fix: Kill conflicting process or change port in docker-compose.yml

**2. Docker Volume Issues**
- Error: `permission denied`
- Fix: `docker-compose down -v && docker-compose up`

**3. Flutter Build Cache**
- Error: Stale builds
- Fix: `flutter clean && flutter pub get`

**4. Database Migrations Not Running**
- Error: Tables missing
- Fix: Check service logs, verify `createTables()` is called

**5. Missing API Keys**
- Error: `OpenAI API key not configured`
- Fix: Add to `.env` and restart service

**6. CORS Errors**
- Error: `Access-Control-Allow-Origin`
- Fix: Check CORS middleware, add origin to whitelist

**7. JWT Token Invalid**
- Error: `Invalid token claims`
- Fix: Ensure JWT_SECRET matches across services

### Code Standards

**Dart/Flutter:**
- Follow: `flutter_lints: ^5.0.0`
- Format: `flutter format .`
- Analyze: `flutter analyze`

**Go:**
- Format: `go fmt ./...`
- Lint: `golangci-lint run`
- Vet: `go vet ./...`

**Python:**
- Format: `black .`
- Lint: `flake8 .`
- Type check: `mypy .`

**TypeScript:**
- Format: `prettier --write .`
- Lint: `npm run lint`

---

## Deployment & Infrastructure

### Current State

**Status:** Development environment only  
**Orchestration:** Docker Compose  
**Production:** Not deployed

### Docker Compose Architecture

**File:** `backend/docker-compose.yml`

**Services:**
1. **Databases:** 3 PostgreSQL instances, 1 Redis
2. **Go Services:** 3 microservices
3. **FastAPI Services:** 3 microservices
4. **Gateway:** Nginx (⚠️ config missing)

**Networking:**
- Bridge network: `aicoach-network`
- Internal service discovery via DNS
- External ports: 80, 8001-8003, 8100-8300, 5433-5435, 6379

### Production Deployment Plan

#### Option 1: Kubernetes (Recommended)

**Advantages:**
- Auto-scaling
- High availability
- Service mesh (Istio)
- Rolling deployments

**Components:**
- Kubernetes cluster (managed: GKE, EKS, AKS)
- Helm charts for services
- Ingress controller (nginx-ingress)
- StatefulSets for databases
- ConfigMaps/Secrets for configuration

**Deployment Steps:**

```bash
# Create namespace
kubectl create namespace gofocus

# Deploy databases (with persistent volumes)
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/redis.yaml

# Deploy services
helm install auth-service k8s/charts/auth-service
helm install user-service k8s/charts/user-service
# ... etc

# Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

#### Option 2: Docker Swarm

**Advantages:**
- Simpler than K8s
- Docker-native

**Deployment:**
```bash
docker stack deploy -c docker-compose.prod.yml gofocus
```

#### Option 3: Managed Services

**Recommendation:**
- Mobile app: App Store, Google Play
- Backend: AWS ECS, Google Cloud Run, Azure Container Instances
- Database: Managed PostgreSQL (RDS, Cloud SQL)
- Cache: Managed Redis (ElastiCache, Cloud Memorystore)

### CI/CD Pipeline (To Be Implemented)

**Recommended Setup:**

**GitHub Actions:**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Go tests
        run: |
          cd backend/go-services
          go test ./...
      - name: Run Python tests
        run: |
          cd backend/fastapi-services
          pytest

  mobile-build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Flutter build
        run: |
          cd aicoach_app
          flutter build apk
          flutter build ios

  deploy-staging:
    needs: [backend-test, mobile-build]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          # Deploy to staging environment
          kubectl apply -f k8s/staging/

  deploy-production:
    needs: [backend-test, mobile-build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy to production
          kubectl apply -f k8s/production/
```

**Required Secrets:**
- Docker Hub credentials
- AWS/GCP credentials
- Deployment keys
- API keys

### Infrastructure Requirements

**Minimum (Development):**
- 4 CPU cores
- 8 GB RAM
- 50 GB storage
- Docker Desktop

**Recommended (Production):**

**Compute:**
- 16+ CPU cores
- 64 GB RAM
- Auto-scaling enabled

**Database:**
- Managed PostgreSQL: 100 GB+ storage
- Read replicas: 2+ instances
- Backup: Daily automated

**Cache:**
- Managed Redis: 16 GB RAM

**Storage:**
- Object storage (S3/GCS): User uploads, assets

**CDN:**
- CloudFlare or AWS CloudFront

**Monitoring:**
- Prometheus + Grafana
- ELK Stack (logging)
- Sentry (error tracking)

**Cost Estimate (AWS):**
- Compute (ECS): $200-500/month
- Databases (RDS): $150-300/month
- Redis (ElastiCache): $50-100/month
- Storage (S3): $20-50/month
- **Total:** $420-950/month

### Backup & Disaster Recovery

**Current:** ⚠️ NOT IMPLEMENTED

**Required:**
1. **Database Backups:**
   - Automated daily backups
   - Retention: 30 days
   - Test restore quarterly

2. **Configuration Backups:**
   - Infrastructure as Code (Terraform)
   - Version controlled secrets

3. **Disaster Recovery Plan:**
   - RTO: 4 hours
   - RPO: 1 hour
   - Multi-region deployment

---

## Next Steps & Priority Actions

### 🚨 CRITICAL - Must Fix Before Scaling

#### Week 1: Security Hardening

**Day 1-2: Immediate Fixes**
1. ✅ Remove hardcoded JWT secret → Use environment variable
2. ✅ Change default database passwords → Strong random passwords
3. ✅ Enable SSL on database connections
4. ✅ Add CORS origin whitelist
5. ✅ Implement rate limiting (tollbooth for Go, slowapi for Python)

**Day 3-4: Authentication Improvements**
6. ✅ Add password complexity requirements
7. ✅ Reduce JWT expiration to 24 hours
8. ✅ Implement refresh token flow
9. ✅ Add token blacklist (Redis)
10. ✅ Implement secure API key storage (iOS Keychain, Android Keystore)

**Day 5-7: Input Validation & Monitoring**
11. ✅ Audit all endpoints for SQL injection
12. ✅ Add input validation everywhere
13. ✅ Sanitize error messages
14. ✅ Add structured logging
15. ✅ Create .env.example files

#### Week 2: Infrastructure Setup

**Day 8-10: Nginx Gateway**
1. ✅ Create nginx.conf
2. ✅ Set up SSL/TLS certificates
3. ✅ Configure rate limiting
4. ✅ Add request logging

**Day 11-12: Database Migrations**
5. ✅ Set up golang-migrate
6. ✅ Create migration files
7. ✅ Document schema changes

**Day 13-14: Monitoring & Logging**
8. ✅ Set up Prometheus metrics
9. ✅ Configure Grafana dashboards
10. ✅ Integrate Sentry for error tracking

### 📋 SHORT-TERM (1-3 Months)

#### Phase 1: Feature Completion

**Mobile App:**
1. Complete LangChain integration
2. Offline mode support
3. Push notifications
4. In-app purchases (Premium)
5. Social sharing features

**Admin Panel:**
6. User management dashboard
7. Coach analytics
8. Content moderation tools
9. System health monitoring

**Backend:**
10. Implement Analytics Service
11. Implement Community Service
12. Add search functionality (Elasticsearch/Algolia)
13. File upload/storage (S3/GCS)

#### Phase 2: Quality & Performance

**Testing:**
1. Unit tests: Achieve 80%+ coverage
2. Integration tests: All API endpoints
3. E2E tests: Critical user flows
4. Load testing: Simulate 1000+ concurrent users

**Performance:**
5. Database query optimization
6. Caching strategy implementation
7. CDN integration
8. Image optimization

**Documentation:**
9. API documentation (Swagger/OpenAPI)
10. Architecture decision records
11. Runbooks for operations
12. User guides

#### Phase 3: Deployment & DevOps

**CI/CD:**
1. GitHub Actions workflow
2. Automated testing pipeline
3. Staging environment deployment
4. Production deployment automation

**Infrastructure:**
5. Kubernetes cluster setup
6. Helm charts creation
7. Terraform for IaC
8. Backup automation

**Security:**
9. Security scanning (SAST, DAST)
10. Dependency vulnerability scanning
11. Penetration testing
12. Bug bounty program

### 🎯 MID-TERM (3-6 Months)

#### Scaling & Growth

**Architecture:**
1. Microservices decoupling (message queue: RabbitMQ/Kafka)
2. CQRS pattern implementation
3. Event-driven architecture
4. GraphQL API layer

**Features:**
5. Multi-language support (i18n)
6. Voice conversations (TTS/STT)
7. Video coaching sessions
8. Gamification system
9. Referral program

**Integration:**
10. Zapier/Make integration
11. Calendar integration (Google, Outlook)
12. Slack/Discord bots
13. Webhook system

**Analytics:**
14. Advanced analytics dashboard
15. Predictive modeling
16. A/B testing framework
17. Personalization engine

### 🚀 LONG-TERM (6-12 Months)

#### Platform Evolution

**Technical:**
1. Migrate to gRPC for inter-service communication
2. Implement service mesh (Istio)
3. Multi-region deployment
4. Edge computing integration
5. AI model fine-tuning on user data

**Business:**
6. White-label offering
7. Enterprise features (SSO, SAML)
8. API marketplace
9. Partner integrations
10. Affiliate system

**Innovation:**
11. AR/VR coaching experiences
12. Biometric integration
13. Blockchain-based credentials
14. AI agent marketplace
15. Metaverse integration

### 💡 Recommended Improvements Summary

**Security (P0):**
- [ ] Remove all hardcoded secrets
- [ ] Enable SSL everywhere
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Secure API key storage

**Stability (P1):**
- [ ] Add comprehensive logging
- [ ] Implement health checks
- [ ] Set up monitoring
- [ ] Create alerting
- [ ] Write runbooks

**Scalability (P1):**
- [ ] Horizontal scaling design
- [ ] Database connection pooling
- [ ] Caching layer
- [ ] Load testing
- [ ] Performance optimization

**Usability (P2):**
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Offline support
- [ ] Accessibility compliance
- [ ] Mobile responsiveness

**Business (P2):**
- [ ] Payment integration
- [ ] Subscription management
- [ ] Usage analytics
- [ ] Customer support tools
- [ ] Marketing automation

---

## Appendix

### Key Files Reference

**Mobile App:**
- Entry: `aicoach_app/lib/main.dart`
- Auth: `aicoach_app/lib/services/auth_service.dart`
- Chat: `aicoach_app/lib/services/chat_service.dart`
- Models: `aicoach_app/lib/models/`

**Backend:**
- Auth: `backend/go-services/services/auth-service/main.go`
- Chat: `backend/fastapi-services/services/chat-service/main.py`
- Config: `backend/docker-compose.yml`

**Database:**
- Schema: `aicoach_app/DATABASE_SCHEMA.md`
- LangChain: `aicoach_app/LANGCHAIN_INTEGRATION.md`

### Useful Commands

```bash
# Backend
docker-compose up -d                # Start all services
docker-compose logs -f service-name # View logs
docker-compose restart service-name # Restart service
docker-compose down                 # Stop all services
docker-compose ps                   # List running services

# Mobile
flutter run                         # Run app
flutter test                        # Run tests
flutter clean                       # Clean build cache
flutter doctor                      # Check setup

# Admin
npm run dev                         # Start dev server
npm run build                       # Build for production
npm test                            # Run tests

# Go
go test ./...                       # Run tests
go build                            # Build binary
go fmt ./...                        # Format code

# Python
pytest                              # Run tests
uvicorn main:app --reload          # Start dev server
black .                             # Format code
```

### Contact & Support

**Document Author:** AI Assistant  
**Maintainer:** [Your Name]  
**Last Updated:** January 2025

**Questions/Issues:**
- Create GitHub issue
- Contact: [email]
- Slack: #gofocus-dev

---

**END OF DOCUMENT**

