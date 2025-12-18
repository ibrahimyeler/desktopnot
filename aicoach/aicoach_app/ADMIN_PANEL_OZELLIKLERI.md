# Gofocus - Admin/Executive Panel Özellikleri

## 📋 Genel Bakış

Gofocus uygulamasının **Ana Sayfa (Home Screen)**, CEO benzeri bir yönetim paneli görevi görür. Kullanıcıların tüm kritik bilgileri tek bir ekranda görüntülemesine, hızlı erişim sağlamasına ve günlük aktivitelerini yönetmesine olanak tanır.

---

## 🎯 Ana Özellikler

### 1. **Home Header Section** (Ana Sayfa Üst Bar)
**Konum:** Ana Sayfa - En üst  
**Dosya:** `lib/widgets/home_header_section.dart`

#### Özellikler:
- **Hoş Geldin Mesajı**: Kullanıcı adı ile kişiselleştirilmiş hoş geldin mesajı
- **Bildirim İkonu**: Notifications Screen'e yönlendirme
- **Profil Avatarı**: Profile Screen'e yönlendirme
- **Animasyonlu Giriş**: Fade-in ve slide-up animasyonu

#### Teknik Detaylar:
- SharedPreferences'den kullanıcı adı okuma
- TweenAnimationBuilder ile smooth animasyon
- Gradient avatar border (Turuncu)
- Circle avatar ve icon gösterimi

---

### 2. **Executive Overview Section** (Yönetici Özet Bölümü)
**Konum:** Ana Sayfa - Üst bölüm  
**Dosya:** `lib/widgets/executive_overview_section.dart`

#### Özellikler:
- **4 Mini Metrik Kartı** (2x2 grid layout)
  - **Günlük Hedefler**: Aktif hedef sayısı gösterimi
  - **Tamamlanan Hedefler**: Bugün tamamlanan hedefler
  - **Günlük Odak Süresi**: Toplam odaklanma süresi (saat)
  - **Son Konuşma**: Son koç sohbetinden bu yana geçen süre

#### Teknik Detaylar:
- Her kart renk kodlu (Turuncu, Yeşil, Mavi, Turuncu)
- Icon + Değer + Trend Label yapısı
- Responsive grid layout
- Dark theme uyumlu tasarım

---

### 3. **Executive Assistant Card** (Yönetici Asistan Kartı)
**Konum:** Ana Sayfa - Executive Overview altında  
**Dosya:** `lib/widgets/executive_assistant_card.dart`

#### Özellikler:
- **AI Koç Hızlı Erişim**: Lina (Odak ve Planlama Koçu) ile direkt sohbet başlatma
- **Gradient Arka Plan**: Modern görsel tasarım
- **Hızlı Aksiyon Butonu**: Tek tıkla koç sohbet ekranına geçiş
- **Dinamik Mesaj**: Güncel motivasyon mesajı gösterimi

#### İşlevsellik:
- Koç listesinden otomatik "Lina" koçu bulma
- Eğer koç yoksa default koç oluşturma
- MultiProvider ile state yönetimi
- Loading state yönetimi

---

### 4. **Executive Agenda Section** (Yönetici Ajanda Bölümü)
**Konum:** Ana Sayfa - Executive Assistant altında  
**Dosya:** `lib/widgets/executive_agenda_section.dart`

#### Özellikler:
- **Bugünün Görevleri**: Mini to-do list (3 görev önizlemesi)
- **Checkbox ile Tamamlama**: Görevleri işaretleme
- **Dinamik Güncelleme**: State management ile gerçek zamanlı güncelleme
- **Tüm Hedeflere Git**: Goals Screen'e yönlendirme butonu

#### Teknik Detaylar:
- StatefulWidget ile interaktif görev yönetimi
- TodoItem modeli ile veri yapısı
- Checkbox animasyonları
- Completed görevler için strikethrough efekti

---

### 5. **Executive Pages Section** (Yönetici Sayfaları Bölümü)
**Konum:** Ana Sayfa - Executive Agenda altında  
**Dosya:** `lib/widgets/executive_pages_section.dart`

