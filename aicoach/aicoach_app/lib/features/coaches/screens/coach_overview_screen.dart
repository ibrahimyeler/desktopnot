import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Coach Overview Screen - Shows coach statistics and overview
class CoachOverviewScreen extends StatelessWidget {
  final String coachId;

  const CoachOverviewScreen({
    super.key,
    required this.coachId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Genel Bakış',
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
          'Coach Overview Screen',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }
}

