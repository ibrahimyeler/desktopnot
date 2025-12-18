import 'package:flutter/material.dart';

/// Verify Code Header Widget - Icon, title and subtitle
class VerifyCodeHeaderWidget extends StatelessWidget {
  final String email;
  final String purpose; // '2fa', 'magic_link', 'reset_password'

  const VerifyCodeHeaderWidget({
    super.key,
    required this.email,
    required this.purpose,
  });

  String _getPurposeText() {
    switch (purpose) {
      case '2fa':
        return 'İki Faktörlü Doğrulama';
      case 'reset_password':
        return 'Şifre Sıfırlama';
      default:
        return 'E-posta Doğrulama';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 20),
        // Icon
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF6366F1),
                Color(0xFF818CF8),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF6366F1).withValues(alpha: 0.3),
                blurRadius: 20,
                offset: const Offset(0, 8),
                spreadRadius: 0,
              ),
            ],
          ),
          child: const Icon(
            Icons.verified_user,
            size: 40,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 32),
        // Title
        Text(
          _getPurposeText(),
          style: const TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 16),
        // Subtitle
        Text(
          '$email adresine gönderilen 6 haneli kodu girin',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 16,
            fontWeight: FontWeight.w300,
            height: 1.5,
            letterSpacing: 0.3,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 48),
      ],
    );
  }
}

