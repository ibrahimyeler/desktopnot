# OAuth Integration Guide

Bu rehber, mevcut register sayfanızı (`http://localhost:3000/register`) API'mizle entegre etmek için hazırlanmıştır.

## 🚀 Hızlı Entegrasyon

### 1. JavaScript Dosyasını Ekleyin

Register sayfanızın HTML'ine şu script tag'ini ekleyin:

```html
<script src="http://localhost:8080/public/oauth-integration.js"></script>
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
        <script src="http://localhost:8080/public/oauth-integration.js" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
```

### 3. Manuel Entegrasyon

Eğer otomatik entegrasyon çalışmazsa, butonlara manuel olarak event listener ekleyin:

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

## 🧪 Test Etme

### 1. API'yi Başlatın

```bash
cd /Users/macbookpro/Documents/pangea-api
go run main.go config.go auth.go
```

### 2. Register Sayfasını Açın

```bash
open http://localhost:3000/register
```

### 3. OAuth Butonlarını Test Edin

- Google butonuna tıklayın
- GitHub butonuna tıklayın
- Console'da "OAuth Integration loaded successfully" mesajını görmelisiniz

## 🔍 Debug

### Console'da Kontrol Edin

Browser'ın Developer Tools'unda Console sekmesini açın ve şu mesajları arayın:

```
OAuth Integration loaded successfully
Google OAuth button connected
GitHub OAuth button connected
```

### Network Sekmesinde Kontrol Edin

- Google butonuna tıkladığınızda: `GET /auth/google` isteği
- GitHub butonuna tıkladığınızda: `GET /auth/github` isteği

## 🛠️ Özelleştirme

### API URL'ini Değiştirme

`oauth-integration.js` dosyasında şu satırı değiştirin:

```javascript
const API_BASE = 'http://localhost:8080'; // Bu satırı değiştirin
```

### Callback URL'lerini Değiştirme

API'nizin callback URL'lerini değiştirmek için:

```bash
export GOOGLE_REDIRECT_URL="http://localhost:3000/auth/google/callback"
export GITHUB_REDIRECT_URL="http://localhost:3000/auth/github/callback"
```

### Başarılı Giriş Sonrası Yönlendirme

`oauth-integration.js` dosyasında şu satırları değiştirin:

```javascript
// Google callback'te
setTimeout(() => {
    window.location.href = '/dashboard'; // Bu URL'i değiştirin
}, 2000);

// GitHub callback'te
setTimeout(() => {
    window.location.href = '/dashboard'; // Bu URL'i değiştirin
}, 2000);
```

## 📋 API Endpoint'leri

### OAuth Endpoint'leri

- `GET /auth/google` - Google OAuth başlatma
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - GitHub OAuth başlatma
- `GET /auth/github/callback` - GitHub OAuth callback

### Register Endpoint'i

- `POST /register` - Normal kayıt

## 🚨 Sorun Giderme

### CORS Hatası

Eğer CORS hatası alıyorsanız, API'nizin CORS ayarlarını kontrol edin. API'miz zaten CORS desteği ile gelir.

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

## 📞 Destek

Herhangi bir sorun yaşarsanız:

1. Console'daki hata mesajlarını kontrol edin
2. API log'larını kontrol edin
3. Network sekmesindeki istekleri kontrol edin
4. Environment variable'ların doğru ayarlandığından emin olun 