# Sepet Sayfası Dokümantasyonu

## Genel Bakış

Sepet sayfası, kullanıcıların sepetlerindeki ürünleri görüntülemelerini, güncellemelerini ve ödeme sayfasına yönlendirmelerini sağlayan ana sayfalardan biridir. Hem authenticated hem de guest kullanıcılar için çalışır.

## Dosya Konumları

### Ana Dosyalar
- **Server Component**: `app/sepet/page.tsx`
- **Client Component**: `app/sepet/CartPageClient.tsx`
- **Sepet Ürünleri Listesi**: `components/cart/CartItemsList.tsx`
- **Sepet Özeti**: `components/cart/CartSummary.tsx`
- **Sepet Tab'ları**: `components/cart/CartTabs.tsx`
- **En Çok Satanlar**: `components/cart/BestSellersList.tsx`
- **Sepeti Temizle Modal**: `components/cart/ClearBasketModal.tsx`
- **Basket Context**: `app/context/BasketContext.tsx`

---

## Sayfa Yapısı ve Component Hiyerarşisi

```
CartPage (Server Component)
  └── CartPageClient
      └── Header
      └── CartPageContent
          ├── CartItemsList
          │   ├── ClearBasketModal
          │   └── CartItem (memoized)
          ├── CartTabs
          │   ├── Önceden Gezdiklerim Tab
          │   └── Favorilerim Tab
          └── CartSummary (Desktop: Sidebar, Mobile: Fixed Bottom)
              ├── DiscountCodeInput
              ├── AddressPopup
              └── LoginPopup
      └── Footer
      └── ScrollToTop
```

---

## API Endpoint'leri

### 1. Sepeti Getirme

#### Authenticated User
**Endpoint**: `GET /api/v1/customer/baskets`

**URL**: `https://api.trendruum.com/api/v1/customer/baskets`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Response Structure**:
```json
{
  "meta": {
    "status": "success",
    "message": "string",
    "code": 200
  },
  "data": {
    "id": "string",
    "user_id": "string",
    "status": "string",
    "total_price": 0,
    "updated_at": "string",
    "created_at": "string",
    "basket_groups": [
      {
        "id": "string",
        "basket_id": "string",
        "seller_id": "string",
        "seller": {
          "name": "string",
          "id": "string",
          "slug": "string",
          "point": 0,
          "rating": 0
        },
        "updated_at": "string",
        "created_at": "string",
        "total_price": 0,
        "basket_group_items": [
          {
            "id": "string",
            "basket_id": "string",
            "basket_group_id": "string",
            "seller_id": "string",
            "product_id": "string",
            "quantity": 1,
            "price": 0,
            "total_price": 0,
            "updated_at": "string",
            "created_at": "string",
            "variants": {
              "variant_key": "variant_value"
            },
            "product": {
              "id": "string",
              "name": "string",
              "slug": "string",
              "price": 0,
              "images": [
                {
                  "url": "string",
                  "fullpath": "string"
                }
              ],
              "medias": [
                {
                  "url": "string",
                  "fullpath": "string",
                  "name": "string",
                  "type": "string",
                  "id": "string"
                }
              ],
              "status": "string",
              "updated_at": "string",
              "created_at": "string",
              "brand": {
                "name": "string",
                "id": "string"
              },
              "variants": [
                {
                  "slug": "string",
                  "name": "string",
                  "value_name": "string",
                  "value_slug": "string",
                  "imageable": boolean,
                  "updated_at": "string",
                  "created_at": "string"
                }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

**Timeout**: 10 saniye

**Hata Durumları**:
- `404`: Boş sepet döndürülür
- `401`: Login sayfasına yönlendirilir
- Network Error: Boş sepet döndürülür

---

#### Guest User
**Endpoint**: `GET /api/v1/baskets`

**URL**: `https://api.trendruum.com/api/v1/baskets`

