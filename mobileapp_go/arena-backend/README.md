# Arena Backend

3D korku-multiplayer oyunu için Go ile yazılmış backend sistemi.

## 🎯 Özellikler

- **Real-time Multiplayer**: WebSocket tabanlı gerçek zamanlı oyun
- **Oda Sistemi**: Lobby ve oda yönetimi
- **Fizik Simülasyonu**: Server-side fizik ve çarpışma kontrolü
- **Item Sistemi**: Terlik, çay, karpuz gibi komik item'ler
- **Skor Sistemi**: Kalıcı skor ve liderlik tablosu
- **Ölçeklenebilir**: Redis ve PostgreSQL ile ölçeklenebilir mimari

## 🏗️ Mimari

```
arena-backend/
├── cmd/server/          # Ana server uygulaması
├── internal/
│   ├── gateway/         # HTTP/WebSocket gateway
│   ├── lobby/           # Oda yönetimi
│   ├── match/           # Oyun maç yönetimi
│   ├── sim/             # Fizik ve oyun simülasyonu
│   ├── store/           # Veritabanı katmanı
│   ├── models/          # Veri modelleri
│   └── util/            # Yardımcı fonksiyonlar
├── infra/               # Docker ve deployment
└── docs/                # Dokümantasyon
```

## 🚀 Kurulum

### Gereksinimler

- Go 1.21+
- Docker ve Docker Compose
- PostgreSQL 15+
- Redis 7+

### Hızlı Başlangıç

1. **Repository'yi klonlayın:**
```bash
git clone <repository-url>
cd arena-backend
```

2. **Environment dosyasını oluşturun:**
```bash
cp infra/env.example .env
```

3. **Docker ile çalıştırın:**
```bash
docker-compose up -d
```

4. **Veritabanı migration'larını çalıştırın:**
```bash
# PostgreSQL container'ına bağlanın
docker exec -it arena-postgres psql -U arena_user -d arena_db

# Migration dosyasını çalıştırın
\i /docker-entrypoint-initdb.d/001_initial_schema.sql
```

5. **Server'ı başlatın:**
```bash
go run cmd/server/main.go
```

### Manuel Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
go mod download
```

2. **PostgreSQL ve Redis'i başlatın:**
```bash
# PostgreSQL
docker run -d --name arena-postgres \
  -e POSTGRES_USER=arena_user \
  -e POSTGRES_PASSWORD=arena_password \
  -e POSTGRES_DB=arena_db \
  -p 5432:5432 \
  postgres:15

# Redis
docker run -d --name arena-redis \
  -p 6379:6379 \
  redis:7-alpine
```

3. **Environment değişkenlerini ayarlayın:**
```bash
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_USER=arena_user
export POSTGRES_PASSWORD=arena_password
export POSTGRES_DB=arena_db
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

4. **Server'ı çalıştırın:**
```bash
go run cmd/server/main.go
```

## 📡 API Endpoints

### REST API

#### Health Check
```http
GET /healthz
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "1756389460",
  "version": "1.0.0"
}
```

#### Oda Oluşturma
```http
POST /api/v1/rooms
Content-Type: application/json
```

**Request Body:**
```json
{
  "region": "eu-west",        // Opsiyonel
  "maxPlayers": 4            // Opsiyonel (varsayılan: 10)
}
```

**Response:**
```json
{
  "roomCode": "QKBG"
}
```

#### Oda Bilgisi
```http
GET /api/v1/rooms/{code}
```

**Response:**
```json
{
  "code": "QKBG",
  "status": "WAITING",
  "playerCount": 2,
  "maxPlayers": 4,
  "pingEndpoint": "/ws"
}
```

#### Liderlik Tablosu
```http
GET /api/v1/leaderboard?period=week&limit=50
```

**Query Parameters:**
- `period`: `week`, `month`, `all` (varsayılan: `week`)
- `limit`: 1-100 arası (varsayılan: 50)

**Response:**
```json
{
  "period": "week",
  "entries": [
    {
      "userId": "uuid-1",
      "nickname": "Kibex",
      "score": 1250,
      "kills": 45,
      "deaths": 12,
      "matches": 23,
      "position": 1
    }
  ]
}
```

### WebSocket API

#### Bağlantı
```http
WS /ws
```

#### Client → Server Mesajları

**Odaya Katılma:**
```json
{
  "t": "JOIN_ROOM",
  "room": "QKBG",
  "nickname": "Kibex"
}
```

**Hazır Olma:**
```json
{
  "t": "READY"
}
```

**Oyuncu Hareketi:**
```json
{
  "t": "INPUT",
  "seq": 123,
  "move": [0.5, 0.3],
  "aim": [1.0, 0.0],
  "act": {
    "use": false
  }
}
```

**Item Alma:**
```json
{
  "t": "PICKUP",
  "itemId": "itm_42"
}
```

**Item Kullanma:**
```json
{
  "t": "USE_ITEM",
  "targetDir": [1.0, 0.0]
}
```

**Ping:**
```json
{
  "t": "PING",
  "n": 987
}
```

#### Server → Client Mesajları

**Oda Durumu:**
```json
{
  "t": "ROOM_STATE",
  "status": "WAITING",
  "players": {
    "p1": {
      "id": "p1",
      "nickname": "Kibex",
      "ready": true,
      "position": [10.5, 15.2]
    }
  },
  "you": "p1"
}
```

**Geri Sayım:**
```json
{
  "t": "COUNTDOWN",
  "s": 5
}
```

