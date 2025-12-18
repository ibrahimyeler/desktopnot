import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../widgets/terms_privacy_header_widget.dart';
import '../widgets/terms_section_widget.dart';
import '../widgets/privacy_section_widget.dart';
import '../widgets/terms_privacy_accept_button_widget.dart';

/// Terms & Privacy Screen
class TermsPrivacyScreen extends StatelessWidget {
  const TermsPrivacyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827), // Dark background
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const TermsPrivacyHeaderWidget(),
              
              // Terms Section
              const TermsSectionWidget(),
              
              const SizedBox(height: 32),
              
              // Privacy Section
              const PrivacySectionWidget(),
              
              const SizedBox(height: 32),
              
              // Accept Button
              const TermsPrivacyAcceptButtonWidget(),
            ],
          ),
        ),
      ),
    );
  }
}