**Request Headers**:
```json
{
  "Guest-ID": "{guestId}",
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Response Structure**: Authenticated user ile aynı format

---

### 2. Sepete Ürün Ekleme

#### Authenticated User
**Endpoint**: `POST /api/v1/customer/baskets/add`

**Request Body**:
```json
{
  "product_id": "string",
  "quantity": 1,
  "variants": {
    "variant_key": "variant_value"
  }
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Response**: Sepet objesi (yukarıdaki format ile aynı)

**Özellikler**:
- Stok kontrolü yapılır
- Variant bilgileri desteklenir
- Sepete eklenen ürün geçmişe kaydedilir (localStorage)

---

#### Guest User
**Endpoint**: `POST /api/v1/baskets/add`

**Request Body**: Authenticated user ile aynı

**Request Headers**:
```json
{
  "Guest-ID": "{guestId}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

### 3. Sepetteki Ürün Miktarını Güncelleme

#### Authenticated User
**Endpoint**: `POST /api/v1/customer/baskets/update`

**Request Body**:
```json
{
  "product_id": "string",
  "quantity": 2
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Özellikler**:
- Stok kontrolü yapılır
- Miktar 1'den az ise ürün sepetten tamamen silinir
- Miktar 99'dan fazla ise 99'a sınırlanır

---

#### Guest User
**Endpoint**: `POST /api/v1/baskets/update`

**Request Body**: Authenticated user ile aynı

**Request Headers**:
```json
{
  "Guest-ID": "{guestId}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

### 4. Sepetten Ürün Kaldırma

#### Authenticated User
**Endpoint**: `POST /api/v1/customer/baskets/remove`

**Request Body**:
```json
{
  "product_id": "string",
  "quantity": 1
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Not**: `quantity` parametresi opsiyoneldir. Verilmezse ürünün tüm miktarı sepetten kaldırılır.

---

#### Guest User
**Endpoint**: `POST /api/v1/baskets/remove`

**Request Body**: Authenticated user ile aynı

**Request Headers**:
```json
{
  "Guest-ID": "{guestId}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

---

### 5. Sepeti Tamamen Temizleme

#### Authenticated User
**Endpoint**: `DELETE /api/v1/customer/baskets/clear`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response**:
```json
{
  "meta": {
    "status": "success",
    "message": "Sepet başarıyla temizlendi",
    "code": 200
  }
}
```

---

#### Guest User
Guest kullanıcılar için ayrı bir endpoint yoktur. Tüm ürünler teker teker `remove` endpoint'i ile kaldırılır.

---

### 6. İndirim Kodu Uygulama

**Endpoint**: `POST /api/v1/customer/baskets/apply-discount-coupon`

**Request Body**:
```json
{
  "code": "string"
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Response**:
```json
{
  "meta": {
    "status": "success",
    "message": "İndirim kodu başarıyla uygulandı"
  },
  "data": {
    "discount_coupon_code_amount": 0
  }
}
```

**Auth**: Gerekli (Bearer Token)

---

### 7. İndirim Kodu Kaldırma

**Endpoint**: `POST /api/v1/customer/baskets/remove-discount-coupon`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response**:
```json
{
  "meta": {
    "status": "success",
    "message": "İndirim kodu kaldırıldı"
  }
}
```

**Auth**: Gerekli (Bearer Token)

---

## Component Detayları

### 1. CartPageClient

**Dosya**: `app/sepet/CartPageClient.tsx`

**Görev**: Sepet sayfasının ana client component'i. Layout yapısını ve component'lerin yerleşimini yönetir.

**Props**:
```typescript
interface CartPageClientProps {
  initialBasket: Basket | null;
  initialToken: string;
}
```

**Özellikler**:
- Server-side'dan gelen initial basket verisini kullanır
- BasketProvider ile sarmalanır
- Loading durumunu yönetir
- Boş sepet durumunu gösterir
- Desktop ve mobile layout'ları yönetir

**Layout**:
- **Desktop**: 2 sütunlu grid (Sepet listesi + Özet)
- **Mobile**: Tek sütun + Sabit alt buton (CartSummary)

---

### 2. CartItemsList

**Dosya**: `components/cart/CartItemsList.tsx`

**Görev**: Sepetteki ürünleri listeler, miktar güncelleme ve silme işlemlerini yönetir.

**Özellikler**:
- Satıcı gruplarına göre ürünleri gösterir
- Kampanya bilgilerini gösterir
- Kargo bedava uyarılarını gösterir
- Stok kontrolü yapar
- Miktar güncelleme input alanı
- Ürün silme butonu
- Sepeti temizle butonu ve modal'ı

**State Yönetimi**:
- `updatingItems`: Hangi ürünlerin güncellendiğini takip eder
- `productImages`: Ürün resimlerini cache'ler
- `productBrands`: Marka bilgilerini cache'ler
- `showClearModal`: Sepeti temizle modal'ının açık/kapalı durumu
- `isClearingBasket`: Sepeti temizleme işleminin loading durumu

**Fonksiyonlar**:
- `handleQuantityChange`: Miktar güncelleme
- `handleDelete`: Ürün silme
- `handleClearBasket`: Sepeti temizle modal'ını açma
- `confirmClearBasket`: Sepeti temizleme onayı
- `checkProductStock`: Ürün stok kontrolü
- `formatPrice`: Fiyat formatlama
- `formatVariants`: Variant bilgilerini formatlama
- `getSafeImageUrl`: Güvenli resim URL'i alma

**Tasarım Özellikleri**:
- Responsive tasarım
- Memoized CartItem component'i (performans için)
- Satıcı gruplarına göre organize edilmiş
- Kargo bedava uyarıları
- Kampanya bilgileri gösterimi
- Stok uyarıları

---

### 3. CartSummary

**Dosya**: `components/cart/CartSummary.tsx`

**Görev**: Sepet özetini gösterir, ödeme sayfasına yönlendirme yapar, indirim kodu uygulama işlemlerini yönetir.

**Özellikler**:
- Ürün toplamı
- Kargo ücreti hesaplama (satıcı bazında)
- Kampanya indirimleri
- İndirim kodu uygulama
- Genel toplam
- Sepeti onayla butonu
- Login popup (guest kullanıcılar için)
- Address popup

**State Yönetimi**:
- `showLoginPopup`: Login popup'ının açık/kapalı durumu
- `showAddressPopup`: Address popup'ının açık/kapalı durumu
- `appliedDiscountCode`: Uygulanan indirim kodu
- `discountCodeLoading`: İndirim kodu uygulama loading durumu
- `discountAmount`: İndirim miktarı

**Fonksiyonlar**:
- `handleCheckoutClick`: Ödeme sayfasına yönlendirme
- `handleAddressSubmit`: Adres gönderme ve ödeme sayfasına yönlendirme
- `handleApplyDiscountCode`: İndirim kodu uygulama
- `handleRemoveDiscountCode`: İndirim kodu kaldırma
- `formatPrice`: Fiyat formatlama

**Kargo Ücreti Hesaplama**:
- Her satıcı için ayrı hesaplama yapılır
- Satıcı bazında 400 TL ve üzeri alışverişlerde kargo ücretsiz
- Her satıcı için 125 TL kargo ücreti (400 TL altında)

**Layout**:
- **Desktop**: Sticky sidebar (top-4)
- **Mobile**: Fixed bottom bar (pb-20 - Footer için boşluk)

---

### 4. CartTabs

**Dosya**: `components/cart/CartTabs.tsx`

**Görev**: "Önceden Gezdiklerim" ve "Favorilerim" tab'larını gösterir.

**Tab'lar**:
1. **Önceden Gezdiklerim**: LocalStorage'dan alınan sepet geçmişi (son 14 gün)
2. **Favorilerim**: Kullanıcının favori ürünleri

**Özellikler**:
- LocalStorage'dan sepet geçmişini okur
- Favori ürünleri FavoriteContext'ten alır
- Ürün resimlerini dinamik olarak yükler
- Grid layout (2 sütun mobil, 3-4 sütun desktop)
- Sepete ekle butonu (önceden gezdiklerim tab'ında)
- Ürün detayına git butonu (favorilerim tab'ında)

**State Yönetimi**:
- `activeTab`: Aktif tab ('eklediklerim' | 'favoriler')
- `cartHistory`: Sepet geçmişi
- `historyLoading`: Sepet geçmişi yükleme durumu
- `productImages`: Ürün resimlerini cache'ler

**Fonksiyonlar**:
- `fetchCartHistory`: Sepet geçmişini yükleme
- `loadProductImages`: Ürün resimlerini yükleme
- `getImageUrl`: Güvenli resim URL'i alma
- `renderStars`: Yıldız rating render'ı
- `handleAddToCart`: Sepete ekleme

**LocalStorage**:
- **Key**: `cartHistory`
- **Format**: Array of CartHistoryItem
- **Data Structure**:
```typescript
interface CartHistoryItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  added_at: string;
  removed_at?: string;
  product_image?: string;
  product_slug?: string;
}
```

---

### 5. BestSellersList

**Dosya**: `components/cart/BestSellersList.tsx`

**Görev**: En çok satan ürünleri gösterir (şu an sepet sayfasında kullanılmıyor, yorum satırına alınmış).

**Endpoint**: `GET /api/v1/products`

**Özellikler**:
- 8 ürün gösterir
- Grid layout (2 sütun mobil, 4 sütun desktop)
- Memoized ProductCard component'i

---

### 6. ClearBasketModal

**Dosya**: `components/cart/ClearBasketModal.tsx`

**Görev**: Sepeti temizleme işlemini onaylamak için modal gösterir.

**Props**:
```typescript
interface ClearBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}
```

**Özellikler**:
- Backdrop blur efekti
- Responsive tasarım
- Loading durumu gösterimi
- İptal ve onay butonları

---

## Tasarım Detayları

### Layout Yapısı

#### Desktop Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header                                                 │
├────────────────────────────┬────────────────────────────┤
│                            │                            │
│  CartItemsList             │  CartSummary (Sticky)     │
│  - Kargo Uyarısı          │  - Ürün Toplamı           │
│  - Kampanya Bilgisi       │  - Kargo Toplamı          │
│  - Satıcı Grupları        │  - Kampanya İndirimi      │
│    - Ürün Kartları        │  - İndirim Kodu           │
│  - CartTabs               │  - Genel Toplam           │
│    - Önceden Gezdiklerim  │  - Sepeti Onayla Butonu   │
│    - Favorilerim          │                            │
│                            │                            │
└────────────────────────────┴────────────────────────────┘
│  Footer                                                 │
└─────────────────────────────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────────────────────────────┐
│  Header                                 │
├─────────────────────────────────────────┤
│                                         │
│  CartItemsList                          │
│  - Kargo Uyarısı                       │
│  - Kampanya Bilgisi                    │
│  - Satıcı Grupları                     │
│    - Ürün Kartları                     │
│  - CartTabs                            │
│    - Önceden Gezdiklerim               │
│    - Favorilerim                       │
│                                         │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  CartSummary (Fixed Bottom)            │
│  - Toplam                               │
│  - Sepeti Onayla Butonu                │
└─────────────────────────────────────────┘
│  Footer                                 │
└─────────────────────────────────────────┘
```

---

### Ürün Kartı Tasarımı

```
┌─────────────────────────────────────────┐
│                    [Sil İkonu]          │
│  ┌─────┐  Ürün Adı (2 satır, clamp)   │
│  │     │  Satıcı: [Adı] [Puan]        │
│  │ Res │  Marka: [Adı]                 │
│  │     │  Variant: [Renk: Siyah]      │
│  └─────┘  Fiyat: 1.550,00 TL          │
│           Toplam: 3.100,00 TL          │
│           [Kampanya Bilgisi]           │
│           [−] [2] [+]                  │
└─────────────────────────────────────────┘
```

**Özellikler**:
- Sil ikonu sağ üstte
- Ürün resmi tıklanabilir (ürün detayına gider)
- Ürün adı tıklanabilir (ürün detayına gider)
- Satıcı ve marka bilgisi
- Variant bilgileri (renk, beden vb.)
- Fiyat ve toplam fiyat
- Kampanya bilgisi (varsa)
- Miktar kontrolleri (artır/azalt)
- Stok uyarısı (stok yetersizse)

---

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px+

**Mobile Özellikleri**:
- Tek sütun layout
- Fixed bottom CartSummary
- Küçük font boyutları
- Kompakt spacing

**Desktop Özellikleri**:
- 2 sütunlu grid layout
- Sticky sidebar CartSummary
- Daha büyük font boyutları
- Geniş spacing

---

## State Yönetimi

### BasketContext

**Dosya**: `app/context/BasketContext.tsx`

**Context API**: React Context API kullanılarak global state yönetimi

**State**:
```typescript
{
  basket: Basket | GuestBasket | null;
  basketItems: BasketItem[];
  totalQuantity: number;
  totalPrice: number;
  shippingFee: number;
  loading: boolean;
  error: string | null;
  isGuestBasket: boolean;
  guestId: string;
}
```

**Functions**:
- `addToBasket`: Authenticated kullanıcı için sepete ekleme
- `addToGuestBasket`: Guest kullanıcı için sepete ekleme
- `updateBasketItem`: Ürün miktarını güncelleme
- `removeFromBasket`: Ürünü sepetten kaldırma
- `clearBasket`: Sepeti tamamen temizleme
- `refreshBasket`: Sepeti yeniden yükleme

**Guest ID Yönetimi**:
- LocalStorage'da saklanır
- 1 günlük ömrü vardır
- Otomatik olarak oluşturulur
- Login olduğunda temizlenir

---

## Özel Özellikler

### 1. Kargo Bedava Hesaplama

- **Eşik**: 400 TL
- **Hesaplama**: Satıcı bazında
- **Kargo Ücreti**: 125 TL (400 TL altında)
- **Kargo Ücretsiz**: 400 TL ve üzeri

Her satıcı için ayrı hesaplama yapılır:
```typescript
const groupTotal = group.basket_group_items.reduce((sum, item) => {
  return sum + ((item.price || 0) * (item.quantity || 0));
}, 0);

const isGroupFreeShipping = groupTotal >= 400;
const shippingFee = isGroupFreeShipping ? 0 : 125;
```

---

### 2. Kampanya Bilgileri

**Hook**: `useCartCampaigns`

**Kampanya Tipleri**:
1. **Percentage Discount**: Yüzde indirim
2. **Nth Product Discount**: N. ürün indirimi
3. **Price Discount**: Fiyat indirimi
4. **Buy X Pay Y**: X al Y öde

**Gösterim**:
- Her ürün kartında kampanya bilgisi
- Sepet özetinde toplam kampanya indirimi
- Renkli badge'ler (kırmızı, mor, mavi, yeşil)

---

### 3. Stok Kontrolü

**Özellikler**:
- Miktar artırma/azaltma işlemlerinde stok kontrolü
- Stok yetersizse uyarı gösterimi
- Stok bilgisi ürün kartında gösterilir
- Miktar input'unda maksimum stok sınırlaması

**Kontrol Noktaları**:
- Sepete ekleme
- Miktar güncelleme
- Miktar input'unda manuel giriş

---

### 4. Sepet Geçmişi

**LocalStorage Key**: `cartHistory`

**Özellikler**:
- Son 14 günlük veri saklanır
- Sepete eklenen ürünler otomatik kaydedilir
- "Önceden Gezdiklerim" tab'ında gösterilir
- Ürün resimleri dinamik olarak yüklenir

**Data Structure**:
```typescript
interface CartHistoryItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  added_at: string;
  removed_at?: string;
  product_image?: string;
  product_slug?: string;
}
```

---

### 5. Image Loading

**Fallback Stratejisi**:
1. `product.images[0].url`
2. `product.medias[0].url` (array)
3. `product.medias.url` (object)
4. `productImages[product_id]` (cache)
5. Placeholder SVG

**Error Handling**:
- Image error durumunda placeholder gösterilir
- Null/undefined product durumunda placeholder gösterilir

---

## Loading States

### 1. Sepet Yükleme
- Initial basket yüklenirken: "Sepet yükleniyor..."
- Spinner gösterilir
- Background overlay yok

### 2. Ürün Güncelleme
- Hangi ürün güncelleniyorsa o ürün kartında loading gösterilir
- Input alanında "..." gösterilir
- Diğer işlemler engellenir

### 3. Sepeti Temizleme
- Modal'da loading gösterilir
- Butonlar disabled olur
- "Temizleniyor..." yazısı gösterilir

### 4. İndirim Kodu
- Input alanında loading gösterilir
- Buton disabled olur

---

## Error Handling

### 1. API Hataları

**401 Unauthorized**:
- Login sayfasına yönlendirilir
- Token localStorage'dan silinir

**404 Not Found**:
- Boş sepet döndürülür
- Hata mesajı gösterilir

**400 Bad Request**:
- Stok hatası: "Ürün stokta bulunmamaktadır."
- Genel hata: API'den gelen mesaj gösterilir

**500 Internal Server Error**:
- "Sunucu hatası oluştu. Lütfen tekrar deneyin."
- Stok hatası ise: "Ürün stokta bulunmamaktadır."

### 2. Network Hataları

**Timeout**:
- Boş sepet döndürülür
- Hata mesajı gösterilir

**Connection Error**:
- Toast error mesajı
- Sepet yeniden yüklenmeye çalışılır

---

## Kullanım Örnekleri

### 1. Sepete Ürün Ekleme
```typescript
const { addToBasket } = useBasket();

await addToBasket(productId, 1, {
  renk: 'siyah',
  beden: 'M'
});
```

### 2. Miktar Güncelleme
```typescript
const { updateBasketItem } = useBasket();

await updateBasketItem(productId, 2);
```

### 3. Ürün Silme
```typescript
const { removeFromBasket } = useBasket();

await removeFromBasket(productId);
```

### 4. Sepeti Temizleme
```typescript
const { clearBasket } = useBasket();

await clearBasket();
```

---

## İyileştirme Önerileri

1. **Performance**:
   - Memoization zaten kullanılıyor (CartItem memoized)
   - Image lazy loading eklenebilir
   - Infinite scroll eklenebilir (çok ürün varsa)

2. **Accessibility**:
   - ARIA labels eklenebilir
   - Keyboard navigation iyileştirilebilir
   - Screen reader desteği eklenebilir

3. **UX**:
   - Sepet animasyonları eklenebilir
   - Ürün silme onay modal'ı eklenebilir
   - Sepet sayısı badge'i eklenebilir

4. **Error Handling**:
   - Retry mekanizması eklenebilir
   - Offline mode desteği eklenebilir
   - Daha detaylı hata mesajları

---

## İlgili Dosyalar

- `app/sepet/page.tsx` - Server component
- `app/sepet/CartPageClient.tsx` - Client component
- `components/cart/CartItemsList.tsx` - Ürün listesi
- `components/cart/CartSummary.tsx` - Sepet özeti
- `components/cart/CartTabs.tsx` - Tab'lar
- `components/cart/BestSellersList.tsx` - En çok satanlar
- `components/cart/ClearBasketModal.tsx` - Sepeti temizle modal'ı
- `app/context/BasketContext.tsx` - Basket state yönetimi
- `app/hooks/useCartCampaigns.ts` - Kampanya hook'u
- `utils/productUrl.ts` - Ürün URL oluşturma

---

## Changelog

### v1.0.0
- İlk versiyon
- Authenticated ve guest kullanıcı desteği
- Sepet CRUD işlemleri
- Kampanya desteği
- Kargo bedava hesaplama
- Sepet geçmişi
- Responsive tasarım
- Stok kontrolü
- İndirim kodu uygulama

