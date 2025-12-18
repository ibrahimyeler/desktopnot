# Hesabım - Satıcı Mesajlarım: Ürün Sorularım ve Sipariş Sorularım Endpoint'leri

Bu dokümantasyon, Hesabım sayfasındaki "Satıcı Mesajlarım" bölümünde bulunan "Ürün Sorularım" ve "Sipariş Sorularım" kısmının kullandığı endpoint'leri ve çalışma mantığını açıklamaktadır.

---

## 📋 İçindekiler 

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı](#sayfa-yapısı)
3. [Ürün Sorularım Endpoint'leri](#ürün-sorularım-endpointleri)
4. [Sipariş Sorularım Endpoint'leri](#sipariş-sorularım-endpointleri)
5. [Veri Yapıları](#veri-yapıları)
6. [Kullanım Örnekleri](#kullanım-örnekleri)
7. [Akış Diyagramları](#akış-diyagramları)

---

## 🔍 Genel Bakış

**Sayfa:** `/hesabim/mesajlarim`

**Component:** `components/account/Messages.tsx`

**Açıklama:** Kullanıcının ürünler ve siparişler hakkında sorduğu soruları ve satıcıların verdiği cevapları görüntüleme sayfası

**Özellikler:**
- İki sekme: "Ürün Sorularım" ve "Sipariş Sorularım"
- Soru listeleme
- Soru ekleme
- Soru silme
- Okunmamış soru sayısı gösterimi
- Responsive tasarım

**Base URL:** `https://api.trendruum.com/api/v1`

**Authentication:** Bearer Token (JWT) - Tüm endpoint'ler auth gerektirir

---

## 📄 Sayfa Yapısı

### Component Hiyerarşisi

```
app/hesabim/mesajlarim/
├── page.tsx (Server Component)
└── MessagesPageClient.tsx (Client Component)
    └── components/account/Messages.tsx (Ana Component)
```

### Tab Yapısı

1. **Ürün Sorularım** (`activeTab === 'product-questions'`)
   - Kullanıcının ürünler hakkında sorduğu sorular
   - Ürün resmi, adı, sorusu ve cevabı gösterilir

2. **Sipariş Sorularım** (`activeTab === 'order-questions'`)
   - Kullanıcının siparişler hakkında sorduğu sorular
   - Sipariş numarası, konu, sorusu ve cevabı gösterilir

---

## 📦 Ürün Sorularım Endpoint'leri

### 1. Ürün Sorularını Listeleme

**Endpoint:** `GET /api/v1/customer/questions/user-product-question`

**Açıklama:** Kullanıcının tüm ürün sorularını getirir

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Questions retrieved successfully",
    "code": 200
  },
  "data": [
    {
      "id": "question-id-1",
      "product_id": "product-id-1",
      "product": {
        "id": "product-id-1",
        "name": "Ürün Adı",
        "slug": "urun-adi",
        "medias": [
          {
            "url": "https://example.com/image.jpg",
            "type": "image"
          }
        ],
        "images": [
          {
            "url": "https://example.com/image.jpg"
          }
        ]
      },
      "question": "Bu ürün kaliteli mi?",
      "answer": "Evet, bu ürün çok kaliteli ve müşterilerimiz tarafından beğeniliyor.",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T11:00:00.000Z"
    },
    {
      "id": "question-id-2",
      "product_id": "product-id-2",
      "product": {
        "id": "product-id-2",
        "name": "Başka Ürün",
        "slug": "baska-urun",
        "medias": [
          {
            "url": "https://example.com/image2.jpg"
          }
        ]
      },
      "question": "Kargo ne kadar sürer?",
      "answer": null,
      "created_at": "2024-01-02T14:30:00.000Z",
      "updated_at": "2024-01-02T14:30:00.000Z"
    }
  ]
}
```

**Kod Örneği:**
```typescript
const fetchQuestions = useCallback(async () => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      setQuestions([]);
      return;
    }

    const response = await fetch(`${API_V1_URL}/customer/questions/user-product-question`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.meta?.status === 'success' && data.data) {
      // Sadece ürün sorularını al (order field'ı olmayan)
      const transformedQuestions = data.data
        .filter((item: any) => !item.order) // Sadece order field'ı olmayan veriler
        .map((item: any) => {
          return {
            id: item.id,
            product_id: item.product_id,
            product_name: item.product?.name || 'Ürün Adı',
            product_image: getProductImage(item.product), // Resim URL'ini bul
            product_slug: item.product?.slug,
            question: item.question,
            answer: item.answer,
            status: item.answer ? 'answered' : 'pending',
            created_at: item.created_at,
            updated_at: item.updated_at
          };
        });

      setQuestions(transformedQuestions);
    }
  } catch (err) {
    toast.error('Sorular yüklenirken bir hata oluştu');
  } finally {
    setLoading(false);
  }
}, []);
```

**Veri Dönüşümü:**
- API'den gelen veriler filtrelenir (sadece `order` field'ı olmayanlar)
- Ürün resmi farklı yollardan alınır (`medias.url`, `medias[0].url`, `image`)
- Status belirlenir: `answer` varsa `'answered'`, yoksa `'pending'`

---

### 2. Yeni Ürün Sorusu Ekleme

**Endpoint:** `POST /api/v1/customer/questions/user-product-question`

**Açıklama:** Yeni bir ürün sorusu oluşturur

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
  "question": "Bu ürün kaliteli mi?",
  "product_id": "product-id-123"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Question created successfully",
    "code": 200
  },
  "data": {
    "id": "new-question-id",
    "product_id": "product-id-123",
    "question": "Bu ürün kaliteli mi?",
    "answer": null,
    "created_at": "2024-01-03T10:00:00.000Z",
    "updated_at": "2024-01-03T10:00:00.000Z"
  }
}
```

**Kod Örneği:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newQuestion.question.trim()) {
    toast.error('Lütfen bir soru yazın');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }

    const response = await fetch(`${API_V1_URL}/customer/questions/user-product-question`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: newQuestion.question.trim(),
        product_id: newQuestion.product_id || '686e78ddd00eac51fe0d61db' // Gerçek product ID
      })
    });

    const data = await response.json();

    if (data.meta?.status === 'success') {
      toast.success('Sorunuz başarıyla eklendi');
      setNewQuestion({
        product_id: '',
        product_name: '',
        product_image: '',
        question: ''
      });
      fetchQuestions(); // Listeyi yenile
    } else {
      toast.error(data.meta?.message || 'Soru eklenirken bir hata oluştu');
    }
  } catch (err) {
    toast.error('Soru eklenirken bir hata oluştu');
  }
};
```

**Validasyonlar:**
- `question` alanı boş olamaz
- Token zorunlu

**Not:** Bu endpoint Messages component'inde kullanılmıyor, sadece ürün detay sayfasından (`AskQuestionModal`) kullanılıyor.

---

### 3. Ürün Sorusunu Silme

**Endpoint:** `DELETE /api/v1/customer/questions/user-product-question/{id}`

**Açıklama:** Bir ürün sorusunu siler

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**URL Parametreleri:**
- `{id}`: Soru ID'si

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Question deleted successfully",
    "code": 200
  }
}
```

