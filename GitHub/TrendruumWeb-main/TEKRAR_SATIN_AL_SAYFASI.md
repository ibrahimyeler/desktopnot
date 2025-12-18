# 🛒 Tekrar Satın Al Sayfası - Detaylı Dokümantasyon

Bu dokümantasyon, "Tekrar Satın Al" sayfasının nasıl göründüğünü, nasıl çalıştığını ve tüm teknik detaylarını açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı ve Görünüm](#sayfa-yapısı-ve-görünüm)
3. [Çalışma Mantığı](#çalışma-mantığı)
4. [API Entegrasyonu](#api-entegrasyonu)
5. [Ürün Filtreleme ve Stok Kontrolü](#ürün-filtreleme-ve-stok-kontrolü)
6. [Sepete Ekleme İşlemi](#sepete-ekleme-işlemi)
7. [State Yönetimi](#state-yönetimi)
8. [Akış Diyagramları](#akış-diyagramları)
9. [Özellikler ve Limitler](#özellikler-ve-limitler)

---

## 🔍 Genel Bakış

**Sayfa URL:** `/hesabim/tekrar-al`

**Açıklama:** Kullanıcıların daha önce satın aldıkları ürünleri tekrar satın alabilecekleri sayfa. Sadece stokta olan ve aktif durumdaki ürünler gösterilir.

**Önemli Not:** Bu sayfa **satın alınan ürünleri** gösterir. Kullanıcının sipariş geçmişinden alınan ürünler, stok kontrolü yapılarak listelenir.

**Dosya Yapısı:**
- Server Component: `app/hesabim/tekrar-al/page.tsx`
- Client Component: `app/hesabim/tekrar-al/RepurchasePageClient.tsx`
- Component: `components/account/Repurchase.tsx`
- Context: `app/context/BasketContext.tsx` (sepete ekleme için)

---

## 📄 Sayfa Yapısı ve Görünüm

### Desktop Görünümü

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Header component)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  ← 🛒 Tekrar Satın Al                │  │
│  │ Account      │  │                                      │  │
│  │ Sidebar      │  │  Daha önce satın aldığınız ürünler  │  │
│  │              │  │                                      │  │
│  │ - Hesabım    │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │  │
│  │ - Siparişler │  │  │    │ │    │ │    │ │    │       │  │
│  │ - Favoriler  │  │  │ Ü1 │ │ Ü2 │ │ Ü3 │ │ Ü4 │       │  │
│  │ - ...        │  │  │    │ │    │ │    │ │    │       │  │
│  │              │  │  └────┘ └────┘ └────┘ └────┘       │  │
│  │              │  │                                      │  │
│  │              │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │  │
│  │              │  │  │ Ü5 │ │ Ü6 │ │ Ü7 │ │ Ü8 │       │  │
│  │              │  │  └────┘ └────┘ └────┘ └────┘       │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Ürün Kartı Detayı

```
┌─────────────────────┐
│                     │
│   [Ürün Görseli]    │
│                     │
├─────────────────────┤
│ Ürün Adı            │
│ (2 satır, clamp)    │
│                     │
│ 1.234,56 TL         │
│                     │
│ 3 kez satın alındı  │
│                     │
│ [Sepete Ekle]       │
└─────────────────────┘
```

### Mobile Görünümü

```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ ← 🛒 Tekrar Satın Al ☰      │
├─────────────────────────────┤
│                             │
│ Daha önce satın aldığınız   │
│ ürünler                     │
│                             │
│ ┌─────┐ ┌─────┐            │
│ │ Ü1  │ │ Ü2  │            │
│ └─────┘ └─────┘            │
│                             │
│ ┌─────┐ ┌─────┐            │
│ │ Ü3  │ │ Ü4  │            │
│ └─────┘ └─────┘            │
│                             │
└─────────────────────────────┘
```

### Boş Durum (Ürün Yoksa)

```
┌─────────────────────────────┐
│                             │
│        ┌─────────┐          │
│        │   🛒    │          │
│        └─────────┘          │
│                             │
│   Henüz Ürün Satın          │
│   Almadınız                 │
│                             │
│ Satın aldığınız ürünler      │
│ burada listelenecek ve       │
│ tekrar satın alabileceksiniz│
│                             │
│   [Alışverişe Başla]        │
│                             │
└─────────────────────────────┘
```

---

## ⚙️ Çalışma Mantığı

### 1. Sayfa Yüklendiğinde

**Akış:**
```typescript
useEffect(() => {
  fetchOrders();
}, []);
```

**Adımlar:**
1. Token kontrolü (localStorage'dan)
2. Siparişleri API'den çek
3. Siparişlerden ürünleri topla
4. Her ürün için stok kontrolü yap
5. Sadece stokta olan ve aktif ürünleri göster

### 2. Siparişlerden Ürün Toplama

**Mantık:**
```typescript
// Satın alınan ürünleri topla
const products = new Map();

data.data?.forEach((order: Order) => {
  // order_groups içindeki order_group_items'ları kontrol et
  order.order_groups?.forEach((orderGroup: any) => {
    orderGroup.order_group_items?.forEach((item: OrderItem) => {
      const key = item.product_id;
      
      if (!products.has(key)) {
        // İlk kez görülen ürün
        products.set(key, {
          ...item.product,
          id: item.product.id || item.product_id,
          stock: item.product.stock ?? 0,
          status: item.product.status ?? 'active',
          quantity: item.quantity,
          price: item.price,
          lastOrderDate: order.created_at,
          orderCount: 1  // Kaç kez satın alındı
        });
      } else {
        // Daha önce görülen ürün (duplicate)
        const existing = products.get(key);
        existing.orderCount += 1;  // Sipariş sayısını artır
        existing.quantity += item.quantity;  // Toplam miktarı artır
      }
    });
  });
});
```

**Özellikler:**
- **Duplicate Önleme:** Aynı ürün birden fazla siparişte varsa birleştirilir
- **Sipariş Sayısı:** Her ürün için kaç kez satın alındığı takip edilir
- **Toplam Miktar:** Tüm siparişlerdeki toplam miktar hesaplanır
- **Son Sipariş Tarihi:** En son satın alınma tarihi saklanır

### 3. Stok Kontrolü

**Mantık:**
```typescript
// Her ürün için güncel stok durumunu kontrol et (paralel olarak)
const productChecks = productIds.map(async (productId) => {
  try {
    const product = products.get(productId);
    if (!product || !product.slug) return null;
    
    // Ürün detayını API'den çek (slug ile)
    const productResponse = await fetch(`${API_V1_URL}/products/${product.slug}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (productResponse.ok) {
      const productData = await productResponse.json();
      if (productData.meta?.status === 'success' && productData.data) {
        const currentStock = productData.data.stock ?? 0;
        const currentStatus = productData.data.status ?? 'active';
        
        // Sadece stokta olan ve aktif ürünleri ekle
        if (currentStock > 0 && currentStatus === 'active') {
          return {
            ...product,
            stock: currentStock,
            status: currentStatus,
            // Resim bilgilerini güncelle
            images: productData.data.images || ...,
            medias: productData.data.medias || ...
          };
        }
      }
    }
    return null;  // Stokta yok veya pasif
  } catch (error) {

    return null;
  }
});

// Tüm kontrolleri bekle ve sonuçları filtrele
const results = await Promise.all(productChecks);
const filtered = results.filter((product): product is any => product !== null);
```

**Kontrol Kriterleri:**
1. ✅ **Stok > 0:** Ürün stokta olmalı
2. ✅ **Status = 'active':** Ürün aktif durumda olmalı
3. ✅ **API Başarılı:** Ürün detayı başarıyla çekilmeli

**Filtreleme:**
- Stokta olmayan ürünler gösterilmez
- Pasif ürünler gösterilmez
- API hatası olan ürünler gösterilmez

### 4. Sepete Ekleme

**Mantık:**
```typescript
const handleAddToCart = async (productId: string) => {
  try {
    await addToBasket(productId, 1);  // Miktar: 1
    // Toast mesajı BasketContext'te yönetiliyor
  } catch (error) {
    // Hata mesajı da BasketContext'te yönetiliyor
  }
};
```

**BasketContext addToBasket Fonksiyonu:**
```typescript
const addToBasket = async (productId: string, quantity: number, variants?: { [key: string]: string }) => {
  // 1. Stok kontrolü
  const productInfo = await checkProductStock(productId);
  
  if (productInfo) {
    if (productInfo.stock <= 0) {
      toast.error(`${productInfo.name} ürünü stokta bulunmamaktadır.`);
      return;
    }
    
    if (productInfo.stock < quantity) {
      toast.error(`${productInfo.name} ürününden sadece ${productInfo.stock} adet stokta bulunmaktadır.`);
      return;
    }
  }
  
  // 2. Token kontrolü
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Guest basket işlemi
    await addToGuestBasket(productId, quantity, variants);
    return;
  }
  
  // 3. Sepete ekleme isteği
  const response = await axiosInstance.post<BasketResponse>(
    '/customer/baskets/add',
    { product_id: productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  // 4. Başarılı ise state güncelle
  if (response.data.meta.status === 'success') {
    setBasket(response.data.data as Basket);
    toast.success('Ürün sepete eklendi');
  }
};
```

---

## 🔌 API Entegrasyonu

### 1. Siparişleri Çekme

**Endpoint:** `GET /api/v1/customer/orders`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
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
  "data": [
    {
      "id": "order-123",
      "order_number": "TRD-2024-001",
      "status": "completed",
      "total_price": 1500.00,
      "created_at": "2024-01-01T12:00:00.000Z",
      "order_groups": [
        {
          "id": "group-1",
          "order_group_items": [
            {
              "id": "item-1",
              "product_id": "product-123",
              "quantity": 2,
              "price": 750.00,
              "product": {
                "id": "product-123",
                "name": "iPhone 15 Pro",
                "slug": "iphone-15-pro",
                "stock": 10,
                "status": "active",
                "images": [...],
                "medias": {...}
              }
            }
          ]
        }
      ]
    }
  ]
}
```

**Kod:**
```typescript
const response = await fetch('/api/v1/customer/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

if (response.ok) {
  const data = await response.json();
  if (data.meta?.status === 'success') {
    setOrders(data.data || []);
    // Ürünleri topla ve stok kontrolü yap
  }
}
```

### 2. Ürün Detayını Çekme (Stok Kontrolü)

**Endpoint:** `GET /api/v1/products/{slug}`

**Headers:**
```json
{
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
    "id": "product-123",
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "price": 750.00,
    "stock": 5,
    "status": "active",
    "images": [...],
    "medias": {...}
  }
}
```

**Kod:**
```typescript
const productResponse = await fetch(`${API_V1_URL}/products/${product.slug}`, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

if (productResponse.ok) {
  const productData = await productResponse.json();
  if (productData.meta?.status === 'success' && productData.data) {
    const currentStock = productData.data.stock ?? 0;
    const currentStatus = productData.data.status ?? 'active';
    
    // Sadece stokta olan ve aktif ürünleri ekle
    if (currentStock > 0 && currentStatus === 'active') {
      return { ...product, stock: currentStock, status: currentStatus };
    }
  }
}
```

### 3. Sepete Ekleme

**Endpoint:** `POST /api/v1/customer/baskets/add`

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "product_id": "product-123",
  "quantity": 1
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün sepetinize başarıyla eklendi.",
    "code": 201
  },
  "data": {
    "id": "basket-123",
    "user_id": "user-123",
    "status": "active",
    "total_price": 750.00,
    "basket_groups": [...]
  }
}
```

**Detaylar:** `SEPET_ENDPOINTLER.md` dosyasında açıklanmıştır.

---

## 🎯 Ürün Filtreleme ve Stok Kontrolü

### Filtreleme Kriterleri

**1. Stok Kontrolü:**
- `stock > 0` olmalı
- Stokta olmayan ürünler gösterilmez

**2. Durum Kontrolü:**
- `status === 'active'` olmalı
- Pasif ürünler gösterilmez

**3. API Başarı Kontrolü:**
- Ürün detayı başarıyla çekilmeli
- API hatası olan ürünler gösterilmez

### Paralel Stok Kontrolü

**Performans Optimizasyonu:**
```typescript
// Tüm ürünler için paralel olarak stok kontrolü
const productChecks = productIds.map(async (productId) => {
  // Her ürün için API isteği
});

// Tüm kontrolleri bekle
const results = await Promise.all(productChecks);

// Null olmayan sonuçları filtrele
const filtered = results.filter((product): product is any => product !== null);
```

**Avantajlar:**
- Tüm ürünler için aynı anda stok kontrolü
- Daha hızlı yükleme
- Promise.all ile paralel işlem

---

## 🛒 Sepete Ekleme İşlemi

### handleAddToCart Fonksiyonu

**Kod:**
```typescript
const handleAddToCart = async (productId: string) => {
  try {
    await addToBasket(productId, 1);  // Miktar: 1 (sabit)
    // Toast mesajı BasketContext'te yönetiliyor
  } catch (error) {
    // Hata mesajı da BasketContext'te yönetiliyor
  }
};
```

**Özellikler:**
- Miktar her zaman 1 olarak ayarlanır
- BasketContext'teki `addToBasket` fonksiyonu kullanılır
- Toast mesajları BasketContext'te yönetilir
- Hata yönetimi BasketContext'te yapılır

### BasketContext addToBasket İşlemi

**Adımlar:**
1. **Stok Kontrolü:**
   ```typescript
   const productInfo = await checkProductStock(productId);
   if (productInfo.stock <= 0) {
     toast.error('Ürün stokta bulunmamaktadır.');
     return;
   }
   ```

2. **Token Kontrolü:**
   ```typescript
   const token = localStorage.getItem('token');
   if (!token) {
     await addToGuestBasket(productId, quantity, variants);
     return;
   }
   ```

3. **API İsteği:**
   ```typescript
   const response = await axiosInstance.post<BasketResponse>(
     '/customer/baskets/add',
     { product_id: productId, quantity },
     { headers: { Authorization: `Bearer ${token}` } }
   );
   ```

4. **State Güncelleme:**
   ```typescript
   if (response.data.meta.status === 'success') {
     setBasket(response.data.data as Basket);
     toast.success('Ürün sepete eklendi');
   }
   ```

---

## 📊 State Yönetimi

### Component State'leri

```typescript
// Siparişler listesi
const [orders, setOrders] = useState<Order[]>([]);

// Loading durumu
const [loading, setLoading] = useState(true);

// Satın alınan ürünler (stok kontrolünden sonra)
const [purchasedProducts, setPurchasedProducts] = useState<any[]>([]);
```

### State Güncellemeleri

**1. Sayfa Yüklendiğinde:**
```typescript
useEffect(() => {
  fetchOrders();
}, []);
```

**2. Siparişler Çekildiğinde:**
```typescript
setOrders(data.data || []);
// Ürünleri topla ve stok kontrolü yap
setPurchasedProducts(filtered);
```

**3. Loading State:**
```typescript
setLoading(true);  // Başlangıç
// ... API istekleri
setLoading(false);  // Bitiş (finally bloğunda)
```

---

## 🔄 Akış Diyagramları

### Sayfa Yükleme Akışı

```
Kullanıcı /hesabim/tekrar-al sayfasını açar
    ↓
RepurchasePageClient component'i render edilir
    ↓
Repurchase component'i render edilir
    ↓
useEffect tetiklenir
    ↓
fetchOrders() çağrılır
    ↓
Token kontrolü
    ├─ Yok → Loading false, return
    └─ Var → Devam
        ↓
GET /api/v1/customer/orders
    ↓
Siparişler alınır
    ↓
Siparişlerden ürünler toplanır
    ├─ order_groups → order_group_items
    ├─ Duplicate kontrolü (Map kullanarak)
    ├─ orderCount hesaplanır
    └─ quantity toplanır
    ↓
Her ürün için stok kontrolü (paralel)
    ├─ GET /api/v1/products/{slug}
    ├─ Stok > 0 kontrolü
    ├─ Status = 'active' kontrolü
    └─ Başarılı ise ürün eklenir
    ↓
Filtrelenmiş ürünler state'e set edilir
    ↓
Loading false
    ↓
Ürünler grid formatında gösterilir
```

### Sepete Ekleme Akışı

```
Kullanıcı "Sepete Ekle" butonuna tıklar
    ↓
handleAddToCart(productId) çağrılır
    ↓
addToBasket(productId, 1) çağrılır (BasketContext)
    ↓
Stok kontrolü
    ├─ Stok yok → Hata mesajı, return
    └─ Stok var → Devam
        ↓
Token kontrolü
    ├─ Yok → Guest basket işlemi
    └─ Var → Logged in basket işlemi
        ↓
POST /api/v1/customer/baskets/add
    ├─ Request: { product_id, quantity: 1 }
    └─ Headers: Authorization Bearer token
    ↓
Response alınır
    ├─ Başarılı → State güncellenir, toast gösterilir
    └─ Hata → Hata mesajı gösterilir
    ↓
Sepet güncellenir (BasketContext)
```

### Ürün Toplama ve Filtreleme Akışı

```
Siparişler alınır
    ↓
Her sipariş için:
    ├─ order_groups döngüsü
    │   └─ order_group_items döngüsü
    │       ├─ product_id kontrolü
    │       ├─ Map'te var mı?
    │       │   ├─ Yok → Yeni ürün ekle
    │       │   │   ├─ orderCount = 1
    │       │   │   └─ quantity = item.quantity
    │       │   └─ Var → Mevcut ürünü güncelle
    │       │       ├─ orderCount += 1
    │       │       └─ quantity += item.quantity
    │       └─ Son sipariş tarihi güncelle
    ↓
Tüm ürünler Map'te toplandı
    ↓
Her ürün için stok kontrolü (paralel)
    ├─ GET /api/v1/products/{slug}
    ├─ Response kontrolü
    ├─ stock > 0 kontrolü
    ├─ status === 'active' kontrolü
    └─ Başarılı ise ürün eklenir
    ↓
Filtrelenmiş ürünler listesi
    ↓
State'e set edilir
```

---

## 🎨 UI/UX Özellikleri

### Ürün Kartı

**Görünüm:**
- **Görsel:** Aspect-square, object-contain, padding
- **Ürün Adı:** 2 satır clamp, hover efekti (turuncu)
- **Fiyat:** Bold, siyah
- **Sipariş Sayısı:** Gri, küçük font
- **Sepete Ekle Butonu:** Turuncu, hover efekti

**Kod:**
```tsx
<div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-200 transition-colors flex flex-col">
  <Link href={createProductUrl(product.slug || '')} className="relative w-full aspect-square">
    <Image
      src={getImageUrl(product)}
      alt={product.name}
      fill
      className="object-contain p-2"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder.webp';
      }}
    />
  </Link>
  <div className="p-3 flex flex-col flex-1">
    <Link href={createProductUrl(product.slug || '')}>
      <h3 className="font-medium text-xs sm:text-sm text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer min-h-[2.5rem]">
        {product.name}
      </h3>
    </Link>
    <div className="space-y-1.5">
      <p className="text-sm sm:text-base font-bold text-black">
        {formatPrice(product.price)} TL
      </p>
      <p className="text-xs text-gray-500">
        {product.orderCount} kez satın alındı
      </p>
      <button
        onClick={() => handleAddToCart(product.id)}
        className="w-full bg-orange-500 text-white px-2 py-1.5 sm:px-3 rounded-md text-xs font-medium hover:bg-orange-600 transition-colors mt-2"
      >
        Sepete Ekle
      </button>
    </div>
  </div>
</div>
```

### Grid Layout

**Desktop:**
- `grid-cols-4` (4 sütun)

**Tablet:**
- `md:grid-cols-3` (3 sütun)

**Mobile:**
- `grid-cols-2` (2 sütun)

**Gap:**
- `gap-3 sm:gap-4` (12px mobile, 16px desktop)

### Loading State

```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  );
}
```

### Boş Durum

```tsx
<div className="bg-white rounded-lg p-8 text-center">
  <div className="max-w-sm mx-auto">
    <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
      <ShoppingBagIcon className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Henüz Ürün Satın Almadınız
    </h3>
    <p className="text-sm text-gray-500 mb-6">
      Satın aldığınız ürünler burada listelenecek ve tekrar satın alabileceksiniz
    </p>
    <button 
      onClick={() => window.location.href = '/'}
      className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
    >
      Alışverişe Başla
    </button>
  </div>
