import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';

/// Logout Confirm Screen - Çıkış onay ekranı
class LogoutConfirmScreen extends StatefulWidget {
  const LogoutConfirmScreen({super.key});

  @override
  State<LogoutConfirmScreen> createState() => _LogoutConfirmScreenState();
}

class _LogoutConfirmScreenState extends State<LogoutConfirmScreen> {
  final _authService = AuthService();
  bool _isLoading = false;

  Future<void> _handleLogout() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // await _authService.logout();
      
      // Clear local storage
      // await storageService.clearAll();
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      // Navigate to login
      context.go(AppRoutes.login);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Çıkış yapılırken hata oluştu: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  color: LoginColors.orangeDark.withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: LoginColors.orangeDark,
                    width: 2,
                  ),
                ),
                child: const Icon(
                  Icons.logout,
                  size: 50,
                  color: LoginColors.orangeDark,
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Çıkış Yap',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Logout button
              CustomButton(
                text: 'Evet, Çıkış Yap',
                icon: Icons.logout,
                isLoading: _isLoading,
                onPressed: _handleLogout,
              ),
              const SizedBox(height: 16),
              
              // Cancel button
              TextButton(
                onPressed: () => context.pop(),
                child: Text(
                  'İptal',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

