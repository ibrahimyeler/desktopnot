# Favori İkonu İşlemleri ve Endpoint'leri

Bu dokümantasyon, ürün detay sayfasında favori ikonuna basıldığında gerçekleşen tüm işlemleri, kullanılan endpoint'leri ve veri akışını detaylı olarak açıklar.

## Genel Bakış

Favori ikonu, ürün detay sayfasında (`ProductPageClient`) ve `ProductActions` component'inde kullanılır. İşlem akışı şu şekildedir:

1. Kullanıcı favori ikonuna tıklar
2. Login kontrolü yapılır
3. Ürünün favorilerde olup olmadığı kontrol edilir
4. Favorilere ekleme veya favorilerden çıkarma işlemi gerçekleştirilir
5. Favoriler listesi yenilenir
6. UI güncellenir (ikon durumu değişir)

---

## Component Hiyerarşisi

```
ProductPageClient
  └── ProductActions
       └── Favori İkonu (HeartIcon)
```

---

## 1. Favori İkonu Render Edilmesi

### ProductActions Component'i

**Dosya:** `components/product/details/ProductActions.tsx`

Favori ikonu, `ProductActions` component'inde render edilir:

```typescript
// İkon import'ları
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// İkon durumu kontrolü
const isFavorited = isInFavoritesProp || isInFavorites(product.id);

// İkon render
{isFavorited ? (
  <HeartSolidIcon className="w-5 h-5" />
) : (
  <HeartIcon className="w-5 h-5" />
)}
```

**İkon Durumları:**
- **Boş kalp (HeartIcon)**: Ürün favorilerde değil
- **Dolu kalp (HeartSolidIcon)**: Ürün favorilerde

---

## 2. Favori İkonuna Tıklama İşlemi

### ProductActions Component'inde İşlem Akışı

**Dosya:** `components/product/details/ProductActions.tsx`

```typescript
const handleFavoriteClick = async () => {
  // 1. Eğer parent component'ten onFavoriteClick prop'u geliyorsa, onu çağır
  if (onFavoriteClick) {
    await onFavoriteClick();
    return;
  }

  // 2. Login kontrolü
  if (!isLoggedIn) {
    toast.error('Favorilere eklemek için giriş yapmalısınız');
    router.push('/giris');
    return;
  }

  // 3. Loading state'i aktif et
  if (favoriteLoading) return;
  setFavoriteLoading(true);

  try {
    // 4. Ürün favorilerde mi kontrol et
    if (isFavorited) {
      // 5a. Favorilerden çıkar
      await removeFavorite(product.id);
      toast.success('Ürün favorilerden kaldırıldı');
    } else {
      // 5b. Favorilere ekle
      await addToFavorites(product.id);
      toast.success('Ürün favorilere eklendi');
    }
  } catch (error) {
    toast.error('İşlem sırasında bir hata oluştu');
  } finally {
    setFavoriteLoading(false);
  }
};
```

### ProductPageClient'te İşlem Akışı

**Dosya:** `app/urunler/[slug]/ProductPageClient.tsx`

`ProductActions` component'ine `onFavoriteClick` prop'u geçilir:

```typescript
const handleFavoriteClick = async () => {
  // 1. Login kontrolü
  if (!isLoggedIn) {
    toast.error('Favorilere eklemek için giriş yapmalısınız');
    return;
  }

  // 2. Ürün kontrolü
  if (!product) return;

  try {
    // 3. Ürün favorilerde mi kontrol et
    if (isInFavorites(product.id)) {
      // 4a. Favorilerden çıkar
      await removeFavorite(product.id);
      toast.success('Ürün favorilerden kaldırıldı');
    } else {
      // 4b. Favorilere ekle
      await addToFavorites(product.id);
      toast.success('Ürün favorilere eklendi');
    }
  } catch (error) {
    toast.error('Bir hata oluştu');
  }
};

// ProductActions'a prop olarak geçilir
<ProductActions
  onFavoriteClick={handleFavoriteClick}
  isInFavorites={isInFavorites(product.id)}
  // ... diğer props
/>
```

---

## 3. FavoriteContext İşlemleri

**Dosya:** `app/context/FavoriteContext.tsx`

Tüm favori işlemleri `FavoriteContext` içinde yönetilir. Context, aşağıdaki fonksiyonları sağlar:

- `addToFavorites(productId: string)`: Ürünü favorilere ekler
- `removeFavorite(productId: string)`: Ürünü favorilerden çıkarır
- `refreshFavorites()`: Favoriler listesini yeniler
- `isInFavorites(productId: string)`: Ürünün favorilerde olup olmadığını kontrol eder

---

## 4. API Endpoint'leri

### 4.1. Favorilere Ekleme

**Endpoint:** `POST /api/v1/customer/likes`

**Method:** `POST`

**Authentication:** ✅ Bearer token gerekli

**Request Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Request Body:**
```json
{
  "product_id": "string"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün favorilere eklendi",
    "code": 200
  },
  "data": {
    // Ürün bilgileri
  }
}
```

