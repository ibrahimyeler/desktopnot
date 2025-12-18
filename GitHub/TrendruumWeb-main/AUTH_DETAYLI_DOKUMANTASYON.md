# 🔐 Authentication İşlemleri - Detaylı Dokümantasyon

Bu dokümantasyon, Trendruum web uygulamasındaki tüm authentication (kimlik doğrulama) işlemlerinin mantığını, arayüzlerini ve endpoint'lerini detaylı olarak açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Kayıt İşlemi (Register)](#1-kayıt-işlemi-register)
3. [Giriş İşlemi (Login)](#2-giriş-işlemi-login)
4. [Şifremi Unuttum (Forgot Password)](#3-şifremi-unuttum-forgot-password)
5. [Şifre Yenileme (Reset Password)](#4-şifre-yenileme-reset-password)
6. [AuthContext ve Token Yönetimi](#authcontext-ve-token-yönetimi)
7. [Akış Diyagramları](#akış-diyagramları)
8. [Hata Senaryoları ve Çözümleri](#hata-senaryoları-ve-çözümleri)

---

## 🔍 Genel Bakış

**Base URL:** `https://api.trendruum.com/api/v1`

**Authentication Yöntemi:** Bearer Token (JWT)

**Token Saklama:**
- `localStorage.setItem('token', token)` - Ana token saklama
- `document.cookie = 'token=${token}; path=/; max-age=2592000'` - Cookie (30 gün)

**Token Kullanımı:**
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Desteklenen Yöntemler:**
- ✅ Email ile kayıt/giriş
- ✅ Telefon ile kayıt/giriş
- ✅ Email ile şifre sıfırlama
- ✅ Telefon ile şifre sıfırlama

---

## 1. Kayıt İşlemi (Register)

### 📄 Sayfa Bilgileri

**Dosya Yapısı:**
- Server Component: `app/kayit-ol/page.tsx`
- Client Component: `app/kayit-ol/SignUpPageClient.tsx` (Email ile kayıt)
- Client Component: `app/kayit-ol/page.tsx` içinde `SignUpPage` (Telefon ve Email ile kayıt)

**URL:** `/kayit-ol`

**Özellikler:**
- Email veya Telefon ile kayıt seçeneği
- Şifre gücü kontrolü (real-time)
- Email/Telefon doğrulama kodu sistemi
- KVKK onayları (zorunlu)
- Responsive tasarım (mobil/desktop)
- Swipe gesture desteği (mobil)

---

### 📧 Email ile Kayıt

#### Arayüz Detayları

**Form Alanları:**
1. **İsim** (required)
   - Placeholder: "İsim"
   - Validasyon: Boş olamaz

2. **Soyisim** (required)
   - Placeholder: "Soyisim"
   - Validasyon: Boş olamaz

3. **E-posta** (required)
   - Placeholder: "E-posta adresi"
   - Validasyon: Email formatı kontrolü (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
   - Icon: EnvelopeIcon

4. **Şifre** (required)
   - Placeholder: "Şifre"
   - Type: password/text (göster/gizle butonu)
   - Validasyon:
     - Minimum 10 karakter
     - En az 1 büyük harf (A-Z)
     - En az 1 küçük harf (a-z)
     - En az 1 rakam (0-9)
     - Email ile aynı olamaz
   - Şifre gücü göstergesi: Zayıf/Orta/Güçlü (real-time)

5. **Cinsiyet** (optional)
   - Radio button: Kadın / Erkek
   - Değerler: "female" / "male"

6. **KVKK Onayları** (required - 3 adet)
   - ✅ Kişisel verilerin işlenmesine açık rıza
   - ✅ Elektronik ileti gönderilmesi onayı
   - ✅ Aydınlatma metnini okuduğunu onaylama

#### Mantık ve İşleyiş

**1. Form Validasyonu:**
```typescript
// Client-side validasyon
if (!email || !password || !firstName || !lastName) {
  toast.error('İsim, soyisim, e-posta ve şifre alanları zorunludur.');
  return;
}

// Email format kontrolü
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(trimmedEmail)) {
  toast.error('Geçerli bir e-posta adresi giriniz.');
  return;
}

// Şifre gereksinimleri
const passwordMeetsRequirements =
  password.length >= 10 &&
  /[A-Z]/.test(password) &&
  /[a-z]/.test(password) &&
  /[0-9]/.test(password);

if (!passwordMeetsRequirements) {
  toast.error('Şifreniz en az 10 karakter olmalı; en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.');
  return;
}

// KVKK onayları
if (!dataProcessing || !emailConsent || !privacyPolicy) {
  toast.error('Tüm onayları vermelisiniz.');
  return;
}
```

**2. Kayıt İsteği:**
```typescript
const registerResponse = await fetch(`${API_V1_URL}/auth/register`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: trimmedEmail,
    password: password,
    name: trimmedFirstName,
    lastname: trimmedLastName,
    gender: gender || undefined,
    device_name: 'web'
  })
});
```

**3. Başarılı Kayıt Sonrası:**
- Email doğrulama popup'ı gösterilir
- `pendingUserEmail` ve `pendingUserPassword` localStorage'a kaydedilir
- 6 haneli doğrulama kodu e-postaya gönderilir
- 10 dakika geri sayım başlar

#### Endpoint: `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John",
  "lastname": "Doe",
  "gender": "male",
  "device_name": "web"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Registration successful",
    "code": 200
  },
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com"
    }
  }
}
```

**Response (Hata - Email mevcut):**
```json
{
  "meta": {
    "status": "error",
    "message": "duplicated_code",
    "code": 400
  }
}
```

**Not:** Email mevcut olsa bile doğrulama popup'ı gösterilir (kullanıcı zaten kayıtlı olabilir).

---

### 📱 Telefon ile Kayıt

#### Arayüz Detayları

**Form Alanları:**
1. **İsim** (required)
2. **Soyisim** (required)
3. **Telefon** (required)
   - Placeholder: "Telefon (11 hane, örn: 05459092349)"
   - MaxLength: 11
   - Validasyon: `/^0\d{10}$/` (11 haneli, 0 ile başlamalı)
   - Icon: PhoneIcon
   - Sadece rakam kabul eder

4. **Şifre** (required)
   - Aynı validasyonlar (Email ile kayıt ile aynı)
   - Telefon numarası ile aynı olamaz

5. **Cinsiyet** (optional)
6. **KVKK Onayları** (required)

#### Mantık ve İşleyiş

**1. Telefon Validasyonu:**
```typescript
const phoneRegex = /^0\d{10}$/;
const cleanedPhone = phone.replace(/\s/g, '');

if (!phoneRegex.test(cleanedPhone)) {
  toast.error('Geçerli bir telefon numarası giriniz. (11 rakam, örn: 05459092349)');
  return;
}
```

**2. Kayıt İsteği:**
```typescript
const registerEndpoint = `${API_V1_URL}/customer/auth/register`;

const requestBody = {
  password: password,
  name: trimmedFirstName,
  lastname: trimmedLastName,
  phone: cleanedPhone,
  gender: gender || undefined
};

const registerResponse = await fetch(registerEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(requestBody)
});
```

**3. Başarılı Kayıt Sonrası:**
- Telefon doğrulama popup'ı gösterilir
- `pendingUserPhone` ve `pendingUserPassword` localStorage'a kaydedilir
- 6 haneli doğrulama kodu SMS ile gönderilir
- 10 dakika geri sayım başlar

#### Endpoint: `POST /api/v1/customer/auth/register`

**Request Body:**
```json
{
  "phone": "05459092349",
  "password": "Password123",
  "name": "John",
  "lastname": "Doe",
  "gender": "male"
}
```

**Response:** Email ile kayıt ile aynı format.

---

### ✅ Email/Telefon Doğrulama

#### Arayüz Detayları

**Popup Özellikleri:**
- 6 haneli kod input'ları (her biri ayrı input)
- Otomatik input geçişi (kod girildiğinde sonraki input'a geçer)
- Backspace ile geri gitme
- 10 dakika geri sayım timer'ı
- "Kodu Tekrar Gönder" butonu (timer bitince aktif)

#### Mantık ve İşleyiş

**1. Kod Doğrulama (Email):**
```typescript
const response = await fetch(`${API_V1_URL}/auth/validate-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: userEmail,
    code: code,
    device_name: 'web'
  })
});
```

**2. Kod Doğrulama (Telefon):**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/validate-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: userPhone,
    code: code
  })
});
```

**3. Başarılı Doğrulama Sonrası:**
- Otomatik login yapılır
- Token localStorage ve cookie'ye kaydedilir
- Kullanıcı bilgileri fetch edilir
- Ana sayfaya yönlendirilir (`/`)

#### Endpoint: `POST /api/v1/auth/validate-code` (Email)

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "device_name": "web"
}
```