**Kod Örneği:**
```typescript
const confirmDelete = async () => {
  const { type, id } = deleteModal;
  
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      closeDeleteModal();
      return;
    }

    const endpoint = type === 'product' 
      ? `${API_V1_URL}/customer/questions/user-product-question/${id}`
      : `${API_V1_URL}/customer/questions/user-order-question/${id}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.meta?.status === 'success') {
      toast.success('Sorunuz başarıyla silindi');
      if (type === 'product') {
        fetchQuestions(); // Ürün sorularını yenile
      } else {
        fetchOrderQuestions(); // Sipariş sorularını yenile
      }
    } else {
      toast.error(data.meta?.message || 'Soru silinirken bir hata oluştu');
    }
  } catch (err) {
    toast.error('Soru silinirken bir hata oluştu');
  } finally {
    closeDeleteModal();
  }
};
```

**Silme Onay Modal'ı:**
- Kullanıcı silme işlemini onaylamalı
- Modal'da soru başlığı gösterilir
- "Bu işlem geri alınamaz" uyarısı verilir

---

## 📦 Sipariş Sorularım Endpoint'leri

### 1. Sipariş Sorularını Listeleme

**Endpoint:** `GET /api/v1/customer/questions/user-order-question`

**Açıklama:** Kullanıcının tüm sipariş sorularını getirir

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Order questions retrieved successfully",
    "code": 200
  },
  "data": [
    {
      "id": "order-question-id-1",
      "order_id": "order-group-id-1",
      "order": {
        "order_group_id": "order-group-id-1",
        "product": {
          "name": "Ürün Adı",
          "medias": [
            {
              "url": "https://example.com/image.jpg"
            }
          ]
        },
        "products": [
          {
            "name": "Ürün Adı",
            "medias": [
              {
                "url": "https://example.com/image.jpg"
              }
            ]
          }
        ]
      },
      "product": {
        "name": "Ürün Adı",
        "medias": [
          {
            "url": "https://example.com/image.jpg"
          }
        ]
      },
      "question": "Kargo ne zaman gelir?",
      "answer": "Siparişiniz yarın teslim edilecektir.",
      "topic": "delivery_status",
      "created_at": "2024-01-01T10:00:00.000Z",
      "updated_at": "2024-01-01T11:00:00.000Z"
    },
    {
      "id": "order-question-id-2",
      "order_id": "order-group-id-2",
      "order": {
        "order_group_id": "order-group-id-2"
      },
      "question": "Fatura talep ediyorum",
      "answer": null,
      "topic": "invoice_request",
      "created_at": "2024-01-02T14:30:00.000Z",
      "updated_at": "2024-01-02T14:30:00.000Z"
    }
  ]
}
```

