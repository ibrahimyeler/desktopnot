# Sepet İşlemleri - Endpoint ve Component Dokümantasyonu

## 1. SEPETE EKLE BUTONU - ENDPOINT

### Endpoint
```
POST /api/v1/customer/baskets/add
```

### Kullanım Yeri
- **Component:** `app/context/BasketContext.tsx` (satır 506-609)
- **Fonksiyon:** `addToBasket`
- **Kullanıldığı Yerler:**
  - `components/product/details/ProductActions.tsx` - Ürün detay sayfasında sepete ekle butonu
  - `components/product/ProductDetails.tsx` - Ürün detay component'inde
  - `components/cart/CartTabs.tsx` - Sepet sayfasında önceden gezdiklerim sekmesinde
  - `components/Home/PopularProducts.tsx` - Popüler ürünler listesinde
  - `components/store/AllProductsSection.tsx` - Mağaza ürünleri listesinde

### Request Body
```json
{
  "product_id": "string",
  "quantity": number,
  "variants": {
    "variant_key": "variant_value"
  }
}
```

### Request Headers
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### Response
```json
{
  "meta": {
    "status": "success",
    "message": "string",
    "code": number
  },
  "data": {
    "id": "string",
    "user_id": "string",
    "status": "string",
    "total_price": number,
    "basket_groups": [
      {
        "id": "string",
        "seller_id": "string",
        "seller": {
          "name": "string",
          "id": "string"
        },
        "basket_group_items": [
          {
            "id": "string",
            "product_id": "string",
            "quantity": number,
            "price": number,
            "total_price": number,
            "product": {
              "id": "string",
              "name": "string",
              "slug": "string",
              "price": number,
              "images": [...],
              "medias": [...]
            },
            "variants": {}
          }
        ]
      }
    ]
  }
}
```

### Özellikler
- Stok kontrolü yapılır (ürün stokta yoksa hata mesajı gösterilir)
- Variant bilgileri desteklenir
- Sepete eklenen ürün geçmişe kaydedilir (localStorage)
- Guest kullanıcılar için farklı endpoint kullanılır (`/baskets/add`)

---

## 2. SEPET SAYFASI - COMPONENT'LER VE ENDPOINT'LER

### Ana Sayfa
- **Dosya:** `app/sepet/page.tsx`
- **Client Component:** `app/sepet/CartPageClient.tsx`

### Kullanılan Component'ler

#### 2.1. CartItemsList
- **Dosya:** `components/cart/CartItemsList.tsx`
- **Açıklama:** Sepetteki ürünlerin listesini gösterir, miktar güncelleme ve silme işlemlerini yapar

**Kullanılan Endpoint'ler:**
- `GET /api/v1/products/{productId}` - Ürün stok kontrolü için
- `GET /api/v1/products/{slug}` - Ürün resim ve bilgilerini almak için
- `GET /api/v1/brands/{brandId}` - Marka bilgilerini almak için

**Fonksiyonlar:**
- `handleQuantityChange` - Ürün miktarını günceller
- `handleDelete` - Ürünü sepetten siler
- `handleClearBasket` - Sepeti tamamen temizler
- `checkProductStock` - Ürün stok durumunu kontrol eder

