import 'package:flutter/material.dart';
import '../widgets/welcome_header_widget.dart';
import '../widgets/welcome_features_widget.dart';
import '../widgets/welcome_actions_widget.dart';

/// Welcome / Landing Screen - İlk açılış ekranı
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827), // Dark background
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const Spacer(),
              
              // Header
              const WelcomeHeaderWidget(),
              
              const Spacer(),
              
              // Features
              const WelcomeFeaturesWidget(),
              
              const SizedBox(height: 48),
              
              // Actions
              const WelcomeActionsWidget(),
              
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