**Kod Örneği:**
```typescript
const fetchOrderQuestions = useCallback(async () => {
  try {
    setOrderQuestionsLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      setOrderQuestions([]);
      return;
    }

    const response = await fetch(`${API_V1_URL}/customer/questions/user-order-question`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    if (data.meta?.status === 'success' && data.data) {
      // Sadece sipariş sorularını al (order field'ı olan)
      // Eğer order field'ı olan veri yoksa, tüm veriyi sipariş sorusu olarak kabul et
      const orderQuestionsData = data.data.filter((item: any) => item.order).length > 0 
        ? data.data.filter((item: any) => item.order)
        : data.data; // Eğer order field'ı yoksa tüm veriyi kullan

      const transformedOrderQuestions = orderQuestionsData
        .map((item: any) => {
          // Ürün resmi için farklı yolları dene
          let productImage = '/placeholder-product.jpg';
          
          if (item.product?.medias?.url) {
            productImage = item.product.medias.url;
          } else if (item.product?.medias?.[0]?.url) {
            productImage = item.product.medias[0].url;
          } else if (item.product?.image) {
            productImage = item.product.image;
          } else if (item.order?.product?.medias?.url) {
            productImage = item.order.product.medias.url;
          } else if (item.order?.products?.[0]?.medias?.[0]?.url) {
            productImage = item.order.products[0].medias[0].url;
          }

          return {
            id: item.id,
            order_id: item.order?.order_group_id || item.order_id,
            order_number: item.order?.order_group_id?.slice(-6) || item.order_id?.slice(-6) || 'N/A',
            question: item.question,
            answer: item.answer,
            status: item.answer ? 'answered' : 'pending',
            created_at: item.created_at,
            updated_at: item.updated_at,
            topic: item.topic,
            product_name: item.product?.name || item.order?.product?.name || item.order?.products?.[0]?.name || 'Sipariş Ürünü',
            product_image: productImage
          };
        });

      setOrderQuestions(transformedOrderQuestions);
    }
  } catch (err) {
    toast.error('Sipariş soruları yüklenirken bir hata oluştu');
  } finally {
    setOrderQuestionsLoading(false);
  }
}, []);
```

