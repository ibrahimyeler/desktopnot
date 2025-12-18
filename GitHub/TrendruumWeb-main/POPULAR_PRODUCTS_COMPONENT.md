# Popular Products Component Dokümantasyonu

## Genel Bakış

`PopularProducts` component'i, ana sayfa ve diğer sayfalarda popüler ürünleri göstermek için kullanılan reusable bir component'tir. Ürünleri Swiper carousel veya Grid layout olarak gösterebilir.

## Dosya Konumu

- **Component**: `components/Home/PopularProducts.tsx`
- **Kullanıldığı Yerler**: 
  - `app/HomeClient.tsx` - Ana sayfa
  - `app/page.tsx` - Homepage server component

---

## Component Props

### `PopularProductsProps`

```typescript
interface PopularProductsProps {
  title: string;                    // Bölüm başlığı
  products: Product[];              // Gösterilecek ürün listesi
  backgroundColor?: string;         // Arka plan rengi (opsiyonel)
  apiResponse?: any;                // API response objesi (opsiyonel)
  uniqueId?: string;                // Unique ID (default: 'default')
  layout?: 'swiper' | 'grid';       // Layout tipi (default: 'swiper')
}
```

---

## Product Interface

```typescript
interface Product {
  id: string;
  name: string;
  medias: {
    url: string;
    type: string;
  }[];
  price: number;
  discounted_price: number | null;
  seller: {
    id: string;
    name: string;
  };
  brand: {
    ty_id?: string;
    name: string;
    status?: string;
    slug: string;
    url?: string;
    id?: string;
  };
  slug: string;
  stock?: number;
  status?: string;
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  review_count?: number;
  stockProgress?: number;
  category?: any;
  variants?: any[];
  attributes?: any[];
}
```

---

## API Endpoint'leri

### 1. Homepage Sections Endpoint

**Endpoint**: `GET /api/v1/pages/homepage`

**URL**: `https://api.trendruum.com/api/v1/pages/homepage?page=1&per_page=10`

**Request Headers**:
```json
{
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Request Parameters**:
- `page` (number): Sayfa numarası (default: 1)
- `per_page` (number): Sayfa başına section sayısı (default: 10)

**Response Structure**:
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "sections": [
      {
        "id": "string",
        "slug": "product-list",
        "fields": [
          {
            "slug": "product-list-title",
            "items": [
              {
                "slug": "title",
                "value": "Popüler Ürünler"
              }
            ]
          },
          {
            "slug": "selected-products",
            "items": [
              {
                "slug": "products",
                "value": [
                  {
                    "id": "string",
                    "name": "string",
                    "slug": "string",
                    "price": 0,
                    "discounted_price": 0,
                    "stock": 0,
                    "status": "active",
                    "medias": [
                      {
                        "url": "string",
                        "type": "string"
                      }
                    ],
                    "brand": {
                      "name": "string",
                      "slug": "string"
                    },
                    "seller": {
                      "id": "string",
                      "name": "string"
                    },
                    "average_rating": 0,
                    "review_count": 0
                  }
                ]
              }
            ]
          },
          {
            "slug": "background-color",
            "items": [
              {
                "slug": "bg-color",
                "value": "#f5f5e6"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

**Timeout**: 
- İlk deneme: 15 saniye
- İkinci deneme: 20 saniye
- Üçüncü deneme: 25 saniye

**Retry Logic**: 
- Timeout (ECONNABORTED) veya 502 hatası durumunda otomatik retry
- Maksimum 2 retry denemesi

---

### 2. Favori İşlemleri Endpoint'leri

#### 2.1. Favorilere Ekleme

**Endpoint**: `POST /api/v1/favorites`

**Request Body**:
```json
{
  "product_id": "string"
}
```

**Auth**: Gerekli (Bearer Token)

**Response**:
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "message": "Ürün favorilere eklendi"
  }
}
```

#### 2.2. Favorilerden Kaldırma

