import 'package:flutter/material.dart';
import 'splash_logo_widget.dart';
import 'splash_app_name_widget.dart';
import 'splash_tagline_widget.dart';
import 'splash_loading_indicator_widget.dart';

/// Splash Content Widget - Main content container for splash screen
class SplashContentWidget extends StatelessWidget {
  final Animation<double> fadeAnimation;
  final Animation<double> scaleAnimation;
  final Animation<double> slideAnimation;
  final Animation<double> pulseAnimation;
  final Animation<double> rotationAnimation;

  const SplashContentWidget({
    super.key,
    required this.fadeAnimation,
    required this.scaleAnimation,
    required this.slideAnimation,
    required this.pulseAnimation,
    required this.rotationAnimation,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Minimal Logo
          SplashLogoWidget(
            fadeAnimation: fadeAnimation,
            scaleAnimation: scaleAnimation,
          ),
          
          const SizedBox(height: 48),
          
          // App Name
          SplashAppNameWidget(
            fadeAnimation: fadeAnimation,
            slideAnimation: slideAnimation,
          ),
          
          const SizedBox(height: 20),
          
          // Tagline
          const SplashTaglineWidget(),
          
          const SizedBox(height: 64),
          
          // Minimal Loading Indicator
          SplashLoadingIndicatorWidget(
            fadeAnimation: fadeAnimation,
          ),
        ],
      ),
    );
  }
}
