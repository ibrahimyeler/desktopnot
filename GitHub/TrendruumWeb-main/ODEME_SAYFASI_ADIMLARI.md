# Ödeme Sayfası Adımları Dokümantasyonu

## Genel Bakış

Bu dokümantasyon, sepet sayfasında "Sepeti Onayla" butonuna basıldıktan sonra ödeme tamamlanana kadar geçen tüm adımları, kullanılan endpoint'leri ve arayüz tasarımını kapsar.

## Akış Diyagramı

```
Sepet Sayfası
    ↓
"Sepeti Onayla" Butonu
    ↓
Ödeme Sayfası (/sepetim/odeme)
    ↓
[Adım 1: Adres Seçimi]
    ├── Adres Listesi Gösterimi
    ├── Yeni Adres Ekleme (Popup)
    └── Adres Seçimi
    ↓
[Adım 2: Ödeme Seçenekleri]
    ├── Kart Bilgileri Girişi
    ├── BIN Sorgusu (Kart Türü Tespiti)
    ├── Taksit Oranları Sorgusu
    ├── Taksit Seçimi
    └── Kart Bilgileri Validasyonu
    ↓
[Adım 3: Sipariş Onayı]
    ├── Sipariş Özeti
    ├── Sözleşmelerin Kabulü
    └── "Ödemeyi Tamamla" Butonu
    ↓
[Adım 4: Sipariş Oluşturma]
    ├── Customer: POST /api/v1/customer/orders
    └── Guest: POST /api/v1/orders
    ↓
[Adım 5: Ödeme İşlemi]
    ├── PayTR Yönlendirmesi (Varsa)
    ├── 3D Secure Doğrulama
    └── Ödeme Sonucu
    ↓
[Adım 6: Başarılı Ödeme]
    ├── Başarı Mesajı
    └── Yönlendirme (Siparişlerim / Anasayfa)
```

---

## Dosya Konumları

### Ana Dosyalar
- **Server Component**: `app/sepetim/odeme/page.tsx`
- **Client Component**: `app/sepetim/odeme/CheckoutPageClient.tsx`
- **Container**: `app/sepetim/odeme/components/Container.tsx`
- **Adres Bölümü**: `app/sepetim/odeme/components/AddressSection.tsx`
- **Ödeme Seçenekleri**: `app/sepetim/odeme/components/PaymentOptions.tsx`
- **Sipariş Özeti**: `app/sepetim/odeme/components/OrderSummary.tsx`
- **Tab'lar**: `app/sepetim/odeme/components/Tabs.tsx`
- **Sepet Ürünleri**: `app/sepetim/odeme/components/CartProducts.tsx`

---

## Adım 1: Adres Seçimi

### Sayfa Yapısı

**URL**: `/sepetim/odeme`

**Component**: `Container.tsx`

### İlk Yükleme - Server-Side Data Fetching

#### 1.1. Kullanıcı Profili

**Endpoint**: `GET /api/v1/customer/profile/me`

**URL**: `https://api.trendruum.com/api/v1/customer/profile/me`

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
    "firstname": "string",
    "lastname": "string",
    "email": "string",
    "phone": "string",
    "birth_date": "string",
    "gender": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Timeout**: 10 saniye

**Hata Durumları**:
- `404`: null döndürülür
- Network Error: null döndürülür

---

#### 1.2. Kullanıcı Adresleri

**Endpoint**: `GET /api/v1/customer/addresses`

