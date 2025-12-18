import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Coach Goals Screen - Shows goals related to coach
class CoachGoalsScreen extends StatelessWidget {
  final String coachId;

  const CoachGoalsScreen({
    super.key,
    required this.coachId,
  });

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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: const Center(
        child: Text(
          'Coach Goals Screen',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

