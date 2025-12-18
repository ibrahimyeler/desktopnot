import 'package:flutter/material.dart';
import 'profile/profile_avatar.dart';
import 'profile/profile_user_info.dart';
import 'profile/profile_action_buttons.dart';

/// Profil Header Section - Ekran genişliğinde widget
class ProfileHeaderSection extends StatelessWidget {
  final String name;
  final String email;

  const ProfileHeaderSection({
    super.key,
    this.name = 'İbrahim Hakkı Yeler',
    this.email = 'ibrahimyeler10@gmail.com',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          // Avatar with premium border
          const ProfileAvatar(),
          const SizedBox(width: 20),
          // Name, Email and Action Buttons
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ProfileUserInfo(
                  name: name,
                  email: email,
                ),
                const SizedBox(height: 12),
                const ProfileActionButtons(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