#### Endpoint: `POST /api/v1/customer/auth/validate-code` (Telefon)

**Request Body:**
```json
{
  "phone": "05459092349",
  "code": "123456"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Code validated successfully",
    "code": 200
  }
}
```

---

### 🔄 Kod Yeniden Gönderme

#### Endpoint: `POST /api/v1/auth/resend-code` (Email)

**Request Body:**
```json
{
  "email": "user@example.com",
  "device_name": "web"
}
```

#### Endpoint: `POST /api/v1/customer/auth/resend-code` (Telefon)

**Request Body:**
```json
{
  "phone": "05459092349"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Code resent successfully",
    "code": 200
  }
}
```

**Özellikler:**
- Timer 10 dakikaya sıfırlanır
- Kod input'ları temizlenir
- Başarı mesajı gösterilir

---

## 2. Giriş İşlemi (Login)

### 📄 Sayfa Bilgileri

**Dosya Yapısı:**
- Server Component: `app/giris/page.tsx`
- Client Component: `app/giris/LoginClient.tsx`

**URL:** `/giris`

**Özellikler:**
- Email veya Telefon ile giriş (tek input alanı)
- Şifre göster/gizle
- "Şifremi unuttum" linki
- Responsive tasarım
- Swipe gesture desteği (mobil)

