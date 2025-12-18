🚀 GOFOCUS – Flutter Navigation Mimarisi (Profesyonel Seviye)
🔥 1) Genel Navigation Yaklaşımı

Uygulama şu navigation mimarisini kullanmalı:

MaterialApp.router
      └── GoRouter  (modern, scalable)


Neden GoRouter?

Nested navigation çok kolay

Bottom navigation her modülün kendi stack'ine sahip olur

Deep link desteği yerleşik

App restart sonrası doğru ekrana restore eder

Animasyonlu geçişler ayarlanabilir

Eğer istersen Navigator 2.0 + AutoRoute da kullanılabilir.
Ama GoRouter şu anda Flutter’da en stabil çözüm.

📁 2) Navigation Dosya Yapısı
lib/
 ├── app/
 │     ├── navigation/
 │     │       ├── go_router.dart
 │     │       ├── routes.dart
 │     │       ├── route_names.dart
 │     │       └── shell_navigation.dart
 │     │
 │     ├── widgets/
 │     └── app.dart
 │
 ├── features/
 │     ├── auth/
 │     │     └── screens/...
 │     ├── home/
 │     ├── coaches/
 │     ├── methods/
 │     ├── community/
 │     ├── profile/
 │     ├── voice/
 │     ├── tasks/
 │     ├── notes/
 │     └── goals/
 │
 ├── shared/


Modüler bir yapıdır.
Her feature kendi navigation logic’ine sahip olabilir.

🧭 3) Router Yapısı (GoRouter)

Aşağıdaki tüm akışlar routing içinde tanımlanır:

✔ Splash
✔ Auth
✔ Main Shell (Bottom Nav)
✔ Nested Route Stacks
✔ Coach Detail
✔ Chats
✔ Methods
✔ Tasks / Notes / Goals
✔ Voice Mode
🧩 4) ShellRoute (Bottom Navigation Mimarisi)

En kritik kısım burasıdır.

Gofocus'un 5 ana tab’ı:

Home

Coaches

Methods

Community

Profile

Bu yüzden ShellRoute + StatefulShellRoute kullanılmalı:

final router = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),

    // AUTH FLOW
    GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),

    // MAIN SHELL (Bottom Navigation)
    StatefulShellRoute.indexedStack(
      builder: (_, state, navShell) => MainLayout(navShell), 
      branches: [
        // HOME TAB
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
          ],
        ),

        // COACHES TAB
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/coaches', builder: (_, __) => const CoachesScreen()),
            GoRoute(path: '/coach/:id', builder: (_, s) {
              final id = s.pathParameters['id']!;
              return CoachDetailScreen(coachId: id);
            }),
            GoRoute(path: '/coach/:id/chat', builder: (_, s) {
              final id = s.pathParameters['id']!;
              return CoachChatScreen(coachId: id);
            }),
          ],
        ),

        // METHODS TAB
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/methods', builder: (_, __) => const MethodsScreen()),
            GoRoute(path: '/methods/:id', builder: (_, s) {
              final id = s.pathParameters['id']!;
              return MethodDetailScreen(methodId: id);
            }),
          ],
        ),

        // COMMUNITY TAB
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/community', builder: (_, __) => const CommunityScreen()),
            GoRoute(path: '/community/post/:id', builder: (_, s) {
              final id = s.pathParameters['id']!;
              return PostDetailScreen(postId: id);
            }),
          ],
        ),

        // PROFILE TAB
        StatefulShellBranch(
          routes: [
            GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
            GoRoute(path: '/profile/settings', builder: (_, __) => const SettingsScreen()),
            GoRoute(path: '/profile/goals', builder: (_, __) => const GoalsScreen()),
            GoRoute(path: '/profile/tasks', builder: (_, __) => const TasksScreen()),
            GoRoute(path: '/profile/notes', builder: (_, __) => const NotesScreen()),
          ],
        ),
      ],
    ),
  ],
);

🔥 5) Navigation’ın Mantığı Nasıl Çalışıyor?
Shell Route = tüm tab yapısını tutar

MainLayout içinde:

