# Berber Admin Panel

Modern ve sleek tasarıma sahip, dark tema ile geliştirilmiş berber randevu yönetim sistemi admin paneli.

## Özellikler

- 🌙 **Dark Tema**: Göz yormayan, modern dark tema tasarımı
- 📱 **Responsive**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Sleek Tasarım**: Modern ve kullanıcı dostu arayüz
- 🔄 **Modüler Yapı**: Component bazlı, yeniden kullanılabilir kod yapısı
- 🌐 **İngilizce URL'ler**: URL'ler İngilizce, içerikler Türkçe
- ⚡ **Next.js 16**: En son Next.js teknolojisi ile geliştirilmiş

## Renk Paleti

- **Primary**: `#2C3E50`
- **Secondary**: `#3498DB`
- **Accent**: `#E74C3C`
- **Background**: `#0F172A`
- **Card Background**: `#1E293B`
- **Text Primary**: `#E5E7EB`
- **Text Secondary**: `#CBD5E1`
- **Border**: `#334155`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

## Proje Yapısı

```
berber-admin/
├── app/
│   ├── dashboard/          # Dashboard sayfası
│   ├── barbers/            # Berberler sayfası
│   ├── appointments/       # Randevular sayfası
│   ├── customers/          # Müşteriler sayfası
│   ├── settings/           # Ayarlar sayfası
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Ana sayfa (dashboard'a yönlendirir)
│   └── globals.css        # Global stiller
├── components/
│   ├── layout/             # Layout componentleri
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   ├── dashboard/          # Dashboard componentleri
│   │   ├── WelcomeSection.tsx
│   │   ├── StatsGrid.tsx
│   │   ├── RecentAppointments.tsx
│   │   └── TopBarbers.tsx
│   ├── barbers/           # Berber componentleri
│   │   ├── BarberCard.tsx
│   │   └── BarberList.tsx
│   ├── appointments/      # Randevu componentleri
│   │   ├── AppointmentCard.tsx
│   │   └── AppointmentList.tsx
│   ├── customers/         # Müşteri componentleri
│   │   ├── CustomerCard.tsx
│   │   └── CustomerList.tsx
│   └── common/            # Ortak componentler
│       └── StatCard.tsx
└── package.json
```

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## Sayfalar

### Dashboard (`/dashboard`)
- Genel istatistikler
- Son randevular
- En çok randevu alan berberler
- Hoş geldin mesajı

### Berberler (`/barbers`)
- Tüm berberleri listeleme
- Berber arama
- Berber ekleme/düzenleme/silme
- Berber istatistikleri

### Randevular (`/appointments`)
- Tüm randevuları listeleme
- Randevu filtreleme (durum, tarih)
- Randevu onaylama/iptal etme
- Randevu istatistikleri

### Müşteriler (`/customers`)
- Tüm müşterileri listeleme
- Müşteri arama
- Müşteri ekleme/düzenleme/silme
- Müşteri istatistikleri

### Ayarlar (`/settings`)
- Sistem ayarları
- Bildirim ayarları
- Güvenlik ayarları
- Sistem bilgileri

## Teknolojiler

- **Next.js 16**: React framework
- **TypeScript**: Tip güvenliği
- **Tailwind CSS 4**: Styling
- **Lucide React**: İkonlar

## Geliştirme

Proje modüler component yapısı ile geliştirilmiştir. Her sayfa kendi componentlerini içerir ve ortak componentler `components/common` klasöründe bulunur.

## Lisans

Bu proje özel bir projedir.
