import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../../../widgets/home/home_colors.dart';

/// Quick Actions Menu Screen - Centralized quick actions
class QuickActionsMenuScreen extends StatelessWidget {
  const QuickActionsMenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Hızlı Aksiyonlar',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: GridView.count(
          padding: const EdgeInsets.all(20),
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            _buildActionCard(
              context,
              'Plan Oluştur',
              Icons.calendar_today,
              HomeColors.blue,
              () {},
            ),
            _buildActionCard(
              context,
              'İngilizce Pratik',
              Icons.language,
              HomeColors.purple,
              () {},
            ),
            _buildActionCard(
              context,
              'Görev Ekle',
              Icons.add_task,
              HomeColors.orange,
              () => context.push(AppRoutes.createTask),
            ),
            _buildActionCard(
              context,
              'Not Ekle',
              Icons.note_add,
              HomeColors.green,
              () => context.push(AppRoutes.createNote),
            ),
            _buildActionCard(
              context,
              'Pomodoro Başlat',
              Icons.timer,
              HomeColors.orangeAccent,
              () => context.push(AppRoutes.pomodoroTimer),
            ),
            _buildActionCard(
              context,
              'Zaman Bloklama',
              Icons.schedule,
              HomeColors.blue,
              () => context.push(AppRoutes.timeBlocking),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFF374151),
            width: 1,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 32),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

