# Ana Sayfa (Home Page) Dokümantasyonu

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mimari Yapı](#mimari-yapı)
3. [Dosya Yapısı](#dosya-yapısı)
4. [Bileşenler](#bileşenler)
5. [State Management](#state-management)
6. [Widget Detayları](#widget-detayları)
7. [Kullanım Örnekleri](#kullanım-örnekleri)
8. [Geliştirme Notları](#geliştirme-notları)

---

## 🎯 Genel Bakış

Ana sayfa (`HomePage`), uygulamanın kullanıcıya ilk açıldığında gösterilen ana ekrandır. Bu sayfa, kullanıcıya günlük menüyü, sipariş son tarihini ve hızlı erişim butonlarını sunar.

### Temel Özellikler

- ✅ Günlük menü listesi gösterimi
- ✅ Sipariş için geri sayım zamanlayıcısı
- ✅ Hızlı erişim butonları (Cüzdan, Sipariş, Abonelik)
- ✅ Pull-to-refresh (aşağı çekerek yenileme) desteği
- ✅ Loading ve error state yönetimi
- ✅ Provider pattern ile state management

---

## 🏗️ Mimari Yapı

Ana sayfa, **MVVM (Model-View-ViewModel)** mimarisini kullanır:

```
HomePage (View)
    ↓
HomeViewModel (ViewModel)
    ↓
HomeState (Model)
```

### Mimari Katmanları

1. **View Layer** (`home_page.dart`)
   - UI bileşenlerini içerir
   - Kullanıcı etkileşimlerini yönetir
   - ViewModel'den state'i dinler

2. **ViewModel Layer** (`home_view_model.dart`)
   - İş mantığını yönetir
   - State'i günceller
   - API çağrılarını koordine eder

3. **State Layer** (`home_state.dart`)
   - Uygulama durumunu tutar
   - Immutable state pattern kullanır

---

## 📁 Dosya Yapısı

```
lib/features/home/
├── home_page.dart              # Ana sayfa widget'ı
├── home_view_model.dart        # ViewModel (iş mantığı)
├── home_state.dart             # State modeli
└── widgets/
    ├── home_header.dart        # Üst başlık widget'ı
    ├── daily_menu_card.dart    # Menü öğesi kartı
    ├── countdown_timer.dart    # Geri sayım zamanlayıcısı
    └── quick_actions.dart      # Hızlı erişim butonları
```

---

## 🧩 Bileşenler

### 1. HomePage

Ana sayfa widget'ı. Tüm alt bileşenleri bir araya getirir.

**Konum:** `lib/features/home/home_page.dart`

**Özellikler:**
- `ChangeNotifierProvider` ile ViewModel'i sağlar
- `Consumer` ile state değişikliklerini dinler
- Loading, error ve success state'lerini yönetir
- Pull-to-refresh özelliği sunar

**State Yönetimi:**
```dart
// Loading State
if (state.isLoading) {
  return const Center(child: CircularProgressIndicator());
}

// Error State
if (state.error != null) {
  return Center(/* Error UI */);
}

// Success State
return RefreshIndicator(/* Content */);
```

### 2. HomeViewModel

İş mantığını yöneten ViewModel sınıfı.

**Konum:** `lib/features/home/home_view_model.dart`

**Metodlar:**

#### `loadDailyMenu()`
Günlük menüyü yükler.

```dart
void loadDailyMenu() {
  _state = _state.copyWith(isLoading: true, error: null);
  notifyListeners();
  
  // API çağrısı simülasyonu
  Future.delayed(const Duration(seconds: 1), () {
    _state = _state.copyWith(
      isLoading: false,
      menuDate: DateTime.now(),
      dailyMenu: [...],
      orderDeadline: DateTime.now().add(const Duration(hours: 2)),
    );
    notifyListeners();
  });
}
```

**İşlev:**
1. Loading state'ini aktif eder
2. API çağrısı yapar (şu an simüle edilmiş)
3. Gelen veriyi state'e kaydeder
4. UI'ı günceller

#### `refresh()`
Sayfayı yeniler.

```dart
void refresh() {
  loadDailyMenu();
}
```

### 3. HomeState

Uygulama durumunu tutan immutable state sınıfı.

**Konum:** `lib/features/home/home_state.dart`

**Özellikler:**

| Özellik | Tip | Açıklama |
|---------|-----|----------|
| `isLoading` | `bool` | Veri yükleniyor mu? |
| `error` | `String?` | Hata mesajı (varsa) |
| `menuDate` | `DateTime?` | Menü tarihi |
| `dailyMenu` | `List<Map>?` | Günlük menü listesi |
| `orderDeadline` | `DateTime?` | Sipariş son tarihi |

**copyWith Metodu:**
State'i immutable şekilde güncellemek için kullanılır.

```dart
HomeState copyWith({
  bool? isLoading,
  String? error,
  DateTime? menuDate,
  List<Map<String, dynamic>>? dailyMenu,
  DateTime? orderDeadline,
}) {
  return HomeState(
    isLoading: isLoading ?? this.isLoading,
    error: error ?? this.error,
    // ...
  );
}
```

---

## 🎨 Widget Detayları

### 1. HomeHeader

Sayfanın üst kısmında gösterilen başlık widget'ı.

**Konum:** `lib/features/home/widgets/home_header.dart`

**Görünüm:**
- Primary renkte arka plan
- Yuvarlatılmış alt köşeler
- "Ana Sayfa" başlığı
- "Hoş geldiniz!" alt başlığı

**Kod Yapısı:**
```dart
Container(
  decoration: BoxDecoration(
    color: AppColors.primary,
    borderRadius: BorderRadius.only(
      bottomLeft: Radius.circular(AppSizes.radiusXL),
      bottomRight: Radius.circular(AppSizes.radiusXL),
    ),
  ),
  child: Column(
    children: [
      Text(AppStrings.homeTitle),  // "Ana Sayfa"
      Text('Hoş geldiniz!'),
    ],
  ),
)
```

### 2. DailyMenuCard

Günlük menü öğelerini gösteren kart widget'ı.

**Konum:** `lib/features/home/widgets/daily_menu_card.dart`

**Props:**
- `menuItem`: `Map<String, dynamic>` - Menü öğesi verisi
  - `id`: String - Öğe ID'si
  - `name`: String - Yemek adı
  - `price`: double - Fiyat
- `onTap`: `VoidCallback?` - Tıklama callback'i

**Görünüm:**
- Material Card widget'ı
- Yemek adı (kalın)
- Fiyat bilgisi (gri)
- Sağda ok ikonu

**Kullanım:**
```dart
DailyMenuCard(
  menuItem: {
    'id': '1',
    'name': 'Yemek 1',
    'price': 25.0,
  },
  onTap: () {
    // Sipariş sayfasına yönlendir
  },
)
```

### 3. CountdownTimer

Sipariş için geri sayım yapan zamanlayıcı widget'ı.

**Konum:** `lib/features/home/widgets/countdown_timer.dart`

**Props:**
- `deadline`: `DateTime` - Son tarih

**Özellikler:**
- Her saniye güncellenir
- Süre dolduğunda kırmızı renk gösterir
- Süre varsa turuncu renk gösterir
- HH:MM:SS formatında gösterim

**State Yönetimi:**
```dart
class _CountdownTimerState extends State<CountdownTimer> {
  Timer? _timer;
  Duration _remaining = Duration.zero;

  @override
  void initState() {
    super.initState();
    _updateTimer();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateTimer();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();  // Memory leak önleme
    super.dispose();
  }
}
```

**Görsel Durumlar:**

| Durum | Renk | İkon | Mesaj |
|-------|------|------|-------|
| Süre var | Turuncu | `access_time` | "Kalan süre: HH:MM:SS" |
| Süre doldu | Kırmızı | `error_outline` | "Süre doldu" |

**Kullanım:**
```dart
CountdownTimer(
  deadline: DateTime.now().add(const Duration(hours: 2)),
)
```

### 4. QuickActions

Hızlı erişim butonları widget'ı.

**Konum:** `lib/features/home/widgets/quick_actions.dart`

**Props:**
- `onWalletTap`: `VoidCallback?` - Cüzdan butonu callback'i
- `onOrderTap`: `VoidCallback?` - Sipariş butonu callback'i
- `onSubscriptionTap`: `VoidCallback?` - Abonelik butonu callback'i

**Butonlar:**
1. **Cüzdan** (`Icons.account_balance_wallet`)
2. **Sipariş** (`Icons.shopping_cart`)
3. **Abonelik** (`Icons.subscriptions`)

**Görünüm:**
- Yatay sıralanmış 3 buton
- Her buton: ikon + etiket
- Primary renkte arka plan (opacity: 0.1)
- Yuvarlatılmış köşeler

**Kullanım:**
```dart
QuickActions(
  onWalletTap: () => Navigator.push(...),
  onOrderTap: () => Navigator.push(...),
  onSubscriptionTap: () => Navigator.push(...),
)
```

---

## 🔄 State Management

Ana sayfa, **Provider** paketi ile state management yapar.

### Provider Kurulumu

```dart
ChangeNotifierProvider(
  create: (_) => HomeViewModel()..loadDailyMenu(),
  child: AppScaffold(...),
)
```

### State Dinleme

```dart
Consumer<HomeViewModel>(
  builder: (context, viewModel, _) {
    final state = viewModel.state;
    // UI'ı state'e göre oluştur
  },
)
```

### State Güncelleme Akışı

```
User Action / API Call
    ↓
HomeViewModel Method
    ↓
State.copyWith()
    ↓
notifyListeners()
    ↓
Consumer Rebuild
    ↓
UI Update
```

---

## 💡 Kullanım Örnekleri

### Örnek 1: Basit Kullanım

```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: HomePage(),
    );
  }
}
```

### Örnek 2: Navigation ile Kullanım

```dart
// Ana sayfadan sipariş sayfasına yönlendirme
DailyMenuCard(
  menuItem: item,
  onTap: () {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OrderPage(),
      ),
    );
  },
)
```

### Örnek 3: Custom Callback'ler

```dart
QuickActions(
  onWalletTap: () {
    Navigator.pushNamed(context, '/wallet');
  },
  onOrderTap: () {
    Navigator.pushNamed(context, '/order');
  },
  onSubscriptionTap: () {
    Navigator.pushNamed(context, '/subscription');
  },
)
```

---

## 🛠️ Geliştirme Notları

### API Entegrasyonu

Şu anda `loadDailyMenu()` metodu simüle edilmiş veri kullanıyor. Gerçek API entegrasyonu için:

```dart
void loadDailyMenu() async {
  _state = _state.copyWith(isLoading: true, error: null);
  notifyListeners();

  try {
    final response = await OrderService.getDailyMenu();
    _state = _state.copyWith(
      isLoading: false,
      dailyMenu: response['menu'],
      orderDeadline: DateTime.parse(response['deadline']),
    );
  } catch (e) {
    _state = _state.copyWith(
      isLoading: false,
      error: e.toString(),
    );
  }
  notifyListeners();
}
```

### Error Handling

Hata durumlarını daha iyi yönetmek için:

```dart
if (state.error != null) {
  return Center(
    child: Column(
      children: [
        Icon(Icons.error_outline, size: 48),
        Text(state.error!),
        ElevatedButton(
          onPressed: () => viewModel.refresh(),
          child: const Text('Yeniden Dene'),
        ),
      ],
    ),
  );
}
```

### Pull-to-Refresh

`RefreshIndicator` widget'ı ile aşağı çekerek yenileme özelliği mevcut:

```dart
RefreshIndicator(
  onRefresh: () async => viewModel.refresh(),
  child: SingleChildScrollView(...),
)
```

### Performance Optimizasyonları

1. **Lazy Loading:** Menü öğeleri gerektiğinde yüklenebilir
2. **Caching:** Menü verisi cache'lenebilir
3. **Debouncing:** API çağrıları debounce edilebilir

### Test Edilmesi Gerekenler

- [ ] Loading state görüntüleniyor mu?
- [ ] Error state doğru gösteriliyor mu?
- [ ] Pull-to-refresh çalışıyor mu?
- [ ] Countdown timer doğru çalışıyor mu?
- [ ] Menü kartları tıklanabilir mi?
- [ ] Quick actions butonları çalışıyor mu?

---

## 📚 İlgili Dosyalar

- **Core Constants:** `lib/core/constants/app_colors.dart`, `app_sizes.dart`, `app_strings.dart`
- **Theme:** `lib/core/theme/app_theme.dart`
- **Utils:** `lib/core/utils/time_utils.dart`
- **Shared Widgets:** `lib/shared/widgets/app_scaffold.dart`
- **Services:** `lib/shared/services/order_service.dart`

---

## 🔗 Bağlantılar

- [Flutter Provider Dokümantasyonu](https://pub.dev/packages/provider)
- [Material Design 3](https://m3.material.io/)
- [Flutter State Management](https://docs.flutter.dev/development/data-and-backend/state-mgmt)

---

**Son Güncelleme:** 2024
**Versiyon:** 1.0.0

