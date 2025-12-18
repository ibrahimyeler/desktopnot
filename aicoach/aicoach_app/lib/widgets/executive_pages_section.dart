import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../app/navigation/route_names.dart';

class ExecutivePagesSection extends StatelessWidget {
  const ExecutivePagesSection({super.key});

  @override
  Widget build(BuildContext context) {
    final pages = [
      _ExecutivePage(
        title: 'Performans',
        subtitle: 'Raporlar ve metrikler',
        icon: Icons.analytics_outlined,
        background: const Color(0xFFFFB800),
        onTap: (context) => context.push(AppRoutes.profileAnalytics),
      ),
      _ExecutivePage(
        title: 'Koçlar',
        subtitle: 'Koçlarınızı yönetin',
        icon: Icons.groups_outlined,
        background: const Color(0xFF3B82F6),
        onTap: (context) => context.push(AppRoutes.coaches),
      ),
      _ExecutivePage(
        title: 'Hedefler',
        subtitle: 'Öncelik listesi',
        icon: Icons.flag_outlined,
        background: const Color(0xFF10B981),
        onTap: (context) => context.push(AppRoutes.goals),
      ),
      _ExecutivePage(
        title: 'Geçmiş',
        subtitle: 'Tüm uyarılar',
        icon: Icons.notifications_outlined,
        background: const Color(0xFFF97316),
        onTap: (context) => context.push(AppRoutes.notificationSettings),
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Yönetici Sayfaları',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 14),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: pages
              .map(
                (page) => _ExecutivePageButton(page: page),
              )
              .toList(),
        ),
      ],
    );
  }
}

class _ExecutivePageButton extends StatelessWidget {
  final _ExecutivePage page;

  const _ExecutivePageButton({required this.page});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          if (page.onTap != null) {
            page.onTap!(context);
          }
        },
        borderRadius: BorderRadius.circular(18),
        child: Container(
          width: 180,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: const Color(0xFF1F2937),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFF374151), width: 1),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: page.background.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  page.icon,
                  color: page.background,
                  size: 20,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                page.title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                page.subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[400],
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Text(
                    'Detaya Git',
                    style: TextStyle(
                      color: page.background,
                      fontWeight: FontWeight.w600,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Icon(
                    Icons.arrow_forward_rounded,
                    color: page.background,
                    size: 16,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ExecutivePage {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color background;
  final void Function(BuildContext)? onTap;

  const _ExecutivePage({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.background,
    this.onTap,
  });
}


