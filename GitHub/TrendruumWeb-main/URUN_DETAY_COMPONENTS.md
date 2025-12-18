# Ürün Detay Sayfası Component'leri ve API Endpoint'leri

Bu dokümantasyon, ürün detay sayfasında (`/urunler/[slug]`) kullanılan tüm component'leri ve her birinin kullandığı API endpoint'lerini içermektedir.

## Ana Sayfa Component'i

### `ProductPageClient` (`app/urunler/[slug]/ProductPageClient.tsx`)

**Kullanılan Endpoint'ler:**

1. **Ürün Detayı**
   - `GET /api/v1/products/{slug}`
   - Açıklama: Ürünün temel bilgilerini getirir
   - Kullanım: İlk yüklemede ve ürün güncellemelerinde

2. **Ürün Varyantları**
   - `GET /api/v1/products/{productId}/variants`
   - Açıklama: Ürünün tüm varyant kombinasyonlarını getirir (renk, beden vb.)
   - Kullanım: Varyant seçimi için

3. **Kategori Hiyerarşisi**
   - `GET /api/v1/categories`
   - Açıklama: Tüm kategorileri getirir (breadcrumb için)
   - Kullanım: Breadcrumb oluşturma

4. **Kategori Detayı**
   - `GET /api/v1/categories/{categorySlug}`
   - Açıklama: Belirli bir kategorinin detaylarını getirir
   - Kullanım: Breadcrumb için parent kategorileri bulma

5. **Ürün Yorumları**
   - `GET /api/v1/products/{productId}/reviews?page=1&limit=10`
   - `GET /api/v1/products/{productSlug}/reviews?page=1&limit=10`
   - Açıklama: Ürün yorumlarını getirir
   - Kullanım: CustomerReviews component'ine veri sağlar

6. **Ürün Soruları**
   - `GET /api/v1/products/{productId}/questions?page=1&limit=10`
   - `GET /api/v1/products/{productSlug}/questions?page=1&limit=10`
   - Açıklama: Ürün sorularını getirir
   - Kullanım: ProductQuestions component'ine veri sağlar

---

## Alt Component'ler

### 1. `ProductImages` (`components/product/ProductImages.tsx`)

**Açıklama:** Ürün görsellerini gösterir, modal ile tam ekran görüntüleme sağlar

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten (`ProductPageClient`) prop olarak gelir

**Props:**
- `images`: Ürün görselleri array'i
- `productName`: Ürün adı
- `isAdultCategory`: Yetişkin kategorisi mi?
- `isAdultVerified`: Yaş doğrulaması yapıldı mı?
- `stock`: Stok durumu
- `status`: Ürün durumu
- `badges`: Ürün rozetleri

---

### 2. `ProductHeader` (`components/product/details/ProductHeader.tsx`)

**Açıklama:** Ürün başlığı, marka, fiyat ve rating bilgilerini gösterir

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `product`: Ürün objesi (name, price, rating, brand vb.)

---

### 3. `ProductSidebar` (`components/product/details/ProductSidebar.tsx`)

**Açıklama:** Satıcı bilgileri, marka bilgileri, takip et butonu ve koleksiyonlar

**Kullanılan Endpoint'ler:**

1. **Takip Durumu Kontrolü**
   - `GET /api/v1/customer/follows`
   - Açıklama: Kullanıcının takip ettiği mağazaları getirir
   - Kullanım: Satıcıyı takip edip etmediğini kontrol eder
   - Auth: ✅ Bearer token gerekli

2. **Koleksiyonlar**
   - `GET /api/v1/customer/likes/collections`
   - Açıklama: Kullanıcının koleksiyonlarını getirir
   - Kullanım: Koleksiyonlara ekleme için
   - Auth: ✅ Bearer token gerekli

3. **Satıcıyı Takip Et**
   - `POST /api/v1/customer/follows/{storeId}`
   - Açıklama: Satıcıyı takip etmeye başlar
   - Kullanım: "Takip Et" butonuna tıklandığında
   - Auth: ✅ Bearer token gerekli

