# 🏪 Takip Ettiğim Mağazalar Sayfası - Detaylı Dokümantasyon

Bu dokümantasyon, "Takip Ettiğim Mağazalar" sayfasının nasıl göründüğünü, nasıl çalıştığını ve kullanılan endpoint'leri detaylı olarak açıklamaktadır.

---

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sayfa Yapısı ve Görünüm](#sayfa-yapısı-ve-görünüm)
3. [API Endpoint'leri](#api-endpointleri)
4. [Interface'ler ve Veri Yapıları](#interfaceler-ve-veri-yapıları)
5. [Akış Diyagramları](#akış-diyagramları)
6. [Kullanım Senaryoları](#kullanım-senaryoları)
7. [Özellikler ve Limitler](#özellikler-ve-limitler)
8. [İlgili Dosyalar](#ilgili-dosyalar)

---

## 🔍 Genel Bakış

**Sayfa URL:** `/hesabim/takip-ettigim-magazalar`

**Açıklama:** Kullanıcıların takip ettikleri mağazaların (satıcıların) listelendiği sayfa. Kullanıcılar bu sayfada takip ettikleri mağazaları görüntüleyebilir, mağazalarına gidebilir ve takibi bırakabilir.

**Dosya Yapısı:**
- Server Component: `app/hesabim/takip-ettigim-magazalar/page.tsx`
- Client Component: `app/hesabim/takip-ettigim-magazalar/FollowedStoresPageClient.tsx`

---

## 📄 Sayfa Yapısı ve Görünüm

### Desktop Görünümü

```
┌─────────────────────────────────────────────────────────────┐
│ Header (Header component)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌────────────────────────────────────┐  │
│  │              │  │  ← [Geri] 🏪 Takip Ettiğim Mağazalar│  │
│  │ Account      │  │                                      │  │
│  │ Sidebar      │  │  ┌────────────────────────────────┐ │  │
│  │              │  │  │ 🏪 Mağaza 1                     │ │  │
│  │ - Hesabım    │  │  │ 150 takipçi • 15 Ocak 2024    │ │  │
│  │ - Siparişler │  │  │ [Mağazaya Git] [Takibi Bırak] │ │  │
│  │ - Favoriler  │  │  └────────────────────────────────┘ │  │
│  │ - ...        │  │                                      │  │
│  │              │  │  ┌────────────────────────────────┐ │  │
│  │              │  │  │ 🏪 Mağaza 2                     │ │  │
│  │              │  │  │ 89 takipçi • 20 Ocak 2024     │ │  │
│  │              │  │  │ [Mağazaya Git] [Takibi Bırak] │ │  │
│  │              │  │  └────────────────────────────────┘ │  │
│  └──────────────┘  └────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Görünümü

```
┌─────────────────────────────┐
│ Header                      │
├─────────────────────────────┤
│ ← 🏪 Takip Ettiğim Mağazalar ☰ │
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ 🏪 Mağaza 1             │ │
│ │ 150 takipçi             │ │
│ │ 15 Ocak 2024 tarihinden │ │
│ │ beri takip ediliyor     │ │
│ │ [Mağazaya Git] [Takibi  │ │
│ │           Bırak]        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🏪 Mağaza 2             │ │
│ │ 89 takipçi              │ │
│ │ 20 Ocak 2024 tarihinden │ │
│ │ beri takip ediliyor     │ │
│ │ [Mağazaya Git] [Takibi  │ │
│ │           Bırak]        │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
```

### Boş Durum (Mağaza Yoksa)

```
┌─────────────────────────────┐
│                             │
│        ┌─────────┐          │
│        │   🏪    │          │
│        └─────────┘          │
│                             │
│   Henüz mağaza takip        │
│      etmiyorsunuz           │
│                             │
│ Beğendiğiniz mağazaları     │
│ takip ederek yeni ürünlerinden │
│ haberdar olabilirsiniz.     │
│                             │
│   [Mağazaları Keşfet]       │
│                             │
└─────────────────────────────┘
```

---

## 🔧 API Endpoint'leri

### 1. Takip Edilen Mağazaları Getir

**Endpoint:** `GET /api/v1/customer/follows`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/follows`

**Kullanım Yeri:** 
- `FollowedStoresPageClient.tsx` - `fetchFollowedStores()` fonksiyonu
- `StoreHeader.tsx` - `checkFollowStatus()` fonksiyonu
- `ProductSidebar.tsx` - Takip durumu kontrolü
- `AccountMenu.tsx` - Menüde önizleme
- `OrderDetailPageClient.tsx` - Sipariş detayında takip durumu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
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
      "id": "store-123",
      "name": "Mağaza Adı",
      "slug": "magaza-adi",
      "follow_count": 150,
      "updated_at": "2024-01-20T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Kod Örneği:**
```typescript
const fetchFollowedStores = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await fetch(`${API_V1_URL}/customer/follows`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (data.meta?.status === 'success') {
      const stores = data.data || [];
      setFollowedStores(stores);
    }
  } catch (error) {
    // Hata yönetimi
  } finally {
    setLoading(false);
  }
};
```

**Kullanım Amacı:**
- Kullanıcının takip ettiği tüm mağazaları listelemek
- Belirli bir mağazanın takip edilip edilmediğini kontrol etmek
- Mağaza sayısını göstermek

---

### 2. Mağaza Takip Et

**Endpoint:** `POST /api/v1/customer/follows`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/follows`

**Kullanım Yeri:**
- `StoreHeader.tsx` - `handleFollow()` fonksiyonu
- `ProductSidebar.tsx` - `handleFollow()` fonksiyonu

**Request Headers:**
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

**Request Body:**
```json
{
  "store_id": "store-123"
}
```

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Mağaza başarıyla takip edildi"
  },
  "data": {
    "id": "store-123",
    "name": "Mağaza Adı",
    "slug": "magaza-adi",
    "follow_count": 151,
    "updated_at": "2024-01-20T10:00:00Z",
    "created_at": "2024-01-20T10:00:00Z"
  }
}
```

**Kod Örneği:**
```typescript
const handleFollow = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Takip etmek için giriş yapmalısınız.');
    window.location.href = '/giris';
    return;
  }
  
  setLoadingFollow(true);
  try {
    const storeId = seller.id;
    if (!storeId) {
      alert('Mağaza ID bulunamadı.');
      setLoadingFollow(false);
      return;
    }
    
    const res = await fetch(`${API_V1_URL}/customer/follows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ store_id: storeId })
    });
    
    const data = await res.json();
    if (data.meta?.status === 'success') {
      setIsFollowing(true);
      // Başarı mesajı gösterilebilir
    } else {
      alert(data.meta?.message || 'Bir hata oluştu');
    }
  } catch (e) {
    alert('Bir hata oluştu');
  } finally {
    setLoadingFollow(false);
  }
};
```

**Önemli Notlar:**
- Kullanıcı giriş yapmış olmalıdır (token gerekli)
- Aynı mağaza birden fazla kez takip edilemez
- Başarılı takip sonrası `follow_count` otomatik artar

---

### 3. Mağaza Takibini Bırak

**Endpoint:** `DELETE /api/v1/customer/follows/{storeId}`

**Tam URL:** `https://api.trendruum.com/api/v1/customer/follows/{storeId}`

**Kullanım Yeri:**
- `FollowedStoresPageClient.tsx` - `handleUnfollow()` fonksiyonu
- `StoreHeader.tsx` - `confirmUnfollow()` fonksiyonu
- `ProductSidebar.tsx` - `confirmUnfollow()` fonksiyonu

**Request Headers:**
```typescript
{
  'Authorization': `Bearer ${token}`
}
```

**URL Parametreleri:**
- `storeId`: Takibini bırakmak istenen mağazanın ID'si

**Response Yapısı:**
```json
{
  "meta": {
    "status": "success",
    "message": "Mağaza takibi başarıyla kaldırıldı"
  }
}
```

**Kod Örneği:**
```typescript
const handleUnfollow = async (storeId: string, storeName: string) => {
  // Onay iste
  if (!window.confirm(`${storeName} mağazasının takibini bırakmayı onaylıyor musunuz?`)) {
    return;
  }

  try {
    setUnfollowingId(storeId);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Giriş yapmalısınız.');
      return;
    }

    const response = await fetch(`${API_V1_URL}/customer/follows/${storeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (data.meta?.status === 'success') {
      // Mağazayı listeden kaldır
      setFollowedStores(prev => prev.filter(store => store.id !== storeId));
      alert('Mağaza takibi başarıyla kaldırıldı');
    } else {
      alert(data.meta?.message || 'Bir hata oluştu');
    }
  } catch (error) {
    alert('Bir hata oluştu');
  } finally {
    setUnfollowingId(null);
  }
};
```

**Önemli Notlar:**
- İşlem öncesi kullanıcıdan onay alınır (confirm dialog)
- Başarılı takibi bırakma sonrası listeden otomatik kaldırılır
- Modal ile de onay alınabilir (UnfollowConfirmModal)

---

## 🎯 Interface'ler ve Veri Yapıları

### FollowedStore Interface

```typescript
interface FollowedStore {
  id: string;                // Mağaza benzersiz ID'si
  name: string;              // Mağaza adı
  slug: string;              // Mağaza slug'ı (URL için)
  follow_count: number;      // Toplam takipçi sayısı
  updated_at: string;        // Son güncelleme tarihi (ISO format)
  created_at: string;        // Takip başlangıç tarihi (ISO format)
}
```

**Örnek Veri:**
```typescript
const exampleStore: FollowedStore = {
  id: "store-123",
  name: "Trendy Mağaza",
  slug: "trendy-magaza",
  follow_count: 150,
  updated_at: "2024-01-20T10:00:00Z",
  created_at: "2024-01-15T10:00:00Z"
};
```

### Component Props

```typescript
interface FollowedStoresPageClientProps {
  initialFollowedStores: FollowedStore[] | null;
}
```

---

## 📊 Akış Diyagramları

### Sayfa Yükleme Akışı

```
Kullanıcı /hesabim/takip-ettigim-magazalar sayfasını açar
    ↓
