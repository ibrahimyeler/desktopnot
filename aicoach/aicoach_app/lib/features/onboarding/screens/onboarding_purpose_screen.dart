import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Kullanım Amacı Seçimi Ekranı - Kullanıcının motivasyonunu belirleme
class OnboardingPurposeScreen extends StatefulWidget {
  const OnboardingPurposeScreen({super.key});

  @override
  State<OnboardingPurposeScreen> createState() => _OnboardingPurposeScreenState();
}

class _OnboardingPurposeScreenState extends State<OnboardingPurposeScreen> {
  final Set<String> _selectedPurposes = {};

  final List<Map<String, dynamic>> _purposes = [
    {
      'id': 'focus',
      'title': 'Daha Odaklı Olmak',
      'icon': Icons.center_focus_strong,
      'description': 'Dikkat dağınıklığını azaltmak ve derin çalışma',
    },
    {
      'id': 'english',
      'title': 'İngilizce Gelişimi',
      'icon': Icons.language,
      'description': 'Speaking, writing ve grammar becerilerini geliştirmek',
    },
    {
      'id': 'goals',
      'title': 'Günlük Hedef Yönetimi',
      'icon': Icons.flag,
      'description': 'Hedeflerinizi takip etmek ve tamamlamak',
    },
    {
      'id': 'productivity',
      'title': 'Üretkenlik Artırma',
      'icon': Icons.trending_up,
      'description': 'Zaman yönetimi ve verimlilik teknikleri',
    },
    {
      'id': 'personal_growth',
      'title': 'Kişisel Gelişim',
      'icon': Icons.self_improvement,
      'description': 'Genel olarak kendini geliştirmek',
    },
    {
      'id': 'habits',
      'title': 'Alışkanlık Oluşturma',
      'icon': Icons.repeat,
      'description': 'Yeni alışkanlıklar edinmek ve sürdürmek',
    },
  ];

  void _togglePurpose(String id) {
    setState(() {
      if (_selectedPurposes.contains(id)) {
        _selectedPurposes.remove(id);
      } else {
        _selectedPurposes.add(id);
      }
    });
  }

  void _continue() {
    if (_selectedPurposes.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen en az bir amaç seçin'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
      return;
    }

    // TODO: Save to backend
    // await _savePurposes(_selectedPurposes.toList());

    context.push(AppRoutes.onboardingDevelopmentAreas);
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
                        color: LoginColors.lightGray,
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
                'Neden Gofocus?',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Uygulamayı kullanma amacınızı seçin (birden fazla seçebilirsiniz)',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              
              // Purpose grid
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.1,
                  ),
                  itemCount: _purposes.length,
                  itemBuilder: (context, index) {
                    final purpose = _purposes[index];
                    final isSelected = _selectedPurposes.contains(purpose['id']);
                    
                    return GestureDetector(
                      onTap: () => _togglePurpose(purpose['id'] as String),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? LoginColors.orange.withOpacity(0.2)
                              : LoginColors.mediumGray,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected
                                ? LoginColors.orangeBright
                                : LoginColors.lightGray,
                            width: isSelected ? 2 : 1,
                          ),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              purpose['icon'] as IconData,
                              size: 40,
                              color: isSelected
                                  ? LoginColors.orangeBright
                                  : LoginColors.textSecondary,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              purpose['title'] as String,
                              style: TextStyle(
                                color: isSelected
                                    ? LoginColors.textPrimary
                                    : LoginColors.textSecondary,
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            if (isSelected) ...[
                              const SizedBox(height: 8),
                              const Icon(
                                Icons.check_circle,
                                color: LoginColors.orangeBright,
                                size: 20,
                              ),
                            ],
                          ],
                        ),
                      ),
                    );
                  },
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
                onPressed: () => context.push(AppRoutes.onboardingDevelopmentAreas),
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

