import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// AI-Generated Daily Plan Screen - Sana özel bugünün planı
class DailyPlanScreen extends StatefulWidget {
  const DailyPlanScreen({super.key});

  @override
  State<DailyPlanScreen> createState() => _DailyPlanScreenState();
}

class _DailyPlanScreenState extends State<DailyPlanScreen> {
  bool _isGenerating = false;
  bool _isGenerated = false;

  // TODO: Get from backend
  final Map<String, dynamic> _planData = {
    'critical_tasks': [
      {'title': 'Proje raporunu tamamla', 'time': '09:00-11:00', 'priority': 'high'},
      {'title': 'Müşteri toplantısı', 'time': '14:00-15:00', 'priority': 'high'},
    ],
    'side_tasks': [
      {'title': 'E-posta yanıtları', 'time': '11:00-12:00', 'priority': 'medium'},
      {'title': 'Haftalık planlama', 'time': '16:00-17:00', 'priority': 'medium'},
    ],
    'low_priority_tasks': [
      {'title': 'Dosya düzenleme', 'time': '17:00-17:30', 'priority': 'low'},
    ],
    'breaks': [
      {'time': '12:00-13:00', 'type': 'Öğle yemeği'},
      {'time': '15:00-15:15', 'type': 'Kısa mola'},
    ],
    'english_challenge': {
      'title': 'Günlük İngilizce Challenge',
      'description': '10 dakika speaking practice - "Bugünkü planınızı İngilizce anlatın"',
      'time': '18:00-18:10',
    },
  };

  Future<void> _generatePlan() async {
    setState(() {
      _isGenerating = true;
    });

    // TODO: Call backend API
    // await _generateDailyPlan();
    
    // Mock delay
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    setState(() {
      _isGenerating = false;
      _isGenerated = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: LoginColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Günlük Plan',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: LoginColors.textPrimary),
            onPressed: _isGenerating ? null : () {
              setState(() {
                _isGenerated = false;
              });
              _generatePlan();
            },
          ),
          IconButton(
            icon: const Icon(Icons.share, color: LoginColors.textPrimary),
            onPressed: _isGenerated ? () {
              // TODO: Share plan
            } : null,
          ),
        ],
      ),
      body: _isGenerating
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(
                    color: LoginColors.orangeBright,
                  ),
                  SizedBox(height: 24),
                  Text(
                    'AI planınızı hazırlıyor...',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            )
          : _isGenerated
              ? SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Date header
                      Center(
                        child: Text(
                          _formatDate(DateTime.now()),
                          style: const TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Critical Tasks
                      _buildSection(
                        'Kritik İşler',
                        Icons.priority_high,
                        Colors.red,
                        _planData['critical_tasks'] as List,
                      ),
                      const SizedBox(height: 20),

                      // Side Tasks
                      _buildSection(
                        'Yan İşler',
                        Icons.task,
                        LoginColors.orangeBright,
                        _planData['side_tasks'] as List,
                      ),
                      const SizedBox(height: 20),

                      // Low Priority Tasks
                      _buildSection(
                        'Düşük Öncelik',
                        Icons.check_circle_outline,
                        LoginColors.textSecondary,
                        _planData['low_priority_tasks'] as List,
                      ),
                      const SizedBox(height: 20),

                      // Breaks
                      _buildBreaksSection(),
                      const SizedBox(height: 20),

                      // English Challenge
                      _buildEnglishChallengeCard(),
                      const SizedBox(height: 32),

                      // Export button
                      ElevatedButton(
                        onPressed: () {
                          // TODO: Export to tasks
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Plan görevlere aktarıldı'),
                              backgroundColor: LoginColors.orangeBright,
                            ),
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: LoginColors.orangeBright,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Görevlere Aktar',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          gradient: LoginColors.orangeGradient,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.auto_awesome,
                          size: 60,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 32),
                      const Text(
                        'AI Günlük Plan',
                        style: TextStyle(
                          color: LoginColors.textPrimary,
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 40),
                        child: Text(
                          'AI, rutininize, hedeflerinize ve görevlerinize göre bugün için özel bir plan hazırlayacak.',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 14,
                            height: 1.5,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 32),
                      ElevatedButton(
                        onPressed: _generatePlan,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: LoginColors.orangeBright,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 32,
                            vertical: 16,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Text(
                          'Plan Oluştur',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildSection(String title, IconData icon, Color color, List tasks) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...tasks.map((task) => _buildTaskItem(task)),
        ],
      ),
    );
  }

  Widget _buildTaskItem(Map<String, dynamic> task) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              color: LoginColors.orangeBright,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  task['title'] as String,
                  style: const TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  task['time'] as String,
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBreaksSection() {
    final breaks = _planData['breaks'] as List;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.coffee, color: Colors.blue, size: 24),
              SizedBox(width: 12),
              Text(
                'Molalar',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...breaks.map((breakItem) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    const Icon(
                      Icons.timer,
                      color: Colors.blue,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            breakItem['type'] as String,
                            style: const TextStyle(
                              color: LoginColors.textPrimary,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            breakItem['time'] as String,
                            style: const TextStyle(
                              color: LoginColors.textSecondary,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildEnglishChallengeCard() {
    final challenge = _planData['english_challenge'] as Map<String, dynamic>;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.blue.withOpacity(0.2),
            Colors.blueAccent.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.blue.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.language, color: Colors.blue, size: 24),
              SizedBox(width: 12),
              Text(
                'Günlük İngilizce Challenge',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            challenge['description'] as String,
            style: const TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 14,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            challenge['time'] as String,
            style: const TextStyle(
              color: LoginColors.textSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }
}

