# UGC Video Oluşturucu

Kullanıcıların prompt ve ürün resmi girerek AI destekli video oluşturduğu Flutter uygulaması.

## Özellikler

- 📝 **Prompt Girişi**: Kullanıcılar video için prompt metni girebilir
- 📸 **Ürün Resmi Seçimi**: Galeri veya kameradan ürün resmi seçilebilir
- 🧑‍🎨 **Karakter & Ses Stüdyosu**: Hazır avatarları keşfedip kişiselleştirme, ses tonu seçme
- 🎬 **Video Önizleme & Kütüphane**: Oluşturulan videoları önizleme, yönetme, filtreleme
- 💾 **Kaydet ve Paylaş**: Videoları kaydetme, indirme ve sosyal medyada paylaşma
- 🎨 **Modern UI**: Material Design 3 ile modern ve kullanıcı dostu arayüz

## Proje Yapısı

```
lib/
├── models/
│   └── video_request.dart
├── screens/
│   ├── main_shell.dart          # Bottom navigation shell
│   ├── dashboard_screen.dart    # Ana özet ekranı
│   ├── characters_screen.dart   # Karakter & ses stüdyosu
│   ├── create_screen.dart       # Prompt + ürün görseli formu
│   ├── library_screen.dart      # Video kütüphanesi
│   ├── video_preview_screen.dart# Video önizleme
│   └── profile_screen.dart      # Profil ve ayarlar
└── main.dart
```

## Kurulum

### Gereksinimler

- Flutter SDK (3.9.2 veya üzeri)
- Dart SDK

### Adımlar

1. Projeyi klonlayın:
```bash
cd ugc_video_app
```

2. Bağımlılıkları yükleyin:
```bash
flutter pub get
```

3. Uygulamayı çalıştırın:
```bash
flutter run
```

## Kullanım

### Video Oluşturma

1. Ana ekranda prompt metnini girin (en az 10 karakter)
2. Ürün resmini seçin (galeri veya kamera)
3. "Video Oluştur" butonuna tıklayın
4. Video önizleme ekranında sonucu görüntüleyin

### Video Yönetimi

- **Düzenle**: Video ayarlarını değiştir
- **Kaydet**: Videoyu cihaza kaydet
- **Paylaş**: Videoyu sosyal medyada paylaş
- **İndir**: Videoyu indir

## Kullanılan Paketler

- `image_picker`: Görsel seçimi (galeri/kamera)
- `video_player`: Video önizleme (statik tasarım için)
- `cached_network_image`: Görsel önbellekleme
- `shimmer`: Yükleme animasyonları

## Notlar

⚠️ **Önemli**: Bu uygulama şu anda **statik tasarım** olarak geliştirilmiştir. Gerçek video üretimi için:

- AI video generation API'si entegre edilmelidir (örn: RunwayML, Pika, Stable Video Diffusion)
- Backend servisi oluşturulmalıdır
- Video işleme ve render pipeline'ı kurulmalıdır

## Gelecek Geliştirmeler

- [ ] Gerçek AI video generation API entegrasyonu
- [ ] Video düzenleme özellikleri
- [ ] Çoklu video format desteği
- [ ] Video şablonları
- [ ] Kullanıcı hesap sistemi
- [ ] Video geçmişi ve kütüphanesi
- [ ] Sosyal medya entegrasyonları

## Lisans

Bu proje eğitim amaçlıdır.