4. **Satıcıyı Takibi Bırak**
   - `DELETE /api/v1/customer/follows/{storeId}`
   - Açıklama: Satıcı takibini bırakır
   - Kullanım: "Takibi Bırak" butonuna tıklandığında
   - Auth: ✅ Bearer token gerekli

**Props:**
- `campaigns`: Kampanya bilgileri
- `brand`: Marka bilgileri
- `seller`: Satıcı bilgileri
- `productId`: Ürün ID'si
- `productName`: Ürün adı
- `reviews`: Yorumlar array'i

---

### 4. `ProductVariants` (`components/product/details/ProductVariants.tsx`)

**Açıklama:** Ürün varyantlarını gösterir (renk, beden vb.)

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir (`availableVariants`)

**Props:**
- `variants`: Varyant array'i
- `availableVariants`: Tüm varyant kombinasyonları
- `selectedVariants`: Seçili varyantlar
- `onVariantChange`: Varyant değiştiğinde callback

---

### 5. `ProductActions` (`components/product/details/ProductActions.tsx`)

**Açıklama:** "Hemen Al" ve "Sepete Ekle" butonları

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Context API kullanır (`BasketContext`)

**Props:**
- `product`: Ürün objesi
- `selectedVariantId`: Seçili varyant ID'si
- `selectedVariants`: Seçili varyantlar
- `hasSizeVariants`: Beden varyantı var mı?
- `onFavoriteClick`: Favorilere ekleme callback
- `isInFavorites`: Favorilerde mi?
- `campaign`: Kampanya bilgileri
- `isProductInCampaign`: Ürün kampanyada mı?
- `getCampaignQuantity`: Kampanya miktar hesaplama fonksiyonu

---

### 6. `ProductInfo` (`components/product/details/ProductInfo.tsx`)

**Açıklama:** Ürün açıklaması ve detay bilgileri

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `description`: Ürün açıklaması (HTML)
- `attributes`: Ürün özellikleri

---

### 7. `ProductHighlights` (`components/product/details/ProductHighlights.tsx`)

**Açıklama:** Ürün öne çıkan özellikleri

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `highlights`: Öne çıkan özellikler array'i

---

### 8. `ProductDeliveryWidget` (`components/product/details/ProductDeliveryWidget.tsx`)

**Açıklama:** Teslimat bilgileri widget'ı

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `seller`: Satıcı bilgileri
- `shippingPolicy`: Kargo politikası

---

### 9. `ProductShipping` (`components/product/details/ProductShipping.tsx`)

**Açıklama:** Kargo bilgileri ve kargo firmaları

**Kullanılan Endpoint'ler:**

1. **Satıcı Bilgileri**
   - `GET /api/v1/sellers/{sellerId}/info`
   - Açıklama: Satıcının kargo bilgilerini getirir
   - Kullanım: Kargo firmalarını ve teslimat sürelerini gösterir

**Props:**
- `sellerId`: Satıcı ID'si
- `shippingPolicy`: Kargo politikası

---

### 10. `OtherSellers` (`components/product/OtherSellers.tsx`)

**Açıklama:** Aynı ürünü satan diğer satıcıları gösterir

**Kullanılan Endpoint'ler:**

1. **Diğer Satıcılar**
   - `GET /api/v1/products/{productId}/other-sellers`
   - Açıklama: Aynı ürünü satan diğer satıcıları getirir
   - Kullanım: Server-side'da `page.tsx` içinde çağrılır
   - Not: Endpoint yoksa 404 döner, sessizce handle edilir

**Props:**
- `sellers`: Satıcılar array'i
- `productSlug`: Ürün slug'ı
- `currentSeller`: Mevcut satıcı

---

### 11. `RelatedPurchases` (`components/product/RelatedPurchases.tsx`)