**Veri Dönüşümü:**
- API'den gelen veriler filtrelenir (sadece `order` field'ı olanlar)
- Eğer `order` field'ı olan veri yoksa, tüm veri sipariş sorusu olarak kabul edilir
- Ürün resmi farklı yollardan alınır (product, order.product, order.products)
- Sipariş numarası `order_group_id`'nin son 6 karakteri olarak alınır
- Status belirlenir: `answer` varsa `'answered'`, yoksa `'pending'`

---

### 2. Yeni Sipariş Sorusu Ekleme

**Endpoint:** `POST /api/v1/customer/questions/user-order-question`

**Açıklama:** Yeni bir sipariş sorusu oluşturur

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
  "question": "Kargo ne zaman gelir?",
  "order_group_id": "order-group-id-123",
  "topic": "delivery_status"
}
```

**Topic Değerleri:**
- `invoice_request` - Fatura Talebi
- `delivery_status` - Teslimat Durumu
- `personalized_product` - Kişiselleştirilmiş Ürün
- `order_cancellation` - Sipariş İptali
- `missing_product` - Eksik Ürün
- `damaged_product_request` - Kusurlu Ürün
- `wrong_product_request` - Yanlış Ürün
- `warranty_request` - Garanti Talebi
- `gift_box_request` - Hediye Paketi
- `setup_request` - Kurulum Belgesi
- `corporate_invoice_request` - Kurumsal Fatura
- `order_question` - Sipariş Sorusu
- `shipping` - Kargo
- `payment` - Ödeme
- `refund` - İade

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Order question created successfully",
    "code": 200
  },
  "data": {
    "id": "new-order-question-id",
    "order_id": "order-group-id-123",
    "question": "Kargo ne zaman gelir?",
    "answer": null,
    "topic": "delivery_status",
    "created_at": "2024-01-03T10:00:00.000Z",
    "updated_at": "2024-01-03T10:00:00.000Z"
  }
}
```

**Kod Örneği:**
```typescript
const handleSubmitOrderQuestion = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!newOrderQuestion.question.trim()) {
    toast.error('Lütfen bir soru yazın');
    return;
  }

  if (!newOrderQuestion.order_group_id.trim()) {
    toast.error('Lütfen sipariş numarası girin');
    return;
  }

  if (!newOrderQuestion.topic.trim()) {
    toast.error('Lütfen bir konu seçin');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
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
        order_group_id: newOrderQuestion.order_group_id.trim(),
        topic: newOrderQuestion.topic.trim()
      })
    });

    const data = await response.json();

    if (data.meta?.status === 'success') {
      toast.success('Sipariş sorunuz başarıyla eklendi');
      setNewOrderQuestion({
        order_group_id: '',
        order_number: '',
        question: '',
        topic: ''
      });
      fetchOrderQuestions(); // Listeyi yenile
    } else {
      toast.error(data.meta?.message || 'Sipariş sorusu eklenirken bir hata oluştu');
    }
  } catch (err) {
    toast.error('Sipariş sorusu eklenirken bir hata oluştu');
  }
};
```

**Validasyonlar:**
- `question` alanı boş olamaz
- `order_group_id` alanı boş olamaz
- `topic` alanı boş olamaz
- Token zorunlu

**Not:** Bu endpoint Messages component'inde kullanılmıyor, sadece sipariş detay sayfasından (`OrderDetailPageClient`) kullanılıyor.

---

### 3. Sipariş Sorusunu Silme

**Endpoint:** `DELETE /api/v1/customer/questions/user-order-question/{id}`

**Açıklama:** Bir sipariş sorusunu siler

**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**URL Parametreleri:**
- `{id}`: Soru ID'si

**Response (Başarılı):**
```json
{
  "meta": {
    "status": "success",
    "message": "Order question deleted successfully",
    "code": 200
  }
}
```

**Kod Örneği:**
```typescript
// Aynı confirmDelete fonksiyonu kullanılır, sadece endpoint değişir
const endpoint = type === 'product' 
  ? `${API_V1_URL}/customer/questions/user-product-question/${id}`
  : `${API_V1_URL}/customer/questions/user-order-question/${id}`;
```

---

## 📊 Veri Yapıları

### ProductQuestion Interface

