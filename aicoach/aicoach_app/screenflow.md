🚀 GOFOCUS – MOBİL UYGULAMA TAM EKRAN AKIŞI (APP FLOW MAP)
🧨 1) Uygulama Başlangıç Akışı
Splash Screen
    ↓
Token kontrolü
    ↓ (giriş yapılmışsa)
Main Tabs (Home)
    ↓ (giriş yapılmamışsa)
Auth Flow → Login Screen

🔐 2) Authentication Akışı
Splash
 ├── Login Screen
 │      ├── Email/Password Login
 │      ├── Google Login
 │      ├── Apple Login (iOS)
 │      └── → Register Screen
 │
 ├── Register Screen
 │      ├── Email/Password/Name
 │      ├── Google / Apple
 │      └── → Success → Login Screen
 │
 ├── Forgot Password Screen
 │      ├── Email gir
 │      ├── Doğrulama kodu
 │      ├── Yeni şifre
 │      └── → Login Screen
 │
 └── Terms & Privacy Screen (Footer link)

🏠 3) Ana Navigasyon (Main Tabs)

Aşağıdaki 5 sekme ana navigasyonu oluşturur:

Bottom Navigation:
    1. Home (CEO Dashboard)
    2. Coaches
    3. Methods (Metot Book)
    4. Community
    5. Profile

🧭 4) Home – CEO Dashboard Akışı
Home Screen
  ├── CEO Voice Coach Panel (Sesli Ana Koç)
  │       ├── Microphone mode (STT)
  │       ├── Voice Replay (TTS)
  │       └── Full-screen conversation
  │
  ├── Daily Overview Section
  │       ├── Bugünün 6 işi (özet)
  │       ├── İngilizce Koçu görevi
  │       ├── Zincir kırma durumu
  │       └── Ajanda kartı → Go to Agenda Detail
  │
  ├── Quick Actions
  │       ├── Yeni görev ekle
  │       ├── Not ekle
  │       ├── Pomodoro başlat
  │       ├── İngilizce pratik başlat
  │       └── Plan oluştur
  │
  ├── Featured Coaches
  │       ├── Odak & Planlama Koçu
  │       └── İngilizce Koçu → Coach Detail
  │
  └── Recent Activity
          ├── Son chatler
          ├── Son görevler
          └── Son hedefler

🎯 5) Koçlar (Coaches) Sekmesi Akışı
Coaches Screen
  ├── Coach Card: Odak & Planlama
  │       └── → Coach Detail Screen
  │             ├── Overview Tab
  │             ├── Goals Tab
  │             ├── Tasks Tab
  │             ├── Notes Tab
  │             └── Chat (AI Coach)
  │
  └── Coach Card: İngilizce Koçu
          └── → Coach Detail Screen
                ├── Overview
                ├── Exercises
                ├── Progress
                └── Chat (AI Coach)

🧠 6) Metot Sistemi (Methods) Akışı

Bu sekme, admin panelde tanımlanan tüm metotları kullanıcıya gösterir.

Methods Screen
   ├── Featured Methods
   │       ├── 6 İş Metodu
   │       ├── Zincir Kırma
   │       ├── Pomodoro
   │       └── Zaman Bloklama
   │
   ├── Method Categories
   │       ├── Üretkenlik
   │       ├── Dil
   │       ├── Alışkanlık
   │       └── Planlama
   │
   └── Method Detail Screen (Ör: 6 İş Metodu)
            ├── Metot açıklaması
            ├── AI rehberi
            ├── Günlük görev alanı
            ├── Metot adım ekranı
            └── “Koça başlat” → AI Metot Chat Mode

Metot Chat Mode Akışı
AI Metot Mode
   ├── Kullanıcıya özel sorular
   ├── Günlük görev formu
   ├── Koçun yönlendirmesi
   ├── Takvim entegrasyonu
   ├── Günlük değerlendirme
   └── Metot özet raporu

💬 7) AI Chat Akışı (Tüm Koçlar İçin)
Coach Chat Screen
  ├── Chat listesi (AI + user)
  ├── Markdown / emoji desteği
  ├── Sesle mesaj gönder
  ├── Sesli yanıt (TTS)
  ├── Metot tanıma (ör: “6 iş metodunu başlat”)
  ├── Konuşma geçmişi
  └── Koç ayarları (model, tone)

