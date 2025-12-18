# Manzara Mekanları

Kullanıcıların cafelerde veya mekanlarda gittikleri zaman manzarası güzel yerleri keşfetmelerini ve paylaşmalarını sağlayan Flutter uygulaması.

## Özellikler

- 📍 **Konum Tabanlı Öneriler**: Kullanıcının konumuna göre yakındaki manzara mekanlarını gösterir
- 🗺️ **Harita Görünümü**: Google Maps entegrasyonu ile mekanları haritada görüntüleme
- 📝 **Yorum ve Değerlendirme**: Kullanıcılar mekanlar hakkında yorum yapabilir ve puan verebilir
- 📸 **Görsel Paylaşımı**: Mekan fotoğrafları ekleme ve paylaşma
- 🔄 **Sosyal Medya Entegrasyonu**: Yorumları ve fotoğrafları sosyal medyada paylaşma
- 📱 **Uygulama İçi Paylaşım**: Uygulama topluluğu içinde içerik paylaşımı

## Kurulum

### Gereksinimler

- Flutter SDK (3.9.2 veya üzeri)
- Dart SDK
- Android Studio / Xcode (platform geliştirme için)
- Google Maps API Key

### Adımlar

1. Projeyi klonlayın:
```bash
cd manzara_mekanlari
```

2. Bağımlılıkları yükleyin:
```bash
flutter pub get
```

3. Google Maps API Key alın:
   - [Google Cloud Console](https://console.cloud.google.com/) üzerinden bir proje oluşturun
   - Maps SDK for Android ve Maps SDK for iOS'u etkinleştirin
   - API Key oluşturun

4. API Key'i yapılandırın:
   - **Android**: `android/app/src/main/AndroidManifest.xml` dosyasında `YOUR_GOOGLE_MAPS_API_KEY` yerine API key'inizi yazın
   - **iOS**: `ios/Runner/Info.plist` dosyasında `YOUR_GOOGLE_MAPS_API_KEY` yerine API key'inizi yazın

5. Uygulamayı çalıştırın:
```bash
flutter run
```

## Kullanım

### Ana Ekran
- Uygulama açıldığında kullanıcının konumu alınır
- Harita veya liste görünümü arasında geçiş yapılabilir
- Yakındaki mekanlar mesafeye göre sıralanır

### Mekan Ekleme
- "+" butonuna tıklayarak yeni mekan eklenebilir
- Mekan adı, kategori, açıklama ve konum bilgileri girilir
- Fotoğraf eklenebilir (galeri veya kamera)

### Yorum Ekleme
- Mekan detay sayfasından yorum eklenebilir
- 1-5 yıldız arası puan verilebilir
- Fotoğraf eklenebilir
- Yorumlar uygulama içinde ve sosyal medyada paylaşılabilir

## Proje Yapısı

```
lib/
├── models/
│   ├── place.dart          # Mekan modeli
│   └── review.dart         # Yorum modeli
├── services/
│   ├── location_service.dart    # Konum servisleri
│   └── place_service.dart       # Mekan ve yorum yönetimi
├── screens/
│   ├── home_screen.dart         # Ana ekran (harita/liste)
│   ├── place_detail_screen.dart # Mekan detay sayfası
│   ├── add_place_screen.dart    # Mekan ekleme sayfası
│   └── add_review_screen.dart   # Yorum ekleme sayfası
└── main.dart                     # Uygulama giriş noktası
```

## Kullanılan Paketler

- `geolocator`: Konum servisleri
- `geocoding`: Koordinat-adres dönüşümü
- `google_maps_flutter`: Harita görünümü
- `image_picker`: Görsel seçimi
- `shared_preferences`: Yerel veri saklama
- `share_plus`: Sosyal medya paylaşımı
- `cached_network_image`: Görsel önbellekleme
- `flutter_rating_bar`: Puanlama çubuğu

## Notlar

- Şu anda veriler yerel olarak (SharedPreferences) saklanmaktadır
- Görseller gerçek uygulamada Firebase Storage veya benzer bir servis kullanılarak saklanmalıdır
- Kullanıcı kimlik doğrulama sistemi eklenmelidir
- Google Maps API Key'i mutlaka yapılandırılmalıdır

## Gelecek Geliştirmeler

- [ ] Firebase entegrasyonu (Firestore, Storage, Authentication)
- [ ] Kullanıcı profil sistemi
- [ ] Favori mekanlar
- [ ] Arama ve filtreleme
- [ ] Bildirimler
- [ ] Offline mod desteği

## Lisans

Bu proje eğitim amaçlıdır.