```typescript
interface ProductQuestion {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  product_slug?: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  created_at: string;
  updated_at: string;
  topic?: string;
}
```

### OrderQuestion Interface

```typescript
interface OrderQuestion {
  id: string;
  order_id: string;
  order_number: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered' | 'rejected';
  created_at: string;
  updated_at: string;
  topic?: string;
  product_name?: string;
  product_image?: string;
}
```

---

## 🎯 Kullanım Örnekleri

### 1. Sayfa İlk Yüklendiğinde

**Component:** `components/account/Messages.tsx`

**Kod:**
```typescript
useEffect(() => {
  fetchQuestions(); // Ürün sorularını yükle
  fetchOrderQuestions(); // Sipariş sorularını yükle
}, [fetchQuestions, fetchOrderQuestions]);
```

**Açıklama:** Sayfa yüklendiğinde her iki tab'ın verileri de yüklenir (kullanıcı hangi tab'ı seçerse seçsin veriler hazır olur)

---

### 2. Tab Değiştirme

**Kod:**
```typescript
const [activeTab, setActiveTab] = useState('product-questions');

// Tab değiştirme
<button
  onClick={() => setActiveTab('product-questions')}
  className={activeTab === 'product-questions' ? 'active' : ''}
>
  Ürün Sorularım
  <span>({unreadProductCount} Okunmamış Soru)</span>
</button>

<button
  onClick={() => setActiveTab('order-questions')}
  className={activeTab === 'order-questions' ? 'active' : ''}
>
  Sipariş Sorularım
  <span>({unreadOrderCount} Okunmamış Mesaj)</span>
</button>
```

**Özellikler:**
- Tab değiştirildiğinde loading state sıfırlanır
- Okunmamış soru sayısı gösterilir
- Responsive tasarım (mobilde scrollable tabs)

---

### 3. Okunmamış Soru Sayısı Hesaplama

**Kod:**
```typescript
const unreadProductCount = useMemo(() => {
  const unreadQuestions = questions.filter(question => 
    question.status === 'pending' || !question.answer
  );
  return unreadQuestions.length;
}, [questions]);

const unreadOrderCount = useMemo(() => {
  const unreadQuestions = orderQuestions.filter(question => 
    question.status === 'pending' || !question.answer
  );
  return unreadQuestions.length;
}, [orderQuestions]);
```

**Mantık:**
- `status === 'pending'` olan sorular okunmamış sayılır
- `answer` field'ı `null` veya `undefined` olan sorular okunmamış sayılır

---

### 4. Ürün Resmi Bulma

**Fonksiyon:** `getProductImage(product: any): string`

**Kod:**
```typescript
const getProductImage = (product: any): string => {
  if (!product) return '/placeholder-product.jpg';
  
  // 1. Direkt medias.url varsa
  if (product.medias?.url) {
    return product.medias.url;
  }
  
  // 2. medias array ise
  if (product.medias && Array.isArray(product.medias) && product.medias.length > 0) {
    return product.medias[0]?.url || '/placeholder-product.jpg';
  }
  
  // 3. medias object ise (numbered keys)
  if (product.medias && typeof product.medias === 'object') {
    const mediaKeys = Object.keys(product.medias).filter(key => 
      /^\d+$/.test(key) && product.medias[key]?.url
    );
    if (mediaKeys.length > 0) {
      return product.medias[mediaKeys[0]].url;
    }
  }
  
  // 4. image field varsa
  if (product.image) {
    return product.image;
  }
  
  return '/placeholder-product.jpg';
};
```

**Öncelik Sırası:**
1. `product.medias.url`
2. `product.medias[0].url`
3. `product.medias[numberedKey].url`
4. `product.image`
5. Placeholder image

---

### 5. Soru Silme Modal'ı

**Kod:**
```typescript
const [deleteModal, setDeleteModal] = useState<{
  isOpen: boolean;
  type: 'product' | 'order';
  id: string;
  title: string;
}>({
  isOpen: false,
  type: 'product',
  id: '',
  title: ''
});

const openDeleteModal = (type: 'product' | 'order', id: string, title: string) => {
  setDeleteModal({
    isOpen: true,
    type,
    id,
    title
  });
};

const closeDeleteModal = () => {
  setDeleteModal({
    isOpen: false,
    type: 'product',
    id: '',
    title: ''
  });
};
```

