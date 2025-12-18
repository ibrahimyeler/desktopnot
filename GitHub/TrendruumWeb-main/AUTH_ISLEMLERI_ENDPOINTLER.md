# Authentication İşlemleri - Sayfalar ve Endpoint'ler

Bu dokümantasyon, projede kullanılan tüm authentication (kimlik doğrulama) işlemlerini, sayfalarını ve API endpoint'lerini içermektedir.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Authentication Sayfaları](#authentication-sayfaları)
3. [API Endpoint'leri](#api-endpointleri)
4. [AuthContext](#authcontext)
5. [Token Yönetimi](#token-yönetimi)
6. [Hesabım Sayfaları](#hesabım-sayfaları)
7. [Akış Diyagramları](#akış-diyagramları)

---

## 🔍 Genel Bakış

**Base URL:** `https://api.trendruum.com/api/v1`

**Authentication Yöntemi:** Bearer Token (JWT)

**Token Saklama:**
- `localStorage.setItem('token', token)`
- `document.cookie = 'token=${token}; path=/; max-age=2592000'` (30 gün)

**Token Kullanımı:**
```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

---

## 📄 Authentication Sayfaları

### 1. Giriş Sayfası (`/giris`)

**Dosya:** `app/giris/LoginClient.tsx`

**Açıklama:** Kullanıcı giriş yapma sayfası

**Özellikler:**
- Email ve şifre ile giriş
- Şifre göster/gizle
- "Şifremi unuttum" linki
- Responsive tasarım (mobil/desktop)
- Swipe gesture desteği (mobil)

**Kullanılan Endpoint:**

#### `POST /api/v1/auth/login`

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

**Kod Örneği (Email ile):**
```typescript
const response = await fetch(`${API_V1_URL}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: email.trim(),
    password: password,
    device_name: 'web'
  })
});

const data = await response.json();

if (data.meta?.status === 'success' && data.data?.access_token) {
  const token = data.data.access_token;
  
  // Token'ı kaydet
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=2592000`;
  
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

#### Telefon ile Giriş

`POST /api/v1/customer/auth/login`

**Request Body:**
```json
{
  "phone": "05459092349",
  "password": "password123",
  "device_name": "web"
}
```

**Kod Örneği (Telefon ile):**
```typescript
const response = await fetch(`${API_V1_URL}/customer/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    phone: phone.replace(/\s/g, ''),
    password: password,
    device_name: 'web'
  })
});
```

**Yönlendirmeler:**
- Başarılı giriş: `/` (Ana sayfa)
- Şifremi unuttum: `/sifremi-unuttum`
- Üye ol: `/kayit-ol`

---

### 2. Kayıt Sayfası (`/kayit-ol`)

**Dosya:** `app/kayit-ol/page.tsx` (SignUpPageClient.tsx)

**Açıklama:** Yeni kullanıcı kayıt sayfası

**Özellikler:**
- Email, şifre, ad, soyad ile kayıt
- Şifre gücü kontrolü
- Email doğrulama kodu sistemi
- KVKK onayları (zorunlu)
- Responsive tasarım
- Swipe gesture desteği

**Kullanılan Endpoint'ler:**

#### `POST /api/v1/auth/register`

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

**Şifre Gereksinimleri:**
- Minimum 10 karakter
- En az 1 büyük harf (A-Z)
- En az 1 küçük harf (a-z)
- En az 1 rakam (0-9)
- Email ile aynı olamaz

**KVKK Onayları (Zorunlu):**
- Kişisel verilerin işlenmesine açık rıza
- Elektronik ileti gönderilmesi onayı
- Aydınlatma metnini okuduğunu onaylama

**Kod Örneği:**
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

const data = await registerResponse.json();

if (data.meta?.status === 'success' || 
    data.meta?.message?.includes('exists') || 
    data.meta?.message === 'duplicated_code' ||
    data.meta?.message === 'pending_validation') {
  // Email doğrulama popup'ı göster
  localStorage.setItem('pendingUserEmail', trimmedEmail);
  localStorage.setItem('pendingUserPassword', password);
  setShowVerificationPopup(true);
  setVerificationTimer(600); // 10 dakika
}
```

#### `POST /api/v1/auth/validate-code`

**Açıklama:** Email doğrulama kodunu kontrol eder

**Request Body:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "device_name": "web"
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

**Kod Örneği:**
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

const data = await response.json();

if (response.ok && data.meta?.status === 'success') {
  // Email doğrulama başarılı, otomatik login yap
  await performAutoLogin(userEmail, userPassword);
}
```

#### `POST /api/v1/auth/resend-code`

**Açıklama:** Email doğrulama kodunu yeniden gönderir

**Request Body:**
```json
{
  "email": "user@example.com",
  "device_name": "web"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Code resent successfully",
    "code": 200
  }
}
```

**Kod Örneği:**
```typescript
const response = await fetch(`${API_V1_URL}/auth/resend-code`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: userEmail,
    device_name: 'web'
  })
});