**Açıklama:** İlgili ürünler (aynı kategoriden)

**Kullanılan Endpoint'ler:**

1. **Kategori Ürünleri**
   - `GET /api/v1/categories/{categorySlug}/products?per_page=50`
   - Açıklama: Belirli kategorideki ürünleri getirir
   - Kullanım: Aynı kategoriden ürünleri gösterir

2. **Tüm Ürünler** (Fallback)
   - `GET /api/v1/products?per_page=100`
   - Açıklama: Kategori slug yoksa tüm ürünlerden çeker
   - Kullanım: Kategori bilgisi yoksa

**Props:**
- `productId`: Ürün ID'si
- `categorySlug`: Kategori slug'ı
- `apiResponse`: API yanıtı (opsiyonel)

---

### 12. `ProductQuestions` (`components/product/ProductQuestions.tsx`)

**Açıklama:** Ürün sorularını gösterir

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `productId`: Ürün ID'si
- `questions`: Sorular array'i
- `totalQuestions`: Toplam soru sayısı
- `loading`: Yükleniyor mu?
- `sellerName`: Satıcı adı
- `onAskQuestion`: Soru sorma modal'ını açma callback

---

### 13. `CustomerReviews` (`components/product/CustomerReviews.tsx`)

**Açıklama:** Müşteri yorumlarını gösterir, yorum ekleme/düzenleme

**Kullanılan Endpoint'ler:**

1. **Ürün Yorumları**
   - `GET /api/v1/products/{productId}/reviews`
   - `GET /api/v1/products/{productSlug}/reviews`
   - Açıklama: Ürün yorumlarını getirir
   - Kullanım: Yorumları listeler

2. **Kullanıcı Yorumları (Boş)**
   - `GET /api/v1/customer/reviews?type=product&status=empty`
   - Açıklama: Kullanıcının yazmadığı yorumları getirir
   - Kullanım: "Yorum Yap" butonunu göstermek için
   - Auth: ✅ Bearer token gerekli

3. **Kullanıcı Yorumları (Onaylı)**
   - `GET /api/v1/customer/reviews?type=product&status=approved`
   - Açıklama: Kullanıcının onaylanmış yorumlarını getirir
   - Kullanım: Kullanıcının yorumunu göstermek için
   - Auth: ✅ Bearer token gerekli

4. **Yorum Ekleme/Düzenleme**
   - `POST /api/v1/customer/reviews/`
   - Açıklama: Yeni yorum ekler veya mevcut yorumu düzenler
   - Kullanım: Yorum formu submit edildiğinde
   - Auth: ✅ Bearer token gerekli

**Props:**
- `productId`: Ürün ID'si
- `productSlug`: Ürün slug'ı
- `initialReviews`: İlk yorumlar (server-side'dan)

---

### 14. `AskQuestionModal` (`components/product/AskQuestionModal.tsx`)

**Açıklama:** Soru sorma modal'ı

**Kullanılan Endpoint'ler:**

1. **Soru Gönderme**
   - `POST /api/v1/customer/questions/user-product-question/`
   - Açıklama: Ürün hakkında soru gönderir
   - Kullanım: Soru formu submit edildiğinde
   - Auth: ✅ Bearer token gerekli

**Props:**
- `isOpen`: Modal açık mı?
- `onClose`: Modal kapatma callback
- `productId`: Ürün ID'si
- `productName`: Ürün adı
- `sellerName`: Satıcı adı
- `onQuestionSubmitted`: Soru gönderildikten sonra callback

---

### 15. `SimilarProducts` (`components/product/SimilarProducts.tsx`)

**Açıklama:** Benzer ürünler (aynı kategoriden)

**Kullanılan Endpoint'ler:**

1. **Ürün Detayı (ID almak için)**
   - `GET /api/v1/products/{productSlug}`
   - Açıklama: Ürün slug'ından ID almak için
   - Kullanım: Ürün ID'sini bulmak için

2. **Kategori Ürünleri**
   - `GET /api/v1/categories/{categoryId}/products?limit=20&page=1`
   - Açıklama: Belirli kategorideki ürünleri getirir
   - Kullanım: Aynı kategoriden 10 random ürün gösterir

**Props:**
- `products`: Ürünler array'i (opsiyonel, prop'tan gelirse kullanılır)
- `loading`: Yükleniyor mu?
- `currentProductId`: Mevcut ürün ID'si (filtreleme için)
- `currentCategoryId`: Mevcut kategori ID'si

