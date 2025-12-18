import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Weekly Summary Screen - Haftalık toplam odak süresi, progress, mood graph
class WeeklySummaryScreen extends StatelessWidget {
  const WeeklySummaryScreen({super.key});

  // TODO: Get from backend
  final Map<String, dynamic> _weeklyData = const {
    'total_focus_hours': 28.5,
    'speaking_progress': 75,
    'goal_progress': 60,
    'task_completion_ratio': 0.72,
    'streak_days': [true, true, true, true, true, false, true],
    'mood_data': [7, 8, 6, 9, 7, 8, 8],
    'ai_recommendations': [
      'Bu hafta odaklanma konusunda iyi bir performans gösterdiniz. Hafta sonu biraz daha az çalıştınız, bu normal.',
      'İngilizce pratik konusunda tutarlısınız. Speaking seviyenizde %75 ilerleme var.',
      'Hedeflerinizde %60 tamamlanma var. Haftaya daha fazla ilerleme kaydedebilirsiniz.',
    ],
  };

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
          'Haftalık Özet',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: LoginColors.textPrimary),
            onPressed: () {
              // TODO: Share summary
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Week range
            Center(
              child: Text(
                _getWeekRange(),
                style: const TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Total Focus Hours
            _buildFocusHoursCard(),
            const SizedBox(height: 20),

            // Speaking Progress
            _buildSpeakingProgressCard(),
            const SizedBox(height: 20),

            // Goal Progress
            _buildGoalProgressCard(),
            const SizedBox(height: 20),

            // Task Completion Ratio
            _buildTaskCompletionCard(),
            const SizedBox(height: 20),

            // Mood Graph
            _buildMoodGraphCard(),
            const SizedBox(height: 20),

            // Streak Grid
            _buildStreakGridCard(),
            const SizedBox(height: 20),

            // AI Recommendations
            _buildAiRecommendationsCard(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildFocusHoursCard() {
    final hours = _weeklyData['total_focus_hours'] as double;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LoginColors.orangeGradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Toplam Odak Süresi',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            '${hours.toStringAsFixed(1)} saat',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Bu hafta',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSpeakingProgressCard() {
    final progress = _weeklyData['speaking_progress'] as int;
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
              Icon(Icons.language, color: Colors.blue, size: 24),
              SizedBox(width: 12),
              Text(
                'Speaking Progress',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '%$progress',
            style: const TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress / 100,
              backgroundColor: LoginColors.lightGray,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.blue),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGoalProgressCard() {
    final progress = _weeklyData['goal_progress'] as int;
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
              Icon(Icons.flag, color: LoginColors.orangeBright, size: 24),
              SizedBox(width: 12),
              Text(
                'Hedef İlerlemesi',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '%$progress',
            style: const TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress / 100,
              backgroundColor: LoginColors.lightGray,
              valueColor: const AlwaysStoppedAnimation<Color>(LoginColors.orangeBright),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskCompletionCard() {
    final ratio = _weeklyData['task_completion_ratio'] as double;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.task_alt,
            color: LoginColors.orangeBright,
            size: 32,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Görev Tamamlama Oranı',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${(ratio * 100).toInt()}%',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${(ratio * 100).toInt()}%',
            style: const TextStyle(
              color: LoginColors.orangeBright,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMoodGraphCard() {
    final moodData = _weeklyData['mood_data'] as List<int>;
    final days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Mood Grafiği',
            style: TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 150,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: List.generate(7, (index) {
                final height = (moodData[index] / 10) * 100;
                return Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      width: 30,
                      height: height,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            LoginColors.orangeBright,
                            LoginColors.orangeBright.withOpacity(0.5),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      days[index],
                      style: const TextStyle(
                        color: LoginColors.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStreakGridCard() {
    final streakDays = _weeklyData['streak_days'] as List<bool>;
    final days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Zincir Kırma',
            style: TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(7, (index) {
              final isActive = streakDays[index];
              return Column(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isActive
                          ? Colors.orange
                          : LoginColors.lightGray,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: isActive
                          ? const Icon(
                              Icons.local_fire_department,
                              color: Colors.white,
                              size: 20,
                            )
                          : const Icon(
                              Icons.close,
                              color: LoginColors.textSecondary,
                              size: 20,
                            ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    days[index],
                    style: const TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              );
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildAiRecommendationsCard() {
    final recommendations = _weeklyData['ai_recommendations'] as List<String>;
    
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            LoginColors.orange.withOpacity(0.2),
            LoginColors.orangeBright.withOpacity(0.1),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: LoginColors.orangeBright.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(
                Icons.auto_awesome,
                color: LoginColors.orangeBright,
                size: 24,
              ),
              SizedBox(width: 8),
              Text(
                'AI Önerileri',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ...recommendations.map((rec) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      margin: const EdgeInsets.only(top: 6, right: 12),
                      decoration: const BoxDecoration(
                        color: LoginColors.orangeBright,
                        shape: BoxShape.circle,
                      ),
                    ),
                    Expanded(
                      child: Text(
                        rec,
                        style: const TextStyle(
                          color: LoginColors.textPrimary,
                          fontSize: 14,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  String _getWeekRange() {
    final now = DateTime.now();
    final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
    final endOfWeek = startOfWeek.add(const Duration(days: 6));
    
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
    
    return '${startOfWeek.day} ${months[startOfWeek.month - 1]} - ${endOfWeek.day} ${months[endOfWeek.month - 1]} ${endOfWeek.year}';
  }
}