</div>
```

---

## 📱 Responsive Tasarım

### Desktop (≥ 1024px)

- **Grid:** 4 sütun
- **Header:** Büyük font, geniş spacing
- **Ürün Kartı:** Daha büyük padding
- **Sidebar:** Görünür

### Tablet (768px - 1023px)

- **Grid:** 3 sütun
- **Header:** Orta font
- **Ürün Kartı:** Orta padding

### Mobile (< 768px)

- **Grid:** 2 sütun
- **Header:** Küçük font, menü butonu
- **Ürün Kartı:** Küçük padding
- **Sidebar:** Overlay modal

---

## 🔧 Veri Yapıları

### Order Interface

```typescript
interface Order {
  id: string;
  order_number: string;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
  order_groups?: Array<{
    id: string;
    order_group_items: OrderItem[];
  }>;
}
```

### OrderItem Interface

```typescript
interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    stock?: number;
    status?: string;
    images?: Array<{
      url: string;
      fullpath: string;
    }>;
    medias?: {
      url: string;
      fullpath: string;
    };
  };
}
```

### PurchasedProduct (İşlenmiş Ürün)

```typescript
interface PurchasedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  status: string;
  quantity: number;        // Toplam satın alınan miktar
  orderCount: number;       // Kaç kez satın alındı
  lastOrderDate: string;    // Son sipariş tarihi
  images: Array<{...}>;
  medias: {...};
}
```

---

## 🎯 Özellikler

### ✅ Mevcut Özellikler

1. **Sipariş Geçmişinden Ürün Çekme:**
   - Tüm siparişlerden ürünler toplanır
   - Duplicate önleme (Map kullanarak)

2. **Stok Kontrolü:**
   - Her ürün için güncel stok kontrolü
   - Sadece stokta olan ürünler gösterilir
   - Paralel stok kontrolü (performans)

3. **Durum Kontrolü:**
   - Sadece aktif ürünler gösterilir
   - Pasif ürünler filtrelenir

4. **Sipariş İstatistikleri:**
   - Her ürün için kaç kez satın alındığı gösterilir
   - Toplam satın alınan miktar hesaplanır

5. **Sepete Ekleme:**
   - Tek tıkla sepete ekleme
   - BasketContext entegrasyonu
   - Toast mesajları

6. **Responsive Tasarım:**
   - Mobile ve desktop için optimize
   - Grid layout (2-4 sütun)

7. **Görsel Yönetimi:**
   - Fallback görsel desteği
   - Hata durumunda placeholder

8. **Fiyat Formatı:**
   - Türk Lirası formatı
   - 2 ondalık basamak

### ❌ Eksik Özellikler (İyileştirme Önerileri)

1. **Miktar Seçimi:**
   - Kullanıcı miktar seçemiyor (her zaman 1)
   - Miktar input'u eklenebilir

2. **Filtreleme:**
   - Tarih bazlı filtreleme yok
   - Marka bazlı filtreleme yok
   - Fiyat bazlı filtreleme yok

3. **Sıralama:**
   - En çok satın alınan
   - En son satın alınan
   - Fiyata göre sıralama

4. **Arama:**
   - Ürün adına göre arama yok

5. **Toplu İşlemler:**
   - Tümünü sepete ekle butonu yok
   - Seçili ürünleri sepete ekle yok

6. **Variant Desteği:**
   - Variant seçimi yok
   - Önceki siparişteki variant bilgisi kullanılmıyor

7. **Cache:**
   - Stok kontrolü her sayfa yüklemesinde yapılıyor
   - Cache mekanizması eklenebilir

---

## 🔍 Önemli Detaylar

### 1. Duplicate Önleme

**Mantık:**
- Aynı ürün birden fazla siparişte varsa birleştirilir
- `Map` kullanılarak `product_id` bazlı gruplama yapılır
- `orderCount` artırılarak kaç kez satın alındığı takip edilir
- `quantity` toplanarak toplam miktar hesaplanır

**Örnek:**
```
Sipariş 1: iPhone 15 Pro (2 adet)
Sipariş 2: iPhone 15 Pro (1 adet)
Sipariş 3: iPhone 15 Pro (3 adet)