**Kod İmplementasyonu:**
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
      await refreshFavorites(); // Favoriler listesini yenile
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    setError('Failed to add to favorites');
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı login sayfasına yönlendir
      localStorage.removeItem('token');
      window.location.href = '/giris';
    } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
      // Kullanıcı giriş yapmamış, bu durumda toast mesajı gösterme
    } else {
      toast.error('Ürün favorilere eklenirken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
};
```

---

### 4.2. Favorilerden Çıkarma

**Endpoint:** `DELETE /api/v1/customer/likes/{productId}`

**Method:** `DELETE`

**Authentication:** ✅ Bearer token gerekli

**Request Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**URL Parameters:**
- `productId`: Favorilerden çıkarılacak ürün ID'si

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Ürün favorilerden kaldırıldı",
    "code": 200
  },
  "data": {}
}
```

**Kod İmplementasyonu:**
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
      await refreshFavorites(); // Favoriler listesini yenile
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    setError('Failed to remove from favorites');
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı login sayfasına yönlendir
      localStorage.removeItem('token');
      window.location.href = '/giris';
    } else if (error instanceof Error && error.message === 'Kullanıcı giriş yapmamış') {
      // Kullanıcı giriş yapmamış, bu durumda toast mesajı gösterme
    } else {
      toast.error('Ürün favorilerden kaldırılırken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
};
```

---

### 4.3. Favoriler Listesini Getirme

**Endpoint:** `GET /api/v1/customer/likes`

**Method:** `GET`

**Authentication:** ✅ Bearer token gerekli

**Request Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response:**
```json
{
  "meta": {
    "status": "success",
    "message": "Favoriler başarıyla getirildi",
    "code": 200
  },
  "data": [
    {
      "id": "product_id",
      "name": "Ürün Adı",
      "slug": "urun-slug",
      "price": 100.00,
      "medias": [
        {
          "id": "media_id",
          "url": "https://example.com/image.jpg"
        }
      ],
      "images": [
        {
          "url": "https://example.com/image.jpg"
        }
      ],
      "like_count": 10,
      "badges": {},
      "view": 100,
      "cpid": "cpid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Kod İmplementasyonu:**
```typescript
const refreshFavorites = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    if (!isLoggedIn) {
      // Login olmamış kullanıcılar için favorileri temizle
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
        // Handle different media structures
        let medias = [];
        let images = [];
        
        if (item.medias && Array.isArray(item.medias)) {
          // Standard medias array structure
          medias = item.medias;
          images = item.medias.map((media: any) => ({ url: media.url }));
        } else {
          // Handle numbered keys structure (0, 1, 2, etc.)
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
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    setError('Failed to refresh favorites');
    
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Token geçersiz, favorileri temizle
      localStorage.removeItem('token');
      setFavorites([]);
      setFavoritesCount(0);
    } else {
      toast.error('Favoriler yüklenirken bir hata oluştu');
    }
  } finally {
    setLoading(false);
  }
}, [isLoggedIn]);
```

**Not:** `refreshFavorites` fonksiyonu, `addToFavorites` ve `removeFavorite` işlemlerinden sonra otomatik olarak çağrılır.

---

## 5. İşlem Akış Şeması

```
┌─────────────────────────────────────────────────────────────┐
│  Kullanıcı Favori İkonuna Tıklar                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  ProductActions.handleFavoriteClick()                       │
│  - onFavoriteClick prop'u var mı kontrol et                 │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────────────┐
│ onFavoriteClick  │   │ ProductActions içinde        │
│ prop'u varsa     │   │ direkt işlem yap             │
│ (ProductPageClient│   │                              │
│  handleFavoriteClick)│                              │
└────────┬─────────┘   └──────────────┬───────────────┘
         │                             │
         └───────────┬─────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Login Kontrolü                                             │
│  - isLoggedIn kontrolü                                      │
│  - Token kontrolü                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
    ❌ Login Yok            ✅ Login Var
         │                       │
         ▼                       ▼
┌──────────────────┐   ┌──────────────────────────────┐
│ Toast: "Favorilere│   │ isInFavorites(product.id)    │
│ eklemek için     │   │ kontrolü                     │
│ giriş yapmalısınız"│                              │
│                  │   └──────────────┬───────────────┘
│ /giris sayfasına │                  │
│ yönlendir        │         ┌────────┴────────┐
└──────────────────┘         │                │
                    Favorilerde Var    Favorilerde Yok
                             │                │
                             ▼                ▼
                ┌──────────────────┐  ┌──────────────────┐
                │ removeFavorite() │  │ addToFavorites()  │
                └────────┬─────────┘  └────────┬─────────┘
                         │                      │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ DELETE /customer/likes/{id}  │
                    │ veya                          │
                    │ POST /customer/likes          │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ refreshFavorites()            │
                    │ GET /customer/likes           │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Context State Güncellemesi    │
                    │ - favorites array güncellenir │
                    │ - favoritesCount güncellenir  │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ UI Güncellemesi                 │
                    │ - İkon durumu değişir           │
                    │ - Toast mesajı gösterilir      │
                    │ - Component'ler yeniden render │
                    └─────────────────────────────────┘
```

---

## 6. Hata Yönetimi

### 6.1. Authentication Hataları (401)

**Durum:** Token geçersiz veya süresi dolmuş

**İşlem:**
1. `localStorage.removeItem('token')` ile token silinir
2. Kullanıcı `/giris` sayfasına yönlendirilir
3. Favoriler listesi temizlenir

**Kod:**
```typescript
if (axios.isAxiosError(error) && error.response?.status === 401) {
  localStorage.removeItem('token');
  window.location.href = '/giris';
  setFavorites([]);
  setFavoritesCount(0);
}
```

### 6.2. Login Olmamış Kullanıcı

**Durum:** Kullanıcı giriş yapmamış

**İşlem:**
1. Toast mesajı gösterilir: "Favorilere eklemek için giriş yapmalısınız"
2. Kullanıcı `/giris` sayfasına yönlendirilir

**Kod:**
```typescript
if (!isLoggedIn) {
  toast.error('Favorilere eklemek için giriş yapmalısınız');
  router.push('/giris');
  return;
}
```

### 6.3. Genel Hatalar

**Durum:** Network hatası, API hatası vb.

**İşlem:**
1. Toast mesajı gösterilir
2. Error state güncellenir
3. Loading state kapatılır

**Kod:**
```typescript
catch (error) {
  toast.error('Ürün favorilere eklenirken bir hata oluştu');
  setError('Failed to add to favorites');
} finally {
  setLoading(false);
}
```

---

## 7. State Yönetimi

### FavoriteContext State'leri

```typescript
interface FavoriteContextType {
  favorites: Product[];              // Favori ürünler listesi
  loading: boolean;                  // Yükleniyor mu?
  error: string | null;              // Hata mesajı
  addToFavorites: (productId: string) => Promise<void>;
  removeFavorite: (productId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isInFavorites: (productId: string) => boolean;
  favoritesCount: number;             // Toplam favori sayısı
  incrementFavoritesCount: () => void;
  decrementFavoritesCount: () => void;
}
```

### Local State'ler

**ProductActions Component:**
- `favoriteLoading: boolean` - Favori işlemi yükleniyor mu?

**ProductPageClient:**
- `product: ProductResponse['data']` - Ürün bilgileri
- `isLoggedIn: boolean` - Kullanıcı giriş yapmış mı? (AuthContext'ten)

---

## 8. Kullanılan Kütüphaneler ve Hook'lar

### Kütüphaneler
- `axios`: HTTP istekleri için
- `react-hot-toast`: Toast mesajları için
- `@heroicons/react`: İkonlar için

### Hook'lar
- `useFavorites()`: Favori işlemleri için
- `useAuth()`: Authentication kontrolü için
- `useState()`: Local state yönetimi için
- `useCallback()`: Fonksiyon memoization için
- `useEffect()`: Side effect'ler için

---

## 9. Özet Tablo

| İşlem | Endpoint | Method | Auth | Açıklama |
|-------|----------|--------|------|----------|
| Favorilere Ekle | `/api/v1/customer/likes` | POST | ✅ | Ürünü favorilere ekler |
| Favorilerden Çıkar | `/api/v1/customer/likes/{productId}` | DELETE | ✅ | Ürünü favorilerden çıkarır |
| Favorileri Getir | `/api/v1/customer/likes` | GET | ✅ | Kullanıcının favorilerini getirir |

---

## 10. Önemli Notlar

1. **Token Yönetimi:** Tüm favori işlemleri için Bearer token gereklidir. Token `localStorage`'dan alınır.

2. **Otomatik Yenileme:** `addToFavorites` ve `removeFavorite` işlemlerinden sonra `refreshFavorites()` otomatik olarak çağrılır.

3. **Login Kontrolü:** Her işlem öncesi login kontrolü yapılır. Login olmayan kullanıcılar `/giris` sayfasına yönlendirilir.

4. **Error Handling:** 401 hatası durumunda token silinir ve kullanıcı login sayfasına yönlendirilir.

5. **UI Feedback:** Tüm işlemler için toast mesajları gösterilir (başarı/hata durumları).

6. **Loading States:** İşlem sırasında loading state'leri aktif edilir ve UI'da gösterilir.

7. **Media Structure:** API'den gelen medya yapısı farklı formatlarda olabilir (array veya numbered keys). Her iki durum da handle edilir.

---

## 11. İlgili Dosyalar

- `app/urunler/[slug]/ProductPageClient.tsx` - Ana ürün detay sayfası
- `components/product/details/ProductActions.tsx` - Favori ikonu ve işlemleri
- `app/context/FavoriteContext.tsx` - Favori state yönetimi ve API çağrıları
- `app/context/AuthContext.tsx` - Authentication kontrolü
- `lib/config.ts` - API URL konfigürasyonu

