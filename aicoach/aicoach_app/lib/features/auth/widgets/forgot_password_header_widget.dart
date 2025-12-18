import 'package:flutter/material.dart';

/// Forgot Password Header Widget - Dynamic header based on step
class ForgotPasswordHeaderWidget extends StatelessWidget {
  final int step; // 0: email, 1: verify, 2: reset

  const ForgotPasswordHeaderWidget({
    super.key,
    required this.step,
  });

  @override
  Widget build(BuildContext context) {
    String title;
    String subtitle;

    switch (step) {
      case 0:
        title = 'Şifremi Unuttum';
        subtitle = 'E-posta adresinize gönderilecek doğrulama kodu ile şifrenizi sıfırlayabilirsiniz';
        break;
      case 1:
        title = 'Doğrulama Kodu';
        subtitle = 'E-posta adresinize gönderilen 6 haneli kodu girin';
        break;
      case 2:
        title = 'Yeni Şifre';
        subtitle = 'Yeni şifrenizi belirleyin';
        break;
      default:
        title = 'Şifremi Unuttum';
        subtitle = '';
    }

    return Column(
      children: [
        const SizedBox(height: 20),
        Text(
          title,
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.w600,
            color: Colors.white,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 12),
        Text(
          subtitle,
          style: TextStyle(
            fontSize: 15,
            color: Colors.white.withValues(alpha: 0.7),
            fontWeight: FontWeight.w300,
            letterSpacing: 0.3,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 40),
      ],
    );
  }
}

