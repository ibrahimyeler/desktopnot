import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/coaches/screens/coach_list_screen.dart';
import '../features/profile/screens/profile_screen.dart';
import 'home/quick_access_card.dart';
import 'home/home_colors.dart';

/// Quick Access Section - Hızlı erişim kartları
class QuickAccessSection extends StatelessWidget {
  const QuickAccessSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Hızlı Erişim',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: HomeColors.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: QuickAccessCard(
                icon: Icons.flag_outlined,
                title: 'Hedeflerim',
                subtitle: 'Hedeflerini gör',
                color: HomeColors.orange,
                onTap: () => context.push('/goals'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: QuickAccessCard(
                icon: Icons.chat_bubble_outline,
                title: 'Koçla Sohbet',
                subtitle: 'Lina ile konuş',
                color: HomeColors.purple,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const CoachListScreen(),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: QuickAccessCard(
                icon: Icons.person_outline,
                title: 'Profil',
                subtitle: 'Profilini gör',
                color: HomeColors.green,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ProfileScreen(),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: QuickAccessCard(
                icon: Icons.note_outlined,
                title: 'Notlar',
                subtitle: 'Notlarını gör',
                color: HomeColors.orangeAccent,
                onTap: () {
                  // Notlar ekranına git (gelecekte eklenecek)
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
}

