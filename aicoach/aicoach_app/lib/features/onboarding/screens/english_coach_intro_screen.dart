import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// English Coach Tanıtım Ekranı - İngilizce koçunun ne yaptığını anlatmak
class EnglishCoachIntroScreen extends StatelessWidget {
  const EnglishCoachIntroScreen({super.key});

  final List<Map<String, dynamic>> _features = const [
    {
      'title': 'Speaking Practice',
      'icon': Icons.record_voice_over,
      'description': 'Konuşma pratiği ve telaffuz geliştirme',
    },
    {
      'title': 'Writing Correction',
      'icon': Icons.edit,
      'description': 'Yazılarınızı düzeltme ve iyileştirme',
    },
    {
      'title': 'Vocabulary Builder',
      'icon': Icons.book,
      'description': 'Kelime dağarcığınızı genişletme',
    },
    {
      'title': 'Grammar Hints',
      'icon': Icons.menu_book,
      'description': 'Gramer kurallarını öğrenme',
    },
    {
      'title': 'Listening Practice',
      'icon': Icons.headphones,
      'description': 'Dinleme becerilerini geliştirme',
    },
    {
      'title': 'Daily Challenge',
      'icon': Icons.emoji_events,
      'description': 'Günlük İngilizce görevleri',
    },
  ];

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
              
              // Coach avatar
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Colors.blue, Colors.blueAccent],
                    ),
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.withOpacity(0.3),
                        blurRadius: 20,
                        spreadRadius: 5,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.language,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'English Coach',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'İngilizce öğrenme ve geliştirme yolculuğunuzda yanınızda',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 40),
              
              // Features
              ..._features.map((feature) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: LoginColors.mediumGray,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: LoginColors.lightGray,
                          width: 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: Colors.blue.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              feature['icon'] as IconData,
                              color: Colors.blue,
                              size: 24,
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  feature['title'] as String,
                                  style: const TextStyle(
                                    color: LoginColors.textPrimary,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  feature['description'] as String,
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
                    ),
                  )),
              
              const SizedBox(height: 32),
              
              // Voice preview
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Colors.blue.withOpacity(0.2),
                      Colors.blueAccent.withOpacity(0.2),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.blue.withOpacity(0.3),
                    width: 1,
                  ),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.volume_up,
                      color: Colors.blue,
                      size: 32,
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Sesli Örnek',
                      style: TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextButton.icon(
                      onPressed: () {
                        // TODO: Play TTS demo
                      },
                      icon: const Icon(Icons.play_circle_outline, color: Colors.blue),
                      label: const Text(
                        'Dinle',
                        style: TextStyle(color: Colors.blue),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              
              // Continue button
              CustomButton(
                text: 'Seviye Tespitine Başla',
                icon: Icons.arrow_forward,
                onPressed: () => context.push(AppRoutes.englishCoachAssessment),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

