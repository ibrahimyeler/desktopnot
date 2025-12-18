import 'package:flutter/material.dart';
import '../../features/profile/screens/theme_screen.dart';

/// Profile Header için ayarlar butonu
class ProfileSettingsButton extends StatelessWidget {
  final VoidCallback? onTap;

  const ProfileSettingsButton({
    super.key,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap ?? () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const ThemeScreen(),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFF374151),
            width: 1,
          ),
        ),
        child: const Icon(
          Icons.settings_outlined,
          color: Colors.white,
          size: 20,
        ),
      ),
    );
  }
}

