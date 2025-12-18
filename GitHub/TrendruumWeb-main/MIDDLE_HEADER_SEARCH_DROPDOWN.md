# MiddleHeader Search Dropdown - Endpoint ve Çalışma Mantığı

Bu dokümantasyon, MiddleHeader'daki arama kutusuna yazıldığında açılan dropdown'un endpoint'ini ve çalışma mantığını açıklamaktadır.

---

## 📋 Genel Bakış

**Component Yapısı:**
- **Ana Component:** `MiddleHeader` (`components/layout/header/MiddleHeader.tsx`)
- **Dropdown Component:** `SmartSearchDropdown` (`components/layout/SmartSearchDropdown.tsx`)
- **Service:** `smartSearchService` (`app/services/smartSearchService.ts`)

**Çalışma Prensibi:**
Kullanıcı arama kutusuna yazdığında, dropdown açılır ve `smartSearchService` üzerinden API'ye istek atılır. Sonuçlar gerçek zamanlı olarak gösterilir.

---

## 🔌 API Endpoint

### Ana Endpoint

```
GET /api/v1/products/search?name={query}
```

**Base URL:** `https://api.trendruum.com/api/v1`

**Parametreler:**
- `name` (query parameter): Arama terimi (URL encode edilmiş)

**Örnek:**
```
GET https://api.trendruum.com/api/v1/products/search?name=elbise
```

**Request Headers:**
```json
{
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Timeout:** 30 saniye

---

## 📦 API Response Yapısı

### Başarılı Response

```json
{
  "meta": {
    "status": "success",
    "message": "...",
    "code": 200
  },
  "data": {
    "products": [
      {
        "id": "product-id",
        "name": "Ürün Adı",
        "slug": "urun-adi",
        "price": 299.99,
        "medias": [
          {
            "url": "https://...",
            "type": "image"
          }
        ],
        "images": [
          {
            "url": "https://...",
            "name": "..."
          }
        ],
        "brand_v2": {
          "name": "Marka Adı",
          "slug": "marka-adi"
        },
        "average_rating": 4.5,
        "review_count": 123
      }
    ],
    "filters": {
      "brands": [
        {
          "id": "brand-id",
          "name": "Marka Adı",
          "slug": "marka-adi",
          "image": {
            "url": "https://..."
          }
        }
      ],
      "categories": [
        {
          "id": "category-id",
          "name": "Kategori Adı",
          "slug": "kategori-adi",
          "image": {
            "url": "https://..."
          }
        }
      ],
      "sellers": [
        {
          "id": "seller-id",
          "name": "Satıcı Adı",
          "slug": "satici-adi",
          "image": {
            "url": "https://..."
          }
        }
      ]
    },
    "suggestions": {
      "keywords": [
        "elbise",
        "kadın elbise",
        "yazlık elbise"
      ]
    }
  }
}
```

---

## 🔄 Çalışma Mantığı

### 1. Kullanıcı Input'u

**Trigger:** Kullanıcı arama kutusuna yazmaya başladığında

**Component:** `MiddleHeader.tsx`

```typescript
<input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onFocus={handleSearchFocus}
  onClick={handleSearchClick}
  onKeyDown={handleKeyPress}
  placeholder="Marka, kategori, mağaza veya ürün ara..."
/>
```

**State Yönetimi:**
- `searchQuery`: Arama terimi
- `isSearchFocused`: Dropdown açık mı?

---

### 2. Dropdown Açılması

**Koşul:** 
- `isSearchFocused === true` olduğunda
- Minimum 2 karakter yazıldığında

**Component:** `SmartSearchDropdown.tsx`

```typescript
{isSearchFocused && (
  <SmartSearchDropdown
    isOpen={isSearchFocused}
    onClose={() => setIsSearchFocused(false)}
    searchQuery={searchQuery}
    setSearchQuery={setSearchQuery}
    anchorRef={desktopSearchContainerRef}
  />
)}
```

---

### 3. API İsteği

**Service:** `smartSearchService.searchAll(query, limit)`

**Dosya:** `app/services/smartSearchService.ts`

**Çalışma Mantığı:**

```typescript
// 1. Query kontrolü
if (!query.trim() || query.trim().length < 2) {
  return { results: [], total: 0, hasMore: false };
}

// 2. API isteği
const response = await axios.get(
  `https://api.trendruum.com/api/v1/products/search?name=${encodeURIComponent(query)}`,
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    timeout: 30000
  }
);