Server component (page.tsx) render edilir
    ↓
getFollowedStores() çağrılır (şimdilik null döner)
    ↓
FollowedStoresPageClient component'i render edilir
    ↓
initialFollowedStores kontrol edilir
    ├─ null ise → fetchFollowedStores() çağrılır
    └─ dolu ise → state'e set edilir
        ↓
GET /api/v1/customer/follows isteği yapılır
    ↓
Token kontrol edilir
    ├─ Token yoksa → loading false, return
    └─ Token varsa → Devam
        ↓
API'den veri çekilir
    ↓
Response kontrol edilir
    ├─ Başarısız → Error handling
    └─ Başarılı → Mağazalar listeye eklenir
        ↓
State güncellenir, UI render edilir
    ↓
Kullanıcı mağazaları görür
```

### Mağaza Takip Etme Akışı

```
Kullanıcı mağaza sayfasında "Takip Et" butonuna tıklar
    ↓
handleFollow() fonksiyonu çağrılır
    ↓
Token kontrol edilir
    ├─ Token yoksa → Giriş sayfasına yönlendir
    └─ Token varsa → Devam
        ↓
store_id kontrol edilir
    ├─ ID yoksa → Hata mesajı, return
    └─ ID varsa → Devam
        ↓
Loading state aktif edilir
    ↓
