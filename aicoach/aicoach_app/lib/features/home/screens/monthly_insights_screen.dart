import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Monthly Insights Screen - Ayın en verimli günü, koç kullanımı, trend analizi
class MonthlyInsightsScreen extends StatelessWidget {
  const MonthlyInsightsScreen({super.key});

  // TODO: Get from backend
  final Map<String, dynamic> _monthlyData = const {
    'most_productive_day': 'Çarşamba',
    'most_used_coach': 'Focus Coach',
    'english_level_progress': 15,
    'planning_habit_score': 8.2,
    'productivity_clusters': {
      'high': 12,
      'medium': 10,
      'low': 8,
    },
    'trend_analysis': 'Bu ay odaklanma konusunda tutarlı bir performans gösterdiniz. Çarşamba günleri en verimli günleriniz oldu. İngilizce seviyenizde %15 ilerleme kaydettiniz.',
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
          'Aylık İçgörüler',
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
              // TODO: Share insights
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Month header
            Center(
              child: Text(
                _getCurrentMonth(),
                style: const TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Most Productive Day
            _buildMostProductiveDayCard(),
            const SizedBox(height: 20),

            // Most Used Coach
            _buildMostUsedCoachCard(),
            const SizedBox(height: 20),

            // English Level Progress
            _buildEnglishProgressCard(),
            const SizedBox(height: 20),

            // Planning Habit Score
            _buildPlanningHabitCard(),
            const SizedBox(height: 20),

            // Productivity Clusters (Pie Chart)
            _buildProductivityClustersCard(),
            const SizedBox(height: 20),

            // Trend Analysis
            _buildTrendAnalysisCard(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildMostProductiveDayCard() {
    final day = _monthlyData['most_productive_day'] as String;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LoginColors.orangeGradient,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        children: [
          const Text(
            'En Verimli Gün',
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            day,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Bu ay',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMostUsedCoachCard() {
    final coach = _monthlyData['most_used_coach'] as String;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              gradient: LoginColors.orangeGradient,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.psychology,
              color: Colors.white,
              size: 30,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'En Çok Kullanılan Koç',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  coach,
                  style: const TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEnglishProgressCard() {
    final progress = _monthlyData['english_level_progress'] as int;
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
                'İngilizce Seviye İlerlemesi',
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
            '+%$progress',
            style: const TextStyle(
              color: Colors.blue,
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

  Widget _buildPlanningHabitCard() {
    final score = _monthlyData['planning_habit_score'] as double;
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
              Icon(Icons.calendar_today, color: LoginColors.orangeBright, size: 24),
              SizedBox(width: 12),
              Text(
                'Planlama Alışkanlığı',
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
            score.toStringAsFixed(1),
            style: const TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            '/ 10',
            style: TextStyle(
              color: LoginColors.textSecondary,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: score / 10,
              backgroundColor: LoginColors.lightGray,
              valueColor: const AlwaysStoppedAnimation<Color>(LoginColors.orangeBright),
              minHeight: 8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductivityClustersCard() {
    final clusters = _monthlyData['productivity_clusters'] as Map<String, dynamic>;
    final high = clusters['high'] as int;
    final medium = clusters['medium'] as int;
    final low = clusters['low'] as int;
    final total = high + medium + low;
    
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
            'Verimlilik Dağılımı',
            style: TextStyle(
              color: LoginColors.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildClusterItem('Yüksek', high, total, Colors.green),
              _buildClusterItem('Orta', medium, total, LoginColors.orangeBright),
              _buildClusterItem('Düşük', low, total, Colors.red),
            ],
          ),
          const SizedBox(height: 20),
          // Simple pie chart representation
          Row(
            children: [
              Expanded(
                flex: high,
                child: Container(
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(4),
                      bottomLeft: Radius.circular(4),
                    ),
                  ),
                ),
              ),
              Expanded(
                flex: medium,
                child: Container(
                  height: 8,
                  color: LoginColors.orangeBright,
                ),
              ),
              Expanded(
                flex: low,
                child: Container(
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Colors.red,
                    borderRadius: BorderRadius.only(
                      topRight: Radius.circular(4),
                      bottomRight: Radius.circular(4),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildClusterItem(String label, int value, int total, Color color) {
    final percentage = (value / total * 100).toInt();
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            shape: BoxShape.circle,
            border: Border.all(color: color, width: 2),
          ),
          child: Center(
            child: Text(
              '$value',
              style: TextStyle(
                color: color,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: LoginColors.textSecondary,
            fontSize: 12,
          ),
        ),
        Text(
          '%$percentage',
          style: TextStyle(
            color: color,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildTrendAnalysisCard() {
    final analysis = _monthlyData['trend_analysis'] as String;
    
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
                Icons.trending_up,
                color: LoginColors.orangeBright,
                size: 24,
              ),
              SizedBox(width: 8),
              Text(
                'AI Trend Analizi',
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
            analysis,
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

  String _getCurrentMonth() {
    final now = DateTime.now();
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
    return '${months[now.month - 1]} ${now.year}';
  }
}

