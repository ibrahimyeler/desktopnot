# Yemek Geldi - Admin Panel

Modern ve kapsamlı bir catering yönetim sistemi için admin panel uygulaması.

## 🚀 Özellikler

### 1. Kimlik & Yetkilendirme Modülü (Auth & RBAC)
- ✅ Admin kullanıcı yönetimi
- ✅ Rol bazlı erişim kontrolü (RBAC)
- ✅ İki adımlı doğrulama desteği (2FA)
- ✅ Oturum yönetimi

### 2. Catering Şirketleri Yönetimi
- ✅ Catering firması listesi ve detay görüntüleme
- ✅ Arama ve filtreleme (aktif/pasif, rating, lokasyon)
- ✅ Sözleşme ve fiyatlandırma yönetimi
- ✅ Performans raporları

### 3. Şirketler Yönetimi
- ✅ Şirket listesi ve profil yönetimi
- ✅ Şirket-catering eşleştirme
- ✅ Personel toplu içe aktarma (CSV)
- ✅ Sözleşme yönetimi

### 4. Çalışan Yönetimi
- ✅ Çalışan listesi ve detay görüntüleme
- ✅ Alerjen bilgileri yönetimi
- ✅ Sipariş geçmişi
- ✅ Toplu çalışan içe aktarma

### 5. Menü ve Yemek İçerikleri Yönetimi
- ✅ Menü onay mekanizması
- ✅ Yemek içerikleri master data
- ✅ Alerjen yönetimi
- ✅ Kategori yönetimi

### 6. Sipariş Yönetimi
- ✅ Günlük/haftalık sipariş görüntüleme
- ✅ Şirket ve catering bazlı sipariş dağılımı
- ✅ Sipariş durumu takibi
- ✅ Manuel sipariş düzeltme

### 7. Teslimat & QR Kontrol Sistemi
- ✅ QR kod logları
- ✅ Teslimat raporları
- ✅ Saatlik teslim hızları
- ✅ Teslimat tamamlanma oranları

### 8. Fiyatlandırma, Paketler & Ödemeler
- ✅ Abonelik planları
- ✅ Faturalandırma yönetimi
- ✅ Ödeme geçmişi
- ✅ Ödeme gateway entegrasyonları

### 9. Destek & Şikayet Yönetimi
- ✅ Ticket sistemi
- ✅ Şikayet türleri yönetimi
- ✅ Ticket atama ve not ekleme
- ✅ Ticket kapatma ve değerlendirme

### 10. Bildirim Yönetimi
- ✅ Sistem genelinde bildirim gönderme
- ✅ Bildirim şablonları
- ✅ Push, Email, SMS kanalları
- ✅ Bildirim logları

### 11. Dashboard & Raporlama
- ✅ Genel metrikler
- ✅ Günlük sipariş trendi grafikleri
- ✅ Popüler yemekler analizi
- ✅ Catering performans karşılaştırması
- ✅ Excel/PDF rapor indirme

### 12. Sistem Ayarları
- ✅ Genel ayarlar (logo, renk, marka)
- ✅ Email ve ödeme gateway yapılandırması
- ✅ Güvenlik ayarları (IP kısıtlama, API key)
- ✅ Log retention ayarları

### 13. Log & İzleme Sistemi
- ✅ Sistem logları
- ✅ API logları
- ✅ Entegrasyon logları
- ✅ Hata logları

## 📁 Proje Yapısı

```
yemekgeldi/
├── app/
│   ├── (admin)/          # Admin panel sayfaları
│   │   ├── dashboard/    # Dashboard
│   │   ├── catering/     # Catering yönetimi
│   │   ├── companies/    # Şirket yönetimi
│   │   ├── employees/    # Çalışan yönetimi
│   │   ├── menus/        # Menü yönetimi
│   │   ├── orders/       # Sipariş yönetimi
│   │   ├── delivery/     # Teslimat & QR
│   │   ├── pricing/      # Fiyatlandırma
│   │   ├── support/      # Destek & Şikayet
│   │   ├── notifications/# Bildirimler
│   │   ├── settings/     # Sistem ayarları
│   │   ├── logs/         # Log & İzleme
│   │   └── layout.tsx    # Admin layout
│   ├── (auth)/           # Authentication sayfaları
│   │   ├── login/
│   │   └── reset-password/
│   └── page.tsx          # Ana sayfa (redirect to login)
├── components/
│   ├── ui/               # UI bileşenleri (Button, Card, Table, Input)
│   ├── charts/           # Grafik bileşenleri
│   ├── forms/            # Form bileşenleri
│   └── layout/           # Layout bileşenleri (Sidebar, Header)
├── lib/
│   ├── api/              # API istekleri
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Yardımcı fonksiyonlar
│   ├── validation/       # Zod validasyon şemaları
│   └── types/            # TypeScript type definitions
├── services/             # Service katmanı
└── public/               # Statik dosyalar
```

## 🛠️ Teknolojiler

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form, Zod
- **Date Handling:** date-fns
- **Language:** TypeScript

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## 🔧 Yapılandırma

Proje için gerekli environment değişkenlerini `.env.local` dosyasında tanımlayın:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
# Diğer environment değişkenleri...
```

## 📝 Geliştirme Notları

- Tüm sayfalar mock data ile çalışmaktadır. Backend API entegrasyonu için `lib/api/` ve `services/` klasörlerindeki dosyaları güncelleyin.
- Authentication akışı için `services/authService.ts` dosyasını backend API'nize göre yapılandırın.
- UI bileşenleri `components/ui/` klasöründe bulunur ve genişletilebilir.
- TypeScript type definitions `lib/types/` klasöründe tanımlıdır.

## 🚀 Production Build

Production için build almak için:

```bash
npm run build
npm start
```

## 📄 Lisans

Bu proje özel bir projedir.
