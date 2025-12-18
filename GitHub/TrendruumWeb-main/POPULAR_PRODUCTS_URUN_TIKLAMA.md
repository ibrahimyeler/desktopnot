# Popular Products - Ürün Tıklama İşlemleri

> Bu dokümantasyon, Popular Products component'inde ürün üzerine tıklandığında gerçekleşen tüm işlemleri ve API isteklerini açıklar.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Tıklama İşlemi Akışı](#tıklama-işlemi-akışı)
3. [Kullanılan Endpoint'ler](#kullanılan-endpointler)
4. [Kod Detayları](#kod-detayları)
5. [İlgili Dosyalar](#ilgili-dosyalar)

---

## 🎯 Genel Bakış

**Component:** `components/Home/PopularProducts.tsx`

Popular Products component'inde bir ürün üzerine tıklandığında:
1. **URL Yönlendirmesi:** `/urunler/{slug}` adresine yönlendirme yapılır
2. **Scroll Pozisyonu Kaydı:** Mevcut scroll pozisyonu sessionStorage'a kaydedilir
3. **Ürün Detay Sayfası:** Server-side ürün verisi çekilir
4. **Ziyaret Kaydı:** Ürün ziyaret edilenler listesine eklenir

---

## 🔄 Tıklama İşlemi Akışı

### 1. Ürün Kartına Tıklama

```tsx
// components/Home/PopularProducts.tsx (satır 293-299)
<Link 
  href={createProductUrl(product.slug)} 
  prefetch={false} 
  className="flex-1 flex flex-col"
  onClick={(e) => handleProductClick(e, product.slug, product.id)}
  target={isDesktopViewport ? '_blank' : undefined}
  rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
>
```

**`createProductUrl(product.slug)` Fonksiyonu:**
```typescript
// utils/productUrl.ts
export function createProductUrl(slug: string): string {
  return `/urunler/${slug}`;
}
```

**Sonuç:** `/urunler/{product-slug}` URL'ine yönlendirme yapılır.

---

### 2. handleProductClick Fonksiyonu

```tsx
// components/Home/PopularProducts.tsx (satır 448-465)
const handleProductClick = (e: React.MouseEvent, productSlug: string, productId: string) => {
  // Scroll pozisyonunu ve ürün ID'sini sessionStorage'a kaydet
  // URL'den sayfa tipini belirle
  if (typeof window !== 'undefined') {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const currentPath = window.location.pathname;
    const baseSlug = getBaseSlug(productSlug);
    
    // S sayfası kontrolü
    if (currentPath.startsWith('/s/')) {
      sessionStorage.setItem('sPageScrollPosition', scrollPosition.toString());
      sessionStorage.setItem('sPageProductId', productId);
      sessionStorage.setItem('sPageProductSlug', productSlug);
      sessionStorage.setItem('sPageProductBaseSlug', baseSlug);
    }
  }
};
```

**Yapılan İşlemler:**
- Mevcut scroll pozisyonu kaydedilir
- Ürün ID'si ve slug bilgileri sessionStorage'a kaydedilir
- Eğer `/s/` ile başlayan bir sayfadaysa (dinamik içerik sayfası), scroll pozisyonu geri dönüş için saklanır

**SessionStorage Key'leri:**
- `sPageScrollPosition`: Scroll pozisyonu
- `sPageProductId`: Ürün ID'si
- `sPageProductSlug`: Ürün slug'ı
- `sPageProductBaseSlug`: Base slug (variant olmadan)

---

### 3. Ürün Detay Sayfasına Yönlendirme

**Route:** `/urunler/[slug]`

**Dosya:** `app/urunler/[slug]/page.tsx`

#### Server-Side Data Fetching

Ürün detay sayfası açıldığında, **server-side** olarak ürün verisi çekilir:

```typescript
// app/urunler/[slug]/page.tsx
export default async function ProductPage({ params }: { params: { slug: string } }) {
  // Cookie'den token al
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  // Ürün verisini çek
  const productResponse = await axios.get(
    `${API_V1_URL}/products/${params.slug}`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
  );

  // İncelemeler, sorular, ilgili ürünler vb. çekilir
  // ...
}
```

---

## 🔌 Kullanılan Endpoint'ler

### 1. Ürün Detayını Getir

**Endpoint:** `GET /api/v1/products/{slug}`

**Kullanım:** Server-side rendering (SSR)

**Headers:**
```
Accept: application/json
Content-Type: application/json
Authorization: Bearer {token} (opsiyonel - giriş yapmış kullanıcılar için)
```

**Request URL:**
```
https://api.trendruum.com/api/v1/products/{product-slug}
```

**Örnek:**
```
GET https://api.trendruum.com/api/v1/products/kahverengi-deri-ceket
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün başarıyla getirildi",
    "code": 200
  },
  "data": {
    "id": "string",
    "name": "Ürün Adı",
    "slug": "urun-adi",
    "price": 1231.50,
    "original_price": 1500.00,
    "campaign_price": null,
    "discount_percentage": 18,
    "stock": 10,
    "status": "active",
    "description": "Ürün açıklaması",
    "medias": [...],
    "images": [...],
    "brand": {...},
    "seller": {...},
    "category": {...},
    "variants": [...],
    "attributes": [...],
    "badges": {...},
    "rating": 4.5,
    "review_count": 25,
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  }
}
```

**Kullanıldığı Yer:**
- `app/urunler/[slug]/page.tsx` - Server-side component
- Ürün detay sayfası ilk yüklendiğinde

---

### 2. Ziyaret Edilen Ürünlere Ekleme

**Endpoint:** Yok (Client-side localStorage işlemi)

**Kullanım:** Client-side (ProductPageClient)

Ürün detay sayfası yüklendikten sonra, ürün otomatik olarak "Ziyaret Edilen Ürünler" listesine eklenir:

```typescript
// app/urunler/[slug]/ProductPageClient.tsx (satır 749-777)
const visitedProductData = {
  id: initialProductData.id,
  name: initialProductData.name,
  slug: initialProductData.slug,
  price: initialProductData.price || 0,
  originalPrice: initialProductData.original_price,
  campaignPrice: initialProductData.campaign_price,
  discountPercentage: initialProductData.discount_percentage,
  images: initialProductData.medias ? initialProductData.medias.map((media: any) => ({
    id: media.id?.$oid || media.id || '',
    name: media.name || '',
    url: media.url || ''
  })) : initialProductData.images || [],
  brand: {...},
  rating: initialProductData.rating,
  reviewCount: initialProductData.review_count
};

addVisitedProduct(visitedProductData);
```

**Context:** `app/context/VisitedProductsContext.tsx`

**Storage:** LocalStorage (kullanıcı bazlı)
- Key: `trendruum_visited_products_{userId}` (giriş yapmış kullanıcılar için)
- Key: `trendruum_visited_products_guest` (misafir kullanıcılar için)

**Özellikler:**
- Son 7 günlük ziyaretler tutulur
- Maksimum 15 ürün saklanır
- En yeni ziyaretler önce gösterilir

---

## 📝 Kod Detayları

### PopularProducts Component

**Dosya:** `components/Home/PopularProducts.tsx`

**Tıklama Event Handler:**
```tsx
// Satır 293-299
<Link 
  href={createProductUrl(product.slug)} 
  prefetch={false} 
  className="flex-1 flex flex-col"
  onClick={(e) => handleProductClick(e, product.slug, product.id)}
  target={isDesktopViewport ? '_blank' : undefined}
  rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
>
```

**handleProductClick Fonksiyonu:**
```tsx
// Satır 448-465
const handleProductClick = (e: React.MouseEvent, productSlug: string, productId: string) => {
  if (typeof window !== 'undefined') {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const currentPath = window.location.pathname;
    const baseSlug = getBaseSlug(productSlug);
    
    // S sayfası kontrolü
    if (currentPath.startsWith('/s/')) {
      sessionStorage.setItem('sPageScrollPosition', scrollPosition.toString());
      sessionStorage.setItem('sPageProductId', productId);
      sessionStorage.setItem('sPageProductSlug', productSlug);
      sessionStorage.setItem('sPageProductBaseSlug', baseSlug);
    }
  }
};
```

---

### Ürün URL Oluşturma

**Dosya:** `utils/productUrl.ts`

```typescript
/**
 * Ürün URL'sini oluşturur
 * @param slug Ürün slug'ı
 * @returns Ürün URL'si
 */
export function createProductUrl(slug: string): string {
  return `/urunler/${slug}`;
}
```

**Örnek:**
- Input: `"kahverengi-deri-ceket"`
- Output: `"/urunler/kahverengi-deri-ceket"`

---

### Ürün Detay Sayfası (Server-Side)

**Dosya:** `app/urunler/[slug]/page.tsx`

```typescript
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  try {
    // Ürün verisini çek
    const productResponse = await axios.get(
      `${API_V1_URL}/products/${params.slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      }
    );

    // Diğer verileri çek (reviews, questions, related products, vb.)
    // ...

    return (
      <ProductPageClient
        productSlug={params.slug}
        initialProductData={productResponse.data.data}
        // ... diğer props
      />
    );
  } catch (error) {
    // Hata yönetimi
  }
}
```

---

### Ziyaret Edilen Ürünlere Ekleme

**Dosya:** `app/urunler/[slug]/ProductPageClient.tsx`

```typescript
// Satır 749-777
useEffect(() => {
  // Ürün verisi yüklendikten sonra ziyaret edilenlere ekle
  const visitedProductData = {
    id: initialProductData.id,
    name: initialProductData.name,
    slug: initialProductData.slug,
    price: initialProductData.price || 0,
    originalPrice: initialProductData.original_price,
    campaignPrice: initialProductData.campaign_price,
    discountPercentage: initialProductData.discount_percentage,
    images: initialProductData.medias ? initialProductData.medias.map((media: any) => ({
      id: media.id?.$oid || media.id || '',
      name: media.name || '',
      url: media.url || ''
    })) : initialProductData.images || [],
    brand: (initialProductData.brandV2 || initialProductData.brand_v2) ? {
      id: (initialProductData.brandV2 || initialProductData.brand_v2).id,
      name: (initialProductData.brandV2 || initialProductData.brand_v2).name,
      slug: (initialProductData.brandV2 || initialProductData.brand_v2).slug
    } : undefined,
    rating: initialProductData.rating,
    reviewCount: initialProductData.review_count
  };
  
  addVisitedProduct(visitedProductData);
}, [initialProductData]);
```

---

## 📊 İşlem Akış Şeması

```
1. Kullanıcı Popular Products'ta ürün kartına tıklar
   ↓
