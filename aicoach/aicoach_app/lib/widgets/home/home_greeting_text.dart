import 'package:flutter/material.dart';
import 'home_colors.dart';

/// Saate göre selamlama metni oluşturan widget
class HomeGreetingText extends StatelessWidget {
  final String userName;

  const HomeGreetingText({
    super.key,
    required this.userName,
  });

  String _getGreeting() {
    final hour = DateTime.now().hour;
    
    if (hour >= 5 && hour < 12) {
      return 'Günaydın';
    } else if (hour >= 12 && hour < 17) {
      return 'İyi Günler';
    } else if (hour >= 17 && hour < 22) {
      return 'İyi Akşamlar';
    } else {
      return 'İyi Geceler';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _getGreeting(),
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: HomeColors.textSecondary,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          userName,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: HomeColors.textPrimary,
          ),
        ),
      ],
    );
  }
}

