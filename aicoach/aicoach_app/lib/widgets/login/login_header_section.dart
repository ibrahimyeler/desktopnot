import 'package:flutter/material.dart';
import 'login_colors.dart';

/// Login sayfası header bölümü
class LoginHeaderSection extends StatelessWidget {
  const LoginHeaderSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 20),
        // Logo container (shadow yok)
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            gradient: LoginColors.orangeGradient,
            shape: BoxShape.circle,
            border: Border.all(
              color: LoginColors.orange.withOpacity(0.3),
              width: 2,
            ),
          ),
          child: const Center(
            child: Text(
              '🧠',
              style: TextStyle(fontSize: 50),
            ),
          ),
        ),
        const SizedBox(height: 24),
        // Başlık
        Text(
          'Giriş Yap',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: LoginColors.textPrimary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        // Alt başlık
        Text(
          'Gofocus hesabınıza giriş yapın',
          style: TextStyle(
            fontSize: 16,
            color: LoginColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}

