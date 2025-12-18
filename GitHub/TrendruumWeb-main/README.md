# Trendruum Web Uygulaması

Bu proje, [Next.js](https://nextjs.org) ile geliştirilmiş modern bir e-ticaret web uygulamasıdır. Trendruum platformu için kapsamlı bir alışveriş deneyimi sunar.

## Başlangıç

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev

```

Tarayıcınızda [https://trendruum.com](https://trendruum.com) adresini açarak sonucu görebilirsiniz.

`app/page.tsx` dosyasını düzenleyerek sayfayı değiştirebilirsiniz. Dosya düzenlendiğinde sayfa otomatik olarak güncellenir.

## Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **React Context** - State yönetimi
- **Axios** - HTTP istekleri
- **React Hot Toast** - Bildirimler

## API Endpoint'leri

Uygulama aşağıdaki API endpoint'lerini kullanmaktadır:

### Kimlik Doğrulama (Authentication)
```
POST /api/v1/auth/login          # Giriş yapma
POST /api/v1/auth/logout         # Çıkış yapma
GET  /api/v1/auth/me             # Kullanıcı bilgilerini getirme
POST /api/v1/auth/register       # Kayıt olma
POST /api/v1/auth/forgot-password # Şifre sıfırlama
```

### Müşteri İşlemleri (Customer)
```
GET  /api/v1/customer/profile/me              # Profil bilgileri
POST /api/v1/customer/profile/me-update       # Profil güncelleme
POST /api/v1/customer/profile/password-reset  # Şifre sıfırlama
GET  /api/v1/customer/addresses               # Adres listesi
POST /api/v1/customer/addresses               # Yeni adres ekleme
PUT  /api/v1/customer/addresses/{id}          # Adres güncelleme
DELETE /api/v1/customer/addresses/{id}        # Adres silme
GET  /api/v1/customer/profile/addresses/{id}  # Profil adres detayı
PUT  /api/v1/customer/profile/addresses/{id}  # Profil adres güncelleme
GET  /api/v1/customer/orders                  # Sipariş listesi
GET  /api/v1/customer/orders/{id}             # Sipariş detayı
POST /api/v1/customer/orders                  # Yeni sipariş oluşturma
POST /api/v1/customer/orders/{id}/cancel      # Sipariş iptal etme
POST /api/v1/customer/orders/{id}/return      # Sipariş iade etme
GET  /api/v1/customer/reviews                 # Müşteri yorumları
POST /api/v1/customer/reviews                 # Yorum ekleme
POST /api/v1/customer/questions/user-product-question # Ürün sorusu sorma
POST /api/v1/customer/questions/user-order-question  # Sipariş sorusu sorma
GET  /api/v1/customer/questions/user-order-question/{id} # Sipariş sorusu detayı
```

### Favoriler ve Koleksiyonlar
```
GET  /api/v1/customer/likes                   # Favori ürünler
POST /api/v1/customer/likes                   # Favori ekleme
DELETE /api/v1/customer/likes/{id}            # Favori silme
GET  /api/v1/customer/likes/collections       # Koleksiyonlar
POST /api/v1/customer/likes/collections       # Yeni koleksiyon
PUT  /api/v1/customer/likes/collections/{id}  # Koleksiyon güncelleme
DELETE /api/v1/customer/likes/collections/{id} # Koleksiyon silme
```

### Sepet İşlemleri (Basket)
```
GET  /api/v1/customer/basket                  # Sepet içeriği
POST /api/v1/customer/basket/add              # Sepete ekleme
PUT  /api/v1/customer/basket/update           # Sepet güncelleme
DELETE /api/v1/customer/basket/remove         # Sepetten çıkarma
POST /api/v1/customer/basket/clear            # Sepeti temizleme
```

### Mağaza Takibi
```
GET  /api/v1/customer/follows                 # Takip edilen mağazalar
POST /api/v1/customer/follows                 # Mağaza takip etme
DELETE /api/v1/customer/follows/{id}          # Mağaza takibini bırakma
```

### Ürünler (Products)
```
GET  /api/v1/products                         # Ürün listesi
GET  /api/v1/products/{slug}                  # Ürün detayı
GET  /api/v1/products/search                  # Ürün arama
GET  /api/v1/products/{id}/reviews            # Ürün yorumları
POST /api/v1/products/{id}/reviews            # Yorum ekleme
POST /api/v1/customer/questions/user-product-question # Ürün sorusu sorma
```

### Kategoriler (Categories)
```
GET  /api/v1/categories                       # Kategori listesi
GET  /api/v1/categories/{slug}                # Kategori detayı
GET  /api/v1/categories/{slug}/products       # Kategori ürünleri
GET  /api/v1/categories/{slug}/filter-fields  # Kategori filtreleri
GET  /api/v1/categories/list                  # Kategori arama
GET  /api/v1/category-products/{slug}         # Kategori ürünleri (alternatif)
GET  /api/v1/category-products-filter-fields/{id} # Kategori filtre alanları
```

### Markalar (Brands)
```
GET  /api/v1/brands                           # Marka listesi
GET  /api/v1/brands/{slug}                    # Marka detayı
GET  /api/v1/brands/{slug}/products           # Marka ürünleri
GET  /api/v1/brands/list                      # Marka arama
```

### Satıcılar (Sellers)
```
GET  /api/v1/sellers/{id}/info                # Satıcı bilgileri
GET  /api/v1/sellers/{id}/products            # Satıcı ürünleri
GET  /api/v1/stores/sections/{slug}           # Mağaza bölümleri
```

### Adres ve Konum
```
GET  /api/v1/countries/tr                     # Türkiye şehirleri
GET  /api/v1/countries/tr/cities/{id}         # İlçeler
GET  /api/v1/countries/tr/districts/{id}      # Mahalleler
GET  /api/v1/locations/countries/turkiye      # Türkiye konum bilgileri
GET  /api/v1/locations/cities/{slug}          # Şehir bilgileri
GET  /api/v1/locations/districts/{slug}       # İlçe bilgileri
```

### Siparişler (Orders)
```
GET  /api/v1/customer/orders                  # Müşteri siparişleri
POST /api/v1/customer/orders                  # Yeni sipariş
GET  /api/v1/customer/orders/{id}             # Sipariş detayı
POST /api/v1/customer/orders/{id}/cancel      # Sipariş iptal etme
POST /api/v1/customer/orders/{id}/return      # Sipariş iade etme
POST /api/v1/guest/orders                     # Misafir siparişi
```

### Misafir Kullanıcılar (Guest)
```
GET  /api/v1/guest-customer/{basketUUID}      # Misafir kullanıcı bilgileri
POST /api/v1/guest-customer                   # Misafir kullanıcı oluşturma
```

### Statik İçerik
```
GET  /api/v1/statics/menus                    # Menü yapısı
GET  /api/v1/navigation/top                   # Üst navigasyon menüsü
GET  /api/v1/pages/homepage                   # Ana sayfa içeriği
```

### Ödeme İşlemleri (Payments)
```
POST /api/v1/customer/payments/instalment-query # Taksit sorgulama
POST /api/v1/customer/payments/bin-query        # BIN sorgulama
```

### Yerel API Endpoint'leri
```
GET  /api/address                             # Adres bilgileri (şehir, ilçe, mahalle)
POST /api/chat                                # Trendruum Asistan chat
GET  /api/guest-customer                      # Misafir kullanıcı işlemleri
POST /api/guest-customer                      # Misafir kullanıcı oluşturma
GET  /api/navigation/top                      # Üst navigasyon menüsü
GET  /api/notification-preferences            # Bildirim tercihleri
PUT  /api/notification-preferences            # Bildirim tercihleri güncelleme
GET  /api/product-reviews                     # Ürün yorumları
GET  /api/products                            # Ürün listesi
GET  /api/products/search                     # Ürün arama
```




### Proxy Endpoint'leri
```
GET  /api/proxy/*                             # Dinamik proxy endpoint'leri
POST /api/proxy/*                             # Dinamik proxy endpoint'leri
PUT  /api/proxy/*                             # Dinamik proxy endpoint'leri
DELETE /api/proxy/*                           # Dinamik proxy endpoint'leri
```

## Konfigürasyon

### API Base URL'leri
```typescript
// lib/config.ts
export const API_BASE_URL = 'https://api.trendruum.com';
export const API_V1_URL = `${API_BASE_URL}/api/v1`;
export const PUBLIC_API_V1_URL = `${API_BASE_URL}/public/api/v1`;
export const STORAGE_URL = `${API_BASE_URL}/storage`;
```

### Proxy Yapılandırması
Uygulama, API isteklerini proxy üzerinden yönlendirir:
- `/api/v1/*` → `https://api.trendruum.com/api/v1/*`
- `/api/proxy/*` → Dinamik proxy endpoint'leri

## 📱 Özellikler

### E-ticaret Özellikleri
- **Ürün Kataloğu**: Kategorilere göre ürün listeleme
- **Gelişmiş Filtreleme**: Marka, renk, fiyat, cinsiyet filtreleri
- **Arama Sistemi**: Ürün, marka ve kategori arama
- **Sepet Yönetimi**: Ürün ekleme/çıkarma, miktar güncelleme
- **Favori Sistemi**: Ürün favorileme ve koleksiyon oluşturma
- **Sipariş Takibi**: Sipariş geçmişi ve durumu

### Kullanıcı Deneyimi
- **Responsive Tasarım**: Mobil ve desktop uyumlu
- **Hamburger Menü**: Mobil navigasyon
- **Breadcrumb**: Sayfa konumu göstergesi
- **Infinite Scroll**: Otomatik sayfa yükleme
- **Loading States**: Yükleme animasyonları
- **Error Handling**: Hata yönetimi

### Güvenlik
- **JWT Token**: Kimlik doğrulama
- **CORS**: Cross-origin istek yönetimi
- **Input Validation**: Girdi doğrulama
- **Rate Limiting**: API istek sınırlaması

## Deployment

### Vercel ile Deploy
```bash
# Vercel CLI ile
vercel

# GitHub ile otomatik deploy
# Repository'yi Vercel'e bağlayın
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.trendruum.com
NEXT_PUBLIC_STORAGE_URL=https://api.trendruum.com/storage
```

## Dokümantasyon

- [Next.js Dokümantasyonu](https://nextjs.org/docs) - Next.js özellikleri ve API
- [Next.js Öğrenme](https://nextjs.org/learn) - İnteraktif Next.js eğitimi
- [Tailwind CSS](https://tailwindcss.com/docs) - CSS framework dokümantasyonu





## İletişim

- **Website**: [https://trendruum.com](https://trendruum.com)
- **API**: [https://api.trendruum.com](https://api.trendruum.com)
- **Development**: [https://trendruum.com](https://trendruum.com)


