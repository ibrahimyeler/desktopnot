import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Onboarding Summary - Kullanıcının verdiği bilgilerin son özeti
class OnboardingSummaryScreen extends StatelessWidget {
  const OnboardingSummaryScreen({super.key});

  // TODO: Get actual data from state/backend
  static const List<String> _purposes = [
    'Daha Odaklı Olmak',
    'İngilizce Gelişimi',
  ];
  static const List<String> _developmentAreas = [
    'Zaman Yönetimi',
    'Deep Work',
    'Speaking',
  ];
  static const String _learningStyle = 'Görsel';
  static const String _dailyRoutine = '7 saat uyku, 8 saat çalışma';

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
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              
              // Progress indicator
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 40),
              
              // Icon
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: LoginColors.orangeGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle,
                    size: 50,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Özet',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'Verdiğiniz bilgilerin özeti',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              
              // Purpose list
              _buildSummarySection(
                'Amaçlar',
                Icons.flag,
                OnboardingSummaryScreen._purposes.map((p) => _buildSummaryItem(p)).toList(),
              ),
              const SizedBox(height: 16),
              
              // Development areas
              _buildSummarySection(
                'Gelişim Alanları',
                Icons.trending_up,
                OnboardingSummaryScreen._developmentAreas.map((a) => _buildSummaryItem(a)).toList(),
              ),
              const SizedBox(height: 16),
              
              // Learning style
              _buildSummarySection(
                'Öğrenme Stili',
                Icons.psychology,
                [_buildSummaryItem(OnboardingSummaryScreen._learningStyle)],
              ),
              const SizedBox(height: 16),
              
              // Daily routine
              _buildSummarySection(
                'Günlük Rutin',
                Icons.schedule,
                [_buildSummaryItem(OnboardingSummaryScreen._dailyRoutine)],
              ),
              const SizedBox(height: 32),
              
              // Start button
              CustomButton(
                text: 'Başla!',
                icon: Icons.arrow_forward,
                onPressed: () => context.push(AppRoutes.focusCoachIntro),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummarySection(String title, IconData icon, List<Widget> items) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: LoginColors.lightGray,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                icon,
                color: LoginColors.orangeBright,
                size: 24,
              ),
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
          ...items,
        ],
      ),
    );
  }

  Widget _buildSummaryItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: const BoxDecoration(
              color: LoginColors.orangeBright,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                color: LoginColors.textSecondary,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

