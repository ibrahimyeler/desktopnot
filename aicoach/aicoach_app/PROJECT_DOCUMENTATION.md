# Gofocus - Kapsamlı Proje Dokümantasyonu

## 📋 İçindekiler

1. [Proje Genel Bakışı](#proje-genel-bakışı)
2. [Teknoloji Yığını](#teknoloji-yığını)
3. [Mimari ve Proje Yapısı](#mimari-ve-proje-yapısı)
4. [Ekranlar ve Özellikler](#ekranlar-ve-özellikler)
5. [Widget'lar ve Bileşenler](#widgetlar-ve-bileşenler)
6. [Servisler ve İş Mantığı](#servisler-ve-iş-mantığı)
7. [Modeller ve Veri Yapıları](#modeller-ve-veri-yapıları)
8. [AI Entegrasyonu](#ai-entegrasyonu)
9. [Kimlik Doğrulama](#kimlik-doğrulama)
10. [Tema ve Tasarım Sistemi](#tema-ve-tasarım-sistemi)
11. [Navigasyon Yapısı](#navigasyon-yapısı)
12. [Onboarding Akışı](#onboarding-akışı)
13. [Veri Yönetimi](#veri-yönetimi)
14. [Geliştirme Rehberi](#geliştirme-rehberi)
15. [Gelecek Planları](#gelecek-planları)

---

## 🎯 Proje Genel Bakışı

**Gofocus**, kullanıcıların kişisel gelişim hedeflerine ulaşmalarına yardımcı olan, yapay zeka destekli bir kişisel gelişim koçluk uygulamasıdır. Uygulama, CEO benzeri bir yönetim paneli sunarak kritik bilgileri özet halinde gösterir ve kullanıcıların odaklanma, planlama ve verimlilik hedeflerine ulaşmalarına yardımcı olur.

### Temel Amaç

- Kullanıcıların odaklanma ve planlama becerilerini geliştirmek
- Hedef belirleme ve takip süreçlerini kolaylaştırmak
- AI destekli kişiselleştirilmiş koçluk hizmeti sunmak
- Minimalist ve kullanıcı dostu bir arayüz sağlamak
- CEO benzeri bir dashboard ile özet bilgiler sunmak

### Ana Özellikler

- **Tek AI Koçu**: "Odak ve Planlama Koçu" (Lina) - odaklanma, hedef belirleme ve zaman yönetimi konularında uzman
- **CEO Dashboard**: Ana sayfada özet metrikler, ajanda, notlar ve hızlı erişim butonları
- **8 Adımlı Onboarding**: Kullanıcı tercihlerini toplayan interaktif onboarding akışı
- **Detaylı Koç Sayfası**: Genel bakış, hedefler, görevler ve notlar sekmeleri
- **Dark Theme**: Tüm uygulama boyunca tutarlı koyu tema tasarımı
- **Topluluk Özellikleri**: Kullanıcılar arası etkileşim ve içerik paylaşımı
- **Hedef Takibi**: Animasyonlu ilerleme çubukları ile hedef yönetimi
- **Çoklu AI Sağlayıcı Desteği**: OpenAI, Anthropic, Google AI entegrasyonları

---

## 🛠 Teknoloji Yığını

### Framework ve Dil
- **Flutter**: 3.9.2+ (Cross-platform mobile framework)
- **Dart**: 3.9.2+ (Programlama dili)

### Bağımlılıklar

#### State Management
- `provider: ^6.1.1` - State management için

#### Veri Yönetimi
- `shared_preferences: ^2.2.2` - Yerel veri saklama
- `http: ^1.2.0` - HTTP istekleri

#### UI ve İçerik
- `flutter_markdown: ^0.6.18` - Markdown desteği
- `cupertino_icons: ^1.0.8` - iOS stili ikonlar

#### Kimlik Doğrulama
- `google_sign_in: ^6.2.1` - Google Sign-In
- `sign_in_with_apple: ^6.1.3` - Apple Sign-In

#### Geliştirme Araçları
- `flutter_lints: ^5.0.0` - Linting kuralları
- `flutter_test` - Test framework

### Platform Desteği
- ✅ iOS
- ✅ Android
- ✅ Web (kısmi)
- ✅ macOS
- ✅ Linux
- ✅ Windows

---

## 🏗 Mimari ve Proje Yapısı

### Genel Mimari

Uygulama, **component-based** ve **service-oriented** bir mimari kullanır:

```
lib/
├── main.dart                    # Uygulama giriş noktası
├── models/                      # Veri modelleri
│   ├── coach.dart              # AI koç modeli
│   ├── chat_message.dart       # Sohbet mesajı modeli
│   └── ai_model.dart           # AI model konfigürasyonu (legacy)
├── services/                    # İş mantığı servisleri
│   ├── coach_service.dart      # Koç yönetimi
│   ├── chat_service.dart       # Sohbet yönetimi
│   ├── auth_service.dart       # Kimlik doğrulama
│   ├── ai_provider.dart        # AI sağlayıcı arayüzü
│   ├── openai_provider.dart    # OpenAI implementasyonu
│   ├── anthropic_provider.dart # Anthropic implementasyonu
│   ├── google_provider.dart    # Google AI implementasyonu
│   └── ai_model_service.dart   # AI model yönetimi
├── screens/                     # Ekranlar
│   ├── splash_screen.dart      # Splash ekranı
│   ├── login_screen.dart       # Giriş ekranı
│   ├── register_screen.dart    # Kayıt ekranı
│   ├── forgot_password_screen.dart # Şifre sıfırlama
│   ├── main_screen.dart        # Ana navigasyon ekranı
│   ├── home_screen.dart        # Ana sayfa (CEO Dashboard)
│   ├── coach_list_screen.dart  # Koç listesi
│   ├── coach_chat_screen.dart  # Sohbet ekranı
│   ├── focus_planning_detail_screen.dart # Koç detay sayfası
│   ├── lina_onboarding_screen.dart # Onboarding akışı
│   ├── goals_screen.dart       # Hedefler ekranı
│   ├── community_screen.dart   # Topluluk ekranı
│   ├── profile_screen.dart     # Profil ekranı
│   ├── edit_profile_screen.dart # Profil düzenleme
│   ├── analytics_report_screen.dart # Analitik raporlar
│   ├── notifications_screen.dart # Bildirimler
│   ├── theme_screen.dart       # Tema ayarları
│   ├── language_screen.dart    # Dil ayarları
│   ├── executive_agenda_detail_screen.dart # Ajanda detay
│   ├── executive_notes_detail_screen.dart # Notlar detay
│   └── create_coach_onboarding_screen.dart # Koç oluşturma (legacy)
├── widgets/                     # Yeniden kullanılabilir widget'lar
│   ├── home_header_section.dart # Ana sayfa başlığı
│   ├── executive_overview_section.dart # CEO özet bölümü
│   ├── executive_pages_section.dart # Sayfa navigasyon butonları
│   ├── executive_assistant_card.dart # Asistan kartı
│   ├── executive_agenda_section.dart # Ajanda bölümü
│   ├── executive_notes_section.dart # Notlar bölümü
│   ├── quick_access_section.dart # Hızlı erişim
│   ├── featured_coaches_section.dart # Öne çıkan koçlar
│   ├── recent_activity_section.dart # Son aktiviteler
│   ├── coach_card.dart # Koç kartı
│   ├── coach_card_horizontal.dart # Yatay koç kartı
│   ├── coaches_header_section.dart # Koçlar sayfası başlığı
│   ├── community_header_section.dart # Topluluk başlığı
│   ├── community_categories_section.dart # Topluluk kategorileri
│   ├── community_featured_posts_section.dart # Öne çıkan gönderiler
│   ├── profile_header_section.dart # Profil başlığı
│   ├── profile_stats_section.dart # Profil istatistikleri
│   ├── profile_analytics_card.dart # Analitik kartı
│   ├── profile_settings_section.dart # Ayarlar bölümü
│   ├── custom_button.dart # Özel buton
│   ├── custom_text_field.dart # Özel metin alanı
│   ├── login_header.dart # Giriş başlığı
│   ├── login_footer.dart # Giriş alt bilgisi
│   └── gofocus_pro_card.dart # Premium kartı
└── components/                  # Özel bileşenler (legacy)
    ├── fitness/                 # Fitness koçu bileşenleri
    └── software/                # Yazılım koçu bileşenleri
```

### Mimari Prensipler

1. **Separation of Concerns**: Her katman kendi sorumluluğuna odaklanır
2. **Single Responsibility**: Her widget/servis tek bir işi yapar
3. **Reusability**: Widget'lar yeniden kullanılabilir şekilde tasarlanmıştır
4. **Dependency Injection**: Servisler bağımlılık enjeksiyonu ile yönetilir
5. **State Management**: Provider pattern kullanılır

---

## 📱 Ekranlar ve Özellikler

### 1. Splash Screen (`splash_screen.dart`)
- Uygulama başlangıcında gösterilir
- Kullanıcı oturum durumunu kontrol eder
- Oturum açık ise `MainScreen`, değilse `LoginScreen`'e yönlendirir

### 2. Authentication Screens

#### Login Screen (`login_screen.dart`)
- Email/şifre ile giriş
- Google Sign-In butonu
- Apple Sign-In butonu (iOS)
- "Şifremi Unuttum" linki
- "Hesap Oluştur" yönlendirmesi
- Dark theme desteği

#### Register Screen (`register_screen.dart`)
- Email, şifre ve kullanıcı adı ile kayıt
- Şifre doğrulama
- Google/Apple Sign-In seçenekleri
- Form validasyonu

#### Forgot Password Screen (`forgot_password_screen.dart`)
- Email ile şifre sıfırlama kodu gönderme
- Kod doğrulama
- Yeni şifre belirleme

### 3. Main Screen (`main_screen.dart`)
Ana navigasyon ekranı. Alt navigasyon bar ile 5 ana bölüm:

- **Ana Sayfa** (Home)
- **Koçlarım** (My Coaches)
- **Topluluk** (Community)
- **Hedefler** (Goals)
- **Profil** (Profile)

**Özellikler:**
- `IndexedStack` ile ekran durumu korunur
- Dark theme alt navigasyon bar
- Animasyonlu seçim göstergeleri
- Sarı-turuncu vurgu rengi (`#FFB800`)

### 4. Home Screen (`home_screen.dart`) - CEO Dashboard

Ana sayfa, CEO benzeri bir yönetim paneli olarak tasarlanmıştır:

#### Bileşenler:

1. **Home Header Section**
   - Hoş geldin mesajı
   - Bildirim ikonu

2. **Executive Overview Section**
   - Önemli metrikler (4 kart)
   - Responsive grid layout

3. **Executive Pages Section**
   - Detay sayfalarına hızlı erişim butonları
   - Performance, Coaches, Goals, History, Notifications

4. **Executive Assistant Card**
   - AI asistan kontrol paneli
   - Hızlı aksiyonlar

5. **Executive Agenda Section**
   - Günlük ajanda özeti
   - Kritik toplantılar ve odak zamanları
   - Detay sayfasına link

6. **Executive Notes Section**
   - Öncelikli notlar
   - Hızlı not ekleme
   - Detay sayfasına link

7. **Quick Access Section**
   - Chat, Add Coach, Goals, Stats butonları

8. **Featured Coaches Section**
   - Yatay kaydırılabilir koç kartları

9. **Recent Activity Section**
   - Son aktiviteler listesi

**Responsive Design:**
- Geniş ekranlarda (`>=720px`) yan yana layout
- Dar ekranlarda dikey layout

### 5. Coach List Screen (`coach_list_screen.dart`)

**Özellikler:**
- Tek koç gösterimi: "Odak ve Planlama Koçu"
- Dark theme tasarım
- Koç kartına tıklayınca:
  - Onboarding tamamlanmamışsa → `LinaOnboardingScreen`
  - Onboarding tamamlanmışsa → `FocusPlanningDetailScreen`
- Boş durum UI'sı
- Loading state

### 6. Lina Onboarding Screen (`lina_onboarding_screen.dart`)

8 adımlı interaktif onboarding akışı:

1. **Hoş Geldin**: Lina tanıtımı
2. **İsim Belirleme**: Kullanıcı adı girişi
3. **Odak Alanları**: Çoklu seçim (Kariyer, Zihinsel denge, Fiziksel enerji, Finansal düzen, Genel yaşam)
4. **Günlük Ritim**: Tek seçim (Sabah, Gün içi, Gece, Düzensiz)
5. **Planlama Tarzı**: Tek seçim (Yazılı, Zihinsel, Dijital, Plan yapmam)
6. **Dikkat Dağıtıcılar**: Çoklu seçim (Bildirimler, Sosyal medya, Görev yükü, Motivasyon eksikliği)
7. **Koç Tarzı**: Tek seçim (Disiplinli, Sakin, Motive edici)
8. **Özet**: Tüm seçimlerin özeti ve onay

**Özellikler:**
- Animasyonlu geçişler
- Progress bar
- Her adım için özel gradient arka plan
- Veriler `SharedPreferences`'e kaydedilir
- Tamamlandığında `onboarding_completed: true` flag'i set edilir

### 7. Focus Planning Detail Screen (`focus_planning_detail_screen.dart`)

Koç detay sayfası, 4 sekme içerir:

#### Sekmeler:

1. **Genel Bakış**
   - İstatistik kartları (Toplam Sohbet, Tamamlanan Görevler, Aktif Hedefler, Toplam Not)
   - Hızlı aksiyon kartları (Yeni Hedef, Görev Ekle, Not Ekle, Rapor Görüntüle)
   - "Lina ile Konuş" butonu → `CoachChatScreen`

2. **Hedefler**
   - Hedef listesi
   - Boş durum UI'sı
   - Yeni hedef ekleme butonu

3. **Görevler**
   - Görev listesi
   - Tamamlanma durumu
   - Boş durum UI'sı

4. **Notlar**
   - Not listesi
   - Tarih bilgisi
   - Boş durum UI'sı

**Tasarım:**
- Dark theme
- Sarı-turuncu vurgu rengi
- Responsive layout

### 8. Coach Chat Screen (`coach_chat_screen.dart`)

AI koç ile sohbet ekranı:

**Özellikler:**
- Markdown desteği
- Mesaj geçmişi
- Kullanıcı ve AI mesajları ayrımı
- Loading state
- Hata yönetimi
- Mesaj gönderme animasyonları
- Scroll to bottom

### 9. Goals Screen (`goals_screen.dart`)

Hedef yönetimi ekranı:

**Özellikler:**
- Progress Overview Card (genel ilerleme)
- Aktif hedefler listesi
- Tamamlanan hedefler listesi
- Yeni hedef oluşturma dialogu
- Animasyonlu progress bar'lar
- Kategori bazlı filtreleme
- Dark theme

**Hedef Kategorileri:**
- Kariyer
- Sağlık
- Finans
- Kişisel Gelişim
- Diğer

### 10. Community Screen (`community_screen.dart`)

Topluluk ekranı:

**Özellikler:**
- Tab bar (Tümü, Finans, Sağlık, Spor, Kariyer)
- Kategori bazlı filtreleme
- Öne çıkan gönderiler
- Yeni gönderi oluşturma butonu
- Beğeni ve yorum sayıları
- Dark theme

### 11. Profile Screen (`profile_screen.dart`)

Kullanıcı profil ekranı:

**Bölümler:**

1. **Profile Header Section**
   - Avatar
   - Kullanıcı adı
   - Premium üyelik durumu
   - "Profili Düzenle" butonu

2. **Profile Stats Section**
   - İstatistik kartları (Toplam Sohbet, Tamamlanan Hedefler, Aktif Hedefler, Toplam Not)

3. **Profile Settings Section**
   - Ayarlar listesi:
     - Bildirimler
     - Tema
     - Dil
     - Analitik Raporlar
     - Çıkış Yap

**Özellikler:**
- Dark theme
- Responsive layout
- Navigasyon butonları

### 12. Diğer Ekranlar

- **Edit Profile Screen**: Profil düzenleme
- **Analytics Report Screen**: Detaylı analitik raporlar
- **Notifications Screen**: Bildirimler listesi
- **Theme Screen**: Tema seçimi
- **Language Screen**: Dil seçimi
- **Executive Agenda Detail Screen**: Ajanda detay sayfası
- **Executive Notes Detail Screen**: Notlar detay sayfası

---

## 🧩 Widget'lar ve Bileşenler

### Home Screen Widgets

#### `home_header_section.dart`
- Hoş geldin mesajı
- Bildirim ikonu
- Dark theme

#### `executive_overview_section.dart`
- 4 metrik kartı (grid layout)
- Responsive tasarım
- Gradient arka planlar

#### `executive_pages_section.dart`
- 5 navigasyon butonu
- Icon + label
- Hover/tap efektleri

#### `executive_assistant_card.dart`
- AI asistan kontrol paneli
- Hızlı aksiyonlar
- Durum göstergeleri

#### `executive_agenda_section.dart`
- Günlük ajanda özeti
- Toplantı listesi
- Detay sayfasına link

#### `executive_notes_section.dart`
- Öncelikli notlar
- Hızlı not ekleme
- Detay sayfasına link

#### `quick_access_section.dart`
- 4 hızlı erişim butonu
- Icon + label
- Navigasyon

#### `featured_coaches_section.dart`
- Yatay kaydırılabilir koç kartları
- `ListView.builder` ile performanslı render

#### `recent_activity_section.dart`
- Son aktiviteler listesi
- Tarih ve açıklama

### Coach Widgets

#### `coach_card.dart`
- Dikey koç kartı
- Icon, isim, açıklama
- Kategori badge'i

#### `coach_card_horizontal.dart`
- Yatay koç kartı
- Kompakt tasarım
- List view için optimize

#### `coaches_header_section.dart`
- Koçlar sayfası başlığı
- İstatistikler

### Community Widgets

#### `community_header_section.dart`
- Topluluk başlığı
- İstatistikler (Toplam gönderi, Aktif kullanıcı)

#### `community_categories_section.dart`
- Kategori kartları
- Grid layout
- Seçim durumu

#### `community_featured_posts_section.dart`
- Öne çıkan gönderiler
- Beğeni/yorum sayıları
- Kullanıcı bilgileri

### Profile Widgets

#### `profile_header_section.dart`
- Avatar
- Kullanıcı bilgileri
- Premium badge
- Düzenle butonu

#### `profile_stats_section.dart`
- 4 istatistik kartı
- Icon + değer + label

#### `profile_analytics_card.dart`
- Analitik özet kartı
- Grafik gösterimi (gelecek)

#### `profile_settings_section.dart`
- Ayarlar listesi
- Icon + label + arrow
- Navigasyon

### Shared Widgets

#### `custom_button.dart`
- Özelleştirilebilir buton
- Loading state
- Disabled state
- Gradient arka plan

#### `custom_text_field.dart`
- Özelleştirilebilir metin alanı
- Label, hint, error
- Icon desteği

#### `login_header.dart`
- Giriş sayfası başlığı
- Logo (opsiyonel)

#### `login_footer.dart`
- Giriş sayfası alt bilgisi
- Linkler

#### `gofocus_pro_card.dart`
- Premium üyelik kartı
- Gradient arka plan
- CTA butonu

---

## 🔧 Servisler ve İş Mantığı

### Coach Service (`coach_service.dart`)

**Sorumluluklar:**
- Koç listesini yönetme
- Koç verilerini `SharedPreferences`'e kaydetme/yükleme
- AI provider'ı koç için yapılandırma

**Metodlar:**
- `getCoaches()`: Tüm koçları getirir (şu anda sadece "Odak ve Planlama Koçu")
- `saveCoaches(List<Coach>)`: Koçları kaydeder
- `getProviderForCoach(Coach)`: Koç için AI provider döndürür
- `_getDefaultCoaches()`: Varsayılan koç listesi

**Veri Yapısı:**
```dart
Coach(
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
)
```

### Chat Service (`chat_service.dart`)

**Sorumluluklar:**
- Sohbet mesajlarını yönetme
- AI provider ile iletişim
- Mesaj geçmişini saklama

**Metodlar:**
- `sendMessage()`: Mesaj gönderir ve AI yanıtı alır
- `clearMessages()`: Mesaj geçmişini temizler
- `messages`: Mevcut mesaj listesi

**Akış:**
1. Kullanıcı mesajı eklenir
2. AI provider'a gönderilir (conversation history ile)
3. AI yanıtı alınır
4. Yanıt mesaj listesine eklenir

### Auth Service (`auth_service.dart`)

**Sorumluluklar:**
- Email/şifre ile kimlik doğrulama
- Google Sign-In
- Apple Sign-In
- Token yönetimi

**Metodlar:**
- `register()`: Email ile kayıt
- `login()`: Email ile giriş
- `forgotPassword()`: Şifre sıfırlama
- `resetPassword()`: Yeni şifre belirleme
- `signInWithGoogle()`: Google ile giriş
- `signInWithApple()`: Apple ile giriş
- `refreshToken()`: Token yenileme
- `validateToken()`: Token doğrulama

**Backend Entegrasyonu:**
- Base URL: `http://localhost:8001`
- Endpoints:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `POST /auth/google`
  - `POST /auth/apple`
  - `POST /auth/refresh`
  - `GET /auth/validate`

### AI Provider Interface (`ai_provider.dart`)

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

### AI Model Service (`ai_model_service.dart`)

**Sorumluluklar:**
- AI model konfigürasyonlarını yönetme
- Model listesini sağlama
- Model seçimini yönetme

---

## 📊 Modeller ve Veri Yapıları

### Coach Model (`coach.dart`)

```dart
class Coach {
  final String id;
  final String name;
  final String category;
  final String description;
  final String icon;
  final Map<String, dynamic> config;
  final bool isActive;
  
  // JSON serialization
  factory Coach.fromJson(Map<String, dynamic> json);
  Map<String, dynamic> toJson();
  
  // Copy with
  Coach copyWith({...});
}
```

**Kullanım:**
- Koç bilgilerini temsil eder
- `SharedPreferences`'e JSON olarak kaydedilir
- AI provider konfigürasyonu içerir

### Chat Message Model (`chat_message.dart`)

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
- Sohbet mesajlarını temsil eder
- Kullanıcı ve AI mesajlarını ayırt eder
- Conversation history için kullanılır

### AI Model (`ai_model.dart`)

Legacy model, gelecekte kaldırılabilir.

---

## 🤖 AI Entegrasyonu

### Desteklenen Sağlayıcılar

1. **OpenAI**
   - Modeller: GPT-4, GPT-3.5-turbo
   - API: OpenAI API
   - Provider: `OpenAIProvider`

2. **Anthropic**
   - Modeller: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
   - API: Anthropic API
   - Provider: `AnthropicProvider`

3. **Google AI**
   - Modeller: Gemini Pro, Gemini Ultra
   - API: Google AI API
   - Provider: `GoogleProvider`

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

**Odak ve Planlama Koçu:**
```
Sen bir odak ve planlama koçusun. Kullanıcıların odaklanma becerilerini geliştirmesine, hedeflerini belirlemesine ve planlamasına, zaman yönetimini iyileştirmesine, verimliliğini artırmasına ve günlük rutinlerini optimize etmesine yardımcı ol. Pomodoro tekniği, zaman bloklama, görev önceliklendirme gibi teknikler öner.
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

1. **Email/Şifre**
   - Kayıt: Email, şifre, kullanıcı adı
   - Giriş: Email, şifre
   - Şifre sıfırlama: Email ile kod gönderme

2. **Google Sign-In**
   - OAuth 2.0
   - Scopes: email, profile
   - Backend entegrasyonu

3. **Apple Sign-In**
   - OAuth 2.0
   - iOS only
   - Scopes: email, fullName
   - Backend entegrasyonu

### Token Yönetimi

- Access Token: API istekleri için
- Refresh Token: Token yenileme için
- Token Validation: Token geçerliliğini kontrol etme

### Backend Entegrasyonu

Tüm kimlik doğrulama işlemleri backend API'ye yönlendirilir:
- Base URL: `http://localhost:8001`
- Endpoints: `/auth/*`

**Not:** Şu anda mock data kullanılıyor, backend hazır olduğunda aktif edilecek.

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

### Shadows

Dark theme'de shadow kullanılmaz, border ile ayrım yapılır.

### Material Design 3

- Material 3 kullanılır
- Custom color scheme
- Adaptive theming

---

## 🧭 Navigasyon Yapısı

### Ana Navigasyon

```
SplashScreen
├── LoginScreen (if not authenticated)
│   ├── RegisterScreen
│   ├── ForgotPasswordScreen
│   └── MainScreen (after login)
└── MainScreen (if authenticated)
    ├── HomeScreen
    ├── CoachListScreen
    │   ├── LinaOnboardingScreen (if onboarding not completed)
    │   └── FocusPlanningDetailScreen
    │       └── CoachChatScreen
    ├── CommunityScreen
    ├── GoalsScreen
    └── ProfileScreen
        ├── EditProfileScreen
        ├── AnalyticsReportScreen
        ├── NotificationsScreen
        ├── ThemeScreen
        └── LanguageScreen
```

### Deep Linking (Gelecek)

- `gofocus://coach/:id` - Koç detay sayfası
- `gofocus://chat/:coachId` - Sohbet ekranı
- `gofocus://goal/:id` - Hedef detay sayfası

---

## 🚀 Onboarding Akışı

### Lina Onboarding Screen

8 adımlı interaktif onboarding:

1. **Hoş Geldin**
   - Lina tanıtımı
   - "Tamam, başlayalım 🚀" butonu

2. **İsim Belirleme**
   - Text input
   - Validasyon

3. **Odak Alanları** (Çoklu seçim)
   - Kariyer ve verimlilik
   - Zihinsel denge ve odak
   - Fiziksel enerji
   - Finansal düzen
   - Genel yaşam planı

4. **Günlük Ritim** (Tek seçim)
   - Sabah erken kalkar, plan yaparım
   - Gün içinde yoğun ve bölünmüş geçer
   - Gece saatlerinde daha verimli olurum
   - Düzensiz, her gün farklı

5. **Planlama Tarzı** (Tek seçim)
   - Yazılı olarak not alırım
   - Kafamda tutarım
   - Dijital uygulamalarda planlarım
   - Genelde plan yapmam

6. **Dikkat Dağıtıcılar** (Çoklu seçim)
   - Telefon bildirimleri
   - Sosyal medya
   - Aşırı görev yükü
   - Motivasyon eksikliği

7. **Koç Tarzı** (Tek seçim)
   - Disiplinli ve hedef odaklı
   - Sakin ve dengeli
   - Motive edici ve destekleyici

8. **Özet**
   - Tüm seçimlerin özeti
   - "Başlayalım 🚀" butonu

### Veri Saklama

Tüm onboarding verileri `SharedPreferences`'e kaydedilir:

```dart
{
  'user_name': String,
  'focus_areas': List<String>,
  'daily_rhythm': String,
  'planning_style': String,
  'distractions': List<String>,
  'coach_tone': String,
  'onboarding_completed': bool,
}
```

### Tamamlandıktan Sonra

Onboarding tamamlandığında:
1. `onboarding_completed: true` set edilir
2. `FocusPlanningDetailScreen`'e yönlendirilir
3. Gelecekteki girişlerde onboarding atlanır

---

## 💾 Veri Yönetimi

### SharedPreferences

Yerel veri saklama için `SharedPreferences` kullanılır:

**Kullanılan Key'ler:**
- `ai_coaches`: Koç listesi (JSON)
- `onboarding_completed`: Onboarding durumu (bool)
- `user_name`: Kullanıcı adı (String)
- `focus_areas`: Odak alanları (JSON array)
- `daily_rhythm`: Günlük ritim (String)
- `planning_style`: Planlama tarzı (String)
- `distractions`: Dikkat dağıtıcılar (JSON array)
- `coach_tone`: Koç tarzı (String)

### Veri Formatları

**Koç Listesi:**
```json
[
  {
    "id": "focus-planning-coach",
    "name": "Odak ve Planlama Koçu",
    "category": "productivity",
    "description": "...",
    "icon": "🎯",
    "config": {
      "apiKey": "",
      "systemPrompt": "...",
      "model": "gpt-4"
    },
    "isActive": true
  }
]
```

**Onboarding Verileri:**
```json
{
  "user_name": "Kullanıcı Adı",
  "focus_areas": ["kariyer", "zihinsel denge"],
  "daily_rhythm": "morning_focus",
  "planning_style": "written",
  "distractions": ["bildirimler", "sosyal medya"],
  "coach_tone": "disciplined",
  "onboarding_completed": true
}
```

### Veri Senkronizasyonu (Gelecek)

- Backend API ile senkronizasyon
- Cloud backup
- Çoklu cihaz desteği

---

## 📖 Geliştirme Rehberi

### Kurulum

1. **Flutter SDK Kurulumu**
   ```bash
   flutter --version  # 3.9.2+ olmalı
   ```

2. **Bağımlılıkları Yükle**
   ```bash
   flutter pub get
   ```

3. **Platform Setup**
   - iOS: `cd ios && pod install`
   - Android: Android Studio ile SDK kurulumu

### Çalıştırma

```bash
# iOS Simulator
flutter run -d ios

# Android Emulator
flutter run -d android

# Web
flutter run -d chrome
```

### Yeni Özellik Ekleme

1. **Yeni Ekran Ekleme**
   - `lib/screens/` altına ekle
   - `main_screen.dart`'a route ekle (gerekirse)

2. **Yeni Widget Ekleme**
   - `lib/widgets/` altına ekle
   - Reusable olarak tasarla

3. **Yeni Servis Ekleme**
   - `lib/services/` altına ekle
   - Dependency injection kullan

### Kod Standartları

- **Dart Style Guide**: Official Dart style guide'ı takip et
- **Linting**: `flutter_lints` kurallarına uy
- **Naming**: camelCase (değişkenler), PascalCase (sınıflar)
- **Comments**: Önemli fonksiyonlar için dokümantasyon yorumları

### Test

```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widget_test.dart
```

### Build

```bash
# iOS
flutter build ios

# Android
flutter build apk
flutter build appbundle
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
   - Ödül mağazası

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

## 📝 Notlar

### Mevcut Durum

- ✅ Dark theme tamamen uygulandı
- ✅ Onboarding akışı tamamlandı
- ✅ CEO dashboard tasarımı yapıldı
- ✅ Tek koç sistemi (Odak ve Planlama Koçu)
- ✅ Responsive design
- ⚠️ Backend entegrasyonu mock data ile çalışıyor
- ⚠️ Gamification özellikleri henüz eklenmedi
- ⚠️ Push notifications yok

### Bilinen Sorunlar

- Backend API entegrasyonu tamamlanmadı
- Bazı ekranlarda mock data kullanılıyor
- Offline mode desteği yok
- Çoklu dil desteği sınırlı

### Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request aç

---

## 📞 İletişim ve Destek

- **Repository**: [GitHub URL]
- **Issues**: [GitHub Issues URL]
- **Documentation**: Bu dosya

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Son Güncelleme:** 2024
**Versiyon:** 1.0.0
**Durum:** Aktif Geliştirme