---

### 📧 Email ile Giriş

#### Arayüz Detayları

**Form Alanları:**
1. **E-posta veya Telefon** (required)
   - Placeholder: "E-posta veya Telefon"
   - AutoComplete: "username"
   - Validasyon: Email formatı (`@` karakteri ile tespit edilir)

2. **Şifre** (required)
   - Placeholder: "Şifre"
   - Type: password/text (göster/gizle butonu)
   - AutoComplete: "current-password"
   - Icon: LockClosedIcon

3. **Şifremi Unuttum** (link)
   - URL: `/sifremi-unuttum`

#### Mantık ve İşleyiş

**1. Giriş Türü Tespiti:**
```typescript
const isEmail = /@/.test(identifier.trim());
```

**2. Email ile Giriş:**
```typescript
const endpoint = `${API_V1_URL}/auth/login`;
const body = {
  email: identifier.trim(),
  password: password,
  device_name: 'web'
};

const response = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(body)
});
```

**3. Başarılı Giriş Sonrası:**
```typescript
if (data.meta?.status === 'success' && data.data?.access_token) {
  const token = data.data.access_token;
  
  // Token kaydet
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=2592000`; // 30 gün
  
  // Kullanıcı bilgilerini kaydet
  if (data.data.user) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
    localStorage.setItem('userEmail', data.data.user.email);
  }
  
  // Kullanıcı bilgilerini fetch et
  await fetchUserInfo(token);
  setIsLoggedIn(true);
  
  // Ana sayfaya yönlendir
  router.push('/');
}
```

#### Endpoint: `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "device_name": "web"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Login successful",
    "code": 200
  },
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John",
      "lastname": "Doe"
    }
  }
}
```

**Response (Hata):**
```json
{
  "meta": {
    "status": "error",
    "message": "Invalid credentials",
    "code": 401
  }
}
```

---

### 📱 Telefon ile Giriş

#### Mantık ve İşleyiş

**1. Telefon Normalizasyonu:**
```typescript
const normalizePhone = (input: string) => {
  const digits = input.replace(/[^\d]/g, '');
  
  // 0090XXXXXXXXXX formatı
  if (digits.startsWith('0090') && digits.length >= 13) {
    return '0' + digits.slice(4, 14);
  }
  
  // 90XXXXXXXXXX formatı
  if (digits.startsWith('90') && digits.length >= 12) {
    return '0' + digits.slice(2, 12);
  }
  
  // 0XXXXXXXXXX formatı
  if (digits.startsWith('0') && digits.length >= 11) {
    return digits.slice(0, 11);
  }
  
  return digits;
};
```

**2. Telefon Validasyonu:**
```typescript
const cleanedPhone = normalizePhone(identifier);
const phoneRegex = /^0\d{10}$/;

if (!phoneRegex.test(cleanedPhone)) {
  setLoginError({ 
    message: 'Geçerli bir telefon veya e-posta giriniz. (Telefon: 11 hane, örn: 05459092349)' 
  });
  return;
}
```

**3. Giriş İsteği (Fallback Mekanizması):**
```typescript
// 1) Önce müşteri login endpoint'ini dene
const primaryUrl = `${API_V1_URL}/customer/auth/login`;
const primary = await fetch(primaryUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: cleanedPhone,
    password: password,
    device_name: 'web'
  })
});