**Modal İçeriği:**
- Soru başlığı gösterilir
- "Bu işlem geri alınamaz" uyarısı
- İptal ve Sil butonları

---

## 🔄 Akış Diyagramları

### Ürün Sorularını Yükleme Akışı

```
Sayfa yüklendiğinde
    ↓
fetchQuestions() çağrılır
    ↓
Token localStorage'dan alınır
    ↓
GET /customer/questions/user-product-question
    ↓
Response parse edilir
    ↓
Veriler filtrelenir (order field'ı olmayanlar)
    ↓
Veriler transform edilir (product_image, status vb.)
    ↓
State güncellenir (setQuestions)
    ↓
UI render edilir
```

### Sipariş Sorularını Yükleme Akışı

```
Sayfa yüklendiğinde
    ↓
fetchOrderQuestions() çağrılır
    ↓
Token localStorage'dan alınır
    ↓
GET /customer/questions/user-order-question
    ↓
Response parse edilir
    ↓
Veriler filtrelenir (order field'ı olanlar)
    ↓
Veriler transform edilir (order_number, product_image, status vb.)
    ↓
State güncellenir (setOrderQuestions)
    ↓
UI render edilir
```

### Soru Silme Akışı

```
Kullanıcı silme butonuna tıklar
    ↓
openDeleteModal() çağrılır
    ↓
Modal açılır (onay beklenir)
    ↓
Kullanıcı "Sil" butonuna tıklar
    ↓
confirmDelete() çağrılır
    ↓
Token localStorage'dan alınır
    ↓
DELETE /customer/questions/user-product-question/{id}
veya
DELETE /customer/questions/user-order-question/{id}
    ↓
Response kontrol edilir
    ↓
Başarılı ise:
    - Toast mesajı gösterilir
    - İlgili liste yenilenir (fetchQuestions veya fetchOrderQuestions)
    - Modal kapanır
```

---

## 📱 UI Özellikleri

### 1. Tab Gösterimi

**Desktop:**
- Yatay tab'lar
- Aktif tab altında border
- Okunmamış soru sayısı gösterilir

**Mobile:**
- Scrollable tab'lar
- Dikey düzen (tab adı ve sayı alt alta)
- Touch scroll desteği

### 2. Soru Kartları

**Ürün Soruları:**
- Ürün resmi (sol tarafta)
- Ürün adı (link olarak, ürün sayfasına yönlendirir)
- Soru metni (beyaz arka plan)
- Cevap varsa (turuncu arka plan, "Satıcı Yanıtı" etiketi)
- Silme butonu (sağ üstte)
- Tarih bilgisi

**Sipariş Soruları:**
- Ürün resmi (sol tarafta)
- Ürün adı
- Sipariş numarası (mavi badge)
- Konu etiketi (turuncu badge)
- Soru metni
- Cevap varsa (turuncu arka plan)
- Silme butonu
- Tarih bilgisi

### 3. Boş Durum

**Ürün Soruları Boş:**
- Chat icon
- "Henüz sorunuz bulunmuyor" mesajı
- "Alışverişe Başla" butonu (ana sayfaya yönlendirir)

**Sipariş Soruları Boş:**
- Chat icon
- "Henüz sipariş sorunuz bulunmuyor" mesajı
- "Siparişlerimi Görüntüle" butonu (siparişler sayfasına yönlendirir)

### 4. Loading State

- Skeleton loader gösterilir
- Pulse animasyonu
- Loading sırasında içerik gösterilmez

---

## 🎨 Topic Etiketleri

Sipariş sorularında kullanılan topic değerleri ve Türkçe karşılıkları:

