import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../app/navigation/route_names.dart';

/// Welcome Actions Widget - Buttons
class WelcomeActionsWidget extends StatelessWidget {
  const WelcomeActionsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        CustomButton(
          text: 'Başlayalım',
          icon: Icons.arrow_forward,
          onPressed: () => context.push(AppRoutes.login),
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () => context.push(AppRoutes.register),
          child: const Text(
            'Hesabım yok, kayıt ol',
            style: TextStyle(
              color: Color(0xFF818CF8),
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ],
    );
  }
}

