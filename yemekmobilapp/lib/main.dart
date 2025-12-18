import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/constants/app_strings.dart';
import 'core/constants/app_colors.dart';
import 'features/home/home_page.dart';
import 'features/wallet/wallet_page.dart';
import 'features/order/order_page.dart';
import 'features/order/order_view_model.dart';
import 'features/orders/orders_page.dart';
import 'features/profile/profile_page.dart';
import 'features/cards/cards_view_model.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => CardsViewModel()),
      ],
      child: MaterialApp(
        title: AppStrings.appName,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light,
        home: const MainNavigationPage(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class MainNavigationPage extends StatefulWidget {
  const MainNavigationPage({super.key});

  @override
  State<MainNavigationPage> createState() => _MainNavigationPageState();
}

class _MainNavigationPageState extends State<MainNavigationPage> {
  int _currentIndex = 0;
  OrderViewModel? _orderViewModel;

  void _goToHome() {
    setState(() {
      _currentIndex = 0;
    });
  }

  void _onOrderViewModelCreated(OrderViewModel viewModel) {
    _orderViewModel = viewModel;
  }

  void _goToOrderPage(List<Map<String, dynamic>> items) {
    if (_orderViewModel != null) {
      _orderViewModel!.addItemsFromHome(items);
    }
    setState(() {
      _currentIndex = 2; // Order page index
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          HomePage(onNavigateToOrder: _goToOrderPage),
          WalletPage(onBack: _goToHome),
          OrderPage(
            onBack: _goToHome,
            onViewModelCreated: _onOrderViewModelCreated,
          ),
          OrdersPage(onBack: _goToHome),
          ProfilePage(onBack: _goToHome),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) {
            setState(() {
              _currentIndex = index;
            });
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppColors.bottomNavBackground,
          selectedItemColor: AppColors.bottomNavSelected,
          unselectedItemColor: AppColors.bottomNavUnselected,
          selectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 12,
          ),
          unselectedLabelStyle: const TextStyle(
            fontWeight: FontWeight.w500,
            fontSize: 12,
          ),
          elevation: 8,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home),
              label: AppStrings.homeTitle,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_balance_wallet),
              label: AppStrings.walletNavTitle,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.shopping_cart),
              label: AppStrings.orderNavTitle,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.receipt_long),
              label: AppStrings.subscriptionNavTitle,
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: AppStrings.profileTitle,
            ),
          ],
        ),
      ),
    );
  }
}
