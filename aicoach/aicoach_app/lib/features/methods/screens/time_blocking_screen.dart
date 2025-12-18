import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Time Blocking Planner Screen - Hourly time planning
class TimeBlockingScreen extends StatelessWidget {
  const TimeBlockingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hours = List.generate(24, (index) => index);

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Zaman Bloklama',
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
            icon: const Icon(Icons.auto_fix_high, color: Colors.white),
            onPressed: () {
              // AI auto-schedule
            },
            tooltip: 'AI ile Otomatik Planla',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Bugünün Planı',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              ...hours.map((hour) => _buildTimeBlock(hour)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimeBlock(int hour) {
    final hasTask = hour >= 9 && hour <= 17;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: hasTask ? const Color(0xFF1F2937) : const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 60,
            child: Text(
              '${hour.toString().padLeft(2, '0')}:00',
              style: TextStyle(
                color: Colors.grey[400],
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Expanded(
            child: hasTask
                ? Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFB800).withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: const Color(0xFFFFB800).withOpacity(0.5),
                      ),
                    ),
                    child: const Text(
                      'Çalışma Bloğu',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                      ),
                    ),
                  )
                : Text(
                    'Boş',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