**Endpoint**: `DELETE /api/v1/favorites/{product_id}`

**Auth**: Gerekli (Bearer Token)

**Response**:
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "message": "Ürün favorilerden kaldırıldı"
  }
}
```

---

### 3. Sepet İşlemleri Endpoint'leri

#### 3.1. Sepete Ekleme (Authenticated)

**Endpoint**: `POST /api/v1/basket`

**Request Body**:
```json
{
  "product_id": "string",
  "quantity": 1
}
```

**Auth**: Gerekli (Bearer Token)

**Response**:
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
    "message": "Ürün sepete eklendi"
  }
}
```

#### 3.2. Guest Sepete Ekleme

**Endpoint**: LocalStorage kullanılarak client-side yönetiliyor

**Storage Key**: `guest_basket`

**Data Structure**:
```json
{
  "items": [
    {
      "product_id": "string",
      "quantity": 1,
      "added_at": "timestamp"
    }
  ]
}
```

---

## Kullanılan Component'ler ve Context'ler

### Context'ler

1. **FavoriteContext** (`@/app/context/FavoriteContext`)
   - `isInFavorites(productId: string)`: Ürünün favorilerde olup olmadığını kontrol eder
   - `addToFavorites(productId: string)`: Ürünü favorilere ekler
   - `removeFavorite(productId: string)`: Ürünü favorilerden kaldırır

2. **AuthContext** (`@/app/context/AuthContext`)
   - `isLoggedIn`: Kullanıcının giriş yapıp yapmadığını kontrol eder

3. **BasketContext** (`@/app/context/BasketContext`)
   - `addToBasket(productId: string, quantity: number)`: Authenticated kullanıcı için sepete ekler
   - `addToGuestBasket(productId: string, quantity: number)`: Guest kullanıcı için sepete ekler
   - `isGuestBasket`: Guest basket kontrolü

### External Libraries

1. **Swiper.js** (`swiper/react`)
   - Carousel/slider implementasyonu için
   - `Swiper`, `SwiperSlide` component'leri kullanılıyor
   - Navigation ve pagination modülleri import edilmiş ama navigation butonları custom olarak implement edilmiş

2. **Heroicons** (`@heroicons/react`)
   - `HeartIcon`: Favori eklenmemiş durum
   - `HeartSolidIcon`: Favori eklenmiş durum
   - `StarIcon`: Rating gösterimi

3. **react-hot-toast**
   - Toast notification'ları için kullanılıyor

4. **Next.js**
   - `Image`: Optimized image component
   - `Link`: Client-side navigation
   - `useRouter`: Navigation için

---

## Tasarım Detayları

### Layout Seçenekleri

#### 1. Swiper Layout (Default)

- **Mobil (< 480px)**: 2 slide görünür, aralarında 4px boşluk
- **Küçük Tablet (480px - 640px)**: 2 slide görünür, aralarında 6px boşluk
- **Tablet (640px - 768px)**: 2 slide görünür, aralarında 8px boşluk
- **Desktop (768px - 1024px)**: 2 slide görünür, aralarında 8px boşluk
- **Large Desktop (1024px - 1280px)**: 6 slide görünür, aralarında 8px boşluk
- **XL Desktop (1280px - 1536px)**: 6 slide görünür, aralarında 10px boşluk
- **2XL Desktop (1536px+)**: 6 slide görünür, aralarında 12px boşluk

**Navigation Butonları**:
- Sadece desktop'ta görünür (md:flex)
- Sol buton: Sadece başlangıçta değilse görünür
- Sağ buton: Sadece sonda değilse görünür
- Hover efekti: Beyaz arka plan -> Turuncu arka plan, siyah ikon -> beyaz ikon

#### 2. Grid Layout

- **Mobil**: 2 sütun (`grid-cols-2`)
- **Desktop**: 6 sütun (`lg:grid-cols-6`)
- Gap: Mobilde 1.5-2px, desktop'ta 2px

---

### Ürün Kartı Tasarımı

