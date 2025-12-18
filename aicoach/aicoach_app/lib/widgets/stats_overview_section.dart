import 'package:flutter/material.dart';

class StatsOverviewSection extends StatelessWidget {
  const StatsOverviewSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _AnimatedStatCard(
            label: 'Toplam Sohbet',
            value: '12',
            icon: Icons.chat_bubble_outline,
            color: const Color(0xFF6366F1),
            delay: const Duration(milliseconds: 0),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _AnimatedStatCard(
            label: 'Aktif Koçlar',
            value: '3',
            icon: Icons.people_outline,
            color: const Color(0xFF10B981),
            delay: const Duration(milliseconds: 100),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _AnimatedStatCard(
            label: 'Haftalık Hedef',
            value: '85%',
            icon: Icons.trending_up_outlined,
            color: const Color(0xFFF59E0B),
            delay: const Duration(milliseconds: 200),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _AnimatedStatCard(
            label: 'Motivasyon',
            value: '95%',
            icon: Icons.favorite_outline,
            color: const Color(0xFFEF4444),
            delay: const Duration(milliseconds: 300),
          ),
        ),
      ],
    );
  }
}

class _AnimatedStatCard extends StatefulWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final Duration delay;

  const _AnimatedStatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.delay,
  });

  @override
  State<_AnimatedStatCard> createState() => _AnimatedStatCardState();
}

class _AnimatedStatCardState extends State<_AnimatedStatCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _scaleAnimation = Tween<double>(begin: 0.9, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    Future.delayed(widget.delay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: _StatCard(
          label: widget.label,
          value: widget.value,
          icon: widget.icon,
          color: widget.color,
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: Colors.grey[400],
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