if (response.ok && data.meta?.status === 'success') {
  setVerificationTimer(600); // 10 dakika sıfırla
  setVerificationCode(['', '', '', '', '', '']); // Kod alanlarını temizle
  toast.success('Yeni doğrulama kodu e-posta adresinize gönderildi.');
}
```

**Doğrulama Kodu Özellikleri:**
- 6 haneli kod
- 10 dakika geçerlilik süresi
- Otomatik input geçişi
- Backspace ile geri gitme
- Timer ile geri sayım

**Yönlendirmeler:**
- Başarılı kayıt + doğrulama: `/` (Ana sayfa, otomatik login)
- Giriş sayfası: `/giris`

---

### 3. Şifremi Unuttum Sayfası (`/sifremi-unuttum`)

**Dosya:** `app/sifremi-unuttum/ForgotPasswordPageClient.tsx`

**Açıklama:** Şifre sıfırlama e-postası gönderme sayfası

**Özellikler:**
- Email ile şifre sıfırlama isteği
- Başarı mesajı gösterimi
- Tekrar gönderme butonu (180 saniye cooldown)
- Responsive tasarım

**Kullanılan Endpoint:**

#### `POST /api/v1/auth/forgot-password`

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

**Kod Örneği:**
```typescript
const response = await fetch(`${API_V1_URL}/auth/forgot-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({ email: trimmedEmail }),
});

const data = await response.json();

if (!response.ok) {
  const errorMessage = response.status === 404
    ? 'Lütfen kayıtlı bir e-posta adresi girin.'
    : data?.meta?.message || `Bir hata oluştu (HTTP ${response.status}).`;
  toast.error(errorMessage);
  return false;
}

// Başarılı
toast.success('Şifre yenileme bağlantısı gönderildi.');
startTimer(); // 180 saniye timer başlat
setShowSuccessPage(true);
```

**Tekrar Gönderme:**
- 180 saniye (3 dakika) cooldown
- Timer ile geri sayım gösterimi
- Aynı email'e tekrar gönderim

**Yönlendirmeler:**
- Başarılı: Başarı sayfası gösterilir
- Giriş sayfası: `/giris`

---

### 4. Şifre Yenileme Sayfası (`/sifre-yenileme`)

**Dosya:** `app/sifre-yenileme/ResetPasswordPageClient.tsx`

**Açıklama:** Email'den gelen link ile şifre yenileme sayfası

**URL Parametreleri:**
- `email`: Kullanıcı email'i
- `code`: Doğrulama kodu

**Örnek URL:**
```
/sifre-yenileme?email=user@example.com&code=abc123
```

**Özellikler:**
- Email ve kod URL'den alınır
- Yeni şifre belirleme
- Şifre tekrar kontrolü
- Minimum 8 karakter kontrolü

**Kullanılan Endpoint:**

#### `POST /api/v1/auth/reset-password`

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

**Kod Örneği:**
```typescript
const response = await fetch(`${API_V1_URL}/auth/reset-password`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    email: email,
    code: code,
    password: password,
    password_confirmation: passwordRepeat
  })
});

const data = await response.json();

if (data.meta?.status === 'success') {
  toast.success('Şifreniz başarıyla yenilendi. Giriş yapabilirsiniz.');
  setTimeout(() => {
    router.push('/giris');
  }, 1200);
}
```

**Validasyonlar:**
- Email ve kod zorunlu
- Şifre minimum 8 karakter
- Şifre ve şifre tekrar eşleşmeli

**Yönlendirmeler:**
- Başarılı: `/giris` (1.2 saniye sonra)

---

## 🔐 AuthContext

**Dosya:** `app/context/AuthContext.tsx`

**Açıklama:** Global authentication state yönetimi

**Provider:** `AuthProvider`

**Hook:** `useAuth()`

**State'ler:**
- `isLoggedIn`: Kullanıcı giriş yaptı mı?
- `user`: Kullanıcı bilgileri
- `userInfo`: Basit kullanıcı bilgileri
- `showNotificationModal`: Bildirim modal'ı gösterilsin mi?

**Fonksiyonlar:**

### `checkAuth()`

**Açıklama:** Sayfa yüklendiğinde token kontrolü yapar

**Kod:**
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

### `fetchUserInfo(token: string)`

**Açıklama:** Kullanıcı bilgilerini API'den getirir

**Kullanılan Endpoint:**

#### `GET /api/v1/auth/me`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "User info retrieved",
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
    }
  } catch (error) {
    throw error;
  }
};
```

### `logout()`

**Açıklama:** Kullanıcı çıkış yapar

**Kullanılan Endpoint:**

#### `POST /api/v1/auth/logout`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Request Body:** `{}` (Boş)

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Logout successful",
    "code": 200
  }
}
```

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