📝 8) Görev Yönetimi Akışı (Tasks)
Tasks Module
  ├── Task List
  │       ├── Bugünün görevleri
  │       ├── Tamamlanan görevler
  │       └── Görev filtreleri
  │
  ├── Task Detail
  │       ├── Görev açıklaması
  │       ├── Önem seviyesi
  │       ├── Metot bağlantısı (Kritik iş / Yan iş / Az önemli)
  │       └── AI Önerileri
  │
  └── Create Task Screen
          ├── Görev adı
          ├── Kategori
          ├── Tarih / saat
          ├── Metot entegrasyonu
          └── Kaydet

📒 9) Notlar (Notes) Akışı
Notes Screen
  ├── Note List
  ├── AI’dan alınan notlar
  ├── Sesli not
  └── Note Detail
          ├── Edit note
          ├── AI özetleme
          └── Notu PDF olarak dışa aktar

🎯 10) Hedef Yönetimi (Goals)
Goals Screen
   ├── Active Goals
   ├── Completed Goals
   ├── Progress Circle
   ├── Goal Detail
   │        ├── Alt görevler
   │        ├── AI hedef kırılımı
   │        ├── Zaman çizelgesi
   │        └── Hedef raporu
   │
   └── New Goal Screen
           ├── Hedef adı
           ├── Koç ilişkisi
           ├── Zaman çizelgesi
           ├── Motivasyon alanı
           └── Kaydet

🌍 11) Topluluk (Community) Akışı
Community Screen
   ├── Categories Tabs
   │        ├── Üretkenlik
   │        ├── Dil
   │        ├── Finans
   │        ├── Sağlık
   │        └── Genel
   │
   ├── Feed
   │        ├── Popüler gönderiler
   │        ├── Yeni gönderiler
   │        └── Beğeni / yorum
   │
   ├── Post Detail
   │        ├── Yorumlar
   │        ├── AI özet (premium)
   │        └── Şikayet et
   │
   └── Create Post
           ├── Metin
           ├── Resim (opsiyonel)
           ├── Kategori
           └── Gönder

👤 12) Profil Akışı
Profile Screen
   ├── Kullanıcı bilgileri
   ├── Premium durumu
   ├── Kullanıcı istatistikleri
   │        ├── Görev tamamlama oranı
   │        ├── İngilizce pratik süresi
   │        ├── Zincir kırma grafiği
   │        └── Pomodoro istatistikleri
   │
   ├── Settings
   │        ├── Tema (Light/Dark/System)
   │        ├── Dil (TR/EN)
   │        ├── Bildirim ayarları
   │        ├── AI model ayarları
   │        ├── Koç ayarları
   │        └── Hesap yönetimi
   │
   ├── Goals Shortcut
   ├── Tasks Shortcut
   ├── Notes Shortcut
   └── Logout

🔉 13) Sesli Koç Akışı (Voice Mode)
Voice Mode Panel
   ├── Mikrofon açık
   ├── Ses kaydı animasyonu
   ├── Koçun sesli yanıtı
   ├── Transcript görüntüleme
   ├── Mod seçici:
   │        ├── Normal Sohbet
   │        ├── Planlama Modu
   │        ├── İngilizce Pratik
   │        └── Motivasyon Modu
   │
   ├── Ana Koç → diğer koçları tetikler
   └── Hands-Free Mode

💳 14) Abonelik (PRO) Akışı
Premium Screen
  ├── Plan karşılaştırma
  ├── Sesli koç kilidi
  ├── Sınırsız AI kullanım
  ├── Premium İngilizce içerik
  ├── Metot Premium kilidi
  ├── Satın alma (IAP)
  └── Purchase Success

🧩 15) Onboarding Akışı (Kullanıcı İlk Kurulum)
Onboarding Slides (3–5 ekran)
   ├── Uygulama tanıtımı
   ├── Koçların tanıtımı
   ├── Sesli koç özelliği
   ├── Planlama metodları
   └── Başla

→ Login veya Register

📌 16) Teknik / Gizli Ekranlar
Debug Menu (Sadece developer)
   ├── Token reset
   ├── Cache temizleme
   ├── AI provider test
   └── Local DB inspector

🎯 ÖZET – Gofocus Mobil Uygulamanın Tam Ekran Hiyerarşisi

Aşağıdaki gibi okunabilir:

Splash
Auth Flow
Main Tabs
    ├── Home (CEO)
    ├── Coaches
    ├── Methods
    ├── Community
    └── Profile
Coach Detail
Coach Chat
Method Detail
Goal Detail
Task Detail
Note Detail
Premium
Voice Mode
Settings