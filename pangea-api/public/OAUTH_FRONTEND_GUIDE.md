# OAuth Frontend Integration Guide

Bu rehber, mevcut register sayfanızı Google ve GitHub OAuth ile entegre etmek için hazırlanmıştır.

## 🚀 Hızlı Başlangıç

### 1. JavaScript Dosyasını Ekleyin

Register sayfanızın HTML'ine şu script tag'ini ekleyin:

```html
<script src="http://localhost:8080/oauth-integration.js"></script>
```

### 2. Next.js Uygulaması İçin

Eğer Next.js kullanıyorsanız, `_app.js` veya `layout.js` dosyanıza ekleyin:

```javascript
// pages/_app.js veya app/layout.js
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script src="http://localhost:8080/oauth-integration.js" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

## 🔧 OAuth Kurulumu

### Google OAuth2 Kurulumu

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. Google+ API'yi etkinleştirin
4. "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Application Type: "Web application"
6. Authorized redirect URIs ekleyin:
   - `http://localhost:8080/auth/google/callback`
7. Client ID ve Client Secret'ı kopyalayın

### GitHub OAuth2 Kurulumu

1. [GitHub Developer Settings](https://github.com/settings/developers)'e gidin
2. "New OAuth App" oluşturun
3. Detayları doldurun:
   - Application name: "Pangea API"
   - Homepage URL: `http://localhost:8080`
   - Authorization callback URL: `http://localhost:8080/auth/github/callback`
4. Client ID ve Client Secret'ı kopyalayın

### Environment Variables

API'nizi çalıştırmadan önce environment variable'ları ayarlayın:

```bash
# Google OAuth2
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth2
export GITHUB_CLIENT_ID="your-github-client-id"
export GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🎯 Frontend Entegrasyonu

### 1. Otomatik Entegrasyon

JavaScript dosyası otomatik olarak Google ve GitHub butonlarını bulup event listener'ları ekler:

```javascript
// Otomatik olarak çalışır
// Google butonları: "google", "continue with google" içeren butonlar
// GitHub butonları: "github", "continue with github" içeren butonlar
```

### 2. Manuel Entegrasyon

Eğer otomatik entegrasyon çalışmazsa:

```javascript
// Google butonu için
document.querySelector('[data-google-auth]').addEventListener('click', () => {
  window.OAuthIntegration.handleGoogleAuth();
});

// GitHub butonu için
document.querySelector('[data-github-auth]').addEventListener('click', () => {
  window.OAuthIntegration.handleGithubAuth();
});
```

### 3. React Component Örneği

```jsx
import { useEffect } from 'react';

function OAuthButtons() {
  useEffect(() => {
    // OAuth integration script'i yüklendikten sonra
    if (window.OAuthIntegration) {
      console.log('OAuth Integration loaded');
    }
  }, []);

  const handleGoogleAuth = () => {
    if (window.OAuthIntegration) {
      window.OAuthIntegration.handleGoogleAuth();
    }
  };

  const handleGithubAuth = () => {
    if (window.OAuthIntegration) {
      window.OAuthIntegration.handleGithubAuth();
    }
  };

  return (
    <div className="oauth-buttons">
      <button 
        onClick={handleGoogleAuth}
        className="btn btn-google"
      >
        Continue with Google
      </button>
      
      <button 
        onClick={handleGithubAuth}
        className="btn btn-github"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
```

### 4. Vue.js Component Örneği

```vue
<template>
  <div class="oauth-buttons">
    <button @click="handleGoogleAuth" class="btn btn-google">
      Continue with Google
    </button>
    
    <button @click="handleGithubAuth" class="btn btn-github">
      Continue with GitHub
    </button>
  </div>
</template>

<script>
export default {
  mounted() {
    // OAuth integration script'i yüklendikten sonra
    if (window.OAuthIntegration) {
      console.log('OAuth Integration loaded');
    }
  },
  methods: {
    handleGoogleAuth() {
      if (window.OAuthIntegration) {
        window.OAuthIntegration.handleGoogleAuth();
      }
    },
    handleGithubAuth() {
      if (window.OAuthIntegration) {
        window.OAuthIntegration.handleGithubAuth();
      }
    }
  }
}
</script>
```

## 🔄 OAuth Flow

### 1. Kullanıcı Butona Tıklar
```javascript
// Frontend'de
window.OAuthIntegration.handleGoogleAuth();
// veya
window.OAuthIntegration.handleGithubAuth();
```

### 2. API OAuth URL'ini Döner
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/oauth/authorize?..."
}
```

### 3. Kullanıcı OAuth Provider'a Yönlendirilir
```javascript
window.location.href = data.auth_url;
```

### 4. OAuth Provider Kullanıcıyı Callback URL'e Yönlendirir
```
http://localhost:8080/auth/google/callback?code=...&state=...
```

### 5. API Kullanıcı Bilgilerini Alır
```json
{
  "success": true,
  "message": "Google authentication successful",
  "user": {
    "id": "123456789",
    "email": "john.doe@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "picture": "https://...",
    "provider": "google"
  }
}
```

## 🎨 CSS Styling

### Google Button Styling
```css
.btn-google {
  background: #db4437;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-google:hover {
  background: #c23321;
}
```

### GitHub Button Styling
```css
.btn-github {
  background: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-github:hover {
  background: #24292e;
}
```

### Icon'lar
```html
<!-- Google Icon -->
<svg viewBox="0 0 24 24" width="20" height="20">
  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
</svg>

<!-- GitHub Icon -->
<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
</svg>
```

## 🔍 Debug ve Test

### 1. Console'da Kontrol Edin
Browser'ın Developer Tools'unda Console sekmesini açın ve şu mesajları arayın:

```
OAuth Integration loaded successfully
Google OAuth button connected
GitHub OAuth button connected
```

### 2. Network Sekmesinde Kontrol Edin
- Google butonuna tıkladığınızda: `GET /auth/google` isteği
- GitHub butonuna tıkladığınızda: `GET /auth/github` isteği

### 3. API Test
```bash
# Google OAuth test
curl http://localhost:8080/auth/google

# GitHub OAuth test
curl http://localhost:8080/auth/github
```

## 🚨 Sorun Giderme

### OAuth Butonları Çalışmıyor
1. Console'da hata mesajlarını kontrol edin
2. Network sekmesinde isteklerin gönderilip gönderilmediğini kontrol edin
3. API'nin çalışıp çalışmadığını kontrol edin: `curl http://localhost:8080/health`

### OAuth Konfigürasyonu Hatası
Environment variable'ların doğru ayarlandığından emin olun:

```bash
echo $GOOGLE_CLIENT_ID
echo $GITHUB_CLIENT_ID
```

### CORS Hatası
API zaten CORS desteği ile gelir. Eğer CORS hatası alıyorsanız, API'nin çalıştığından emin olun.

## 📋 API Endpoint'leri

### OAuth Endpoint'leri
- `GET /auth/google` - Google OAuth başlatma
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - GitHub OAuth başlatma
- `GET /auth/github/callback` - GitHub OAuth callback

### Response Formatları

**Success Response:**
```json
{
  "success": true,
  "auth_url": "https://accounts.google.com/oauth/authorize?..."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Google OAuth not configured"
}
```

## 🎯 Özet

1. **JavaScript dosyasını ekleyin** - Otomatik entegrasyon için
2. **OAuth kurulumu yapın** - Google ve GitHub developer console'larında
3. **Environment variable'ları ayarlayın** - API'yi çalıştırmadan önce
4. **Test edin** - Console ve Network sekmesinde kontrol edin

Bu adımları takip ederek register sayfanızda Google ve GitHub ile giriş özelliğini aktif hale getirebilirsiniz! 🚀 