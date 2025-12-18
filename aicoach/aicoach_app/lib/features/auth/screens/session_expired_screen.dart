import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Session Expired Screen - Oturum süresi dolmuş ekranı
class SessionExpiredScreen extends StatelessWidget {
  const SessionExpiredScreen({super.key});

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
                  Icons.access_time,
                  size: 50,
                  color: LoginColors.orangeDark,
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Oturum Süresi Doldu',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Güvenliğiniz için oturumunuz sonlandırıldı. Lütfen tekrar giriş yapın.',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Login button
              CustomButton(
                text: 'Giriş Yap',
                icon: Icons.login,
                onPressed: () => context.go(AppRoutes.login),
              ),
              const SizedBox(height: 16),
              
              // Back to home
              TextButton(
                onPressed: () => context.go(AppRoutes.home),
                child: Text(
                  'Ana Sayfaya Dön',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
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