**Özellikler:**
- Kampanya bilgilerini gösterir (`useCartCampaigns` hook'u ile)
- Kargo bedava uyarısı gösterir (400 TL üzeri)
- Satıcı bazlı gruplama yapar
- Variant bilgilerini gösterir
- Stok uyarıları gösterir

#### 2.2. CartSummary
- **Dosya:** `components/cart/CartSummary.tsx`
- **Açıklama:** Sepet özeti, toplam fiyat, kargo ücreti ve indirim kodları gösterir

**Kullanılan Endpoint'ler:**

##### 2.2.1. İndirim Kodu Uygula
```
POST /api/v1/customer/baskets/apply-discount-coupon
```

**Request Body:**
```json
{
  "code": "string"
}
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "string"
  },
  "data": {
    "discount_coupon_code_amount": number
  }
}
```

**Kullanım:** `handleApplyDiscountCode` fonksiyonunda (satır 107-153)

##### 2.2.2. İndirim Kodu Kaldır
```
POST /api/v1/customer/baskets/remove-discount-coupon
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "string"
  }
}
```

**Kullanım:** `handleRemoveDiscountCode` fonksiyonunda (satır 155-193)

**Özellikler:**
- Kampanya indirimlerini gösterir
- Kargo ücretini hesaplar (her satıcı için ayrı)
- İndirim kodu girişi ve uygulama
- Toplam fiyat hesaplama
- Sepeti onayla butonu (ödeme sayfasına yönlendirir)

#### 2.3. CartTabs
- **Dosya:** `components/cart/CartTabs.tsx`
- **Açıklama:** "Önceden Gezdiklerim" ve "Favorilerim" sekmelerini gösterir

**Kullanılan Endpoint'ler:**
- `GET /api/v1/products/{slug}` - Ürün resimlerini almak için (satır 83)

**Özellikler:**
- Sepet geçmişini localStorage'dan okur
- Favorileri `FavoriteContext`'ten alır
- Sepete ekle butonu ile ürün ekleme

#### 2.4. DiscountCodeInput
- **Dosya:** `components/cart/DiscountCodeInput.tsx`
- **Açıklama:** İndirim kodu girişi için input component'i

**Özellikler:**
- İndirim kodu girişi
- Uygulanmış kod gösterimi
- Kod kaldırma butonu
- Giriş yapmamış kullanıcılar için uyarı

#### 2.5. AddressPopup
- **Dosya:** `components/cart/AddressPopup.tsx`
- **Açıklama:** Adres ekleme popup'ı (ödeme sayfası için)

**Kullanılan Endpoint'ler:**

##### 2.5.1. Kullanıcı Bilgilerini Getir
```
GET /api/v1/auth/me
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Kullanım:** Kullanıcı email bilgisini almak için (satır 138)

##### 2.5.2. Şehirleri Getir
```
GET /api/v1/locations/countries/turkiye
```

**Response:**
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "cities": [
      {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    ]
  }
}
```

**Kullanım:** Şehir listesini almak için (satır 299)

##### 2.5.3. İlçeleri Getir
```
GET /api/v1/locations/cities/{citySlug}
```

**Response:**
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "districts": [
      {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    ]
  }
}
```

**Kullanım:** İlçe listesini almak için (satır 200)

##### 2.5.4. Mahalleleri Getir
```
GET /api/v1/locations/districts/{districtSlug}
```

**Response:**
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "neighborhoods": [
      {
        "id": "string",
        "name": "string",
        "slug": "string"
      }
    ]
  }
}
```

**Kullanım:** Mahalle listesini almak için (satır 217)

##### 2.5.5. Adresleri Getir (Customer)
```
GET /api/v1/customer/addresses
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Kullanım:** Kullanıcının kayıtlı adreslerini kontrol etmek için (satır 319)

##### 2.5.6. Adres Ekle (Customer)
```
POST /api/v1/customer/profile/addresses
```

**Request Body:**
```json
{
  "user": {
    "firstname": "string",
    "lastname": "string",
    "phone": "string",
    "email": "string"
  },
  "address": {
    "title": "string",
    "city": "string",
    "district": "string",
    "neighborhood": "string",
    "description": "string"
  },
  "invoice": {
    "type": "individual" | "corporate",
    "tax_office": "string",
    "tax_number": "string",
    "e_invoice": boolean
  }
}
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Kullanım:** Yeni adres eklemek için (satır 424)

---

## 3. SEPET İŞLEMLERİ - BASKETCONTEXT ENDPOINT'LERİ

