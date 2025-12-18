# 📚 Koleksiyonlarım Sayfası - Detaylı Dokümantasyon

Bu dokümantasyon, "Koleksiyonlarım" sayfasının nasıl göründüğünü, nasıl çalıştığını ve kullanılan endpoint'leri detaylı olarak açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı ve Görünüm](#sayfa-yapısı-ve-görünüm)
3. [API Endpoint'leri](#api-endpointleri)
4. [Interface'ler ve Veri Yapıları](#interfaceler-ve-veri-yapıları)
5. [Component Yapısı](#component-yapısı)
6. [Akış Diyagramları](#akış-diyagramları)
7. [Kullanım Senaryoları](#kullanım-senaryoları)
8. [Özellikler ve Limitler](#özellikler-ve-limitler)
9. [İlgili Dosyalar](#ilgili-dosyalar)

---

## 🔍 Genel Bakış

**Sayfa URL:** `/hesabim/koleksiyonlarim`

**Açıklama:** Kullanıcıların kendi koleksiyonlarını oluşturduğu, yönettiği ve favori ürünlerini koleksiyonlarına eklediği sayfa. Kullanıcılar bu sayfada koleksiyon oluşturabilir, düzenleyebilir, silebilir ve favori ürünlerini koleksiyonlarına ekleyebilir.

**Önemli Not:** Bu sayfa sadece giriş yapmış kullanıcılar tarafından erişilebilir. Koleksiyonlar, kullanıcıların favori ürünlerini organize etmelerini sağlar.

**Dosya Yapısı:**
- Server Component: `app/hesabim/koleksiyonlarim/page.tsx`
- Client Component: `app/hesabim/koleksiyonlarim/CollectionsPageClient.tsx`
- Component: `app/koleksiyonlar/components/CollectionCard.tsx`
- Component: `components/collections/NewCollectionPopup.tsx`
- Component: `components/collections/CollectionsTabs.tsx`
- Component: `components/collections/EmptyCollections.tsx`
- Component: `components/favorites/FavoritesTabs.tsx`

---

## 📄 Sayfa Yapısı ve Görünüm

### Desktop Görünümü

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Header component)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ← [Geri] 📚 Koleksiyonlarım                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ❤️ Favorilerim | 📚 Koleksiyonlarım                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Koleksiyonlarım (3) [+ Koleksiyon Oluştur]          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ 📁 Alışveriş│  │ 🎁 Hediye    │  │ ❤️ Favoriler │        │
│  │ Listesi     │  │ Koleksiyonu  │  │             │        │
│  │     ...     │  │     ...     │  │     ...     │        │
│  │ [Ürünler]   │  │ [Ürünler]   │  │ [Ürünler]   │        │
│  │ 5 Ürün      │  │ 12 Ürün     │  │ 8 Ürün      │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Görünümü

```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ ← 📚 Koleksiyonlarım ☰      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ❤️ Favorilerim |        │ │
│ │    📚 Koleksiyonlarım    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Koleksiyonlarım (3)     │ │
│ │ [+ Oluştur]             │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 📁 Alışveriş Listesi    │ │
│ │ [5 ürün görseli grid]   │ │
│ │ 5 Ürün                  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🎁 Hediye Koleksiyonu   │ │
│ │ [12 ürün - Swiper]      │ │
│ │ 12 Ürün                 │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### Boş Durum (Koleksiyon Yoksa)

```
┌─────────────────────────────┐
│                             │
│        ┌─────────┐          │
│        │   📚    │          │
│        └─────────┘          │
│                             │
│   Koleksiyonunuz Yok        │
│                             │
│ Koleksiyonları takip edebilir,│
│ sevdiklerinizle paylaşabilirsiniz!│
│                             │
│   [+ Koleksiyon Oluştur]    │
│                             │
└─────────────────────────────┘
```

---

## 🌐 API Endpoint'leri

### 1. Koleksiyonları Getir

**Endpoint:** `GET /api/v1/customer/likes/collections`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections`

**Kullanım Yeri:**
- `CollectionsPageClient.tsx` - `fetchCollections()` fonksiyonu
- `app/koleksiyonlar/koleksiyonlarim/CollectionsPageClient.tsx` - Koleksiyonları listeleme

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "code": 200
  },
  "data": [
    {
      "id": "collection-123",
      "name": "Alışveriş Listesi",
      "description": "Alışveriş Listesi koleksiyonu",
      "user_id": "user-123",
      "products": [],
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Kod Örneği:**
```typescript
const fetchCollections = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await axios.get(`${API_V1_URL}/customer/likes/collections`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.data?.meta?.status === 'success') {
      setCollections(response.data.data || []);
    }
  } catch (error) {
    toast.error('Koleksiyonlar yüklenirken bir hata oluştu');
  } finally {
    setLoading(false);
  }
};
```

**Kullanım Amacı:**
- Kullanıcının tüm koleksiyonlarını listelemek
- Sayfa yüklendiğinde koleksiyonları göstermek
- Koleksiyon sayısını güncellemek

---

### 2. Koleksiyon Oluştur

**Endpoint:** `POST /api/v1/customer/likes/collections`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections`

**Kullanım Yeri:**
- `CollectionsPageClient.tsx` - `handleCreateCollection()` fonksiyonu
- `NewCollectionPopup.tsx` - Yeni koleksiyon oluşturma

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```json
{
  "name": "Alışveriş Listesi",
  "description": "Alışveriş Listesi koleksiyonu"
}
```

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Koleksiyon başarıyla oluşturuldu"
  },
  "data": {
    "id": "collection-123",
    "name": "Alışveriş Listesi",
    "description": "Alışveriş Listesi koleksiyonu",
    "user_id": "user-123",
    "products": [],
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

**Kod Örneği:**
```typescript
const handleCreateCollection = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Koleksiyon oluşturmak için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    const response = await axios.post(
      `${API_V1_URL}/customer/likes/collections`,
      {
        name: collectionName,
        description: `${collectionName} koleksiyonu`
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.meta?.status === 'success') {
      // Koleksiyonları yeniden yükle
      await fetchCollections();
      setShowNewCollectionPopup(false);
      setCollectionName('');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      router.push('/giris');
    } else {
      toast.error(error.response?.data?.message || 'Koleksiyon oluşturulurken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
};
```

**Önemli Notlar:**
- Kullanıcı giriş yapmış olmalıdır (token gerekli)
- `name` zorunlu alandır
- `description` opsiyoneldir, otomatik olarak `{name} koleksiyonu` formatında oluşturulabilir
- Başarılı oluşturma sonrası liste otomatik yenilenir

---

### 3. Koleksiyon Güncelle

**Endpoint:** `PUT /api/v1/customer/likes/collections/{collectionId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections/{collectionId}`

**Kullanım Yeri:**
- `CollectionsPageClient.tsx` - `handleEditCollection()` fonksiyonu
- `CollectionCard.tsx` - Koleksiyon düzenleme popup'ından

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```json
{
  "name": "Yeni Koleksiyon Adı",
  "description": "Yeni açıklama"
}
```

**URL Parametreleri:**
- `collectionId`: Güncellenmek istenen koleksiyonun ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Koleksiyon güncellendi"
  },
  "data": {
    "id": "collection-123",
    "name": "Yeni Koleksiyon Adı",
    "description": "Yeni açıklama",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

**Kod Örneği:**
```typescript
const handleEditCollection = async (id: string, newName: string, newDescription?: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      router.push('/giris');
      return;
    }

    const updateData: any = { name: newName };
    if (newDescription) {
      updateData.description = newDescription;
    }

    const response = await axios.put(
      `${API_V1_URL}/customer/likes/collections/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data?.meta?.status === 'success') {
      await fetchCollections();
      toast.success('Koleksiyon güncellendi');
    }
  } catch (error) {
    toast.error('Koleksiyon güncellenirken bir hata oluştu');
  }
};
```

**Önemli Notlar:**
- Sadece koleksiyon sahibi güncelleyebilir
- `name` zorunlu, `description` opsiyonel
- Başarılı güncelleme sonrası liste otomatik yenilenir

---

### 4. Koleksiyon Sil

**Endpoint:** `DELETE /api/v1/customer/likes/collections/{collectionId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections/{collectionId}`

**Kullanım Yeri:**
- `CollectionsPageClient.tsx` - `handleDeleteCollection()` fonksiyonu
- `CollectionCard.tsx` - Koleksiyon silme onay popup'ından

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**URL Parametreleri:**
- `collectionId`: Silinmek istenen koleksiyonun ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Koleksiyon başarıyla silindi"
  }
}
```

**Kod Örneği:**
```typescript
const handleDeleteCollection = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      router.push('/giris');
      return;
    }

    const response = await axios.delete(`${API_V1_URL}/customer/likes/collections/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.data?.meta?.status === 'success') {
      await fetchCollections();
      toast.success('Koleksiyon başarıyla silindi');
    } else {
      toast.error(response.data?.meta?.message || 'Koleksiyon silinirken bir hata oluştu');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      router.push('/giris');
    } else if (error.response?.status === 404) {
      toast.error('Koleksiyon bulunamadı');
    } else if (error.response?.status === 403) {
      toast.error('Bu koleksiyonu silme yetkiniz yok');
    } else {
      toast.error(error.response?.data?.message || 'Koleksiyon silinirken bir hata oluştu');
    }
  }
};
```

**Önemli Notlar:**
- İşlem öncesi onay dialogu gösterilir
- Sadece koleksiyon sahibi silebilir
- Koleksiyon silindiğinde içindeki tüm ürünler de silinir
- Başarılı silme sonrası liste otomatik yenilenir

---

### 5. Koleksiyon Ürünlerini Getir

**Endpoint:** `GET /api/v1/customer/likes/collections/products/{collectionId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections/products/{collectionId}`

**Kullanım Yeri:**
- `CollectionCard.tsx` - `fetchCollectionProducts()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**URL Parametreleri:**
- `collectionId`: Ürünleri getirilecek koleksiyonun ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "code": 200
  },
  "data": [
    {
      "id": "product-123",
      "name": "Ürün Adı",
      "price": 299.99,
      "images": [
        {
          "url": "https://example.com/image.jpg"
        }
      ],
      "medias": [
        {
          "url": "https://example.com/image.jpg"
        }
      ]
    }
  ]
}
```

**Kod Örneği:**
```typescript
const fetchCollectionProducts = async () => {
  try {
    setLoadingProducts(true);
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get(`${API_V1_URL}/customer/likes/collections/products/${collectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.data?.meta?.status === 'success') {
      setCollectionProducts(response.data.data || []);
    }
  } catch (error) {
    // Hata yönetimi
  } finally {
    setLoadingProducts(false);
  }
};
```

**Kullanım Amacı:**
- Koleksiyon içindeki ürünleri listelemek
- CollectionCard component'inde ürün görsellerini göstermek
- Ürün sayısını güncellemek

---

### 6. Ürünü Koleksiyona Ekle

**Endpoint:** `POST /api/v1/customer/likes/collections/products/{collectionId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/collections/products/{collectionId}`

**Kullanım Yeri:**
- `CollectionCard.tsx` - `handleAddSelectedProducts()` fonksiyonu
- Ürün ekleme popup'ından seçili ürünleri ekleme

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

**Request Body:**
```json
{
  "product_id": "product-123"
}
```

**URL Parametreleri:**
- `collectionId`: Ürünün ekleneceği koleksiyonun ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün koleksiyona eklendi"
  },
  "data": {
    "id": "product-123",
    "collection_id": "collection-123"
  }
}
```

**Kod Örneği:**
```typescript
const handleAddSelectedProducts = async () => {
  if (selectedProducts.length === 0) {
    toast.error('Lütfen en az bir ürün seçin');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      return;
    }

    // Her seçili ürün için API çağrısı yap
    const promises = selectedProducts.map(productId =>
      axios.post(
        `${API_V1_URL}/customer/likes/collections/products/${collectionId}`,
        { product_id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
    );

    await Promise.all(promises);
    
    toast.success(`${selectedProducts.length} ürün koleksiyona eklendi`);
    setShowAddProductPopup(false);
    setSelectedProducts([]);
    onProductAdded?.();
    // Koleksiyon ürünlerini yenile
    fetchCollectionProducts();
  } catch (error: any) {
    toast.error('Ürünler eklenirken bir hata oluştu');
  }
};
```

**Önemli Notlar:**
- Toplu ürün ekleme için her ürün için ayrı API çağrısı yapılır
- `Promise.all()` ile paralel istekler yapılır
- Sadece favorilerden seçilen ürünler koleksiyona eklenebilir
- Başarılı ekleme sonrası koleksiyon ürünleri yenilenir

---

## 🎯 Interface'ler ve Veri Yapıları

### Collection Interface

```typescript
interface Collection {
  id: string;                // Koleksiyon benzersiz ID'si
  name: string;              // Koleksiyon adı
  description?: string;       // Koleksiyon açıklaması
  user_id: string;           // Koleksiyon sahibi kullanıcı ID'si
  products: any[];           // Koleksiyon içindeki ürünler
  created_at: string;        // Oluşturulma tarihi (ISO format)
  updated_at: string;        // Güncellenme tarihi (ISO format)
}
```

**Örnek Veri:**
```typescript
const exampleCollection: Collection = {
  id: "collection-123",
  name: "Alışveriş Listesi",
  description: "Alışveriş Listesi koleksiyonu",
  user_id: "user-123",
  products: [],
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T10:00:00Z"
};
```

### CollectionProduct Interface

```typescript
interface CollectionProduct {
  id: string;                // Ürün benzersiz ID'si
  name: string;              // Ürün adı
  price: number;             // Ürün fiyatı
  images?: Array<{           // Ürün görselleri
    url: string;
  }>;
  medias?: Array<{           // Ürün medya dosyaları
    url: string;
  }>;
}
```

---

## 📱 Component Yapısı

### CollectionsPageClient

**Görevler:**
- Giriş kontrolü
- Koleksiyonları listeleme
- Yeni koleksiyon oluşturma
- Koleksiyon düzenleme
- Koleksiyon silme
- AccountSidebar entegrasyonu
- Mobile sidebar yönetimi

**Özellikler:**
- Responsive tasarım
- Loading state yönetimi
- Toast bildirimleri
- Popup yönetimi

### CollectionCard

**Görevler:**
- Koleksiyon kartını gösterme
- Koleksiyon ürünlerini görüntüleme
- Ürün ekleme popup'ını açma
- Koleksiyon düzenleme popup'ını açma
- Koleksiyon silme onay popup'ını açma
- Menu (üç nokta) yönetimi

**Özellikler:**
- Grid ve Swiper görünümleri (5 veya daha fazla ürün varsa Swiper)
- Ürün görselleri
- Boş durum gösterimi
- Popup'lar (Edit, Delete, Add Product)
- Favorilerden ürün seçme

### NewCollectionPopup

**Görevler:**
- Yeni koleksiyon oluşturma formu
- Önerilen koleksiyon isimlerini gösterme
- Koleksiyon adı ve açıklama girişi

**Özellikler:**
- Responsive tasarım
- Önerilen koleksiyon butonları
- Form validasyonu

### CollectionsTabs

**Görevler:**
- Tab navigasyonu
- Yeni koleksiyon oluştur butonu
- Koleksiyon sayısını gösterme

**Özellikler:**
- Active tab gösterimi
- Responsive tasarım

### EmptyCollections

**Görevler:**
- Boş durum gösterme
- Kullanıcıyı koleksiyon oluşturmaya teşvik etme

**Özellikler:**
- Merkezi konumlandırma
- İkon gösterimi
- Açıklayıcı mesaj

---

## 📊 Akış Diyagramları

### Sayfa Yükleme Akışı

```
Kullanıcı /hesabim/koleksiyonlarim sayfasını açar
    ↓
CollectionsPageClient component'i mount olur
    ↓
Giriş durumu kontrol edilir (isLoggedIn)
    ├─ false → Loading false, return
    └─ true → Devam
        ↓
initialCollections kontrol edilir
    ├─ null ise → fetchCollections() çağrılır
    └─ dolu ise → State'e set edilir
        ↓
GET /api/v1/customer/likes/collections isteği yapılır
    ↓
Token kontrol edilir
    ├─ Token yoksa → Loading false, return
    └─ Token varsa → Devam
        ↓
API'den veri çekilir
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Koleksiyonlar listeye eklenir
        ↓
State güncellenir, UI render edilir
    ↓
Her koleksiyon için CollectionCard render edilir
    ↓
CollectionCard mount olduğunda fetchCollectionProducts() çağrılır
    ↓
GET /api/v1/customer/likes/collections/products/{id} isteği yapılır
    ↓
Ürünler CollectionCard'da gösterilir
```

### Koleksiyon Oluşturma Akışı

```
Kullanıcı "+ Koleksiyon Oluştur" butonuna tıklar
    ↓
handleNewCollectionClick() çağrılır
    ↓
Giriş kontrolü yapılır
    ├─ Giriş yapmamış → Giriş sayfasına yönlendir
    └─ Giriş yapmış → Devam
        ↓
setShowNewCollectionPopup(true) → NewCollectionPopup açılır
    ↓
Kullanıcı koleksiyon adı girer (veya önerileni seçer)
    ↓
"Koleksiyon Oluştur" butonuna tıklar
    ↓
handleCreateCollection() çağrılır
    ↓
Loading state aktif edilir
    ↓
POST /api/v1/customer/likes/collections isteği yapılır
    Body: { name: "...", description: "..." }
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
fetchCollections() çağrılır (liste yenilenir)
    ↓
Popup kapatılır, form temizlenir
    ↓
Yeni koleksiyon listede görünür
```

### Ürün Ekleme Akışı

```
Kullanıcı bir koleksiyon kartındaki menu (⋮) butonuna tıklar
    ↓
Menu açılır
    ↓
"Ürün Ekle" seçeneğine tıklar
    ↓
setShowAddProductPopup(true) → Add Product Popup açılır
    ↓
Popup açıldığında fetchFavorites() çağrılır
    ↓
GET /api/v1/customer/likes isteği yapılır
    ↓
Favori ürünler listelenir
    ↓
Kullanıcı ürünleri seçer (checkbox ile)
    ↓
"Koleksiyona Ekle" butonuna tıklar
    ↓
handleAddSelectedProducts() çağrılır
    ↓
Seçili ürün kontrolü yapılır
    ├─ Seçili ürün yoksa → Hata mesajı
    └─ Seçili ürün varsa → Devam
        ↓
Her seçili ürün için POST isteği yapılır (paralel)
    POST /api/v1/customer/likes/collections/products/{collectionId}
    Body: { product_id: "..." }
    ↓
Promise.all() ile tüm istekler beklenir
    ↓
Başarılı olursa:
    ↓
Başarı mesajı gösterilir
    ↓
Popup kapatılır, seçimler temizlenir
    ↓
fetchCollectionProducts() çağrılır (ürünler yenilenir)
    ↓
CollectionCard güncellenir (yeni ürünler gösterilir)
```

### Koleksiyon Silme Akışı

```
Kullanıcı bir koleksiyon kartındaki menu (⋮) butonuna tıklar
    ↓
Menu açılır
    ↓
"Koleksiyonu Sil" seçeneğine tıklar
    ↓
setShowDeleteConfirm(true) → Delete Confirmation Popup açılır
    ↓
Onay mesajı gösterilir
    ↓
Kullanıcı "Sil" butonuna tıklar
    ↓
handleDelete() çağrılır
    ↓
handleDeleteCollection(id) çağrılır
    ↓
Loading state aktif edilir
    ↓
DELETE /api/v1/customer/likes/collections/{id} isteği yapılır
    ↓
Response kontrol edilir
    ├─ 401 → Giriş sayfasına yönlendir
    ├─ 404 → "Koleksiyon bulunamadı" mesajı
    ├─ 403 → "Yetkiniz yok" mesajı
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
fetchCollections() çağrılır (liste yenilenir)
    ↓
Popup kapatılır
    ↓
Başarı mesajı gösterilir
    ↓
Koleksiyon listeden kaldırılır
```

---

## 🔄 Kullanım Senaryoları

### Senaryo 1: İlk Kez Sayfa Açma

1. Kullanıcı giriş yapmış durumda
2. `/hesabim/koleksiyonlarim` sayfasına gider
3. Sayfa yüklenirken loading spinner gösterilir
4. API'den koleksiyonlar çekilir
5. Koleksiyonlar grid formatında listelenir veya boş durum gösterilir
6. Her koleksiyon kartı için ürünler çekilir ve gösterilir

### Senaryo 2: Yeni Koleksiyon Oluşturma

1. Kullanıcı koleksiyonlar sayfasındadır
2. "+ Koleksiyon Oluştur" butonuna tıklar
3. NewCollectionPopup açılır
4. Kullanıcı koleksiyon adı girer veya önerilen bir adı seçer
5. "Koleksiyon Oluştur" butonuna tıklar
6. POST isteği yapılır
7. Başarılı olursa yeni koleksiyon listede görünür

### Senaryo 3: Ürün Ekleme

1. Kullanıcı bir koleksiyon kartındaki menu butonuna tıklar
2. "Ürün Ekle" seçeneğini seçer
3. Add Product Popup açılır
4. Favori ürünler listelenir
5. Kullanıcı bir veya daha fazla ürün seçer
6. "Koleksiyona Ekle" butonuna tıklar
7. Seçili ürünler koleksiyona eklenir
8. Koleksiyon kartı güncellenir (yeni ürünler gösterilir)

### Senaryo 4: Koleksiyon Düzenleme

1. Kullanıcı bir koleksiyon kartındaki menu butonuna tıklar
2. "Koleksiyon Adı Düzenle" seçeneğini seçer
3. Edit Popup açılır
4. Kullanıcı ad ve açıklama günceller
5. "Koleksiyon Güncelle" butonuna tıklar
6. PUT isteği yapılır
7. Başarılı olursa koleksiyon bilgileri güncellenir

### Senaryo 5: Koleksiyon Silme

1. Kullanıcı bir koleksiyon kartındaki menu butonuna tıklar
2. "Koleksiyonu Sil" seçeneğini seçer
3. Delete Confirmation Popup açılır
4. Onay mesajı gösterilir
5. Kullanıcı "Sil" butonuna tıklar
6. DELETE isteği yapılır
7. Başarılı olursa koleksiyon listeden kaldırılır

---

## ⚙️ Özellikler ve Limitler

### Özellikler

1. **✅ Responsive Tasarım:**
   - Desktop: 2 kolon grid
   - Mobile: 1 kolon grid
   - Tüm ekran boyutlarında optimize edilmiştir

2. **✅ Ürün Görüntüleme:**
   - 5 veya daha az ürün: Grid görünümü
   - 5'ten fazla ürün: Swiper carousel görünümü
   - Boş durum: Placeholder gösterimi

3. **✅ Toplu Ürün Ekleme:**
   - Birden fazla ürün seçilebilir
   - Paralel API istekleri ile hızlı ekleme
   - Seçim durumu checkbox ile gösterilir

4. **✅ Önerilen Koleksiyonlar:**
   - Önceden tanımlı koleksiyon önerileri
   - Tek tıkla seçim

5. **✅ Popup Yönetimi:**
   - Yeni koleksiyon popup'ı
   - Düzenleme popup'ı
   - Silme onay popup'ı
   - Ürün ekleme popup'ı

6. **✅ Real-time Güncelleme:**
   - Koleksiyon oluşturulduğunda/anında liste güncellenir
   - Ürün eklendiğinde koleksiyon kartı güncellenir

7. **✅ Menu (Üç Nokta):**
   - Her koleksiyon kartında işlem menüsü
   - Ürün ekle, düzenle, sil seçenekleri

8. **✅ Favoriler Entegrasyonu:**
   - Sadece favori ürünler koleksiyona eklenebilir
   - Favorilerden ürün seçme popup'ı

### Limitler

1. **Giriş Gereksinimi:**
   - Tüm işlemler için kullanıcı giriş yapmış olmalıdır
   - Guest kullanıcılar koleksiyon oluşturamaz

2. **Favori Ürün Gereksinimi:**
   - Koleksiyona sadece favori ürünler eklenebilir
   - Önce favorilere eklenmesi gerekir

3. **API Bağımlılığı:**
   - Tüm veriler API'den gelir
   - API yanıt vermezse liste boş görünür

4. **Toplu İşlem Limitleri:**
   - Her ürün için ayrı API isteği yapılır
   - Çok sayıda ürün seçilirse performans etkisi olabilir

5. **Swiper Limitleri:**
   - 5'ten fazla ürün varsa Swiper gösterilir
   - Swiper navigation butonları özel tasarlanmıştır

---

## 🎨 UI/UX Özellikleri

### Loading State

```tsx
{loading ? (
  <div className="flex items-center justify-center py-24">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
  </div>
) : (
  // Koleksiyon listesi
)}
```

### Boş Durum

```tsx
{collections.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    {/* Koleksiyon kartları */}
  </div>
) : (
  <div className="flex flex-col items-center justify-center py-24 border rounded-lg min-h-[500px] mt-6">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-[#FFF8F3] rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-[#F27A1A]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Koleksiyonunuz Yok</h3>
      <p className="text-sm text-gray-500">Koleksiyonları takip edebilir, sevdiklerinizle paylaşabilirsiniz!</p>
    </div>
  </div>
)}
```

### Koleksiyon Kartı (Grid Görünümü - 5 veya daha az ürün)

```tsx
<div className="grid grid-cols-5 gap-1 p-2">
  {collectionProducts.map((product) => (
    <div key={product.id} className="relative aspect-square">
      <img
        src={product.images?.[0]?.url || product.medias?.[0]?.url || '/placeholder-product.jpg'}
        alt={product.name}
        className="w-full h-full object-cover rounded-md"
      />
    </div>
  ))}
</div>
```

### Koleksiyon Kartı (Swiper Görünümü - 5'ten fazla ürün)

```tsx
<Swiper
  modules={[Navigation, Pagination]}
  spaceBetween={4}
  slidesPerView={5}
  navigation={{
    nextEl: '.swiper-button-next-collection',
    prevEl: '.swiper-button-prev-collection',
  }}
  pagination={{ clickable: true }}
  className="collection-swiper"
>
  {collectionProducts.map((product) => (
    <SwiperSlide key={product.id}>
      <div className="relative aspect-square">
        <img
          src={product.images?.[0]?.url || product.medias?.[0]?.url || '/placeholder-product.jpg'}
          alt={product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </SwiperSlide>
  ))}
</Swiper>
```

### Ürün Seçme Popup

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
  {favorites.map(product => (
    <div
      key={product.id}
      className={`relative border-2 rounded-lg p-3 cursor-pointer ${
        selectedProducts.includes(product.id) 
          ? 'border-[#F27A1A] bg-[#FFF8F3]' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => toggleProductSelection(product.id)}
    >
      {/* Checkbox */}
      <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center ${
        selectedProducts.includes(product.id)
          ? 'bg-[#F27A1A] border-[#F27A1A]'
          : 'bg-white border-gray-300'
      }`}>
        {selectedProducts.includes(product.id) && (
          <CheckIcon className="w-3 h-3 text-white" />
        )}
      </div>
      
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
        <img src={product.images?.[0]?.url || product.medias?.[0]?.url} alt={product.name} />
      </div>
      
      {/* Product Info */}
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-[#F27A1A]">
          {product.price?.toLocaleString('tr-TR')}₺
        </p>
      </div>
    </div>
  ))}
</div>
```

---

## 🔍 Önemli Notlar

### 1. Favori Ürün Gereksinimi

- Koleksiyona sadece favori ürünler eklenebilir
- Ürün ekleme popup'ında sadece favoriler gösterilir
- Önce favorilere eklenmesi gerekir

### 2. Toplu Ürün Ekleme

- Her ürün için ayrı API çağrısı yapılır
- `Promise.all()` ile paralel istekler yapılır
- Performans için optimize edilmiştir

### 3. Swiper Kullanımı

- 5'ten fazla ürün varsa Swiper gösterilir
- 5 veya daha az ürün varsa grid gösterilir
- Custom navigation butonları kullanılır

### 4. Önerilen Koleksiyonlar

```typescript
const suggestedCollections = [
  { name: 'Favorilerim', emoji: '❤️' },
  { name: 'Alışveriş Listem', emoji: '🛒' },
  { name: 'İncelemek İstediklerim', emoji: '👀' },
  { name: 'Siparişlerim', emoji: '📦' }
];
```

### 5. Error Handling

- **401 Unauthorized:** Giriş sayfasına yönlendir
- **404 Not Found:** "Koleksiyon bulunamadı" mesajı
- **403 Forbidden:** "Yetkiniz yok" mesajı
- **Network Error:** Toast mesajı gösterilir

### 6. Popup Yönetimi

- NewCollectionPopup: Yeni koleksiyon oluşturma
- Edit Popup: Koleksiyon düzenleme
- Delete Confirm Popup: Koleksiyon silme onayı
- Add Product Popup: Ürün ekleme

---

## 📚 İlgili Dosyalar

### Ana Dosyalar
- `app/hesabim/koleksiyonlarim/page.tsx` - Server component
- `app/hesabim/koleksiyonlarim/CollectionsPageClient.tsx` - Client component

### Component'ler
- `app/koleksiyonlar/components/CollectionCard.tsx` - Koleksiyon kartı
- `components/collections/NewCollectionPopup.tsx` - Yeni koleksiyon popup'ı
- `components/collections/CollectionsTabs.tsx` - Tab navigasyonu
- `components/collections/EmptyCollections.tsx` - Boş durum component'i
- `components/favorites/FavoritesTabs.tsx` - Favoriler/Koleksiyonlar tab'ı

### İlgili Sayfalar
- `/hesabim/favoriler` - Favoriler sayfası
- `/giris` - Giriş sayfası (yönlendirme)

---

## 🚀 İyileştirme Önerileri

1. **Batch API İsteği:**
   - Toplu ürün ekleme için tek bir batch endpoint
   - Daha az API isteği, daha iyi performans

2. **Koleksiyon Paylaşma:**
   - Koleksiyonları paylaşma özelliği
   - Public/Private koleksiyon ayarları

3. **Sıralama ve Filtreleme:**
   - Koleksiyonları sıralama (tarih, ürün sayısı)
   - Koleksiyon içinde ürün arama

4. **Koleksiyon Önizleme:**
   - Koleksiyon detay sayfası
   - Tam ekran ürün görüntüleme

5. **Drag & Drop:**
   - Ürün sıralamasını değiştirme
   - Koleksiyonlar arası ürün taşıma

6. **Koleksiyon Şablonları:**
   - Önceden tanımlı koleksiyon şablonları
   - Kategorilere göre koleksiyon önerileri

7. **Toplu İşlemler:**
   - Birden fazla koleksiyonu toplu silme
   - Koleksiyonları toplu düzenleme

8. **Export/Import:**
   - Koleksiyonları dışa aktarma
   - Koleksiyonları içe aktarma

9. **Analytics:**
   - En popüler koleksiyonlar
   - Koleksiyon kullanım istatistikleri

10. **Notlar ve Etiketler:**
    - Koleksiyonlara notlar ekleme
    - Etiket sistemi

---

**Son Güncelleme:** 2024