#### Genel Yapı

```
┌─────────────────────────────────┐
│  [Favori İkonu]                 │
│  ┌─────────────────────────┐   │
│  │                         │   │
│  │    Ürün Resmi           │   │
│  │    (2:3 aspect ratio)   │   │
│  │                         │   │
│  └─────────────────────────┘   │
│  Ürün Adı (2 satır, clamp)     │
│  Marka Adı (1 satır, truncate) │
│  ⭐⭐⭐⭐⭐ (5)           │
│  Fiyat: 1.550,00 TL            │
│  [Sepete Ekle Butonu]          │
└─────────────────────────────────┘
```

#### Detaylı Özellikler

1. **Container**:
   - `bg-white`: Beyaz arka plan
   - `rounded-lg`: Köşe yuvarlaklığı
   - `border border-gray-300`: Gri border
   - `hover:shadow-lg`: Hover'da shadow efekti
   - `transition-all duration-200`: Smooth transition

2. **Favori İkonu**:
   - Position: Absolute, sağ üst köşe (top: 8px, right: 8px)
   - Size: 32x32px minimum
   - Z-index: 20
   - Background: Beyaz, yuvarlak
   - Shadow: Medium shadow
   - Hover: Turuncu veya kırmızı arka plan
   - Loading state: Opacity 50%, cursor wait

3. **Ürün Resmi**:
   - Aspect ratio: 2:3 (dikey)
   - Padding: Mobilde 8px (p-2), tablette 12px (p-3), desktop'ta 16px (p-4)
   - Object fit: Contain (resim orantılı kalır)
   - Out of stock: Grayscale filter
   - Overlay: Stokta yok ürünlerde siyah overlay + kırmızı badge

4. **Ürün Bilgileri**:
   - Padding: 16px (p-4)
   - Bottom padding: 8px (pb-2)
   - Flex layout: Column, flex-1

5. **Ürün Adı**:
   - Font size: 14px (text-sm)
   - Font weight: Medium (font-medium)
   - Line clamp: 2 satır maksimum
   - Height: 40px (h-10) sabit
   - Margin bottom: 8px

6. **Marka Adı**:
   - Font size: 12px (text-xs)
   - Color: Gray-600
   - Truncate: Uzunsa kes
   - Height: 16px (h-4) sabit
   - Margin bottom: 4px

7. **Rating**:
   - Yıldız boyutu: 12px (w-3 h-3)
   - Full star: Yellow-400, filled
   - Half star: Gradient ile yarım dolu gösterimi
   - Empty star: Gray-300
   - Review count: Gray-500, parantez içinde

8. **Fiyat**:
   - Font size: 14px (text-sm)
   - Font weight: Semibold
   - Color: Black
   - Discounted price: Eski fiyat üstü çizili, gray-600
   - Out of stock: Üstü çizili, gray-500 + "Stokta Yok" yazısı
   - Height: 24px (h-6) sabit

9. **Sepete Ekle Butonu**:
   - Width: Full width
   - Padding: 8-12px vertical, 12-16px horizontal
   - Border radius: XL (rounded-xl)
   - Gradient: Orange-500'den Orange-600'ye
   - Border: 2px, orange-500
   - Shadow: Orange shadow with blur
   - Hover: Scale 105%, shadow artışı
   - Loading state: Opacity 50%, cursor wait
   - Out of stock: Gri, disabled

---

### Arka Plan Tasarımı

#### Gradient Background