POST /api/v1/customer/follows isteği yapılır
    Body: { store_id: "store-123" }
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
isFollowing state'i true yapılır
    ↓
Loading state deaktif edilir
    ↓
UI güncellenir (Takip Ediliyor gösterilir)
```

### Mağaza Takibini Bırakma Akışı

```
Kullanıcı "Takibi Bırak" butonuna tıklar
    ↓
handleUnfollow() fonksiyonu çağrılır
    ↓
Onay dialogu gösterilir
    ├─ Kullanıcı "Hayır" derse → İşlem iptal
    └─ Kullanıcı "Evet" derse → Devam
        ↓
unfollowingId state'i güncellenir
    ↓
Token kontrol edilir
    ├─ Token yoksa → Hata mesajı, return
    └─ Token varsa → Devam
        ↓
DELETE /api/v1/customer/follows/{storeId} isteği yapılır
    ↓
Response kontrol edilir
    ├─ Başarısız → Hata mesajı göster
    └─ Başarılı → Devam
        ↓
Mağaza listeden kaldırılır
    setFollowedStores(prev => prev.filter(store => store.id !== storeId))
    ↓
Başarı mesajı gösterilir
    ↓
unfollowingId state'i null yapılır
    ↓
UI güncellenir
```

---

## 🔄 Kullanım Senaryoları

### Senaryo 1: İlk Kez Sayfa Açma

1. Kullanıcı giriş yapmış durumda
2. `/hesabim/takip-ettigim-magazalar` sayfasına gider
3. Sayfa yüklenirken loading spinner gösterilir
4. API'den takip edilen mağazalar çekilir
5. Mağazalar listelenir veya boş durum gösterilir

### Senaryo 2: Mağaza Takip Etme

1. Kullanıcı bir mağaza sayfasındadır (`/magaza/{slug}`)
2. StoreHeader'da "Takip Et" butonuna tıklar
3. Token kontrol edilir (yoksa giriş sayfasına yönlendirilir)
4. POST isteği yapılır
5. Başarılı olursa buton "Takip Ediliyor" olur
6. Mağaza takip listesine eklenir

### Senaryo 3: Mağaza Takibini Bırakma

1. Kullanıcı takip ettiği mağazalar sayfasındadır
2. Bir mağazanın yanındaki "Takibi Bırak" butonuna tıklar
3. Onay dialogu gösterilir
4. Kullanıcı onaylar
5. DELETE isteği yapılır
6. Başarılı olursa mağaza listeden kaldırılır
7. Başarı mesajı gösterilir

### Senaryo 4: Takip Durumu Kontrolü

1. Kullanıcı bir mağaza sayfasını açar
2. StoreHeader component'i mount olur
3. `checkFollowStatus()` fonksiyonu çağrılır
4. GET `/api/v1/customer/follows` isteği yapılır
5. Mağaza ID'si listede kontrol edilir
6. Varsa buton "Takip Ediliyor", yoksa "Takip Et" gösterilir

---

## ⚙️ Özellikler ve Limitler

### Özellikler

1. **✅ Responsive Tasarım:**
   - Desktop ve mobile için optimize edilmiştir
   - Mobilde sidebar overlay olarak açılır
   - Tüm ekran boyutlarında çalışır

2. **✅ Real-time Güncelleme:**
   - Takip/takibi bırak işlemlerinden sonra liste anında güncellenir
   - State yönetimi ile senkron tutulur

3. **✅ Onay Mekanizması:**
   - Takibi bırakma işleminde onay dialogu gösterilir
   - Yanlışlıkla tıklamaları önler

4. **✅ Loading States:**
   - Sayfa yüklenirken loading spinner
   - Takip/takibi bırak işlemlerinde buton disable
   - Kaldırılıyor durumu gösterilir

5. **✅ Boş Durum Yönetimi:**
   - Mağaza yoksa kullanıcı dostu mesaj
   - "Mağazaları Keşfet" butonu ile yönlendirme

6. **✅ Tarih Formatlama:**
   - Takip başlangıç tarihi Türkçe formatında gösterilir
   - Örnek: "15 Ocak 2024"

7. **✅ Slug Düzeltme:**
   - Türkçe karakterler düzeltilir
   - CamelCase/PascalCase kebab-case'e çevrilir
   - URL'lerde sorun çıkmasını önler

### Limitler

1. **Giriş Gereksinimi:**
   - Tüm işlemler için kullanıcı giriş yapmış olmalıdır
   - Guest kullanıcılar takip edemez

2. **API Bağımlılığı:**
   - Tüm veriler API'den gelir
   - API yanıt vermezse liste boş görünür

3. **Sunucu Tarafı Veri:**
   - Server component'te token yoksa veri çekilemez
   - Client-side'da localStorage'dan token alınır

---

## 🎨 UI/UX Özellikleri

### Loading State

```tsx
{loading ? (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
) : (
  // Mağaza listesi
)}
```

### Boş Durum

```tsx
{followedStores.length === 0 ? (
  <div className="text-center py-8 sm:py-12">
    <BuildingStorefrontIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
      Henüz mağaza takip etmiyorsunuz
    </h3>
    <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed px-4">
      Beğendiğiniz mağazaları takip ederek yeni ürünlerinden haberdar olabilirsiniz.
    </p>
    <a 
      href="/" 
      className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base"
    >
      Mağazaları Keşfet
    </a>
  </div>
) : (
  // Mağaza listesi
)}
```

### Mağaza Kartı (Desktop)

```tsx
<div className="hidden sm:flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
      <BuildingStorefrontIcon className="w-6 h-6 text-orange-500" />
    </div>
    <div>
      <h3 className="font-medium text-gray-900">{store.name}</h3>
      <p className="text-sm text-gray-500">
        {store.follow_count} takipçi • {formatDate(store.created_at)} tarihinden beri takip ediliyor
      </p>
    </div>
  </div>
  
  <div className="flex items-center gap-3">
    <a 
      href={`/magaza/${fixSlug(store.slug)}`}
      className="px-3 py-1.5 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50"
    >
      Mağazaya Git
    </a>
    <button
      onClick={() => handleUnfollow(store.id, store.name)}
      disabled={unfollowingId === store.id}
      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
    >
      <TrashIcon className="w-4 h-4" />
      {unfollowingId === store.id ? 'Kaldırılıyor...' : 'Takibi Bırak'}
    </button>
  </div>