if (primary.ok) {
  // Başarılı
  response = primary;
  data = await primary.json();
} else {
  // 2) Fallback: Genel login endpoint'inde phone alanı ile dene
  const fallbackUrl = `${API_V1_URL}/auth/login`;
  const fallback = await fetch(fallbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      phone: cleanedPhone,
      password: password,
      device_name: 'web'
    })
  });
  
  response = fallback;
  data = await fallback.json();
}
```

#### Endpoint: `POST /api/v1/customer/auth/login` (Birincil)

**Request Body:**
```json
{
  "phone": "05459092349",
  "password": "password123",
  "device_name": "web"
}
```

#### Endpoint: `POST /api/v1/auth/login` (Fallback)

**Request Body:**
```json
{
  "phone": "05459092349",
  "password": "password123",
  "device_name": "web"
}
```

**Response:** Email ile giriş ile aynı format.

---

## 3. Şifremi Unuttum (Forgot Password)

### 📄 Sayfa Bilgileri

**Dosya Yapısı:**
- Server Component: `app/sifremi-unuttum/page.tsx`
- Client Component: `app/sifremi-unuttum/ForgotPasswordPageClient.tsx`

**URL:** `/sifremi-unuttum`

**Özellikler:**
- Telefon veya E-posta ile şifre sıfırlama
- Başarı mesajı gösterimi
- Tekrar gönderme butonu (180 saniye cooldown)
- Telefon için kod formu
- E-posta için link gönderimi
- Responsive tasarım

---

### 📧 Email ile Şifre Sıfırlama

#### Arayüz Detayları

**Form Alanları:**
1. **E-posta** (required)
   - Placeholder: "E-posta adresiniz (örn: user@example.com)"
   - Icon: EnvelopeIcon
   - Validasyon: Email formatı

**Başarı Sayfası:**
- Başarı mesajı
- E-posta kontrol talimatları
- "Önceki Sayfaya Dön" butonu

#### Mantık ve İşleyiş

**1. İstek Gönderme:**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/forgot`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: trimmedEmail
  })
});
```

**2. Başarılı İstek:**
- Başarı sayfası gösterilir
- E-posta adresine şifre sıfırlama linki gönderilir
- Link formatı: `/sifre-yenileme?email=user@example.com&code=abc123`

#### Endpoint: `POST /api/v1/customer/auth/forgot`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Password reset email sent",
    "code": 200
  }
}
```

**Response (Hata - Email bulunamadı):**
```json
{
  "meta": {
    "status": "error",
    "message": "Email not found",
    "code": 404
  }
}
```

---

### 📱 Telefon ile Şifre Sıfırlama

#### Arayüz Detayları

**Form Alanları:**
1. **Telefon** (required)
   - Placeholder: "Telefon numaranız (örn: 05307721072)"
   - MaxLength: 11
   - Validasyon: `/^0\d{10}$/`
   - Icon: PhoneIcon

**Kod Formu:**
- Doğrulama Kodu (6 haneli)
- Yeni Şifre
- Yeni Şifre (Tekrar)
- "Tekrar Gönder" butonu (180 saniye cooldown)

#### Mantık ve İşleyiş

**1. Telefon Formatı:**
```typescript
const phoneRegex = /^0\d{10}$/;
const cleanedPhone = phone.replace(/\s/g, '');

// Format dönüşümü
let formattedPhone = cleanedPhone;
if (cleanedPhone.startsWith('0')) {
  formattedPhone = `+90${cleanedPhone.slice(1)}`;
} else if (cleanedPhone.startsWith('90')) {
  formattedPhone = `+${cleanedPhone}`;
} else if (!cleanedPhone.startsWith('+')) {
  formattedPhone = `+90${cleanedPhone}`;
}
```

**2. İstek Gönderme:**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/forgot`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: formattedPhone
  })
});
```

**3. Başarılı İstek:**
- Kod formu gösterilir
- SMS ile 6 haneli kod gönderilir
- 180 saniye geri sayım başlar

**4. Kod ve Şifre Gönderme:**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/reset`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: formattedPhone,
    code: code,
    password: password,
    password_confirmation: passwordRepeat
  })
});
```

#### Endpoint: `POST /api/v1/customer/auth/forgot` (Telefon)

**Request Body:**
```json
{
  "phone": "+905459092349"
}
```

**Response:** Email ile aynı format.

---

## 4. Şifre Yenileme (Reset Password)

### 📄 Sayfa Bilgileri

**Dosya Yapısı:**
- Server Component: `app/sifre-yenileme/page.tsx`
- Client Component: `app/sifre-yenileme/ResetPasswordPageClient.tsx`

**URL:** `/sifre-yenileme`

**URL Parametreleri:**
- `email`: Kullanıcı email'i (opsiyonel)
- `phone`: Kullanıcı telefonu (opsiyonel)
- `code`: Doğrulama kodu (opsiyonel)

**Örnek URL:**
```
/sifre-yenileme?email=user@example.com&code=abc123
/sifre-yenileme?phone=05459092349&code=123456
```

**Özellikler:**
- Email veya Telefon ile şifre yenileme
- URL'den email/phone ve code alınır
- Yeni şifre belirleme
- Şifre tekrar kontrolü
- Minimum 8 karakter kontrolü

---

### 📧 Email ile Şifre Yenileme

#### Arayüz Detayları

**Form Alanları:**
1. **E-posta** (readonly)
   - URL'den alınır
   - Değiştirilemez
   - Icon: EnvelopeIcon

2. **Yeni Şifre** (required)
   - Placeholder: "Yeni şifrenizi girin"
   - Type: password
   - Validasyon: Minimum 8 karakter

3. **Yeni Şifre (Tekrar)** (required)
   - Placeholder: "Yeni şifrenizi tekrar girin"
   - Type: password
   - Validasyon: Şifre ile eşleşmeli

#### Mantık ve İşleyiş

