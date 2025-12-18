import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';

/// Method Detail Screen - Shows detailed information about a method
class MethodDetailScreen extends StatelessWidget {
  final String methodId;

  const MethodDetailScreen({
    super.key,
    required this.methodId,
  });

  @override
  Widget build(BuildContext context) {
    // Method data based on ID (in real app, fetch from service)
    final methodData = _getMethodData(methodId);

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: Text(
          methodData['title'] ?? 'Metot Detayı',
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Method icon and title
              Center(
                child: Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: (methodData['color'] as Color).withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    methodData['icon'] as IconData,
                    color: methodData['color'] as Color,
                    size: 64,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              
              // Description
              Text(
                methodData['description'] ?? '',
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 32),

              // Features
              const Text(
                'Özellikler',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ...(methodData['features'] as List<String>).map((feature) => 
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(
                        Icons.check_circle,
                        color: methodData['color'] as Color,
                        size: 20,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          feature,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Start button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => context.push(AppRoutes.methodStart(methodId)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: methodData['color'] as Color,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Metodu Başlat',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Map<String, dynamic> _getMethodData(String id) {
    final methods = {
      '6-tasks': {
        'title': '6 İş Metodu',
        'description': 'Günlük görevlerinizi 3 kategoriye ayırın: 1 Kritik iş, 2 Önemli iş, 3 Az önemli iş. Bu metod ile gününüzü daha verimli planlayın ve odaklanın.',
        'icon': Icons.checklist,
        'color': const Color(0xFFFFB800),
        'features': [
          'Günlük görevleri otomatik kategorize et',
          'Kritik görevlere öncelik ver',
          'Günlük ilerleme takibi',
          'AI destekli önceliklendirme',
        ],
      },
      'chain-breaker': {
        'title': 'Zincir Kırma',
        'description': 'Alışkanlık oluşturma ve sürdürme metodudur. Her gün tamamladığınız alışkanlıklar için zincir oluşturun ve kırılmasını önleyin.',
        'icon': Icons.local_fire_department,
        'color': const Color(0xFFFF6B6B),
        'features': [
          'Alışkanlık takip takvimi',
          'Zincir kırılma uyarıları',
          'İstatistikler ve grafikler',
          'Motivasyon rozetleri',
        ],
      },
      'pomodoro': {
        'title': 'Pomodoro Tekniği',
        'description': '25 dakika odaklanma, 5 dakika mola döngüsü ile çalışma verimliliğinizi artırın.',
        'icon': Icons.timer,
        'color': const Color(0xFF3B82F6),
        'features': [
          'Özelleştirilebilir zamanlayıcı',
          'Otomatik mola hatırlatıcıları',
          'Günlük pomodoro istatistikleri',
          'Focus mode desteği',
        ],
      },
      'time-blocking': {
        'title': 'Zaman Bloklama',
        'description': 'Gününüzü saat saat planlayın ve görevlerinizi zaman bloklarına atayın.',
        'icon': Icons.schedule,
        'color': const Color(0xFF10B981),
        'features': [
          'Sürükle-bırak zaman planlaması',
          'AI destekli otomatik planlama',
          'Haftalık görünüm',
          'Çakışma uyarıları',
        ],
      },
    };

    return methods[id] ?? {
      'title': 'Bilinmeyen Metot',
      'description': 'Metot bulunamadı',
      'icon': Icons.help_outline,
      'color': Colors.grey,
      'features': [],
    };
  }
}

