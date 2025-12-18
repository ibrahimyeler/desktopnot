import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/note_item.dart';

/// Notes List Screen - Shows all notes
class NotesListScreen extends StatelessWidget {
  const NotesListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Notlar',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Colors.white),
            onPressed: () {
              // Search
            },
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            NoteItem(
              id: '1',
              title: 'Toplantı Notları',
              preview: 'Bugünkü ekip toplantısında konuşulan önemli noktalar...',
              createdAt: DateTime.now().subtract(const Duration(hours: 2)),
              tags: ['İş', 'Toplantı'],
            ),
            NoteItem(
              id: '2',
              title: 'Fikirler',
              preview: 'Yeni proje için aklıma gelen fikirler...',
              createdAt: DateTime.now().subtract(const Duration(days: 1)),
              tags: ['Fikir'],
            ),
            NoteItem(
              id: '3',
              title: 'Koç Önerileri',
              preview: 'AI koçundan aldığım öneriler ve tavsiyeler...',
              createdAt: DateTime.now().subtract(const Duration(days: 3)),
              tags: ['Koçluk'],
            ),
            NoteItem(
              id: '4',
              title: 'Kişisel Gelişim',
              preview: 'Kendimi geliştirmek için yapmam gerekenler...',
              createdAt: DateTime.now().subtract(const Duration(days: 5)),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.createNote),
        backgroundColor: const Color(0xFF3B82F6),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}

