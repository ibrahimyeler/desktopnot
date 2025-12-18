# Gofocus - AI Kişisel Gelişim Koçu Uygulaması

## 📋 İçindekiler

1. [Proje Genel Bakışı](#proje-genel-bakışı)
2. [Özellikler](#özellikler)
3. [Teknoloji Yığını](#teknoloji-yığını)
4. [Kurulum ve Yapılandırma](#kurulum-ve-yapılandırma)
5. [Proje Yapısı](#proje-yapısı)
6. [Mimari Tasarım](#mimari-tasarım)
7. [Ekranlar ve Navigasyon](#ekranlar-ve-navigasyon)
8. [Servisler ve İş Mantığı](#servisler-ve-iş-mantığı)
9. [Modeller ve Veri Yapıları](#modeller-ve-veri-yapıları)
10. [AI Entegrasyonu](#ai-entegrasyonu)
11. [Kimlik Doğrulama](#kimlik-doğrulama)
12. [Veritabanı Şeması](#veritabanı-şeması)
13. [LangChain Entegrasyonu](#langchain-entegrasyonu)
14. [Tema ve Tasarım Sistemi](#tema-ve-tasarım-sistemi)
15. [Geliştirme Rehberi](#geliştirme-rehberi)
16. [API Dokümantasyonu](#api-dokümantasyonu)
17. [Test Etme](#test-etme)
18. [Dağıtım](#dağıtım)
19. [Sorun Giderme](#sorun-giderme)
20. [Gelecek Planları](#gelecek-planları)
21. [Katkıda Bulunma](#katkıda-bulunma)
22. [Lisans](#lisans)

---

## 🎯 Proje Genel Bakışı

**Gofocus**, kullanıcıların kişisel gelişim hedeflerine ulaşmalarına yardımcı olan, yapay zeka destekli bir kişisel gelişim koçluk uygulamasıdır. Uygulama, CEO benzeri bir yönetim paneli sunarak kritik bilgileri özet halinde gösterir ve kullanıcıların odaklanma, planlama ve verimlilik hedeflerine ulaşmalarına yardımcı olur.

### Temel Amaç

- Kullanıcıların odaklanma ve planlama becerilerini geliştirmek
- Hedef belirleme ve takip süreçlerini kolaylaştırmak
- AI destekli kişiselleştirilmiş koçluk hizmeti sunmak
- Minimalist ve kullanıcı dostu bir arayüz sağlamak
- CEO benzeri bir dashboard ile özet bilgiler sunmak
- Çoklu AI sağlayıcı desteği ile esneklik sağlamak

### Proje Durumu

- ✅ **Versiyon**: 1.0.0+1
- ✅ **Durum**: Aktif Geliştirme
- ✅ **Platform Desteği**: iOS, Android, Web, macOS, Linux, Windows
- ⚠️ **Backend**: Mock data ile çalışıyor (gerçek API entegrasyonu bekleniyor)

---

## ✨ Özellikler

### 🎯 AI Koçlar

#### Odak ve Planlama Koçu (Lina)
- Odaklanma becerilerini geliştirme
- Hedef belirleme ve planlama
- Zaman yönetimi
- Verimlilik artırma
- Pomodoro tekniği, zaman bloklama önerileri

#### İngilizce Koçu
- İngilizce öğrenme ve geliştirme
- Kelime ezberleme stratejileri
- Gramer açıklamaları
- Konuşma pratiği
- Kişiselleştirilmiş öğrenme planları

#### Finans Koçu
- Bütçe yönetimi
- Tasarruf stratejileri
- Yatırım önerileri
- Borç yönetimi
- Emeklilik planlaması

#### Özel Koçlar
- Kullanıcıların kendi koçlarını oluşturması
- Marketplace'te koç satışı/kiralama
- Özelleştirilebilir sistem promptları
- Koç kategorileri (Üretkenlik, Finans, Dil, Sağlık, Spor, Kariyer)
- Fiyatlandırma sistemi (satın alma veya kiralama)

#### Legacy Koç Bileşenleri
- **Fitness Koçu**: Antrenman programları, ilerleme takibi, beslenme planları
- **Yazılım Koçu**: Proje yönetimi, teknoloji takibi, öğrenme kaynakları

### 📱 Ana Özellikler

#### CEO Dashboard (Ana Sayfa)
- **Home Header Section**: Hoş geldin mesajı, bildirim ikonu
- **Executive Overview Section**: Önemli metrikler (4 kart)
- **Executive Assistant Card**: AI asistan kontrol paneli
- **Executive Agenda Section**: Günlük ajanda özeti (detay sayfasına yönlendirme)
- **Quick Access Section**: Hızlı erişim butonları
- **Featured Coaches Section**: Öne çıkan koçlar
- **Recent Activity Section**: Son aktiviteler

#### Koç Yönetimi
- Koç listesi görüntüleme (kullanıcının sahip olduğu koçlar)
- Koç market (marketplace'te satışa sunulan koçlar)
- Koç detay sayfaları (Genel Bakış, Hedefler, Görevler, Notlar)
- AI sohbet arayüzü
- Markdown desteği
- Mesaj geçmişi
- Koç satın alma/kiralama sistemi
- Kategori bazlı filtreleme

#### Hedef Takibi
- Profil ekranından erişilebilir
- Animasyonlu progress bar'lar ve circular progress
- Kategori bazlı hedef organizasyonu (koç bazlı)
- Görsel ilerleme takibi
- Tamamlanan hedefler listesi
- Yeni hedef oluşturma dialog'u
- Toplam ilerleme özeti

#### Topluluk Özellikleri
- Kategori bazlı gönderiler (Finans, Sağlık, Spor, Kariyer)
- Öne çıkan gönderiler
- Beğeni ve yorum sistemi
- Yeni gönderi oluşturma

#### Profil ve Ayarlar
- Kullanıcı profili yönetimi
- İstatistikler ve analitik
- Tema ayarları (Light/Dark/System)
- Dil ayarları
- Bildirim yönetimi
- Analitik raporlar

#### Onboarding
- 8 adımlı interaktif onboarding akışı
- Kullanıcı tercihlerini toplama
- Kişiselleştirilmiş koç konfigürasyonu
- Animasyonlu geçişler

### 🔐 Kimlik Doğrulama

- Email/Şifre ile kayıt ve giriş
- Google Sign-In
- Apple Sign-In (iOS)
- Şifre sıfırlama
- Token yönetimi

### 🎨 UI/UX Özellikleri

- Dark theme odaklı tasarım
- Material Design 3
- Responsive layout
- Animasyonlu geçişler
- Gradient arka planlar
- Özelleştirilebilir tema

---

## 🛠 Teknoloji Yığını

### Framework ve Dil

- **Flutter**: 3.9.2+
- **Dart**: 3.9.2+

### Bağımlılıklar

#### State Management
```yaml
provider: ^6.1.1
```

#### Veri Yönetimi
```yaml
shared_preferences: ^2.2.2  # Yerel veri saklama
http: ^1.2.0                # HTTP istekleri
```

#### UI ve İçerik
```yaml
flutter_markdown: ^0.6.18   # Markdown desteği
cupertino_icons: ^1.0.8     # iOS stili ikonlar
```

#### Kimlik Doğrulama
```yaml
google_sign_in: ^6.2.1           # Google Sign-In
sign_in_with_apple: ^6.1.3       # Apple Sign-In
```

#### Geliştirme Araçları
```yaml
flutter_lints: ^5.0.0       # Linting kuralları
flutter_test                # Test framework
```

### Platform Desteği

- ✅ iOS (iPhone, iPad)
- ✅ Android (Phone, Tablet)
- ✅ Web (Chrome, Safari, Firefox)
- ✅ macOS
- ✅ Linux
- ✅ Windows

---

## 🚀 Kurulum ve Yapılandırma

### Gereksinimler

1. **Flutter SDK** (3.9.2 veya üzeri)
   ```bash
   flutter --version
   ```

2. **Dart SDK** (3.9.2 veya üzeri)

3. **Platform SDK'ları**
   - iOS: Xcode 14+
   - Android: Android Studio, Android SDK
   - Web: Chrome veya diğer modern tarayıcılar

### Kurulum Adımları

1. **Repository'yi klonlayın**
   ```bash
   git clone <repository-url>
   cd aicoach_app
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   flutter pub get
   ```

3. **Platform bağımlılıklarını yükleyin**

   **iOS:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

   **Android:**
   - Android Studio'da projeyi açın
   - Gradle sync yapın

4. **Uygulamayı çalıştırın**
   ```bash
   # iOS Simulator
   flutter run -d ios
   
   # Android Emulator
   flutter run -d android
   
   # Web
   flutter run -d chrome
   ```

### Yapılandırma

#### AI API Key'leri

Uygulamayı kullanmak için AI sağlayıcı API key'lerine ihtiyacınız var:

1. **OpenAI API Key**
   - https://platform.openai.com/api-keys adresinden alın
   - Koç ayarlarından ekleyin

2. **Anthropic API Key** (Opsiyonel)
   - https://console.anthropic.com/ adresinden alın

3. **Google AI API Key** (Opsiyonel)
   - https://makersuite.google.com/app/apikey adresinden alın

#### Backend Yapılandırması

Şu anda uygulama mock data ile çalışıyor. Gerçek backend entegrasyonu için:

1. Backend API URL'ini yapılandırın:
   ```dart
   // lib/services/auth_service.dart
   static const String _baseUrl = 'http://your-backend-url:8001';
   ```

2. Backend API endpoint'lerini hazırlayın (bkz. [API Dokümantasyonu](#api-dokümantasyonu))

#### Google Sign-In Yapılandırması

1. **Android:**
   - Google Cloud Console'da OAuth 2.0 Client ID oluşturun
   - `android/app/google-services.json` dosyasını ekleyin

2. **iOS:**
   - Google Cloud Console'da iOS Client ID oluşturun
   - `ios/Runner/Info.plist` dosyasına URL scheme ekleyin

#### Apple Sign-In Yapılandırması

1. Apple Developer Console'da App ID'yi yapılandırın
2. Sign in with Apple capability'yi ekleyin
3. `ios/Runner/Info.plist` dosyasını güncelleyin

---

## 📁 Proje Yapısı

```
aicoach_app/
├── lib/
│   ├── main.dart                    # Uygulama giriş noktası
│   ├── models/                      # Veri modelleri
│   │   ├── coach.dart              # AI koç modeli
│   │   ├── chat_message.dart       # Sohbet mesajı modeli
│   │   └── ai_model.dart           # AI model konfigürasyonu (legacy)
│   ├── services/                    # İş mantığı servisleri
│   │   ├── coach_service.dart      # Koç yönetimi
│   │   ├── chat_service.dart       # Sohbet yönetimi
│   │   ├── auth_service.dart       # Kimlik doğrulama
│   │   ├── ai_provider.dart        # AI sağlayıcı arayüzü
│   │   ├── openai_provider.dart    # OpenAI implementasyonu
│   │   ├── anthropic_provider.dart # Anthropic implementasyonu
│   │   ├── google_provider.dart    # Google AI implementasyonu
│   │   ├── langchain_provider.dart # LangChain implementasyonu
│   │   └── ai_model_service.dart   # AI model yönetimi
│   ├── screens/                     # Ekranlar
│   │   ├── splash_screen.dart      # Splash ekranı
│   │   ├── login_screen.dart       # Giriş ekranı
│   │   ├── register_screen.dart    # Kayıt ekranı
│   │   ├── forgot_password_screen.dart # Şifre sıfırlama
│   │   ├── main_screen.dart        # Ana navigasyon ekranı
│   │   ├── home_screen.dart        # Ana sayfa (CEO Dashboard)
│   │   ├── coach_list_screen.dart  # Koç listesi
│   │   ├── coach_chat_screen.dart  # Sohbet ekranı
│   │   ├── focus_planning_detail_screen.dart # Koç detay sayfası
│   │   ├── lina_onboarding_screen.dart # Onboarding akışı
│   │   ├── goals_screen.dart       # Hedefler ekranı
│   │   ├── community_screen.dart   # Topluluk ekranı
│   │   ├── profile_screen.dart     # Profil ekranı
│   │   ├── edit_profile_screen.dart # Profil düzenleme
│   │   ├── analytics_report_screen.dart # Analitik raporlar
│   │   ├── notifications_screen.dart # Bildirimler
│   │   ├── theme_screen.dart       # Tema ayarları
│   │   ├── language_screen.dart    # Dil ayarları
│   │   ├── executive_agenda_detail_screen.dart # Ajanda detay
│   │   ├── executive_notes_detail_screen.dart # Notlar detay
│   │   ├── finance_detail_screen.dart # Finans detay
│   │   ├── coach_market_screen.dart # Koç market ekranı
│   │   └── create_coach_onboarding_screen.dart # Koç oluşturma (legacy)
│   ├── widgets/                     # Yeniden kullanılabilir widget'lar
│   │   ├── home_header_section.dart
│   │   ├── executive_overview_section.dart
│   │   ├── executive_pages_section.dart
│   │   ├── executive_assistant_card.dart
│   │   ├── executive_agenda_section.dart
│   │   ├── executive_notes_section.dart
│   │   ├── quick_access_section.dart
│   │   ├── featured_coaches_section.dart
│   │   ├── recent_activity_section.dart
│   │   ├── coach_card.dart
│   │   ├── coach_card_horizontal.dart
│   │   ├── coaches_header_section.dart
│   │   ├── community_header_section.dart
│   │   ├── community_categories_section.dart
│   │   ├── community_featured_posts_section.dart
│   │   ├── profile_header_section.dart
│   │   ├── profile_stats_section.dart
│   │   ├── profile_analytics_card.dart
│   │   ├── profile_settings_section.dart
│   │   ├── custom_button.dart
│   │   ├── custom_text_field.dart
│   │   ├── login_header.dart
│   │   ├── login_footer.dart
│   │   ├── gofocus_pro_card.dart
│   │   ├── assistant_section.dart
│   │   ├── stats_overview_section.dart
│   │   ├── quick_actions_section.dart
│   │   └── recent_chats_section.dart
│   └── components/                  # Özel bileşenler (legacy)
│       ├── fitness/                  # Fitness koçu bileşenleri
│       │   ├── fitness_detail_screen.dart
│       │   ├── fitness_workouts_tab.dart
│       │   ├── fitness_progress_tab.dart
│       │   └── fitness_nutrition_tab.dart
│       └── software/                 # Yazılım koçu bileşenleri
│           ├── software_detail_screen.dart
│           ├── software_projects_tab.dart
│           ├── software_technologies_tab.dart
│           └── software_learning_tab.dart
├── assets/                           # Asset dosyaları
│   ├── google.png
│   └── apple.png
├── test/                             # Test dosyaları
│   └── widget_test.dart
├── android/                          # Android platform dosyaları
├── ios/                              # iOS platform dosyaları
├── web/                              # Web platform dosyaları
├── macos/                            # macOS platform dosyaları
├── linux/                            # Linux platform dosyaları
├── windows/                          # Windows platform dosyaları
├── pubspec.yaml                      # Proje bağımlılıkları
├── pubspec.lock                      # Kilitli bağımlılık versiyonları
├── analysis_options.yaml             # Linting kuralları
├── README.md                         # Bu dosya (detaylı dokümantasyon)
├── DATABASE_SCHEMA.md                # Veritabanı şeması
├── LANGCHAIN_INTEGRATION.md          # LangChain entegrasyon rehberi
├── PROJECT_DOCUMENTATION.md         # Proje dokümantasyonu
└── overview.md                       # Genel bakış
```

---

## 🏗 Mimari Tasarım

### Genel Mimari

Uygulama **component-based** ve **service-oriented** bir mimari kullanır:

```
┌─────────────────────────────────────┐
│         UI Layer (Screens)          │
│  (Widgets, Components, Screens)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      State Management (Provider)    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│  (Coach, Chat, Auth, AI Providers)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Data Layer                     │
│  (SharedPreferences, HTTP, Models)  │
└─────────────────────────────────────┘
```

### Mimari Prensipler

1. **Separation of Concerns**: Her katman kendi sorumluluğuna odaklanır
2. **Single Responsibility**: Her widget/servis tek bir işi yapar
3. **Reusability**: Widget'lar yeniden kullanılabilir şekilde tasarlanmıştır
4. **Dependency Injection**: Servisler bağımlılık enjeksiyonu ile yönetilir
5. **State Management**: Provider pattern kullanılır

### Design Patterns

- **Provider Pattern**: State management için
- **Repository Pattern**: Veri erişimi için (gelecek)
- **Factory Pattern**: AI provider oluşturma için
- **Strategy Pattern**: Farklı AI sağlayıcıları için

---

## 📱 Ekranlar ve Navigasyon

### Navigasyon Yapısı

```
SplashScreen
├── LoginScreen (if not authenticated)
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   └── MainScreen (after login)
└── MainScreen (if authenticated)
    ├── HomeScreen (CEO Dashboard)
    │   ├── ExecutiveAgendaDetailScreen
    │   ├── ExecutiveNotesDetailScreen
    │   └── FinanceDetailScreen
    ├── CoachListScreen
    │   ├── LinaOnboardingScreen (if onboarding not completed)
    │   └── FocusPlanningDetailScreen
    │       └── CoachChatScreen
    ├── CoachMarketScreen
    │   ├── LinaOnboardingScreen (if onboarding not completed)
    │   └── FocusPlanningDetailScreen
    │       └── CoachChatScreen
    ├── CommunityScreen
    └── ProfileScreen
        ├── EditProfileScreen
        ├── AnalyticsReportScreen
        ├── NotificationsScreen
        ├── ThemeScreen
        ├── LanguageScreen
        └── GoalsScreen
```

### Ana Ekranlar

#### 1. Splash Screen
- Uygulama başlangıcında gösterilir
- Kullanıcı oturum durumunu kontrol eder
- Oturum açık ise `MainScreen`, değilse `LoginScreen`'e yönlendirir

#### 2. Authentication Screens

**Login Screen:**
- Email/şifre ile giriş
- Google Sign-In butonu
- Apple Sign-In butonu (iOS)
- "Şifremi Unuttum" linki
- "Hesap Oluştur" yönlendirmesi

**Register Screen:**
- Email, şifre ve kullanıcı adı ile kayıt
- Şifre doğrulama
- Google/Apple Sign-In seçenekleri
- Form validasyonu

**Forgot Password Screen:**
- Email ile şifre sıfırlama kodu gönderme
- Kod doğrulama
- Yeni şifre belirleme

#### 3. Main Screen
Ana navigasyon ekranı. Alt navigasyon bar ile 5 ana bölüm:
- **Ana Sayfa** (Home)
- **Koçlarım** (My Coaches)
- **Koç Market** (Coach Market)
- **Topluluk** (Community)
- **Profil** (Profile)

#### 4. Home Screen (CEO Dashboard)
Ana sayfa, CEO benzeri bir yönetim paneli:

**Bileşenler:**
1. **Home Header Section**: Hoş geldin mesajı, bildirim ikonu
2. **Executive Overview Section**: Önemli metrikler (4 kart)
3. **Executive Assistant Card**: AI asistan kontrol paneli
4. **Executive Agenda Section**: Günlük ajanda özeti (ExecutiveAgendaDetailScreen'e yönlendirme)
5. **Quick Access Section**: Hızlı erişim butonları
6. **Featured Coaches Section**: Öne çıkan koçlar
7. **Recent Activity Section**: Son aktiviteler

**Detay Sayfaları:**
- **Executive Agenda Detail Screen**: Günlük ajanda detayları
- **Executive Notes Detail Screen**: Öncelikli notlar detayları
- **Finance Detail Screen**: Finans detayları

#### 5. Coach List Screen
- Kullanıcının sahip olduğu koçları listeler
- "Odak ve Planlama Koçu" varsayılan olarak gösterilir
- Onboarding kontrolü yapar
- Koç kartına tıklayınca detay sayfasına yönlendirme
- Yeni koç ekleme seçeneği

#### 6. Coach Market Screen
- Marketplace'te satışa sunulan koçları gösterir
- Kategori filtreleme (Tümü, Üretkenlik, Finans, Dil, Sağlık, Spor, Kariyer)
- Koç satın alma/kiralama özellikleri
- Arama fonksiyonu (TODO)
- Kullanıcının sahip olduğu koçları filtreler

#### 7. Lina Onboarding Screen
8 adımlı interaktif onboarding:
1. Hoş Geldin
2. İsim Belirleme
3. Odak Alanları (Çoklu seçim)
4. Günlük Ritim (Tek seçim)
5. Planlama Tarzı (Tek seçim)
6. Dikkat Dağıtıcılar (Çoklu seçim)
7. Koç Tarzı (Tek seçim)
8. Özet

#### 8. Focus Planning Detail Screen
Koç detay sayfası, 4 sekme:
- **Genel Bakış**: İstatistikler, hızlı aksiyonlar
- **Hedefler**: Hedef listesi
- **Görevler**: Görev listesi
- **Notlar**: Not listesi

#### 9. Coach Chat Screen
AI koç ile sohbet ekranı:
- Markdown desteği
- Mesaj geçmişi
- Loading state
- Hata yönetimi
- Scroll to bottom

#### 10. Goals Screen
Hedef yönetimi (Profil ekranından erişilir):
- Progress Overview Card (animasyonlu)
- Aktif hedefler listesi
- Tamamlanan hedefler listesi
- Yeni hedef oluşturma dialog'u
- Animasyonlu progress bar'lar
- Koç bazlı hedef kategorileri

#### 11. Community Screen
Topluluk ekranı:
- Tab bar (Tümü, Finans, Sağlık, Spor, Kariyer)
- Öne çıkan gönderiler
- Yeni gönderi oluşturma
- Beğeni ve yorum sayıları

#### 12. Profile Screen
Kullanıcı profil ekranı:
- Profile Header Section
- Profile Stats Section
- Profile Settings Section
- Navigasyon butonları

---

## 🔧 Servisler ve İş Mantığı

### Coach Service

**Dosya:** `lib/services/coach_service.dart`

**Sorumluluklar:**
- Koç listesini yönetme
- Koç verilerini `SharedPreferences`'e kaydetme/yükleme
- AI provider'ı koç için yapılandırma
- Marketplace koçlarını yönetme
- Varsayılan ve özel koçları sağlama

**Metodlar:**
```dart
Future<List<Coach>> getCoaches()
Future<void> saveCoaches(List<Coach> coaches)
AIProvider? getProviderForCoach(Coach coach)
List<Coach> _getDefaultCoaches()  // Odak, İngilizce, Finans koçları
List<Coach> _getCustomCoaches()   // Kullanıcı oluşturduğu koçlar
Future<List<Coach>> getMarketplaceCoaches()  // Marketplace'teki koçlar
```

**Kullanım:**
```dart
final coachService = CoachService();
final coaches = await coachService.getCoaches();
final provider = coachService.getProviderForCoach(coaches[0]);
```

### Chat Service

**Dosya:** `lib/services/chat_service.dart`

**Sorumluluklar:**
- Sohbet mesajlarını yönetme
- AI provider ile iletişim
- Mesaj geçmişini saklama

**Metodlar:**
```dart
Future<String> sendMessage({
  required String message,
  required Coach coach,
  required AIProvider provider,
})
void clearMessages()
List<ChatMessage> get messages
```

**Kullanım:**
```dart
final chatService = ChatService();
final response = await chatService.sendMessage(
  message: 'Merhaba',
  coach: coach,
  provider: provider,
);
```

### Auth Service

**Dosya:** `lib/services/auth_service.dart`

**Sorumluluklar:**
- Email/şifre ile kimlik doğrulama
- Google Sign-In
- Apple Sign-In
- Token yönetimi

**Metodlar:**
```dart
Future<Map<String, dynamic>> register(String email, String password, String username)
Future<Map<String, dynamic>> login(String email, String password)
Future<void> forgotPassword(String email)
Future<bool> verifyCode(String email, String code)
Future<void> resetPassword(String email, String code, String newPassword)
Future<String> refreshToken(String refreshToken)
Future<bool> validateToken(String token)
Future<Map<String, dynamic>?> signInWithGoogle()
Future<Map<String, dynamic>?> signInWithApple()
```

**Backend Endpoints:**
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/verify-code`
- `POST /auth/reset-password`
- `POST /auth/refresh`
- `GET /auth/validate`
- `POST /auth/google`
- `POST /auth/apple`

### AI Provider Interface

**Dosya:** `lib/services/ai_provider.dart`

**Soyut Sınıf:**
```dart
abstract class AIProvider {
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  });
  
  Future<List<String>> getAvailableModels();
  Future<bool> validateApiKey();
}
```

**Implementasyonlar:**
- `OpenAIProvider`: OpenAI API entegrasyonu
- `AnthropicProvider`: Anthropic Claude API entegrasyonu
- `GoogleProvider`: Google AI API entegrasyonu
- `LangChainProvider`: LangChain backend entegrasyonu

---

## 📊 Modeller ve Veri Yapıları

### Coach Model

**Dosya:** `lib/models/coach.dart`

```dart
class Coach {
  final String id;
  final String name;
  final String category;
  final String description;
  final String icon;
  final Map<String, dynamic> config;
  final bool isActive;
  final double? price;
  final String? priceType;
  final bool isMarketplace;
  
  // JSON serialization
  factory Coach.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
  
  // Copy with
  Coach copyWith({...});
}
```

**Kullanım:**
```dart
final coach = Coach(
  id: 'focus-planning-coach',
  name: 'Odak ve Planlama Koçu',
  category: 'productivity',
  description: '...',
  icon: '🎯',
  config: {
    'apiKey': '',
    'systemPrompt': '...',
    'model': 'gpt-4',
  },
);
```

### Chat Message Model

**Dosya:** `lib/models/chat_message.dart`

```dart
class ChatMessage {
  final String id;
  final String content;
  final bool isUser;
  final DateTime timestamp;
  final String? modelId;
  
  // JSON serialization
  factory ChatMessage.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
}
```

**Kullanım:**
```dart
final message = ChatMessage(
  id: DateTime.now().millisecondsSinceEpoch.toString(),
  content: 'Merhaba',
  isUser: true,
  timestamp: DateTime.now(),
  modelId: 'gpt-4',
);
```

### AI Model (Legacy)

**Dosya:** `lib/models/ai_model.dart`

```dart
class AIModel {
  final String id;
  final String name;
  final String description;
  final String provider; // 'openai', 'anthropic', 'google', etc.
  final bool isActive;
  final Map<String, dynamic> config;
  
  // JSON serialization
  factory AIModel.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
  AIModel copyWith({...});
}
```

**Not:** Bu model legacy olarak kullanılıyor. Yeni geliştirmeler için `Coach` modeli kullanılmalıdır.

---

## 🤖 AI Entegrasyonu

### Desteklenen Sağlayıcılar

#### 1. OpenAI
- **Modeller**: GPT-4, GPT-4-turbo, GPT-3.5-turbo, GPT-3.5-turbo-16k
- **API**: https://api.openai.com/v1/chat/completions
- **Provider**: `OpenAIProvider`
- **API Key**: https://platform.openai.com/api-keys
- **Özellikler**: System prompt desteği, conversation history, temperature kontrolü

#### 2. Anthropic
- **Modeller**: Claude 3 Opus (claude-3-opus-20240229), Claude 3 Sonnet (claude-3-sonnet-20240229), Claude 3 Haiku (claude-3-haiku-20240307)
- **API**: https://api.anthropic.com/v1/messages
- **Provider**: `AnthropicProvider`
- **API Key**: https://console.anthropic.com/
- **Özellikler**: Anthropic API version 2023-06-01, message format desteği

#### 3. Google AI
- **Modeller**: Gemini Pro (gemini-pro), Gemini Pro Vision (gemini-pro-vision)
- **API**: https://generativelanguage.googleapis.com/v1beta
- **Provider**: `GoogleProvider`
- **API Key**: https://makersuite.google.com/app/apikey
- **Özellikler**: Content generation config, temperature ve max tokens kontrolü

#### 4. LangChain
- **Backend**: Python/Node.js backend gerekli
- **Provider**: `LangChainProvider`
- **Base URL**: `http://localhost:8000/api/langchain` (yapılandırılabilir)
- **Dokümantasyon**: `LANGCHAIN_INTEGRATION.md`
- **Özellikler**: 
  - Chat endpoint
  - Chain execution
  - Agent run
  - Vector store search
  - Health check
  - Available models endpoint

### Konfigürasyon

Her koç için AI konfigürasyonu:

```dart
config: {
  'apiKey': 'user_provided_api_key',
  'systemPrompt': 'Koç için sistem promptu',
  'model': 'gpt-4',
}
```

### System Prompts

**Odak ve Planlama Koçu (focus-planning-coach):**
```
Sen bir odak ve planlama koçusun. Kullanıcıların odaklanma becerilerini geliştirmesine, hedeflerini belirlemesine ve planlamasına, zaman yönetimini iyileştirmesine, verimliliğini artırmasına ve günlük rutinlerini optimize etmesine yardımcı ol. Pomodoro tekniği, zaman bloklama, görev önceliklendirme gibi teknikler öner.
```

**İngilizce Koçu (english-coach):**
```
Sen bir İngilizce öğrenme koçusun. Kullanıcıların İngilizce öğrenme hedeflerine ulaşmasına yardımcı ol. İngilizce dil öğrenme teknikleri, kelime ezberleme stratejileri, gramer açıklamaları, konuşma pratiği, okuma ve dinleme alıştırmaları, yazma becerileri, motivasyon desteği ve kişiselleştirilmiş öğrenme planları sun. Kullanıcının seviyesine göre (başlangıç, orta, ileri) uygun içerik ve alıştırmalar öner. İngilizce öğrenmeyi eğlenceli ve etkili hale getir. Kullanıcıyla İngilizce konuşarak pratik yapmasına yardımcı ol.
```

**Finans Koçu (finance-coach):**
```
Sen bir finans koçusun. Kullanıcıların finansal hedeflerine ulaşmasına yardımcı ol. Bütçe yönetimi, tasarruf stratejileri, yatırım önerileri, borç yönetimi, emeklilik planlaması, finansal okuryazarlık, gelir artırma yöntemleri ve kişiselleştirilmiş finansal planlar sun. Kullanıcının finansal durumuna göre uygun önerilerde bulun. Finansal kararlarını daha bilinçli almasına yardımcı ol. Finansal güvenlik ve bağımsızlık hedeflerine ulaşması için rehberlik et.
```

**Özel Fitness Koçu (custom-fitness-coach-001):**
```
Sen kullanıcının kişisel fitness koçusun. Antrenman programları, beslenme önerileri ve motivasyon desteği sun.
```

### Conversation History

AI provider'a gönderilirken, önceki mesajlar conversation history olarak eklenir:

```dart
await provider.sendMessage(
  message: currentMessage,
  conversationHistory: previousMessages,
  modelId: 'gpt-4',
  additionalParams: {
    'system': systemPrompt,
  },
);
```

---

## 🔐 Kimlik Doğrulama

### Desteklenen Yöntemler

#### 1. Email/Şifre
- **Kayıt**: Email, şifre, kullanıcı adı
- **Giriş**: Email, şifre
- **Şifre Sıfırlama**: Email ile kod gönderme

#### 2. Google Sign-In
- **OAuth 2.0**: Google OAuth kullanır
- **Scopes**: email, profile
- **Platform**: iOS, Android, Web
- **Backend Entegrasyonu**: Token backend'e gönderilir

#### 3. Apple Sign-In
- **OAuth 2.0**: Apple OAuth kullanır
- **Scopes**: email, fullName
- **Platform**: iOS only
- **Backend Entegrasyonu**: Token backend'e gönderilir

### Token Yönetimi

- **Access Token**: API istekleri için
- **Refresh Token**: Token yenileme için
- **Token Validation**: Token geçerliliğini kontrol etme
- **Token Storage**: `SharedPreferences`'te saklanır (güvenlik için şifreleme önerilir)

### Backend Entegrasyonu

Tüm kimlik doğrulama işlemleri backend API'ye yönlendirilir:
- **Base URL**: `http://localhost:8001` (yapılandırılabilir)
- **Endpoints**: `/auth/*`

**Hata Yönetimi:**
- Kullanıcı dostu Türkçe hata mesajları
- Network, timeout, HTTP hata kodları için özel mesajlar
- MongoDB bağlantı hataları için özel mesajlar
- Backend bağlantı hatası durumunda local fallback (Google/Apple Sign-In için)

**Not:** Şu anda mock data kullanılıyor, backend hazır olduğunda aktif edilecek. Backend bağlantı hatalarında kullanıcı dostu mesajlar gösterilir.

---

## 💾 Veritabanı Şeması

Detaylı veritabanı şeması için `DATABASE_SCHEMA.md` dosyasına bakın.

### Ana Tablolar

1. **users**: Kullanıcı bilgileri
2. **coaches**: AI koçlar
3. **conversations**: Konuşmalar
4. **messages**: Mesajlar
5. **goals**: Hedefler
6. **notes**: Notlar
7. **todos**: Yapılacaklar
8. **fitness_workouts**: Fitness antrenmanlar
9. **fitness_progress**: Fitness ilerleme
10. **fitness_nutrition**: Fitness beslenme
11. **software_projects**: Yazılım projeleri
12. **software_skills**: Yazılım becerileri
13. **learning_resources**: Öğrenme kaynakları
14. **finance_transactions**: Finans işlemleri
15. **finance_portfolio**: Finans portföy
16. **analytics**: Analitik veriler
17. **user_settings**: Kullanıcı ayarları
18. **langchain_chains**: LangChain zincirleri
19. **langchain_tools**: LangChain araçları
20. **langchain_memory**: LangChain bellek
21. **langchain_agents**: LangChain ajanları
22. **langchain_vector_stores**: LangChain vektör depoları
23. **langchain_documents**: LangChain belgeleri
24. **langchain_executions**: LangChain çalıştırmaları
25. **langchain_retrievers**: LangChain retrievers

### Veri Yönetimi

**Şu anda:**
- `SharedPreferences` ile yerel veri saklama
- JSON formatında veri serialization

**Gelecek:**
- Backend API ile senkronizasyon
- Cloud backup
- Çoklu cihaz desteği

---

## 🔗 LangChain Entegrasyonu

Detaylı LangChain entegrasyon rehberi için `LANGCHAIN_INTEGRATION.md` dosyasına bakın.

### Genel Bakış

LangChain, Flutter uygulamasında doğrudan çalışmaz. LangChain Python veya JavaScript backend'de çalışmalı ve Flutter uygulaması HTTP API üzerinden iletişim kurmalıdır.

### Mimari

```
Flutter App → HTTP API → LangChain Backend (Python/Node.js)
```

### Backend API Endpoint'leri

1. **Chat Endpoint**: `POST /api/langchain/chat`
2. **Chain Execution**: `POST /api/langchain/chains/{chain_id}/run`
3. **Agent Run**: `POST /api/langchain/agents/{agent_id}/run`
4. **Vector Store Search**: `GET /api/langchain/vector-stores/{store_id}/search`
5. **Health Check**: `GET /api/langchain/health`
6. **Available Models**: `GET /api/langchain/models`

### Flutter Entegrasyonu

```dart
final langchainProvider = LangChainProvider(
  apiKey: 'your-api-key',
  baseUrl: 'https://your-backend.com/api/langchain',
);

final response = await langchainProvider.sendMessage(
  message: 'What is React?',
  conversationHistory: messages,
  modelId: 'gpt-4',
);
```

---

## 🎨 Tema ve Tasarım Sistemi

### Renk Paleti

#### Dark Theme (Ana Tema)

**Arka Plan Renkleri:**
- Primary Background: `#111827` (Çok koyu gri)
- Secondary Background: `#1F2937` (Koyu gri)
- Border Color: `#374151` (Orta gri)
- Text Primary: `#FFFFFF` (Beyaz)
- Text Secondary: `#9CA3AF` (Açık gri)

**Vurgu Renkleri:**
- Primary Accent: `#FFB800` (Sarı-turuncu)
- Success: `#10B981` (Yeşil)
- Error: `#EF4444` (Kırmızı)
- Warning: `#F59E0B` (Turuncu)

**Gradient Renkleri:**
- Primary Gradient: `#FFB800` → `#FF8C00`
- Background Gradient: `#111827` → `#1F2937`

#### Light Theme

**Material 3 Color Scheme:**
- Seed Color: `#6366F1` (Indigo)
- Adaptive theming ile otomatik renk üretimi

#### Dark Theme (Material 3)

**Material 3 Color Scheme:**
- Seed Color: `#818CF8` (Açık Indigo)
- Adaptive theming ile otomatik renk üretimi

### Typography

**Font Boyutları:**
- H1: 32px (Bold)
- H2: 24px (Bold)
- H3: 20px (SemiBold)
- Body: 16px (Regular)
- Caption: 12px (Regular)

**Font Ağırlıkları:**
- Bold: 700
- SemiBold: 600
- Medium: 500
- Regular: 400

### Spacing

- XS: 4px
- S: 8px
- M: 16px
- L: 24px
- XL: 32px
- XXL: 48px

### Border Radius

- Small: 8px
- Medium: 12px
- Large: 16px
- XLarge: 20px
- Circle: 50%

### Material Design 3

- Material 3 kullanılır (`useMaterial3: true`)
- Custom color scheme (seed color based)
- Adaptive theming (Light/Dark/System)
- Theme mode: System (otomatik light/dark algılama)
- AppBar: Center title, elevation 0

---

## 📖 Geliştirme Rehberi

### Kod Standartları

- **Dart Style Guide**: Official Dart style guide'ı takip et
- **Linting**: `flutter_lints` kurallarına uy
- **Naming**: camelCase (değişkenler), PascalCase (sınıflar)
- **Comments**: Önemli fonksiyonlar için dokümantasyon yorumları

### Yeni Özellik Ekleme

#### 1. Yeni Ekran Ekleme

1. `lib/screens/` altına ekle
2. `main_screen.dart`'a route ekle (gerekirse)
3. Navigasyon yapısını güncelle

#### 2. Yeni Widget Ekleme

1. `lib/widgets/` altına ekle
2. Reusable olarak tasarla
3. Parametreleri document et

#### 3. Yeni Servis Ekleme

1. `lib/services/` altına ekle
2. Dependency injection kullan
3. Error handling ekle

#### 4. Yeni Model Ekleme

1. `lib/models/` altına ekle
2. JSON serialization ekle
3. `fromJson` ve `toJson` metodlarını implement et

### Git Workflow

1. Feature branch oluştur: `git checkout -b feature/amazing-feature`
2. Değişiklikleri commit et: `git commit -m 'Add amazing feature'`
3. Branch'i push et: `git push origin feature/amazing-feature`
4. Pull Request aç

---

## 📡 API Dokümantasyonu

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "username": "username"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "token": "access_token",
  "refresh_token": "refresh_token"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "username": "username",
  "token": "access_token",
  "refresh_token": "refresh_token"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "message": "Password reset code sent to email"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456",
  "new_password": "newpassword123"
}

Response:
{
  "message": "Password reset successfully"
}
```

#### Google Sign-In
```http
POST /auth/google
Content-Type: application/json

{
  "id_token": "google_id_token",
  "access_token": "google_access_token"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "token": "access_token",
  "refresh_token": "refresh_token"
}
```

#### Apple Sign-In
```http
POST /auth/apple
Content-Type: application/json

{
  "id_token": "apple_id_token",
  "authorization_code": "authorization_code",
  "email": "user@example.com",
  "full_name": "John Doe"
}

Response:
{
  "id": "user_id",
  "email": "user@example.com",
  "token": "access_token",
  "refresh_token": "refresh_token"
}
```

### LangChain Endpoints

Detaylı LangChain API dokümantasyonu için `LANGCHAIN_INTEGRATION.md` dosyasına bakın.

---

## 🧪 Test Etme

### Unit Tests

```bash
flutter test
```

### Widget Tests

```bash
flutter test test/widget_test.dart
```

### Integration Tests

```bash
flutter test integration_test/
```

### Test Coverage

```bash
flutter test --coverage
genhtml coverage/lcov.info -o coverage/html
```

---

## 🚀 Dağıtım

### iOS

1. **Xcode'da aç:**
   ```bash
   open ios/Runner.xcworkspace
   ```

2. **Signing & Capabilities ayarla**

3. **Archive oluştur:**
   - Product → Archive

4. **App Store'a yükle:**
   - Organizer → Distribute App

### Android

1. **APK oluştur:**
   ```bash
   flutter build apk --release
   ```

2. **App Bundle oluştur:**
   ```bash
   flutter build appbundle --release
   ```

3. **Google Play Console'a yükle**

### Web

1. **Build:**
   ```bash
   flutter build web --release
   ```

2. **Deploy:**
   - `build/web` klasörünü web sunucusuna yükle

---

## 🔧 Sorun Giderme

### Yaygın Sorunlar

#### 1. Bağımlılık Hataları
```bash
flutter clean
flutter pub get
```

#### 2. iOS Pod Hataları
```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### 3. Android Build Hataları
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
```

#### 4. API Key Hataları
- API key'lerin doğru yapılandırıldığından emin olun
- API key'lerin geçerli olduğunu kontrol edin
- Rate limit'leri kontrol edin

#### 5. Backend Bağlantı Hataları
- Backend'in çalıştığından emin olun
- URL'lerin doğru olduğunu kontrol edin
- CORS ayarlarını kontrol edin (web için)

### Debug Modu

```bash
flutter run --debug
```

### Release Modu

```bash
flutter run --release
```

---

## 🔮 Gelecek Planları

### Kısa Vadeli (1-2 Ay)

1. **Backend Entegrasyonu**
   - API entegrasyonu
   - Gerçek zamanlı veri
   - Cloud sync

2. **Gamification**
   - XP sistemi
   - Seviyeler
   - Rozetler
   - Görevler
   - Liderlik tablosu

3. **Gelişmiş Özellikler**
   - Push notifications
   - Offline mode
   - Veri export/import
   - Çoklu dil desteği

### Orta Vadeli (3-6 Ay)

1. **AI Geliştirmeleri**
   - Daha fazla AI model desteği
   - Özel model fine-tuning
   - Voice input/output
   - Görsel analiz

2. **Topluluk Özellikleri**
   - Gerçek zamanlı sohbet
   - Grup koçlukları
   - İçerik moderasyonu
   - Kullanıcı profilleri

3. **Analitik ve Raporlama**
   - Detaylı analitik dashboard
   - PDF rapor export
   - Trend analizi
   - Kişiselleştirilmiş öneriler

### Uzun Vadeli (6+ Ay)

1. **Platform Genişletme**
   - Web app (tam özellikli)
   - Desktop app (Windows, macOS, Linux)
   - Browser extension

2. **Enterprise Özellikleri**
   - Takım koçluğu
   - Kurumsal dashboard
   - API access
   - White-label çözümler

3. **AI Gelişmeleri**
   - Özel AI model eğitimi
   - Çoklu modal AI (text, voice, image)
   - Predictive analytics
   - Otomatik hedef önerileri

---

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request aç

### Katkı Kuralları

- Kod standartlarına uyun
- Test yazın
- Dokümantasyonu güncelleyin
- Açıklayıcı commit mesajları yazın

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

## 📞 İletişim ve Destek

- **Repository**: [GitHub URL]
- **Issues**: [GitHub Issues URL]
- **Documentation**: Bu dosya ve diğer `.md` dosyaları

---

## 📚 Ek Kaynaklar

- [Flutter Dokümantasyonu](https://flutter.dev/docs)
- [Dart Dokümantasyonu](https://dart.dev/guides)
- [OpenAI API Dokümantasyonu](https://platform.openai.com/docs)
- [Anthropic API Dokümantasyonu](https://docs.anthropic.com)
- [Google AI Dokümantasyonu](https://ai.google.dev/docs)
- [LangChain Dokümantasyonu](https://python.langchain.com)

---

**Son Güncelleme:** 2024  
**Versiyon:** 1.0.0+1  
**Durum:** Aktif Geliştirme  
**Proje Adı:** aicoach_app  
**Uygulama Adı:** Gofocus

---

## 📝 Değişiklik Geçmişi

### v1.0.0 (2024)
- İlk sürüm
- Temel AI koç özellikleri (Odak, İngilizce, Finans)
- CEO dashboard (Executive Overview, Agenda, Notes)
- Onboarding akışı (8 adımlı Lina onboarding)
- Çoklu AI sağlayıcı desteği (OpenAI, Anthropic, Google, LangChain)
- Dark theme (Material Design 3)
- Topluluk özellikleri (kategori bazlı gönderiler)
- Hedef takibi (Profil ekranından erişilebilir)
- Koç Market (marketplace sistemi)
- Kimlik doğrulama (Email, Google, Apple)
- Profil yönetimi ve analitik raporlar
- Tema ve dil ayarları
- Bildirim yönetimi

---

**Not:** Bu dokümantasyon sürekli güncellenmektedir. Son güncellemeler için repository'yi kontrol edin.