#### Özellikler:
- **4 Hızlı Erişim Kartı** (Wrap layout)
  - **Performans**: Analytics Report Screen'e yönlendirme
  - **Koçlar**: Coach List Screen'e yönlendirme
  - **Hedefler**: Goals Screen'e yönlendirme
  - **Geçmiş**: Notifications Screen'e yönlendirme

#### Kart Yapısı:
- Renkli icon container (Turuncu, Mavi, Yeşil, Turuncu)
- Başlık ve alt başlık
- "Detaya Git" aksiyon butonu
- Hover efektleri ve smooth navigasyon

---

### 6. **Analytics Report Screen** (Detaylı Rapor Ekranı)
**Konum:** Performans kartından erişilir  
**Dosya:** `lib/screens/analytics_report_screen.dart`

#### Özellikler:

##### A. **Period Filter** (Zaman Filtresi)
- Günlük, Haftalık, Aylık, Yıllık seçenekleri
- PopupMenu ile dropdown seçim
- Dinamik veri filtreleme

##### B. **Tab Navigation** (3 Sekme)
1. **Genel Tab**
   - 4 Overview Card: Toplam Sohbet, Aktif Koçlar, Tamamlanan Hedef, Aktif Süre
   - Haftalık Aktivite Chart: Bar chart görselleştirme
   - Etkileşim İstatistikleri:
     - Günlük Ortalama (sohbet sayısı)
     - En Aktif Gün
     - Ortalama Yanıt Süresi

2. **Koçlar Tab**
   - **Koç Performansı Kartları**:
     - Yatırım Koçu (%85 etkileşim)
     - Fitness Koçu (%72 etkileşim)
     - Yazılım Koçu (%68 etkileşim)
   - Her koç için:
     - Sohbet sayısı
     - Etkileşim yüzdesi
     - Progress bar görselleştirme
   - **Detaylı Metrikler**:
     - En Çok Sorulan
     - En İyi Yanıt
     - En Hızlı Yanıt

3. **Hedefler Tab**
   - **Hedef İlerlemesi Kartları**:
     - Finansal Hedef (%75)
     - Fitness Hedef (%60)
     - Yazılım Hedef (%85)
   - Her hedef için progress bar
   - **Başarı İstatistikleri**:
     - Tamamlanan Hedef sayısı
     - Devam Eden hedef sayısı
     - Ortalama Tamamlanma yüzdesi

---

### 7. **Quick Access Section** (Hızlı Erişim Bölümü)
**Konum:** Ana Sayfa - Executive Pages altında  
**Dosya:** `lib/widgets/quick_access_section.dart`

#### Özellikler:
- **4 Hızlı Erişim Butonu** (2x2 grid layout)
  - **Hedeflerim**: Goals Screen'e yönlendirme (Turuncu)
  - **Koçla Sohbet**: Coach List Screen'e yönlendirme (Mor)
  - **Profil**: Profile Screen'e yönlendirme (Yeşil)
  - **Notlar**: Notlar ekranına yönlendirme (Turuncu - gelecekte eklenecek)

#### Kart Yapısı:
- Renkli icon container
- Başlık ve alt başlık
- InkWell ile dokunma efekti
- Direct navigasyon

---

### 8. **Featured Coaches Section** (Öne Çıkan Koçlar Bölümü)
**Konum:** Ana Sayfa - Quick Access altında  
**Dosya:** `lib/widgets/featured_coaches_section.dart`

#### Özellikler:
- Öne çıkan koçların gösterimi
- Koç kartları ile görsel tanıtım
- Koç detay sayfasına yönlendirme

---

### 9. **Recent Activity Section** (Son Aktiviteler Bölümü)
**Konum:** Ana Sayfa - Alt bölüm  
**Dosya:** `lib/widgets/recent_activity_section.dart`

#### Özellikler:
- **Son 3 Aktivite Gösterimi**:
  - Lina ile sohbet (2 saat önce) - Mor icon
  - Hedef tamamlandı (5 saat önce) - Yeşil icon
  - Yeni görev eklendi (1 gün önce) - Turuncu icon
