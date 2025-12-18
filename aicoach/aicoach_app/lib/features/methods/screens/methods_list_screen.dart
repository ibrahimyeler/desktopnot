import 'package:flutter/material.dart';
import '../widgets/method_card.dart';

/// Methods List Screen - Shows all available productivity methods
class MethodsListScreen extends StatelessWidget {
  const MethodsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Metotlar',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Öne Çıkan Metotlar',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              MethodCard(
                id: '6-tasks',
                title: '6 İş Metodu',
                description: 'Günlük görevleri 3 kategoriye ayır: Kritik, Önemli, Az Önemli',
                icon: Icons.checklist,
                color: const Color(0xFFFFB800),
                progress: 65,
              ),
              MethodCard(
                id: 'chain-breaker',
                title: 'Zincir Kırma',
                description: 'Alışkanlık takibi ve günlük rutin oluşturma',
                icon: Icons.local_fire_department,
                color: const Color(0xFFFF6B6B),
                progress: 80,
              ),
              MethodCard(
                id: 'pomodoro',
                title: 'Pomodoro Tekniği',
                description: '25 dakika odaklan, 5 dakika dinlen',
                icon: Icons.timer,
                color: const Color(0xFF3B82F6),
                progress: 45,
              ),
              MethodCard(
                id: 'time-blocking',
                title: 'Zaman Bloklama',
                description: 'Gününü saat saat planla ve optimize et',
                icon: Icons.schedule,
                color: const Color(0xFF10B981),
                progress: 30,
              ),
              const SizedBox(height: 20),
              const Text(
                'Tüm Metotlar',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              MethodCard(
                id: 'priority-matrix',
                title: 'Öncelik Matrisi',
                description: 'Acil ve önemli görevleri önceliklendir',
                icon: Icons.grid_view,
                color: const Color(0xFF8B5CF6),
                progress: 0,
              ),
              MethodCard(
                id: 'eat-frog',
                title: 'Kurbağayı Ye',
                description: 'En zor görevi sabah ilk iş olarak yap',
                icon: Icons.pets,
                color: const Color(0xFFF59E0B),
                progress: 0,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
