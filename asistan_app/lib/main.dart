import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'core/navigation/main_navigator.dart';
import 'core/constants/app_constants.dart';

void main() {
  runApp(const AsistanApp());
}

class AsistanApp extends StatelessWidget {
  const AsistanApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.dark,
      home: const MainNavigator(),
    );
  }
}
