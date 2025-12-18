import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'login_colors.dart';
import '../../app/navigation/route_names.dart';

/// Login footer bölümü (Kayıt ol linki)
class LoginFooterSection extends StatelessWidget {
  final VoidCallback onRegisterPressed;

  const LoginFooterSection({
    super.key,
    required this.onRegisterPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Divider
        Row(
          children: [
            Expanded(
              child: Divider(
                color: LoginColors.lightGray.withOpacity(0.3),
                thickness: 1,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'veya',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 14,
                ),
              ),
            ),
            Expanded(
              child: Divider(
                color: LoginColors.lightGray.withOpacity(0.3),
                thickness: 1,
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        // Kayıt ol linki
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Hesabınız yok mu? ',
              style: TextStyle(
                color: LoginColors.textSecondary,
                fontSize: 14,
              ),
            ),
            GestureDetector(
              onTap: onRegisterPressed,
              child: Text(
                'Kayıt Ol',
                style: TextStyle(
                  color: LoginColors.orangeBright,
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),
        // Terms & Privacy linki
        TextButton(
          onPressed: () => context.push(AppRoutes.termsPrivacy),
          child: Text(
            'Kullanım Koşulları & Gizlilik Politikası',
            style: TextStyle(
              color: LoginColors.textSecondary.withOpacity(0.7),
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }
}

