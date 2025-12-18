import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';

/// Forgot Password Footer Widget - Login link
class ForgotPasswordFooterWidget extends StatelessWidget {
  const ForgotPasswordFooterWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          'Şifrenizi hatırlıyor musunuz? ',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 14,
          ),
        ),
        GestureDetector(
          onTap: () => context.go(AppRoutes.login),
          child: const Text(
            'Giriş Yap',
            style: TextStyle(
              color: Color(0xFF818CF8),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

