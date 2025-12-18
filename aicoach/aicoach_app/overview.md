## Gofocus Uygulamasına Genel Bakış

### Amaç
- Kullanıcıların koçlarıyla etkileşimini kolaylaştırmak, ilerlemelerini takip etmek ve kişisel gelişim hedeflerini yönetmek.
- Yapay zekâ destekli koç asistanı ile toplantılar, sohbetler ve görevler için tek bir odak noktası sağlamak.
- CEO benzeri bir yönetim paneli sunarak kritik bilgileri özet halinde, detaya gitmek için hızlı erişim butonlarıyla göstermek.

### Temel Özellikler
- **LangChain entegrasyonu:** Gelişmiş AI zincirleri, vektör veritabanı aramaları ve özel agent/chain çalıştırmaları.
- **Modüler ekran tasarımları:** Ana sayfa, profil, koçlar, hedefler, geçmiş, topluluk, bildirimler, tema ve dil ayarları.
- **Dark tema odaklı UI:** Gofocus Pro kartının sarı-turuncu vurgularıyla uyumlu, minimalist ve gölgelerden arındırılmış tasarım.
- **Analitik raporlar:** Genel, koçlar ve hedefler için detaylı raporlama; hızlı erişim için özet kartlar.
- **Bildirim, tema ve dil yönetimi:** Kişiselleştirilmiş uygulama deneyimi için kalıcı ayarlar.

### Mimarinin Özeti
- **Ekranlar (`lib/screens`):** Her ana özelliğin kendi ekran dosyası bulunur (örneğin `home_screen.dart`, `profile_screen.dart`, `analytics_report_screen.dart`).
- **Widget’lar (`lib/widgets`):** Yeniden kullanılabilir kartlar, bölümler ve başlık bileşenleri.
- **Modeller (`lib/models`):** `ChatMessage`, `Coach`, `AiModel` gibi veri yapıları.
- **Servisler (`lib/services`):** LangChain, OpenAI, Anthropic gibi sağlayıcıları soyutlayan servisler ve koç/sohbet yönetimi.
- **Belgeler:** `DATABASE_SCHEMA.md` (veritabanı şeması), `LANGCHAIN_INTEGRATION.md` (entegrasyon rehberi).

### Kurulum ve Çalıştırma
1. `flutter pub get` komutu ile bağımlılıkları yükleyin.
2. Gerekli platform konfigürasyonlarını (iOS/Android/Web) tamamlayın.
3. `flutter run` ile uygulamayı çalıştırın.

### Gelecek Adımlar (Öneri)
- Servisleri gerçek zamanlı API’lerle bağlayarak “Executive” kartlarına canlı veri aktarmak.
- Ajanda ve not detay ekranlarını kalıcı depolama veya sunucu verileriyle entegre etmek.
- LangChain tabanlı koç asistanı için ek senaryolar (ör. otomatik hatırlatmalar, görev oluşturma).

Bu dosya, projeyi hızlıca tanımak isteyen geliştiriciler için üst düzey bir referans niteliğindedir.