**URL**: `https://api.trendruum.com/api/v1/customer/addresses`

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
  "data": [
    {
      "id": "string",
      "title": "string",
      "firstname": "string",
      "lastname": "string",
      "phone": "string",
      "city": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "district": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "neighborhood": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "description": "string",
      "is_default": boolean,
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

**Timeout**: 10 saniye

**Hata Durumları**:
- `404`: Boş array döndürülür
- Network Error: Boş array döndürülür

---

#### 1.3. Sepet Verileri

**Endpoint**: `GET /api/v1/customer/baskets` (Authenticated) veya `GET /api/v1/baskets` (Guest)

**URL**: 
- Authenticated: `https://api.trendruum.com/api/v1/customer/baskets`
- Guest: `https://api.trendruum.com/api/v1/baskets`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}", // Authenticated için
  "Guest-ID": "{guestId}", // Guest için
  "Accept": "application/json",
  "Content-Type": "application/json"
}
```

**Response Structure**: Sepet objesi (SEPET_SAYFASI.md'deki format ile aynı)

**Timeout**: 10 saniye

---

### Arayüz Tasarımı

#### Tab Yapısı

```
┌─────────────────────────────────────────────────┐
│  [Adres Bilgileri]  │  [Ödeme Seçenekleri]    │
│  (Aktif: Turuncu)   │  (Pasif: Gri)           │
└─────────────────────────────────────────────────┘
```

**Component**: `Tabs.tsx`

**Özellikler**:
- İki tab: "Adres Bilgileri" ve "Ödeme Seçenekleri"
- Aktif tab turuncu border ile vurgulanır
- Pasif tab'lar gri background ile gösterilir
- Ödeme tab'ına tıklanınca adres kontrolü yapılır
- Adres yoksa uyarı gösterilir (3 saniye)

---

#### Adres Listesi Gösterimi

**Component**: `AddressSection.tsx`

**Layout**:
- Grid layout: 2 sütun (desktop), 1 sütun (mobile)
- Her adres için radio button ve kart tasarımı
- Seçili adres turuncu border ile vurgulanır

**Adres Kartı Tasarımı**:
```
┌─────────────────────────────────────────┐
│ ● [Sil İkonu]                          │
│  📍 Adres Başlığı                      │
│  Adres Açıklaması                      │
│  Mahalle, İlçe                         │
│  Şehir                                 │
│  ───────────────────                   │
│  Ad Soyad                              │
│  Telefon                               │
└─────────────────────────────────────────┘
```

**Özellikler**:
- Radio button ile adres seçimi
- Hover'da sil ikonu gösterilir
- Seçili adres turuncu arka plan ile vurgulanır
- Maksimum 4 adres gösterilebilir
- "Yeni Adres Ekle" butonu (4'ten az adres varsa)

---

#### Yeni Adres Ekleme (Popup)

**Component**: `AddressPopup.tsx`

**Endpoint**: `POST /api/v1/customer/addresses` (Authenticated) veya `POST /api/v1/addresses` (Guest)

**URL**: 
- Authenticated: `https://api.trendruum.com/api/v1/customer/addresses`
- Guest: `https://api.trendruum.com/api/v1/addresses`

**Request Body**:
```json
{
  "title": "string",
  "firstname": "string",
  "lastname": "string",
  "phone": "string",
  "city_id": "string",
  "district_id": "string",
  "neighborhood_id": "string",
  "description": "string",
  "is_default": boolean
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}", // Authenticated için
  "Guest-ID": "{guestId}", // Guest için
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Response Structure**:
```json
{
  "meta": {
    "status": "success",
    "message": "Adres başarıyla eklendi",
    "code": 200
  },
  "data": {
    "id": "string",
    "title": "string",
    "firstname": "string",
    "lastname": "string",
    "phone": "string",
    "city": {
      "id": "string",
      "name": "string",
      "slug": "string"
    },
    "district": {
      "id": "string",
      "name": "string",
      "slug": "string"
    },
    "neighborhood": {
      "id": "string",
      "name": "string",
      "slug": "string"
    },
    "description": "string",
    "is_default": boolean,
    "created_at": "string",
    "updated_at": "string"
  }
}
```

**Form Alanları**:
- Adres Başlığı (zorunlu)
- Ad (zorunlu)
- Soyad (zorunlu)
- Telefon (zorunlu)
- Şehir (dropdown, zorunlu)
- İlçe (dropdown, zorunlu, şehir seçildikten sonra aktif)
- Mahalle (dropdown, zorunlu, ilçe seçildikten sonra aktif)
- Adres Açıklaması (textarea, zorunlu)
- Varsayılan Adres (checkbox)

**Validasyon**:
- Tüm zorunlu alanlar doldurulmalı
- Telefon numarası format kontrolü
- Şehir/İlçe/Mahalle seçim sırası kontrolü

---

#### Adres Seçimi

**Endpoint**: `POST /api/v1/customer/profile/me-update` (Authenticated)

**URL**: `https://api.trendruum.com/api/v1/customer/profile/me-update`