Sonuç:
- orderCount: 3
- quantity: 6
```

### 2. Stok Kontrolü Neden Yapılıyor?

**Sebep:** Sipariş verilerindeki stok bilgisi eski olabilir. Güncel stok durumunu kontrol etmek için her ürün için API'den güncel veri çekilir.

**Avantajlar:**
- Kullanıcı sadece satın alabileceği ürünleri görür
- Stokta olmayan ürünler gösterilmez
- Pasif ürünler gösterilmez

**Dezavantajlar:**
- Her ürün için API isteği (performans etkisi)
- Sayfa yükleme süresi artabilir

### 3. Paralel İşleme

**Performans:**
- Tüm ürünler için stok kontrolü paralel yapılır
- `Promise.all()` kullanılır
- Daha hızlı yükleme

**Örnek:**
```
10 ürün varsa:
- Sıralı: 10 × 500ms = 5 saniye
- Paralel: max(500ms) = 500ms
```

### 4. Görsel Yönetimi

**Fallback Sırası:**
1. `product.images[0].url` veya `product.images[0].fullpath`
2. `product.medias[0].url` veya `product.medias[0].fullpath`
3. `product.medias.url`
4. `product.medias.fullpath`
5. `/placeholder.webp` (fallback)

**Hata Yönetimi:**
```typescript
onError={(e) => {
  const target = e.target as HTMLImageElement;
  target.src = '/placeholder.webp';
}}
```

### 5. Fiyat Formatı

**Format:**
```typescript
const formatPrice = (price: number) => {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Örnek: 1234.56 → "1.234,56"
```

---

## 🚨 Hata Yönetimi

### 1. Token Yok

**Durum:** Kullanıcı giriş yapmamış

**Çözüm:**
```typescript
const token = localStorage.getItem('token');
if (!token) {
  setLoading(false);
  return;  // İşlem durdurulur
}
```

### 2. API Hatası

**Durum:** Siparişler çekilemedi

**Çözüm:**
```typescript
catch (error) {
  toast.error('Siparişler yüklenirken bir hata oluştu');
} finally {
  setLoading(false);
}
```

### 3. Ürün Stok Kontrolü Hatası

**Durum:** Ürün detayı çekilemedi

**Çözüm:**
```typescript
catch (error) {

  return null;  // Ürün atlanır
}
```

### 4. Sepete Ekleme Hatası

**Durum:** Sepete ekleme başarısız

**Çözüm:**
- BasketContext'te yönetilir
- Toast mesajı gösterilir

---

## 📊 Performans

### API İstekleri

**Sayfa Yüklendiğinde:**
1. `GET /api/v1/customer/orders` - 1 istek
2. `GET /api/v1/products/{slug}` - N istek (N = unique ürün sayısı)

**Örnek:**
- 10 unique ürün varsa: 11 istek
- 50 unique ürün varsa: 51 istek

**Optimizasyon:**
- Paralel stok kontrolü (`Promise.all`)
- Sadece stokta olan ürünler gösterilir (daha az render)

### State Güncellemeleri

- Siparişler çekildiğinde: 1 güncelleme
- Ürünler filtrelendiğinde: 1 güncelleme
- Toplam: 2 güncelleme

---

## 🔄 Kullanım Senaryoları

### Senaryo 1: İlk Kez Kullanım

```
Kullanıcı sayfayı açar
    ↓
Sipariş geçmişi yok
    ↓
Boş durum gösterilir
    ↓
"Alışverişe Başla" butonu gösterilir
```

### Senaryo 2: Ürünler Var

```
Kullanıcı sayfayı açar
    ↓
Siparişler çekilir
    ↓
Ürünler toplanır
    ↓
Stok kontrolü yapılır
    ↓
Stokta olan ürünler gösterilir
    ↓
Kullanıcı "Sepete Ekle" butonuna tıklar
    ↓
Ürün sepete eklenir
```

### Senaryo 3: Stokta Olmayan Ürünler

```
Kullanıcı sayfayı açar
    ↓
Siparişler çekilir
    ↓
Ürünler toplanır
    ↓
Stok kontrolü yapılır
    ↓
Stokta olmayan ürünler filtrelenir
    ↓
Sadece stokta olan ürünler gösterilir
```

---

## 📚 İlgili Dosyalar

- `app/hesabim/tekrar-al/page.tsx` - Server component
- `app/hesabim/tekrar-al/RepurchasePageClient.tsx` - Client component
- `components/account/Repurchase.tsx` - Ana component
- `app/context/BasketContext.tsx` - Sepete ekleme context'i
- `components/account/OrderDetail.tsx` - Sipariş detayında tekrar satın al butonu
- `utils/productUrl.ts` - Ürün URL oluşturma

---

## 🚀 İyileştirme Önerileri

1. **Cache Mekanizması:**
   - Stok kontrolü sonuçlarını cache'leme
   - Daha az API isteği

2. **Batch API İsteği:**
   - Tüm ürünler için tek bir API isteği
   - Performans iyileştirmesi

3. **Miktar Seçimi:**
   - Kullanıcı miktar seçebilmeli
   - Önceki siparişteki miktar önerilebilir

4. **Filtreleme ve Sıralama:**
   - Tarih bazlı filtreleme
   - En çok satın alınan sıralaması
   - Fiyat bazlı sıralama

5. **Arama:**
   - Ürün adına göre arama
   - Marka bazlı arama

6. **Toplu İşlemler:**
   - Tümünü sepete ekle
   - Seçili ürünleri sepete ekle

7. **Variant Desteği:**
   - Önceki siparişteki variant bilgisi
   - Variant seçimi

8. **Pagination:**
   - Çok fazla ürün varsa sayfalama
   - Infinite scroll

---

**Son Güncelleme:** 2024

