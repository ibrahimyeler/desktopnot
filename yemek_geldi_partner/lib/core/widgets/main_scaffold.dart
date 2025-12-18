import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/orders/presentation/pages/orders_page.dart';
import '../../features/production/presentation/pages/production_page.dart';
import '../../features/delivery/presentation/pages/delivery_page.dart';
import '../../features/profile/presentation/pages/profile_page.dart';

class MainScaffold extends StatefulWidget {
  const MainScaffold({super.key});
  
  @override
  State<MainScaffold> createState() => _MainScaffoldState();
}

class _MainScaffoldState extends State<MainScaffold> {
  int _currentIndex = 0;
  
  final List<Widget> _pages = const [
    DashboardPage(),
    OrdersPage(),
    ProductionPage(),
    DeliveryPage(),
    ProfilePage(),
  ];
  
  final List<String> _titles = const [
    'Dashboard',
    'Siparişler',
    'Üretim',
    'Teslimat',
    'Profil',
  ];
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_currentIndex]),
      ),
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.textSecondary,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.receipt_long),
            label: 'Siparişler',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.kitchen),
            label: 'Üretim',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.local_shipping),
            label: 'Teslimat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}