// 3. Response parse
if (response.data.meta?.status === 'success') {
  const data = response.data.data;
  
  // 4. Verileri ayır
  const allBrands = data.filters?.brands || [];
  const allCategories = data.filters?.categories || [];
  const allProducts = Array.isArray(data.products) 
    ? data.products 
    : (data.products?.data || []);
  const allSellers = data.filters?.sellers || [];
  const keywords = data.suggestions?.keywords || [];
  
  // 5. Sonuçları birleştir ve formatla
  // ...
}
```

---

### 4. Sonuç Formatlama

**Sonuç Türleri:**
1. **Keywords** (Öneriler)
2. **Brands** (Markalar)
3. **Categories** (Kategoriler)
4. **Stores** (Mağazalar) - Statik liste + API'den gelenler
5. **Products** (Ürünler)

**Formatlama:**

```typescript
// Keywords
...keywords.map((keyword: string, index: number) => ({
  id: `keyword-${index}-${keyword}`,
  name: keyword,
  slug: keyword.toLowerCase().replace(/\s+/g, '-'),
  type: 'keyword'
}))

// Brands
...allBrands.map((b: any) => ({
  id: b.id,
  name: b.name,
  slug: b.slug,
  image: b.image?.url,
  type: 'brand'
}))

// Categories
...allCategories.map((c: any) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  image: c.image?.url,
  type: 'category'
}))

// Products
...allProducts
  .filter((p: any) => {
    // Sadece resmi olan ürünleri göster
    const hasImages = (p.medias && p.medias.length > 0) || (p.images && p.images.length > 0);
    const hasName = p.name && p.name.trim() !== '';
    const hasId = p.id && p.id.trim() !== '';
    return hasName && hasId && hasImages;
  })
  .map((p: any) => {
    // Resim URL'ini bul
    let imageUrl = '';
    if (p.medias && Array.isArray(p.medias) && p.medias.length > 0) {
      imageUrl = p.medias[0].url || '';
    } else if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      imageUrl = p.images[0].url || '';
    }
    
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: imageUrl,
      price: p.price,
      brand: p.brand_v2?.name,
      rating: p.average_rating,
      review_count: p.review_count,
      type: 'product'
    };
  })
```

---

### 5. Sonuç Sıralama

**Öncelik Sırası:**
1. **Tür Önceliği:** Keyword > Marka > Kategori > Mağaza > Ürün
2. **Eşleşme Önceliği:** Tam eşleşme > Başlangıç eşleşmesi > İçinde geçme
3. **Alfabetik Sıralama:** Aynı öncelik seviyesindeyse

**Sıralama Fonksiyonu:**

```typescript
private prioritizeResults(results: SearchResult[], query: string): SearchResult[] {
  const queryLower = query.toLowerCase();
  
  return results.sort((a, b) => {
    const aNameLower = a.name.toLowerCase();
    const bNameLower = b.name.toLowerCase();
    
    // 1. Tür önceliği
    const typePriority = { keyword: 0, brand: 1, category: 2, store: 3, product: 4 };
    const aTypePriority = typePriority[a.type] ?? 5;
    const bTypePriority = typePriority[b.type] ?? 5;
    
    if (aTypePriority !== bTypePriority) {
      return aTypePriority - bTypePriority;
    }
    
    // 2. Tam eşleşme
    const aExactMatch = aNameLower === queryLower;
    const bExactMatch = bNameLower === queryLower;
    
    if (aExactMatch && !bExactMatch) return -1;
    if (!aExactMatch && bExactMatch) return 1;
    
    // 3. Başlangıç eşleşmesi
    const aStartsWith = aNameLower.startsWith(queryLower);
    const bStartsWith = bNameLower.startsWith(queryLower);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // 4. İçinde geçme
    const aIncludes = aNameLower.includes(queryLower);
    const bIncludes = bNameLower.includes(queryLower);
    
    if (aIncludes && !bIncludes) return -1;
    if (!aIncludes && bIncludes) return 1;
    
    // 5. Alfabetik
    return a.name.localeCompare(b.name, 'tr');
  });
}
```

---

### 6. UI Render

**Desktop Görünüm:**
- Fixed position dropdown
- Portal kullanarak body'ye render edilir
- Anchor ref'e göre pozisyonlanır

**Mobile Görünüm:**
- Full-screen modal
- Fixed position overlay

**Sonuç Gösterimi:**
- Keywords: 🔍 icon ile
- Products: Resim, fiyat, marka, rating ile
- Brands/Categories/Stores: Tür etiketi ile

---

## ⚡ Performans Optimizasyonları

### 1. Debouncing

**Mevcut Durum:** ❌ Debouncing yok

**Not:** Her karakter değişikliğinde API isteği atılıyor. Bu performans sorununa yol açabilir.

**Öneri:** Debouncing eklenebilir:
```typescript
useEffect(() => {
  const trimmedQuery = searchQuery.trim();
  
  if (!isOpen || trimmedQuery.length < 2) {
    setSearchResults([]);
    setIsLoading(false);
    return;
  }
  
  // Debounce ekle
  const timeoutId = setTimeout(() => {
    performSearch();
  }, 300); // 300ms bekle
  
  return () => {
    clearTimeout(timeoutId);
    isCancelled = true;
  };
}, [searchQuery, isOpen]);
```

### 2. Request Cancellation

**Mevcut Durum:** ✅ Var

```typescript
let isCancelled = false;

