import 'package:flutter/material.dart';
import 'home/executive_metric_card.dart';
import 'home/home_colors.dart';

/// Executive Overview Section - 4 metrik kartı
class ExecutiveOverviewSection extends StatelessWidget {
  final int dailyGoals;
  final int completedGoals;
  final String focusTime;
  final String lastConversation;

  const ExecutiveOverviewSection({
    super.key,
    this.dailyGoals = 5,
    this.completedGoals = 2,
    this.focusTime = '2.5s',
    this.lastConversation = '2s',
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // İlk satır: 2 kart
        Row(
          children: [
            Expanded(
              child: ExecutiveMetricCard(
                title: 'Günlük Hedefler',
                value: dailyGoals.toString(),
                trendLabel: 'Aktif hedef sayısı',
                icon: Icons.flag_outlined,
                accent: HomeColors.orange,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ExecutiveMetricCard(
                title: 'Tamamlanan Hedefler',
                value: completedGoals.toString(),
                trendLabel: 'Bugün tamamlandı',
                icon: Icons.check_circle_outline,
                accent: HomeColors.greenLight,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        // İkinci satır: 2 kart
        Row(
          children: [
            Expanded(
              child: ExecutiveMetricCard(
                title: 'Günlük Odak Süresi',
                value: focusTime,
                trendLabel: 'Saat',
                icon: Icons.timer_outlined,
                accent: HomeColors.blueLight,
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ExecutiveMetricCard(
                title: 'Son Konuşma',
                value: lastConversation,
                trendLabel: 'Saat önce',
                icon: Icons.chat_bubble_outline,
                accent: HomeColors.orangeAccent,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

