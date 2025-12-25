# Yemek Mobil Kurye - Kurye Paneli

Kuryelerin kullanacağı Flutter tabanlı mobil panel uygulaması.

## 📱 Özellikler

### 1. Dashboard (Ana Sayfa)
- Hoşgeldin mesajı ve tarih gösterimi
- İstatistik kartları:
  - Bugünkü teslimat sayısı
  - Toplam kazanç
  - Aktif teslimat sayısı
  - Haftalık toplam teslimat
- Aktif teslimatlar listesi
- Bugünkü teslimatlar özeti (Tamamlanan, Devam Eden, Bekleyen)

### 2. Teslimatlar
- Tab bazlı görünüm:
  - Yeni teslimatlar (kabul edilebilir)
  - Devam eden teslimatlar
  - Tamamlanan teslimatlar
  - İptal edilen teslimatlar
- Teslimat detay görüntüleme
- Teslimat kabul etme/tamamla işlemleri

### 3. Harita
- Teslimat rotası görüntüleme
- Aktif teslimatların harita üzerinde gösterimi
- Yol tarifi alma
- Konum takibi

### 4. Kazançlar
- Tab bazlı görünüm:
  - Bugünkü kazançlar
  - Bu hafta kazançlar
  - Bu ay kazançlar
- Toplam kazanç gösterimi
- Teslimat bazlı kazanç detayları
- Ortalama kazanç hesaplama

### 5. Profil
- Kurye profil bilgileri
- İstatistikler (toplam teslimat, puan, aktif durum)
- Menü öğeleri:
  - Profil bilgilerini düzenle
  - Araç bilgileri
  - Teslimat geçmişi
  - Ödeme bilgileri
  - Bildirim ayarları
  - Yardım ve destek
  - Hakkında
  - Çıkış yap

## 🏗️ Proje Yapısı

```
lib/
├── core/
│   ├── constants/          # Uygulama sabitleri
│   │   ├── app_colors.dart
│   │   └── app_constants.dart
│   └── theme/              # Tema ayarları
│       └── app_theme.dart
├── shared/
│   └── widgets/            # Paylaşılan widget'lar
│       └── bottom_nav_bar.dart
├── features/
│   ├── main/               # Ana navigasyon
│   │   └── presentation/
│   │       └── screens/
│   │           └── main_screen.dart
│   ├── dashboard/          # Dashboard ekranı
│   ├── deliveries/         # Teslimat yönetimi
│   ├── map/                # Harita görünümü
│   ├── earnings/           # Kazanç yönetimi
│   └── profile/            # Profil yönetimi
└── main.dart               # Ana uygulama dosyası
```

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   flutter pub get
   ```

2. Uygulamayı çalıştırın:
   ```bash
   flutter run
   ```

## 📦 Kullanılan Paketler

- **flutter_riverpod**: State management
- **dio**: HTTP client
- **geolocator**: Konum servisleri
- **google_maps_flutter**: Harita entegrasyonu
- **intl**: Tarih/saat formatlama
- **cached_network_image**: Görsel yükleme
- **flutter_secure_storage**: Güvenli veri saklama
- **firebase_core & firebase_messaging**: Push bildirimleri

## 🎨 Tasarım

Uygulama `barber-customer` projesiyle aynı renk paletini kullanmaktadır:
- Primary Color: #2C3E50 (Dark Blue-Gray)
- Secondary Color: #3498DB (Bright Blue)
- Accent Color: #E74C3C (Red)
- Success Color: #27AE60 (Green)
- Warning Color: #F39C12 (Orange)

## 📝 Notlar

- Harita ekranı için Google Maps API key'i eklenmesi gerekmektedir
- Firebase yapılandırması yapılmalıdır
- API entegrasyonları henüz mock data ile çalışmaktadır

## 🔄 Sonraki Adımlar

- [ ] Google Maps entegrasyonu
- [ ] API servisleri entegrasyonu
- [ ] Push bildirimleri yapılandırması
- [ ] Konum takibi implementasyonu
- [ ] Ödeme entegrasyonu
- [ ] Test yazımı
