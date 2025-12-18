import 'package:flutter/material.dart';

/// Splash App Name Widget - Minimal, sleek app name
class SplashAppNameWidget extends StatelessWidget {
  final Animation<double> fadeAnimation;
  final Animation<double> slideAnimation;

  const SplashAppNameWidget({
    super.key,
    required this.fadeAnimation,
    required this.slideAnimation,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([fadeAnimation, slideAnimation]),
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, slideAnimation.value),
          child: Opacity(
            opacity: fadeAnimation.value,
            child: const Text(
              'Gofocus',
              style: TextStyle(
                fontSize: 42,
                fontWeight: FontWeight.w600,
                color: Colors.white,
                letterSpacing: 3,
                height: 1.2,
              ),
            ),
          ),
        );
      },
    );
  }
}
