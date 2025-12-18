# Koç Onboarding Sistemi Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Sistem Mimarisi](#sistem-mimarisi)
3. [Onboarding Akışı](#onboarding-akışı)
4. [Adım Adım Açıklama](#adım-adım-açıklama)
5. [Toplanan Veriler](#toplanan-veriler)
6. [System Prompt Oluşturma](#system-prompt-oluşturma)
7. [Teknik Detaylar](#teknik-detaylar)
8. [Kullanıcı Arayüzü](#kullanıcı-arayüzü)
9. [Veri Kaydetme](#veri-kaydetme)
10. [Kod Yapısı](#kod-yapısı)

---

## 🎯 Genel Bakış

**Koç Onboarding Sistemi**, kullanıcıların kendi özel AI koçlarını oluşturmalarına olanak sağlayan interaktif bir 10 adımlı süreçtir. Bu sistem, kullanıcının tercihlerini toplayarak kişiselleştirilmiş bir AI koç profili oluşturur ve bu profili system prompt olarak kullanır.

### Temel Özellikler

- ✅ **10 Adımlı İnteraktif Süreç**: Kullanıcı dostu, adım adım bir onboarding akışı
- ✅ **Kişiselleştirme**: Koçun adı, kategorisi, iletişim tarzı, kişilik özellikleri ve daha fazlası
- ✅ **Dinamik System Prompt**: Tüm bilgiler birleştirilerek kapsamlı bir system prompt oluşturulur
- ✅ **İlerleme Takibi**: Her adımda görsel progress indicator
- ✅ **Responsive Tasarım**: Tüm ekran boyutlarında çalışan responsive layout
- ✅ **Özel İstekler**: Kullanıcıların kendi özel isteklerini ekleyebileceği alan

---

## 🏗 Sistem Mimarisi

### Dosya Yapısı

```
lib/screens/
└── create_coach_onboarding_screen.dart  # Ana onboarding ekranı

lib/models/
└── coach.dart                           # Koç modeli

lib/services/
└── coach_service.dart                   # Koç servisi (kaydetme/yükleme)
```

### Mimari Akış

```
CreateCoachOnboardingScreen
    │
    ├── PageController (Sayfa navigasyonu)
    ├── State Variables (Form verileri)
    │
    ├── 10 Adımlı Sayfa Yapısı
    │   ├── Welcome Page
    │   ├── Name Page
    │   ├── Description Page
    │   ├── Category Page
    │   ├── Icon Page
    │   ├── Goal Page
    │   ├── Communication Style Page
    │   ├── Activity Level Page
    │   ├── System Prompt Page
    │   └── Profile Page
    │
    └── _createCoach()
        ├── Veri Toplama
        ├── System Prompt Oluşturma
        ├── Coach Model Oluşturma
        └── CoachService.saveCoaches()
```

---

## 📱 Onboarding Akışı

### Genel Akış Şeması

```
Başlangıç
    ↓
[1] Hoş Geldiniz Sayfası
    ↓
[2] Koçunuzun Adı Nedir?
    ↓
[3] Koçunuzu Tanımlayın
    ↓
[4] Kategori Seçin
    ↓
[5] Simge Seçin (Emoji)
    ↓
[6] Amacınız Nedir?
    ↓
[7] İletişim Tarzı
    ↓
[8] Aktivite Seviyesi
    ↓
[9] Nasıl Davranmalı? (System Prompt)
    ↓
[10] Profil Oluştur
    ├── Kişilik Tipi
    ├── Uzmanlık Seviyesi
    ├── Yaş Grubu
    ├── Cinsiyet
    ├── Geçmiş ve Deneyim
    └── Özel İstekler ⭐
    ↓
Koç Oluştur
    ↓
CoachService'e Kaydet
    ↓
Ana Ekrana Dön
```

---

## 📝 Adım Adım Açıklama

### Adım 1: Hoş Geldiniz Sayfası

**Amaç**: Kullanıcıyı karşılamak ve onboarding sürecini tanıtmak

**İçerik**:
- Gradient arka planlı büyük ikon (Add Circle)
- "Yeni Koç Oluşturun" başlığı
- Açıklayıcı alt metin

**Tasarım**:
- Merkezi hizalama
- Gradient dairesel container
- Açıklayıcı metin

**Kullanıcı Aksiyonu**: "İleri" butonuna tıklayarak devam eder

---

### Adım 2: Koçunuzun Adı Nedir?

**Amaç**: Koç için bir isim belirleme

**Input Türü**: Text Field (Tek satır)

**Validasyon**: Boş bırakılamaz (final validasyonda kontrol edilir)

**Örnek**: "Kariyer Koçu", "Fitness Mentor", "Finansal Danışman"

**UI Özellikleri**:
- Person ikonu ile prefix
- Placeholder metin
- Outline border

**Kod**:
```dart
TextField(
  onChanged: (value) => setState(() => _coachName = value),
  decoration: const InputDecoration(
    hintText: 'Örn: Kariyer Koçu',
    prefixIcon: Icon(Icons.person),
  ),
)
```

---

### Adım 3: Koçunuzu Tanımlayın

**Amaç**: Koçun ne işe yaradığını açıklama

**Input Türü**: Text Field (3 satır, maxLines: 3)

**Validasyon**: Boş bırakılamaz

**Örnek**: "Kariyer hedeflerinizde size rehberlik eder ve iş hayatınızda ilerlemenize yardımcı olur"

**UI Özellikleri**:
- Description ikonu
- Çok satırlı input
- Outline border

---

### Adım 4: Kategori Seçin

**Amaç**: Koçun hangi alanda olacağını belirleme

**Input Türü**: Çoklu seçenek listesi (Tek seçim)

**Mevcut Kategoriler**:

| Kategori | Label | Icon | Renk |
|----------|-------|------|------|
| `finance` | Finans | 💰 | #10B981 (Yeşil) |
| `health` | Sağlık | 🏥 | #EF4444 (Kırmızı) |
| `fitness` | Spor & Fitness | 💪 | #F59E0B (Turuncu) |
| `career` | Kariyer | 💼 | #3B82F6 (Mavi) |
| `education` | Eğitim | 📚 | #8B5CF6 (Mor) |
| `personal_growth` | Kişisel Gelişim | 🧠 | #EC4899 (Pembe) |
| `relationship` | İlişkiler | ❤️ | #F472B6 (Açık Pembe) |
| `productivity` | Üretkenlik | ⚡ | #FCD34D (Sarı) |
| `mindfulness` | Farkındalık | 🧘 | #34D399 (Turkuaz) |
| `creativity` | Yaratıcılık | 🎨 | #F87171 (Koral) |

**Varsayılan**: `finance` (💰)

**Özel Davranış**: Kategori seçildiğinde, kategori ikonu otomatik olarak emoji olarak da seçilir

**UI Özellikleri**:
- Her kategori için özel renk
- Seçili kategori için check ikonu
- Hover/tap efektleri
- Gradient arka plan

---

### Adım 5: Simge Seçin

**Amaç**: Koç için görsel emoji simgesi seçme

**Input Türü**: Grid layout (4 kolon, 8 satır)

**Toplam Emoji Sayısı**: 32 emoji

**Emoji Listesi**:
💰 🏥 💪 💼 🎯 📚 🧠 ❤️ 🚀 💡 🌟 🌱 ⚡ 🧘 🎨 🔥 ⭐ 🌈 🎪 🎭 🎬 🎵 🎤 🎸 🏆 🥇 💎 🎁 🎈 🎊 🎉 🍀

**Varsayılan**: Seçilen kategorinin ikonu

**UI Özellikleri**:
- 4x8 grid layout
- Seçili emoji için kategori renginde border
- Büyük emoji boyutu (40px)
- Tıklanabilir kartlar

---

### Adım 6: Amacınız Nedir?

**Amaç**: Kullanıcının bu koçtan ne beklediğini anlama

**Input Türü**: Text Field (4 satır, maxLines: 4)

**Validasyon**: Opsiyonel (zorunlu değil)

**Örnek**: "İş yerinde daha üretken olmak istiyorum, zaman yönetimini iyileştirmek istiyorum"

**UI Özellikleri**:
- Flag ikonu
- Çok satırlı input
- Yeşil bilgi kutusu:
  - 💡 İkon
  - "Hedefiniz ne kadar net olursa, koçunuz size o kadar iyi yardımcı olur"

**System Prompt'a Eklenmesi**: 
```
Kullanıcının hedefi: [kullanıcı girişi]
```

---

### Adım 7: İletişim Tarzı

**Amaç**: Koçun iletişim şeklini belirleme

**Input Türü**: Seçenek listesi (Tek seçim)

**Seçenekler**:

| Değer | Label | Açıklama | Icon |
|-------|-------|----------|------|
| `supportive` | Destekleyici | Sıcak ve anlayışlı | ❤️ (favorite) |
| `motivational` | Motivasyonel | Enerjik ve coşkulu | 🎉 (celebration) |
| `professional` | Profesyonel | Ciddi ve odaklı | 💼 (business_center) |
| `friendly` | Arkadaşça | Samimi ve rahatlatıcı | 👥 (people) |

**Varsayılan**: `supportive`

**UI Özellikleri**:
- Her seçenek için ikon
- Kısa açıklama metni
- Seçili seçenek için check ikonu
- Primary renk ile vurgulama

**System Prompt'a Eklenmesi**:
```
İletişim tarzı: destekleyici ve anlayışlı
```
(Değer Türkçe'ye çevrilir)

---

### Adım 8: Aktivite Seviyesi

**Amaç**: Ne sıklıkla koçtan yardım alınacağını belirleme

**Input Türü**: Seçenek listesi (Tek seçim)

**Seçenekler**:

| Değer | Label | Açıklama | Icon |
|-------|-------|----------|------|
| `light` | Hafif | Haftada 1-2 kez | ☁️ (cloud_outlined) |
| `moderate` | Orta | Haftada 3-4 kez | 🌆 (wb_twilight_outlined) |
| `intensive` | Yoğun | Haftada 5+ kez | ☀️ (light_mode) |

**Varsayılan**: `moderate`

**UI Özellikleri**:
- Açıklayıcı ikonlar
- Sıklık bilgisi
- Primary renk vurgusu

**System Prompt'a Eklenmesi**:
```
İstenilen sıklık: orta (haftada 3-4 kez)
```
(Değer Türkçe'ye çevrilir)

---

### Adım 9: Nasıl Davranmalı? (System Prompt)

**Amaç**: Koçun temel davranış şeklini tanımlama

**Input Türü**: Text Field (8 satır, maxLines: 8)

**Validasyon**: Boş bırakılamaz (zorunlu alan)

**Örnek**:
```
Sen bir kariyer danışmansın. Kullanıcıların kariyer hedeflerine ulaşmasına yardımcı ol. 
İş başvurularında rehberlik et, özgeçmiş hazırlama konusunda destek ver, mülakat teknikleri öğret.
```

**UI Özellikleri**:
- Psychology ikonu
- Geniş metin alanı
- Mavi bilgi kutusu:
  - ℹ️ İkon
  - "Koçunuzun nasıl davranacağını ve cevap vereceğini belirler"

**System Prompt'a Eklenmesi**: 
Bu alan, oluşturulan tüm bilgilerden sonra **son satıra** eklenir.

---

### Adım 10: Profil Oluştur

**Amaç**: Koçun detaylı profil özelliklerini belirleme

Bu adım **6 alt bölümden** oluşur:

#### 10.1. Kişilik Tipi

**Input Türü**: Chip seçimi (Tek seçim)

**Seçenekler**:

| Değer | Label | Icon |
|-------|-------|------|
| `balanced` | Dengeli | ⚖️ (balance) |
| `energetic` | Enerjik | ⚡ (bolt) |
| `calm` | Sakin | 🧘 (self_improvement) |
| `analytical` | Analitik | 🧠 (psychology) |

**Varsayılan**: `balanced`

**System Prompt'a Eklenmesi**:
```
Kişilik: dengeli ve uyumlu
```
(Değer Türkçe'ye çevrilir)

---

#### 10.2. Uzmanlık Seviyesi

**Input Türü**: Horizontal option cards (Tek seçim)

**Seçenekler**:

| Değer | Label | Icon |
|-------|-------|------|
| `beginner` | Başlangıç | 📈 (trending_up) |
| `intermediate` | Orta | ➡️ (trending_flat) |
| `expert` | Uzman | 📉 (trending_down) |

**Varsayılan**: `intermediate`

**UI Özellikleri**:
- 3 eşit genişlikte kart
- İkon + label
- Seçili kart için primary renk

**System Prompt'a Eklenmesi**:
```
Uzmanlık seviyesi: intermediate
```
(Değer olduğu gibi eklenir)

---

#### 10.3. Yaş Grubu

**Input Türü**: Horizontal option cards (Tek seçim)

**Seçenekler**:

| Değer | Label | Icon |
|-------|-------|------|
| `20-30` | 20-30 | 👤 (person) |
| `30-40` | 30-40 | 👤 (person) |
| `40+` | 40+ | 👤 (person) |

**Varsayılan**: `30-40`

**System Prompt'a Eklenmesi**:
```
Yaş grubu: 30-40
```

---

#### 10.4. Cinsiyet

**Input Türü**: Horizontal option cards (Tek seçim)

**Seçenekler**:

| Değer | Label | Icon |
|-------|-------|------|
| `neutral` | Nötr | ❓ (help_outline) |
| `male` | Erkek | 👨 (man) |
| `female` | Kadın | 👩 (woman) |

**Varsayılan**: `neutral`

**System Prompt'a Eklenmesi**:
```
Cinsiyet: neutral
```

---

#### 10.5. Geçmiş ve Deneyim

**Amaç**: Koçun geçmişini ve deneyimlerini tanımlama

**Input Türü**: Text Field (3 satır, maxLines: 3)

**Validasyon**: Opsiyonel

**Örnek**: "10 yıl finansal danışmanlık deneyimi, MBA derecesi, 50+ şirkete danışmanlık yaptı"

**UI Özellikleri**:
- History Edu ikonu
- Çok satırlı input

**System Prompt'a Eklenmesi**:
```
Geçmiş ve deneyim: [kullanıcı girişi]
```

---

#### 10.6. Özel İstekler ⭐

**Amaç**: Kullanıcının koç hakkında eklemek istediği özel notlar

**Input Türü**: Text Field (4 satır, maxLines: 4)

**Validasyon**: Opsiyonel

**Örnek**: 
- "Koçum günlük hatırlatmalar yapsın"
- "Haftalık rapor versin"
- "Motivasyonel mesajlar göndersin"
- "Belirli saatlerde aktif olsun"

**UI Özellikleri**:
- Edit Note ikonu
- Açıklayıcı alt metin: "Koçunuz hakkında eklemek istediğiniz özel notlar veya istekler (opsiyonel)"
- Mor bilgi kutusu:
  - ℹ️ İkon
  - "Bu bilgiler koçunuzun kişiliğini ve yaklaşımını şekillendirecek"

**System Prompt'a Eklenmesi**:
```
Özel istekler ve notlar: [kullanıcı girişi]
```

**Önemli Not**: Bu alan **son eklenen özellik** olup, kullanıcıların koçlarını daha da özelleştirmelerine olanak sağlar.

---

## 💾 Toplanan Veriler

### Form State Variables

```dart
String _coachName = '';                    // Zorunlu
String _description = '';                  // Zorunlu
String _category = 'finance';              // Varsayılan
String _icon = '💰';                       // Varsayılan
String _systemPrompt = '';                 // Zorunlu
String _goal = '';                         // Opsiyonel
String _communicationStyle = 'supportive'; // Varsayılan
String _activityLevel = 'moderate';        // Varsayılan
String _personality = 'balanced';          // Varsayılan
String _expertiseLevel = 'intermediate';   // Varsayılan
String _ageGroup = '30-40';                // Varsayılan
String _gender = 'neutral';                // Varsayılan
String _customRequests = '';               // Opsiyonel (YENİ)

TextEditingController _backgroundController;        // Opsiyonel
TextEditingController _customRequestsController;    // Opsiyonel (YENİ)
```

### Coach Model Yapısı

Onboarding tamamlandıktan sonra oluşturulan Coach objesi:

```dart
Coach(
  id: DateTime.now().millisecondsSinceEpoch.toString(),
  name: _coachName,
  description: _description,
  category: _category,
  icon: _icon,
  config: {
    'apiKey': '',                    // Kullanıcı daha sonra ekleyecek
    'systemPrompt': fullPrompt,      // Birleştirilmiş system prompt
    'model': 'gpt-4',                // Varsayılan model
  },
)
```

---

## 🔧 System Prompt Oluşturma

### Prompt Birleştirme Mantığı

System prompt, tüm toplanan bilgilerden otomatik olarak oluşturulur:

```dart
var fullPrompt = '';

// 1. Hedef (opsiyonel)
if (_goal.isNotEmpty) {
  fullPrompt += 'Kullanıcının hedefi: $_goal\n';
}

// 2. İletişim Tarzı
if (_communicationStyle.isNotEmpty) {
  final styleMap = {
    'supportive': 'destekleyici ve anlayışlı',
    'motivational': 'motivasyonel ve enerjik',
    'professional': 'profesyonel ve odaklı',
    'friendly': 'arkadaşça ve samimi',
  };
  fullPrompt += 'İletişim tarzı: ${styleMap[_communicationStyle]}\n';
}

// 3. Aktivite Seviyesi
if (_activityLevel.isNotEmpty) {
  final levelMap = {
    'light': 'hafif (haftada 1-2 kez)',
    'moderate': 'orta (haftada 3-4 kez)',
    'intensive': 'yoğun (haftada 5+ kez)',
  };
  fullPrompt += 'İstenilen sıklık: ${levelMap[_activityLevel]}\n';
}

// 4. Kişilik
if (_personality.isNotEmpty) {
  final personalityMap = {
    'balanced': 'dengeli ve uyumlu',
    'energetic': 'enerjik ve coşkulu',
    'calm': 'sakin ve sabırlı',
    'analytical': 'analitik ve mantıklı',
  };
  fullPrompt += 'Kişilik: ${personalityMap[_personality]}\n';
}

// 5. Uzmanlık Seviyesi
if (_expertiseLevel.isNotEmpty) {
  fullPrompt += 'Uzmanlık seviyesi: $_expertiseLevel\n';
}

// 6. Yaş Grubu
if (_ageGroup.isNotEmpty) {
  fullPrompt += 'Yaş grubu: $_ageGroup\n';
}

// 7. Cinsiyet
if (_gender.isNotEmpty) {
  fullPrompt += 'Cinsiyet: $_gender\n';
}

// 8. Geçmiş ve Deneyim
if (_backgroundController.text.isNotEmpty) {
  fullPrompt += 'Geçmiş ve deneyim: ${_backgroundController.text}\n';
}

// 9. Özel İstekler (YENİ)
if (_customRequests.isNotEmpty || _customRequestsController.text.isNotEmpty) {
  final customText = _customRequests.isNotEmpty 
      ? _customRequests 
      : _customRequestsController.text;
  fullPrompt += 'Özel istekler ve notlar: $customText\n';
}

// 10. Sistem Prompt'u (en son eklenir)
if (fullPrompt.isNotEmpty) {
  fullPrompt += '\n';
}
fullPrompt += _systemPrompt;
```

### Örnek System Prompt Çıktısı

```
Kullanıcının hedefi: İş yerinde daha üretken olmak istiyorum
İletişim tarzı: destekleyici ve anlayışlı
İstenilen sıklık: orta (haftada 3-4 kez)
Kişilik: dengeli ve uyumlu
Uzmanlık seviyesi: intermediate
Yaş grubu: 30-40
Cinsiyet: neutral
Geçmiş ve deneyim: 10 yıl kariyer danışmanlığı deneyimi, MBA derecesi
Özel istekler ve notlar: Günlük hatırlatmalar yapsın, haftalık ilerleme raporu versin

Sen bir kariyer danışmansın. Kullanıcıların kariyer hedeflerine ulaşmasına yardımcı ol...
```

---

## 🎨 Teknik Detaylar

### State Management

```dart
class _CreateCoachOnboardingScreenState extends State<CreateCoachOnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;
  
  // Form data state variables
  // ...
  
  @override
  void initState() {
    super.initState();
    _backgroundController = TextEditingController();
    _customRequestsController = TextEditingController();
  }
  
  @override
  void dispose() {
    _pageController.dispose();
    _backgroundController.dispose();
    _customRequestsController.dispose();
    super.dispose();
  }
}
```

### Navigasyon

```dart
void _nextPage() {
  if (_currentPage < _pages.length - 1) {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }
}

void _previousPage() {
  if (_currentPage > 0) {
    _pageController.previousPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }
}
```

### Validasyon

```dart
Future<void> _createCoach() async {
  // Zorunlu alanlar kontrolü
  if (_coachName.isEmpty || _description.isEmpty || _systemPrompt.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Lütfen tüm alanları doldurun'),
        backgroundColor: Colors.red,
      ),
    );
    return;
  }
  
  // Koç oluşturma işlemi...
}
```

### Progress Indicator

```dart
Row(
  children: List.generate(
    _pages.length,  // 10 adım
    (index) => Expanded(
      child: Container(
        height: 4,
        decoration: BoxDecoration(
          color: index <= _currentPage
              ? Theme.of(context).colorScheme.primary
              : Colors.grey[300],
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    ),
  ),
)
```

---

## 🖥 Kullanıcı Arayüzü

### AppBar

- **Başlık**: "Yeni Koç Oluştur" (ortalanmış)
- **Geri Butonu**: Kapat ikonu (X) - Navigator.pop() çağırır
- **Elevation**: 0 (flat design)
- **Arka Plan**: Şeffaf

### Progress Bar

- **Konum**: AppBar altında, 20px padding ile
- **Görünüm**: 10 eşit genişlikte bar (her biri 4px yükseklik)
- **Renk**: 
  - Tamamlanan adımlar: Primary color
  - Gelecek adımlar: Grey[300]
- **Animasyon**: Sayfa değiştiğinde otomatik güncellenir

### Sayfa İçeriği

- **Container**: PageView.builder ile dinamik içerik
- **Scroll**: SingleChildScrollView ile scroll desteği
- **Padding**: 20px tüm yönlerde

### Navigasyon Butonları

- **Konum**: Sayfanın altında, sabitlenmiş
- **Yerleşim**: 
  - Geri butonu (ilk sayfada görünmez)
  - İleri/Oluştur butonu (her zaman görünür)
- **Stil**:
  - Geri: OutlinedButton
  - İleri: ElevatedButton (primary color)
- **Padding**: 20px

---

## 💾 Veri Kaydetme

### Coach Service Entegrasyonu

```dart
Future<void> _createCoach() async {
  // System prompt oluşturma...
  // Coach model oluşturma...
  
  // Mevcut koçları yükle
  final existingCoaches = await widget.coachService.getCoaches();
  
  // Yeni koçu ekle
  existingCoaches.add(newCoach);
  
  // Kaydet
  await widget.coachService.saveCoaches(existingCoaches);
  
  // Ana ekrana dön
  if (mounted) {
    Navigator.pop(context, true);  // true = başarılı
  }
}
```

### SharedPreferences Kullanımı

CoachService, koçları SharedPreferences'te saklar:

```dart
// Key: 'ai_coaches'
// Format: JSON array
[
  {
    "id": "1234567890",
    "name": "Kariyer Koçu",
    "category": "career",
    "description": "...",
    "icon": "💼",
    "config": {
      "apiKey": "",
      "systemPrompt": "...",
      "model": "gpt-4"
    },
    "isActive": true
  }
]
```

---

## 📐 Kod Yapısı

### Sayfa Builder Metodu

```dart
Widget _buildPage(Map<String, dynamic> page) {
  switch (page['field']) {
    case 'welcome':
      return _buildWelcomePage();
    case 'name':
      return _buildNamePage();
    case 'description':
      return _buildDescriptionPage();
    case 'category':
      return _buildCategoryPage();
    case 'icon':
      return _buildIconPage();
    case 'goal':
      return _buildGoalPage();
    case 'communication_style':
      return _buildCommunicationStylePage();
    case 'activity_level':
      return _buildActivityLevelPage();
    case 'prompt':
      return _buildPromptPage();
    case 'profile':
      return _buildProfilePage();
    default:
      return const SizedBox();
  }
}
```

### Pages Array

```dart
final List<Map<String, dynamic>> _pages = [
  {
    'title': 'Hoş Geldiniz!',
    'subtitle': 'Sizin için özel bir koç oluşturalım',
    'field': 'welcome',
  },
  {
    'title': 'Koçunuzun Adı Nedir?',
    'subtitle': 'Koçunuz için bir isim belirleyin',
    'field': 'name',
  },
  // ... diğer sayfalar
];
```

### Kategori Renk Eşleştirmesi

```dart
Color _getCategoryColor(String category) {
  switch (category) {
    case 'finance':
      return const Color(0xFF10B981);
    case 'health':
      return const Color(0xFFEF4444);
    case 'fitness':
      return const Color(0xFFF59E0B);
    // ... diğer kategoriler
    default:
      return const Color(0xFF3B82F6);
  }
}
```

---

## 🎯 Özellikler ve İyileştirmeler

### Mevcut Özellikler

✅ **10 Adımlı Süreç**: Kapsamlı koç profili oluşturma
✅ **Progress Indicator**: Görsel ilerleme takibi
✅ **Dinamik System Prompt**: Otomatik prompt birleştirme
✅ **Responsive Tasarım**: Tüm ekran boyutlarında çalışır
✅ **Validasyon**: Zorunlu alan kontrolü
✅ **Özel İstekler**: Son eklenen özelleştirme alanı
✅ **Kategori Bazlı Renkler**: Her kategori için özel renk paleti
✅ **Emoji Seçimi**: 32 farklı emoji seçeneği

### Gelecek İyileştirmeler

🔜 **Önizleme Sayfası**: Koç oluşturmadan önce önizleme
🔜 **Şablonlar**: Popüler koç şablonları
🔜 **AI Önerileri**: System prompt için AI önerileri
🔜 **Çoklu Dil Desteği**: İngilizce, Türkçe, vs.
🔜 **Ses Önizleme**: Koçun konuşma tarzını dinleme
🔜 **Test Sohbet**: Koçu test etme imkanı
🔜 **Marketplace Entegrasyonu**: Oluşturulan koçları marketplace'te paylaşma

---

## 📝 Kullanım Örnekleri

### Örnek 1: Kariyer Koçu

**Adım 2**: "Kariyer Mentoru"
**Adım 3**: "Kariyer hedeflerinizde size rehberlik eder, özgeçmiş hazırlamada yardımcı olur"
**Adım 4**: Kariyer (💼)
**Adım 5**: 💼
**Adım 6**: "Yeni bir işe geçiş yapmak istiyorum, maaş görüşmelerinde destek istiyorum"
**Adım 7**: Profesyonel
**Adım 8**: Orta
**Adım 9**: "Sen bir kariyer danışmansın. Kullanıcıların kariyer hedeflerine ulaşmasına yardımcı ol..."
**Adım 10**: 
- Kişilik: Analitik
- Uzmanlık: Uzman
- Yaş: 30-40
- Cinsiyet: Neutral
- Geçmiş: "15 yıl HR deneyimi, kariyer koçluğu sertifikası"
- Özel İstekler: "Haftalık kariyer hedefi takibi yapsın, mülakat hazırlığında detaylı rehberlik versin"

### Örnek 2: Fitness Koçu

**Adım 2**: "Kişisel Fitness Antrenörü"
**Adım 3**: "Fitness hedeflerinize ulaşmanızda size rehberlik eder, antrenman ve beslenme planları sunar"
**Adım 4**: Spor & Fitness (💪)
**Adım 5**: 💪
**Adım 6**: "Kilo vermek ve kas kütlesi kazanmak istiyorum"
**Adım 7**: Motivasyonel
**Adım 8**: Yoğun
**Adım 9**: "Sen bir fitness koçusun. Kullanıcıların fiziksel hedeflerine ulaşmasına yardımcı ol..."
**Adım 10**: 
- Kişilik: Enerjik
- Uzmanlık: Orta
- Yaş: 20-30
- Cinsiyet: Erkek
- Geçmiş: "5 yıl kişisel antrenörlük deneyimi, beslenme uzmanı sertifikası"
- Özel İstekler: "Günlük antrenman hatırlatmaları yapsın, haftalık ilerleme raporu versin, motivasyonel mesajlar göndersin"

---

## 🔍 Sorun Giderme

### Yaygın Sorunlar

#### 1. Koç Oluşturulamıyor

**Sebep**: Zorunlu alanlar boş

**Çözüm**: 
- Koç adı, açıklama ve system prompt alanlarının dolu olduğundan emin olun
- Hata mesajı gösterilir: "Lütfen tüm alanları doldurun"

#### 2. System Prompt Çok Uzun

**Sebep**: Çok fazla bilgi eklendi

**Çözüm**: 
- System prompt maksimum uzunluğu kontrol edin
- Gerekirse bilgileri özetleyin

#### 3. Kategori Seçimi Çalışmıyor

**Sebep**: State güncellenmemiş

**Çözüm**: 
- `setState()` çağrısının yapıldığından emin olun
- Kategori seçildiğinde ikon da otomatik güncellenir

---

## 📚 İlgili Dosyalar

### Ana Dosyalar

- `lib/screens/create_coach_onboarding_screen.dart` - Ana onboarding ekranı
- `lib/models/coach.dart` - Koç modeli
- `lib/services/coach_service.dart` - Koç servisi

### İlgili Ekranlar

- `lib/screens/coach_list_screen.dart` - Koç listesi (onboarding sonrası)
- `lib/screens/coach_market_screen.dart` - Koç marketplace

---

## 🎓 Öğrenme Notları

### Best Practices

1. **Validasyon**: Zorunlu alanları baştan kontrol edin
2. **Kullanıcı Geri Bildirimi**: Her adımda net talimatlar verin
3. **İlerleme Göstergesi**: Kullanıcı nerede olduğunu her zaman görebilmeli
4. **Varsayılan Değerler**: Kullanıcı deneyimini hızlandırır
5. **Özel İstekler**: Kullanıcıların ek özelleştirme yapmasına izin verin

### Dikkat Edilmesi Gerekenler

- System prompt'un son satırı kullanıcının girdiği prompt olmalı
- Özel istekler alanı opsiyonel olmalı
- Kategori seçildiğinde ikon otomatik güncellenmeli
- Tüm TextEditingController'lar dispose edilmeli
- Navigator.pop() sonucu kontrol edilmeli

---

**Son Güncelleme**: 2024
**Versiyon**: 1.0.0
**Dosya**: `create_coach_onboarding_screen.dart`