**1. URL Parametrelerini Alma:**
```typescript
const searchParams = useSearchParams();
const emailParam = searchParams.get('email') || '';
const codeParam = searchParams.get('code') || '';

useEffect(() => {
  if (emailParam) {
    setResetMethod('email');
    setEmail(emailParam);
  }
  setCode(codeParam);
}, [searchParams]);
```

**2. Validasyon:**
```typescript
if (!email || !code || !password || !passwordRepeat) {
  toast.error('Lütfen tüm alanları doldurunuz.');
  return;
}

if (password !== passwordRepeat) {
  toast.error('Şifreler eşleşmiyor.');
  return;
}

if (password.length < 8) {
  toast.error('Şifre en az 8 karakter olmalıdır.');
  return;
}
```

**3. Şifre Yenileme İsteği:**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/reset`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: email.trim(),
    code: code,
    password: password,
    password_confirmation: passwordRepeat
  })
});
```

**4. Başarılı Yenileme:**
- Başarı mesajı gösterilir
- 1.2 saniye sonra giriş sayfasına yönlendirilir (`/giris`)

#### Endpoint: `POST /api/v1/customer/auth/reset`

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "abc123",
  "password": "NewPassword123",
  "password_confirmation": "NewPassword123"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Password reset successfully",
    "code": 200
  }
}
```

**Response (Hata):**
```json
{
  "meta": {
    "status": "error",
    "message": "Invalid code or email",
    "code": 400
  }
}
```

---

### 📱 Telefon ile Şifre Yenileme

#### Arayüz Detayları

**Form Alanları:**
1. **Telefon** (required)
   - URL'den alınır veya manuel girilir
   - Validasyon: `/^0\d{10}$/`
   - Icon: PhoneIcon

2. **Doğrulama Kodu** (required)
   - URL'den alınır veya manuel girilir
   - Placeholder: "Doğrulama Kodu"

3. **Yeni Şifre** (required)
4. **Yeni Şifre (Tekrar)** (required)

#### Mantık ve İşleyiş

**1. URL Parametrelerini Alma:**
```typescript
const phoneParam = searchParams.get('phone') || '';
const codeParam = searchParams.get('code') || '';

useEffect(() => {
  if (phoneParam) {
    setResetMethod('phone');
    setPhone(phoneParam);
  }
  setCode(codeParam);
}, [searchParams]);
```

**2. Telefon Formatı:**
```typescript
const phoneRegex = /^0\d{10}$/;
const cleanedPhone = phone.replace(/\s/g, '');

