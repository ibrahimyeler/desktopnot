import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/coach.dart';
import '../services/coach_service.dart';

class ExecutiveAssistantCard extends StatefulWidget {
  const ExecutiveAssistantCard({super.key});

  @override
  State<ExecutiveAssistantCard> createState() => _ExecutiveAssistantCardState();
}

class _ExecutiveAssistantCardState extends State<ExecutiveAssistantCard> {
  bool _isProcessing = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF1F2937),
            Color(0xFF131B2B),
          ],
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF1F2937), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFFFFB800),
                      Color(0xFFFF8C00),
                    ],
                  ),
                ),
                child: const Text(
                  '🎯',
                  style: TextStyle(fontSize: 24),
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Lina',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Bugün odaklanmaya hazır mısın?',
                      style: TextStyle(
                        fontSize: 13,
                        color: Color(0xFFE5E7EB),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _isProcessing ? null : _navigateToLinaChat,
              style: ElevatedButton.styleFrom(
                backgroundColor: _isProcessing
                    ? const Color(0xFF374151)
                    : const Color(0xFFFFB800),
                foregroundColor: _isProcessing
                    ? Colors.white70
                    : const Color(0xFF111827),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: Icon(
                Icons.chat_bubble_outline,
                size: 18,
                color: _isProcessing ? Colors.white70 : const Color(0xFF111827),
              ),
              label: Text(
                _isProcessing ? 'Açılıyor...' : 'Koç ile Konuş',
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }


  Future<void> _navigateToLinaChat() async {
    setState(() {
      _isProcessing = true;
    });

    final coachService = CoachService();
    final coaches = await coachService.getCoaches();

    if (!mounted) return;

    if (coaches.isEmpty) {
      setState(() {
        _isProcessing = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Henüz koç eklenmedi')),
      );
      return;
    }

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

    context.push('/coaches/${linaCoach.id}/chat').then((_) {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });
      }
    });
  }

}