| Topic Değeri | Türkçe Karşılığı |
|--------------|------------------|
| `invoice_request` | Fatura Talebi |
| `delivery_status` | Teslimat Durumu |
| `personalized_product` | Kişiselleştirilmiş Ürün |
| `order_cancellation` | Sipariş İptali |
| `missing_product` | Eksik Ürün |
| `damaged_product_request` | Kusurlu Ürün |
| `wrong_product_request` | Yanlış Ürün |
| `warranty_request` | Garanti Talebi |
| `gift_box_request` | Hediye Paketi |
| `setup_request` | Kurulum Belgesi |
| `corporate_invoice_request` | Kurumsal Fatura |
| `order_question` | Sipariş Sorusu |
| `shipping` | Kargo |
| `payment` | Ödeme |
| `refund` | İade |

**Kod:**
```typescript
{question.topic && (
  <span className="inline-block px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded-full border border-orange-200">
    {question.topic === 'invoice_request' ? 'Fatura Talebi' :
     question.topic === 'delivery_status' ? 'Teslimat Durumu' :
     question.topic === 'personalized_product' ? 'Kişiselleştirilmiş Ürün' :
     question.topic === 'order_cancellation' ? 'Sipariş İptali' :
     question.topic === 'missing_product' ? 'Eksik Ürün' :
     question.topic === 'damaged_product_request' ? 'Kusurlu Ürün' :
     question.topic === 'wrong_product_request' ? 'Yanlış Ürün' :
     question.topic === 'warranty_request' ? 'Garanti Talebi' :
     question.topic === 'gift_box_request' ? 'Hediye Paketi' :
     question.topic === 'setup_request' ? 'Kurulum Belgesi' :
     question.topic === 'corporate_invoice_request' ? 'Kurumsal Fatura' :
     question.topic === 'order_question' ? 'Sipariş Sorusu' :
     question.topic === 'shipping' ? 'Kargo' :
     question.topic === 'payment' ? 'Ödeme' :
     question.topic === 'refund' ? 'İade' :
     'Diğer'}
  </span>
)}
```

---

## 🔍 Veri Filtreleme ve Dönüşüm

### Ürün Soruları Filtreleme

**Mantık:** Sadece `order` field'ı olmayan veriler ürün sorusu olarak kabul edilir

```typescript
const transformedQuestions = data.data
  .filter((item: any) => !item.order) // Sadece order field'ı olmayan veriler
  .map((item: any) => {
    // Transform işlemleri
  });
```

### Sipariş Soruları Filtreleme

**Mantık:** `order` field'ı olan veriler sipariş sorusu olarak kabul edilir. Eğer hiç `order` field'ı olan veri yoksa, tüm veri sipariş sorusu olarak kabul edilir.

```typescript
const orderQuestionsData = data.data.filter((item: any) => item.order).length > 0 
  ? data.data.filter((item: any) => item.order)
  : data.data; // Eğer order field'ı yoksa tüm veriyi kullan
```

---

## 🐛 Hata Yönetimi

### 1. API Hatası

**Durum:** API'den hata döner veya network hatası oluşur

**Çözüm:**
- Toast mesajı gösterilir
- Mock data gösterilir (development için)
- Loading state kapatılır

**Kod:**
```typescript
catch (err) {
  toast.error('Sorular yüklenirken bir hata oluştu');
  // Mock data göster (sadece development için)
  setQuestions([...mockData]);
} finally {
  setLoading(false);
}
```

### 2. Token Yok

**Durum:** Token localStorage'da yok

**Çözüm:**
- Boş array set edilir
- Kullanıcı giriş sayfasına yönlendirilebilir

**Kod:**
```typescript
const token = localStorage.getItem('token');

if (!token) {
  setQuestions([]);
  return;
}
```

### 3. Boş Response

**Durum:** API başarılı döner ama `data` boş veya `null`

**Çözüm:**
- Boş durum UI'ı gösterilir
- "Henüz sorunuz bulunmuyor" mesajı

---

## 📊 Endpoint Özet Tablosu

