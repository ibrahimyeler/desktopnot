# Sipariş Detay Sayfası - Detaylı Dokümantasyon

## 📋 İçindekiler
1. [Genel Bakış](#genel-bakış)
2. [Dosya Yapısı](#dosya-yapısı)
3. [API Endpoint'leri](#api-endpointleri)
4. [Bileşenler ve Yapı](#bileşenler-ve-yapı)
5. [State Yönetimi](#state-yönetimi)
6. [Veri Yapıları (Interfaces)](#veri-yapıları-interfaces)
7. [Modal Yönetimi](#modal-yönetimi)
8. [Sipariş İşlemleri](#sipariş-işlemleri)
9. [UI/UX Özellikleri](#uiux-özellikleri)
10. [Responsive Tasarım](#responsive-tasarım)
11. [Hata Yönetimi](#hata-yönetimi)
12. [Kullanılan Kütüphaneler](#kullanılan-kütüphaneler)

---

## Genel Bakış

**Sipariş Detay Sayfası**, kullanıcıların belirli bir siparişin detaylarını görüntüleyebildiği, sipariş işlemlerini yönetebildiği (iptal, iade, soru sorma) ve kargo takibi yapabildiği kapsamlı bir sayfadır.

**Sayfa URL'i:** `/hesabim/siparislerim/[siparis_no]`

**Ana Özellikler:**
- Sipariş detaylarını görüntüleme
- Sipariş gruplarına göre ürün listesi
- Satıcı bilgileri ve değerlendirmeleri
- Kargo takip bilgileri
- Sipariş iptal etme
- İade talebi oluşturma
- Sipariş sorusu sorma
- Fatura görüntüleme
- Mağaza takip etme/bırakma
- Teslimat ve fatura adresi bilgileri
- Ödeme bilgileri
- Responsive tasarım (mobil ve desktop)

---

## Dosya Yapısı

### Ana Dosyalar

```
app/hesabim/siparislerim/[siparis_no]/
├── page.tsx                    # Server component (wrapper)
└── OrderDetailPageClient.tsx   # Client component (ana sayfa - 1442 satır)

components/account/
└── AccountSidebar.tsx          # Hesap sidebar bileşeni
```

### Dosya Açıklamaları

#### 1. `app/hesabim/siparislerim/[siparis_no]/page.tsx`
- **Tip:** Server Component
- **Görev:** Client component'e initial data geçirir
- **Özellikler:**
  - Dynamic route: `[siparis_no]` parametresi
  - Server-side data fetching fonksiyonları (şu an boş, client-side'da yapılıyor)
  - Initial data'ları client component'e props olarak geçirir

#### 2. `app/hesabim/siparislerim/[siparis_no]/OrderDetailPageClient.tsx`
- **Tip:** Client Component
- **Görev:** Ana sipariş detay sayfası ve tüm işlevsellik
- **Satır Sayısı:** 1442+ satır
- **Ana İşlevler:**
  - Sipariş detaylarını API'den çekme
  - Ürün detaylarını çekme
  - Sipariş iptal etme
  - İade talebi oluşturma
  - Sipariş sorusu sorma
  - Mağaza takip etme/bırakma
  - İade taleplerini listeleme
  - Sipariş sorularını listeleme
  - Modal yönetimi
  - Kargo takip bilgileri

---

## API Endpoint'leri

### 1. Sipariş Detaylarını Getir

**Endpoint:** `GET /api/v1/customer/orders/{siparis_no}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/orders/{siparis_no}`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `fetchOrderDetails()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**URL Parametreleri:**
- `siparis_no`: string - Sipariş numarası veya ID

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: Order  // Tek sipariş objesi
}
```

**Response Örneği:**
```json
{
  "meta": {
    "status": "success"
  },
  "data": {
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
        "seller": {
          "name": "Satıcı Adı",
          "id": "seller_id",
          "slug": "satici-adi"
        },
        "seller_rating": 4.5,
        "cargo_company": {
          "deliveryOptionName": "Kargo Şirketi",
          "deliveryOptionId": 1,
          "deliveryCompanyName": "Kargo Şirketi Adı",
          "logo": "https://api.trendruum.com/storage/logo.png"
        },
        "invoice_info": {
          "path": "/path/to/invoice.pdf",
          "fullpath": "/full/path/to/invoice.pdf",
          "name": "invoice.pdf",
          "fullname": "invoice.pdf",
          "extension": "pdf",
          "host": "api.trendruum.com",
          "url": "https://api.trendruum.com/storage/invoice.pdf",
          "mime_type": "application/pdf",
          "size": 12345
        },
        "activity": [
          {
            "dcStatus": "delivered",
            "note": "Teslim edildi",
            "deliveryOptionName": "Kargo Şirketi",
            "shipmentWeight": 1.5,
            "orderId": "order_id",
            "signature": "signature",
            "reverseShipment": false,
            "pickupLocationCode": "LOC001",
            "deliveryCompany": "Kargo Şirketi",
            "printAWBURL": "https://...",
            "otoId": 123,
            "brandedTrackingURL": "https://kargo.com/track/TR123456789",
            "trackingNumber": "TR123456789",
            "status": "delivered",
            "timestamp": 1705312200000
          }
        ],
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
              "medias": [
                {
                  "id": "media_id",
                  "name": "image.jpg",
                  "fullpath": "/path/to/image.jpg",
                  "url": "https://api.trendruum.com/storage/image.jpg",
                  "type": "image"
                }
              ],
              "brand": {
                "name": "Marka Adı",
                "slug": "marka-adi",
                "id": "brand_id"
              },
              "seller": {
                "name": "Satıcı Adı",
                "slug": "satici-adi",
                "id": "seller_id"
              }
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
        }
      }
    ],
    "address": { /* ... */ },
    "payment": []
  }
}
```

**Hata Durumları:**
- `401 Unauthorized`: Token geçersiz veya süresi dolmuş
- `404 Not Found`: Sipariş bulunamadı
- `500 Internal Server Error`: Sunucu hatası

**Kod Örneği:**
```typescript
const fetchOrderDetails = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_V1_URL}/customer/orders/${siparisNo}`, {
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
  if (data.meta?.status === 'success' && data.data) {
    setOrder(data.data);
    // Ürün detaylarını çek
    // ...
  }
};
```

---

### 2. Ürün Detaylarını Getir

**Endpoint:** `GET /api/v1/products/{productSlug}`

**Tam URL:** `https://api.trendruum.com/api/v1/products/{productSlug}`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `fetchProductDetails()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**URL Parametreleri:**
- `productSlug`: string - Ürün slug'ı

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: {
    // ... ürün bilgileri
    seller_v2: {
      name: string,
      cargo_company: {
        deliveryOptionName: string,
        deliveryOptionId: number,
        deliveryCompanyName: string,
        logo: string
      }
    },
    brand_v2: {
      name: string
    },
    termin: string
  }
}
```

**Kullanım Amacı:**
- Ürünün satıcı bilgisini almak
- Ürünün marka bilgisini almak
- Ürünün kargo şirketi bilgisini almak
- Ürünün teslimat süresi (termin) bilgisini almak

**Kod Örneği:**
```typescript
const fetchProductDetails = async (productSlug: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_V1_URL}/products/${productSlug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    return {
      seller: data.data?.seller_v2?.name || null,
      brand: data.data?.brand_v2?.name || null,
      cargo_company: data.data?.seller_v2?.cargo_company || null,
      termin: data.data?.termin || null
    };
  }
  return null;
};
```

---

### 3. İade Taleplerini Getir

**Endpoint:** `GET /api/v1/customer/orders/returns`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/orders/returns`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `fetchReturnRequests()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: ReturnRequest[]  // İade talepleri dizisi
}
```

**Kullanım Amacı:**
- Kullanıcının tüm iade taleplerini listelemek
- Sipariş grubunun iade durumunu kontrol etmek

**Kod Örneği:**
```typescript
const fetchReturnRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_V1_URL}/customer/orders/returns`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.meta?.status === 'success' && Array.isArray(data.data)) {
      setReturnRequests(data.data);
    }
  }
};
```

---

### 4. Sipariş Sorularını Getir

**Endpoint:** `GET /api/v1/customer/questions/user-order-question`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/questions/user-order-question`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `fetchOrderQuestions()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: OrderQuestion[]  // Sipariş soruları dizisi
}
```

**Kullanım Amacı:**
- Kullanıcının sipariş sorularını listelemek
- Sipariş grubuna soru sorulup sorulmadığını kontrol etmek

**Kod Örneği:**
```typescript
const fetchOrderQuestions = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.meta?.status === 'success' && Array.isArray(data.data)) {
      setOrderQuestions(data.data);
    }
  }
};
```

---

### 5. Sipariş Sorusu Gönder

**Endpoint:** `POST /api/v1/customer/questions/user-order-question`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/questions/user-order-question`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `handleSubmitOrderQuestion()` fonksiyonu

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
  question: string,        // Soru metni
  order_group_id: string,  // Sipariş grubu ID'si
  topic: string           // Konu (delivery_status, order_question, shipping, payment, refund)
}
```

**Request Örneği:**
```json
{
  "question": "Siparişim ne zaman teslim edilecek?",
  "order_group_id": "group_id_123",
  "topic": "delivery_status"
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success',
    message?: string
  },
  data: {
    id: string,
    question: string,
    order_group_id: string,
    topic: string,
    created_at: string
  }
}
```

**Konu Seçenekleri:**
- `delivery_status`: Teslimat Durumu
- `order_question`: Sipariş Sorusu
- `shipping`: Kargo
- `payment`: Ödeme
- `refund`: İade

**Kod Örneği:**
```typescript
const handleSubmitOrderQuestion = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newOrderQuestion.question.trim()) {
    toast.error('Lütfen bir soru yazın');
    return;
  }

  const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      question: newOrderQuestion.question.trim(),
      order_group_id: orderQuestionModal.orderGroupId,
      topic: newOrderQuestion.topic.trim()
    })
  });

  const data = await response.json();
  if (data.meta?.status === 'success') {
    toast.success('Sipariş sorunuz başarıyla gönderildi');
    closeOrderQuestionModal();
    fetchOrderQuestions();
  }
};
```

---

### 6. Sipariş İptal Et

**Endpoint:** `POST /api/v1/customer/orders/{orderId}/cancel`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/orders/{orderId}/cancel`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `handleCancelOrder()` fonksiyonu

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
  reason: string,  // İptal sebebi
  ogid?: string    // Sipariş grubu ID'si (opsiyonel, belirli bir grup iptal edilecekse)
}
```

**Request Örneği:**
```json
{
  "reason": "Yanlış ürün sipariş ettim",
  "ogid": "123456"
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success',
    message?: string
  },
  data: {
    // İptal edilen sipariş bilgileri
  }
}
```

**Notlar:**
- `ogid` parametresi varsa, sadece o sipariş grubu iptal edilir
- `ogid` parametresi yoksa, tüm sipariş iptal edilir

**Kod Örneği:**
```typescript
const handleCancelOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!cancelReason.trim()) {
    toast.error('Lütfen iptal sebebini yazın');
    return;
  }

  const requestBody: any = {
    reason: cancelReason.trim()
  };
  
  if (cancelOrderModal.ogid && cancelOrderModal.ogid !== '') {
    requestBody.ogid = cancelOrderModal.ogid;
  }
  
  const response = await fetch(`${API_V1_URL}/customer/orders/${cancelOrderModal.orderId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  if (data.meta?.status === 'success') {
    toast.success('Sipariş grubu başarıyla iptal edildi');
    closeCancelOrderModal();
    fetchOrderDetails();
  }
};
```

---

### 7. İade Talebi Oluştur

**Endpoint:** `POST /api/v1/customer/orders/returns`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/orders/returns`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `handleSubmitReturnRequest()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`
  // Content-Type belirtilmez, FormData kullanıldığı için
}
```

**Request Body (FormData):**
```typescript
FormData {
  ogid: string,        // Sipariş grubu ID'si
  reason: string,      // İade sebebi
  files[]: File | ''   // Dosya (opsiyonel, şu an boş string gönderiliyor)
}
```

**Request Örneği:**
```typescript
const formData = new FormData();
formData.append('ogid', '123456');
formData.append('reason', 'Ürün beklentimi karşılamadı');
formData.append('files[]', '');  // Şu an dosya gönderilmiyor
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success',
    message?: string
  },
  data: {
    id: string,
    ogid: string,
    reason: string,
    status: string,
    created_at: string
  }
}
```

**Notlar:**
- İade talebi sadece teslim edilmiş siparişler için oluşturulabilir
- 14 gün içinde iade talebi oluşturulabilir
- FormData kullanıldığı için dosya eklenebilir (şu an kullanılmıyor)

**Kod Örneği:**
```typescript
const handleSubmitReturnRequest = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!returnReason.trim()) {
    toast.error('Lütfen iade sebebini yazın');
    return;
  }

  const formData = new FormData();
  formData.append('ogid', returnRequestModal.ogid);
  formData.append('reason', returnReason.trim());
  formData.append('files[]', '');

  const response = await fetch(`${API_V1_URL}/customer/orders/returns`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (data.meta?.status === 'success') {
    toast.success('İade talebi başarıyla oluşturuldu');
    closeReturnRequestModal();
    fetchOrderDetails();
    fetchReturnRequests();
  }
};
```

---

### 8. Takip Edilen Mağazaları Getir

**Endpoint:** `GET /api/v1/customer/follows`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/follows`

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - `fetchFollowedStores()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: FollowedStore[]  // Takip edilen mağazalar dizisi
}
```

**Kullanım Amacı:**
- Kullanıcının takip ettiği mağazaları listelemek
- Siparişteki satıcının takip edilip edilmediğini kontrol etmek

**Kod Örneği:**
```typescript
const fetchFollowedStores = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_V1_URL}/customer/follows`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    if (data.meta?.status === 'success' && Array.isArray(data.data)) {
      setFollowedStores(data.data);
    }
  }
};
```

---

### 9. Mağaza Takip Et/Bırak

**Endpoint:** `POST /api/v1/customer/follows/{storeId}` (Takip Et)
**Endpoint:** `DELETE /api/v1/customer/follows/{storeId}` (Takibi Bırak)

**Tam URL:** 
- `https://api.trendruum.com/api/v1/customer/follows/{storeId}` (POST)
- `https://api.trendruum.com/api/v1/customer/follows/{storeId}` (DELETE)

**Kullanım Yeri:** `OrderDetailPageClient.tsx` - Mağaza takip butonları (kod içinde implement edilmemiş görünüyor, sadece state var)

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Response Yapısı:**
```typescript
{
  meta: {
    status: 'success'
  },
  data: {
    // Takip durumu bilgileri
  }
}
```

---

## Bileşenler ve Yapı

### OrderDetailPageClient Bileşeni

**Dosya:** `app/hesabim/siparislerim/[siparis_no]/OrderDetailPageClient.tsx`

**Yapı:**
```
OrderDetailPageClient
├── Header
│   ├── Desktop Header (Geri + Başlık)
│   └── Mobile Header (Geri + Başlık + Menü)
├── Main Container
│   ├── Desktop Sidebar (lg:block)
│   │   └── AccountSidebar
│   ├── Mobile Sidebar Overlay (lg:hidden)
│   │   └── AccountSidebar
│   └── Main Content
│       ├── Sipariş Grupları (her grup için)
│       │   ├── Sipariş Özeti (Gri alan)
│       │   │   ├── Sipariş No
│       │   │   ├── Sipariş Tarihi
│       │   │   ├── Sipariş Özeti
│       │   │   └── Kargo Takip Butonu
│       │   ├── Satıcı Grubu Detayları
│       │   │   ├── Satıcı Bilgisi + Rating
│       │   │   ├── Sipariş Durumu
│       │   │   ├── Sipariş Sorusu Butonu
│       │   │   ├── Sipariş İptal Butonu
│       │   │   ├── İade Talebi Butonu
│       │   │   └── Fatura Butonu
│       │   └── Ürünler
│       │       └── Ürün Kartı (her ürün için)
│       │           ├── Ürün Görseli
│       │           ├── Ürün Bilgileri
│       │           │   ├── Marka
│       │           │   ├── Ürün Adı
│       │           │   ├── Beden/Adet
│       │           │   └── Fiyat
│       │           └── Kargo Bilgileri
│       │               ├── Kargo Şirketi
│       │               ├── Tahmini Teslim
│       │               └── Takip Numarası
│       ├── Adres ve Ödeme Bilgileri
│       │   ├── Teslimat Adresi
│       │   ├── Fatura Adresi
│       │   └── Ödeme Bilgileri
│       └── Şartlar ve Koşullar
├── Footer
├── ScrollToTop
└── Modals
    ├── Sipariş Sorusu Modal
    ├── Sipariş İptal Modal
    └── İade Talebi Modal
```

---

## State Yönetimi

### Local State

**1. Sipariş Verileri:**
```typescript
const [order, setOrder] = useState<Order | null>(initialOrder);
const [loading, setLoading] = useState(!initialOrder);
const [error, setError] = useState<string | null>(null);
```

**2. Ürün Detayları:**
```typescript
const [productDetails, setProductDetails] = useState<{
  [key: string]: {
    seller: string | null,
    brand: string | null,
    cargo_company: any,
    termin: string | null
  }
}>({});
```

**3. Modal State'leri:**
```typescript
// Sipariş Sorusu Modal
const [orderQuestionModal, setOrderQuestionModal] = useState<{
  isOpen: boolean;
  orderGroupId: string;
  orderNumber: string;
}>({
  isOpen: false,
  orderGroupId: '',
  orderNumber: ''
});

const [newOrderQuestion, setNewOrderQuestion] = useState({
  question: '',
  topic: ''
});

const [submittingQuestion, setSubmittingQuestion] = useState(false);

// Sipariş İptal Modal
const [cancelOrderModal, setCancelOrderModal] = useState<{
  isOpen: boolean;
  orderId: string;
  ogid: string;
}>({
  isOpen: false,
  orderId: '',
  ogid: ''
});

const [cancelReason, setCancelReason] = useState('');
const [submittingCancel, setSubmittingCancel] = useState(false);

// İade Talebi Modal
const [returnRequestModal, setReturnRequestModal] = useState<{
  isOpen: boolean;
  orderGroupId: string;
  ogid: string;
}>({
  isOpen: false,
  orderGroupId: '',
  ogid: ''
});

const [returnReason, setReturnReason] = useState('');
const [submittingReturn, setSubmittingReturn] = useState(false);
```

**4. Liste State'leri:**
```typescript
const [returnRequests, setReturnRequests] = useState<any[]>(initialReturnRequests || []);
const [orderQuestions, setOrderQuestions] = useState<any[]>(initialOrderQuestions || []);
const [followedStores, setFollowedStores] = useState<any[]>(initialFollowedStores || []);
```

**5. UI State'leri:**
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false);
const [loadingFollow, setLoadingFollow] = useState<{[key: string]: boolean}>({});
const [cargoCompanies, setCargoCompanies] = useState<{[key: string]: any}>({});
```

### useEffect Hook'ları

**1. İlk Yükleme:**
```typescript
useEffect(() => {
  if (siparisNo && !initialOrder) {
    fetchOrderDetails();
    fetchReturnRequests();
    fetchOrderQuestions();
    fetchFollowedStores();
  }
}, [siparisNo, initialOrder]);
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
  invoice_info?: {
    path: string;
    fullpath: string;
    name: string;
    fullname: string;
    extension: string;
    host: string;
    url: string;
    mime_type: string;
    size: number;
  };
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
  order_group_items: OrderGroupItem[];
  id: string;
  ogid?: number;              // Order Group ID (numara)
  order_number?: string;       // Sipariş numarası
  tracking_number?: string;    // Takip numarası
  cargo_company?: {
    deliveryOptionName: string;
    deliveryOptionId: number;
    deliveryCompanyName: string;
    logo: string;
  };
  seller?: {
    name: string;
    id: string;
    slug?: string;
  };
  seller_rating?: number;
  invoice_info?: {
    path: string;
    fullpath: string;
    name: string;
    fullname: string;
    extension: string;
    host: string;
    url: string;
    mime_type: string;
    size: number;
  };
  activity?: Activity[];
}
```

### Activity Interface (Kargo Takip)

```typescript
interface Activity {
  dcStatus: string | null;
  note: string | null;
  deliveryOptionName: string;
  shipmentWeight: number;
  orderId: string;
  signature: string;
  reverseShipment: boolean;
  pickupLocationCode: string;
  deliveryCompany: string;
  printAWBURL: string;
  otoId: number;
  brandedTrackingURL: string;  // Kargo takip URL'i
  trackingNumber: string;
  status: string;
  timestamp: number;
}
```

### OrderGroupItem Interface

```typescript
interface OrderGroupItem {
  order_group_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: Product;
  updated_at: string;
  created_at: string;
  id: string;
}
```

### Product Interface

```typescript
interface Product {
  name: string;
  price: number;
  medias: Media | Media[];
  slug: string;
  seller?: Seller;
  brand?: Brand;
  updated_at: string;
  created_at: string;
  id: string;
  termin?: string;
  brand_name?: string;
  termin_display?: string;
}
```

### OrderAddress Interface

```typescript
interface OrderAddress {
  firstname: string;
  lastname: string;
  phone: string;
  invoice: Invoice;
  address: Address;
  updated_at: string;
  created_at: string;
  id: string;
}
```

---

## Modal Yönetimi

### 1. Sipariş Sorusu Modal

**Açılma Koşulu:**
- Sipariş grubuna henüz soru sorulmamışsa (`!hasOrderQuestion(group.id)`)

**Form Alanları:**
- Konu Seçimi (select): `delivery_status`, `order_question`, `shipping`, `payment`, `refund`
- Soru Metni (textarea)

**İşlemler:**
- Form gönderildiğinde `handleSubmitOrderQuestion()` çağrılır
- Başarılı olursa modal kapanır ve sipariş soruları yeniden yüklenir

### 2. Sipariş İptal Modal

**Açılma Koşulu:**
- Sipariş iptal edilebilir durumdaysa (`canCancelOrder(group)`)
- İptal edilebilir durumlar: `pending`, `searchingDriver`, `in_progress`

**Form Alanları:**
- İptal Sebebi (textarea)

**İşlemler:**
- Form gönderildiğinde `handleCancelOrder()` çağrılır
- `ogid` varsa sadece o grup iptal edilir
- Başarılı olursa modal kapanır ve sipariş detayları yeniden yüklenir

### 3. İade Talebi Modal

**Açılma Koşulu:**
- Sipariş iade edilebilir durumdaysa (`canReturnOrder(group)`)
- İade edilebilir durumlar: `delivered`
- 14 gün içinde olmalı

**Form Alanları:**
- İade Sebebi (textarea)
- Dosya yükleme (şu an kullanılmıyor)

**İşlemler:**
- Form gönderildiğinde `handleSubmitReturnRequest()` çağrılır
- FormData kullanılır (dosya eklenebilir)
- Başarılı olursa modal kapanır, sipariş detayları ve iade talepleri yeniden yüklenir

---

## Sipariş İşlemleri

### Sipariş İptal Etme

**Koşullar:**
```typescript
const canCancelOrder = (group: OrderGroup) => {
  const cancelableStatuses = ['pending', 'searchingDriver', 'in_progress'];
  return cancelableStatuses.includes(group.status);
};
```

**İşlem:**
1. Kullanıcı "Siparişi İptal Et" butonuna tıklar
2. Modal açılır
3. İptal sebebi girilir
4. API'ye POST isteği gönderilir
5. Başarılı olursa sipariş durumu güncellenir

### İade Talebi Oluşturma

**Koşullar:**
```typescript
const canReturnOrder = (group: OrderGroup) => {
  const returnableStatuses = ['delivered'];
  if (!returnableStatuses.includes(group.status)) {
    return false;
  }

  // 14 gün kontrolü
  if (!order) return false;
  const orderDate = new Date(order.created_at);
  const currentDate = new Date();
  const daysDifference = Math.floor((currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDifference <= 14;
};
```

**İşlem:**
1. Kullanıcı "İade Talebi Oluştur" butonuna tıklar
2. Modal açılır
3. İade sebebi girilir
4. API'ye POST isteği gönderilir (FormData)
5. Başarılı olursa iade talebi oluşturulur

### Sipariş Sorusu Sorma

**Koşullar:**
- Sipariş grubuna henüz soru sorulmamış olmalı

**İşlem:**
1. Kullanıcı "Sipariş Sorusu Sor" butonuna tıklar
2. Modal açılır
3. Konu seçilir ve soru yazılır
4. API'ye POST isteği gönderilir
5. Başarılı olursa soru gönderilir

---

## UI/UX Özellikleri

### Sipariş Özeti (Gri Alan)

**Gösterilen Bilgiler:**
- Sipariş No: `ogid` veya `order_number` veya `siparisNo`
- Sipariş Tarihi: Formatlanmış tarih
- Sipariş Özeti: "1 paket, X ürün"
- Kargo Takip Butonu: `activity[0].brandedTrackingURL` varsa gösterilir

### Satıcı Bilgileri

**Gösterilen Bilgiler:**
- Satıcı Adı: Mavi renk, tıklanabilir (mağaza sayfasına gider)
- Satıcı Rating: Yıldız gösterimi (1-5), ondalık gösterimi
- Sipariş Durumu: Renkli badge

### Ürün Kartı

**Gösterilen Bilgiler:**
- Ürün Görseli: Tıklanabilir (ürün sayfasına gider)
- Marka: Ürün detayından veya `brand_name`'den
- Ürün Adı: Tıklanabilir, hover'da turuncu
- Beden: "Tek beden" (sabit)
- Adet: `item.quantity`
- Fiyat: Formatlanmış, turuncu renk
- Eski Fiyat: Üstü çizili (fiyat * 1.05)

**Kargo Bilgileri:**
- Kargo Şirketi: Logo veya isim
- Tahmini Teslim: Yeşil badge, `termin_display` veya `termin`
- Takip Numarası: Mavi badge (şu an gösterilmiyor, sadece UI var)

### Adres Bilgileri

**Teslimat Adresi:**
- Ad Soyad
- Adres detayları (mahalle, ilçe, açıklama, şehir)
- Telefon (maskelenmiş: `555*****67`)

**Fatura Adresi:**
- Teslimat adresiyle aynı bilgiler

### Ödeme Bilgileri

**Gösterilen Bilgiler:**
- Ödeme: "VISA Tek Çekim ****6010" (sabit)
- Ara toplam: `order.total_price`
- Kargo: 400 TL altı için 125 TL, üstü için 0 TL
- Kargo İndirimi: 400 TL ve üzeri için -125 TL gösterilir
- Toplam: KDV dahil toplam fiyat

### Butonlar

**Sipariş Sorusu Sor:**
- Mavi border, mavi text
- Sadece soru sorulmamışsa gösterilir

**Siparişi İptal Et:**
- Kırmızı border, kırmızı text
- Sadece iptal edilebilir durumdaysa gösterilir

**İade Talebi Oluştur:**
- Turuncu border, turuncu text
- Sadece teslim edilmiş ve 14 gün içindeyse gösterilir

**Fatura Görüntüle:**
- Turuncu background (fatura varsa)
- Gri background (fatura yoksa, disabled)
- Fatura URL'i varsa yeni sekmede açar

**Kargo Takip:**
- Gradient turuncu buton
- `brandedTrackingURL`'i yeni sekmede açar

---

## Responsive Tasarım

### Desktop (lg ve üzeri)

**Layout:**
- Sidebar: Sol tarafta, sticky, 208px genişlik
- Ana içerik: Sağ tarafta, flex-1, max-width: 4xl
- Gap: 12px (xl: 16px, 2xl: 24px)

**Header:**
- Geri butonu + Başlık (tek satır)

**Sipariş Özeti:**
- Flex layout, yatay düzen

**Ürün Kartı:**
- Flex row layout
- Ürün bilgileri ve kargo bilgileri yan yana

**Adres ve Ödeme:**
- Grid 3 sütun

### Mobil (sm ve altı)

**Layout:**
- Sidebar: Overlay modal (soldan açılır, 320px genişlik)
- Ana içerik: Tam genişlik
- Hamburger menü butonu gösterilir

**Header:**
- Geri + Başlık + Menü butonu (tek satır, border ile çevrili)

**Sipariş Özeti:**
- Grid 2 sütun layout

**Ürün Kartı:**
- Flex column layout
- Ürün bilgileri ve kargo bilgileri alt alta

**Adres ve Ödeme:**
- Grid 1 sütun (alt alta)

**Butonlar:**
- Tam genişlik (mobilde)
- Alt alta dizilir

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
  setError('Sipariş detayları yüklenirken bir hata oluştu');
} finally {
  setLoading(false);
}
```

### Form Validasyonu

**Sipariş Sorusu:**
```typescript
if (!newOrderQuestion.question.trim()) {
  toast.error('Lütfen bir soru yazın');
  return;
}

if (!newOrderQuestion.topic.trim()) {
  toast.error('Lütfen bir konu seçin');
  return;
}
```

**Sipariş İptal:**
```typescript
if (!cancelReason.trim()) {
  toast.error('Lütfen iptal sebebini yazın');
  return;
}
```

**İade Talebi:**
```typescript
if (!returnReason.trim()) {
  toast.error('Lütfen iade sebebini yazın');
  return;
}
```

### Hata Gösterimi

**Loading State:**
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  );
}
```

**Error State:**
```tsx
if (error || !order) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || 'Sipariş bulunamadı'}</p>
        <button
          onClick={() => router.push('/hesabim/siparislerim')}
          className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
        >
          Siparişlerime Dön
        </button>
      </div>
    </div>
  );
}
```

### Toast Bildirimleri

**Başarı:**
- `toast.success('Sipariş sorunuz başarıyla gönderildi')`
- `toast.success('Sipariş grubu başarıyla iptal edildi')`
- `toast.success('İade talebi başarıyla oluşturuldu')`

**Hata:**
- `toast.error('Lütfen bir soru yazın')`
- `toast.error('Sipariş grubu numarası bulunamadı')`
- `toast.error('Fatura henüz hazır değil. Lütfen daha sonra tekrar deneyin.')`

---

## Kullanılan Kütüphaneler

### React & Next.js
- `react` - React kütüphanesi
- `next/navigation` - Next.js navigation hooks (`useRouter`)
- `next/link` - Next.js Link bileşeni
- `next/image` - Next.js Image bileşeni

### Heroicons
- `@heroicons/react/24/outline` - Outline ikonlar

**Kullanılan İkonlar:**
- `ShoppingBagIcon` - Sipariş ikonu
- `ArrowLeftIcon` - Geri butonu
- `Bars3Icon` - Hamburger menü
- `XMarkIcon` - Kapat butonu
- `ChatBubbleLeftIcon` - Sipariş sorusu ikonu

### Diğer Bileşenler
- `Header` - Site header'ı
- `Footer` - Site footer'ı
- `ScrollToTop` - Scroll to top butonu
- `AccountSidebar` - Hesap menü sidebar'ı

### Utilities
- `createProductUrl` - Ürün URL'i oluşturma fonksiyonu
- `formatDate` - Tarih formatlama fonksiyonu
- `formatPrice` - Fiyat formatlama fonksiyonu
- `API_V1_URL` - API base URL'i
- `toast` (react-hot-toast) - Toast bildirimleri

---

## Önemli Notlar

### 1. Sipariş Numarası
- URL'deki `siparis_no` parametresi kullanılır
- Sipariş detaylarında `ogid` veya `order_number` gösterilir
- Fallback olarak `order_id`'nin son 6 karakteri kullanılır

### 2. Sipariş Grupları
- Bir sipariş birden fazla sipariş grubuna sahip olabilir
- Her grup farklı bir satıcıya ait olabilir
- Her grup için ayrı durum, kargo takip, fatura bilgisi olabilir

### 3. Ürün Detayları
- Her ürün için ayrı API çağrısı yapılır
- Ürün detayları cache'lenir (`productDetails` state'inde)
- Satıcı, marka, kargo şirketi ve termin bilgileri ürün detayından alınır

### 4. Kargo Takip
- `activity` dizisindeki ilk elemanın `brandedTrackingURL`'i kullanılır
- Kargo takip butonu sadece `brandedTrackingURL` varsa gösterilir
- Yeni sekmede açılır

### 5. Fatura
- Fatura bilgisi `order_groups[0].invoice_info` içinde bulunur
- Fatura URL'i varsa buton aktif, yoksa disabled
- Yeni sekmede açılır

### 6. Telefon Maskesi
- Telefon numarası maskelenir: `5551234567` → `555*****67`
- Regex: `/(\d{3})(\d{3})(\d{2})(\d{2})/`

### 7. Kargo Ücreti
- 400 TL altı siparişler için: 125 TL
- 400 TL ve üzeri siparişler için: 0 TL (ücretsiz)
- İndirim gösterimi: "-125,00 TL" (turuncu renk)

### 8. İade Süresi
- Teslim edildikten sonra 14 gün içinde iade talebi oluşturulabilir
- Gün hesaplaması: `Math.floor((currentDate - orderDate) / (1000 * 60 * 60 * 24))`

### 9. Sipariş Durumları
- İptal edilebilir: `pending`, `searchingDriver`, `in_progress`
- İade edilebilir: `delivered` (14 gün içinde)

### 10. FormData Kullanımı
- İade talebi oluştururken FormData kullanılır
- Dosya eklenebilir (şu an boş string gönderiliyor)
- `Content-Type` header'ı belirtilmez (FormData otomatik ekler)

---

## Geliştirme Notları

### Potansiyel İyileştirmeler

1. **Mağaza Takip Etme:** Mağaza takip etme/bırakma fonksiyonları implement edilmeli
2. **Dosya Yükleme:** İade talebinde dosya yükleme özelliği aktif edilmeli
3. **Kargo Takip Numarası:** Takip numarası gösterimi aktif edilmeli
4. **Sipariş Güncellemeleri:** Real-time sipariş durumu güncellemeleri
5. **Bildirimler:** Sipariş durumu değişikliklerinde bildirim
6. **Sipariş Geçmişi:** Sipariş durumu geçmişi gösterimi
7. **Ürün Değerlendirme:** Ürün değerlendirme özelliği eklenebilir
8. **Sipariş Paylaşma:** Siparişi paylaşma özelliği
9. **Fatura İndirme:** Fatura indirme özelliği
10. **Sipariş Yazdırma:** Sipariş detaylarını yazdırma

---

## Son Güncelleme

**Tarih:** 2024
**Versiyon:** 1.0
**Dosya:** `SIPARIS_DETAY_SAYFASI.md`

---

## İletişim ve Destek

Sorularınız veya önerileriniz için lütfen geliştirme ekibiyle iletişime geçin.

