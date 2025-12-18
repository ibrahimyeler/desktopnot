# Customer Sepet İşlemleri - Dokümantasyon

> Bu dokümantasyon sadece **customer** (giriş yapmış kullanıcı) sepet işlemlerini içermektedir. Guest kullanıcı işlemleri bu dokümantasyona dahil edilmemiştir.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Endpoint'ler](#endpointler)
3. [BasketContext Kullanımı](#basketcontext-kullanımı)
4. [Detaylı İşlemler](#detaylı-işlemler)
5. [Kullanım Örnekleri](#kullanım-örnekleri)

---

## 🎯 Genel Bakış

Customer sepet işlemleri `app/context/BasketContext.tsx` dosyasında yönetilmektedir. Tüm sepet işlemleri için **Bearer token** ile kimlik doğrulaması gereklidir.

**Ana Dosyalar:**
- `app/context/BasketContext.tsx` - Sepet context ve işlem fonksiyonları
- `app/services/basketService.ts` - Sepet servis sınıfı
- `app/sepet/page.tsx` - Sepet sayfası (server-side)
- `app/sepet/CartPageClient.tsx` - Sepet sayfası (client-side)

**Base URL:** `https://api.trendruum.com/api/v1`

---

## 🔌 Endpoint'ler

### 1. Sepeti Getir

**Endpoint:** `GET /customer/baskets`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Kullanım:**
- **Dosya:** `app/context/BasketContext.tsx`
- **Fonksiyon:** `refreshBasket()` (satır 505)
- **Kullanıldığı Yerler:**
  - Sepet sayfası (`app/sepet/page.tsx`)
  - Ödeme sayfası (`app/sepetim/odeme/page.tsx`)
  - BasketContext initialization

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "string",
    "code": 200
  },
  "data": {
    "id": "string",
    "user_id": "string",
    "status": "active",
    "total_price": 1231,
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z",
    "basket_groups": [
      {
        "id": "string",
        "basket_id": "string",
        "seller_id": "string",
        "total_price": 1231,
        "created_at": "2025-01-20T10:00:00.000Z",
        "updated_at": "2025-01-20T10:00:00.000Z",
        "seller": {
          "id": "string",
          "name": "Seller1 Firması"
        },
        "basket_group_items": [
          {
            "id": "string",
            "basket_id": "string",
            "basket_group_id": "string",
            "seller_id": "string",
            "product_id": "string",
            "quantity": 2,
            "price": 615.5,
            "total_price": 1231,
            "created_at": "2025-01-20T10:00:00.000Z",
            "updated_at": "2025-01-20T10:00:00.000Z",
            "variants": {},
            "product": {
              "id": "string",
              "name": "Ürün Adı",
              "slug": "urun-adi",
              "price": 615.5,
              "status": "active",
              "medias": [...],
              "images": [...],
              "created_at": "2025-01-20T10:00:00.000Z",
              "updated_at": "2025-01-20T10:00:00.000Z"
            }
          }
        ]
      }
    ]
  }
}
```

---

### 2. Sepete Ürün Ekle

**Endpoint:** `POST /customer/baskets/add`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": 2,
  "variants": {
    "variant_key": "variant_value"
  }
}
```

**Özellikler:**
- Variant bilgileri opsiyoneldir
- Stok kontrolü önceden yapılır (client-side)
- Sepete eklenen ürün geçmişe kaydedilir (localStorage)

**Kullanım:**
- **Dosya:** `app/context/BasketContext.tsx`
- **Fonksiyon:** `addToBasket(productId, quantity, variants?)` (satır 570)
- **Kullanıldığı Yerler:**
  - `components/product/details/ProductActions.tsx` - Ürün detay sayfasında sepete ekle butonu
  - `components/product/ProductDetails.tsx` - Ürün detay component'inde
  - `components/cart/CartTabs.tsx` - Sepet sayfasında önceden gezdiklerim sekmesinde
  - `components/Home/PopularProducts.tsx` - Popüler ürünler listesinde
  - `components/store/AllProductsSection.tsx` - Mağaza ürünleri listesinde

**İşlem Adımları:**
1. Ürün stok kontrolü yapılır (`checkProductStock`)
2. Stok yetersizse hata mesajı gösterilir
3. Token kontrolü yapılır (token yoksa guest basket'e yönlendirilir)
4. Variant bilgileri varsa request body'ye eklenir
5. API'ye POST isteği gönderilir
6. Başarılı olursa basket state güncellenir ve toast mesajı gösterilir
7. Ürün geçmişe kaydedilir (`saveToCartHistory`)

**Hata Yönetimi:**
- **401 Unauthorized:** Token geçersiz, kullanıcı login sayfasına yönlendirilir
- **404 Not Found:** Ürün bulunamadı mesajı gösterilir
- **400 Bad Request:** Validation hatası, "Ürün bilgileri geçersiz" mesajı gösterilir
- **500 Internal Server Error:** Sunucu hatası, "Ürün bilgileri geçersiz veya sunucu hatası" mesajı gösterilir
- **Stok Hatası:** API'den stok hatası gelirse "Ürün stokta bulunmamaktadır" mesajı gösterilir

**Response:** Aynı sepet yapısı (1. endpoint ile aynı)

---

### 3. Sepetteki Ürün Miktarını Güncelle

**Endpoint:** `POST /customer/baskets/update`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": 3
}
```

**Kullanım:**
- **Dosya:** `app/context/BasketContext.tsx`
- **Fonksiyon:** `updateBasketItem(productId, quantity)` (satır 739)
- **Kullanıldığı Yer:**
  - `components/cart/CartItemsList.tsx` - `handleQuantityChange` fonksiyonunda
  - Sepet sayfasında ürün miktarını artırma/azaltma butonları

**İşlem Adımları:**
1. Token kontrolü yapılır
2. API'ye POST isteği gönderilir
3. Başarılı olursa basket state güncellenir
4. Stok hatası varsa sepet yenilenir ve hata mesajı gösterilir

**Hata Yönetimi:**
- **404 Not Found:** Ürün bulunamadı, sepet yenilenir
- **Stok Hatası:** "Ürün stokta bulunmamaktadır" mesajı gösterilir, sepet yenilenir

**Response:** Güncellenmiş sepet yapısı

---

### 4. Sepetten Ürün Kaldır

**Endpoint:** `POST /customer/baskets/remove`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "product_id": "string",
  "quantity": 1
}
```

**Not:** `quantity` parametresi opsiyoneldir, varsayılan değer 1'dir.

**Kullanım:**
- **Dosya:** `app/context/BasketContext.tsx`
- **Fonksiyon:** `removeFromBasket(productId, quantity?)` (satır 823)
- **Kullanıldığı Yer:**
  - `components/cart/CartItemsList.tsx` - `handleDelete` fonksiyonunda
  - Sepet sayfasında ürün silme butonları

**İşlem Adımları:**
1. Token kontrolü yapılır
2. API'ye POST isteği gönderilir
3. Başarılı olursa basket state güncellenir
4. Sepet boş mu kontrol edilir
5. Sepet boşsa `basket` state'i `null` olarak ayarlanır
6. Toast mesajı gösterilir: "Ürün sepetten kaldırıldı"

**Response:** Güncellenmiş sepet yapısı (veya boş sepet)

---

### 5. Sepeti Temizle

**Endpoint:** `DELETE /customer/baskets/clear`

**Headers:**
```
Authorization: Bearer {token}
Accept: application/json
```

**Request Body:** Yok

**Kullanım:**
- **Dosya:** `app/context/BasketContext.tsx`
- **Fonksiyon:** `clearBasket()` (satır 868)
- **Kullanıldığı Yer:**
  - `components/cart/CartItemsList.tsx` - `handleClearBasket` fonksiyonunda
  - Sepet sayfasında sepeti temizle butonu

**İşlem Adımları:**
1. Token kontrolü yapılır
2. API'ye DELETE isteği gönderilir
3. Başarılı veya başarısız olsun, local state temizlenir
4. Toast mesajı gösterilir: "Sepet temizlendi"

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Sepet temizlendi",
    "code": 200
  },
  "data": null
}
```

---

### 6. İndirim Kodu Uygula

**Endpoint:** `POST /customer/baskets/apply-discount-coupon`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:**
```json
{
  "coupon_code": "INDIRIM2025"
}
```

**Kullanım:**
- **Dosya:** `app/sepet/CartPageClient.tsx`
- **Fonksiyon:** `applyDiscountCoupon(couponCode)` (satır 175)
- **Kullanıldığı Yer:**
  - `components/cart/CartSummary.tsx` - İndirim kodu input alanı

**Response:** Güncellenmiş sepet yapısı (indirim uygulanmış)

---

### 7. İndirim Kodunu Kaldır

**Endpoint:** `POST /customer/baskets/remove-discount-coupon`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Request Body:** Yok

**Kullanım:**
- **Dosya:** `app/sepet/CartPageClient.tsx`
- **Fonksiyon:** `removeDiscountCoupon()` (satır 220)
- **Kullanıldığı Yer:**
  - `components/cart/CartSummary.tsx` - İndirim kodu kaldır butonu

**Response:** Güncellenmiş sepet yapısı (indirim kaldırılmış)

---

## 🎨 BasketContext Kullanımı

### Context Provider

**Dosya:** `app/providers.tsx` veya `app/layout.tsx`

```tsx
import { BasketProvider } from '@/app/context/BasketContext';

