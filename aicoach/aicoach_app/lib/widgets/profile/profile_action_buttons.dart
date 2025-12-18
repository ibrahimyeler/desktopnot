import 'package:flutter/material.dart';
import 'premium_badge.dart';
import 'edit_profile_button.dart';

/// Profil aksiyon butonları widget'ı (Premium Badge ve Edit Button)
class ProfileActionButtons extends StatelessWidget {
  const ProfileActionButtons({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        const PremiumBadge(),
        EditProfileButton(),
      ],
    );
  }
}