2. handleProductClick fonksiyonu çalışır
   - Scroll pozisyonu sessionStorage'a kaydedilir
   - Ürün bilgileri sessionStorage'a kaydedilir
   ↓
3. Link component'i ile yönlendirme yapılır
   - URL: /urunler/{slug}
   ↓
4. Server-side component (page.tsx) çalışır
   - GET /api/v1/products/{slug} isteği atılır
   - Ürün verisi, incelemeler, sorular vb. çekilir
   ↓
5. Client-side component (ProductPageClient.tsx) render edilir
   - addVisitedProduct() çağrılır
   - Ürün localStorage'a kaydedilir
   ↓
6. Ürün detay sayfası gösterilir
```

---

## 🎨 Özellikler

### Desktop vs Mobile Davranışı

**Desktop (≥1024px):**
- Ürün yeni sekmede açılır (`target="_blank"`)
- `rel="noopener noreferrer"` eklendiği için güvenlik sağlanır

**Mobile (<1024px):**
- Ürün aynı sekmede açılır
- Normal navigation davranışı

### Prefetch

```tsx
prefetch={false}
```

**Not:** Ürün detay sayfaları için prefetch kapalıdır. Bu, gereksiz veri yüklemelerini önler.

---

## 🔒 Güvenlik Notları

1. **Token Kontrolü:** Ürün detayı çekilirken token varsa header'a eklenir, ancak zorunlu değildir
2. **XSS Koruması:** Next.js'in güvenli routing mekanizması kullanılır
3. **SessionStorage:** Hassas bilgiler sessionStorage'da saklanmaz, sadece scroll pozisyonu ve ürün ID'si tutulur

---

## 📚 İlgili Dosyalar

- `components/Home/PopularProducts.tsx` - Ana component
- `utils/productUrl.ts` - URL oluşturma utility
- `app/urunler/[slug]/page.tsx` - Ürün detay sayfası (server-side)
- `app/urunler/[slug]/ProductPageClient.tsx` - Ürün detay sayfası (client-side)
- `app/context/VisitedProductsContext.tsx` - Ziyaret edilen ürünler context

---

## 🔍 Özet

**Ürün tıklandığında:**

1. ✅ **Direkt API İsteği Yok** - Popular Products component'inde ürün tıklandığında direkt API isteği atılmaz
2. ✅ **URL Yönlendirmesi** - `/urunler/{slug}` URL'ine yönlendirme yapılır
3. ✅ **Scroll Pozisyonu Kaydı** - Mevcut scroll pozisyonu sessionStorage'a kaydedilir (geri dönüş için)
4. ✅ **Server-Side Data Fetching** - Ürün detay sayfasında `GET /api/v1/products/{slug}` endpoint'ine istek atılır
5. ✅ **Ziyaret Kaydı** - Ürün detay sayfası yüklendikten sonra ürün localStorage'a kaydedilir (ziyaret edilenler listesi için)

**Tek API İsteği:** `GET /api/v1/products/{slug}` (ürün detay sayfasında, server-side)

---

**Son Güncelleme:** 2025-01-20