// Çıkış yap
await logout();
router.push('/');
window.location.reload();
```

**Cross-Tab Communication:**
- `storage` event listener ile diğer tab'lardaki değişiklikleri dinler
- Token değiştiğinde `checkAuth()` çağrılır

---

## 🔑 Token Yönetimi

**Dosya:** `app/utils/auth.ts`

**Fonksiyonlar:**

### `getToken(): string | null`

**Açıklama:** LocalStorage'dan token'ı getirir

```typescript
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};
```

### `setToken(token: string): void`

**Açıklama:** Token'ı LocalStorage'a kaydeder

```typescript
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};
```

### `removeToken(): void`

**Açıklama:** Token'ı ve ilgili verileri temizler

```typescript
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('user');
  }
};
```

### `isAuthenticated(): boolean`

**Açıklama:** Kullanıcı giriş yapmış mı kontrol eder

```typescript
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
```

**Token Saklama Yerleri:**
1. `localStorage.getItem('token')` - Ana token
2. `document.cookie = 'token=${token}; path=/; max-age=2592000'` - Cookie (30 gün)
3. `localStorage.getItem('user')` - Kullanıcı bilgileri (JSON string)
4. `localStorage.getItem('userEmail')` - Kullanıcı email'i

---

## 👤 Hesabım Sayfaları

### 1. Kullanıcı Bilgileri (`/hesabim/kullanici-bilgilerim`)

**Dosya:** 
- Server: `app/hesabim/kullanici-bilgilerim/page.tsx`
- Client: `app/hesabim/kullanici-bilgilerim/UserInfoPageClient.tsx`
- Component: `components/account/UserInfo.tsx`

**Açıklama:** Kullanıcı profil bilgilerini görüntüleme ve güncelleme

**Kullanılan Endpoint'ler:**

#### `GET /api/v1/customer/profile/me`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json",
  "Content-Type": "application/json"
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
    "name": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "+905551234567",
    "gender": "male",
    "birthday": "01/15/1990",
    "validate": {
      "is_validated": true,
      "validated_at": "2024-01-01T00:00:00.000Z"
    },
    "status": "active",
    "role": {
      "name": "Customer",
      "type": "customer",
      "slug": "customer"
    },
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### `POST /api/v1/customer/profile/me-update`

**Açıklama:** Profil bilgilerini günceller

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John",
  "lastname": "Doe",
  "phone": "+905551234567",
  "gender": "male",
  "birthday": "01/15/1990"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Profile updated successfully",
    "code": 200
  },
  "data": {
    "id": "user-id",
    "name": "John",
    "lastname": "Doe",
    "email": "user@example.com",
    "phone": "+905551234567",
    "gender": "male",
    "birthday": "01/15/1990"
  }
}
```

