# ❤️ Favoriler Sayfası - Detaylı Dokümantasyon

Bu dokümantasyon, "Favoriler" sayfasının nasıl göründüğünü, nasıl çalıştığını ve kullanılan endpoint'leri detaylı olarak açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı ve Görünüm](#sayfa-yapısı-ve-görünüm)
3. [FavoriteContext - Çalışma Mantığı](#favoritecontext---çalışma-mantığı)
4. [API Endpoint'leri](#api-endpointleri)
5. [Interface'ler ve Veri Yapıları](#interfaceler-ve-veri-yapıları)
6. [Component Yapısı](#component-yapısı)
7. [Akış Diyagramları](#akış-diyagramları)
8. [Kullanım Senaryoları](#kullanım-senaryoları)
9. [Özellikler ve Limitler](#özellikler-ve-limitler)
10. [İlgili Dosyalar](#ilgili-dosyalar)

---

## 🔍 Genel Bakış

**Sayfa URL:** `/hesabim/favoriler`

**Açıklama:** Kullanıcıların beğendikleri ürünleri favorilere ekledikleri ve yönetebildikleri sayfa. Kullanıcılar bu sayfada favori ürünleri görüntüleyebilir, ürünleri sepete ekleyebilir ve favorilerden kaldırabilir.

**Önemli Not:** Bu sayfa sadece giriş yapmış kullanıcılar tarafından erişilebilir. Giriş yapmayan kullanıcılar otomatik olarak giriş sayfasına yönlendirilir.

**Dosya Yapısı:**
- Server Component: `app/hesabim/favoriler/page.tsx`
- Client Component: `app/hesabim/favoriler/FavoritesPageClient.tsx`
- Component: `components/favorites/FavoritesList.tsx`
- Component: `components/favorites/EmptyFavorites.tsx`
- Component: `components/favorites/FavoritesTabs.tsx`
- Context: `app/context/FavoriteContext.tsx`

---

## 📄 Sayfa Yapısı ve Görünüm

### Desktop Görünümü

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Header component)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  ← [Geri] ❤️ Favorilerim            │  │
│  │ Account      │  │                                      │  │
│  │ Sidebar      │  │  ┌────────────────────────────────┐ │  │
│  │              │  │  │ ❤️ Favorilerim | Koleksiyonlarım│ │  │
│  │ - Hesabım    │  │  └────────────────────────────────┘ │  │
│  │ - Siparişler │  │                                      │  │
│  │ - Favoriler  │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │  │
│  │ - ...        │  │  │ Ü1 │ │ Ü2 │ │ Ü3 │ │ Ü4 │       │  │
│  │              │  │  │    │ │    │ │    │ │    │       │  │
│  │              │  │  │ 💰 │ │ 💰 │ │ 💰 │ │ 💰 │       │  │
│  │              │  │  │[🗑️]│ │[🗑️]│ │[🗑️]│ │[🗑️]│       │  │
│  │              │  │  │[Sepete Ekle]│ │[Sepete Ekle]│ │  │
│  │              │  │  └────┘ └────┘ └────┘ └────┘       │  │
│  │              │  │                                      │  │
│  │              │  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │  │
│  │              │  │  │ Ü5 │ │ Ü6 │ │ Ü7 │ │ Ü8 │       │  │
│  │              │  │  └────┘ └────┘ └────┘ └────┘       │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Görünümü

```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ ← ❤️ Favorilerim ☰          │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ❤️ Favorilerim |        │ │
│ │    Koleksiyonlarım      │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────┐ ┌─────┐            │
│ │ Ü1  │ │ Ü2  │            │
│ │ 💰  │ │ 💰  │            │
│ │[🗑️] │ │[🗑️] │            │
│ │[Sepete Ekle]│            │
│ └─────┘ └─────┘            │
│                             │
│ ┌─────┐ ┌─────┐            │
│ │ Ü3  │ │ Ü4  │            │
│ └─────┘ └─────┘            │
│                             │
└─────────────────────────────┘
```

### Boş Durum (Favori Ürün Yoksa)

```
┌─────────────────────────────┐
│                             │
│        ┌─────────┐          │
│        │   ❤️    │          │
│        └─────────┘          │
│                             │
│   Favorilerinizde ürün      │
│   bulunmamaktadır.          │
│                             │
│ Beğendiğin ürünü favorine   │
│ ekle, fiyatı düştüğünde     │
│ haber verelim.              │
│                             │
│   [Alışverişe Başla]        │
│                             │
└─────────────────────────────┘
```

---

## 🔧 FavoriteContext - Çalışma Mantığı

### Context Yapısı

**Dosya:** `app/context/FavoriteContext.tsx`

**Provider:** `FavoriteProvider`

**Hook:** `useFavorites()`

### Interface'ler

```typescript
interface FavoriteContextType {
  favorites: Product[];                              // Favori ürünler listesi
  loading: boolean;                                  // Yüklenme durumu
  error: string | null;                              // Hata mesajı
  addToFavorites: (productId: string) => Promise<void>;  // Ürün ekleme
  removeFavorite: (productId: string) => Promise<void>;  // Ürün kaldırma
  refreshFavorites: () => Promise<void>;            // Listeyi yenileme
  isInFavorites: (productId: string) => boolean;    // Kontrol fonksiyonu
  favoritesCount: number;                            // Toplam favori sayısı
  incrementFavoritesCount: () => void;               // Sayaç artırma
  decrementFavoritesCount: () => void;               // Sayaç azaltma
}
```

### Önemli Özellikler

1. **Otomatik Yükleme:**
   - Context mount olduğunda otomatik olarak favoriler yüklenir
   - `useEffect` ile `refreshFavorites()` çağrılır

2. **Kullanıcı Bazlı:**
   - Sadece giriş yapmış kullanıcılar için çalışır
   - Guest kullanıcılar için favoriler temizlenir

3. **Real-time Güncelleme:**
   - Ürün eklendiğinde/kaldırıldığında liste otomatik yenilenir
   - State senkron tutulur

4. **Hata Yönetimi:**
   - 401 hatası durumunda token silinir ve giriş sayfasına yönlendirilir
   - Toast mesajları ile kullanıcı bilgilendirilir

5. **Media Handling:**
   - API'den gelen farklı media formatları desteklenir
   - Array formatı ve numbered keys formatı (0, 1, 2...) işlenir

---

## 🌐 API Endpoint'leri

### 1. Favori Ürünleri Getir

**Endpoint:** `GET /api/v1/customer/likes`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes`

**Kullanım Yeri:** 
- `FavoriteContext.tsx` - `refreshFavorites()` fonksiyonu

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
      "id": "product-123",
      "name": "Ürün Adı",
      "slug": "urun-adi",
      "price": 299.99,
      "medias": [
        {
          "url": "https://example.com/image.jpg",
          "name": "Ürün Görseli",
          "id": "media-1"
        }
      ],
      "images": [
        {
          "url": "https://example.com/image.jpg"
        }
      ],
      "like_count": 150,
      "badges": {},
      "view": 1000,
      "cpid": "cpid-123",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

**Kod Örneği:**
```typescript
const refreshFavorites = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    if (!isLoggedIn) {
      setFavorites([]);
      setFavoritesCount(0);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token bulunamadı');
    }

    const response = await axios.get(`${API_V1_URL}/customer/likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });

    if (response.data.meta?.status === 'success') {
      // API'den gelen veriyi Product interface'ine uygun hale getir
      const formattedFavorites = response.data.data.map((item: any) => {
        // Media yapısını işle
        let medias = [];
        let images = [];
        
        if (item.medias && Array.isArray(item.medias)) {
          medias = item.medias;
          images = item.medias.map((media: any) => ({ url: media.url }));
        } else {
          // Numbered keys formatını işle (0, 1, 2...)
          const mediaKeys = Object.keys(item).filter(key => 
            /^\d+$/.test(key) && item[key] && typeof item[key] === 'object' && item[key].url
          );
          
          if (mediaKeys.length > 0) {
            medias = mediaKeys.map(key => item[key]);
            images = mediaKeys.map(key => ({ url: item[key].url }));
          }
        }

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          price: item.price || 0,
          medias: medias,
          images: images,
          like_count: item.like_count,
          badges: item.badges,
          view: item.view,
          cpid: item.cpid,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });
      
      setFavorites(formattedFavorites);
      setFavoritesCount(formattedFavorites.length);
    }
  } catch (error) {
    // Hata yönetimi
  } finally {
    setLoading(false);
  }
}, [isLoggedIn]);
```

**Kullanım Amacı:**
- Kullanıcının favori ürünlerini listelemek
- Sayfa yüklendiğinde favorileri göstermek
- Favori sayısını güncellemek

---

### 2. Favori Ekle

**Endpoint:** `POST /api/v1/customer/likes`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes`

**Kullanım Yeri:**
- `FavoriteContext.tsx` - `addToFavorites()` fonksiyonu
- `ProductActions.tsx` - Ürün detay sayfasında favori ekleme

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**Request Body:**
```json
{
  "product_id": "product-123"
}
```

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün favorilere eklendi"
  },
  "data": {
    "id": "product-123",
    "name": "Ürün Adı",
    "slug": "urun-adi"
  }
}
```

**Kod Örneği:**
```typescript
const addToFavorites = async (productId: string) => {
  try {
    setLoading(true);
    setError(null);

    if (!isLoggedIn) {
      throw new Error('Kullanıcı giriş yapmamış');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token bulunamadı');
    }

    const response = await axios.post(
      `${API_V1_URL}/customer/likes`,
      { product_id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (response.data.meta?.status === 'success') {
      await refreshFavorites(); // Listeyi yenile
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    setError('Failed to add to favorites');
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/giris';
    } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
      // Component seviyesinde yönetiliyor
    } else {
      toast.error('Ürün favorilere eklenirken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
};
```

**Önemli Notlar:**
- Kullanıcı giriş yapmış olmalıdır (token gerekli)
- Başarılı ekleme sonrası liste otomatik yenilenir
- Aynı ürün birden fazla kez eklenemez (backend kontrolü)

---

### 3. Favoriden Kaldır

**Endpoint:** `DELETE /api/v1/customer/likes/{productId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/likes/{productId}`

**Kullanım Yeri:**
- `FavoriteContext.tsx` - `removeFavorite()` fonksiyonu
- `FavoritesList.tsx` - Favori listeden kaldırma
- `ProductActions.tsx` - Ürün detay sayfasında favoriden kaldırma

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
}
```

**URL Parametreleri:**
- `productId`: Kaldırılmak istenen ürünün ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün favorilerden kaldırıldı"
  }
}
```

**Kod Örneği:**
```typescript
const removeFavorite = async (productId: string) => {
  try {
    setLoading(true);
    setError(null);

    if (!isLoggedIn) {
      throw new Error('Kullanıcı giriş yapmamış');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token bulunamadı');
    }

    const response = await axios.delete(
      `${API_V1_URL}/customer/likes/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (response.data.meta?.status === 'success') {
      await refreshFavorites(); // Listeyi yenile
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    setError('Failed to remove from favorites');
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/giris';
    } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
      // Component seviyesinde yönetiliyor
    } else {
      toast.error('Ürün favorilerden kaldırılırken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
};
```

**Önemli Notlar:**
- Başarılı kaldırma sonrası liste otomatik yenilenir
- Local state de güncellenir (optimistic update)
- Favori sayacı otomatik azalır

---

## 🎯 Interface'ler ve Veri Yapıları

### Product Interface (Favoriler İçin)

```typescript
interface Product {
  id: string;                // Ürün benzersiz ID'si
  name: string;              // Ürün adı
  slug: string;              // Ürün slug'ı (URL için)
  price: number;             // Ürün fiyatı
  medias?: Array<{           // Ürün medya dosyaları
    url: string;
    name?: string;
    id?: string;
  }>;
  images?: Array<{           // Ürün görselleri
    url: string;
  }>;
  like_count?: number;       // Beğeni sayısı
  badges?: any;              // Ürün rozetleri
  view?: number;             // Görüntülenme sayısı
  cpid?: string;             // CP ID
  created_at?: string;       // Oluşturulma tarihi
  updated_at?: string;       // Güncellenme tarihi
}
```

**Örnek Veri:**
```typescript
const exampleProduct: Product = {
  id: "product-123",
  name: "iPhone 15 Pro",
  slug: "iphone-15-pro",
  price: 45000,
  medias: [
    {
      url: "https://example.com/image1.jpg",
      name: "iPhone 15 Pro",
      id: "media-1"
    }
  ],
  images: [
    {
      url: "https://example.com/image1.jpg"
    }
  ],
  like_count: 150,
  view: 1000,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-20T10:00:00Z"
};
```

---

## 📱 Component Yapısı

### FavoritesPageClient

**Görevler:**
- Giriş kontrolü (giriş yapmamış kullanıcıları yönlendirme)
- Header gösterimi
- AccountSidebar entegrasyonu
- Mobile sidebar yönetimi
- FavoritesList ve FavoritesTabs component'lerini render etme
- Sepete ekleme işlemi yönetimi

**Özellikler:**
- Responsive tasarım
- Loading state yönetimi
- Toast bildirimleri

### FavoritesList

**Görevler:**
- Favori ürünleri grid formatında gösterme
- Ürün kartlarını render etme
- Favoriden kaldırma işlemi
- Sepete ekleme işlemi
- Boş durum gösterimi

**Özellikler:**
- Responsive grid (2 kolon mobil, 4 kolon desktop)
- Ürün görselleri
- Fiyat gösterimi
- Silme butonu (her ürün kartında)
- Sepete ekle butonu
- Loading state

### EmptyFavorites

**Görevler:**
- Favori ürün yoksa boş durum gösterme
- Kullanıcıyı alışverişe yönlendirme

**Özellikler:**
- Merkezi konumlandırma
- İkon gösterimi
- Açıklayıcı mesaj
- CTA butonu

### FavoritesTabs

**Görevler:**
- Favoriler ve Koleksiyonlar arasında tab geçişi
- Aktif tab gösterimi

**Özellikler:**
- Active state yönetimi
- İkon gösterimi
- Responsive tasarım

---

## 📊 Akış Diyagramları

### Sayfa Yükleme Akışı

```
Kullanıcı /hesabim/favoriler sayfasını açar
    ↓
FavoritesPageClient component'i mount olur
    ↓
Giriş durumu kontrol edilir (isLoggedIn)
    ├─ undefined → Loading spinner göster
    ├─ false → /giris sayfasına yönlendir
    └─ true → Devam
        ↓
useFavorites() hook'u çağrılır
    ↓
FavoriteContext'ten favorites state'i alınır
    ↓
Context mount olduğunda refreshFavorites() otomatik çağrılır
    ↓
GET /api/v1/customer/likes isteği yapılır
    ↓
Token kontrol edilir
    ├─ Token yoksa → Hata, favoriler temizlenir
    └─ Token varsa → Devam
        ↓
API'den veri çekilir
    ↓
Veriler formatlanır (medias/images işlenir)
    ↓
State güncellenir (favorites, favoritesCount)
    ↓
FavoritesList component'i render edilir
    ↓
Ürünler grid formatında gösterilir
```

### Favori Ekleme Akışı

```
Kullanıcı ürün detay sayfasında "Favoriye Ekle" butonuna tıklar
    ↓
handleFavoriteClick() fonksiyonu çağrılır
    ↓
Giriş kontrolü yapılır
    ├─ Giriş yapmamış → Giriş sayfasına yönlendir
    └─ Giriş yapmış → Devam
        ↓
addToFavorites(productId) çağrılır
    ↓
Loading state aktif edilir
    ↓
POST /api/v1/customer/likes isteği yapılır
    Body: { product_id: "product-123" }
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
refreshFavorites() çağrılır
    ↓
Güncel favori listesi çekilir
    ↓
State güncellenir
    ↓
UI güncellenir (kalp ikonu dolu gösterilir)
    ↓
Başarı mesajı gösterilir
```

### Favoriden Kaldırma Akışı

```
Kullanıcı favori sayfasında ürün kartındaki silme butonuna tıklar
    ↓
handleRemove(productId) fonksiyonu çağrılır
    ↓
removeFavorite(productId) çağrılır (FavoriteContext'ten)
    ↓
Loading state aktif edilir
    ↓
DELETE /api/v1/customer/likes/{productId} isteği yapılır
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
Optimistic update: Local state'ten ürün kaldırılır
    setLocalFavorites(prev => prev.filter(item => item.id !== productId))
    ↓
refreshFavorites() çağrılır
    ↓
Güncel favori listesi çekilir
    ↓
State güncellenir
    ↓
UI güncellenir (ürün listeden kaldırılır)
    ↓
Favori sayacı azalır
```

### Sepete Ekleme Akışı

```
Kullanıcı favori sayfasında ürün kartındaki "Sepete Ekle" butonuna tıklar
    ↓
onAddToCart(productId) çağrılır
    ↓
handleAddToCart(productId) fonksiyonu çağrılır
    ↓
addToBasket(productId, 1) çağrılır (BasketContext'ten)
    ↓
Sepet API isteği yapılır
    ↓
Başarılı olursa:
    ↓
addedToCart state'i güncellenir (productId)
    ↓
Buton durumu değişir ("Sepete Eklendi" gösterilir)
    ↓
Başarı mesajı gösterilir (BasketContext'te yönetiliyor)
```

---

## 🔄 Kullanım Senaryoları

### Senaryo 1: İlk Kez Sayfa Açma

1. Kullanıcı giriş yapmış durumda
2. `/hesabim/favoriler` sayfasına gider
3. Sayfa yüklenirken loading spinner gösterilir
4. API'den favori ürünler çekilir
5. Ürünler grid formatında listelenir veya boş durum gösterilir

### Senaryo 2: Favori Ekleme

1. Kullanıcı bir ürün detay sayfasındadır (`/urunler/{slug}`)
2. "Favoriye Ekle" butonuna tıklar
3. Giriş kontrolü yapılır (giriş yapmamışsa giriş sayfasına yönlendirilir)
4. POST isteği yapılır
5. Başarılı olursa kalp ikonu dolu gösterilir
6. Favoriler sayfası açıldığında ürün listede görünür

### Senaryo 3: Favoriden Kaldırma

1. Kullanıcı favoriler sayfasındadır
2. Bir ürün kartındaki silme butonuna (🗑️) tıklar
3. Ürün optimistically listeden kaldırılır (anında)
4. DELETE isteği yapılır
5. Başarılı olursa liste güncellenir
6. Favori sayacı azalır

### Senaryo 4: Sepete Ekleme

1. Kullanıcı favoriler sayfasındadır
2. Bir ürün kartındaki "Sepete Ekle" butonuna tıklar
3. Sepet API isteği yapılır
4. Başarılı olursa buton "Sepete Eklendi" olur
5. Ürün sepete eklenir

### Senaryo 5: Giriş Yapmamış Kullanıcı

1. Kullanıcı giriş yapmamış durumda
2. `/hesabim/favoriler` sayfasına girmeye çalışır
3. Giriş kontrolü yapılır
4. Otomatik olarak `/giris` sayfasına yönlendirilir
5. Giriş yaptıktan sonra favoriler sayfasına gidebilir

---

## ⚙️ Özellikler ve Limitler

### Özellikler

1. **✅ Responsive Tasarım:**
   - Mobile: 2 kolon grid
   - Tablet: 3 kolon grid
   - Desktop: 4 kolon grid
   - Tüm ekran boyutlarında optimize edilmiştir

2. **✅ Real-time Güncelleme:**
   - Ürün eklendiğinde/kaldırıldığında liste anında güncellenir
   - Optimistic updates ile hızlı kullanıcı deneyimi

3. **✅ Giriş Kontrolü:**
   - Sayfa sadece giriş yapmış kullanıcılar için erişilebilir
   - Giriş yapmamış kullanıcılar otomatik yönlendirilir

4. **✅ Loading States:**
   - Sayfa yüklenirken loading spinner
   - İşlem yapılırken buton disable
   - Ürün silinirken local state'ten anında kaldırma

5. **✅ Boş Durum Yönetimi:**
   - Favori yoksa kullanıcı dostu mesaj
   - "Alışverişe Başla" butonu ile yönlendirme

6. **✅ Sepete Ekleme Entegrasyonu:**
   - Favorilerden direkt sepete ekleme
   - Başarılı ekleme durumu gösterimi
   - BasketContext ile entegrasyon

7. **✅ Ürün Görselleri:**
   - Fallback görsel desteği
   - Error handling (görsel yüklenemezse gizlenir)
   - Lazy loading

8. **✅ Fiyat Formatlama:**
   - Türk Lirası formatında gösterim
   - 0 TL ürünlerde "Fiyat bilgisi yok" mesajı
   - 0 TL ürünlerde sepete ekle butonu gizlenir

9. **✅ Media Handling:**
   - Farklı API response formatları desteklenir
   - Array formatı ve numbered keys formatı
   - Fallback mekanizmaları

### Limitler

1. **Giriş Gereksinimi:**
   - Tüm işlemler için kullanıcı giriş yapmış olmalıdır
   - Guest kullanıcılar favori ekleyemez

2. **API Bağımlılığı:**
   - Tüm veriler API'den gelir
   - API yanıt vermezse liste boş görünür

3. **Pagination:**
   - Tüm favoriler tek seferde yüklenir
   - Çok fazla favori varsa performans etkisi olabilir

4. **Offline Destek:**
   - Offline modda favoriler görüntülenemez
   - Tüm işlemler için internet bağlantısı gerekir

---

## 🎨 UI/UX Özellikleri

### Loading State

```tsx
{loading ? (
  <div className="flex justify-center items-center min-h-[200px] sm:min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
  </div>
) : (
  // Favori listesi
)}
```

### Boş Durum

```tsx
<div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
  <div className="text-center py-6 sm:py-12">
    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 mb-3 sm:mb-4">
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500">
        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </div>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
      Favorilerinizde ürün bulunmamaktadır.
    </h2>
    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
      Beğendiğin ürünü favorine ekle, fiyatı düştüğünde haber verelim.
    </p>
    <a
      href="/"
      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
    >
      Alışverişe Başla
    </a>
  </div>
</div>
```

### Ürün Kartı

```tsx
<div className="product-card block bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
  <Link href={createProductUrl(product.slug || '')}>
    <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg p-1 group">
      <Image
        src={
          (product.medias && product.medias.length > 0 && product.medias[0].url)
          || (product.images && product.images.length > 0 && product.images[0].url)
          || '/placeholder.webp'
        }
        alt={product.name}
        fill
        className="object-contain"
      />
      
      {/* Silme Butonu */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleRemove(product.id);
        }}
        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm z-10"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  </Link>

  <div className="p-2 pb-2 flex-1 flex flex-col">
    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
      {product.name}
    </h3>

    {/* Fiyat */}
    <div className="mb-2">
      <div className="text-lg font-semibold text-gray-900">
        {product.price && product.price > 0 
          ? new Intl.NumberFormat('tr-TR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(product.price) + ' TL' 
          : 'Fiyat bilgisi yok'}
      </div>
    </div>

    {/* Sepete Ekle Butonu */}
    {product.price > 0 && (
      <button 
        onClick={() => onAddToCart(product.id)}
        disabled={addedToCart === product.id}
        className={`w-full py-2 px-4 rounded-lg text-sm font-normal transition-all duration-200 border-2 ${
          addedToCart === product.id
            ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
            : 'bg-white text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white'
        }`}
      >
        {addedToCart === product.id ? 'Sepete Eklendi' : 'Sepete Ekle'}
      </button>
    )}
  </div>
</div>
```

### Grid Layout

```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-4 2xl:gap-4">
  {/* Ürün kartları */}
</div>
```

**Responsive Breakpoints:**
- Mobile (< 768px): 2 kolon
- Tablet (768px - 1024px): 3 kolon
- Desktop (≥ 1024px): 4 kolon

---

## 🔍 Önemli Notlar

### 1. Media Format Handling

API'den gelen media verileri iki farklı formatta gelebilir:

**Format 1: Array Format**
```json
{
  "medias": [
    { "url": "...", "name": "...", "id": "..." },
    { "url": "...", "name": "...", "id": "..." }
  ]
}
```

**Format 2: Numbered Keys Format**
```json
{
  "0": { "url": "...", "name": "..." },
  "1": { "url": "...", "name": "..." }
}
```

Her iki format da `refreshFavorites()` fonksiyonunda işlenir.

### 2. Optimistic Updates

Favoriden kaldırma işleminde optimistic update yapılır:
- Önce local state'ten ürün kaldırılır (anında UI güncellenir)
- Sonra API isteği yapılır
- Başarılı olursa liste yeniden çekilir
- Bu sayede kullanıcı deneyimi daha hızlı olur

### 3. Error Handling

- **401 Unauthorized:** Token silinir, giriş sayfasına yönlendirilir
- **Network Error:** Toast mesajı gösterilir
- **Invalid Response:** Hata mesajı gösterilir
- **Giriş Yapmamış:** Component seviyesinde yönetilir (toast gösterilmez)

### 4. Sepete Ekleme

- Sepete ekleme işlemi `BasketContext` üzerinden yapılır
- Başarı mesajı `BasketContext`'te yönetilir
- `addedToCart` state'i ile buton durumu kontrol edilir
- 0 TL ürünlerde sepete ekle butonu gösterilmez

### 5. Favori Sayacı

- `favoritesCount` state'i ile toplam favori sayısı takip edilir
- Ürün eklendiğinde artar, kaldırıldığında azalır
- Header'daki favori sayısı bu state'ten alınabilir

---

## 📚 İlgili Dosyalar

### Ana Dosyalar
- `app/hesabim/favoriler/page.tsx` - Server component
- `app/hesabim/favoriler/FavoritesPageClient.tsx` - Client component

### Component'ler
- `components/favorites/FavoritesList.tsx` - Favori ürün listesi
- `components/favorites/EmptyFavorites.tsx` - Boş durum component'i
- `components/favorites/FavoritesTabs.tsx` - Tab navigasyonu

### Context
- `app/context/FavoriteContext.tsx` - Favoriler context'i
- `app/context/BasketContext.tsx` - Sepet context'i (sepet ekleme için)
- `app/context/AuthContext.tsx` - Auth context'i (giriş kontrolü için)

### İlgili Sayfalar
- `/hesabim/koleksiyonlarim` - Koleksiyonlar sayfası
- `/urunler/{slug}` - Ürün detay sayfası (favori ekleme yeri)
- `/giris` - Giriş sayfası (yönlendirme)

---

## 🚀 İyileştirme Önerileri

1. **Pagination:**
   - Çok fazla favori varsa sayfalama eklenebilir
   - Infinite scroll veya "Daha Fazla" butonu

2. **Filtreleme ve Sıralama:**
   - Fiyata göre sıralama
   - Tarihe göre sıralama
   - Kategoriye göre filtreleme

3. **Toplu İşlemler:**
   - Seçili ürünleri toplu silme
   - Seçili ürünleri toplu sepete ekleme

4. **Fiyat Takibi:**
   - Favori ürün fiyat değişikliklerinde bildirim
   - Fiyat düşüşü bildirimleri

5. **Kategori Gösterimi:**
   - Ürünlerin kategori bilgisi gösterilebilir
   - Kategoriye göre filtreleme

6. **Arama:**
   - Favoriler içinde arama özelliği
   - Ürün adına göre filtreleme

7. **Export:**
   - Favorileri CSV/PDF olarak dışa aktarma
   - Paylaşma özelliği

8. **Cache Mekanizması:**
   - Favoriler localStorage'da cache'lenebilir
   - Daha hızlı yükleme

9. **Bildirimler:**
   - Yeni favori eklendiğinde bildirim
   - Favori kaldırıldığında bildirim

10. **Analytics:**
    - En çok favoriye eklenen ürünler
    - Favori ekleme/kaldırma istatistikleri

---

**Son Güncelleme:** 2024

