import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Premium Tanıtım Ekranı (Upsell) - Onboarding sırasında premium dönüşümü
class OnboardingPremiumOfferScreen extends StatefulWidget {
  const OnboardingPremiumOfferScreen({super.key});

  @override
  State<OnboardingPremiumOfferScreen> createState() => _OnboardingPremiumOfferScreenState();
}

class _OnboardingPremiumOfferScreenState extends State<OnboardingPremiumOfferScreen> {
  bool _isLoading = false;

  final List<Map<String, dynamic>> _features = [
    {
      'title': 'AI Voice Chat',
      'icon': Icons.mic,
      'description': 'Sesli sohbet ile daha hızlı iletişim',
    },
    {
      'title': 'Unlimited Messages',
      'icon': Icons.chat_bubble_outline,
      'description': 'Sınırsız mesaj gönderme',
    },
    {
      'title': 'Insights Pro',
      'icon': Icons.analytics,
      'description': 'Detaylı analitik ve raporlar',
    },
    {
      'title': 'Coach Personalization',
      'icon': Icons.person,
      'description': 'Koçlarınızı tamamen özelleştirin',
    },
  ];

  Future<void> _startPremium() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Open subscription/payment screen
      // await context.push(AppRoutes.subscription);
      
      // Mock for development
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      // Navigate to summary
      context.push(AppRoutes.onboardingSummary);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });
    }
  }

  void _skip() {
    context.push(AppRoutes.onboardingSummary);
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
              
              // Premium badge
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: LoginColors.orangeGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    'PREMIUM',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 2,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Başlık
              const Text(
                'Premium\'u Dene',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: LoginColors.orange.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: LoginColors.orangeBright,
                    width: 1,
                  ),
                ),
                child: const Text(
                  '%50 Hoşgeldin İndirimi',
                  style: TextStyle(
                    color: LoginColors.orangeBright,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 32),
              
              // Features
              ..._features.map((feature) => Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: LoginColors.orange.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            feature['icon'] as IconData,
                            color: LoginColors.orangeBright,
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
                  )),
              
              const SizedBox(height: 32),
              
              // Price
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '₺99',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 20,
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          '₺49',
                          style: TextStyle(
                            color: LoginColors.orangeBright,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Text(
                          '/ay',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'İlk ay %50 indirimli',
                      style: TextStyle(
                        color: LoginColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              
              // Premium button
              CustomButton(
                text: 'Premium\'u Başlat',
                icon: Icons.star,
                isLoading: _isLoading,
                onPressed: _startPremium,
              ),
              const SizedBox(height: 16),
              
              // Skip button
              TextButton(
                onPressed: _skip,
                child: Text(
                  'Geç',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
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