- Zaman damgalı aktivite listesi
- Aktivite türlerine göre renkli icon gösterimi
- Divider ile aktiviteler arası ayrım
- Arrow icon ile görsel feedback

#### Teknik Detaylar:
- StatelessWidget yapısı
- Container içinde card layout
- Icon + Title + Subtitle yapısı
- Responsive tasarım

---

## 🎨 Tasarım Sistemi

### Renk Paleti:
- **Arka Plan**: `#111827` (Koyu gri-siyah)
- **Kart Arka Plan**: `#1F2937` (Orta koyu gri)
- **Border**: `#374151` (Açık gri)
- **Accent Renkler**:
  - Turuncu: `#FFB800`
  - Yeşil: `#10B981`
  - Mavi: `#3B82F6`
  - Mor: `#6366F1`

### Tipografi:
- **Başlıklar**: Bold, 16-20px
- **Değerler**: Bold, 18-24px
- **Label'lar**: Medium, 10-13px
- **Açıklamalar**: Regular, 11-13px

### Spacing:
- Kartlar arası: 12-24px
- İç padding: 16-24px
- Border radius: 12-18px

---

## 📊 Veri Akışı

### Veri Kaynakları:
1. **SharedPreferences**: Yerel veri saklama
2. **CoachService**: Koç verileri yönetimi
3. **ChatService**: Sohbet geçmişi
4. **Mock Data**: Geliştirme aşamasında test verileri

### State Management:
- **StatefulWidget**: Lokal state yönetimi
- **Provider**: Global state yönetimi (koçlar, sohbetler)
- **SharedPreferences**: Kalıcı veri saklama

---

## 🔧 Teknik Detaylar

### Widget Yapısı:
```
HomeScreen
├── HomeHeaderSection (Üst bar)
├── ExecutiveOverviewSection (4 metrik kartı)
├── ExecutiveAssistantCard (Lina koç kartı)
├── ExecutiveAgendaSection (To-do list)
├── ExecutivePagesSection (Hızlı erişim kartları)
├── QuickAccessSection (Kısayollar)
├── FeaturedCoachesSection (Öne çıkan koçlar)
└── RecentActivitySection (Son aktiviteler)
```

### Navigasyon Akışı:
1. **Executive Pages** → İlgili detay ekranlarına yönlendirme
2. **Executive Assistant** → Coach Chat Screen'e yönlendirme
3. **Executive Agenda** → Goals Screen'e yönlendirme

---

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler:
1. **Gerçek Zamanlı Veri**: API entegrasyonu ile canlı veri
2. **Filtreleme ve Sıralama**: Metrik kartlarında filtreleme
3. **Özelleştirme**: Kullanıcı kartlarını yeniden düzenleyebilme
4. **Widget Ekleme/Çıkarma**: İstenmeyen kartları gizleme
5. **Dark/Light Theme Toggle**: Tema değiştirme
6. **Export Özellikleri**: Raporları PDF/Excel olarak dışa aktarma
7. **Grafik İyileştirmeleri**: Daha interaktif chart'lar
8. **Bildirimler**: Önemli metrikler için push notification

---

## 📱 Responsive Tasarım

- **Mobile First**: Öncelik mobil cihazlar için
- **Tablet Uyumu**: Büyük ekranlarda daha geniş layout
- **Adaptive Grid**: Ekran boyutuna göre otomatik düzenleme

---

## 🔐 Güvenlik ve İzinler

- **Admin Yetkileri**: (Gelecekte eklenecek)
  - Kullanıcı yönetimi
  - Sistem ayarları
  - Rapor görüntüleme
  - Veri export

---

## 📝 Notlar

- Mevcut yapı "Executive Panel" olarak adlandırılmış ancak gerçek bir admin paneli değil
- Tüm kullanıcılar için aynı executive panel görünümü mevcut
- `is_admin` field'ı login service'de mevcut ancak henüz kullanılmıyor
- Gelecekte admin/standart kullanıcı ayrımı yapılabilir

