# Tüm Siparişler Sayfası - Detaylı Dokümantasyon

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Dosya Yapısı](#dosya-yapısı)
3. [API Endpoint'leri](#api-endpointleri)
4. [Bileşenler ve Yapı](#bileşenler-ve-yapı)
5. [State Yönetimi](#state-yönetimi)
6. [Veri Yapıları (Interfaces)](#veri-yapıları-interfaces)
7. [Filtreleme ve Arama](#filtreleme-ve-arama)
8. [Sayfalama](#sayfalama)
9. [Sipariş Durumları](#sipariş-durumları)
10. [UI/UX Özellikleri](#uiux-özellikleri)
11. [Responsive Tasarım](#responsive-tasarım)
12. [Hata Yönetimi](#hata-yönetimi)
13. [Kullanılan Kütüphaneler](#kullanılan-kütüphaneler)

---

## Genel Bakış

**Tüm Siparişler Sayfası**, kullanıcıların tüm siparişlerini görüntüleyebildiği, filtreleyebildiği ve arayabildiği bir sayfadır. Sayfa, kullanıcının sipariş geçmişini detaylı bir şekilde gösterir ve sipariş durumlarını takip etmesine olanak sağlar.

**Sayfa URL'i:** `/hesabim/siparislerim`

**Ana Özellikler:**
- Tüm siparişlerin listelenmesi
- Sipariş durumlarına göre filtreleme (Tümü, Devam Eden, İadeler, İptaller)
- Ürün adına göre arama
- Tarih bazlı filtreleme (Son 1 Ay, Son 3 Ay, Son 6 Ay)
- Sayfalama (sayfa başına 5 sipariş)
- Sipariş detay sayfasına yönlendirme
- Responsive tasarım (mobil ve desktop)
- Dinamik filtre sayıları

---

## Dosya Yapısı

### Ana Dosyalar

```
app/hesabim/siparislerim/
├── page.tsx                    # Server component (wrapper)
└── OrdersPageClient.tsx        # Client component (ana sayfa wrapper)

components/account/
├── Orders.tsx                  # Ana siparişler bileşeni (970 satır)
├── OrdersTabs.tsx              # Sekme bileşeni (filtre sekmeleri)
└── AccountSidebar.tsx          # Hesap sidebar bileşeni

components/hesabim/
└── OrdersHeader.tsx            # Siparişler başlık bileşeni
```

### Dosya Açıklamaları

#### 1. `app/hesabim/siparislerim/page.tsx`
- **Tip:** Server Component
- **Görev:** Client component'i render eder
- **İçerik:**
  ```tsx
  import OrdersPageClient from './OrdersPageClient';
  export default function OrdersPage() {
    return <OrdersPageClient />;
  }
  ```

#### 2. `app/hesabim/siparislerim/OrdersPageClient.tsx`
- **Tip:** Client Component
- **Görev:** Sayfa layout'unu oluşturur, sidebar ve ana içeriği yönetir
- **Özellikler:**
  - Desktop ve mobil sidebar yönetimi
  - Header ve ScrollToTop bileşenlerini içerir
  - Responsive layout yapısı

#### 3. `components/account/Orders.tsx`
- **Tip:** Client Component
- **Görev:** Ana sipariş listesi ve işlevselliği
- **Satır Sayısı:** 970+ satır
- **Ana İşlevler:**
  - Sipariş verilerini API'den çekme
  - Filtreleme ve arama
  - Sayfalama
  - Sipariş durumu gösterimi
  - Ürün değerlendirme modal'ı

#### 4. `components/account/OrdersTabs.tsx`
- **Tip:** Client Component
- **Görev:** Filtre sekmelerini gösterir
- **Sekmeler:**
  - Tümü (all)
  - Devam Eden Siparişler (ongoing)
  - İadeler (returns)
  - İptaller (cancelled)

#### 5. `components/account/AccountSidebar.tsx`
- **Tip:** Client Component
- **Görev:** Hesap menü sidebar'ı
- **Özellikler:**
  - Desktop ve mobil görünüm
  - Sticky positioning (desktop)
  - Kullanıcı bilgileri gösterimi

---

## API Endpoint'leri

### 1. Siparişleri Getir

**Endpoint:** `GET /api/v1/customer/orders`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/orders`

**Kullanım Yeri:** `components/account/Orders.tsx` - `fetchOrders()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: Order[]  // Sipariş dizisi
}
```

**Response Örneği:**
```json
{
  "meta": {
    "status": "success"
  },
  "data": [
    {
      "id": "order_id",
      "user_id": "user_id",
      "status": "pending",
      "order_number": "123456",
      "total_price": 1500.00,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "order_groups": [
        {
          "id": "group_id",
          "order_id": "order_id",
          "status": "pending",
          "ogid": 123456,
          "order_number": "123456",
          "tracking_number": "TR123456789",
          "total_price": 1500.00,
          "order_group_items": [
            {
              "id": "item_id",
              "order_group_id": "group_id",
              "product_id": "product_id",
              "quantity": 2,
              "price": 750.00,
              "product": {
                "id": "product_id",
                "name": "Ürün Adı",
                "slug": "urun-adi",
                "price": 750.00,
                "status": "active",
                "medias": [
                  {
                    "id": "media_id",
                    "name": "image.jpg",
                    "fullpath": "/path/to/image.jpg",
                    "url": "https://api.trendruum.com/storage/image.jpg",
                    "type": "image"
                  }
                ]
              }
            }
          ],
          "address": {
            "id": "address_id",
            "firstname": "Ahmet",
            "lastname": "Yılmaz",
            "phone": "5551234567",
            "invoice": {
              "type": "individual"
            },
            "address": {
              "title": "Ev",
              "city": {
                "id": "city_id",
                "name": "İstanbul",
                "slug": "istanbul"
              },
              "district": {
                "id": "district_id",
                "name": "Kadıköy",
                "slug": "kadikoy"
              },
              "neighborhood": {
                "id": "neighborhood_id",
                "name": "Moda",
                "slug": "moda"
              },
              "description": "Moda Caddesi No:123 Daire:4"
            }
          },
          "payment": []
        }
      ],
      "address": { /* ... */ },
      "payment": []
    }
  ]
}
```

**Hata Durumları:**
- `401 Unauthorized`: Token geçersiz veya süresi dolmuş
- `500 Internal Server Error`: Sunucu hatası

**Kod Örneği:**
```typescript
const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  const apiUrl = `${API_V1_URL}/customer/orders`;
  
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  
  if (response.status === 401) {
    setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
    return;
  }
  
  const data = await response.json();
  if (data.meta?.status === 'success' && Array.isArray(data.data)) {
    // Siparişleri tarih sırasına göre sırala (en yeni en üstte)
    const sortedOrders = data.data.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    setOrders(sortedOrders);
  }
};
```

---

### 2. Ürün Değerlendirmesi Gönder

**Endpoint:** `POST /api/v1/customer/reviews`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/reviews`

**Kullanım Yeri:** `components/account/Orders.tsx` - `handleReviewSubmit()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

**Request Body:**
```typescript
{
  product_id: string,
  rating: number,      // 1-5 arası
  comment: string
}
```

**Request Örneği:**
```json
{
  "product_id": "product_123",
  "rating": 5,
  "comment": "Çok beğendim, kaliteli bir ürün."
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: {
    id: string,
    product_id: string,
    rating: number,
    comment: string,
    created_at: string
  }
}
```

**Kod Örneği:**
```typescript
const handleReviewSubmit = async (rating: number, comment: string) => {
  const token = localStorage.getItem('token');
  if (!token || !selectedProduct) return;

  const response = await fetch(`${API_V1_URL}/customer/reviews`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: selectedProduct.id,
      rating,
      comment,
    }),
  });

  if (!response.ok) {
    throw new Error('Değerlendirme gönderilemedi');
  }

  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};
```

---

## Bileşenler ve Yapı

### OrdersPageClient Bileşeni

**Dosya:** `app/hesabim/siparislerim/OrdersPageClient.tsx`

**Yapı:**
```
OrdersPageClient
├── Header (showBackButton={false})
├── Main Container
│   ├── Desktop Sidebar (lg:block)
│   │   └── AccountSidebar
│   ├── Mobile Sidebar Overlay (lg:hidden)
│   │   └── AccountSidebar (onItemClick)
│   └── Main Content
│       └── Orders (onMenuClick)
└── ScrollToTop
```

**State:**
- `sidebarOpen`: boolean - Mobil sidebar açık/kapalı durumu

**Props:**
- Yok (kendi state'ini yönetir)

---

### Orders Bileşeni

**Dosya:** `components/account/Orders.tsx`

**Yapı:**
```
Orders
├── Header Section
│   ├── Desktop Header
│   │   ├── Back Button
│   │   ├── Title (Siparişlerim)
│   │   ├── Search Input
│   │   └── Date Filter Select
│   └── Mobile Header
│       ├── Back Button + Title + Menu Button
│       └── Search + Date Filter (tek satır)
├── OrdersTabs
│   ├── Tümü Tab
│   ├── Devam Eden Tab
│   ├── İadeler Tab
│   └── İptaller Tab
└── Orders List
    ├── Order Card (her sipariş için)
    │   ├── Header (Gri alan)
    │   │   ├── Sipariş No
    │   │   ├── Sipariş Tarihi
    │   │   ├── Sipariş Özeti
    │   │   ├── Alıcı
    │   │   ├── Toplam
    │   │   └── Detaylar Button
    │   └── Content
    │       ├── Status Badge
    │       └── Product Images
    ├── Pagination
    └── Empty State
```

**State Yönetimi:**
```typescript
const [activeTab, setActiveTab] = useState('all');
const [searchQuery, setSearchQuery] = useState('');
const [filterType, setFilterType] = useState('all');
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);
const [showSuccess, setShowSuccess] = useState(false);
const [showReviewModal, setShowReviewModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(null);
const [error, setError] = useState<string | null>(null);
const [showReviewPopup, setShowReviewPopup] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [ordersPerPage] = useState(5);
const [filterCounts, setFilterCounts] = useState({
  all: 0,
  ongoing: 0,
  returns: 0,
  cancelled: 0
});
```

**Props:**
```typescript
interface OrdersProps {
  onMenuClick?: () => void;  // Mobil menü açma fonksiyonu
}
```

**Ana Fonksiyonlar:**
1. `fetchOrders()` - API'den siparişleri çeker
2. `getFilteredOrders()` - Filtrelenmiş siparişleri döndürür
3. `handleReviewSubmit()` - Ürün değerlendirmesi gönderir
4. `formatDate()` - Tarih formatlar
5. `formatPrice()` - Fiyat formatlar
6. `getStatusText()` - Durum metnini döndürür
7. `getStatusColor()` - Durum rengini döndürür
8. `getDeliveryStatus()` - Teslimat durumu bilgisini döndürür

---

### OrdersTabs Bileşeni

**Dosya:** `components/account/OrdersTabs.tsx`

**Yapı:**
```
OrdersTabs
└── Tab Buttons
    ├── Tümü (all)
    ├── Devam Eden (ongoing)
    ├── İadeler (returns)
    └── İptaller (cancelled)
```

**Props:**
```typescript
interface OrdersTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filterCounts: {
    all: number;
    ongoing: number;
    returns: number;
    cancelled: number;
  };
}
```

**Özellikler:**
- Aktif sekme vurgulanır (turuncu border ve arka plan)
- Her sekmede sipariş sayısı gösterilir
- Mobilde kısa isimler, desktop'ta tam isimler gösterilir

---

## State Yönetimi

### Local State (Orders.tsx)

**1. Tab Yönetimi:**
```typescript
const [activeTab, setActiveTab] = useState('all');
// Değerler: 'all', 'ongoing', 'returns', 'cancelled'
```

**2. Arama ve Filtreleme:**
```typescript
const [searchQuery, setSearchQuery] = useState('');  // Ürün adı araması
const [filterType, setFilterType] = useState('all');  // Tarih filtresi
// filterType değerleri: 'all', 'lastMonth', 'last3Months', 'last6Months'
```

**3. Sipariş Verileri:**
```typescript
const [orders, setOrders] = useState<Order[]>([]);  // Tüm siparişler
const [loading, setLoading] = useState(true);       // Yükleme durumu
const [error, setError] = useState<string | null>(null);  // Hata mesajı
```

**4. Sayfalama:**
```typescript
const [currentPage, setCurrentPage] = useState(1);
const [ordersPerPage] = useState(5);  // Sabit değer
```

**5. Filtre Sayıları:**
```typescript
const [filterCounts, setFilterCounts] = useState({
  all: 0,        // Tüm siparişler
  ongoing: 0,    // Devam eden siparişler
  returns: 0,    // İadeler
  cancelled: 0   // İptaller
});
```

**6. Değerlendirme Modal:**
```typescript
const [showReviewModal, setShowReviewModal] = useState(false);
const [showReviewPopup, setShowReviewPopup] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<ReviewProduct | null>(null);
const [showSuccess, setShowSuccess] = useState(false);
```

### useEffect Hook'ları

**1. İlk Yükleme:**
```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setError('Oturum açmanız gerekiyor');
    return;
  }
  fetchOrders();
}, [router]);
```

---

## Veri Yapıları (Interfaces)

### Order Interface

```typescript
interface Order {
  user_id: string;
  status: string;
  payment: any[];
  address: OrderAddress;
  total_price: number;
  order_groups: OrderGroup[];
  id: string;
  order_number?: string;
  created_at: string;
  updated_at: string;
}
```

### OrderGroup Interface

```typescript
interface OrderGroup {
  order_id: string;
  status: string;
  address: OrderAddress;
  payment: any[];
  total_price: number;
  order_group_items: OrderItem[];
  id: string;
  ogid?: number;              // Order Group ID (numara)
  order_number?: string;       // Sipariş numarası
  tracking_number?: string;    // Takip numarası
}
```

### OrderItem Interface

```typescript
interface OrderItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  id: string;
}
```

### Product Interface

```typescript
interface Product {
  name: string;
  price: number;
  medias: Media | Media[];  // Tek veya çoklu medya
  status: string;
  slug: string;
  id: string;
}
```

### Media Interface

```typescript
interface Media {
  name: string;
  fullpath: string;
  url: string;
  type: string;
  id: string;
}
```

### OrderAddress Interface

```typescript
interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: {
    type: string;
  };
  address: Address;
  id: string;
}
```

### Address Interface

```typescript
interface Address {
  title: string;
  city: {
    name: string;
    slug: string;
    id: string;
  };
  district: {
    name: string;
    slug: string;
    id: string;
  };
  neighborhood: {
    name: string;
    slug: string;
    id: string;
  };
  description: string;
}
```

### ReviewProduct Interface

```typescript
interface ReviewProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}
```

---

## Filtreleme ve Arama

### Tab Filtreleme

**Tümü (all):**
- Tüm siparişleri gösterir
- Filtreleme yapılmaz

**Devam Eden (ongoing):**
```typescript
filtered = filtered.filter((order: Order) => {
  const firstGroupStatus = order.order_groups[0]?.status || order.status;
  return firstGroupStatus === 'pending' || 
         firstGroupStatus === 'searchingDriver' || 
         firstGroupStatus === 'in_progress' || 
         firstGroupStatus === 'shipping' || 
         firstGroupStatus === 'pickedUp' || 
         firstGroupStatus === 'picked_up';
});
```

**İadeler (returns):**
```typescript
filtered = filtered.filter((order: Order) => {
  const firstGroupStatus = order.order_groups[0]?.status || order.status;
  return firstGroupStatus === 'return_requested' || 
         firstGroupStatus === 'return_pending' || 
         firstGroupStatus === 'returned';
});
```

**İptaller (cancelled):**
```typescript
filtered = filtered.filter((order: Order) => {
  const firstGroupStatus = order.order_groups[0]?.status || order.status;
  return firstGroupStatus === 'canceled' || 
         firstGroupStatus === 'shipmentCanceled';
});
```

### Arama Filtreleme

**Ürün Adına Göre Arama:**
```typescript
if (searchQuery.trim()) {
  filtered = filtered.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return order.order_groups.some(group =>
      group.order_group_items.some(item =>
        item.product.name.toLowerCase().includes(searchLower)
      )
    );
  });
}
```

**Arama Özellikleri:**
- Case-insensitive (büyük/küçük harf duyarsız)
- Ürün adında arama yapar
- Tüm sipariş gruplarında ve tüm ürünlerde arar

### Tarih Filtreleme

**Not:** Tarih filtresi UI'da mevcut ancak backend'de henüz implement edilmemiş görünüyor. Frontend'de sadece select box var.

**Filtre Seçenekleri:**
- `all`: Tüm siparişler
- `lastMonth`: Son 1 Ay
- `last3Months`: Son 3 Ay
- `last6Months`: Son 6 Ay

---

## Sayfalama

### Sayfalama Yapısı

**Sayfa Başına Ürün:** 5 sipariş

**Sayfalama Mantığı:**
```typescript
const ordersPerPage = 5;
const currentPage = 1;  // State'ten gelir

