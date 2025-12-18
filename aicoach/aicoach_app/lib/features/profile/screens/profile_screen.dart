import 'package:flutter/material.dart';
import '../../../widgets/profile_header_section.dart';
import '../../../widgets/profile_stats_section.dart';
import '../../../widgets/profile_analytics_card.dart';
import '../../../widgets/profile_settings_section.dart';
import '../../../widgets/gofocus_pro_card.dart';
import '../../../widgets/profile/profile_app_bar.dart';
import '../../../app/navigation/route_names.dart';
import 'package:go_router/go_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: ProfileAppBar(),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // Header Section - Ekran genişliğinde
            const Padding(
              padding: EdgeInsets.only(bottom: 32),
              child: ProfileHeaderSection(),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column(
                children: [
                  ProfileStatsSection(),
                  const SizedBox(height: 24),
                  GofocusProCard(),
                  const SizedBox(height: 24),
                  Builder(
                    builder: (context) => ProfileAnalyticsCard(
                      onTap: () {
                        // Analytics report - navigate to analytics if route exists
                        // TODO: Add analytics route
                      },
                    ),
                  ),
                  const SizedBox(height: 24),
                  ProfileSettingsSection(),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

