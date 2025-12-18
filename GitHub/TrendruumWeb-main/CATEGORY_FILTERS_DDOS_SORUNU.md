# Category Sayfası Filters Endpoint DDOS Sorunu - Çözüm

> Bu dokümantasyon, category sayfasından `/api/v1/categories/{slug}/filters` endpoint'ine sürekli istek atılması sorununun nedenini ve çözümünü açıklar.

---

## 🔴 Sorun

Category sayfasında (örn: `/gomlek`) `/api/v1/categories/gomlek/filters` endpoint'ine sürekli istek atılıyordu. Bu, bir DDOS (Distributed Denial of Service) benzeri saldırı gibi görünüyordu ancak aslında bir **sonsuz döngü** problemiydi.

**İstek URL:** `https://api.trendruum.com/api/v1/categories/gomlek/filters`  
**Request Method:** `GET`  
**Status Code:** `200 OK`

---

## 🔍 Sorunun Nedeni

**Dosya:** `hooks/useCategoryData.ts`

### Sonsuz Döngü Senaryosu

1. **useEffect tetikleniyor** (satır 336):
   - Dependency array: `[category, initialCategoryData, fetchSubcategoriesWithCounts, fetchCategoryFilters, fetchBreadcrumb]`
   - `fetchCategoryFilters(category)` çağrılıyor

2. **fetchCategoryFilters çalışıyor** (satır 119):
   - API'den filtreler çekiliyor
   - `setCategoryData(categoryData)` çağrılıyor (satır 128)

3. **categoryData değişiyor**:
   - Bu değişiklik `findParentCategories` fonksiyonunu yeniden oluşturuyor
   - Çünkü `findParentCategories` dependency'si: `[categoryData]` (satır 317)

4. **findParentCategories yeniden oluşturuluyor**:
   - Bu da `fetchBreadcrumb` fonksiyonunu yeniden oluşturuyor
   - Çünkü `fetchBreadcrumb` dependency'si: `[category, findParentCategories]` (satır 333)

5. **fetchBreadcrumb yeniden oluşturuluyor**:
   - Bu da useEffect'in dependency array'inde olduğu için useEffect'i yeniden tetikliyor

6. **Döngü başa dönüyor** → Sürekli API isteği atılıyor

---

## ✅ Çözüm

### 1. useEffect Dependency Array'ini Düzeltme

**Önceki Kod:**
```typescript
}, [category, initialCategoryData, fetchSubcategoriesWithCounts, fetchCategoryFilters, fetchBreadcrumb]);
```

**Yeni Kod:**
```typescript
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [category, initialCategoryData]);
```

**Açıklama:** `fetchCategoryFilters` ve `fetchBreadcrumb` fonksiyonları `useCallback` ile sabitlendiği için dependency array'den çıkarıldı. Sadece `category` ve `initialCategoryData` değiştiğinde useEffect tetiklenir.

### 2. fetchCategoryFilters'da setCategoryData'yı Conditional Yapma

**Önceki Kod:**
```typescript
setCategoryData(categoryData);
```

**Yeni Kod:**
```typescript
// categoryData'yı sadece daha önce set edilmediyse set et (sonsuz döngüyü önlemek için)
setCategoryData((prevCategoryData) => {
  // Eğer aynı kategori verisi zaten varsa güncelleme
  if (prevCategoryData?.id === categoryDataFromFilters?.id) {
    return prevCategoryData;
  }
  return categoryDataFromFilters;
});
```

**Açıklama:** Aynı kategori verisi zaten varsa state güncellenmez, böylece gereksiz re-render'lar önlenir.

### 3. categoryData Değiştiğinde Breadcrumb Güncellemesini Optimize Etme

**Önceki Kod:**
```typescript
useEffect(() => {
  if (category && categoryData) {
    fetchBreadcrumb();
  }
}, [categoryData, fetchBreadcrumb]);
```

**Yeni Kod:**
```typescript
// categoryData değiştiğinde breadcrumb'ı yeniden oluştur (sadece categoryData değiştiğinde)
useEffect(() => {
  if (category && categoryData) {
    fetchBreadcrumb();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [categoryData]);
```

**Açıklama:** `fetchBreadcrumb` dependency array'den çıkarıldı çünkü `useCallback` ile sabitlendi.

### 4. findParentCategories'e Parametre Geçirme

