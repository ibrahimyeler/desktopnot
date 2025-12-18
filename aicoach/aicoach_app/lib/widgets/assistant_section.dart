import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../features/coaches/screens/coach_list_screen.dart';
import '../services/coach_service.dart';
import '../models/coach.dart';

class AssistantSection extends StatefulWidget {
  const AssistantSection({super.key});

  @override
  State<AssistantSection> createState() => _AssistantSectionState();
}

class _AssistantSectionState extends State<AssistantSection> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Assistant Card
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFF1F2937),
                Color(0xFF111827),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          Color(0xFFFFB800),
                          Color(0xFFFF8C00),
                        ],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.smart_toy,
                      color: Colors.white,
                      size: 28,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Akıllı Asistan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Tüm koçlarınızı tek yerden yönetin',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.9),
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: _buildActionButton(
                      icon: Icons.chat_bubble_outline,
                      label: 'Sohbet Et',
                      onTap: () => _navigateToChat(context),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildActionButton(
                      icon: Icons.schedule,
                      label: 'Programla',
                      onTap: () => _showScheduleDialog(context),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        // Today's Schedule Preview
        _buildSchedulePreview(),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFFFB800),
                Color(0xFFFF8C00),
              ],
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Colors.white, size: 18),
              const SizedBox(width: 6),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSchedulePreview() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Bugünkü Program',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                TextButton(
                  onPressed: () => _showScheduleDialog(context),
                  child: Text(
                    'Tümünü Gör',
                    style: TextStyle(
                      color: const Color(0xFFFFB800),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
        const SizedBox(height: 16),
        _buildScheduleItem(
          time: '09:00',
          coach: 'Yatırım Koçu',
          task: 'Günlük piyasa analizi',
          icon: '📈',
          color: const Color(0xFF10B981),
        ),
        _buildScheduleItem(
          time: '14:00',
          coach: 'Fitness Koçu',
          task: 'Antrenman planı gözden geçirme',
          icon: '💪',
          color: const Color(0xFFF59E0B),
        ),
        _buildScheduleItem(
          time: '16:00',
          coach: 'Yazılım Koçu',
          task: 'Kod review ve feedback',
          icon: '💻',
          color: const Color(0xFF3B82F6),
        ),
      ],
    );
  }

  Widget _buildScheduleItem({
    required String time,
    required String coach,
    required String task,
    required String icon,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(
              time,
              style: TextStyle(
                color: color,
                fontSize: 13,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      icon,
                      style: const TextStyle(fontSize: 18),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        coach,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  task,
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.grey[400],
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.arrow_forward_ios,
            size: 16,
            color: Colors.grey[500],
          ),
        ],
      ),
    );
  }

  void _navigateToChat(BuildContext context) async {
    final coachService = CoachService();
    final coaches = await coachService.getCoaches();
    
    if (coaches.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Henüz koç eklenmedi')),
      );
      return;
    }

    // Asistan koçu oluştur (tüm koçları yöneten özel koç)
    final assistantCoach = Coach(
      id: 'assistant-coach',
      name: 'Akıllı Asistan',
      category: 'assistant',
      description: 'Tüm koçlarınızı yöneten ve koordine eden akıllı asistan',
      icon: '🤖',
      config: {
        'apiKey': '',
        'systemPrompt': '''Sen kullanıcının tüm koçlarını yöneten akıllı bir asistansın. 
Kullanıcının şu koçları var: ${coaches.map((c) => c.name).join(', ')}.
Kullanıcının hedeflerine göre hangi koçla ne zaman konuşması gerektiğini belirle, 
günlük programını optimize et ve tüm koçlardan gelen bilgileri koordine et.
Her zaman kullanıcının hedeflerine en uygun şekilde koçları yönet.''',
        'model': 'gpt-4',
        'coaches': coaches.map((c) => c.toJson()).toList(),
      },
    );

    if (!context.mounted) return;

    context.push('/coaches/${assistantCoach.id}/chat');
  }

  void _showScheduleDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Günlük Program'),
        content: const Text(
          'Asistanınız tüm koçlarınızı analiz ederek size özel bir program hazırlar. '
          'Programınızı görmek için sohbet bölümünden asistanınızla konuşun.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Kapat'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _navigateToChat(context);
            },
            child: const Text('Sohbet Et'),
          ),
        ],
      ),
    );
  }
}