---

### 16. `ComplementaryProducts` (`components/product/ComplementaryProducts.tsx`)

**Açıklama:** Tamamlayıcı ürünler (aynı kategoriden)

**Kullanılan Endpoint'ler:**

1. **Ürün Detayı (ID almak için)**
   - `GET /api/v1/products/{productSlug}`
   - Açıklama: Ürün slug'ından ID almak için
   - Kullanım: Ürün ID'sini bulmak için

2. **Kategori Ürünleri**
   - `GET /api/v1/categories/{categoryId}/products?limit=20&page=1`
   - Açıklama: Belirli kategorideki ürünleri getirir
   - Kullanım: Aynı kategoriden 10 random ürün gösterir

**Props:**
- `products`: Ürünler array'i (opsiyonel, prop'tan gelirse kullanılır)
- `loading`: Yükleniyor mu?
- `isAdultCategory`: Yetişkin kategorisi mi?
- `isAdultVerified`: Yaş doğrulaması yapıldı mı?
- `currentProductId`: Mevcut ürün ID'si (filtreleme için)
- `currentCategoryId`: Mevcut kategori ID'si

---

### 17. `CampaignBanner` (`components/product/CampaignBanner.tsx`)

**Açıklama:** Kampanya banner'ı

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `campaign`: Kampanya objesi

---

### 18. `CampaignPriceBadge` (`components/product/CampaignPriceBadge.tsx`)

**Açıklama:** Kampanya fiyat rozeti

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `productId`: Ürün ID'si
- `categoryId`: Kategori ID'si

---

### 19. `Breadcrumb` (`components/common/Breadcrumb.tsx`)

**Açıklama:** Breadcrumb navigasyonu

**Kullanılan Endpoint'ler:**
- ❌ **Endpoint yok** - Veri parent component'ten prop olarak gelir

**Props:**
- `items`: Breadcrumb item'ları array'i

---

### 20. `QuickViewModal` (`components/product/QuickViewModal.tsx`)

**Açıklama:** Hızlı görüntüleme modal'ı

**Kullanılan Endpoint'ler:**

1. **Ürün Detayı**
   - `GET /api/v1/products/{productId}`
   - `GET /api/v1/products/{productSlug}`
   - Açıklama: Ürün detaylarını getirir
   - Kullanım: Modal açıldığında ürün bilgilerini yükler

**Props:**
- `isOpen`: Modal açık mı?
- `onClose`: Modal kapatma callback
- `productId`: Ürün ID'si
- `productSlug`: Ürün slug'ı

---

## Hooks ve Context'ler

### `useCampaign` (`app/hooks/useCampaign.ts`)

**Açıklama:** Kampanya bilgilerini yönetir

**Kullanılan Endpoint'ler:**

1. **Aktif Kampanyalar**
   - `GET /api/v1/campaigns?is_active=true`
   - Açıklama: Aktif kampanyaları getirir
   - Kullanım: Ürünün hangi kampanyada olduğunu bulmak için

2. **Kampanya Ürünleri**
   - `GET /api/v1/campaigns/{campaignSlug}/products`
   - Açıklama: Belirli bir kampanyadaki ürünleri getirir
   - Kullanım: Ürünün kampanyada olup olmadığını kontrol eder

**Kullanım:**
```typescript
const { campaign, isProductInCampaign, getCampaignQuantity } = useCampaign(productId, categoryId);
```

---

