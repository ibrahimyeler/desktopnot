import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Productivity Heatmap Screen - GitHub-style heatmap of focus times
class ProductivityHeatmapScreen extends StatelessWidget {
  const ProductivityHeatmapScreen({super.key});

  // TODO: Get from backend - 7 columns (days) x 5-6 rows (weeks)
  final List<List<int>> _heatmapData = const [
    [0, 2, 1, 3, 2, 1, 0], // Week 1
    [1, 3, 4, 2, 3, 2, 1], // Week 2
    [2, 4, 3, 4, 3, 2, 2], // Week 3
    [3, 2, 4, 3, 4, 3, 2], // Week 4
    [2, 3, 2, 4, 2, 1, 0], // Week 5
  ];

  static const List<String> _days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  Color _getColorForIntensity(int intensity) {
    if (intensity == 0) return LoginColors.lightGray;
    if (intensity == 1) return LoginColors.orange.withOpacity(0.3);
    if (intensity == 2) return LoginColors.orange.withOpacity(0.5);
    if (intensity == 3) return LoginColors.orangeBright.withOpacity(0.7);
    return LoginColors.orangeBright;
  }

  String _getTooltip(int intensity) {
    if (intensity == 0) return 'Veri yok';
    final minutes = intensity * 30;
    return '$minutes dk deep work, ${intensity + 1} görev tamamlandı';
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
          'Verimlilik Heatmap',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: LoginColors.textPrimary),
            onPressed: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: LoginColors.mediumGray,
                  title: const Text(
                    'Heatmap Açıklaması',
                    style: TextStyle(color: LoginColors.textPrimary),
                  ),
                  content: const Text(
                    'Renkler, o günkü verimliliğinizi gösterir. Koyu renkler daha yüksek verimlilik anlamına gelir.',
                    style: TextStyle(color: LoginColors.textSecondary),
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text(
                        'Tamam',
                        style: TextStyle(color: LoginColors.orangeBright),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Legend
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: LoginColors.mediumGray,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  const Text(
                    'Daha az',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      return Container(
                        width: 12,
                        height: 12,
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        decoration: BoxDecoration(
                          color: _getColorForIntensity(index),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      );
                    }),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Daha fazla',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Heatmap grid
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: LoginColors.mediumGray,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  // Day labels
                  Row(
                    children: [
                      const SizedBox(width: 40), // Space for week labels
                      ..._days.map((day) => Expanded(
                            child: Center(
                              child: Text(
                                day,
                                style: const TextStyle(
                                  color: LoginColors.textSecondary,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          )),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Heatmap cells
                  ...List.generate(_heatmapData.length, (weekIndex) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 40,
                            child: Text(
                              'H${weekIndex + 1}',
                              style: const TextStyle(
                                color: LoginColors.textSecondary,
                                fontSize: 12,
                              ),
                            ),
                          ),
                          ...List.generate(7, (dayIndex) {
                            final intensity = _heatmapData[weekIndex][dayIndex];
                            return Expanded(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 2),
                                child: Tooltip(
                                  message: _getTooltip(intensity),
                                  child: Container(
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: _getColorForIntensity(intensity),
                                      borderRadius: BorderRadius.circular(4),
                                      border: Border.all(
                                        color: LoginColors.darkGray,
                                        width: 1,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Stats summary
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: LoginColors.mediumGray,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Özet',
                    style: TextStyle(
                      color: LoginColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _buildStatRow('Toplam Gün', '${_heatmapData.length * 7}'),
                  const SizedBox(height: 8),
                  _buildStatRow('Aktif Gün', _countActiveDays().toString()),
                  const SizedBox(height: 8),
                  _buildStatRow('Ortalama Verimlilik', _getAverageIntensity().toStringAsFixed(1)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: LoginColors.textSecondary,
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  int _countActiveDays() {
    int count = 0;
    for (var week in _heatmapData) {
      for (var day in week) {
        if (day > 0) count++;
      }
    }
    return count;
  }

  double _getAverageIntensity() {
    int total = 0;
    int count = 0;
    for (var week in _heatmapData) {
      for (var day in week) {
        total += day;
        count++;
      }
    }
    return count > 0 ? total / count : 0;
  }
}

