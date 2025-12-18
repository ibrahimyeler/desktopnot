# Trendruum Web - Tüm Sayfalar Listesi

Bu dokümantasyon, Trendruum web projesindeki tüm sayfaları ve route'ları içermektedir.

## 📋 İçindekiler

1. [Ana Sayfa](#ana-sayfa)
2. [Ürün Sayfaları](#ürün-sayfaları)
3. [Kategori Sayfaları](#kategori-sayfaları)
4. [Kullanıcı İşlemleri](#kullanıcı-işlemleri)
5. [Hesabım Sayfaları](#hesabım-sayfaları)
6. [Sepet ve Ödeme](#sepet-ve-ödeme)
7. [Mağaza ve Marka](#mağaza-ve-marka)
8. [Kampanya Sayfaları](#kampanya-sayfaları)
9. [Koleksiyonlar](#koleksiyonlar)
10. [Arama](#arama)
11. [Statik Sayfalar](#statik-sayfalar)
12. [Yardım ve Destek](#yardım-ve-destek)
13. [API Routes](#api-routes)

---

## 🏠 Ana Sayfa

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/` | `app/page.tsx` | Ana sayfa - Slider, popüler ürünler, kategoriler, kampanyalar |

---

## 📦 Ürün Sayfaları

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/urunler/[slug]` | `app/urunler/[slug]/page.tsx` | Ürün detay sayfası - Ürün bilgileri, görseller, yorumlar, sorular |

---

## 🗂️ Kategori Sayfaları

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/[category]` | `app/[category]/page.tsx` | Kategori sayfası - Kategori ürünleri, filtreler, sıralama |

---

## 👤 Kullanıcı İşlemleri

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/giris` | `app/giris/page.tsx` | Giriş sayfası |
| `/kayit-ol` | `app/kayit-ol/page.tsx` | Kayıt ol sayfası |
| `/sifremi-unuttum` | `app/sifremi-unuttum/page.tsx` | Şifre sıfırlama isteği sayfası |
| `/sifre-yenileme` | `app/sifre-yenileme/page.tsx` | Şifre yenileme sayfası (token ile) |

---

## 👤 Hesabım Sayfaları

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/hesabim` | `app/hesabim/page.tsx` | Hesabım ana sayfası - Dashboard |
| `/hesabim/kullanici-bilgilerim` | `app/hesabim/kullanici-bilgilerim/page.tsx` | Kullanıcı bilgileri düzenleme |
| `/hesabim/adres-bilgilerim` | `app/hesabim/adres-bilgilerim/page.tsx` | Adres yönetimi |
| `/hesabim/siparislerim` | `app/hesabim/siparislerim/page.tsx` | Tüm siparişler listesi |
| `/hesabim/siparislerim/[siparis_no]` | `app/hesabim/siparislerim/[siparis_no]/page.tsx` | Sipariş detay sayfası |
| `/hesabim/favoriler` | `app/hesabim/favoriler/page.tsx` | Favori ürünler |
| `/hesabim/koleksiyonlarim` | `app/hesabim/koleksiyonlarim/page.tsx` | Kullanıcı koleksiyonları |
| `/hesabim/onceden-gezdiklerim` | `app/hesabim/onceden-gezdiklerim/page.tsx` | Geçmişte görüntülenen ürünler |
| `/hesabim/degerlendirmelerim` | `app/hesabim/degerlendirmelerim/page.tsx` | Kullanıcının yaptığı değerlendirmeler |
| `/hesabim/mesajlarim` | `app/hesabim/mesajlarim/page.tsx` | Satıcılarla mesajlaşma |
| `/hesabim/takip-ettigim-magazalar` | `app/hesabim/takip-ettigim-magazalar/page.tsx` | Takip edilen mağazalar |
| `/hesabim/duyuru-tercihlerim` | `app/hesabim/duyuru-tercihlerim/page.tsx` | Bildirim tercihleri |
| `/hesabim/tekrar-al` | `app/hesabim/tekrar-al/page.tsx` | Önceki siparişlerden tekrar satın alma |

---

## 🛒 Sepet ve Ödeme

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/sepet` | `app/sepet/page.tsx` | Sepet sayfası |
| `/sepetim/odeme` | `app/sepetim/odeme/page.tsx` | Ödeme sayfası - Adres, kargo, ödeme yöntemi seçimi |
| `/basarili` | `app/basarili/page.tsx` | Ödeme başarılı sayfası |
| `/basarisiz` | `app/basarisiz/page.tsx` | Ödeme başarısız sayfası |

---

## 🏪 Mağaza ve Marka

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/magaza/[slug]` | `app/magaza/[slug]/page.tsx` | Mağaza sayfası - Mağaza bilgileri, ürünler, takip et |
| `/markalar/[slug]` | `app/markalar/[slug]/page.tsx` | Marka sayfası - Marka bilgileri ve ürünleri |

---

## 🎯 Kampanya Sayfaları

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/kampanyalar` | `app/kampanyalar/page.tsx` | Tüm kampanyalar listesi |
| `/kampanyalar/[slug]/urunler` | `app/kampanyalar/[slug]/urunler/page.tsx` | Kampanya ürünleri sayfası |

---

## 📚 Koleksiyonlar

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/koleksiyonlar/koleksiyonlarim` | `app/koleksiyonlar/koleksiyonlarim/page.tsx` | Koleksiyonlar sayfası |

---

## 🔍 Arama

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/q` | `app/q/page.tsx` | Arama sayfası - Ürün, kategori, marka, mağaza araması |

---

## 📄 Statik Sayfalar (s/)

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/s/homepage` | `app/s/homepage/page.tsx` | Ana sayfa (alternatif) |
| `/s/hakkimizda` | `app/s/hakkimizda/page.tsx` | Hakkımızda sayfası |
| `/s/iletisim` | `app/s/iletisim/page.tsx` | İletişim sayfası |
| `/s/kariyer` | `app/s/kariyer/page.tsx` | Kariyer sayfası |
| `/s/satici-olmak-istiyorum` | `app/s/satici-olmak-istiyorum/page.tsx` | Satıcı olmak isteyenler için |
| `/s/sirket-bilgileri` | `app/s/sirket-bilgileri/page.tsx` | Şirket bilgileri |
| `/s/sosyal-medya` | `app/s/sosyal-medya/page.tsx` | Sosyal medya hesapları |
| `/s/sss` | `app/s/sss/page.tsx` | Sık sorulan sorular |
| `/s/surdurulebilirlik` | `app/s/surdurulebilirlik/page.tsx` | Sürdürülebilirlik sayfası |
| `/s/yardim-merkezi` | `app/s/yardim-merkezi/page.tsx` | Yardım merkezi |
| `/s/[slug]` | `app/s/[slug]/page.tsx` | Dinamik statik sayfa |

---

## ❓ Yardım ve Destek

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/yardim-destek` | `app/yardim-destek/page.tsx` | Yardım ve destek ana sayfası |
| `/yardim-destek/iade` | `app/yardim-destek/iade/page.tsx` | İade işlemleri |
| `/iletisim` | `app/iletisim/page.tsx` | İletişim formu |

---

## 📋 Yasal Sayfalar (HTML)

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/kvkk.html` | `app/kvkk.html` | KVKK Aydınlatma Metni |
| `/acik-riza.html` | `app/acik-riza.html` | Açık Rıza Metni |
| `/aydinlatma.html` | `app/aydinlatma.html` | Aydınlatma Metni |
| `/mesafeli-satis-sozlesmesi.html` | `app/mesafeli-satis-sozlesmesi.html` | Mesafeli Satış Sözleşmesi |
| `/on-bilgilendirme-formu.html` | `app/on-bilgilendirme-formu.html` | Ön Bilgilendirme Formu |
| `/on-bilgilendirme-kosullari.html` | `app/on-bilgilendirme-kosullari.html` | Ön Bilgilendirme Koşulları |
| `/kayit-ol/uyelik-kosullari.html` | `app/kayit-ol/uyelik-kosullari.html` | Üyelik Koşulları |

---

## 🔌 API Routes

### Authentication
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/auth/[...nextauth]` | `app/api/auth/[...nextauth]/route.ts` | NextAuth authentication |

### Products
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/products` | `app/api/products/route.ts` | Ürün API endpoint'i |
| `/api/products/search` | `app/api/products/search/route.ts` | Ürün arama API |

### Categories
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/v1/categories` | `app/api/v1/categories/route.ts` | Kategori listesi |
| `/api/v1/categories/[slug]` | `app/api/v1/categories/[slug]/route.ts` | Kategori detay |
| `/api/v1/categories/tree` | `app/api/v1/categories/tree/route.ts` | Kategori ağacı |

### Brands
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/v1/brands` | `app/api/v1/brands/route.ts` | Marka listesi |
| `/api/v1/brands/[slug]` | `app/api/v1/brands/[slug]/route.ts` | Marka detay |

### Sellers
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/v1/sellers/[slug]` | `app/api/v1/sellers/[slug]/route.ts` | Satıcı bilgileri |

### Customer
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/v1/customer/addresses` | `app/api/v1/customer/addresses/route.ts` | Müşteri adresleri |
| `/api/v1/customer/orders` | `app/api/v1/customer/orders/route.ts` | Müşteri siparişleri |

### Other APIs
| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/api/address` | `app/api/address/route.ts` | Adres API |
| `/api/chat` | `app/api/chat/route.ts` | Chat API |
| `/api/guest-customer` | `app/api/guest-customer/route.ts` | Misafir müşteri API |
| `/api/navigation/top` | `app/api/navigation/top/route.ts` | Üst navigasyon |
| `/api/notifications/preferences` | `app/api/notifications/preferences/route.ts` | Bildirim tercihleri |
| `/api/product-reviews` | `app/api/product-reviews/route.ts` | Ürün yorumları |
| `/api/campaigns/search` | `app/api/campaigns/search/route.ts` | Kampanya arama |
| `/api/proxy/[...path]` | `app/api/proxy/[...path]/route.ts` | Proxy API |

---

## 🧪 Test Sayfaları

| Route | Dosya | Açıklama |
|-------|-------|----------|
| `/test-sliding-banner` | `app/test-sliding-banner/page.tsx` | Sliding banner test sayfası |

---

## 📊 Sayfa İstatistikleri

- **Toplam Sayfa Sayısı**: ~50+ sayfa
- **Dinamik Route'lar**: 8
- **API Endpoint'leri**: 15+
- **Statik HTML Sayfaları**: 7

---

## 🔗 Route Kategorileri

### Public Sayfalar
- Ana sayfa, ürün, kategori, arama, mağaza, marka sayfaları

### Authentication Gerektiren Sayfalar
- Hesabım alt sayfaları
- Sepet ve ödeme sayfaları
- Favoriler, koleksiyonlar

### Guest Erişimli Sayfalar
- Ürün görüntüleme
- Arama
- Kategori görüntüleme
- Sepet (guest mode)

---

## 📝 Notlar

- Tüm sayfalar Next.js 13+ App Router yapısını kullanmaktadır
- Client component'ler `"use client"` direktifi ile işaretlenmiştir
- Server component'ler varsayılan olarak server-side render edilir
- API route'ları RESTful yapıda tasarlanmıştır
- Dinamik route'lar `[param]` syntax'ı ile tanımlanmıştır

---

**Son Güncelleme**: 2024
**Proje**: Trendruum Web Application
**Framework**: Next.js 13+ (App Router)

