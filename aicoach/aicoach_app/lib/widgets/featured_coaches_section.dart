import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../app/navigation/route_names.dart';
import '../models/coach.dart';
import '../services/coach_service.dart';

class FeaturedCoachesSection extends StatelessWidget {
  const FeaturedCoachesSection({super.key});

  Future<void> _navigateToLinaDetail(BuildContext context) async {
    final coachService = CoachService();
    final coaches = await coachService.getCoaches();
    
    // Lina - Odak ve Planlama Koçu
    final linaCoach = coaches.firstWhere(
      (coach) => coach.id == 'focus-planning-coach',
      orElse: () => Coach(
        id: 'focus-planning-coach',
        name: 'Odak ve Planlama Koçu',
        category: 'productivity',
        description: 'Odaklanmanızı artırın, hedeflerinizi planlayın ve verimliliğinizi maksimize edin',
        icon: '🎯',
        config: {
          'apiKey': '',
          'systemPrompt': 'Sen bir odak ve planlama koçusun. Kullanıcıların odaklanma becerilerini geliştirmesine, hedeflerini belirlemesine ve planlamasına, zaman yönetimini iyileştirmesine, verimliliğini artırmasına ve günlük rutinlerini optimize etmesine yardımcı ol. Pomodoro tekniği, zaman bloklama, görev önceliklendirme gibi teknikler öner.',
          'model': 'gpt-4',
        },
      ),
    );

    if (context.mounted) {
      context.push(AppRoutes.coachDetail(linaCoach.id));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Öne Çıkan Koç',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildFeaturedCoachCard(
          title: 'Odak ve Planlama Koçu',
          subtitle: 'Her gün %1 daha iyi ol',
          emoji: '🎯',
          onTap: () => _navigateToLinaDetail(context),
        ),
      ],
    );
  }

  Widget _buildFeaturedCoachCard({
    required String title,
    required String subtitle,
    required String emoji,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF1F2937),
                Color(0xFF111827),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: const Color(0xFF374151),
              width: 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFFFFB800),
                      Color(0xFFFF8C00),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(
                    emoji,
                    style: const TextStyle(fontSize: 32),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[400],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                onPressed: onTap,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFFB800),
                  foregroundColor: const Color(0xFF111827),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Konuş',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

