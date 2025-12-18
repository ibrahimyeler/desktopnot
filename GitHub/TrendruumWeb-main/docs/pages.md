# Trendruum Web – Sayfa Envanteri

> Güncelleme tarihi: 24 Kasım 2025  
> Bu doküman, `app/` dizinindeki tüm `page.tsx` dosyaları ile kök seviyedeki statik HTML sayfalarının tamamını listeler.

## Özet

- **Next.js sayfaları:** 47 adet
- **Statik HTML sayfaları:** 6 adet

---

## Next.js (App Router) Sayfaları

| Route | Kaynak Dosya | Açıklama |
| --- | --- | --- |
| `/` | `app/page.tsx` | Ana sayfa |
| `/[category]` | `app/[category]/page.tsx` | Dinamik kategori sayfası |
| `/basarili` | `app/basarili/page.tsx` | Ödeme başarılı sayfası |
| `/basarisiz` | `app/basarisiz/page.tsx` | Ödeme başarısız sayfası |
| `/giris` | `app/giris/page.tsx` | Giriş |
| `/kampanyalar` | `app/kampanyalar/page.tsx` | Kampanyalar listesi |
| `/kampanyalar/[slug]/urunler` | `app/kampanyalar/[slug]/urunler/page.tsx` | Kampanya ürünleri |
| `/kayit-ol` | `app/kayit-ol/page.tsx` | Kayıt ol |
| `/koleksiyonlar/koleksiyonlarim` | `app/koleksiyonlar/koleksiyonlarim/page.tsx` | Koleksiyonlarım |
| `/iletisim` | `app/iletisim/page.tsx` | İletişim |
| `/magaza/[slug]` | `app/magaza/[slug]/page.tsx` | Mağaza sayfası |
| `/markalar/[slug]` | `app/markalar/[slug]/page.tsx` | Marka sayfası |
| `/q` | `app/q/page.tsx` | Arama sonuçları |
| `/s/[slug]` | `app/s/[slug]/page.tsx` | Dinamik kurumsal içerik |
| `/s/hakkimizda` | `app/s/hakkimizda/page.tsx` | Hakkımızda |
| `/s/homepage` | `app/s/homepage/page.tsx` | CMS ana sayfa |
| `/s/iletisim` | `app/s/iletisim/page.tsx` | Kurumsal iletişim |
| `/s/kariyer` | `app/s/kariyer/page.tsx` | Kariyer |
| `/s/satici-olmak-istiyorum` | `app/s/satici-olmak-istiyorum/page.tsx` | Satıcı olma bilgisi |
| `/s/sosyal-medya` | `app/s/sosyal-medya/page.tsx` | Sosyal medya |
| `/s/sss` | `app/s/sss/page.tsx` | SSS |
| `/s/surdurulebilirlik` | `app/s/surdurulebilirlik/page.tsx` | Sürdürülebilirlik |
| `/s/yardim-merkezi` | `app/s/yardim-merkezi/page.tsx` | Yardım merkezi |
| `/s/sirket-bilgileri` | `app/s/sirket-bilgileri/page.tsx` | Şirket bilgileri |
| `/s/yardim-merkezi` | `app/s/yardim-merkezi/page.tsx` | Yardım merkezi |
| `/sifremi-unuttum` | `app/sifremi-unuttum/page.tsx` | Şifre sıfırlama başlangıcı |
| `/sifre-yenileme` | `app/sifre-yenileme/page.tsx` | Şifre yenileme formu |
| `/sepet` | `app/sepet/page.tsx` | Sepet |
| `/sepetim/odeme` | `app/sepetim/odeme/page.tsx` | Ödeme süreci |
| `/test-sliding-banner` | `app/test-sliding-banner/page.tsx` | Banner testi |
| `/urunler/[slug]` | `app/urunler/[slug]/page.tsx` | Ürün detay |
| `/yardim-destek` | `app/yardim-destek/page.tsx` | Yardım & destek |
| `/yardim-destek/iade` | `app/yardim-destek/iade/page.tsx` | İade bilgileri |
| `/hesabim` | `app/hesabim/page.tsx` | Hesabım ana |
| `/hesabim/adres-bilgilerim` | `app/hesabim/adres-bilgilerim/page.tsx` | Adres yönetimi |
| `/hesabim/degerlendirmelerim` | `app/hesabim/degerlendirmelerim/page.tsx` | Değerlendirmeler |
| `/hesabim/duyuru-tercihlerim` | `app/hesabim/duyuru-tercihlerim/page.tsx` | Duyuru tercihleri |
| `/hesabim/favoriler` | `app/hesabim/favoriler/page.tsx` | Favoriler |
| `/hesabim/koleksiyonlarim` | `app/hesabim/koleksiyonlarim/page.tsx` | Koleksiyonlar |
| `/hesabim/kullanici-bilgilerim` | `app/hesabim/kullanici-bilgilerim/page.tsx` | Kullanıcı bilgileri |
| `/hesabim/kuponlarim` | `app/hesabim/kuponlarim/page.tsx` | Kuponlar |
| `/hesabim/mesajlarim` | `app/hesabim/mesajlarim/page.tsx` | Mesajlar |
| `/hesabim/onceden-gezdiklerim` | `app/hesabim/onceden-gezdiklerim/page.tsx` | Önceden gezilenler |
| `/hesabim/siparislerim` | `app/hesabim/siparislerim/page.tsx` | Sipariş listesi |
| `/hesabim/siparislerim/[siparis_no]` | `app/hesabim/siparislerim/[siparis_no]/page.tsx` | Sipariş detayı |
| `/hesabim/takip-ettigim-magazalar` | `app/hesabim/takip-ettigim-magazalar/page.tsx` | Takip edilen mağazalar |
| `/hesabim/tekrar-al` | `app/hesabim/tekrar-al/page.tsx` | Tekrar satın al |
| `/hesabim/kuponlarim` | `app/hesabim/kuponlarim/page.tsx` | Kuponlarım |

> **Not:** `/s/[slug]`, `/[category]`, `/magaza/[slug]`, `/markalar/[slug]`, `/kampanyalar/[slug]/urunler`, `/urunler/[slug]` ve `/hesabim/siparislerim/[siparis_no]` gibi yollar dinamik segmentler içerir.

---

## Statik HTML Sayfaları

Bu dosyalar doğrudan kök URL altında servis edilir (`/dosya-adı.html`):

| Route | Dosya | İçerik |
| --- | --- | --- |
| `/acik-riza.html` | `app/acik-riza.html` | Açık rıza metni |
| `/aydinlatma.html` | `app/aydinlatma.html` | Aydınlatma metni |
| `/kvkk.html` | `app/kvkk.html` | KVKK metni |
| `/mesafeli-satis-sozlesmesi.html` | `app/mesafeli-satis-sozlesmesi.html` | Mesafeli satış sözleşmesi |
| `/on-bilgilendirme-formu.html` | `app/on-bilgilendirme-formu.html` | Ön bilgilendirme formu |
| `/on-bilgilendirme-kosullari.html` | `app/on-bilgilendirme-kosullari.html` | Ön bilgilendirme koşulları |

---

## Kullanım Notları

- Yeni bir sayfa eklendiğinde bu dokümanı güncellemek için `glob_file_search("app/**/page.tsx")` ve `glob_file_search("app/*.html")` komutlarını tekrar çalıştırmanız yeterlidir.
- Dinamik segmentler (`[slug]`, `[category]` vb.) SEO ve breadcrumb’larda doğru şekilde yönetilmelidir.