### 3.1. Sepeti Getir
```
GET /api/v1/customer/baskets
```

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Kullanım:** `refreshBasket` fonksiyonunda (satır 469)
- **Dosya:** `app/context/BasketContext.tsx`
- **Açıklama:** Kullanıcının sepetini getirir

### 3.2. Sepete Ürün Ekle
```
POST /api/v1/customer/baskets/add
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": number,
  "variants": {
    "variant_key": "variant_value"
  }
}
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Kullanım:** `addToBasket` fonksiyonunda (satır 542)
- **Dosya:** `app/context/BasketContext.tsx`

### 3.3. Sepetteki Ürün Miktarını Güncelle
```
POST /api/v1/customer/baskets/update
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": number
}
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Kullanım:** `updateBasketItem` fonksiyonunda (satır 680)
- **Dosya:** `app/context/BasketContext.tsx`
- **Kullanıldığı Yer:** `CartItemsList.tsx` - `handleQuantityChange` fonksiyonunda

### 3.4. Sepetten Ürün Kaldır
```
POST /api/v1/customer/baskets/remove
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": number
}
```

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Kullanım:** `removeFromBasket` fonksiyonunda (satır 716)
- **Dosya:** `app/context/BasketContext.tsx`
- **Kullanıldığı Yer:** `CartItemsList.tsx` - `handleDelete` fonksiyonunda

### 3.5. Sepeti Temizle
```
DELETE /api/v1/customer/baskets/clear
```

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Kullanım:** `clearBasket` fonksiyonunda (satır 769)
- **Dosya:** `app/context/BasketContext.tsx`
- **Kullanıldığı Yer:** `CartItemsList.tsx` - `handleClearBasket` fonksiyonunda

---

## 4. SEPET SAYFASI SERVER-SIDE DATA FETCHING

### 4.1. Server Component
- **Dosya:** `app/sepet/page.tsx`
- **Fonksiyon:** `getBasketData`

**Kullanılan Endpoint:**
```
GET /api/v1/customer/baskets
```

**Request Headers:**
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Açıklama:** Sayfa ilk yüklendiğinde sepet verilerini server-side'da getirir ve client component'e initial data olarak geçirir.

---

## 5. ÖZELLİKLER VE NOTLAR

### 5.1. Stok Kontrolü
- Sepete ekleme ve miktar güncelleme işlemlerinde stok kontrolü yapılır
- Stok yetersizse kullanıcıya uyarı mesajı gösterilir
- Stok kontrolü için `GET /api/v1/products/{productId}` endpoint'i kullanılır

### 5.2. Kampanya Desteği
- Sepetteki ürünler için aktif kampanyalar gösterilir
- Kampanya indirimleri otomatik hesaplanır
- `useCartCampaigns` hook'u ile kampanya bilgileri alınır

### 5.3. Kargo Ücreti Hesaplama
- Her satıcı için ayrı kargo ücreti hesaplanır
- 400 TL ve üzeri alışverişlerde kargo ücretsiz
- Kargo ücreti `CartSummary` component'inde gösterilir

### 5.4. Variant Desteği
- Ürün varyantları sepete eklenirken desteklenir
- Variant bilgileri sepet listesinde gösterilir

### 5.5. Guest Basket
- Giriş yapmamış kullanıcılar için guest basket kullanılır
- Guest basket için farklı endpoint'ler kullanılır (`/baskets/*` yerine `/customer/baskets/*`)
- Login olduğunda guest basket kullanıcı sepetine aktarılır

### 5.6. Sepet Geçmişi
- Sepete eklenen ürünler localStorage'a kaydedilir
- Son 2 haftalık veri tutulur
- `CartTabs` component'inde "Önceden Gezdiklerim" sekmesinde gösterilir

---

## 6. HATA YÖNETİMİ

### 6.1. 401 Unauthorized
- Token geçersizse kullanıcı login sayfasına yönlendirilir
- localStorage'dan token temizlenir

### 6.2. 404 Not Found
- Sepet bulunamadığında boş sepet gösterilir
- Ürün bulunamadığında hata mesajı gösterilir