| Endpoint | Method | Auth | Açıklama | Kullanım Yeri |
|----------|--------|------|----------|---------------|
| `/customer/questions/user-product-question` | GET | ✅ | Ürün sorularını listele | Messages component |
| `/customer/questions/user-product-question` | POST | ✅ | Yeni ürün sorusu ekle | AskQuestionModal (ürün detay sayfası) |
| `/customer/questions/user-product-question/{id}` | DELETE | ✅ | Ürün sorusunu sil | Messages component |
| `/customer/questions/user-order-question` | GET | ✅ | Sipariş sorularını listele | Messages component |
| `/customer/questions/user-order-question` | POST | ✅ | Yeni sipariş sorusu ekle | OrderDetailPageClient |
| `/customer/questions/user-order-question/{id}` | DELETE | ✅ | Sipariş sorusunu sil | Messages component |

**Toplam Endpoint Sayısı:** 6

**Auth Gerektiren Endpoint:** 6 (Tümü)

---

## 🔄 State Yönetimi

### State'ler

```typescript
const [activeTab, setActiveTab] = useState('product-questions');
const [questions, setQuestions] = useState<ProductQuestion[]>([]);
const [orderQuestions, setOrderQuestions] = useState<OrderQuestion[]>([]);
const [loading, setLoading] = useState(false);
const [orderQuestionsLoading, setOrderQuestionsLoading] = useState(false);
const [deleteModal, setDeleteModal] = useState<{
  isOpen: boolean;
  type: 'product' | 'order';
  id: string;
  title: string;
}>({
  isOpen: false,
  type: 'product',
  id: '',
  title: ''
});
```

### useMemo ile Hesaplanan Değerler

```typescript
const unreadProductCount = useMemo(() => {
  return questions.filter(question => 
    question.status === 'pending' || !question.answer
  ).length;
}, [questions]);

const unreadOrderCount = useMemo(() => {
  return orderQuestions.filter(question => 
    question.status === 'pending' || !question.answer
  ).length;
}, [orderQuestions]);
```

---

## 🎯 Özellikler

### 1. Çift Tab Yapısı

- Ürün Sorularım
- Sipariş Sorularım
- Her tab'ın kendi state'i ve loading durumu var
- Tab değiştirildiğinde loading state sıfırlanır

### 2. Okunmamış Soru Sayısı

- Her tab'da okunmamış soru sayısı gösterilir
- `useMemo` ile performanslı hesaplanır
- `status === 'pending'` veya `answer === null` olan sorular okunmamış sayılır

### 3. Soru Silme

- Her soru için silme butonu
- Onay modal'ı ile güvenli silme
- Silme sonrası liste otomatik yenilenir

### 4. Ürün Resmi Bulma

- Farklı API response formatları için esnek resim bulma
- Fallback mekanizması (placeholder image)
- Hata durumunda resim gizlenir

### 5. Responsive Tasarım

- Desktop: Yatay tab'lar, geniş kartlar
- Mobile: Scrollable tab'lar, kompakt kartlar
- Touch-friendly butonlar

---

## 📝 Notlar

1. **Veri Filtreleme:** API'den gelen veriler `order` field'ına göre filtrelenir
2. **Mock Data:** Development için API hatası durumunda mock data gösterilir
3. **Resim Bulma:** Ürün resimleri farklı yollardan alınır (medias, images, image field'ları)
4. **Status Belirleme:** `answer` field'ı varsa `'answered'`, yoksa `'pending'`
5. **Sipariş Numarası:** `order_group_id`'nin son 6 karakteri gösterilir
6. **Topic Etiketleri:** Sipariş sorularında topic'e göre renkli etiket gösterilir
7. **Silme Onayı:** Silme işlemi için modal ile onay istenir
8. **Auto Refresh:** Silme sonrası liste otomatik yenilenir

---

## 🚀 İyileştirme Önerileri

1. **Pagination:** Çok sayıda soru için sayfalama eklenebilir
2. **Filtreleme:** Tarih, durum, ürün gibi filtreler eklenebilir
3. **Arama:** Soru içeriğinde arama yapılabilir
4. **Sıralama:** Tarihe, duruma göre sıralama yapılabilir
5. **Bildirimler:** Yeni cevap geldiğinde bildirim gösterilebilir
6. **Yeniden Gönderme:** Silinen soruları geri getirme özelliği
7. **Düzenleme:** Soru düzenleme özelliği eklenebilir
8. **Export:** Soruları PDF veya CSV olarak export etme