**Request Body**:
```json
{
  "selected_address_id": "string"
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

**Response Structure**:
```json
{
  "meta": {
    "status": "success",
    "message": "Adres başarıyla seçildi",
    "code": 200
  }
}
```

**Not**: Guest kullanıcılar için bu endpoint çağrılmaz. Adres seçimi sadece client-side'da yönetilir.

---

#### Adres Silme

**Endpoint**: `DELETE /api/v1/customer/profile/addresses/{addressId}` (Authenticated)

**URL**: `https://api.trendruum.com/api/v1/customer/profile/addresses/{addressId}`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}",
  "Accept": "application/json"
}
```

**Response Structure**:
```json
{
  "meta": {
    "status": "success",
    "message": "Adres başarıyla silindi",
    "code": 200
  }
}
```

**Not**: Guest kullanıcılar için adres silme işlemi yapılmaz.

---

### Sepet Ürünleri Gösterimi

**Component**: `CartProducts.tsx`

**Layout**:
- Disclosure (Accordion) component
- Varsayılan olarak kapalı
- Başlık: "Sepetimdeki Ürünler ({count})"
- İlk 2 ürünün küçük görseli gösterilir
- Açıldığında tüm ürünler gösterilir

**Ürün Kartı Tasarımı**:
```
┌─────────────────────┐
│  ┌─────────┐        │
│  │         │        │
│  │  Resim  │        │
│  │         │        │
│  └─────────┘        │
│  Ürün Adı           │
│  (2 satır, clamp)   │
│  Fiyat: 1.550,00 TL │
│  Adet: 2            │
└─────────────────────┘
```

---

## Adım 2: Ödeme Seçenekleri

### Arayüz Tasarımı

**Component**: `PaymentOptions.tsx`

**Layout**:
- 2 sütunlu grid (desktop)
- 1 sütun (mobile)

**Sol Taraf: Kart Bilgileri**
- Ödeme Tipi Seçimi (Kart ile Öde / Alışveriş Kredisi)
- Kart Sahibi Adı
- Kart Numarası (16 haneli, 4'lü gruplar halinde formatlanır)
- Son Kullanma Tarihi (Ay/Yıl dropdown)
- CVV (3 haneli)
- 3D Secure Checkbox (varsayılan: checked, disabled)

**Sağ Taraf: Taksit Seçenekleri**
- Taksit tablosu
- Tek Çekim (varsayılan)
- 2, 3, 4, 6, 8, 9, 12 taksit seçenekleri
- Her taksit için: Aylık Ödeme, Toplam Tutar, Faiz Oranı

---

### Endpoint'ler

#### 2.1. BIN Sorgusu (Kart Türü Tespiti)

**Endpoint**: `POST /api/v1/customer/payments/bin-query`

**URL**: `https://api.trendruum.com/api/v1/customer/payments/bin-query`

