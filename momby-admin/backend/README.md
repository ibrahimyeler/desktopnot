# Momby Backend Services

Bu repository, Momby platformu için backend mikroservislerini içerir.

## 📁 Klasör Yapısı

```
backend/
├── python/              # Python (FastAPI) servisleri
│   └── services/
│       ├── content-service/   # İçerik yönetimi servisi
│       └── ai-service/        # AI asistan servisi
├── go/                  # Go servisleri
│   └── services/
│       ├── user-service/      # Kullanıcı yönetimi servisi
│       ├── order-service/     # Sipariş yönetimi servisi
│       └── analytics-service/ # Analitik servisi
└── node/               # Node.js (NestJS) servisleri
    └── services/
        ├── auth-service/          # Kimlik doğrulama servisi
        └── notification-service/  # Bildirim servisi
```

## 🚀 Hızlı Başlangıç

### Python Servisleri (FastAPI)

#### Content Service
```bash
cd python/services/content-service
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını düzenle
uvicorn app.main:app --reload
```

#### AI Service
```bash
cd python/services/ai-service
pip install -r requirements.txt
cp .env.example .env
# .env dosyasını düzenle (OpenAI, Pinecone API key'leri ekle)
uvicorn app.main:app --reload
```

### Go Servisleri

#### User Service
```bash
cd go/services/user-service
go mod download
go run cmd/server/main.go
```

#### Order Service
```bash
cd go/services/order-service
go mod download
go run cmd/server/main.go
```

#### Analytics Service
```bash
cd go/services/analytics-service
go mod download
go run cmd/server/main.go
```

### Node.js Servisleri (NestJS)

#### Auth Service
```bash
cd node/services/auth-service
npm install
npm run start:dev
```

#### Notification Service
```bash
cd node/services/notification-service
npm install
npm run start:dev
```

## 📡 API Endpoints

### Auth Service (Port: 3000)
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Giriş
- `POST /auth/refresh` - Token yenileme
- `GET /auth/me` - Kullanıcı profili

### User Service (Port: 8080)
- `GET /api/v1/users/:id` - Kullanıcı detayı
- `PUT /api/v1/users/:id` - Kullanıcı güncelleme
- `GET /api/v1/users/:id/pregnancy-info` - Hamilelik bilgileri

### Content Service (Port: 8000)
- `GET /api/v1/posts` - Tüm yazılar
- `POST /api/v1/posts` - Yeni yazı oluştur
- `GET /api/v1/categories` - Kategoriler

### AI Service (Port: 8000)
- `POST /api/v1/ai/chat` - AI asistan chat
- `POST /api/v1/ai/recommendations` - Kişiselleştirilmiş öneriler
- `GET /api/v1/ai/weekly-content/:week` - Haftalık içerik

### Order Service (Port: 8080)
- `POST /api/v1/orders` - Sipariş oluştur
- `GET /api/v1/orders/:id` - Sipariş detayı
- `PUT /api/v1/orders/:id/status` - Sipariş durumu güncelle

### Notification Service (Port: 3000)
- `POST /notifications/push` - Push notification gönder
- `POST /notifications/email` - Email gönder
- `POST /notifications/sms` - SMS gönder

## 🐳 Docker

Her servis için Dockerfile mevcuttur. Docker Compose ile tüm servisleri başlatmak için:

```bash
docker-compose up -d
```

## 🔧 Geliştirme

### Veritabanı Migration'ları

#### Python (Alembic)
```bash
cd python/services/content-service
alembic upgrade head
```

#### Go (GORM Auto Migrate)
Go servisleri otomatik olarak migration yapar.

#### Node.js (TypeORM)
```bash
cd node/services/auth-service
npm run migration:run
```

## 📝 Notlar

- Her servis kendi `.env` dosyasına ihtiyaç duyar
- Production ortamında environment variable'ları güvenli bir şekilde saklayın
- API Gateway (Kong/Traefik) tüm servisleri yönetmek için kullanılmalıdır

## 🔗 İlgili Dokümantasyon

Her servis için detaylı README dosyaları ilgili klasörlerde bulunmaktadır.

