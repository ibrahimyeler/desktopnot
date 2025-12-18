import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Gelişim Alanı Belirleme Ekranı - Odaklanmak istediği spesifik alanlar
class OnboardingDevelopmentAreasScreen extends StatefulWidget {
  const OnboardingDevelopmentAreasScreen({super.key});

  @override
  State<OnboardingDevelopmentAreasScreen> createState() => _OnboardingDevelopmentAreasScreenState();
}

class _OnboardingDevelopmentAreasScreenState extends State<OnboardingDevelopmentAreasScreen> {
  final Set<String> _selectedAreas = {};

  final List<Map<String, dynamic>> _areas = [
    {
      'id': 'time_management',
      'title': 'Zaman Yönetimi',
      'icon': Icons.access_time,
      'color': Colors.blue,
    },
    {
      'id': 'deep_work',
      'title': 'Deep Work',
      'icon': Icons.psychology,
      'color': Colors.purple,
    },
    {
      'id': 'grammar',
      'title': 'Grammar',
      'icon': Icons.menu_book,
      'color': Colors.green,
    },
    {
      'id': 'speaking',
      'title': 'Speaking',
      'icon': Icons.record_voice_over,
      'color': Colors.orange,
    },
    {
      'id': 'mental_clarity',
      'title': 'Mental Clarity',
      'icon': Icons.lightbulb,
      'color': Colors.yellow,
    },
    {
      'id': 'fitness',
      'title': 'Fitness',
      'icon': Icons.fitness_center,
      'color': Colors.red,
    },
    {
      'id': 'money_management',
      'title': 'Para Yönetimi',
      'icon': Icons.account_balance_wallet,
      'color': Colors.teal,
    },
    {
      'id': 'creativity',
      'title': 'Yaratıcılık',
      'icon': Icons.palette,
      'color': Colors.pink,
    },
  ];

  void _toggleArea(String id) {
    setState(() {
      if (_selectedAreas.contains(id)) {
        _selectedAreas.remove(id);
      } else {
        _selectedAreas.add(id);
      }
    });
  }

  void _continue() {
    if (_selectedAreas.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen en az bir gelişim alanı seçin'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
      return;
    }

    // TODO: Save to backend
    // await _saveDevelopmentAreas(_selectedAreas.toList());

    context.push(AppRoutes.onboardingDailyRoutine);
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
                        color: LoginColors.lightGray,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Gelişim Alanları',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Odaklanmak istediğiniz alanları seçin. AI koçlarınız buna göre özelleştirilecek.',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              
              // Areas chips
              Expanded(
                child: Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: _areas.map((area) {
                    final isSelected = _selectedAreas.contains(area['id']);
                    final color = area['color'] as Color;
                    
                    return FilterChip(
                      label: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            area['icon'] as IconData,
                            size: 20,
                            color: isSelected ? color : LoginColors.textSecondary,
                          ),
                          const SizedBox(width: 8),
                          Text(area['title'] as String),
                        ],
                      ),
                      selected: isSelected,
                      onSelected: (_) => _toggleArea(area['id'] as String),
                      selectedColor: color.withOpacity(0.2),
                      checkmarkColor: color,
                      labelStyle: TextStyle(
                        color: isSelected ? color : LoginColors.textSecondary,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                      ),
                      side: BorderSide(
                        color: isSelected ? color : LoginColors.lightGray,
                        width: isSelected ? 2 : 1,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
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
              const SizedBox(height: 16),
              
              // Skip link
              TextButton(
                onPressed: () => context.push(AppRoutes.onboardingDailyRoutine),
                child: Text(
                  'Atla',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