**Request Body**:
```json
{
  "bin_number": "435555"
}
```

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}", // Opsiyonel
  "Content-Type": "application/json",
  "Accept": "application/json"
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
    "brand": "bonus",
    "bank": "Garanti Bankası",
    "type": "credit_card"
  }
}
```

**Özellikler**:
- Kart numarasının ilk 6 hanesi (BIN) ile sorgulanır
- Kart türü otomatik olarak tespit edilir (Bonus, Axess, Visa, Mastercard vb.)
- Kart görseli dinamik olarak gösterilir
- Guest kullanıcılar için de çalışır (token olmadan)
- API'den veri gelmezse fallback olarak basit tespit yapılır

**Kart Görselleri**:
- `/bonus.png` - Bonus kartı
- `/axess.png` - Axess kartı
- `/payment/world.svg` - World kartı
- `/payment/maximum.svg` - Maximum kartı
- `/payment/card-finans.svg` - CardFinans kartı
- `/payment/visa.svg` - Visa kartı
- `/payment/cart1.svg` - Mastercard kartı
- `/payment/ziraat.svg` - Ziraat kartı

---

#### 2.2. Taksit Oranları Sorgusu

**Endpoint**: `POST /api/v1/customer/payments/instalment-query`

**URL**: `https://api.trendruum.com/api/v1/customer/payments/instalment-query`

**Request Headers**:
```json
{
  "Authorization": "Bearer {token}", // Opsiyonel
  "Content-Type": "application/json",
  "Accept": "application/json"
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
    "oranlar": {
      "visa": {
        "taksit_2": 2.5,
        "taksit_3": 3.5,
        "taksit_4": 4.5,
        "taksit_6": 6.5,
        "taksit_8": 8.5,
        "taksit_9": 9.5,
        "taksit_12": 12.5
      },
      "bonus": {
        "taksit_2": 2.0,
        "taksit_3": 3.0,
        // ...
      },
      "axess": {
        // ...
      }
    }
  }
}
```

**Özellikler**:
- Kart türüne göre taksit oranları gösterilir
- Yüzde cinsinden faiz oranları döndürülür
- Guest kullanıcılar için de çalışır (token olmadan)
- Component mount olduğunda otomatik olarak çekilir

**Taksit Hesaplama**:
```typescript
// Faiz tutarı = Toplam tutar * (Faiz oranı / 100)
const faizTutari = totalWithShipping * (oran / 100);

// Toplam tutar = Orijinal tutar + Faiz tutarı
const toplamTutar = totalWithShipping + faizTutari;

// Aylık ödeme = Toplam tutar / Taksit sayısı
const aylikTutar = toplamTutar / count;
```

---

### Kart Bilgileri Validasyonu

**Validasyon Kuralları**:

1. **Kart Sahibi Adı**:
   - Zorunlu
   - En az 2 karakter
   - Sadece harf ve boşluk

2. **Kart Numarası**:
   - Zorunlu
   - 16 haneli olmalı (boşluklar kaldırıldıktan sonra)
   - Sadece rakam
   - 4'lü gruplar halinde formatlanır

3. **Son Kullanma Tarihi**:
   - Zorunlu (Ay ve Yıl)
   - Geçmiş tarih olamaz
   - Ay: 01-12
   - Yıl: Mevcut yıl - Mevcut yıl + 10

4. **CVV**:
   - Zorunlu
   - 3 haneli olmalı
   - Sadece rakam

**Real-time Validasyon**:
- Her alan değiştiğinde validasyon yapılır
- Hata mesajları alan altında gösterilir
- Tüm alanlar geçerli olmadıkça "Ödemeyi Tamamla" butonu disabled kalır

---

## Adım 3: Sipariş Onayı

### Component: OrderSummary

**Layout**:
- Sticky sidebar (desktop)
- Fixed bottom bar (mobile)

**İçerik**:
1. **Kampanya Özeti** (varsa)
   - Kampanya türüne göre renkli badge'ler
   - Toplam kampanya indirimi

2. **Sipariş Detayları**:
   - Ürünlerin Toplamı (ürün sayısı ile)
   - Kampanya İndirimi (varsa)
   - Kargo Toplam (satıcı bazında hesaplanır)
   - Taksit Oranı (taksit seçildiyse)
   - **Genel Toplam** (büyük, turuncu renkte)

3. **Bilgilendirme**:
   - "Sepetindeki ürünler son 3 günde 100+ adet satıldı!" mesajı

