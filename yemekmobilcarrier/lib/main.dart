import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'features/main/presentation/screens/main_screen.dart';
import 'core/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('tr_TR', null);
  runApp(const YemekMobilCarrierApp());
}

class YemekMobilCarrierApp extends StatelessWidget {
  const YemekMobilCarrierApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Yemek Mobil Kurye',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const MainScreen(),
    );
  }
}