class MainLayout extends StatelessWidget {
  final StatefulNavigationShell navShell;
  const MainLayout(this.navShell);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navShell.currentIndex,
        onTap: (index) => navShell.goBranch(index),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.psychology), label: 'Coaches'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: 'Methods'),
          BottomNavigationBarItem(icon: Icon(Icons.forum), label: 'Community'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

Her tab kendi stack’ini korur

Örnek:

Home → Coach Detail → Chat → Back
→ Home geri gelir

Coach tab'a geç, kendi içinde stack sıfırdan


Bu davranış profesyonel uygulamalarda olması gereken yapıdır.

🔊 6) Voice Mode Navigation

Voice mode genellikle bir modal overlay olarak açılır:

Home Screen
   └── Voice Coach Overlay


Navigation:

GoRoute(
  path: '/voice',
  pageBuilder: (_, __) => CustomTransitionPage(
    child: const VoiceCoachScreen(),
    transitionsBuilder: (_, animation, __, child) =>
        FadeTransition(opacity: animation, child: child),
  ),
)

🧠 7) Deep Link Destekli Navigation

Gofocus gibi bir AI koç uygulamasında deep link mutlaka olmalı.

Örnekler:

Deep Link	Ekran
gofocus://coach/1	Coach detail
gofocus://method/6tasks	6 iş metodu ekranı
gofocus://voice	Sesli koç açılır
gofocus://agenda/today	Bugünün ajandası

GoRouter bunu direkt destekler.

📱 8) Notification Navigation

Örnek bildirim tıklama senaryoları:

Bildirim	Gidilecek Ekran
“Günün 6 iş listesi hazır”	/methods/6-tasks
“Koçun sana mesaj yazdı”	/coach/:id/chat
“Kırmızı gün! Zincir bozulmak üzere”	/methods/chain-break
“Bugünkü İngilizce pratiğini yapmadın”	/coach/english/chat

Notification handler:

FirebaseMessaging.onMessageOpenedApp.listen((message) {
  final route = message.data['route'];
  router.go(route);
});

🗂 9) Route Names Enum (Standartlaştırma)

Çok profesyonel projelerde route’lar sabit string olarak değil, enum/const olarak tanımlanır.

class AppRoutes {
  static const splash = '/splash';
  static const login = '/login';
  static const home = '/home';
  static const coaches = '/coaches';
  static const methods = '/methods';
  static const community = '/community';
  static const profile = '/profile';
}


Bu sayede:

Refactor yapılabilir

Olası hatalar azalır

Kod temiz olur

🧱 10) Navigation Mimarisi Diyagramı
MaterialApp.router
   ↓
GoRouter
   ↓
Splash → Auth Flow
   ↓
Main Shell (BottomNav)
   ├── Home Stack
   │       ├── Home
   │       ├── Voice Mode
   │       └── Agenda Detail
   │
   ├── Coaches Stack
   │       ├── Coach List
   │       ├── Coach Detail
   │       ├── Chat
   │       └── Goals/Tasks/Notes
   │
   ├── Methods Stack
   │       ├── Method List
   │       ├── Method Detail
   │       ├── Metot Chat Flow
   │       └── Reports
   │
   ├── Community Stack
   │       ├── Feed
   │       ├── Post Detail
   │       └── Create Post
   │
   └── Profile Stack
           ├── Profile
           ├── Settings
           ├── Goals
           ├── Tasks
           └── Notes

🧩 11) Kod Parçacıkları – Örnek Kullanım
Navigasyon Yapma
context.go('/coach/1/chat');

Tablar arasında geçiş
navShell.goBranch(2);  // Methods tabına geç

Parametreli route
context.push('/methods/$methodId');

🎯 12) Sonuç – Gofocus İçin En Uygun Navigation Yapısı

Bu mimari:

✔ Performans dostu
✔ Modüler
✔ Büyük uygulamalara uygun
✔ Nested navigation destekli
✔ AI ve koç sistemleriyle tam uyumlu
✔ Test edilmeye çok uygun
✔ Production ready

Bu yapı Spotify, Duolingo, Notion gibi uygulamaların navigation yapısına birebir benzer.