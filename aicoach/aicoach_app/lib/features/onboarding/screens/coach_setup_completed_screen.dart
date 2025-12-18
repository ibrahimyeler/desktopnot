import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Coach Setup Completed Screen - Koç kurulumu tamamlandı
class CoachSetupCompletedScreen extends StatefulWidget {
  const CoachSetupCompletedScreen({super.key});

  @override
  State<CoachSetupCompletedScreen> createState() => _CoachSetupCompletedScreenState();
}

class _CoachSetupCompletedScreenState extends State<CoachSetupCompletedScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _scaleAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.elasticOut,
      ),
    );

    _rotationAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      ),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Animated icon
                  AnimatedBuilder(
                    animation: _animationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _scaleAnimation.value,
                        child: Transform.rotate(
                          angle: _rotationAnimation.value * 0.1,
                          child: Container(
                            width: 150,
                            height: 150,
                            decoration: BoxDecoration(
                              gradient: LoginColors.orangeGradient,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: LoginColors.orangeBright.withOpacity(0.4),
                                  blurRadius: 30,
                                  spreadRadius: 10,
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.check_circle,
                              size: 80,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 32),
                  
                  // Başlık
                  const Text(
                    'Koçun Hazır!',
                    style: TextStyle(
                      color: LoginColors.textPrimary,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'AI koçlarınız size özel olarak yapılandırıldı. Artık konuşmaya başlayabilirsiniz!',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 16,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  
                  // Coach avatars
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildCoachAvatar('Focus', Icons.psychology, Colors.purple),
                      const SizedBox(width: 16),
                      _buildCoachAvatar('English', Icons.language, Colors.blue),
                    ],
                  ),
                  const SizedBox(height: 48),
                  
                  // Start button
                  CustomButton(
                    text: 'Konuşmaya Başla',
                    icon: Icons.chat,
                    onPressed: () => context.go(AppRoutes.home),
                  ),
                  const SizedBox(height: 16),
                  
                  // Skip to home
                  TextButton(
                    onPressed: () => context.go(AppRoutes.home),
                    child: Text(
                      'Ana Sayfaya Git',
                      style: TextStyle(
                        color: LoginColors.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
    );
  }

  Widget _buildCoachAvatar(String name, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color,
                color.withOpacity(0.7),
              ],
            ),
            shape: BoxShape.circle,
            border: Border.all(
              color: LoginColors.orangeBright,
              width: 2,
            ),
          ),
          child: Icon(
            icon,
            size: 40,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          name,
          style: const TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