</div>
```

### Mağaza Kartı (Mobile)

```tsx
<div className="sm:hidden">
  <div className="flex items-start gap-3 mb-3">
    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
      <BuildingStorefrontIcon className="w-5 h-5 text-orange-500" />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="font-medium text-gray-900 text-sm">{store.name}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {store.follow_count} takipçi
      </p>
      <p className="text-xs text-gray-500">
        {formatDate(store.created_at)} tarihinden beri takip ediliyor
      </p>
    </div>
  </div>
  
  <div className="flex gap-2">
    <a 
      href={`/magaza/${fixSlug(store.slug)}`}
      className="flex-1 text-center px-3 py-2 text-xs text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50"
    >
      Mağazaya Git
    </a>
    <button
      onClick={() => handleUnfollow(store.id, store.name)}
      disabled={unfollowingId === store.id}
      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
    >
      <TrashIcon className="w-3 h-3" />
      {unfollowingId === store.id ? 'Kaldırılıyor...' : 'Takibi Bırak'}
    </button>
  </div>
</div>
```

---

## 🔍 Önemli Notlar

### 1. Token Yönetimi

- Tüm API istekleri için `localStorage`'dan token alınır
- Token yoksa kullanıcı giriş sayfasına yönlendirilir
- Server component'te token'a erişim olmadığı için initial data null döner

### 2. Slug Düzeltme

`fixSlug()` fonksiyonu:
- Türkçe karakterleri İngilizce karşılıklarına çevirir (ı→i, ş→s, vb.)
- CamelCase/PascalCase formatını kebab-case'e çevirir
- URL'lerde sorun çıkmasını önler

### 3. State Yönetimi

- `followedStores`: Takip edilen mağazalar listesi
- `loading`: Sayfa yüklenme durumu
- `unfollowingId`: Şu anda takibi bırakılan mağazanın ID'si
- `sidebarOpen`: Mobile sidebar açık/kapalı durumu

### 4. Error Handling

- API hatalarında alert ile kullanıcı bilgilendirilir
- Try-catch blokları ile hatalar yakalanır
- Loading state'ler her durumda temizlenir (finally blokları)

---

## 📚 İlgili Dosyalar

### Ana Dosyalar
- `app/hesabim/takip-ettigim-magazalar/page.tsx` - Server component
- `app/hesabim/takip-ettigim-magazalar/FollowedStoresPageClient.tsx` - Client component

### İlgili Component'ler
- `components/store/StoreHeader.tsx` - Mağaza sayfasında takip butonu
- `components/product/details/ProductSidebar.tsx` - Ürün detayında takip butonu
- `components/account/AccountSidebar.tsx` - Hesap sidebar menüsü
- `components/account/AccountMenu.tsx` - Hesap menüsü (takip önizleme)

### İlgili Sayfalar
- `/magaza/{slug}` - Mağaza sayfası (takip etme yeri)
- `/urunler/{slug}` - Ürün detay sayfası (takip etme yeri)
- `/hesabim` - Ana hesap sayfası

---

## 🚀 İyileştirme Önerileri

1. **Toast Notifications:**
   - Alert yerine toast notification sistemi
   - Daha kullanıcı dostu geri bildirim

2. **Pagination:**
   - Çok sayıda mağaza varsa sayfalama
   - Infinite scroll veya "Daha Fazla" butonu

3. **Filtreleme ve Arama:**
   - Mağaza arama özelliği
   - Alfabetik sıralama

4. **Bildirimler:**
   - Takip edilen mağazalardan yeni ürün bildirimleri
   - Kampanya bildirimleri

5. **Analytics:**
   - Hangi mağazaların en çok takip edildiği
   - Takip eden kullanıcı sayıları

6. **Bulk Operations:**
   - Toplu takibi bırakma
   - Seçili mağazaları toplu silme

7. **Cache Mekanizması:**
   - API isteklerini cache'leme
   - Daha hızlı yükleme

---

**Son Güncelleme:** 2024