**Oyun Başladı:**
```json
{
  "t": "START",
  "matchId": "match_12345",
  "seed": 1234567890,
  "arena": "ring_v1"
}
```

**Oyun Snapshot'ı:**
```json
{
  "t": "SNAP",
  "tick": 512,
  "players": {
    "p1": {
      "id": "p1",
      "position": [10.5, 15.2],
      "velocity": [0.3, -0.1],
      "health": 100,
      "item": "TERLIK",
      "usesLeft": 3
    }
  },
  "items": [
    {
      "id": "itm_42",
      "type": "TERLIK",
      "position": [20.1, 30.5]
    }
  ],
  "events": [
    {
      "type": "PICKUP",
      "player": "p1",
      "item": "itm_42"
    }
  ]
}
```

**Item Alındı:**
```json
{
  "t": "PICKUP_OK",
  "itemId": "itm_42",
  "item": "TERLIK",
  "usesLeft": 3
}
```

**Vuruş:**
```json
{
  "t": "HIT",
  "hitBy": "p3",
  "item": "TERLIK",
  "to": "p1",
  "knock": [1.0, 0.0],
  "effect": "STUN",
  "durMs": 1500
}
```

**KO (Knock Out):**
```json
{
  "t": "KO",
  "who": "p1",
  "by": "p3"
}
```

**Oyun Bitti:**
```json
{
  "t": "END",
  "winner": "p3",
  "scores": [
    {
      "id": "p3",
      "name": "Kibex",
      "score": 150,
      "kills": 3,
      "deaths": 0
    },
    {
      "id": "p1",
      "name": "Player1",
      "score": 50,
      "kills": 1,
      "deaths": 1
    }
  ]
}
```

**Pong (Ping Yanıtı):**
```json
{
  "t": "PONG",
  "n": 987
}
```

**Hata Mesajı:**
```json
{
  "t": "ERR",
  "code": "ROOM_NOT_FOUND",
  "msg": "Oda bulunamadı"
}
```

## 🎮 WebSocket Mesajları

### Client → Server

```json
// Odaya katıl
{"t":"JOIN_ROOM","room":"AB12","nickname":"Kibex"}

// Hazır
{"t":"READY"}

// Hareket
{"t":"INPUT","seq":123,"move":[0.5,0.3],"aim":[1,0],"act":{"use":false}}

// Item al
{"t":"PICKUP","itemId":"itm_42"}

// Item kullan
{"t":"USE_ITEM","targetDir":[1,0]}

// Ping
{"t":"PING","n":987}
```

### Server → Client

```json
// Oda durumu
{"t":"ROOM_STATE","status":"WAITING","players":{...},"you":"p3"}

// Geri sayım
{"t":"COUNTDOWN","s":5}

// Oyun başladı
{"t":"START","matchId":"...","seed":12345,"arena":"ring_v1"}

// Snapshot
{"t":"SNAP","tick":512,"players":{...},"items":[...],"events":[...]}

// Item alındı
{"t":"PICKUP_OK","itemId":"itm_42","item":"TERLIK","usesLeft":3}

// Vuruş
{"t":"HIT","hitBy":"p3","item":"TERLIK","to":"p1","knock":[1,0],"effect":"STUN","durMs":1500}

// KO
{"t":"KO","who":"p1","by":"p3"}

// Oyun bitti
{"t":"END","winner":"p3","scores":[...]}
```

## 🎯 Oyun Özellikleri

### Item'ler

- **Terlik**: 3 kullanım, stun efekti
- **Çay**: 2 kullanım, slow efekti  
- **Karpuz**: 1 kullanım, yüksek hasar
- **Selfie Çubuğu**: 2 kullanım, blind efekti
- **Emoji Bombası**: 1 kullanım, stun efekti
- **Döner**: 2 kullanım, slow efekti

### Fizik

- Server-side fizik simülasyonu
- Çarpışma kontrolü
- Knockback sistemi
- Arena sınırları

### Skor Sistemi

- KO: +10 puan
- Son ayakta kalma bonusu
- Kalıcı skor kaydı

## 🔧 Konfigürasyon

Environment değişkenleri:

```bash
# Server
SERVER_PORT=8080
SERVER_HOST=0.0.0.0

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=arena_user
POSTGRES_PASSWORD=arena_password
POSTGRES_DB=arena_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Game
GAME_TICK_RATE=15
GAME_MATCH_DURATION=180
GAME_COUNTDOWN_DURATION=5
GAME_MAX_PLAYERS_PER_ROOM=10
GAME_ITEM_SPAWN_INTERVAL=20

# Logging
LOG_LEVEL=info
```

## 🧪 Test

```bash
# Unit testler
go test ./...

# Integration testler
go test ./internal/... -tags=integration

# Benchmark
go test -bench=. ./internal/sim/
```

## 📊 Monitoring

- Health check: `GET /healthz`
- Logging: Structured logging with logrus
- Metrics: Basic metrics (oda sayısı, aktif oyuncu)

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t arena-backend .

# Run container
docker run -d \
  --name arena-server \
  -p 8080:8080 \
  --env-file .env \
  arena-backend
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arena-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: arena-backend
  template:
    metadata:
      labels:
        app: arena-backend
    spec:
      containers:
      - name: arena-backend
        image: arena-backend:latest
        ports:
        - containerPort: 8080
        env:
        - name: POSTGRES_HOST
          value: "postgres-service"
        - name: REDIS_HOST
          value: "redis-service"
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🆘 Destek

Sorunlar için GitHub Issues kullanın veya iletişime geçin.