### `BasketContext` (`app/context/BasketContext.tsx`)

**Açıklama:** Sepet işlemlerini yönetir

**Kullanılan Endpoint'ler:**
- Context içinde API çağrıları yapılır (detaylar context dosyasında)

---

### `FavoriteContext` (`app/context/FavoriteContext.tsx`)

**Açıklama:** Favori işlemlerini yönetir

**Kullanılan Endpoint'ler:**
- Context içinde API çağrıları yapılır (detaylar context dosyasında)

---

## Server-Side Data Fetching (`app/urunler/[slug]/page.tsx`)

Server component'te aşağıdaki endpoint'ler çağrılır:

1. **Ürün Detayı**
   - `GET /api/v1/products/{slug}`
   - Fallback: `GET /api/v1/products/{cleanSlug}` (slug temizlenmiş hali)

2. **Ürün Yorumları**
   - `GET /api/v1/products/{productId}/reviews?page=1&limit=10`

3. **Ürün Soruları**
   - `GET /api/v1/products/{productId}/questions?page=1&limit=10`

4. **İlgili Ürünler**
   - `GET /api/v1/products/{productId}/related`
   - Not: 404 dönerse sessizce handle edilir

5. **Diğer Satıcılar**
   - `GET /api/v1/products/{productId}/other-sellers`
   - Not: 404 dönerse sessizce handle edilir

---

## Özet Tablo

| Component | Endpoint Sayısı | Auth Gerekli? | Açıklama |
|-----------|----------------|--------------|----------|
| ProductPageClient | 6 | ❌ | Ana component, tüm verileri yönetir |
| ProductImages | 0 | ❌ | Sadece görsel gösterimi |
| ProductHeader | 0 | ❌ | Ürün başlığı ve fiyat |
| ProductSidebar | 4 | ✅ | Satıcı bilgileri, takip işlemleri |
| ProductVariants | 0 | ❌ | Varyant seçimi |
| ProductActions | 0 | ❌ | Sepete ekleme (Context kullanır) |
| ProductInfo | 0 | ❌ | Ürün açıklaması |
| ProductHighlights | 0 | ❌ | Öne çıkan özellikler |
| ProductDeliveryWidget | 0 | ❌ | Teslimat bilgileri |
| ProductShipping | 1 | ❌ | Kargo bilgileri |
| OtherSellers | 1 | ❌ | Diğer satıcılar |
| RelatedPurchases | 2 | ❌ | İlgili ürünler |
| ProductQuestions | 0 | ❌ | Sorular listesi |
| CustomerReviews | 4 | ✅ | Yorumlar ve yorum ekleme |
| AskQuestionModal | 1 | ✅ | Soru gönderme |
| SimilarProducts | 2 | ❌ | Benzer ürünler |
| ComplementaryProducts | 2 | ❌ | Tamamlayıcı ürünler |
| CampaignBanner | 0 | ❌ | Kampanya banner |
| CampaignPriceBadge | 0 | ❌ | Kampanya rozeti |
| Breadcrumb | 0 | ❌ | Navigasyon |
| QuickViewModal | 1 | ❌ | Hızlı görüntüleme |
| useCampaign | 2 | ❌ | Kampanya hook'u |

**Toplam Endpoint Sayısı:** 26 endpoint

**Auth Gerektiren Endpoint Sayısı:** 7 endpoint

---

## Notlar

1. **Server-Side Rendering:** İlk yüklemede `page.tsx` içinde veriler server-side'da çekilir, sonra client-side'da güncellenir.

2. **Error Handling:** Bazı endpoint'ler (related, other-sellers) 404 dönerse sessizce handle edilir.

3. **Caching:** React Query veya benzeri bir caching mekanizması kullanılmıyor, her istek direkt API'ye gidiyor.

4. **Authentication:** Auth gerektiren endpoint'ler için `localStorage.getItem('token')` ile token alınır ve `Authorization: Bearer {token}` header'ı eklenir.