**Kod Örneği:**
```typescript
const response = await axios.post('/api/v1/customer/profile/me-update', {
  name: profileForm.name,
  lastname: profileForm.surname,
  phone: profileForm.phone,
  gender: profileForm.gender,
  birthday: `${profileForm.birthMonth}/${profileForm.birthDay}/${profileForm.birthYear}`
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

#### `POST /api/v1/customer/profile/password-reset`

**Açıklama:** Şifreyi günceller (profil sayfasından)

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "current_password": "OldPassword123",
  "new_password": "NewPassword123",
  "new_password_confirmation": "NewPassword123"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Password updated successfully",
    "code": 200
  }
}
```

**Kod Örneği:**
```typescript
const response = await axios.post(
  "/api/v1/customer/profile/password-reset",
  {
    current_password: passwordForm.currentPassword,
    new_password: passwordForm.newPassword,
    new_password_confirmation: passwordForm.confirmPassword
  },
  {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);
```

**Özellikler:**
- Profil bilgileri görüntüleme
- Profil bilgileri güncelleme
- Şifre değiştirme
- Doğum tarihi seçimi (gün/ay/yıl)
- Cinsiyet seçimi
- Telefon numarası güncelleme

---

### 2. Diğer Hesabım Sayfaları

Aşağıdaki sayfalar auth gerektirir ancak bu dokümantasyonun kapsamı dışındadır:

- `/hesabim/siparislerim` - Sipariş listesi
- `/hesabim/siparislerim/[siparis_no]` - Sipariş detayı
- `/hesabim/favoriler` - Favori ürünler
- `/hesabim/adres-bilgilerim` - Adres yönetimi
- `/hesabim/koleksiyonlarim` - Koleksiyonlar
- `/hesabim/takip-ettigim-magazalar` - Takip edilen mağazalar
- `/hesabim/degerlendirmelerim` - Yorumlar
- `/hesabim/mesajlarim` - Mesajlar
- `/hesabim/duyuru-tercihlerim` - Bildirim tercihleri
- `/hesabim/onceden-gezdiklerim` - Geçmiş görüntülemeler
- `/hesabim/tekrar-al` - Tekrar alınan ürünler

**Not:** Bu sayfaların endpoint'leri ilgili servis dosyalarında tanımlıdır.

---

## 📊 Endpoint Özet Tablosu

| Endpoint | Method | Auth | Açıklama | Sayfa |
|----------|--------|------|----------|-------|
| `/auth/login` | POST | ❌ | Giriş yapma | `/giris` |
| `/auth/register` | POST | ❌ | Kayıt olma | `/kayit-ol` |
| `/auth/validate-code` | POST | ❌ | Email doğrulama kodu | `/kayit-ol` |
| `/auth/resend-code` | POST | ❌ | Doğrulama kodunu yeniden gönderme | `/kayit-ol` |
| `/auth/forgot-password` | POST | ❌ | Şifre sıfırlama e-postası gönderme | `/sifremi-unuttum` |
| `/auth/reset-password` | POST | ❌ | Şifre yenileme | `/sifre-yenileme` |
| `/auth/me` | GET | ✅ | Kullanıcı bilgilerini getirme | AuthContext |
| `/auth/logout` | POST | ✅ | Çıkış yapma | MiddleHeader, AuthContext |
| `/customer/profile/me` | GET | ✅ | Profil bilgilerini getirme | `/hesabim/kullanici-bilgilerim` |
| `/customer/profile/me-update` | POST | ✅ | Profil bilgilerini güncelleme | `/hesabim/kullanici-bilgilerim` |
| `/customer/profile/password-reset` | POST | ✅ | Şifre değiştirme | `/hesabim/kullanici-bilgilerim` |

