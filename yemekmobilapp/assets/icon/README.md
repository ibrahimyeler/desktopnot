# App Icon Klasörü

Bu klasöre app icon dosyanızı ekleyin.

## Gereksinimler

- **Dosya adı:** `app_icon.png`
- **Boyut:** 1024x1024 piksel (önerilen)
- **Format:** PNG (şeffaf arka plan desteklenir)
- **Minimum boyut:** 512x512 piksel

## Icon Özellikleri

- Kare formatında olmalı
- Yüksek kaliteli ve net olmalı
- Şeffaf arka plan kullanılabilir
- iOS için: Köşeler otomatik yuvarlatılır
- Android için: Adaptive icon desteği

## Kullanım

1. Icon dosyanızı bu klasöre `app_icon.png` adıyla kaydedin
2. Terminal'de şu komutu çalıştırın:
   ```bash
   flutter pub get
   flutter pub run flutter_launcher_icons
   ```

Bu komut tüm platformlar için gerekli icon boyutlarını otomatik oluşturacaktır.

