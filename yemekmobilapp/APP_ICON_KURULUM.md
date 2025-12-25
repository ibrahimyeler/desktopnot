# App Icon Kurulum Rehberi

Bu rehber, yemekmobilapp projesine app icon ekleme adımlarını açıklar.

## 📋 Gereksinimler

App icon dosyanız şu özelliklere sahip olmalıdır:
- **Format:** PNG
- **Boyut:** 1024x1024 piksel (önerilen, minimum 512x512)
- **Dosya adı:** `app_icon.png`
- **Kare format:** Icon kare olmalı (1:1 aspect ratio)

## 📁 Adım 1: Icon Dosyasını Yerleştirme

1. Oluşturduğunuz app icon dosyasını şu klasöre kopyalayın:
   ```
   yemekmobilapp/assets/icon/app_icon.png
   ```

2. Dosya adının tam olarak `app_icon.png` olduğundan emin olun.

## 🔧 Adım 2: Paketleri Yükleme

Terminal'de proje klasörüne gidin ve şu komutu çalıştırın:

```bash
cd /Users/macbookpro/Documents/yemekmobilapp
flutter pub get
```

## 🎨 Adım 3: Icon'ları Oluşturma

Icon'ları tüm platformlar için oluşturmak için şu komutu çalıştırın:

```bash
flutter pub run flutter_launcher_icons
```

Bu komut:
- ✅ Android için tüm mipmap klasörlerine icon'ları ekler
- ✅ iOS için AppIcon.appiconset klasörüne icon'ları ekler
- ✅ Web için icon'ları oluşturur
- ✅ Windows için icon dosyasını oluşturur
- ✅ macOS için icon'ları oluşturur
- ✅ Linux için icon'ları oluşturur

## ✅ Adım 4: Kontrol

Icon'ların başarıyla eklendiğini kontrol etmek için:

1. **Android:** `android/app/src/main/res/mipmap-*/ic_launcher.png` dosyalarını kontrol edin
2. **iOS:** `ios/Runner/Assets.xcassets/AppIcon.appiconset/` klasöründeki dosyaları kontrol edin
3. **Web:** `web/icons/` klasöründeki dosyaları kontrol edin

## 🚀 Adım 5: Test Etme

Uygulamayı çalıştırarak icon'un göründüğünü test edin:

```bash
# Android için
flutter run

# iOS için
flutter run -d ios

# Web için
flutter run -d chrome
```

## 🔄 Icon'u Güncelleme

Icon'u değiştirmek istediğinizde:

1. Yeni icon dosyasını `assets/icon/app_icon.png` olarak kaydedin
2. `flutter pub run flutter_launcher_icons` komutunu tekrar çalıştırın
3. Uygulamayı yeniden build edin

## ⚠️ Sorun Giderme

### Icon görünmüyor
- Icon dosyasının doğru konumda olduğundan emin olun: `assets/icon/app_icon.png`
- `flutter clean` çalıştırıp tekrar deneyin
- `flutter pub get` ve `flutter pub run flutter_launcher_icons` komutlarını tekrar çalıştırın

### Icon bozuk görünüyor
- Icon dosyasının 1024x1024 piksel olduğundan emin olun
- PNG formatında olduğundan emin olun
- Icon'un kare (1:1) olduğundan emin olun

### Build hatası
- `pubspec.yaml` dosyasındaki yapılandırmanın doğru olduğundan emin olun
- `flutter pub get` komutunu çalıştırın
- `flutter clean` ve `flutter pub get` komutlarını sırayla çalıştırın

## 📝 Notlar

- Icon dosyası projeye dahil edilmiştir (`pubspec.yaml`'da assets bölümü)
- Tüm platformlar için icon'lar otomatik oluşturulur
- Icon'lar build sırasında otomatik olarak kullanılır
- iOS için icon köşeleri otomatik yuvarlatılır
- Android için adaptive icon desteği mevcuttur

## 🎯 Sonuç

Icon başarıyla eklendikten sonra, uygulamanız tüm platformlarda özel icon'unuzla görünecektir!