**Toplam Endpoint Sayısı:** 11

**Auth Gerektiren Endpoint:** 5

**Auth Gerektirmeyen Endpoint:** 6

---

## 🔄 Akış Diyagramları

### Giriş Akışı

```
Kullanıcı /giris sayfasına gelir
    ↓
Email ve şifre girer
    ↓
POST /auth/login
    ↓
Token alınır
    ↓
Token localStorage ve cookie'ye kaydedilir
    ↓
GET /auth/me ile kullanıcı bilgileri alınır
    ↓
AuthContext güncellenir (isLoggedIn = true)
    ↓
Ana sayfaya yönlendirilir (/)
```

### Kayıt Akışı

```
Kullanıcı /kayit-ol sayfasına gelir
    ↓
Form doldurulur (email, şifre, ad, soyad, KVKK onayları)
    ↓
POST /auth/register
    ↓
Email doğrulama popup'ı gösterilir
    ↓
6 haneli kod e-postaya gönderilir
    ↓
Kullanıcı kodu girer
    ↓
POST /auth/validate-code
    ↓
Kod doğrulandı
    ↓
POST /auth/login (otomatik)
    ↓
Token alınır ve kaydedilir
    ↓
GET /auth/me ile kullanıcı bilgileri alınır
    ↓
Ana sayfaya yönlendirilir (/)
```

### Şifre Sıfırlama Akışı

```
Kullanıcı /sifremi-unuttum sayfasına gelir
    ↓
Email girer
    ↓
POST /auth/forgot-password
    ↓
Şifre sıfırlama e-postası gönderilir
    ↓
Kullanıcı e-postadaki linke tıklar
    ↓
/sifre-yenileme?email=...&code=... sayfasına yönlendirilir
    ↓
Yeni şifre girer
    ↓
POST /auth/reset-password
    ↓
Şifre başarıyla yenilendi
    ↓
/giris sayfasına yönlendirilir
```

### Çıkış Akışı

