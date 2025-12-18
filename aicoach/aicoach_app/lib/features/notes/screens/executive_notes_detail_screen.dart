import 'package:flutter/material.dart';

class ExecutiveNotesDetailScreen extends StatelessWidget {
  const ExecutiveNotesDetailScreen({super.key});

  List<Map<String, String>> _notes() {
    return [
      {
        'title': 'Finans - Strateji Aksiyonları',
        'tag': 'Finans',
        'content':
            '• Likidite oranlarını haftalık takip için panoya ekle\n'
            '• Yeni yatırım fırsatları için asistanı yönlendir\n'
            '• Risk portföyü %20 sınırını aşmamalı',
      },
      {
        'title': 'Ürün - Yapılacaklar',
        'tag': 'Ürün',
        'content':
            '• AI koç bileşenlerinde UX iyileştirme yapılacak\n'
            '• Performans raporu için metrik seti finalize edilecek\n'
            '• Haftalık sürüm planı ekiplerle paylaşılacak',
      },
      {
        'title': 'Takım Notları',
        'tag': 'İnsan',
        'content':
            '• Takım moral check-in perşembe günü yapılacak\n'
            '• Uzaktan çalışma yönergesi güncellenecek\n'
            '• Kariyer gelişim planları gözden geçirilecek',
      },
      {
        'title': 'Kişisel Gelişim',
        'tag': 'Kişisel',
        'content':
            '• Haftada 3 gün fitness koçu ile cardio planına uy\n'
            '• Aylık öğrenme hedefleri: AI Ops ve Growth\n'
            '• Haftalık refleksiyon notlarını Cuma yaz',
      },
    ];
  }

  @override
  Widget build(BuildContext context) {
    final notes = _notes();

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Not Defteri',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.search, color: Colors.white),
            tooltip: 'Notlarda ara',
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: const Color(0xFFFFB800),
        foregroundColor: const Color(0xFF111827),
        icon: const Icon(Icons.add),
        label: const Text(
          'Yeni Not',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
      ),
      body: ListView.separated(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 96),
        physics: const BouncingScrollPhysics(),
        itemCount: notes.length + 1,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          if (index == 0) {
            return Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: const Color(0xFF1F2937),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: const Color(0xFF374151), width: 1),
              ),
              child: const Text(
                'Tüm koçlardan gelen içgörüleri hızlıca not alıp kategorize edebilirsiniz. '
                'Notlar, asistan tarafından taranarak öncelikleri belirlemenize yardımcı olur.',
                style: TextStyle(
                  color: Color(0xFFCBD5F5),
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
            );
          }

          final note = notes[index - 1];

          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF374151), width: 1),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding:
                          const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        note['tag']!,
                        style: const TextStyle(
                          color: Color(0xFF93C5FD),
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(
                        Icons.push_pin_outlined,
                        color: Color(0xFF9CA3AF),
                        size: 18,
                      ),
                      tooltip: 'Sabitle',
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: const Icon(
                        Icons.more_vert,
                        color: Color(0xFF9CA3AF),
                      ),
                      tooltip: 'Daha fazla',
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  note['title']!,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  note['content']!,
                  style: const TextStyle(
                    color: Color(0xFFCBD5F5),
                    fontSize: 13,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    TextButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.edit_outlined, size: 18),
                      label: const Text('Düzenle'),
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFFFFB800),
                      ),
                    ),
                    const SizedBox(width: 8),
                    TextButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.archive_outlined, size: 18),
                      label: const Text('Arşivle'),
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFF9CA3AF),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}


