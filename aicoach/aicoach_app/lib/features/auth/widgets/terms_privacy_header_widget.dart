import 'package:flutter/material.dart';

/// Terms Privacy Header Widget - Title section
class TermsPrivacyHeaderWidget extends StatelessWidget {
  const TermsPrivacyHeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Kullanım Koşulları & Gizlilik',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w600,
            color: Colors.white,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'Son güncelleme: ${DateTime.now().year}',
          style: TextStyle(
            fontSize: 14,
            color: Colors.white.withValues(alpha: 0.5),
            fontWeight: FontWeight.w300,
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}

