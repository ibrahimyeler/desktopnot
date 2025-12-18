import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/goal_item.dart';

/// Goals List Screen - Shows all goals
class GoalsListScreen extends StatelessWidget {
  const GoalsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Hedefler',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Aktif Hedefler',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              GoalItem(
                id: '1',
                title: 'İngilizce Seviyemi Geliştir',
                description: 'B1 seviyesinden B2 seviyesine çıkmak',
                progress: 65,
                deadline: DateTime.now().add(const Duration(days: 90)),
                status: 'active',
              ),
              GoalItem(
                id: '2',
                title: 'Fitness Rutini Oluştur',
                description: 'Haftada 3 kez spor yapmak',
                progress: 45,
                deadline: DateTime.now().add(const Duration(days: 60)),
                status: 'active',
              ),
              const SizedBox(height: 32),
              const Text(
                'Tamamlanan Hedefler',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              GoalItem(
                id: '3',
                title: 'Kitap Okuma Alışkanlığı',
                description: 'Ayda 2 kitap okumak',
                progress: 100,
                status: 'completed',
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.createGoal),
        backgroundColor: const Color(0xFF10B981),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