- **Varsayılan**: `linear-gradient(to bottom, #f5f5e6, #ffffff)`
- **Özel Renk**: API'den veya prop'tan gelen renk
- **Format**: Hex renk kodu (# veya # olmadan)

#### Container

- Max width: 1600px
- Horizontal padding: 
  - Mobil: 8px (px-2)
  - Küçük tablet: 12px (px-3)
  - Desktop: 16px (px-4)
  - XL: 24px (xl:px-6)
  - 2XL: 32px (2xl:px-8)
- Background: Gradient
- Border radius: XL (rounded-xl)
- Padding: 12px (p-3)

---

## State Yönetimi

### Local State

1. **`loadingFavorites`** (Set<string>)
   - Yüklenmekte olan favori işlemlerinin product ID'lerini tutar
   - Multiple favori işlemlerini paralel yönetmek için

2. **`loadingBasket`** (Set<string>)
   - Yüklenmekte olan sepet işlemlerinin product ID'lerini tutar
   - Multiple sepet işlemlerini paralel yönetmek için

3. **`isBeginning`** (boolean)
   - Swiper'ın başlangıçta olup olmadığını kontrol eder
   - Sol navigation butonunun görünürlüğü için

4. **`isEnd`** (boolean)
   - Swiper'ın sonda olup olmadığını kontrol eder
   - Sağ navigation butonunun görünürlüğü için

5. **`swiperRef`** (Ref)
   - Swiper instance'ına erişim için
   - Programmatic navigation için kullanılıyor

---

## Fonksiyonlar

### `renderStars(rating: number)`

Yıldız rating gösterimi oluşturur.

**Parametreler**:
- `rating`: 0-5 arası rating değeri

**Mantık**:
- Rating 0 veya geçersizse: 5 boş yıldız
- Rating > 0 ise:
  - Full stars: `Math.floor(rating)` kadar dolu yıldız
  - Half star: Rating'in ondalık kısmı >= 0.5 ise yarım yıldız
  - Empty stars: Kalan yıldızlar boş

**Görsel**:
- Full star: Yellow-400, filled
- Half star: SVG gradient ile yarım dolu
- Empty star: Gray-300

---

### `renderProductCard(product: Product)`

Tek bir ürün kartını render eder.

**İşlevler**:
1. Stok durumu kontrolü
2. Rating hesaplama (average_rating > rating > 0)
3. Review count hesaplama (review_count > reviewCount > 0)
4. Fiyat formatlaması (TL formatında)
5. Discount gösterimi
6. Out of stock durumu yönetimi
7. Favori ve sepet butonları

**Return**: JSX Element

---

### `handleFavoriteClick(productId: string, e: React.MouseEvent)`

Favori ekleme/kaldırma işlemini yönetir.

**Akış**:
1. Event propagation'ı durdur
2. Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
3. Loading state'i aktif et
4. Favori durumuna göre ekle/kaldır
5. Toast notification göster
6. Loading state'i kaldır

**Hata Yönetimi**:
- Hata durumunda toast error mesajı
- Loading state her durumda temizlenir

---

### `handleAddToBasket(productId: string, e: React.MouseEvent, isOutOfStock: boolean)`

Sepete ekleme işlemini yönetir.

**Akış**:
1. Event propagation'ı durdur
2. Stokta yoksa işlemi engelle
3. Loading state'i aktif et
4. Kullanıcı durumuna göre:
   - Authenticated: `addToBasket` çağır
   - Guest: `addToGuestBasket` çağır
5. Loading state'i kaldır

**Hata Yönetimi**:
- Hata mesajları BasketContext'te yönetiliyor
- Bu fonksiyonda ekstra hata mesajı gösterilmiyor

---

## Responsive Tasarım

### Breakpoints

- **Mobile**: < 480px
- **Small Tablet**: 480px - 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: 1024px - 1280px
- **XL Desktop**: 1280px - 1536px
- **2XL Desktop**: 1536px+

### Responsive Özellikler

1. **Slide Sayısı**:
   - Mobil: 2 slide
   - Desktop: 6 slide

2. **Gap/Spacing**:
   - Mobil: 4-6px
   - Desktop: 8-12px

3. **Padding**:
   - Mobil: 8px
   - Desktop: 16px

4. **Font Sizes**:
   - Başlık: 16px (mobil) - 20px (desktop)
   - Ürün adı: 14px (her zaman)
   - Marka adı: 12px (her zaman)
   - Fiyat: 14px (her zaman)

5. **Navigation Butonları**:
   - Mobil: Gizli (hidden md:flex)
   - Desktop: Görünür

---

## Özel Özellikler

### 1. Unique ID Support

Her `PopularProducts` instance'ı unique bir ID alabilir. Bu sayede:
- CSS scoping için kullanılır
- Swiper wrapper ve swiper class'ları unique olur
- Multiple instance'lar aynı sayfada çakışmaz

### 2. Dynamic Background Color

Arka plan rengi 3 kaynaktan alınabilir (öncelik sırasına göre):
1. `backgroundColor` prop'u
2. `apiResponse.data.sections[].fields[].items[]` içinden
3. Varsayılan: `#f5f5e6`

### 3. Loading States

- Favori işlemleri: Her ürün için ayrı loading state
- Sepet işlemleri: Her ürün için ayrı loading state
- Paralel işlemler desteklenir

### 4. Out of Stock Management

- Stokta olmayan ürünler:
  - Opacity: 75%
  - Grayscale filter
  - Overlay + badge
  - Sepete ekle butonu disabled
  - Fiyat üstü çizili

### 5. Price Formatting

- Format: Turkish locale (`tr-TR`)
- Decimal places: 2
- Currency: TL
- Discounted price: Eski fiyat üstü çizili
- 0 TL ürünler: Sepete ekle butonu gizli

---

## Kullanım Örnekleri

### 1. Basic Usage

```tsx
import PopularProducts from '@/components/Home/PopularProducts';

<PopularProducts
  title="Popüler Ürünler"
  products={products}
/>
```

### 2. With Custom Background

```tsx
<PopularProducts
  title="Öne Çıkan Ürünler"
  products={products}
  backgroundColor="#ffebee"
/>
```

### 3. Grid Layout

```tsx
<PopularProducts
  title="Tüm Ürünler"
  products={products}
  layout="grid"
/>
```

### 4. With Unique ID

```tsx
<PopularProducts
  title="İndirimli Ürünler"
  products={products}
  uniqueId="discounted-products"
/>
```

### 5. With API Response

```tsx
<PopularProducts
  title="Yeni Ürünler"
  products={products}
  apiResponse={apiResponse}
/>
```

---

## Data Flow

```
API Endpoint (/api/v1/pages/homepage)
    ↓
Server Component (app/page.tsx)
    ↓
getHomePageData() - sections fetch
    ↓
HomeClient Component
    ↓
Section Renderer - "product-list" case
    ↓
PopularProducts Component
    ↓
renderProductCard() x N
    ↓
User Interactions (Favorite, Add to Basket)
    ↓
Context Actions (FavoriteContext, BasketContext)
    ↓
API Endpoints (/api/v1/favorites, /api/v1/basket)
```

---

## İyileştirme Önerileri

1. **Performance**:
   - Image lazy loading aktif
   - Link prefetch: false (performans için)
   - Debounced swiper state updates

2. **Accessibility**:
   - ARIA labels eklenebilir
   - Keyboard navigation için tabindex'ler

3. **Error Handling**:
   - API hatalarında fallback UI
   - Network error handling

4. **Testing**:
   - Unit tests için mock context'ler
   - Integration tests için API mocking

---

## İlgili Dosyalar

- `components/Home/PopularProducts.tsx` - Ana component
- `app/HomeClient.tsx` - Kullanım yeri
- `app/page.tsx` - Server-side data fetching
- `app/context/FavoriteContext.tsx` - Favori işlemleri
- `app/context/BasketContext.tsx` - Sepet işlemleri
- `app/context/AuthContext.tsx` - Auth durumu
- `utils/productUrl.ts` - Ürün URL oluşturma

---

## Changelog

### v1.0.0
- İlk versiyon
- Swiper ve Grid layout desteği
- Favori ve sepet işlemleri
- Responsive tasarım
- Dynamic background color
- Loading states
- Out of stock management