let formattedPhone = cleanedPhone;
if (cleanedPhone.startsWith('0')) {
  formattedPhone = `+90${cleanedPhone.slice(1)}`;
} else if (cleanedPhone.startsWith('90')) {
  formattedPhone = `+${cleanedPhone}`;
} else if (!cleanedPhone.startsWith('+')) {
  formattedPhone = `+90${cleanedPhone}`;
}
```

**3. Şifre Yenileme İsteği:**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/reset`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: formattedPhone,
    code: code,
    password: password,
    password_confirmation: passwordRepeat
  })
});
```

**Response:** Email ile aynı format.

---

## AuthContext ve Token Yönetimi

### 📄 Dosya Bilgileri

**Dosya:** `app/context/AuthContext.tsx`

**Provider:** `AuthProvider`

**Hook:** `useAuth()`

---

### 🔑 State'ler

```typescript
interface AuthContextType {
  isLoggedIn: boolean;              // Kullanıcı giriş yaptı mı?
  setIsLoggedIn: (value: boolean) => void;
  user: User | null;                // Kullanıcı bilgileri
  setUser: (user: User | null) => void;
  userInfo: UserInfo | null;        // Basit kullanıcı bilgileri
  logout: () => void;               // Çıkış yapma
  fetchUserInfo: (token: string) => Promise<void>;  // Kullanıcı bilgilerini getirme
  checkAuth: () => Promise<void>;   // Token kontrolü
  showNotificationModal: boolean;    // Bildirim modal'ı gösterilsin mi?
  setShowNotificationModal: (show: boolean) => void;
}
```

---

### 🔍 checkAuth()

**Açıklama:** Sayfa yüklendiğinde token kontrolü yapar.

```typescript
const checkAuth = useCallback(async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetchUserInfo(token);
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setUserInfo(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user');
    }
  } else {
    setIsLoggedIn(false);
    setUser(null);
    setUserInfo(null);
  }
}, []);
```

**Kullanım:**
- Sayfa yüklendiğinde otomatik çağrılır
- Token geçersizse otomatik temizlik yapar

---

### 👤 fetchUserInfo(token: string)

**Açıklama:** Kullanıcı bilgilerini API'den getirir.

#### Endpoint: `GET /api/v1/auth/me`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "code": 200
  },
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John",
    "lastname": "Doe",
    "gender": "male",
    "role": {
      "name": "Customer",
      "type": "customer",
      "slug": "customer"
    },
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Kod:**
```typescript
const fetchUserInfo = async (token: string) => {
  try {
    const response = await axios.get(`${API_V1_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.data.meta?.status === 'success') {
      const userData = response.data.data;
      setUser({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        lastname: userData.lastname,
        gender: userData.gender,
        role: userData.role,
        status: userData.status,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at
      });
      setUserInfo({
        id: userData.id,
        email: userData.email,
        name: userData.name
      });
      localStorage.setItem('userEmail', userData.email);
      
      // Notification modal kontrolü
      const hasSeenModal = localStorage.getItem(`hasSeenNotificationModal_${userData.email}`);
      if (!hasSeenModal) {
        setTimeout(() => {
          setShowNotificationModal(true);
        }, 1000);
      }
    }
  } catch (error) {
    throw error;
  }
};
```

---

### 🚪 logout()

**Açıklama:** Kullanıcı çıkış yapar.

#### Endpoint: `POST /api/v1/auth/logout`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Request Body:** `{}` (Boş)

**Kod:**
```typescript
const logout = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Token yoksa direkt temizlik yap
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setUserInfo(null);
    return;
  }

  try {
    await axios.post(`${API_V1_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
  } catch (error) {
    // Hata olsa bile temizlik yap
  } finally {
    // Her durumda temizlik yap
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
    localStorage.removeItem('hasMergedGuestBasket');
    setIsLoggedIn(false);
    setUser(null);
    setUserInfo(null);
  }
};
```

**Kullanım:**
```typescript
const { logout } = useAuth();

await logout();
router.push('/');
window.location.reload();
```

---

### 🔄 Cross-Tab Communication

**Açıklama:** Storage event listener ile diğer tab'lardaki değişiklikleri dinler.

```typescript
useEffect(() => {
  checkAuth();
  
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'token') {
      checkAuth();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, [checkAuth]);
```

---

## Akış Diyagramları

### 📊 Kayıt Akışı (Email)

```
Kullanıcı /kayit-ol sayfasına gelir
    ↓
Email ile kayıt seçeneğini seçer
    ↓
Form doldurulur (email, şifre, ad, soyad, KVKK onayları)
    ↓
Client-side validasyon
    ↓
POST /api/v1/auth/register
    ↓
Email doğrulama popup'ı gösterilir
    ↓
6 haneli kod e-postaya gönderilir
    ↓
Kullanıcı kodu girer
    ↓
POST /api/v1/auth/validate-code
    ↓
Kod doğrulandı
    ↓
POST /api/v1/auth/login (otomatik)
    ↓
Token alınır ve kaydedilir
    ↓
GET /api/v1/auth/me ile kullanıcı bilgileri alınır
    ↓
AuthContext güncellenir (isLoggedIn = true)
    ↓
Ana sayfaya yönlendirilir (/)
```

### 📊 Kayıt Akışı (Telefon)

```
Kullanıcı /kayit-ol sayfasına gelir
    ↓
Telefon ile kayıt seçeneğini seçer
    ↓
Form doldurulur (telefon, şifre, ad, soyad, KVKK onayları)
    ↓
Client-side validasyon
    ↓
POST /api/v1/customer/auth/register
    ↓
Telefon doğrulama popup'ı gösterilir
    ↓
6 haneli kod SMS ile gönderilir
    ↓
Kullanıcı kodu girer
    ↓
POST /api/v1/customer/auth/validate-code
    ↓
Kod doğrulandı
    ↓
POST /api/v1/customer/auth/login (otomatik)
    ↓
Token alınır ve kaydedilir
    ↓
GET /api/v1/auth/me ile kullanıcı bilgileri alınır
    ↓
AuthContext güncellenir (isLoggedIn = true)
    ↓
Ana sayfaya yönlendirilir (/)
```

### 📊 Giriş Akışı (Email)

```
Kullanıcı /giris sayfasına gelir
    ↓
Email ve şifre girer
    ↓
Email formatı tespit edilir (@ karakteri)
    ↓
POST /api/v1/auth/login
    ↓
Token alınır
    ↓
Token localStorage ve cookie'ye kaydedilir
    ↓
GET /api/v1/auth/me ile kullanıcı bilgileri alınır
    ↓
AuthContext güncellenir (isLoggedIn = true)
    ↓
Ana sayfaya yönlendirilir (/)
```

### 📊 Giriş Akışı (Telefon)

```
Kullanıcı /giris sayfasına gelir
    ↓
Telefon ve şifre girer
    ↓
Telefon formatı tespit edilir (@ karakteri yok)
    ↓
Telefon normalizasyonu (0XXXXXXXXXX formatına çevrilir)
    ↓
POST /api/v1/customer/auth/login (birincil)
    ↓
Başarılı mı?
    ├─ Evet → Token alınır
    └─ Hayır → POST /api/v1/auth/login (fallback)
        ↓
        Token alınır
    ↓
Token localStorage ve cookie'ye kaydedilir
    ↓
GET /api/v1/auth/me ile kullanıcı bilgileri alınır
    ↓
AuthContext güncellenir (isLoggedIn = true)
    ↓
Ana sayfaya yönlendirilir (/)
```

### 📊 Şifre Sıfırlama Akışı (Email)

```
Kullanıcı /sifremi-unuttum sayfasına gelir
    ↓
Email ile sıfırlama seçeneğini seçer
    ↓
Email girer
    ↓
POST /api/v1/customer/auth/forgot
    ↓
Şifre sıfırlama linki e-postaya gönderilir
    ↓
Kullanıcı e-postadaki linke tıklar
    ↓
/sifre-yenileme?email=...&code=... sayfasına yönlendirilir
    ↓
Yeni şifre girer
    ↓
POST /api/v1/customer/auth/reset
    ↓
Şifre başarıyla yenilendi
    ↓
/giris sayfasına yönlendirilir
```

### 📊 Şifre Sıfırlama Akışı (Telefon)

```
Kullanıcı /sifremi-unuttum sayfasına gelir
    ↓
Telefon ile sıfırlama seçeneğini seçer
    ↓
Telefon girer
    ↓
POST /api/v1/customer/auth/forgot
    ↓
6 haneli kod SMS ile gönderilir
    ↓
Kod formu gösterilir
    ↓
Kullanıcı kodu ve yeni şifreyi girer
    ↓
POST /api/v1/customer/auth/reset
    ↓
Şifre başarıyla yenilendi
    ↓
/giris sayfasına yönlendirilir
```

### 📊 Çıkış Akışı

```
Kullanıcı çıkış yapmak ister
    ↓
POST /api/v1/auth/logout (opsiyonel, hata olsa bile devam eder)
    ↓
localStorage temizlenir (token, user, userEmail, hasMergedGuestBasket)
    ↓
Cookie temizlenir
    ↓
AuthContext güncellenir (isLoggedIn = false, user = null)
    ↓
Ana sayfaya yönlendirilir (/)
    ↓
Sayfa yenilenir (window.location.reload())
```

---

## Hata Senaryoları ve Çözümleri

### ❌ 1. Geçersiz Token

**Durum:** Token geçersiz veya süresi dolmuş

**Tespit:**
- `GET /auth/me` 401 döner

**Çözüm:**
```typescript
try {
  await fetchUserInfo(token);
} catch (error) {
  // Token geçersiz, temizlik yap
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('user');
  setIsLoggedIn(false);
  setUser(null);
  setUserInfo(null);
}
```

---

### ❌ 2. Email/Telefon Zaten Kayıtlı

**Durum:** Kayıt sırasında email/telefon zaten kullanılıyor

**Response:**
```json
{
  "meta": {
    "status": "error",
    "message": "duplicated_code",
    "code": 400
  }
}
```

**Çözüm:**
- Email/Telefon doğrulama popup'ı gösterilir
- Kullanıcı zaten kayıtlı olabilir, doğrulama yapılabilir

---

### ❌ 3. Doğrulama Kodu Hatalı

**Durum:** Yanlış doğrulama kodu girildi

**Response:**
```json
{
  "meta": {
    "status": "error",
    "message": "Invalid verification code",
    "code": 400
  }
}
```

**Çözüm:**
- Hata mesajı gösterilir
- Kullanıcı tekrar deneyebilir veya yeni kod isteyebilir

---

### ❌ 4. Şifre Sıfırlama Kodu Geçersiz

**Durum:** Şifre sıfırlama linkindeki kod geçersiz veya süresi dolmuş

**Response:**
```json
{
  "meta": {
    "status": "error",
    "message": "Invalid or expired reset code",
    "code": 400
  }
}
```

**Çözüm:**
- Hata mesajı gösterilir
- Kullanıcı yeni şifre sıfırlama e-postası/SMS'i isteyebilir

---

### ❌ 5. Şifre Gereksinimleri Karşılanmıyor

**Durum:** Şifre kayıt gereksinimlerini karşılamıyor

**Validasyon:**
- Minimum 10 karakter (kayıt)
- Minimum 8 karakter (şifre yenileme)
- En az 1 büyük harf
- En az 1 küçük harf
- En az 1 rakam
- Email/Telefon ile aynı olamaz

**Çözüm:**
- Real-time şifre gücü göstergesi
- Hata mesajı gösterilir
- Form gönderilemez

---

### ❌ 6. Network Hatası

**Durum:** API'ye bağlanılamıyor

**Çözüm:**
```typescript
try {
  const response = await fetch(endpoint, options);
} catch (error) {
  toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
}
```

---

## 📝 Özet Tablo

| İşlem | Endpoint | Method | Auth | Yöntem |
|-------|----------|--------|------|--------|
| Email ile Kayıt | `/auth/register` | POST | ❌ | Email |
| Telefon ile Kayıt | `/customer/auth/register` | POST | ❌ | Telefon |
| Email Doğrulama | `/auth/validate-code` | POST | ❌ | Email |
| Telefon Doğrulama | `/customer/auth/validate-code` | POST | ❌ | Telefon |
| Email ile Giriş | `/auth/login` | POST | ❌ | Email |
| Telefon ile Giriş | `/customer/auth/login` | POST | ❌ | Telefon |
| Şifre Sıfırlama (Email) | `/customer/auth/forgot` | POST | ❌ | Email |
| Şifre Sıfırlama (Telefon) | `/customer/auth/forgot` | POST | ❌ | Telefon |
| Şifre Yenileme | `/customer/auth/reset` | POST | ❌ | Email/Telefon |
| Kullanıcı Bilgileri | `/auth/me` | GET | ✅ | - |
| Çıkış | `/auth/logout` | POST | ✅ | - |

**Toplam Endpoint Sayısı:** 11

**Auth Gerektiren Endpoint:** 2

**Auth Gerektirmeyen Endpoint:** 9

---

## 🔒 Güvenlik Notları

### 1. Token Güvenliği
- Token localStorage'da saklanır (XSS riski var)
- Token cookie'de de saklanır (30 gün geçerlilik)
- Token her API isteğinde `Authorization: Bearer {token}` header'ı ile gönderilir
- Token geçersiz olduğunda otomatik temizlenir

### 2. Şifre Güvenliği
- Şifreler asla localStorage'da saklanmaz
- Şifreler sadece API'ye gönderilir
- Şifre gücü kontrolü client-side'da yapılır
- Minimum şifre uzunluğu: 8 karakter (reset), 10 karakter (kayıt)

### 3. Email/Telefon Doğrulama
- Kayıt sonrası doğrulama zorunlu
- Doğrulama kodu 6 haneli
- Doğrulama kodu 10 dakika geçerli
- Kod yeniden gönderilebilir

### 4. Hata Yönetimi
- API hataları kullanıcıya toast mesajı ile gösterilir
- 404 hataları özel mesajlarla handle edilir
- Network hataları genel hata mesajı ile gösterilir
- Token geçersiz olduğunda otomatik logout yapılır

---

## 🎯 Özellikler

### 1. Otomatik Login
Kayıt sonrası email/telefon doğrulaması başarılı olduğunda otomatik login yapılır.

### 2. Cross-Tab Communication
AuthContext, `storage` event listener ile diğer tab'lardaki değişiklikleri dinler.

### 3. Guest Basket Merge
Giriş yapıldığında guest sepeti kullanıcı sepeti ile birleştirilir (BasketContext'te yapılır).

### 4. Notification Modal
Yeni kayıt olan kullanıcılar için bildirim tercihleri modal'ı gösterilir.

### 5. Responsive Tasarım
Tüm auth sayfaları mobil ve desktop için optimize edilmiştir.

### 6. Swipe Gesture
Mobil cihazlarda swipe gesture ile giriş/kayıt sayfaları arasında geçiş yapılabilir.

---

## 📱 Responsive Tasarım

**Mobile (< 768px):**
- Full-screen gradient background
- Swipe gesture desteği
- Mobil optimize form alanları
- Backdrop blur efektleri

**Desktop (≥ 768px):**
- Merkezi form
- Header ve Footer gösterilir
- Daha geniş form alanları

---

## 🚀 İyileştirme Önerileri

1. **Refresh Token:** Access token süresi dolduğunda refresh token ile yenileme
2. **2FA:** İki faktörlü kimlik doğrulama desteği
3. **Social Login:** Facebook, Google ile giriş yapma
4. **Remember Me:** "Beni hatırla" özelliği ile token süresini uzatma
5. **Session Management:** Aktif oturumları görüntüleme ve yönetme
6. **Rate Limiting:** Brute force saldırılarına karşı rate limiting
7. **CSRF Protection:** CSRF token kullanımı
8. **Password Strength Indicator:** Şifre gücü göstergesi (zayıf/orta/güçlü) ✅ (Mevcut)

---

## 📚 İlgili Dosyalar

- `app/giris/LoginClient.tsx` - Giriş sayfası
- `app/kayit-ol/SignUpPageClient.tsx` - Email ile kayıt sayfası
- `app/kayit-ol/page.tsx` - Telefon ve Email ile kayıt sayfası
- `app/sifremi-unuttum/ForgotPasswordPageClient.tsx` - Şifremi unuttum sayfası
- `app/sifre-yenileme/ResetPasswordPageClient.tsx` - Şifre yenileme sayfası
- `app/context/AuthContext.tsx` - Authentication context
- `lib/config.ts` - API URL konfigürasyonu

---

**Son Güncelleme:** 2024

