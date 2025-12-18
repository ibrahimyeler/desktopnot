import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Coach Notes Screen - Shows notes related to coach
class CoachNotesScreen extends StatelessWidget {
  final String coachId;

  const CoachNotesScreen({
    super.key,
    required this.coachId,
  });

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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: const Center(
        child: Text(
          'Coach Notes Screen',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

