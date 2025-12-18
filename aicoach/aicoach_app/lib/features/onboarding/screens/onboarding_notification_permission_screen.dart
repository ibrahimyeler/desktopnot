import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Bildirim İzni Ekranı - Push permission istemek
class OnboardingNotificationPermissionScreen extends StatefulWidget {
  const OnboardingNotificationPermissionScreen({super.key});

  @override
  State<OnboardingNotificationPermissionScreen> createState() => _OnboardingNotificationPermissionScreenState();
}

class _OnboardingNotificationPermissionScreenState extends State<OnboardingNotificationPermissionScreen> {
  bool _isRequesting = false;

  Future<void> _requestPermission() async {
    setState(() {
      _isRequesting = true;
    });

    try {
      // TODO: Request notification permission
      // final status = await Permission.notification.request();
      
      // Mock for development
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      setState(() {
        _isRequesting = false;
      });

      // TODO: Save permission status to backend
      // await _saveNotificationConsent(status.isGranted);

      context.push(AppRoutes.onboardingPremiumOffer);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isRequesting = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  void _skip() {
    // TODO: Save permission status as denied
    // await _saveNotificationConsent(false);
    
    context.push(AppRoutes.onboardingPremiumOffer);
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
              const SizedBox(height: 40),
              
              // Icon
              Center(
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    gradient: LoginColors.orangeGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.notifications_active,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Bildirimler',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              const Text(
                'Hedef hatırlatmaları, günlük özetler ve önemli güncellemeler için bildirim almak ister misiniz?',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Preview card
              Container(
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
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: LoginColors.orangeBright.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.today,
                            color: LoginColors.orangeBright,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Gofocus',
                                style: TextStyle(
                                  color: LoginColors.textPrimary,
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                'Şimdi',
                                style: TextStyle(
                                  color: LoginColors.textSecondary,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Günlük odak raporun hazır! 🎯',
                      style: TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 48),
              
              // Allow button
              CustomButton(
                text: 'İzin Ver',
                icon: Icons.check_circle,
                isLoading: _isRequesting,
                onPressed: _requestPermission,
              ),
              const SizedBox(height: 16),
              
              // Skip button
              TextButton(
                onPressed: _skip,
                child: Text(
                  'Daha Sonra',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}

