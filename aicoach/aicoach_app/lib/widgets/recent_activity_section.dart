import 'package:flutter/material.dart';
import 'home/recent_activity_item.dart';
import 'home/home_colors.dart';

/// Recent Activity Section - Son aktiviteler listesi
class RecentActivitySection extends StatelessWidget {
  final List<ActivityData> activities;

  const RecentActivitySection({
    super.key,
    required this.activities,
  });

  factory RecentActivitySection.defaultActivities({Key? key}) {
    return RecentActivitySection(
      key: key,
      activities: [
        const ActivityData(
          icon: Icons.chat_bubble_outline,
          title: 'Lina ile sohbet',
          subtitle: '2 saat önce',
          color: HomeColors.purple,
        ),
        const ActivityData(
          icon: Icons.check_circle_outline,
          title: 'Hedef tamamlandı',
          subtitle: '5 saat önce',
          color: HomeColors.greenLight,
        ),
        const ActivityData(
          icon: Icons.add_task,
          title: 'Yeni görev eklendi',
          subtitle: '1 gün önce',
          color: HomeColors.orange,
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Son Aktiviteler',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: HomeColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: HomeColors.cardBackground,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: HomeColors.borderColor,
              width: 1,
            ),
          ),
          child: Column(
            children: [
              ...activities.asMap().entries.map((entry) {
                final index = entry.key;
                final activity = entry.value;
                return Column(
                  children: [
                    RecentActivityItem(
                      icon: activity.icon,
                      title: activity.title,
                      subtitle: activity.subtitle,
                      color: activity.color,
                      onTap: activity.onTap,
                    ),
                    if (index < activities.length - 1)
                      const Divider(
                        color: HomeColors.borderColor,
                        height: 24,
                      ),
                  ],
                );
              }),
            ],
          ),
        ),
      ],
    );
  }
}

/// Activity data model
class ActivityData {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback? onTap;

  const ActivityData({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    this.onTap,
  });
}