4. **Butonlar**:
   - **"Kaydet ve Devam Et"** (Adres seçimi aşamasında)
   - **"Ödemeyi Tamamla"** (Ödeme seçenekleri aşamasında)

5. **Sözleşmeler**:
   - Checkbox: "Ön Bilgilendirme Koşulları ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum."
   - Linkler:
     - Ön Bilgilendirme Koşulları: `/s/on-bilgilendirme-kosullari`
     - Mesafeli Satış Sözleşmesi: Modal açılır

---

### Kargo Ücreti Hesaplama

**Kurallar**:
- Her satıcı için ayrı hesaplama yapılır
- Satıcı bazında 400 TL ve üzeri alışverişlerde kargo **ücretsiz**
- Satıcı bazında 400 TL altında alışverişlerde kargo **125 TL**
- Toplam kargo ücreti = Tüm satıcıların kargo ücretlerinin toplamı

**Hesaplama**:
```typescript
basket.basket_groups.forEach((group) => {
  const groupTotal = group.basket_group_items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );
  
  if (groupTotal < 400) {
    totalShippingFee += 125;
  }
});
```

---

### Final Toplam Hesaplama

**Formül**:
```typescript
// 1. Ürünlerin toplamı
const effectiveCartTotal = basket.total_price || calculatedTotal;

// 2. Kampanya indirimi uygula
const cartTotalWithCampaigns = effectiveCartTotal - totalCampaignSavings;

// 3. Taksit faizi ekle (taksit seçildiyse)
let taksitliTotal = cartTotalWithCampaigns;
if (selectedInstallment && selectedInstallment.count > 1) {
  taksitliTotal = cartTotalWithCampaigns + 
    (cartTotalWithCampaigns * selectedInstallment.rate / 100);
}

// 4. Kargo ücretini ekle
const finalTotal = taksitliTotal + shippingCost;
```

---

### Mesafeli Satış Sözleşmesi Modal

**Component**: `DistanceSalesAgreementModal`

**İçerik**:
- Satıcı Bilgileri:
  - Satıcı Adı
  - Adres
  - Telefon
  - Vergi No
  - E-posta

- Müşteri Bilgileri:
  - Ad Soyad
  - Adres
  - E-posta

- Ürün Bilgileri:
  - Ürün Adı
  - Fiyat
  - Adet

- Sipariş Bilgileri:
  - Ara Toplam
  - Kargo Ücreti
  - Toplam
  - Ödeme Yöntemi

**Modal Aksiyonları**:
- "Kabul Et ve Onayla" butonu → Sözleşmeleri kabul et ve modal'ı kapat
- "Kapat" butonu → Modal'ı kapat

---

## Adım 4: Sipariş Oluşturma

### Authenticated User (Customer)

#### Endpoint: POST /api/v1/customer/orders

**URL**: `https://api.trendruum.com/api/v1/customer/orders`

**Request Body**:
```json
{
  "basket_id": "string",
  "address_id": "string",
  "payment": {
    "card_type": "bonus",
    "total_amount": 1250.00
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

**Response Structure**:
```json
{
  "meta": {
    "status": "success",
    "message": "Sipariş başarıyla oluşturuldu",
    "code": 200
  },
  "data": {
    "id": "string",
    "order_number": "string",
    "status": "pending",
    "total_amount": 1250.00,
    "created_at": "string",
    "payment": {
      "post_url": "https://www.paytr.com/odeme/guvenli",
      "inputs": {
        "merchant_id": "string",
        "merchant_key": "string",
        "merchant_salt": "string",
        "payment_amount": "1250.00",
        "user_basket": "[['Ürün', '1000.00', 1], ['Kargo', '250.00', 1]]",
        "currency": "TL",
        "merchant_ok_url": "https://trendruum.com/basarili",
        "merchant_fail_url": "https://trendruum.com/basarisiz",
        // ... diğer PayTR parametreleri
      }
    }
  }
}
```

**Özellikler**:
- Basket ID zorunlu
- Address ID zorunlu
- Payment objesi içinde card_type ve total_amount gönderilir
- Response içinde PayTR form verileri varsa PayTR'ye yönlendirme yapılır
- PayTR form verileri yoksa sipariş başarılı sayılır

---

### Guest User

#### Endpoint: POST /api/v1/orders

**URL**: `https://api.trendruum.com/api/v1/orders`

