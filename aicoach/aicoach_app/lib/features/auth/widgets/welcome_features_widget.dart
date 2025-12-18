import 'package:flutter/material.dart';

/// Welcome Features Widget - Feature list
class WelcomeFeaturesWidget extends StatelessWidget {
  const WelcomeFeaturesWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFeature(
          Icons.psychology,
          'AI Koçlar',
          'Kişiselleştirilmiş AI koçlarınızla hedeflerinize ulaşın',
        ),
        const SizedBox(height: 24),
        _buildFeature(
          Icons.track_changes,
          'Hedef Takibi',
          'Görevlerinizi yönetin ve ilerlemenizi takip edin',
        ),
        const SizedBox(height: 24),
        _buildFeature(
          Icons.people,
          'Topluluk',
          'Benzer hedeflere sahip insanlarla bağlantı kurun',
        ),
      ],
    );
  }

  Widget _buildFeature(IconData icon, String title, String description) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFF6366F1).withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: const Color(0xFF818CF8),
            size: 24,
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
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.7),
                  fontSize: 14,
                  fontWeight: FontWeight.w300,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

