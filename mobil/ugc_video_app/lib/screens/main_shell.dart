import 'package:flutter/material.dart';

import 'create_screen.dart';
import 'dashboard_screen.dart';
import 'library_screen.dart';
import 'profile_screen.dart';
import 'characters_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      const DashboardScreen(),
      CharactersScreen(
        onBackToHome: () => setState(() => _currentIndex = 0),
      ),
      CreateScreen(
        onBackToHome: () => setState(() => _currentIndex = 0),
      ),
      LibraryScreen(
        onBackToHome: () => setState(() => _currentIndex = 0),
      ),
      const ProfileScreen(),
    ];
  }

  late final List<NavigationDestination> _destinations = const [
    NavigationDestination(
      icon: Icon(Icons.home_outlined),
      selectedIcon: Icon(Icons.home),
      label: 'Ana Sayfa',
    ),
    NavigationDestination(
      icon: Icon(Icons.psychology_alt_outlined),
      selectedIcon: Icon(Icons.psychology_alt),
      label: 'Karakterler',
    ),
    NavigationDestination(
      icon: Icon(Icons.add_circle_outline),
      selectedIcon: Icon(Icons.add_circle),
      label: 'Oluştur',
    ),
    NavigationDestination(
      icon: Icon(Icons.video_library_outlined),
      selectedIcon: Icon(Icons.video_library),
      label: 'Kütüphane',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: 'Profil',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        destinations: _destinations,
      ),
    );
  }
}