**Request Body**:
```json
{
  "address_id": "string",
  "payment": {
    "instalment": "1",
    "card_type": "bonus",
    "total_amount": 1250.00
  }
}
```

**Request Headers**:
```json
{
  "Guest-ID": "{guestId}",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

**Response Structure**: Customer ile aynı format

**Özellikler**:
- Guest-ID header'ı zorunlu
- Basket ID gönderilmez (backend guest sepetini kullanır)
- Payment objesi içinde instalment, card_type ve total_amount gönderilir

---

## Adım 5: Ödeme İşlemi (PayTR)

### PayTR Form Gönderimi

**Component**: `OrderSummary.tsx`

**Form Yapısı**:
```html
<form 
  action="{post_url}" 
  method="POST" 
  style="display: none"
>
  <!-- Backend'den gelen PayTR parametreleri -->
  <input type="hidden" name="merchant_id" value="{merchant_id}" />
  <input type="hidden" name="merchant_key" value="{merchant_key}" />
  <input type="hidden" name="merchant_salt" value="{merchant_salt}" />
  <input type="hidden" name="payment_amount" value="{payment_amount}" />
  <input type="hidden" name="user_basket" value="{user_basket}" />
  <!-- ... diğer parametreler -->
  
  <!-- Kullanıcının girdiği kart bilgileri -->
  <input type="hidden" name="cc_owner" value="{cardOwner}" />
  <input type="hidden" name="card_number" value="{cardNumber}" />
  <input type="hidden" name="expiry_month" value="{expiryMonth}" />
  <input type="hidden" name="expiry_year" value="{expiryYear}" />
  <input type="hidden" name="cvv" value="{cvv}" />
  <input type="hidden" name="non_3d" value="{secure3d ? '0' : '1'}" />
