import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Coach Exercises Screen - Shows exercises related to coach
class CoachExercisesScreen extends StatelessWidget {
  final String coachId;

  const CoachExercisesScreen({
    super.key,
    required this.coachId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Egzersizler',
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
          'Coach Exercises Screen',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

