import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/onboarding_slide.dart';

/// Onboarding Slide 2 - Sesli Koç
class OnboardingSlide2Screen extends StatelessWidget {
  const OnboardingSlide2Screen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: OnboardingSlide(
                title: 'Sesli Koç',
                description: 'Sesli sohbet edin, AI koçunuz size sesli yanıt versin. Hands-free modu ile araç kullanırken bile kullanabilirsiniz.',
                icon: Icons.mic,
                color: Colors.orange,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(40),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => context.go(AppRoutes.onboardingSlide1),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Colors.white70),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Geri',
                        style: TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => context.push(AppRoutes.onboardingSlide3),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFFB800),
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'İleri',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