// Filtrelenmiş siparişlerden sayfa verilerini al
const paginatedOrders = getFilteredOrders().slice(
  (currentPage - 1) * ordersPerPage, 
  currentPage * ordersPerPage
);
```

**Sayfa Hesaplama:**
```typescript
const totalPages = Math.ceil(getFilteredOrders().length / ordersPerPage);
```

**Sayfalama UI:**
- Önceki/Sonraki butonları
- Sayfa numaraları
- Mobilde sadece mevcut sayfa ve yanındaki 1'er sayfa gösterilir
- Desktop'ta tüm sayfa numaraları gösterilir

**Mobil Sayfalama:**
```typescript
.filter((page) => {
  if (window.innerWidth < 640) {
    return Math.abs(page - currentPage) <= 1;
  }
  return true;
})
```

---

## Sipariş Durumları

### Durum Türleri

**1. Beklemede (pending, searchingDriver)**
- **Renk:** Turuncu (`bg-orange-100 text-orange-800`)
- **İkon:** Saat ikonu
- **Açıklama:** "ürün beklemede"

**2. Kargoya Hazırlanıyor (in_progress)**
- **Renk:** Mavi (`bg-blue-100 text-blue-800`)
- **İkon:** Saat ikonu
- **Açıklama:** "ürün kargoya hazırlanıyor"

**3. Kargoya Verildi (shipping)**
- **Renk:** Mor (`bg-purple-100 text-purple-800`)
- **İkon:** Kargo ikonu
- **Açıklama:** "ürün kargoya verildi"

**4. Kargoda (pickedUp, picked_up)**
- **Renk:** Mavi (`bg-blue-100 text-blue-800`)
- **İkon:** Kargo ikonu
- **Açıklama:** "ürün kargoda"

**5. Teslim Edildi (delivered)**
- **Renk:** Yeşil (`bg-green-100 text-green-800`)
- **İkon:** Checkmark ikonu
- **Açıklama:** "ürün teslim edildi"

**6. İptal Edildi (canceled, shipmentCanceled)**
- **Renk:** Kırmızı (`bg-red-100 text-red-800`)
- **İkon:** X ikonu
- **Açıklama:** "sipariş iptal edildi"

**7. İade Talep Edildi (return_requested)**
- **Renk:** Sarı (`bg-yellow-100 text-yellow-800`)
- **İkon:** Yukarı ok ikonu
- **Açıklama:** "iade talebi oluşturuldu"

**8. İade Bekleniyor (return_pending)**
- **Renk:** İndigo (`bg-indigo-100 text-indigo-800`)
- **İkon:** Saat ikonu
- **Açıklama:** "iade bekleniyor"

**9. İade Ulaştı (returned)**
- **Renk:** Gri (`bg-gray-100 text-gray-800`)
- **İkon:** Yukarı ok ikonu
- **Açıklama:** "iade ulaştı"

### Durum Fonksiyonları

**getStatusText():**
```typescript
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'pending': 'Beklemede',
    'searchingDriver': 'Beklemede',
    'in_progress': 'Kargoya Hazırlanıyor',
    'shipping': 'Kargoya Verildi',
    'delivered': 'Teslim Edildi',
    'canceled': 'İptal Edildi',
    'shipmentCanceled': 'İptal Edildi',
    'return_requested': 'İade Talep Edildi',
    'return_pending': 'İade Bekleniyor',
    'returned': 'İade Ulaştı'
  };
  return statusMap[status] || status;
};
```

**getStatusColor():**
```typescript
const getStatusColor = (status: string) => {
  const colorMap: { [key: string]: string } = {
    'pending': 'bg-orange-100 text-orange-800',
    'searchingDriver': 'bg-orange-100 text-orange-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'shipping': 'bg-purple-100 text-purple-800',
    'delivered': 'bg-green-100 text-green-800',
    'canceled': 'bg-red-100 text-red-800',
    'shipmentCanceled': 'bg-red-100 text-red-800',
    'return_requested': 'bg-yellow-100 text-yellow-800',
    'return_pending': 'bg-indigo-100 text-indigo-800',
    'returned': 'bg-gray-100 text-gray-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};
```

**getDeliveryStatus():**
- Durum bilgisini detaylı olarak döndürür (ikon, renk, metin, açıklama)

---

## UI/UX Özellikleri

### Sipariş Kartı Yapısı

**Header (Gri Alan):**
- Sipariş No: `ogid` veya `order_number` veya `order_id`'nin son 6 karakteri
- Sipariş Tarihi: Türkçe format (örn: "15 Ocak 2024")
- Sipariş Özeti: "X Teslimat, Y Ürün"
- Alıcı: Ad Soyad
- Toplam: Formatlanmış fiyat (örn: "1.500,00 TL")
- Detaylar Butonu: Turuncu buton, sipariş detay sayfasına yönlendirir

**Content:**
- Durum Badge: Renkli badge + ikon + durum metni
- Ürün Görselleri: Tüm sipariş gruplarındaki tüm ürünlerin küçük görselleri
  - Her görsel tıklanabilir (ürün sayfasına gider)
  - Görsel yoksa placeholder ikon gösterilir

### Boş Durum (Empty State)

**Gösterim:**
- Gri arka planlı ikon (ShoppingBagIcon)
- Başlık: "Henüz siparişiniz bulunmuyor"
- Açıklama metni
- "Alışverişe Başla" butonu (ana sayfaya yönlendirir)

### Yükleme Durumu (Loading)

**Gösterim:**
- Merkezi spinner (turuncu renk)
- `animate-spin` animasyonu

### Başarı Bildirimi

**Değerlendirme Gönderildiğinde:**
- `SuccessNotification` bileşeni gösterilir
- Mesaj: "Değerlendirmeniz başarıyla kaydedildi. Teşekkür ederiz!"
- 3 saniye sonra otomatik kapanır

### Değerlendirme Modal

**ProductReviewModal:**
- Ürün bilgileri (ad, görsel, fiyat)
- Yıldız puanlama (1-5)
- Yorum textarea
- İptal ve Değerlendir butonları

**ReviewPopup:**
- Alternatif değerlendirme popup'ı (kullanılmıyor gibi görünüyor)

---

## Responsive Tasarım

### Desktop (lg ve üzeri)

**Layout:**
- Sidebar: Sol tarafta, sticky, 208px genişlik
- Ana içerik: Sağ tarafta, flex-1
- Gap: 12px (xl: 16px, 2xl: 24px)

**Header:**
- Geri butonu + Başlık + Arama + Tarih Filtresi (tek satır)
- Arama genişliği: 300px

**Sipariş Kartı:**
- Header: Grid layout (2 sütun mobil, flex desktop)
- Ürün görselleri: Flex wrap

**Sayfalama:**
- Tüm sayfa numaraları gösterilir

### Mobil (sm ve altı)

**Layout:**
- Sidebar: Overlay modal (soldan açılır, 320px genişlik)
- Ana içerik: Tam genişlik
- Hamburger menü butonu gösterilir

**Header:**
- İlk satır: Geri + Başlık + Menü butonu
- İkinci satır: Arama + Tarih Filtresi (flex, tek satır)

**Sipariş Kartı:**
- Header: Grid layout (2 sütun)
- Detaylar butonu: Tam genişlik

**Sekmeler:**
- Kısa isimler gösterilir (örn: "Tümü" yerine "Tümü")
- Sayfa numaraları: Sadece mevcut sayfa ve yanındaki 1'er sayfa

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Hata Yönetimi

### Token Kontrolü

**Token Yoksa:**
```typescript
if (!token) {
  setError('Oturum açmanız gerekiyor');
  return;
}
```

**401 Unauthorized:**
```typescript
if (response.status === 401) {
  setError('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
  return;
}
```

### API Hataları

**Genel Hata:**
```typescript
catch (error) {
  setError('Siparişler yüklenirken bir hata oluştu');
} finally {
  setLoading(false);
}
```

### Hata Gösterimi

**Hata UI:**
```tsx
if (error) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/giris')}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}
```

### Değerlendirme Hataları

**Sessiz Hata Yönetimi:**
```typescript
catch (error) {
  // Handle error silently
}
```

---

## Kullanılan Kütüphaneler

### React & Next.js
- `react` - React kütüphanesi
- `next/navigation` - Next.js navigation hooks (`useRouter`, `usePathname`)
- `next/link` - Next.js Link bileşeni
- `next/image` - Next.js Image bileşeni

### Heroicons
- `@heroicons/react/24/outline` - Outline ikonlar
- `@heroicons/react/24/solid` - Solid ikonlar

**Kullanılan İkonlar:**
- `ShoppingBagIcon` - Sipariş ikonu
- `MagnifyingGlassIcon` - Arama ikonu
- `ArrowLeftIcon` - Geri butonu
- `Bars3Icon` - Hamburger menü
- `StarIcon` - Yıldız (boş)
- `StarIconSolid` - Yıldız (dolu)

### Diğer Bileşenler
- `SuccessNotification` - Başarı bildirimi
- `ProductReviewModal` - Ürün değerlendirme modal'ı
- `ScrollToTop` - Scroll to top butonu
- `Header` - Site header'ı

### Utilities
- `createProductUrl` - Ürün URL'i oluşturma fonksiyonu
- `API_V1_URL` - API base URL'i

---

## Önemli Notlar

### 1. Sipariş Sıralama
- Siparişler `created_at` tarihine göre sıralanır
- En yeni siparişler en üstte gösterilir

### 2. Durum Belirleme
- Sipariş durumu, ilk order group'un status'ünden alınır
- Eğer order group yoksa, order'ın kendi status'ü kullanılır

### 3. Sipariş Numarası
- Öncelik sırası: `ogid` > `order_number` > `order_id`'nin son 6 karakteri

### 4. Filtre Sayıları
- Filtre sayıları, tüm siparişler yüklendikten sonra hesaplanır
- Her tab değiştiğinde sayılar güncellenir

### 5. Sayfalama
- Sayfalama, filtrelenmiş siparişler üzerinde yapılır
- Her filtre değiştiğinde sayfa 1'e döner

### 6. Tarih Formatı
- Türkçe locale kullanılır (`tr-TR`)
- Format: "15 Ocak 2024, 10:30"

### 7. Fiyat Formatı
- Türkçe locale kullanılır
- Format: "1.500,00 TL" (2 ondalık basamak)

### 8. Ürün Görselleri
- Medya dizisi veya tek medya objesi olabilir
- Görsel yoksa placeholder ikon gösterilir
- Görseller `object-contain` ile gösterilir

### 9. Sipariş Detay Sayfası
- "Detaylar" butonuna tıklandığında `/hesabim/siparislerim/{order.id}` sayfasına yönlendirilir

### 10. Mobil Sidebar
- Mobilde sidebar overlay olarak açılır
- Sidebar açıkken arka plan karartılır
- Sidebar içindeki bir öğeye tıklandığında sidebar kapanır

---

## Geliştirme Notları

### Potansiyel İyileştirmeler

1. **Tarih Filtreleme:** Backend'de tarih filtresi implement edilmeli
2. **Sipariş İptal:** Sipariş iptal etme özelliği eklenebilir
3. **Sipariş Takibi:** Kargo takip numarası ile takip özelliği
4. **Filtreleme:** Daha fazla filtreleme seçeneği (fiyat aralığı, mağaza, vb.)
5. **Sıralama:** Siparişleri farklı kriterlere göre sıralama
6. **Export:** Siparişleri PDF veya Excel olarak dışa aktarma
7. **Bildirimler:** Sipariş durumu değişikliklerinde bildirim

---

## Son Güncelleme

**Tarih:** 2024
**Versiyon:** 1.0
**Dosya:** `TUM_SIPARISLER_SAYFASI.md`

---

## İletişim ve Destek

Sorularınız veya önerileriniz için lütfen geliştirme ekibiyle iletişime geçin.