</form>
```

**Özellikler**:
- Form otomatik olarak gönderilir (useEffect ile)
- Form submit edildikten sonra kullanıcı PayTR sayfasına yönlendirilir
- PayTR sayfasında 3D Secure doğrulama yapılır

---

### 3D Secure Doğrulama

**Akış**:
1. Kullanıcı PayTR sayfasına yönlendirilir
2. Kart bilgileri doğrulanır
3. Bankanın 3D Secure sayfası açılır
4. Kullanıcı 3D Secure şifresini girer
5. Doğrulama başarılı olursa `merchant_ok_url`'e yönlendirilir
6. Doğrulama başarısız olursa `merchant_fail_url`'e yönlendirilir

**Callback URL'leri**:
- **Başarılı**: `/basarili` veya backend'in belirlediği URL
- **Başarısız**: `/basarisiz` veya backend'in belirlediği URL

---

## Adım 6: Başarılı Ödeme

### Başarı Mesajı

**Component**: `OrderSummary.tsx` → SuccessNotification

**Modal Tasarımı**:
```
┌─────────────────────────────────────────┐
│                                         │
│        [✓]                              │
│                                         │
│  Siparişiniz Başarıyla Oluşturuldu!   │
│                                         │
│  Siparişiniz başarıyla oluşturuldu.    │
│  Anasayfaya yönlendiriliyorsunuz...    │
│                                         │
│  [Geçmiş Siparişlerim]                 │
│  [Anasayfaya Dön]                       │
│                                         │
└─────────────────────────────────────────┘
```

**Özellikler**:
- Yeşil checkmark ikonu
- Başarı mesajı
- 5 saniye sonra otomatik olarak anasayfaya yönlendirilir
- İki buton:
  - **Geçmiş Siparişlerim**: `/hesabim/siparislerim` sayfasına gider
  - **Anasayfaya Dön**: `/` sayfasına gider

---

## Hata Yönetimi

### Adres Seçimi Hataları

**Hata**: Adres seçilmedi
- **Mesaj**: "Lütfen bir teslimat adresi seçin"
- **Aksiyon**: Toast error mesajı gösterilir

**Hata**: Adres eklenemedi
- **Mesaj**: API'den gelen hata mesajı
- **Aksiyon**: Toast error mesajı gösterilir

---

### Ödeme Bilgileri Hataları

**Hata**: Kart bilgileri geçersiz
- **Mesaj**: Validasyon mesajları (her alan için ayrı)
- **Aksiyon**: İlgili input'un altında hata mesajı gösterilir

**Hata**: BIN sorgusu başarısız
- **Mesaj**: Fallback olarak basit kart türü tespiti yapılır
- **Aksiyon**: Hata mesajı gösterilmez, işlem devam eder

**Hata**: Taksit oranları alınamadı
- **Mesaj**: "Taksit seçenekleri yükleniyor..." mesajı gösterilir
- **Aksiyon**: Taksit tablosu gösterilmez, tek çekim seçili kalır

---

### Sipariş Oluşturma Hataları

**Hata**: Basket ID bulunamadı
- **Mesaj**: "Sepet bilgileri bulunamadı. Lütfen sepetinize ürün ekleyin veya sayfayı yenileyin."
- **Aksiyon**: Toast error mesajı gösterilir

**Hata**: Adres ID bulunamadı
- **Mesaj**: "Lütfen bir teslimat adresi seçin"
- **Aksiyon**: Toast error mesajı gösterilir

**Hata**: Sipariş oluşturulamadı
- **Mesaj**: API'den gelen hata mesajı
- **Aksiyon**: Toast error mesajı gösterilir

**Hata**: 401 Unauthorized
- **Mesaj**: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın."
- **Aksiyon**: Token silinir, login sayfasına yönlendirilir

**Hata**: Network Error
- **Mesaj**: "İşlem sırasında bir hata oluştu"
- **Aksiyon**: Toast error mesajı gösterilir

---

### Sözleşme Hatası

**Hata**: Sözleşmeler kabul edilmedi
- **Mesaj**: "Lütfen sözleşmeleri kabul edin"
- **Aksiyon**: Toast error mesajı gösterilir

---

## Loading States

### Adres Yükleme
- Adres listesi yüklenirken spinner gösterilir
- Adres yoksa "Adres eklemek için tıklayın" mesajı gösterilir

### Kart Bilgileri Validasyonu
- BIN sorgusu yapılırken kart numarası input'unun yanında spinner gösterilir
- Taksit oranları yüklenirken "Taksit oranları yükleniyor..." mesajı gösterilir

### Sipariş Oluşturma
- "Ödemeyi Tamamla" butonu disabled olur
- Buton metni "İşleniyor..." olur
- Spinner gösterilir

### PayTR Yönlendirmesi
- Form gönderilirken kullanıcı PayTR sayfasına yönlendirilir
- Yönlendirme sırasında loading gösterilmez (PayTR sayfası açılır)

---

## Responsive Tasarım

### Desktop Layout
```
┌─────────────────────────────────────────────────────────────┐
│  Header                                                     │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  Tabs                            │  OrderSummary            │
│  [Adres] [Ödeme]                │  (Sticky Sidebar)        │
│                                  │                          │
│  CartProducts                    │  - Kampanya Özeti        │
│  (Accordion)                     │  - Sipariş Detayları     │
│                                  │  - Toplam                │
│  AddressSection /                │  - Buton                 │
│  PaymentOptions                  │  - Sözleşmeler           │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
│  Footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout
```
┌──────────────────────────────┐
│  Header                     │
├──────────────────────────────┤
│                              │
│  Tabs                        │
│  [Adres] [Ödeme]            │
│                              │
│  CartProducts                │
│  (Accordion)                 │
│                              │
│  AddressSection /            │
│  PaymentOptions              │
│                              │
│                              │
│                              │
├──────────────────────────────┤
│  OrderSummary                │
│  (Fixed Bottom)              │
│  - Toplam                    │
│  - Buton                     │
│  - Sözleşmeler               │
└──────────────────────────────┘
│  Footer                     │
└──────────────────────────────┘
```

