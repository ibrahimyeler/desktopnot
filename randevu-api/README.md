# Randevu API Platformu

Go Echo ile geliştirilmiş modüler yapıda bir randevu platformu API'si.

## Özellikler

- **Üç farklı kullanıcı rolü**: Customer, Seller, Admin
- **JWT tabanlı kimlik doğrulama**
- **PostgreSQL veritabanı**
- **Modüler yapı**
- **RESTful API**

## Proje Yapısı

```
randevu-api/
├── cmd/server/          # Ana uygulama giriş noktası
├── internal/            # İç paketler
│   ├── handlers/        # HTTP handler'ları
│   │   ├── customer/    # Customer endpoint'leri
│   │   ├── seller/      # Seller endpoint'leri
│   │   ├── admin/       # Admin endpoint'leri
│   │   └── auth.go      # Kimlik doğrulama
│   ├── middleware/      # Middleware'ler
│   │   └── auth/        # JWT middleware
│   └── models/          # Veritabanı modelleri
├── pkg/                 # Genel paketler
│   └── database/        # Veritabanı bağlantısı
├── config.env          # Konfigürasyon dosyası
└── go.mod              # Go modül dosyası
```

## Kurulum

1. **PostgreSQL veritabanını kurun ve çalıştırın**

2. **Konfigürasyon dosyasını düzenleyin**
   ```bash
   cp config.env.example config.env
   # config.env dosyasını düzenleyin
   ```

3. **Bağımlılıkları yükleyin**
   ```bash
   go mod tidy
   ```

4. **Uygulamayı çalıştırın**
   ```bash
   go run cmd/server/main.go
   ```

## API Endpoint'leri

### Base URLs
- **Customer Panel**: `http://localhost:8080/api/v1/customer`
- **Seller Panel**: `http://localhost:8080/api/v1/seller`
- **Admin Panel**: `http://localhost:8080/api/v1/admin`

### Kimlik Doğrulama (Public)
- `POST /api/v1/auth/register` - Kullanıcı kaydı
- `POST /api/v1/auth/login` - Kullanıcı girişi

### Customer Endpoint'leri
- `GET /customer/profile` - Profil görüntüleme
- `PUT /customer/profile` - Profil güncelleme
- `GET /customer/appointments` - Randevuları görüntüleme
- `POST /customer/appointments` - Yeni randevu oluşturma
- `DELETE /customer/appointments/:id` - Randevu iptal etme

### Seller Endpoint'leri
- `GET /seller/profile` - Profil görüntüleme
- `PUT /seller/profile` - Profil güncelleme
- `GET /seller/appointments` - Randevuları görüntüleme
- `GET /seller/appointments/:id` - Randevu detayı
- `PUT /seller/appointments/:id/status` - Randevu durumu güncelleme
- `GET /seller/customers` - Müşterileri görüntüleme
- `GET /seller/stats` - İstatistikleri görüntüleme

### Admin Endpoint'leri
- `GET /admin/dashboard/stats` - Dashboard istatistikleri
- `GET /admin/users` - Tüm kullanıcıları görüntüleme
- `GET /admin/users/:id` - Kullanıcı detayı
- `PUT /admin/users/:id` - Kullanıcı güncelleme
- `DELETE /admin/users/:id` - Kullanıcı silme
- `GET /admin/appointments` - Tüm randevuları görüntüleme
- `GET /admin/appointments/:id` - Randevu detayı
- `PUT /admin/appointments/:id` - Randevu güncelleme
- `DELETE /admin/appointments/:id` - Randevu silme

## Kullanım Örnekleri

### Kullanıcı Kaydı
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "role": "customer"
  }'
```

### Kullanıcı Girişi
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'
```

### Randevu Oluşturma (Customer)
```bash
curl -X POST http://localhost:8080/api/v1/customer/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "seller_id": 2,
    "title": "Konsültasyon",
    "description": "İlk görüşme",
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T11:00:00Z",
    "location": "Ofis",
    "notes": "Önemli notlar"
  }'
```

### Profil Görüntüleme (Customer)
```bash
curl -X GET http://localhost:8080/api/v1/customer/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Randevu Durumu Güncelleme (Seller)
```bash
curl -X PUT http://localhost:8080/api/v1/seller/appointments/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

### Dashboard İstatistikleri (Admin)
```bash
curl -X GET http://localhost:8080/api/v1/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Geliştirme

### Yeni Endpoint Ekleme
1. İlgili handler dosyasına yeni fonksiyon ekleyin
2. `main.go` dosyasında route'u tanımlayın
3. Gerekirse yeni model veya middleware ekleyin

### Veritabanı Değişiklikleri
1. Model dosyalarını güncelleyin
2. `pkg/database/database.go` dosyasında AutoMigrate fonksiyonunu güncelleyin

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
