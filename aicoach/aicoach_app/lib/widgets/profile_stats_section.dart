import 'package:flutter/material.dart';
import 'profile/profile_stat_card.dart';

/// Profil Stats Section - Modern ve sleek tasarım
class ProfileStatsSection extends StatelessWidget {
  final int totalChats;
  final int activeCoaches;
  final int goals;

  const ProfileStatsSection({
    super.key,
    this.totalChats = 0,
    this.activeCoaches = 3,
    this.goals = 5,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: ProfileStatCard(
            label: 'Toplam Sohbet',
            value: totalChats.toString(),
            icon: Icons.chat_bubble_outline,
            color: const Color(0xFF6366F1),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ProfileStatCard(
            label: 'Aktif Koçlar',
            value: activeCoaches.toString(),
            icon: Icons.people_outline,
            color: const Color(0xFF10B981),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ProfileStatCard(
            label: 'Hedefler',
            value: goals.toString(),
            icon: Icons.flag_outlined,
            color: const Color(0xFFF59E0B),
          ),
        ),
      ],
    );
  }
}

