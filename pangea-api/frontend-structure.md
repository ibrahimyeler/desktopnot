# Next.js TypeScript Frontend Structure

## 📁 Proje Yapısı
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── admin/
│   │   │       └── login/
│   │   │           └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   └── page.tsx
│   │   │   └── user/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AdminLoginForm.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── utils.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   └── styles/
│       └── globals.css
├── public/
│   └── images/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🛠️ Teknoloji Stack'i

### **Core:**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components

### **State Management:**
- **Zustand** - Lightweight state management
- **React Query** - Server state management

### **Authentication:**
- **NextAuth.js** - Authentication
- **JWT** - Token management

### **API Integration:**
- **Axios** - HTTP client
- **SWR** - Data fetching

## 📦 Package.json
```json
{
  "name": "pangea-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "next-auth": "^4.24.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "@types/node": "^20",
    "prettier": "^3.0.0"
  }
}
```

## 🔧 Kurulum Komutları

```bash
# Next.js projesi oluştur
npx create-next-app@latest frontend --typescript --tailwind --eslint

# Gerekli paketleri yükle
cd frontend
npm install axios zustand @tanstack/react-query next-auth lucide-react clsx class-variance-authority

# Shadcn/ui kurulumu
npx shadcn@latest init
npx shadcn@latest add button input card modal
```

## 🌐 API Integration

### **API Client (lib/api.ts):**
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **Auth Hook (hooks/useAuth.ts):**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  permissions?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

## 🎨 UI Components

### **Login Form Component:**
```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const { user, token } = response.data;
      
      login(user, token);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </Button>
    </form>
  );
}
```

## 🗄️ Database Seçimi Önerisi

### **Production için: PostgreSQL**
- ✅ ACID compliance
- ✅ JSON desteği
- ✅ Complex queries
- ✅ Excellent Go support
- ✅ Free ve open source

### **Development için: SQLite**
- ✅ Zero configuration
- ✅ File-based
- ✅ Perfect for development

### **MongoDB (Alternatif)**
- ✅ Schema flexibility
- ✅ JSON native
- ✅ Horizontal scaling

## 🚀 Deployment

### **Backend (Go):**
```bash
# Docker ile
docker build -t pangea-api .
docker run -p 8080:8080 pangea-api

# Veya binary
go build -o pangea-api
./pangea-api
```

### **Frontend (Next.js):**
```bash
# Vercel
vercel --prod

# Docker ile
docker build -t pangea-frontend .
docker run -p 3000:3000 pangea-frontend
```

Bu yapı ile modern, scalable ve type-safe bir full-stack uygulama geliştirebilirsin! 🎉 