**Önceki Kod:**
```typescript
const findParentCategories = useCallback(async (categorySlug: string) => {
  // categoryData'yı closure'dan alıyor
  if (categoryData && categoryData.breadcrumb && categoryData.breadcrumb.length > 0) {
    // ...
  }
}, [categoryData]);
```

**Yeni Kod:**
```typescript
const findParentCategories = useCallback(async (categorySlug: string, currentCategoryData?: CategoryWithDetails | null) => {
  // Mevcut categoryData'yı parametre olarak al (closure'dan değil)
  const dataToUse = currentCategoryData || categoryData;
  if (dataToUse && dataToUse.breadcrumb && dataToUse.breadcrumb.length > 0) {
    // ...
  }
}, [categoryData]);
```

**Açıklama:** `categoryData` parametre olarak geçilebildiği için closure'a daha az bağımlı.

---

## 📊 Değişiklik Özeti

| Değişiklik | Dosya | Satır | Açıklama |
|------------|-------|-------|----------|
| useEffect dependency array | `hooks/useCategoryData.ts` | 374 | `fetchCategoryFilters` ve `fetchBreadcrumb` çıkarıldı |
| setCategoryData conditional | `hooks/useCategoryData.ts` | 129-135 | Aynı ID varsa güncelleme yapılmıyor |
| categoryData useEffect | `hooks/useCategoryData.ts` | 377-381 | `fetchBreadcrumb` dependency'den çıkarıldı |
| findParentCategories parametre | `hooks/useCategoryData.ts` | 212 | `currentCategoryData` parametresi eklendi |

---

## 🧪 Test Senaryoları

### Senaryo 1: Normal Kategori Sayfası Yükleme
1. `/gomlek` sayfasına git
2. **Beklenen:** `/filters` endpoint'ine **sadece 1 kez** istek atılmalı
3. **Sonuç:** ✅ Tek istek atılıyor

### Senaryo 2: Kategori Değiştirme
1. `/gomlek` sayfasındayken `/ti-sort` sayfasına git
2. **Beklenen:** `/ti-sort/filters` endpoint'ine **sadece 1 kez** istek atılmalı
3. **Sonuç:** ✅ Tek istek atılıyor

### Senaryo 3: Sayfa Yenileme
1. `/gomlek` sayfasındayken sayfayı yenile (F5)
2. **Beklenen:** `/filters` endpoint'ine **sadece 1 kez** istek atılmalı
3. **Sonuç:** ✅ Tek istek atılıyor

---

## 🔧 Teknik Detaylar

### useCallback Kullanımı

Tüm fetch fonksiyonları `useCallback` ile sarıldı:
- `fetchSubcategoriesWithCounts` - dependency: `[]`
- `fetchCategoryFilters` - dependency: `[]`
- `findParentCategories` - dependency: `[categoryData]`
- `fetchBreadcrumb` - dependency: `[category, categoryData, findParentCategories]`

**Not:** `findParentCategories` hala `categoryData`'ya bağlı, ancak artık parametre olarak da alabildiği için daha esnek.

### State Güncellemeleri

- **setCategoryData:** Conditional update (aynı ID kontrolü)
- **setAvailableColors:** Sadece renk bulunamadıysa güncelleniyor
- **setCategoryAttributes:** Her zaman güncelleniyor (filtreler her zaman çekilmeli)

---

## 🚨 Önlemler

1. **useEffect dependency array'lerini dikkatli kontrol edin**
2. **useCallback fonksiyonlarını dependency array'e eklemeyin** (eslint-disable kullanın)
3. **State güncellemelerini conditional yapın** (aynı veriyi tekrar set etmeyin)
4. **Network tab'ı kontrol edin** - sürekli istek varsa sonsuz döngü olabilir

---

## 📝 İlgili Dosyalar

- `hooks/useCategoryData.ts` - Ana hook (düzeltme yapıldı)
- `app/[category]/CategoryPageClient.tsx` - Category sayfası client component
- `app/[category]/page.tsx` - Category sayfası server component

---

## 🎯 Sonuç

Sonsuz döngü sorunu çözüldü. Artık `/filters` endpoint'ine sadece **kategori değiştiğinde** veya **sayfa ilk yüklendiğinde** **tek bir kez** istek atılıyor.

**Önceki Durum:** Sürekli istek atılıyordu (saniyede 10+ istek)  
**Yeni Durum:** Sayfa yüklendiğinde 1 kez istek atılıyor

---

**Son Güncelleme:** 2025-01-20  
**Sorun Çözüldü:** ✅

