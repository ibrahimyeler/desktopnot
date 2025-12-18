import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Terms Privacy Accept Button Widget - Accept button
class TermsPrivacyAcceptButtonWidget extends StatelessWidget {
  const TermsPrivacyAcceptButtonWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: () => context.pop(),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF818CF8),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0,
        ),
        child: const Text(
          'Kabul Ediyorum',
          style: TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }
}

