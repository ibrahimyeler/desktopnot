import 'package:flutter/material.dart';

import 'package:go_router/go_router.dart';
import '../../app/navigation/route_names.dart';

class ExecutiveNotesSection extends StatelessWidget {
  const ExecutiveNotesSection({super.key});

  @override
  Widget build(BuildContext context) {
    final notes = const [
      _ExecutiveNote(
        title: 'Haftalık Öncelikler',
        content: '''• Yatırım stratejisi
• Fitness lansman içerikleri
• Yazılım roadmap onayı''',
        tag: 'Strateji',
      ),
      _ExecutiveNote(
        title: 'CEO Notları',
        content: '''– Ekibin moralini ölç
– Ürün beta geri bildirimlerini incele
– Yeni iş birlikleri için 2 aday''',
        tag: 'Liderlik',
      ),
    ];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFF374151), width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF2563EB).withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.note_alt_outlined,
                  color: Color(0xFF60A5FA),
                  size: 18,
                ),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Not Defteri',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      'Gün içindeki kritik düşünceler ve karar maddeleri',
                      style: TextStyle(
                        fontSize: 11,
                        color: Color(0xFF9CA3AF),
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.add, size: 16),
                    label: const Text('Yeni Not'),
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFFFFB800),
                    ),
                  ),
                  const SizedBox(width: 4),
                  TextButton.icon(
                    onPressed: () {
                      context.push(AppRoutes.notes);
                    },
                    icon: const Icon(Icons.menu_book_outlined, size: 16),
                    label: const Text('Tüm Notlar'),
                    style: TextButton.styleFrom(
                      foregroundColor: const Color(0xFF60A5FA),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          ...notes.map(
            (note) => Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: const Color(0xFF111827),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: const Color(0xFF1F2937),
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 9,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2563EB).withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          note.tag,
                          style: const TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF93C5FD),
                          ),
                        ),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(
                          Icons.push_pin_outlined,
                          color: Color(0xFF9CA3AF),
                          size: 16,
                        ),
                        tooltip: 'Sabitle',
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    note.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    note.content,
                    style: const TextStyle(
                      fontSize: 12,
                      height: 1.45,
                      color: Color(0xFFCBD5F5),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ExecutiveNote {
  final String title;
  final String content;
  final String tag;

  const _ExecutiveNote({
    required this.title,
    required this.content,
    required this.tag,
  });
}
