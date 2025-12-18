import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Daily Summary Screen - CEO Coach her günün sonunda özet çıkarır
class DailySummaryScreen extends StatefulWidget {
  const DailySummaryScreen({super.key});

  @override
  State<DailySummaryScreen> createState() => _DailySummaryScreenState();
}

class _DailySummaryScreenState extends State<DailySummaryScreen> {
  final TextEditingController _journalController = TextEditingController();

  // TODO: Get from backend
  final Map<String, dynamic> _summaryData = {
    'focus_score': 7.5,
    'completed_tasks': 4,
    'total_tasks': 6,
    'english_practice_minutes': 25,
    'streak': 12,
    'most_used_coach': 'Focus Coach',
    'ai_evaluation': 'Bugün odaklanma konusunda iyi bir gün geçirdiniz. 4 görevi tamamladınız ve 25 dakika İngilizce pratik yaptınız. Yarın için daha fazla derin çalışma yapabilirsiniz.',
    'six_methods_completed': 3,
    'six_methods_total': 6,
  };

  @override
  void dispose() {
    _journalController.dispose();
    super.dispose();
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
          'Günlük Özet',
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

            // Focus Score Gauge
            _buildFocusScoreCard(),
            const SizedBox(height: 20),

            // 6 İş Metodu Progress
            _buildSixMethodsCard(),
            const SizedBox(height: 20),

            // Tasks Completed
            _buildTasksCard(),
            const SizedBox(height: 20),

            // English Practice
            _buildEnglishCard(),
            const SizedBox(height: 20),

            // Streak
            _buildStreakCard(),
            const SizedBox(height: 20),

            // Most Used Coach
            _buildCoachCard(),
            const SizedBox(height: 20),

            // AI Evaluation
            _buildAiEvaluationCard(),
            const SizedBox(height: 20),

            // Journaling
            _buildJournalingCard(),
            const SizedBox(height: 32),

            // Save button
            ElevatedButton(
              onPressed: () {
                // TODO: Save journal entry
                context.pop();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: LoginColors.orangeBright,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Kaydet',
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

  Widget _buildFocusScoreCard() {
    final score = _summaryData['focus_score'] as double;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LoginColors.orangeGradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'Odak Puanı',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            score.toStringAsFixed(1),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 48,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: score / 10,
              backgroundColor: Colors.white.withOpacity(0.3),
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSixMethodsCard() {
    final completed = _summaryData['six_methods_completed'] as int;
    final total = _summaryData['six_methods_total'] as int;
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
            '6 İş Metodu',
            style: TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '$completed / $total tamamlandı',
            style: const TextStyle(
              color: LoginColors.textSecondary,
              fontSize: 14,
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: completed / total,
              backgroundColor: LoginColors.lightGray,
              valueColor: const AlwaysStoppedAnimation<Color>(LoginColors.orangeBright),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTasksCard() {
    final completed = _summaryData['completed_tasks'] as int;
    final total = _summaryData['total_tasks'] as int;
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
                  'Tamamlanan Görevler',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$completed / $total',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${((completed / total) * 100).toInt()}%',
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

  Widget _buildEnglishCard() {
    final minutes = _summaryData['english_practice_minutes'] as int;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.language,
            color: Colors.blue,
            size: 32,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'İngilizce Pratik',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$minutes dakika',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStreakCard() {
    final streak = _summaryData['streak'] as int;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.local_fire_department,
            color: Colors.orange,
            size: 32,
          ),
          const SizedBox(width: 16),
          Expanded(
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
                const SizedBox(height: 4),
                Text(
                  '$streak gün',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.orange.withOpacity(0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              '$streak 🔥',
              style: const TextStyle(
                color: Colors.orange,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCoachCard() {
    final coach = _summaryData['most_used_coach'] as String;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.psychology,
            color: LoginColors.orangeBright,
            size: 32,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'En Çok Kullanılan Koç',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  coach,
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAiEvaluationCard() {
    final evaluation = _summaryData['ai_evaluation'] as String;
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
          Row(
            children: [
              const Icon(
                Icons.auto_awesome,
                color: LoginColors.orangeBright,
                size: 24,
              ),
              const SizedBox(width: 8),
              const Text(
                'AI Değerlendirmesi',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            evaluation,
            style: const TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 14,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJournalingCard() {
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
            'Bugün Ne Öğrendin?',
            style: TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _journalController,
            maxLines: 4,
            style: const TextStyle(color: LoginColors.textPrimary),
            decoration: InputDecoration(
              hintText: 'Bugünkü deneyimlerinizi, öğrendiklerinizi yazın...',
              hintStyle: const TextStyle(color: LoginColors.textSecondary),
              filled: true,
              fillColor: LoginColors.darkGray,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              contentPadding: const EdgeInsets.all(16),
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