const performSearch = async () => {
  setIsLoading(true);
  try {
    const results = await smartSearchService.searchAll(trimmedQuery, 1000);
    if (!isCancelled) {
      setSearchResults(results.results);
    }
  } catch (error) {
    if (!isCancelled) {
      setSearchResults([]);
    }
  } finally {
    if (!isCancelled) {
      setIsLoading(false);
    }
  }
};

return () => {
  isCancelled = true;
};
```

### 3. Minimum Karakter Kontrolü

**Mevcut Durum:** ✅ Var (2 karakter)

```typescript
if (!isOpen || trimmedQuery.length < 2) {
  setSearchResults([]);
  setIsLoading(false);
  return;
}
```

---

## 💾 LocalStorage Kullanımı

### Geçmiş Aramalar

**Key:** `recentSearches`

**Format:**
```json
["elbise", "sneaker", "iphone", "parfüm", "çanta"]
```

**Kullanım:**
- Son 5 arama saklanır
- Dropdown açıldığında ve query boşsa gösterilir
- Sonuç tıklandığında güncellenir

**Kod:**
```typescript
// Yükleme
useEffect(() => {
  const savedSearches = localStorage.getItem("recentSearches");
  if (savedSearches) {
    try {
      const searches = JSON.parse(savedSearches);
      setRecentSearches(searches.slice(0, 5));
    } catch (error) {
      setRecentSearches([]);
    }
  }
}, []);

// Kaydetme
const handleResultClick = (result: SearchResult) => {
  const newRecentSearches = [
    result.name,
    ...recentSearches.filter((s) => s !== result.name),
  ].slice(0, 5);
  setRecentSearches(newRecentSearches);
  localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
};
```

---

## 🎯 Sonuç Tıklama ve Yönlendirme

### Yönlendirme Mantığı

**Component:** `SmartSearchDropdown.tsx`

```typescript
const handleResultClick = (result: SearchResult) => {
  // Geçmiş aramalara ekle
  const newRecentSearches = [
    result.name,
    ...recentSearches.filter((s) => s !== result.name),
  ].slice(0, 5);
  setRecentSearches(newRecentSearches);
  localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

  // Sonuç türüne göre yönlendir
  switch (result.type) {
    case "keyword":
      // Keyword için arama sayfasına yönlendir
      const keywordSearchUrl = processSearchTerm(result.name);
      router.push(keywordSearchUrl);
      break;
    case "product":
      router.push(createProductUrl(result.slug));
      break;
    case "brand":
      router.push(`/markalar/${result.slug}`);
      break;
    case "category":
      router.push(`/${result.slug}`);
      break;
    case "store":
      router.push(`/magaza/${result.slug}`);
      break;
  }

  setTimeout(() => {
    onClose();
  }, 100);
};
```

**Yönlendirme URL'leri:**
- **Keyword:** `/q?q={keyword}` (processSearchTerm ile işlenir)
- **Product:** `/urunler/{slug}`
- **Brand:** `/markalar/{slug}`
- **Category:** `/{slug}`
- **Store:** `/magaza/{slug}`

---

## 🔍 Özel Durumlar

### 1. Mağazalar (Stores)

**Kaynak:**
- Statik liste: `app/data/stores.ts` (searchStores fonksiyonu)
- API'den gelen: `data.filters.sellers`

**Birleştirme:**
```typescript
const staticStores = searchStores(query, 50);
const apiStores = allSellers.map((s: any) => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  image: s.image?.url
}));

