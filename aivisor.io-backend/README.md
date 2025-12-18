# Aivisor Backend

Bu proje, hisse senedi verilerini Alpha Vantage API'sinden çeken ve AI tahminleri sağlayan bir Go backend uygulamasıdır.

## Kurulum

1. Go modülünü başlatın:
```bash
go mod init aivisor-backend
```

2. Gerekli paketleri yükleyin:
```bash
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
```

3. Alpha Vantage API anahtarınızı alın:
   - [Alpha Vantage](https://www.alphavantage.co/support/#api-key) sitesine gidin
   - Ücretsiz API anahtarı alın
   - `stock_service.go` dosyasındaki `ALPHA_VANTAGE_API_KEY` sabitini güncelleyin

## Çalıştırma

```bash
go run main.go stock_service.go
```

Sunucu `http://localhost:8080` adresinde çalışacaktır.

## API Endpoints

### Tüm Hisse Senetleri
```
GET /api/stocks
```

### Belirli Bir Hisse Senedi
```
GET /api/stocks/:symbol
```

Örnek: `GET /api/stocks/AAPL`

### Hisse Senedi Arama
```
GET /api/search/:keyword
```

Örnek: `GET /api/search/tesla`

### Piyasa Durumu
```
GET /api/market-status
```

## Desteklenen Hisse Senetleri

- AAPL (Apple Inc.)
- MSFT (Microsoft Corporation)
- GOOGL (Alphabet Inc.)
- AMZN (Amazon.com Inc.)
- TSLA (Tesla Inc.)
- NVDA (NVIDIA Corporation)
- META (Meta Platforms Inc.)
- NFLX (Netflix Inc.)

## Özellikler

- Gerçek zamanlı hisse senedi verileri (Alpha Vantage API)
- AI tahminleri (değişim yüzdesine göre)
- Güven skorları
- Sektör ve endüstri bilgileri
- Hisse senedi arama fonksiyonu
- Piyasa durumu bilgileri
- CORS desteği
- Fallback API desteği (GLOBAL_QUOTE + TIME_SERIES_DAILY)
