import 'package:flutter/material.dart';
import '../../../widgets/home_header_section.dart';
import '../../../widgets/home/today_tasks_widget.dart';
import '../../../widgets/executive_overview_section.dart';
import '../../../widgets/executive_assistant_card.dart';
import '../../../widgets/executive_agenda_section.dart';
import '../../../widgets/quick_access_section.dart';
import '../../../widgets/featured_coaches_section.dart';
import '../../../widgets/recent_activity_section.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1. Home Header Section (üst bar)
              const HomeHeaderSection(),
              const SizedBox(height: 16),
              
              // 2. Today's Tasks Widget (Header altında sleek görevler)
              const TodayTasksWidget(),
              const SizedBox(height: 20),
              
              // 3. Executive Overview – 4 Mini Metrik Kartı
              ExecutiveOverviewSection(),
              const SizedBox(height: 20),
              
              // 3. Executive Assistant / AI Coach Quick Action Card
              ExecutiveAssistantCard(),
              const SizedBox(height: 20),
              
              // 4. Executive Agenda – Mini To-do List (3 madde)
              ExecutiveAgendaSection(),
              const SizedBox(height: 20),
              
              // 5. Quick Access Shortcuts
              QuickAccessSection(),
              const SizedBox(height: 20),
              
              // 6. Featured Coach (MVP'de 1 tane - Lina)
              FeaturedCoachesSection(),
              const SizedBox(height: 20),
              
              // 7. Recent Activity (Son 3 aktivite)
              RecentActivitySection.defaultActivities(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
