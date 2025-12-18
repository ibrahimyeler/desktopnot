# Pangea-UI Proje Yapısı Önerisi

## 🎯 Proje Genel Bakış
```
pangea-ui/
├── backend/                    # Go API (Mevcut)
│   ├── cmd/
│   │   └── server/
│   │       └── main.go
│   ├── internal/
│   │   ├── api/
│   │   │   ├── handlers/
│   │   │   │   ├── auth.go
│   │   │   │   ├── admin.go
│   │   │   │   ├── user.go
│   │   │   │   └── dashboard.go
│   │   │   ├── middleware/
│   │   │   │   ├── auth.go
│   │   │   │   ├── cors.go
│   │   │   │   └── admin.go
│   │   │   └── routes/
│   │   │       ├── auth.go
│   │   │       ├── admin.go
│   │   │       └── user.go
│   │   ├── models/
│   │   │   ├── user.go
│   │   │   ├── admin.go
│   │   │   └── oauth.go
│   │   ├── database/
│   │   │   ├── postgres.go
│   │   │   └── migrations/
│   │   ├── services/
│   │   │   ├── auth.go
│   │   │   ├── admin.go
│   │   │   └── user.go
│   │   └── utils/
│   │       ├── jwt.go
│   │       ├── password.go
│   │       └── validator.go
│   ├── pkg/
│   │   └── oauth/
│   │       ├── google.go
│   │       └── github.go
│   ├── configs/
│   │   └── config.go
│   ├── go.mod
│   └── go.sum
├── frontend/                   # Next.js Admin Panel
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── admin/
│   │   │   │       └── login/
│   │   │   │           └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── users/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── analytics/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── settings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── user/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Header.tsx
│   │   │   ├── forms/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AdminLoginForm.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── UserDashboard.tsx
│   │   │   │   ├── Analytics.tsx
│   │   │   │   └── Settings.tsx
│   │   │   └── admin/
│   │   │       ├── UserManagement.tsx
│   │   │       ├── AdminManagement.tsx
│   │   │       └── SystemSettings.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── utils.ts
│   │   │   └── types.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useApi.ts
│   │   │   └── useAdmin.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── web-panel/                  # Public Web Panel
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── home/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── contact/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── services/
│   │   │   │       └── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   └── Testimonials.tsx
│   │   │   └── forms/
│   │   │       ├── LoginForm.tsx
│   │   │       └── RegisterForm.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── types.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   │   └── images/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── shared/                     # Shared Components & Types
│   ├── types/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── admin.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   └── components/
│       ├── ui/
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   └── Card.tsx
│       └── forms/
│           ├── LoginForm.tsx
│           └── RegisterForm.tsx
├── docker-compose.yml
├── docker/
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   └── Dockerfile
│   └── web-panel/
│       └── Dockerfile
├── nginx/
│   └── nginx.conf
├── scripts/
│   ├── setup.sh
│   ├── deploy.sh
│   └── backup.sh
├── docs/
│   ├── api.md
│   ├── deployment.md
│   └── development.md
└── README.md
```

## 🎯 Endpoint Yapısı Önerisi

### **🔐 Authentication Endpoints:**
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/admin/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh
GET    /api/v1/auth/me
PUT    /api/v1/auth/profile
```

### **👥 User Management Endpoints:**
```
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
POST   /api/v1/users/:id/activate
POST   /api/v1/users/:id/deactivate
```

### **🛡️ Admin Management Endpoints:**
```
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
GET    /api/v1/admin/analytics
GET    /api/v1/admin/settings
PUT    /api/v1/admin/settings
```

### **📊 Dashboard Endpoints:**
```
GET    /api/v1/dashboard/stats
GET    /api/v1/dashboard/analytics
GET    /api/v1/dashboard/recent-activity
GET    /api/v1/dashboard/user-growth
```

### **🔗 OAuth Endpoints:**
```
GET    /api/v1/oauth/google
GET    /api/v1/oauth/google/callback
GET    /api/v1/oauth/github
GET    /api/v1/oauth/github/callback
```

## 🎨 UI/UX Önerileri

### **Admin Panel Özellikleri:**
- ✅ **Modern Dashboard** - Analytics, charts, stats
- ✅ **User Management** - CRUD operations
- ✅ **Role-based Access** - Permissions system
- ✅ **Real-time Updates** - WebSocket integration
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Dark/Light Mode** - Theme switching

### **Web Panel Özellikleri:**
- ✅ **Landing Page** - Hero section, features
- ✅ **Public Pages** - About, contact, services
- ✅ **User Registration** - Simple signup process
- ✅ **OAuth Integration** - Google, GitHub login
- ✅ **User Dashboard** - Personal dashboard
- ✅ **Responsive Design** - Mobile-first approach

## 🛠️ Teknoloji Stack'i

### **Backend (Go):**
- **Gin** - HTTP framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **OAuth2** - Third-party auth
- **GORM** - ORM (optional)

### **Frontend (Next.js):**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Zustand** - State management
- **React Query** - Data fetching

### **DevOps:**
- **Docker** - Containerization
- **Nginx** - Reverse proxy
- **PostgreSQL** - Database
- **Redis** - Caching (optional)

## 🚀 Deployment Stratejisi

### **Development:**
```bash
# Backend
cd backend && go run cmd/server/main.go

# Frontend (Admin Panel)
cd frontend && npm run dev

# Web Panel
cd web-panel && npm run dev
```

### **Production:**
```bash
# Docker Compose
docker-compose up -d

# Or individual services
docker build -t pangea-backend ./backend
docker build -t pangea-admin ./frontend
docker build -t pangea-web ./web-panel
```

## 📋 Kurulum Adımları

### **1. Backend Kurulumu:**
```bash
cd backend
go mod init pangea-api
go get github.com/gin-gonic/gin
go get github.com/lib/pq
go get github.com/golang-jwt/jwt/v5
```

### **2. Frontend Kurulumu:**
```bash
# Admin Panel
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
npm install axios zustand @tanstack/react-query lucide-react

# Web Panel
npx create-next-app@latest web-panel --typescript --tailwind --eslint
cd web-panel
npm install axios zustand @tanstack/react-query
```

### **3. Shared Components:**
```bash
cd shared
npm init -y
npm install typescript @types/react
```

Bu yapı ile modern, scalable ve maintainable bir full-stack uygulama geliştirebilirsin! 🎉 