export default function RootLayout({ children }) {
  return (
    <BasketProvider>
      {children}
    </BasketProvider>
  );
}
```

### Hook Kullanımı

```tsx
import { useBasket } from '@/app/context/BasketContext';

function MyComponent() {
  const {
    basket,
    loading,
    error,
    addToBasket,
    updateBasketItem,
    removeFromBasket,
    clearBasket,
    refreshBasket,
    totalPrice,
    shippingFee
  } = useBasket();

  // Sepete ürün ekle
  const handleAddToCart = async () => {
    await addToBasket('product-id', 2, { size: 'L', color: 'Red' });
  };

  // Ürün miktarını güncelle
  const handleUpdateQuantity = async () => {
    await updateBasketItem('product-id', 3);
  };

  // Ürünü sepetten kaldır
  const handleRemove = async () => {
    await removeFromBasket('product-id');
  };

  // Sepeti temizle
  const handleClear = async () => {
    await clearBasket();
  };

  return (
    <div>
      {loading && <p>Yükleniyor...</p>}
      {basket && (
        <div>
          <p>Toplam: {totalPrice} TL</p>
          <p>Kargo: {shippingFee} TL</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔄 Detaylı İşlemler

### Sepete Ürün Ekleme İşlemi Detayı

```tsx
// 1. Stok kontrolü
const productInfo = await checkProductStock(productId);
if (productInfo.stock <= 0) {
  toast.error('Ürün stokta bulunmamaktadır.');
  return;
}

// 2. Variant kontrolü ve request body oluşturma
const requestBody: any = { product_id: productId, quantity };
if (variants && Object.keys(variants).length > 0) {
  requestBody.variants = variants;
}

// 3. API çağrısı
const response = await axiosInstance.post('/customer/baskets/add', requestBody, {
  headers: { Authorization: `Bearer ${token}` }
});

// 4. Başarılı olursa state güncelleme
if (response.data.meta.status === 'success') {
  setBasket(response.data.data);
  toast.success('Ürün sepete eklendi');
  
  // 5. Geçmişe kaydetme
  saveToCartHistory(productId, response.data.data);
}
```

### Sepet Geçmişi Kaydetme

Sepete eklenen ürünler otomatik olarak localStorage'a kaydedilir:

```tsx
// localStorage key: 'cartHistory'
// Format:
[
  {
    "id": "timestamp",
    "product_id": "string",
    "product_name": "string",
    "price": 1231,
    "quantity": 2,
    "added_at": "2025-01-20T10:00:00.000Z",
    "product_image": "url",
    "product_slug": "urun-adi"
  }
]

// Son 14 günlük veriler tutulur
```

---

## 📝 Kullanım Örnekleri

### Örnek 1: Ürün Detay Sayfasında Sepete Ekle

```tsx
import { useBasket } from '@/app/context/BasketContext';

function ProductActions({ product, selectedVariants }) {
  const { addToBasket, loading } = useBasket();
  
  const handleAddToCart = async () => {
    await addToBasket(
      product.id,
      1,
      selectedVariants // { size: 'L', color: 'Red' }
    );
  };

  return (
    <button 
      onClick={handleAddToCart}
      disabled={loading}
    >
      Sepete Ekle
    </button>
  );
}
```

### Örnek 2: Sepet Sayfasında Miktar Güncelleme

```tsx
import { useBasket } from '@/app/context/BasketContext';

function CartItemsList({ items }) {
  const { updateBasketItem } = useBasket();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // Ürünü sepetten kaldır
      await removeFromBasket(productId);
    } else {
      // Miktarı güncelle
      await updateBasketItem(productId, newQuantity);
    }
  };

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.product.name}</span>
          <button onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}>
            -
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Örnek 3: Server-Side Sepet Verisi

```tsx
// app/sepet/page.tsx
import { cookies } from 'next/headers';
import axios from 'axios';

async function getBasketData() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(
      'https://api.trendruum.com/api/v1/customer/baskets',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.meta.status === 'success') {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

export default async function CartPage() {
  const basketData = await getBasketData();
  
  return <CartPageClient initialBasket={basketData} />;
}
```

---

## 🔒 Güvenlik Notları

1. **Token Kontrolü:** Tüm endpoint'ler için Bearer token zorunludur
2. **401 Hatası:** Token geçersizse kullanıcı otomatik olarak login sayfasına yönlendirilir
3. **Client-Side Validation:** Stok kontrolü önceden yapılır, ancak API'den gelen hata mesajlarına göre işlem yapılır
4. **Error Handling:** Tüm hata durumları kullanıcıya uygun mesajlarla bildirilir

---

## 📊 State Yönetimi

### Basket State Yapısı

```typescript
interface Basket {
  id: string;
  user_id: string;
  status: string;
  total_price: number;
  created_at: string;
  updated_at: string;
  basket_groups: BasketGroup[];
}

interface BasketGroup {
  id: string;
  basket_id: string;
  seller_id: string;
  total_price: number;
  seller: {
    id: string;
    name: string;
  };
  basket_group_items: BasketItem[];
}

interface BasketItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  total_price: number;
  variants: Record<string, string>;
  product: Product;
}
```

### State Güncellemeleri

- **addToBasket:** `setBasket(response.data.data)`
- **updateBasketItem:** `setBasket(response.data.data)`
- **removeFromBasket:** Sepet boşsa `setBasket(null)`, değilse `setBasket(response.data.data)`
- **clearBasket:** `setBasket(null)`

---

## 🚨 Hata Yönetimi

### Hata Türleri ve Mesajları

| Hata Kodu | Mesaj | Aksiyon |
|-----------|-------|---------|
| 401 | Oturum süreniz dolmuş | Login sayfasına yönlendir |
| 404 | Ürün bulunamadı | Hata mesajı göster |
| 400 | Ürün bilgileri geçersiz | Hata mesajı göster |
| 500 | Sunucu hatası | Hata mesajı göster |
| Stok Hatası | Ürün stokta bulunmamaktadır | Hata mesajı göster, sepeti yenile |

---

## 📚 İlgili Dosyalar

- `app/context/BasketContext.tsx` - Ana context dosyası
- `app/services/basketService.ts` - Servis sınıfı (alternatif kullanım)
- `app/sepet/page.tsx` - Sepet sayfası (server-side)
- `app/sepet/CartPageClient.tsx` - Sepet sayfası (client-side)
- `components/cart/CartItemsList.tsx` - Sepet ürünleri listesi
- `components/cart/CartSummary.tsx` - Sepet özeti ve indirim kodu

---

**Son Güncelleme:** 2025-01-20