```
Kullanıcı çıkış yapmak ister
    ↓
POST /auth/logout (opsiyonel, hata olsa bile devam eder)
    ↓
localStorage temizlenir (token, user, userEmail)
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

## 🔒 Güvenlik Notları

### 1. Token Güvenliği

- Token localStorage'da saklanır (XSS riski var)
- Token cookie'de de saklanır (30 gün geçerlilik)
- Token her API isteğinde `Authorization: Bearer {token}` header'ı ile gönderilir
- Token geçersiz olduğunda otomatik temizlenir ve kullanıcı çıkış yapılır

### 2. Şifre Güvenliği

- Şifreler asla localStorage'da saklanmaz
- Şifreler sadece API'ye gönderilir
- Şifre gücü kontrolü client-side'da yapılır
- Minimum şifre uzunluğu: 8 karakter (reset), 10 karakter (kayıt)

### 3. Email Doğrulama

- Kayıt sonrası email doğrulama zorunlu
- Doğrulama kodu 6 haneli
- Doğrulama kodu 10 dakika geçerli
- Kod yeniden gönderilebilir

### 4. Hata Yönetimi

- API hataları kullanıcıya toast mesajı ile gösterilir
- 404 hataları özel mesajlarla handle edilir
- Network hataları genel hata mesajı ile gösterilir
- Token geçersiz olduğunda otomatik logout yapılır

---

## 📱 Responsive Tasarım

Tüm auth sayfaları responsive tasarıma sahiptir:

- **Mobile (< 768px):** Full-screen gradient background, swipe gesture desteği
- **Desktop (≥ 768px):** Merkezi form, Header ve Footer gösterilir

---

## 🎯 Özellikler

### 1. Otomatik Login

Kayıt sonrası email doğrulaması başarılı olduğunda otomatik login yapılır:

```typescript
const performAutoLogin = async (email: string, password: string) => {
  const loginResponse = await fetch(`${API_V1_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
      device_name: 'web'
    })
  });
  
  // Token kaydedilir ve kullanıcı bilgileri fetch edilir
  // Ana sayfaya yönlendirilir
};
```

### 2. Cross-Tab Communication

AuthContext, `storage` event listener ile diğer tab'lardaki değişiklikleri dinler:

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

### 3. Guest Basket Merge

Giriş yapıldığında guest sepeti kullanıcı sepeti ile birleştirilir (BasketContext'te yapılır).

### 4. Notification Modal

Yeni kayıt olan kullanıcılar için bildirim tercihleri modal'ı gösterilir (AuthContext'te kontrol edilir).

---

## 🐛 Hata Senaryoları

### 1. Geçersiz Token

**Durum:** Token geçersiz veya süresi dolmuş

**Çözüm:**
- `GET /auth/me` 401 döner
- Token localStorage'dan silinir
- Kullanıcı otomatik logout yapılır
- Giriş sayfasına yönlendirilir

### 2. Email Zaten Kayıtlı

**Durum:** Kayıt sırasında email zaten kullanılıyor

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

**Çözüm:** Email doğrulama popup'ı gösterilir (kullanıcı zaten kayıtlı olabilir)

### 3. Doğrulama Kodu Hatalı

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

**Çözüm:** Hata mesajı gösterilir, kullanıcı tekrar deneyebilir veya yeni kod isteyebilir

### 4. Şifre Sıfırlama Kodu Geçersiz

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

**Çözüm:** Hata mesajı gösterilir, kullanıcı yeni şifre sıfırlama e-postası isteyebilir

---

## 📝 Notlar

1. **Token Saklama:** Token hem localStorage hem cookie'de saklanır (30 gün geçerlilik)
2. **Auto Login:** Kayıt sonrası email doğrulaması başarılı olduğunda otomatik login yapılır
3. **Guest Basket:** Giriş yapıldığında guest sepeti kullanıcı sepeti ile birleştirilir
4. **Cross-Tab:** Storage event listener ile diğer tab'lardaki değişiklikler dinlenir
5. **Notification Modal:** Yeni kayıt olan kullanıcılar için bildirim tercihleri modal'ı gösterilir
6. **Email Doğrulama:** Kayıt sonrası email doğrulama zorunludur (6 haneli kod, 10 dakika geçerlilik)
7. **Şifre Güvenliği:** Şifreler asla localStorage'da saklanmaz, sadece API'ye gönderilir
8. **Responsive:** Tüm auth sayfaları mobil ve desktop için optimize edilmiştir

---

## 🚀 İyileştirme Önerileri

1. **Refresh Token:** Access token süresi dolduğunda refresh token ile yenileme
2. **2FA:** İki faktörlü kimlik doğrulama desteği
3. **Social Login:** Facebook, Google ile giriş yapma
4. **Remember Me:** "Beni hatırla" özelliği ile token süresini uzatma
5. **Session Management:** Aktif oturumları görüntüleme ve yönetme
6. **Rate Limiting:** Brute force saldırılarına karşı rate limiting
7. **CSRF Protection:** CSRF token kullanımı
8. **Password Strength Indicator:** Şifre gücü göstergesi (zayıf/orta/güçlü)