---

## State Yönetimi

### Container Component State

```typescript
{
  activeTab: "address" | "payment",
  showAddressPopup: boolean,
  selectedAddress: { id: string } | null,
  hasAddress: boolean,
  selectedInstallment: { count: number; rate: number } | null,
  cardType: string,
  cardInfo: {
    cardNumber: string,
    cardOwner: string,
    expiryMonth: string,
    expiryYear: string,
    cvv: string,
    secure3d: boolean,
    isValid: boolean
  }
}
```

---

## Data Flow

```
User clicks "Sepeti Onayla"
    ↓
CheckoutPage (Server Component)
    ├── Fetch User Profile
    ├── Fetch User Addresses
    └── Fetch Basket Data
    ↓
CheckoutPageClient (Client Component)
    ↓
Container Component
    ├── Initial State Setup
    ├── Address Selection
    └── Payment Selection
    ↓
OrderSummary Component
    ├── Calculate Totals
    ├── Validate Inputs
    └── Create Order
    ↓
Order Service
    ├── POST /api/v1/customer/orders (Customer)
    └── POST /api/v1/orders (Guest)
    ↓
PayTR Integration
    ├── Form Submission
    ├── 3D Secure
    └── Callback
    ↓
Success Notification
    └── Redirect
```

---

## İyileştirme Önerileri

1. **Performance**:
   - BIN sorgusu için debounce eklenebilir
   - Taksit oranları cache'lenebilir
   - Image lazy loading eklenebilir

2. **UX**:
   - Form kaydetme (draft) özelliği eklenebilir
   - Adres seçiminde harita entegrasyonu eklenebilir
   - Ödeme geçmişi gösterilebilir

3. **Security**:
   - Kart bilgileri asla backend'e gönderilmemeli (sadece PayTR'ye)
   - CSRF token kullanılabilir
   - Rate limiting eklenebilir

4. **Error Handling**:
   - Daha detaylı hata mesajları
   - Retry mekanizması
   - Offline mode desteği

---

## İlgili Dosyalar

- `app/sepetim/odeme/page.tsx` - Server component
- `app/sepetim/odeme/CheckoutPageClient.tsx` - Client component
- `app/sepetim/odeme/components/Container.tsx` - Container
- `app/sepetim/odeme/components/AddressSection.tsx` - Adres bölümü
- `app/sepetim/odeme/components/PaymentOptions.tsx` - Ödeme seçenekleri
- `app/sepetim/odeme/components/OrderSummary.tsx` - Sipariş özeti
- `app/sepetim/odeme/components/Tabs.tsx` - Tab'lar
- `app/sepetim/odeme/components/CartProducts.tsx` - Sepet ürünleri
- `components/cart/AddressPopup.tsx` - Adres ekleme popup'ı
- `components/common/DistanceSalesAgreementModal.tsx` - Mesafeli satış sözleşmesi modal'ı
- `app/services/orderService.ts` - Sipariş servisi
- `app/context/BasketContext.tsx` - Basket state yönetimi
- `app/context/AuthContext.tsx` - Auth state yönetimi

---

## Changelog

### v1.0.0
- İlk versiyon
- Customer ve Guest kullanıcı desteği
- Adres seçimi ve yönetimi
- Kart bilgileri girişi ve validasyonu
- BIN sorgusu ve kart türü tespiti
- Taksit oranları sorgusu
- Sipariş oluşturma
- PayTR entegrasyonu
- 3D Secure desteği
- Responsive tasarım
- Hata yönetimi
- Loading states
- Başarı mesajı ve yönlendirme