### 6.3. 500 Server Error
- Sunucu hatası durumunda kullanıcıya bilgilendirme mesajı gösterilir
- Stok hatası olarak yorumlanabilir

### 6.4. Stok Hataları
- Stok yetersizliği durumunda özel hata mesajları gösterilir
- Kullanıcıya mevcut stok miktarı bildirilir

---

## 7. KULLANILAN HOOK'LAR VE SERVİSLER

### 7.1. useBasket
- **Dosya:** `app/context/BasketContext.tsx`
- **Açıklama:** Sepet işlemleri için context hook'u
- **Fonksiyonlar:**
  - `addToBasket` - Sepete ürün ekle
  - `updateBasketItem` - Ürün miktarını güncelle
  - `removeFromBasket` - Ürünü sepetten kaldır
  - `clearBasket` - Sepeti temizle
  - `refreshBasket` - Sepeti yenile

### 7.2. useCartCampaigns
- **Dosya:** `app/hooks/useCartCampaigns.ts`
- **Açıklama:** Sepetteki ürünler için aktif kampanyaları getirir

### 7.3. useAuth
- **Dosya:** `app/context/AuthContext.tsx`
- **Açıklama:** Kullanıcı giriş durumunu kontrol eder

---

## 8. ÖZET - CUSTOMER ENDPOINT'LERİ

| Endpoint | Method | Açıklama | Kullanıldığı Yer |
|----------|--------|----------|------------------|
| `/customer/baskets` | GET | Sepeti getir | `BasketContext.tsx`, `sepet/page.tsx` |
| `/customer/baskets/add` | POST | Sepete ürün ekle | `BasketContext.tsx` |
| `/customer/baskets/update` | POST | Ürün miktarını güncelle | `BasketContext.tsx` |
| `/customer/baskets/remove` | POST | Ürünü sepetten kaldır | `BasketContext.tsx` |
| `/customer/baskets/clear` | DELETE | Sepeti temizle | `BasketContext.tsx` |
| `/customer/baskets/apply-discount-coupon` | POST | İndirim kodu uygula | `CartSummary.tsx` |
| `/customer/baskets/remove-discount-coupon` | POST | İndirim kodu kaldır | `CartSummary.tsx` |
| `/customer/addresses` | GET | Adresleri getir | `AddressPopup.tsx` |
| `/customer/profile/addresses` | POST | Adres ekle | `AddressPopup.tsx` |
| `/auth/me` | GET | Kullanıcı bilgilerini getir | `AddressPopup.tsx` |

---

## 9. İLGİLİ DOSYALAR

### Component'ler
- `app/sepet/CartPageClient.tsx` - Ana sepet sayfası client component'i
- `components/cart/CartItemsList.tsx` - Sepet ürünleri listesi
- `components/cart/CartSummary.tsx` - Sepet özeti ve ödeme butonu
- `components/cart/CartTabs.tsx` - Önceden gezdiklerim ve favoriler sekmeleri
- `components/cart/DiscountCodeInput.tsx` - İndirim kodu girişi
- `components/cart/AddressPopup.tsx` - Adres ekleme popup'ı
- `components/cart/ClearBasketModal.tsx` - Sepeti temizle onay modal'ı

### Context ve Hook'lar
- `app/context/BasketContext.tsx` - Sepet context'i ve tüm sepet işlemleri
- `app/hooks/useCartCampaigns.ts` - Kampanya hook'u
- `app/context/AuthContext.tsx` - Authentication context'i

### Servisler
- `app/services/basketService.ts` - Sepet servisi (kullanılmıyor, direkt context kullanılıyor)

---

**Not:** Bu dokümantasyon sadece customer (giriş yapmış kullanıcı) için olan endpoint'leri içermektedir. Guest kullanıcılar için farklı endpoint'ler kullanılmaktadır (`/baskets/*` yerine `/customer/baskets/*`).