// Duplikasyonları kaldır
const allStores = [...staticStores];
apiStores.forEach((apiStore: any) => {
  if (!allStores.some(store => 
    store.id === apiStore.id || 
    store.name.toLowerCase() === apiStore.name.toLowerCase()
  )) {
    allStores.push(apiStore);
  }
});
```

### 2. Ürün Filtreleme

**Filtreleme Kriterleri:**
- Resim olmalı (`medias` veya `images` array'i dolu)
- İsim olmalı (`name` var ve boş değil)
- ID olmalı (`id` var ve boş değil)

**Kod:**
```typescript
.filter((p: any) => {
  const hasImages = (p.medias && p.medias.length > 0) || (p.images && p.images.length > 0);
  const hasName = p.name && p.name.trim() !== '';
  const hasId = p.id && p.id.trim() !== '';
  return hasName && hasId && hasImages;
})
```

### 3. Resim URL Bulma

**Öncelik:**
1. `medias[0].url`
2. `images[0].url`

**Kod:**
```typescript
let imageUrl = '';
if (p.medias && Array.isArray(p.medias) && p.medias.length > 0) {
  imageUrl = p.medias[0].url || '';
} else if (p.images && Array.isArray(p.images) && p.images.length > 0) {
  imageUrl = p.images[0].url || '';
}
```

---

## 📱 Responsive Davranış

### Desktop (≥768px)

- Dropdown: Fixed position, anchor ref'e göre pozisyonlanır
- Portal kullanılır
- Click outside ile kapanır

### Mobile (<768px)

- Full-screen modal
- Fixed position overlay
- Kendi kapama kontrolü var

---

## 🐛 Hata Yönetimi

### API Hataları

**Mevcut Durum:** Sessizce handle edilir

```typescript
try {
  const results = await smartSearchService.searchAll(trimmedQuery, 1000);
  if (!isCancelled) {
    setSearchResults(results.results);
  }
} catch (error) {
  if (!isCancelled) {
    setSearchResults([]); // Boş sonuç göster
  }
}
```

**Service Seviyesinde:**
```typescript
catch (_error) {
  // Return empty results instead of throwing error to prevent UI crashes
  return { results: [], total: 0, hasMore: false };
}
```

---

## 📊 Akış Şeması

```
Kullanıcı Input
    ↓
searchQuery state güncellenir
    ↓
isSearchFocused === true && query.length >= 2?
    ↓ YES
SmartSearchDropdown render edilir
    ↓
useEffect tetiklenir
    ↓
smartSearchService.searchAll() çağrılır
    ↓
API isteği: GET /api/v1/products/search?name={query}
    ↓
Response parse edilir
    ↓
Sonuçlar formatlanır (keywords, brands, categories, stores, products)
    ↓
Sonuçlar sıralanır (öncelik sırasına göre)
    ↓
UI'da gösterilir
    ↓
Kullanıcı sonuç seçer
    ↓
Yönlendirme yapılır
    ↓
Dropdown kapanır
```

---

## 🔧 Özelleştirme Noktaları

### 1. Minimum Karakter Sayısı

**Dosya:** `components/layout/SmartSearchDropdown.tsx`

**Mevcut:** 2 karakter

**Değiştirme:**
```typescript
if (!isOpen || trimmedQuery.length < 2) { // Burayı değiştir
  setSearchResults([]);
  setIsLoading(false);
  return;
}
```

### 2. Sonuç Limiti

**Dosya:** `app/services/smartSearchService.ts`

**Mevcut:** Limit yok (tüm sonuçlar)

**Değiştirme:**
```typescript
async searchAll(query: string, limit: number = 10): Promise<SmartSearchResponse> {
  // limit parametresini kullan
  return {
    results: sortedResults.slice(0, limit),
    total: allResults.length,
    hasMore: allResults.length > limit
  };
}
```

### 3. Timeout Süresi

**Dosya:** `app/services/smartSearchService.ts`

**Mevcut:** 30 saniye

**Değiştirme:**
```typescript
timeout: 30000 // Burayı değiştir
```

---

## 📝 Özet

1. **Endpoint:** `GET /api/v1/products/search?name={query}`
2. **Minimum Karakter:** 2 karakter
3. **Timeout:** 30 saniye
4. **Sonuç Türleri:** Keywords, Brands, Categories, Stores, Products
5. **Sıralama:** Tür önceliği + eşleşme önceliği
6. **Caching:** LocalStorage'da geçmiş aramalar (son 5)
7. **Debouncing:** ❌ Yok (eklenebilir)
8. **Request Cancellation:** ✅ Var

---

## 🚀 İyileştirme Önerileri

1. **Debouncing Ekle:** Her karakter değişikliğinde API isteği atmak yerine, 300ms bekle
2. **Caching:** API sonuçlarını cache'le (React Query veya benzeri)
3. **Loading States:** Daha iyi loading göstergeleri
4. **Error Handling:** Kullanıcıya hata mesajı göster
5. **Accessibility:** Keyboard navigation iyileştir
6. **Analytics:** Arama istatistikleri topla

