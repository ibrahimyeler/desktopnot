import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../widgets/transcript_item.dart';

/// Transcript History Screen - Shows voice conversation history
class TranscriptHistoryScreen extends StatelessWidget {
  const TranscriptHistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Ses Geçmişi',
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
            icon: const Icon(Icons.delete_outline, color: Colors.white),
            onPressed: () {
              // Clear history
            },
          ),
        ],
      ),
      body: SafeArea(
        child: ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: 10,
          itemBuilder: (context, index) {
            return TranscriptItem(
              id: 'transcript_$index',
              transcript: 'Bugün nasıl yardımcı olabilirim?',
              response: 'Merhaba! Bugün size yardımcı olmak için buradayım. Hangi konuda destek istersiniz?',
              createdAt: DateTime.now().subtract(Duration(hours: index + 1)),
            );
          },
        ),
      ),
    );
  }
}

