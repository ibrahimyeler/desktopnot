import 'package:flutter/material.dart';

/// Splash Background Widget - Dark background
class SplashBackgroundWidget extends StatelessWidget {
  final Widget child;

  const SplashBackgroundWidget({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFF111827), // Dark background
      ),
      child: SafeArea(
        child: child,
      ),
    );
  }
}
