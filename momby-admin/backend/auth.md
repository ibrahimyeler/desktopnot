# Momby Authentication Service - Detaylı Dokümantasyon

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mimari ve Teknoloji Yığını](#mimari-ve-teknoloji-yığını)
3. [Kullanıcı Rolleri ve Yetkilendirme](#kullanıcı-rolleri-ve-yetkilendirme)
4. [Dil Desteği (i18n)](#dil-desteği-i18n)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [JWT Token Yapısı](#jwt-token-yapısı)
8. [Request/Response Örnekleri](#requestresponse-örnekleri)
9. [Güvenlik Özellikleri](#güvenlik-özellikleri)
10. [Multi-Factor Authentication (MFA)](#multi-factor-authentication-mfa)
11. [Kurulum ve Konfigürasyon](#kurulum-ve-konfigürasyon)
12. [Hata Yönetimi](#hata-yönetimi)
13. [Rate Limiting](#rate-limiting)
14. [Best Practices](#best-practices)
15. [Test Örnekleri](#test-örnekleri)

---

## 🎯 Genel Bakış

Momby Authentication Service, platformun kimlik doğrulama ve yetkilendirme işlemlerini yöneten merkezi bir mikroservistir. NestJS framework'ü ile geliştirilmiş olup, JWT tabanlı authentication, role-based access control (RBAC), multi-factor authentication (MFA) ve güvenli şifre yönetimi gibi özellikler sunar.

### Temel Özellikler

- ✅ **JWT Tabanlı Authentication:** Access ve refresh token mekanizması
- ✅ **Role-Based Access Control (RBAC):** Kullanıcı rolleri ve yetkilendirme
- ✅ **Multi-Factor Authentication (MFA):** İki faktörlü kimlik doğrulama
- ✅ **Email Verification:** Email doğrulama sistemi
- ✅ **Password Reset:** Güvenli şifre sıfırlama akışı
- ✅ **Session Management:** Token yönetimi ve logout işlemleri
- ✅ **Bcrypt Password Hashing:** Güvenli şifre saklama
- ✅ **Rate Limiting:** Brute force saldırılarına karşı koruma

---

## 🏗️ Mimari ve Teknoloji Yığını

### Teknoloji Stack

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Framework** | NestJS | 10.3+ |
| **Language** | TypeScript | 5.3+ |
| **Database** | PostgreSQL | 15+ |
| **ORM** | TypeORM | 0.3.17+ |
| **Authentication** | Passport.js + JWT | - |
| **Password Hashing** | bcrypt | 5.1+ |
| **Validation** | class-validator | 0.14+ |
| **Caching** | Redis | 7+ (opsiyonel) |

### Proje Yapısı

```
auth-service/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── auth/
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.service.ts     # Auth business logic
│   │   ├── auth.module.ts      # Auth module
│   │   ├── dto/                # Data Transfer Objects
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   ├── forgot-password.dto.ts
│   │   │   └── reset-password.dto.ts
│   │   ├── guards/             # Authentication guards
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   └── strategies/         # Passport strategies
│   │       ├── jwt.strategy.ts
│   │       └── local.strategy.ts
│   ├── users/
│   │   ├── users.service.ts    # User management
│   │   ├── users.module.ts     # Users module
│   │   └── entities/
│   │       └── user.entity.ts  # User database model
│   └── roles/
│       └── roles.module.ts     # Roles module
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## 👥 Kullanıcı Rolleri ve Yetkilendirme

### Roller

Momby platformu aşağıdaki kullanıcı rollerini destekler:

| Rol | Açıklama | Yetkiler |
|-----|----------|----------|
| **customer** | Müşteri | Temel platform kullanımı, profil yönetimi |
| **vendor** | Satıcı | Ürün/hizmet yönetimi, sipariş görüntüleme |
| **admin** | Yönetici | Tüm platform yönetimi, kullanıcı yönetimi |
| **moderator** | Moderatör | İçerik moderasyonu, kullanıcı şikayetleri |
| **support** | Destek | Müşteri destek işlemleri |

### Role-Based Access Control (RBAC)

RBAC, endpoint'lere erişimi kontrol etmek için kullanılır:

```typescript
// Örnek: Admin-only endpoint
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Get('admin/users')
async getAllUsers() {
  // Sadece admin rolüne sahip kullanıcılar erişebilir
}
```

---

## 🌍 Dil Desteği (i18n)

### Desteklenen Diller

Momby Authentication Service, platformun hedef kitlesine uygun olarak aşağıdaki dilleri destekler:

| Dil Kodu | Dil | Durum | Açıklama |
|----------|-----|-------|----------|
| **tr** | Türkçe | ✅ Aktif | Ana dil - Türkiye pazarı için |
| **en** | İngilizce | ✅ Aktif | İkinci dil - Uluslararası kullanım |

### Dil Belirleme

Dil tercihi aşağıdaki yöntemlerle belirlenebilir:

#### 1. HTTP Header (Önerilen)
```
Accept-Language: tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7
```

#### 2. Query Parameter
```
POST /auth/register?lang=tr
POST /auth/login?lang=en
```

#### 3. Request Body
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "preferredLanguage": "tr"
}
```

#### 4. User Profile (Kayıtlı kullanıcılar için)
Kullanıcı kaydı sırasında veya profil güncellemesinde dil tercihi kaydedilir:

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "preferredLanguage": "tr",
  ...
}
```

### Öncelik Sırası

Dil belirleme öncelik sırası:

1. **Request Body** `preferredLanguage` (en yüksek öncelik)
2. **Query Parameter** `lang`
3. **HTTP Header** `Accept-Language`
4. **User Profile** `preferredLanguage` (kayıtlı kullanıcılar için)
5. **Default:** `tr` (Türkçe)

### Kullanım Senaryoları

#### 1. Kayıt Sırasında Dil Tercihi

```typescript
// RegisterDto'ya dil alanı eklenir
export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredLanguage?: string; // 'tr' | 'en'
  phone?: string;
}
```

**Request:**
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "preferredLanguage": "en"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "preferredLanguage": "en",
    ...
  },
  "access_token": "...",
  "refresh_token": "..."
}
```

#### 2. Hata Mesajları

Dil tercihine göre hata mesajları döner:

**Türkçe (tr):**
```json
{
  "statusCode": 401,
  "message": "Geçersiz email veya şifre",
  "error": "Yetkisiz Erişim"
}
```

**İngilizce (en):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

#### 3. Email Şablonları

Şifre sıfırlama ve email doğrulama email'leri kullanıcının dil tercihine göre gönderilir:

**Türkçe Email:**
```
Konu: Şifre Sıfırlama Talebi

Merhaba John,

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
https://momby.com/reset-password?token=xyz123

Bu link 1 saat geçerlidir.
```

**İngilizce Email:**
```
Subject: Password Reset Request

Hello John,

Click the link below to reset your password:
https://momby.com/reset-password?token=xyz123

This link is valid for 1 hour.
```

### Dil Kodları

| Dil Kodu | ISO 639-1 | ISO 3166-1 | Kullanım |
|----------|-----------|------------|----------|
| `tr` | tr | TR | Türkiye Türkçesi |
| `en` | en | US/GB | İngilizce (US/GB) |

### Dil Değiştirme

Kullanıcı profil güncellemesi ile dil tercihini değiştirebilir:

```json
PUT /auth/profile
Authorization: Bearer {access_token}

{
  "preferredLanguage": "en"
}
```

### Geliştirme Notları

- **i18n Kütüphanesi:** NestJS için `nestjs-i18n` kullanılabilir
- **Translation Dosyaları:** `src/i18n/` klasöründe tutulur:
  ```
  i18n/
  ├── tr/
  │   ├── auth.json
  │   ├── validation.json
  │   └── errors.json
  └── en/
      ├── auth.json
      ├── validation.json
      └── errors.json
  ```

### Örnek Translation Dosyası

**i18n/tr/auth.json:**
```json
{
  "register": {
    "success": "Kayıt başarılı",
    "emailExists": "Bu email adresi zaten kullanılıyor"
  },
  "login": {
    "success": "Giriş başarılı",
    "invalid": "Geçersiz email veya şifre",
    "mfaRequired": "İki faktörlü kimlik doğrulama gerekli"
  },
  "password": {
    "resetSuccess": "Şifre başarıyla sıfırlandı",
    "resetEmailSent": "Şifre sıfırlama linki email adresinize gönderildi"
  }
}
```

**i18n/en/auth.json:**
```json
{
  "register": {
    "success": "Registration successful",
    "emailExists": "Email address already exists"
  },
  "login": {
    "success": "Login successful",
    "invalid": "Invalid email or password",
    "mfaRequired": "Multi-factor authentication required"
  },
  "password": {
    "resetSuccess": "Password reset successfully",
    "resetEmailSent": "Password reset link sent to your email"
  }
}
```

### NestJS i18n Entegrasyonu

```typescript
// app.module.ts
import { I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'tr',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

```typescript
// auth.controller.ts
import { I18nLang } from 'nestjs-i18n';

@Controller('auth')
export class AuthController {
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @I18nLang() lang: string,
  ) {
    return this.authService.register(registerDto, lang);
  }
}
```

---

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/auth
```

### 1. Kullanıcı Kaydı

**Endpoint:** `POST /auth/register`

**Açıklama:** Yeni kullanıcı kaydı oluşturur ve JWT token'ları döner.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+905551234567" // Opsiyonel
}
```

**Validation Rules:**
- `email`: Geçerli email formatı, unique
- `password`: Minimum 8 karakter
- `firstName`: Required string
- `lastName`: Required string
- `phone`: Opsiyonel, geçerli telefon formatı

**Response (201 Created):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "isEmailVerified": false,
    "mfaEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Hata Durumları:**
- `400 Bad Request`: Validation hatası
- `409 Conflict`: Email zaten kullanılıyor

---

### 2. Kullanıcı Girişi

**Endpoint:** `POST /auth/login`

**Açıklama:** Email ve şifre ile kullanıcı girişi yapar.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "mfaEnabled": true
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**MFA Aktifse:**
```json
{
  "mfaRequired": true,
  "tempToken": "temporary-token-for-mfa-verification"
}
```

**Hata Durumları:**
- `401 Unauthorized`: Geçersiz email veya şifre
- `429 Too Many Requests`: Rate limit aşıldı

---

### 3. Token Yenileme

**Endpoint:** `POST /auth/refresh`

**Açıklama:** Refresh token kullanarak yeni access token alır.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Hata Durumları:**
- `401 Unauthorized`: Geçersiz veya süresi dolmuş refresh token

---

### 4. Çıkış Yapma

**Endpoint:** `POST /auth/logout`

**Açıklama:** Kullanıcı çıkışı yapar ve token'ları geçersiz kılar.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 5. Şifremi Unuttum

**Endpoint:** `POST /auth/forgot-password`

**Açıklama:** Email adresine şifre sıfırlama linki gönderir.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If email exists, a reset link has been sent"
}
```

**Not:** Güvenlik nedeniyle, email mevcut olsun ya da olmasın aynı mesaj döner.

**Email Template:**
```
Konu: Şifre Sıfırlama Talebi

Merhaba,

Şifrenizi sıfırlamak için aşağıdaki linke tıklayın:
https://momby.com/reset-password?token={reset_token}

Bu link 1 saat geçerlidir.

Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.
```

---

### 6. Şifre Sıfırlama

**Endpoint:** `POST /auth/reset-password`

**Açıklama:** Reset token ile yeni şifre belirler.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Hata Durumları:**
- `400 Bad Request`: Geçersiz veya süresi dolmuş token
- `400 Bad Request`: Şifre gereksinimlerini karşılamıyor

---

### 7. Email Doğrulama

**Endpoint:** `POST /auth/verify-email`

**Açıklama:** Email doğrulama token'ı ile email'i doğrular.

**Request Body:**
```json
{
  "token": "email-verification-token"
}
```

**Response (200 OK):**
```json
{
  "message": "Email verified successfully"
}
```

---

### 8. Kullanıcı Profili

**Endpoint:** `GET /auth/me`

**Açıklama:** Mevcut kullanıcının profil bilgilerini getirir.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+905551234567",
  "role": "customer",
  "isEmailVerified": true,
  "mfaEnabled": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Hata Durumları:**
- `401 Unauthorized`: Geçersiz veya eksik token

---

### 9. Profil Güncelleme

**Endpoint:** `PUT /auth/profile`

**Açıklama:** Kullanıcı profil bilgilerini günceller.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+905559876543"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+905559876543",
  "role": "customer",
  "updatedAt": "2024-01-15T11:00:00Z"
}
```

**Not:** Email ve role alanları güvenlik nedeniyle bu endpoint üzerinden değiştirilemez.

---

### 10. MFA Etkinleştirme

**Endpoint:** `POST /auth/mfa/enable`

**Açıklama:** İki faktörlü kimlik doğrulamayı etkinleştirir ve QR kod döner.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "backupCodes": [
    "1234-5678",
    "2345-6789",
    "3456-7890"
  ]
}
```

**Kullanım:**
1. QR kodu Google Authenticator veya benzeri bir uygulamayla tarayın
2. `/auth/mfa/verify` endpoint'i ile kodu doğrulayın
3. Backup kodları güvenli bir yerde saklayın

---

### 11. MFA Doğrulama

**Endpoint:** `POST /auth/mfa/verify`

**Açıklama:** MFA kodunu doğrular ve MFA'yı aktif eder.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "verified": true,
  "message": "MFA enabled successfully"
}
```

**Hata Durumları:**
- `400 Bad Request`: Geçersiz MFA kodu
- `401 Unauthorized`: Token hatası

---

## 🔄 Authentication Flow

### 1. Kayıt Akışı

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /auth/register
     ├─────────────────────────┐
     │                         │
┌────▼──────────────┐         │
│  Auth Service     │         │
│  - Validate data  │         │
│  - Hash password  │◄────────┤
│  - Create user    │         │
│  - Generate JWT   │         │
└────┬──────────────┘         │
     │                         │
     │ 2. Response with tokens │
     ├─────────────────────────┘
┌────▼────┐
│ Client  │
└─────────┘
```

### 2. Giriş Akışı (MFA Olmadan)

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /auth/login
     ├───────────────────────────┐
     │                           │
┌────▼──────────────┐           │
│  Auth Service     │           │
│  - Validate creds │           │
│  - Check MFA      │           │
│  - Generate JWT   │           │
└────┬──────────────┘           │
     │                           │
     │ 2. Response with tokens   │
     ├───────────────────────────┘
┌────▼────┐
│ Client  │
└─────────┘
```

### 3. Giriş Akışı (MFA ile)

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /auth/login
     ├─────────────────────┐
     │                     │
┌────▼──────────────┐     │
│  Auth Service     │     │
│  - Validate creds │     │
│  - Check MFA: ✓   │     │
└────┬──────────────┘     │
     │                     │
     │ 2. MFA Required     │
     ├─────────────────────┘
┌────▼────┐
│ Client  │
│         │
│ 3. User enters MFA code │
│    POST /auth/mfa/login │
└────┬────┘
     │
     ├─────────────────────┐
     │                     │
┌────▼──────────────┐     │
│  Auth Service     │     │
│  - Verify MFA     │     │
│  - Generate JWT   │     │
└────┬──────────────┘     │
     │                     │
     │ 4. Response with tokens
     ├─────────────────────┘
┌────▼────┐
│ Client  │
└─────────┘
```

### 4. Token Yenileme Akışı

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /auth/refresh
     │    { refresh_token }
     ├─────────────────────────┐
     │                         │
┌────▼──────────────┐         │
│  Auth Service     │         │
│  - Verify token   │         │
│  - Check blacklist│         │
│  - Generate new   │         │
│    tokens         │         │
└────┬──────────────┘         │
     │                         │
     │ 2. New access_token     │
     │    & refresh_token      │
     ├─────────────────────────┘
┌────▼────┐
│ Client  │
└─────────┘
```

---

## 🔐 JWT Token Yapısı

### Access Token

**Süre:** 15 dakika (varsayılan)

**Payload Örneği:**
```json
{
  "email": "user@example.com",
  "sub": "user-uuid",
  "role": "customer",
  "iat": 1705313400,
  "exp": 1705314300
}
```

**Header:**
```
Authorization: Bearer {access_token}
```

### Refresh Token

**Süre:** 7 gün (varsayılan)

**Payload Örneği:**
```json
{
  "email": "user@example.com",
  "sub": "user-uuid",
  "role": "customer",
  "type": "refresh",
  "iat": 1705313400,
  "exp": 1705921800
}
```

### Token Doğrulama

```typescript
// JWT Strategy ile otomatik doğrulama
@UseGuards(JwtAuthGuard)
@Get('protected-endpoint')
async protectedEndpoint(@Request() req) {
  // req.user otomatik olarak payload'tan doldurulur
  return req.user;
}
```

---

## 📝 Request/Response Örnekleri

### cURL Örnekleri

#### Kayıt
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Giriş
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

#### Token Yenileme
```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

#### Profil Bilgisi
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer {access_token}"
```

### JavaScript/TypeScript Örnekleri

```typescript
// Axios kullanarak
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/auth';

// Kayıt
async function register(email: string, password: string, firstName: string, lastName: string) {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    email,
    password,
    firstName,
    lastName
  });
  
  // Token'ları localStorage'a kaydet
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  
  return response.data;
}

// Giriş
async function login(email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password
  });
  
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  
  return response.data;
}

// Token ile istek
async function getProfile() {
  const token = localStorage.getItem('access_token');
  
  const response = await axios.get(`${API_BASE_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
}

// Token yenileme
async function refreshToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await axios.post(`${API_BASE_URL}/refresh`, {
    refresh_token: refreshToken
  });
  
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  
  return response.data;
}
```

### Flutter/Dart Örnekleri

```dart
import 'package:dio/dio.dart';

class AuthService {
  final Dio dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000/auth',
    headers: {'Content-Type': 'application/json'},
  ));

  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
    required String firstName,
    required String lastName,
  }) async {
    final response = await dio.post('/register', data: {
      'email': email,
      'password': password,
      'firstName': firstName,
      'lastName': lastName,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await dio.post('/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getProfile(String accessToken) async {
    final response = await dio.get(
      '/me',
      options: Options(
        headers: {'Authorization': 'Bearer $accessToken'},
      ),
    );
    return response.data;
  }
}
```

---

## 🛡️ Güvenlik Özellikleri

### 1. Password Hashing

- **Algoritma:** bcrypt
- **Salt Rounds:** 10 (varsayılan)
- **Özellikler:** 
  - Tek yönlü hash fonksiyonu
  - Her hash için benzersiz salt
  - Rainbow table saldırılarına karşı korumalı

```typescript
// Password hashing örneği
const hashedPassword = await bcrypt.hash(password, 10);

// Password doğrulama
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. JWT Security

- **Algorithm:** HS256 (HMAC SHA-256)
- **Secret Key:** Environment variable'dan alınır
- **Token Expiration:**
  - Access Token: 15 dakika
  - Refresh Token: 7 gün
- **Token Blacklist:** Redis ile token blacklist desteği

### 3. CORS (Cross-Origin Resource Sharing)

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
});
```

### 4. Input Validation

- **class-validator** ile DTO validation
- XSS ve SQL injection koruması
- Email format validation
- Password strength requirements

### 5. Rate Limiting

- Login endpoint: 5 deneme / 15 dakika / IP
- Register endpoint: 3 kayıt / saat / IP
- Password reset: 3 istek / saat / email

### 6. Password Requirements

- Minimum 8 karakter
- Büyük harf içermeli
- Küçük harf içermeli
- Rakam içermeli
- Özel karakter içermeli (opsiyonel)

---

## 🔒 Multi-Factor Authentication (MFA)

### MFA Nedir?

Multi-Factor Authentication, kullanıcı kimliğini doğrulamak için birden fazla faktör kullanır:

1. **Bilinen:** Şifre (Something you know)
2. **Sahip Olunan:** Authenticator uygulaması (Something you have)

### MFA Akışı

1. **Etkinleştirme:**
   ```
   POST /auth/mfa/enable
   → Secret ve QR kod alınır
   → Authenticator uygulamasına eklenir
   ```

2. **Doğrulama:**
   ```
   POST /auth/mfa/verify
   → 6 haneli kod gönderilir
   → Kod doğrulanır
   → MFA aktif edilir
   ```

3. **Giriş (MFA ile):**
   ```
   POST /auth/login
   → Email/şifre doğrulanır
   → MFA gerekli mesajı döner
   
   POST /auth/mfa/login
   → MFA kodu gönderilir
   → Kod doğrulanır
   → Token'lar döner
   ```

### MFA Desteklenen Uygulamalar

- Google Authenticator
- Microsoft Authenticator
- Authy
- Duo Mobile
- 1Password
- LastPass Authenticator

### Backup Codes

MFA etkinleştirildiğinde, kullanıcıya backup kodlar verilir:

```
1234-5678
2345-6789
3456-7890
...
```

Bu kodlar, cihaz kaybı durumunda MFA'yı bypass etmek için kullanılabilir (tek kullanımlık).

---

## ⚙️ Kurulum ve Konfigürasyon

### Environment Variables

`.env` dosyası oluşturun:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/momby_auth

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Redis (opsiyonel - token blacklist için)
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (opsiyonel - şifre reset için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

# MFA (opsiyonel)
MFA_ISSUER_NAME=Momby
```

### Kurulum Adımları

1. **Bağımlılıkları yükleyin:**
```bash
cd node/services/auth-service
npm install
```

2. **Veritabanını hazırlayın:**
```bash
# PostgreSQL'de veritabanı oluşturun
createdb momby_auth

# Migration'ları çalıştırın (TypeORM otomatik sync edebilir)
npm run migration:run
```

3. **Environment variable'ları ayarlayın:**
```bash
cp .env.example .env
# .env dosyasını düzenleyin
```

4. **Uygulamayı başlatın:**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### Docker ile Kurulum

```bash
# Docker image oluştur
docker build -t momby-auth-service .

# Container çalıştır
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET=your-secret \
  momby-auth-service
```

---

## ❌ Hata Yönetimi

### HTTP Status Kodları

| Kod | Açıklama | Kullanım |
|-----|----------|----------|
| **200** | OK | Başarılı işlem |
| **201** | Created | Kayıt başarılı |
| **400** | Bad Request | Validation hatası |
| **401** | Unauthorized | Authentication hatası |
| **403** | Forbidden | Yetki yetersiz |
| **404** | Not Found | Kaynak bulunamadı |
| **409** | Conflict | Email zaten kullanılıyor |
| **429** | Too Many Requests | Rate limit aşıldı |
| **500** | Internal Server Error | Sunucu hatası |

### Hata Response Formatı

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "property": "email",
      "constraints": {
        "isEmail": "email must be an email"
      }
    },
    {
      "property": "password",
      "constraints": {
        "minLength": "password must be longer than or equal to 8 characters"
      }
    }
  ]
}
```

### Özel Hata Durumları

#### Geçersiz Kimlik Bilgileri
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

#### Token Süresi Dolmuş
```json
{
  "statusCode": 401,
  "message": "Token expired",
  "error": "Unauthorized"
}
```

#### Email Zaten Kullanılıyor
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

#### Rate Limit Aşıldı
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests",
  "retryAfter": 900
}
```

---

## 🚦 Rate Limiting

### Limitler

| Endpoint | Limit | Süre | Strateji |
|----------|-------|------|----------|
| `/auth/login` | 5 | 15 dakika | IP bazlı |
| `/auth/register` | 3 | 1 saat | IP bazlı |
| `/auth/forgot-password` | 3 | 1 saat | Email bazlı |
| `/auth/reset-password` | 5 | 1 saat | IP bazlı |
| `/auth/refresh` | 10 | 1 dakika | Token bazlı |

### Rate Limit Response

```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later",
  "error": "Too Many Requests",
  "retryAfter": 900,
  "limit": 5,
  "remaining": 0,
  "resetTime": "2024-01-15T11:00:00Z"
}
```

### Header Bilgileri

Response header'larında rate limit bilgileri:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1705314300
Retry-After: 900
```

---

## ✅ Best Practices

### 1. Token Yönetimi

- ✅ Access token'ları **short-lived** (15 dakika) tutun
- ✅ Refresh token'ları **secure storage**'da saklayın (httpOnly cookie önerilir)
- ✅ Token'ları HTTPS üzerinden iletin
- ✅ Logout'ta token'ları blacklist'e ekleyin
- ✅ Token rotation kullanın

### 2. Şifre Yönetimi

- ✅ Minimum 8 karakter zorunlu
- ✅ Büyük/küçük harf, rakam, özel karakter kombinasyonu
- ✅ bcrypt ile hash'leme (salt rounds: 10+)
- ✅ Şifre değişikliğinde eski şifre kontrolü
- ✅ Şifre geçmişi kontrolü (son 5 şifre)

### 3. Güvenlik

- ✅ HTTPS kullanın (production)
- ✅ Environment variable'ları güvenli saklayın
- ✅ CORS'i sınırlandırın
- ✅ Rate limiting uygulayın
- ✅ Input validation yapın
- ✅ SQL injection koruması (ORM kullanımı)
- ✅ XSS koruması

### 4. Error Handling

- ✅ Genel hata mesajları gösterin (detaylı bilgi vermeyin)
- ✅ Log'larda detaylı bilgi tutun
- ✅ Sensitive bilgileri log'lara yazmayın
- ✅ Structured error responses kullanın

### 5. Monitoring

- ✅ Failed login attempts log'layın
- ✅ Suspicious activity monitoring
- ✅ Token usage analytics
- ✅ Performance metrics

---

## 🧪 Test Örnekleri

### Unit Test Örneği

```typescript
// auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a new user', async () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const mockUser = {
      id: 'uuid',
      ...registerDto,
      password: hashedPassword,
      role: 'customer',
    };

    jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');

    const result = await service.register(registerDto);

    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('access_token');
    expect(result).toHaveProperty('refresh_token');
  });

  it('should validate user credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const mockUser = {
      id: 'uuid',
      email,
      password: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
    };

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);

    const result = await service.validateUser(email, password);

    expect(result).toHaveProperty('email', email);
    expect(result).not.toHaveProperty('password');
  });
});
```

### Integration Test Örneği

```typescript
// auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('user');
        expect(res.body).toHaveProperty('access_token');
      });
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Postman Collection

```json
{
  "info": {
    "name": "Momby Auth Service",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"SecurePass123!\",\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/register",
          "host": ["{{base_url}}"],
          "path": ["auth", "register"]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"SecurePass123!\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/auth/login",
          "host": ["{{base_url}}"],
          "path": ["auth", "login"]
        }
      }
    }
  ]
}
```

---

## 📚 Ek Kaynaklar

### Dokümantasyon

- [NestJS Documentation](https://docs.nestjs.com)
- [Passport.js Documentation](http://www.passportjs.org)
- [JWT.io](https://jwt.io)
- [TypeORM Documentation](https://typeorm.io)

### Güvenlik

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### İletişim

- **Email:** dev@momby.com
- **GitHub:** https://github.com/momby

---

## 📝 Changelog

### v1.0.0 (2024-01-15)
- İlk sürüm
- JWT authentication
- User registration ve login
- Password reset
- Email verification
- MFA desteği

---

**Son Güncelleme:** 2024-01-15

Bu dokümantasyon Momby ekibi tarafından hazırlanmıştır. 💙

