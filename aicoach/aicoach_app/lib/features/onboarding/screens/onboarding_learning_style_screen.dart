import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Öğrenme Stili Ekranı - Görsel / İşitsel / Sözel
class OnboardingLearningStyleScreen extends StatefulWidget {
  const OnboardingLearningStyleScreen({super.key});

  @override
  State<OnboardingLearningStyleScreen> createState() => _OnboardingLearningStyleScreenState();
}

class _OnboardingLearningStyleScreenState extends State<OnboardingLearningStyleScreen>
    with SingleTickerProviderStateMixin {
  String? _selectedStyle;
  late AnimationController _animationController;

  final List<Map<String, dynamic>> _styles = [
    {
      'id': 'visual',
      'title': 'Görsel',
      'icon': Icons.visibility,
      'description': 'Diagram, tablo, görsel örnekler ile öğrenmeyi tercih ederim',
      'color': Colors.blue,
    },
    {
      'id': 'auditory',
      'title': 'İşitsel',
      'icon': Icons.headphones,
      'description': 'Sesli açıklama, storytelling ve konuşma ile öğrenmeyi tercih ederim',
      'color': Colors.purple,
    },
    {
      'id': 'verbal',
      'title': 'Sözel',
      'icon': Icons.text_fields,
      'description': 'Analitik, metinsel açıklamalar ve detaylı yazılar ile öğrenmeyi tercih ederim',
      'color': Colors.orange,
    },
  ];

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _selectStyle(String id) {
    setState(() {
      _selectedStyle = id;
    });
    _animationController.forward();
  }

  void _continue() {
    if (_selectedStyle == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen bir öğrenme stili seçin'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
      return;
    }

    // TODO: Save to backend
    // await _saveLearningStyle(_selectedStyle!);

    context.push(AppRoutes.onboardingNotificationPermission);
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
      ),
      body: SafeArea(
        child: Padding(
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
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Öğrenme Stiliniz',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Koçlarınızın cevap verme tarzını kişiye göre ayarlayalım',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              
              // Style cards
              Expanded(
                child: Column(
                  children: _styles.map((style) {
                    final isSelected = _selectedStyle == style['id'];
                    final color = style['color'] as Color;
                    
                    return Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: GestureDetector(
                          onTap: () => _selectStyle(style['id'] as String),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            curve: Curves.easeOut,
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? color.withOpacity(0.2)
                                  : LoginColors.mediumGray,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: isSelected
                                    ? color
                                    : LoginColors.lightGray,
                                width: isSelected ? 3 : 1,
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  style['icon'] as IconData,
                                  size: isSelected ? 64 : 48,
                                  color: isSelected
                                      ? color
                                      : LoginColors.textSecondary,
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  style['title'] as String,
                                  style: TextStyle(
                                    color: isSelected
                                        ? color
                                        : LoginColors.textPrimary,
                                    fontSize: isSelected ? 24 : 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  style['description'] as String,
                                  style: TextStyle(
                                    color: LoginColors.textSecondary,
                                    fontSize: 14,
                                    height: 1.4,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                if (isSelected) ...[
                                  const SizedBox(height: 16),
                                  Icon(
                                    Icons.check_circle,
                                    color: color,
                                    size: 32,
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Continue button
              CustomButton(
                text: 'Devam Et',
                icon: Icons.arrow_forward,
                onPressed: _continue,
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

