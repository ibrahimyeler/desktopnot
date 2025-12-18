import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';

/// Note Detail Screen - Shows detailed note content
class NoteDetailScreen extends StatelessWidget {
  final String noteId;

  const NoteDetailScreen({
    super.key,
    required this.noteId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Not Detayı',
          style: TextStyle(
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
        actions: [
          IconButton(
            icon: const Icon(Icons.edit, color: Colors.white),
            onPressed: () => context.push(AppRoutes.editNote(noteId)),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.red),
            onPressed: () {
              // Delete note
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              const Text(
                'Toplantı Notları',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.access_time, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    '2 saat önce',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              
              // Tags
              Wrap(
                spacing: 8,
                children: [
                  _buildTag('İş'),
                  _buildTag('Toplantı'),
                ],
              ),
              const SizedBox(height: 24),
              
              // Content
              const Text(
                'Bugünkü ekip toplantısında konuşulan önemli noktalar:\n\n'
                '1. Yeni proje planlaması\n'
                '2. Sprint hedefleri\n'
                '3. Takım üyelerinin görev dağılımı\n\n'
                'Önemli kararlar:\n'
                '- Proje başlangıç tarihi: 1 Ocak\n'
                '- Haftalık review toplantıları\n'
                '- İletişim kanalları belirlendi',
                style: TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 32),
              
              // Actions
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        // AI summarize
                      },
                      icon: const Icon(Icons.auto_awesome, color: Color(0xFF3B82F6)),
                      label: const Text(
                        'AI Özetle',
                        style: TextStyle(color: Color(0xFF3B82F6)),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF3B82F6)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () {
                        // Export PDF
                      },
                      icon: const Icon(Icons.picture_as_pdf, color: Color(0xFF3B82F6)),
                      label: const Text(
                        'PDF Olarak Dışa Aktar',
                        style: TextStyle(color: Color(0xFF3B82F6)),
                      ),
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0xFF3B82F6)),
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTag(String tag) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF3B82F6).withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF3B82F6),
        ),
      ),
      child: Text(
        tag,
        style: const TextStyle(
          color: Color(0xFF3B82F6),
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

