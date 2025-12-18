# 📱 COMMUNITY MODÜLÜ - TÜM SAYFALAR LİSTESİ

## 📋 İÇİNDEKİLER
- [Sayfa Listesi](#sayfa-listesi)
- [Sayfa Detayları](#sayfa-detayları)
- [Route Yapısı](#route-yapısı)
- [Provider Entegrasyonları](#provider-entegrasyonları)

---

## 📄 SAYFA LİSTESİ

### ✅ Mevcut Sayfalar (6 Adet)

| # | Sayfa Adı | Dosya | Durum | Provider |
|---|-----------|-------|-------|----------|
| 1 | **CommunityScreen** | `community_screen.dart` | ✅ Tamamlandı | FeedProvider, CategoryProvider, LeaderboardProvider |
| 2 | **PostDetailScreen** | `post_detail_screen.dart` | ✅ Tamamlandı | PostProvider |
| 3 | **CreatePostScreen** | `create_post_screen.dart` | ✅ Tamamlandı | CategoryProvider, FeedProvider |
| 4 | **CategoryFilterScreen** | `category_filter_screen.dart` | ✅ Mevcut | - |
| 5 | **CommunityGuidelinesScreen** | `community_guidelines_screen.dart` | ✅ Mevcut | - |
| 6 | **ReportPostScreen** | `report_post_screen.dart` | ✅ Mevcut | - |

### ⚠️ Planlanan Sayfalar (2 Adet)

| # | Sayfa Adı | Dosya | Durum | Provider |
|---|-----------|-------|-------|----------|
| 7 | **UserProfileScreen** | `user_profile_screen.dart` | ⚠️ Planlanan | UserProfileProvider |
| 8 | **CategoryFeedScreen** | `category_feed_screen.dart` | ⚠️ Planlanan | FeedProvider |

---

## 📱 SAYFA DETAYLARI

### 1. **CommunityScreen** (`lib/features/community/screens/community_screen.dart`)

**Açıklama:** Ana topluluk feed ekranı - 4 sekme sistemi

**Özellikler:**
- ✅ **4 Sekme:**
  - `Senin İçin` - Kişiselleştirilmiş feed (trending algoritması)
  - `Takip Edilenler` - Takip edilen kullanıcıların gönderileri
  - `Leaderboard` - En aktif topluluk üyeleri sıralaması
  - `Kategoriler` - Kategori bazlı gönderiler grid görünümü

- ✅ **Feed Özellikleri:**
  - Infinite scroll desteği (pagination)
  - Pull-to-refresh
  - Kategori filtreleme
  - Sort seçenekleri (trending, new, top)
  - PostItem widget'ları ile modern kartlar

- ✅ **Leaderboard:**
  - Top 3 premium görünüm (podyum)
  - LeaderboardCard widget'ı ile modern tasarım
  - Altın, Gümüş, Bronz rozetler
  - Puan ve seviye gösterimi

- ✅ **Kategoriler:**
  - Grid görünümü
  - CategoryChip widget'ı ile premium kartlar
  - Gradient arka planlar
  - Üye ve gönderi sayıları

- ✅ **Floating Action Button:**
  - Yeni post oluşturma (`AppRoutes.createPost`)

**Provider'lar:**
- `FeedProvider` - Feed yönetimi, pagination, filtreleme
- `CategoryProvider` - Kategori listesi
- `LeaderboardProvider` - Leaderboard verileri

**Route:** `/community`

---

### 2. **PostDetailScreen** (`lib/features/community/screens/post_detail_screen.dart`)

**Açıklama:** Gönderi detay ve yorumlar ekranı

**Özellikler:**
- ✅ **Post Bilgileri:**
  - Yazar bilgileri (avatar, isim, zaman, verified badge)
  - Kategori badge'i
  - Başlık ve içerik
  - Hashtag gösterimi
  - Featured image desteği

- ✅ **Etkileşim Butonları:**
  - Like butonu (çalışıyor ✅)
  - Comment sayısı
  - Save butonu (çalışıyor ✅)
  - Share butonu

- ✅ **Yorumlar Bölümü:**
  - CommentItem widget'ı ile modern yorumlar
  - Nested replies desteği
  - User level badge'leri
  - Infinite scroll (pagination)
  - Yorum ekleme formu (çalışıyor ✅)

- ✅ **Yorum Input:**
  - Alt kısımda sabit input alanı
  - Gönder butonu
  - Enter ile gönderme

**Provider:**
- `PostProvider` - Post ve yorum yönetimi

**Route:** `/community/post/:id`

---

### 3. **CreatePostScreen** (`lib/features/community/screens/create_post_screen.dart`)

**Açıklama:** Yeni gönderi oluşturma ekranı

**Özellikler:**
- ✅ **Form Alanları:**
  - Kategori seçici (CategoryChip widget'ı) - **Çalışıyor ✅**
  - Başlık input'u (validation)
  - İçerik textarea'sı (validation)
  - Hashtag desteği (otomatik extraction)

- ✅ **Kategoriler:**
  - CategoryProvider'dan dinamik yükleme
  - Üretkenlik, Dil, Finans, Sağlık, Genel

- ✅ **Validasyon:**
  - Başlık zorunlu (min 3 karakter)
  - İçerik zorunlu (min 10 karakter)
  - Kategori seçimi zorunlu

- ✅ **Repository Entegrasyonu:**
  - `CommunityRepository.createPost()` ile post oluşturma
  - FeedProvider refresh
  - Başarı/hata mesajları

**Provider'lar:**
- `CategoryProvider` - Kategori listesi
- `FeedProvider` - Feed refresh

**Route:** `/community/post/create`

---

### 4. **CategoryFilterScreen** (`lib/features/community/screens/category_filter_screen.dart`)

**Açıklama:** Kategori filtreleme ekranı

**Özellikler:**
- ✅ Kategori listesi
- ✅ "Tümü" seçeneği
- ✅ Kategori seçimi
- ✅ Seçim sonrası geri dönüş

**Route:** `/community/category-filter`

**Not:** Bu sayfa şu anda basit bir kategori filtreleme ekranı. İleride Provider entegrasyonu ile güncellenebilir.

---

### 5. **CommunityGuidelinesScreen** (`lib/features/community/screens/community_guidelines_screen.dart`)

**Açıklama:** Topluluk kuralları ekranı

**Özellikler:**
- ✅ 5 Ana Kural:
  1. Saygılı Olun ❤️
  2. Yapıcı İçerik Paylaşın 👍
  3. Gizliliği Koruyun 🔒
  4. Telif Haklarına Saygı Gösterin ©️
  5. Doğru Bilgi Paylaşın ✅

**Route:** `/community/guidelines`

---

### 6. **ReportPostScreen** (`lib/features/community/screens/report_post_screen.dart`)

**Açıklama:** Gönderi bildirme ekranı

**Özellikler:**
- ✅ Bildirim Nedenleri:
  - Spam veya yanıltıcı içerik
  - Nefret söylemi veya ayrımcılık
  - Taciz veya zorbalık
  - Yanlış bilgi
  - Telif hakkı ihlali
  - Diğer

**Route:** `/community/post/report`

---

### 7. **UserProfileScreen** ⚠️ **PLANLANAN**

**Açıklama:** Kullanıcı profil sayfası

**Planlanan Özellikler:**
- ⚠️ Kullanıcı bilgileri (avatar, isim, bio)
- ⚠️ XP seviyesi ve progress bar
- ⚠️ Rozetler ve başarılar
- ⚠️ Kullanıcı gönderileri listesi
- ⚠️ Takip/takipten çıkma butonu
- ⚠️ Followers/Following sayıları
- ⚠️ Kategori bazında istatistikler

**Planlanan Provider:**
- `UserProfileProvider` - Kullanıcı profil yönetimi

**Planlanan Route:** `/community/user/:userId`

---

### 8. **CategoryFeedScreen** ⚠️ **PLANLANAN**

**Açıklama:** Kategori bazlı feed sayfası

**Planlanan Özellikler:**
- ⚠️ Kategori bilgileri ve istatistikleri
- ⚠️ Kategoriye özel post feed'i
- ⚠️ Kategori takip butonu
- ⚠️ Sort seçenekleri

**Planlanan Provider:**
- `FeedProvider` - Kategoriye özel feed

**Planlanan Route:** `/community/category/:categoryId`

---

## 🗺️ ROUTE YAPISI

### Route Tanımları (`lib/app/navigation/route_names.dart`):

```dart
// Ana community route
static const String community = '/community';

// Community alt route'ları
static String postDetail(String id) => '/community/post/$id';
static const String createPost = '/community/post/create';
static const String categoryFilter = '/community/category-filter';
static const String reportPost = '/community/post/report';
static const String communityGuidelines = '/community/guidelines';

// Planlanan route'lar:
static String userProfile(String userId) => '/community/user/$userId';
static String categoryFeed(String categoryId) => '/community/category/$categoryId';
```

### GoRouter Entegrasyonu (`lib/app/navigation/go_router.dart`):

```dart
// Community Tab - StatefulShellBranch
StatefulShellBranch(
  routes: [
    GoRoute(
      path: AppRoutes.community,
      builder: (context, state) => MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => FeedProvider()),
          ChangeNotifierProvider(create: (_) => CategoryProvider()),
          ChangeNotifierProvider(create: (_) => LeaderboardProvider()),
        ],
        child: const CommunityScreen(),
      ),
    ),
    GoRoute(
      path: '/community/post/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return ChangeNotifierProvider(
          create: (_) => PostProvider()..loadPost(id),
          child: PostDetailScreen(postId: id),
        );
      },
    ),
    GoRoute(
      path: AppRoutes.createPost,
      builder: (context, state) => MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => CategoryProvider()),
          ChangeNotifierProvider(create: (_) => FeedProvider()),
        ],
        child: const CreatePostScreen(),
      ),
    ),
    // Diğer route'lar...
  ],
),
```

---

## 🎛️ PROVIDER ENTEGRASYONLARI

### CommunityScreen Provider'ları:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => FeedProvider()),
    ChangeNotifierProvider(create: (_) => CategoryProvider()),
    ChangeNotifierProvider(create: (_) => LeaderboardProvider()),
  ],
  child: const CommunityScreen(),
)
```

### PostDetailScreen Provider'ı:

```dart
ChangeNotifierProvider(
  create: (_) => PostProvider()..loadPost(postId),
  child: PostDetailScreen(postId: postId),
)
```

### CreatePostScreen Provider'ları:

```dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => CategoryProvider()),
    ChangeNotifierProvider(create: (_) => FeedProvider()),
  ],
  child: const CreatePostScreen(),
)
```

---

## ✅ ÇALIŞAN ÖZELLİKLER

### CommunityScreen:
- ✅ Feed görüntüleme (infinite scroll)
- ✅ Pull-to-refresh
- ✅ Kategori filtreleme
- ✅ Leaderboard görüntüleme
- ✅ Kategori listesi
- ✅ Post like/save (PostItem widget'tan)
- ✅ FAB ile yeni post oluşturma

### PostDetailScreen:
- ✅ Post detay görüntüleme
- ✅ Yorumları görüntüleme (infinite scroll)
- ✅ Yorum ekleme
- ✅ Post like/save
- ✅ Yorum like
- ✅ Hashtag gösterimi

### CreatePostScreen:
- ✅ Kategori seçimi (dinamik)
- ✅ Başlık ve içerik yazma
- ✅ Hashtag extraction
- ✅ Form validation
- ✅ Post oluşturma (Repository ile)
- ✅ Feed refresh

---

## 📊 İSTATİSTİKLER

| Metrik | Değer |
|--------|-------|
| **Toplam Sayfa** | 6 (mevcut) + 2 (planlanan) = 8 |
| **Tamamlanan Sayfa** | 6 |
| **Provider Entegre Sayfa** | 3 (CommunityScreen, PostDetailScreen, CreatePostScreen) |
| **Çalışan Özellikler** | Like, Save, Yorum Ekleme, Post Oluşturma |
| **Route Sayısı** | 6 (mevcut) + 2 (planlanan) = 8 |

---

## 🔜 SONRAKİ ADIMLAR

### Öncelik 1: Planlanan Sayfalar
1. ⚠️ UserProfileScreen oluştur
2. ⚠️ CategoryFeedScreen oluştur
3. ⚠️ Route'ları güncelle

### Öncelik 2: Mevcut Sayfaları İyileştir
1. ⚠️ CategoryFilterScreen'i Provider ile entegre et
2. ⚠️ ReportPostScreen'i Repository ile entegre et
3. ⚠️ CommunityGuidelinesScreen'i güncelle

### Öncelik 3: Yeni Özellikler
1. ⚠️ Post düzenleme/silme
2. ⚠️ Yorum düzenleme/silme
3. ⚠️ Kullanıcı takip sistemi
4. ⚠️ Bildirim sistemi entegrasyonu

---

**Son Güncelleme:** Community modülü sayfaları %75 tamamlandı. Ana sayfalar çalışıyor, like/save/comment özellikleri aktif.

**Durum:** 🟩 **Production Ready (Mock Data ile)** - Ana özellikler çalışıyor.

