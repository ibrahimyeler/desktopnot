import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final surface = Theme.of(context).cardTheme.color ?? const Color(0xFF1E1F26);
    final onSurfaceVariant = colorScheme.onSurfaceVariant;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Ana Sayfa'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    colorScheme.primary,
                    colorScheme.primary.withValues(alpha: 0.7),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Hoş geldin, Kreatör! 👋',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: colorScheme.onPrimary,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Son 7 günde 12 UGC videosu oluşturdun. Harika içerik üretmeye devam! 🎥',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: colorScheme.onPrimary.withValues(alpha: 0.85),
                        ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton.icon(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorScheme.onPrimary,
                      foregroundColor: colorScheme.primary,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(Icons.movie_filter_outlined),
                    label: const Text(
                      'Yeni Video Oluştur',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            Text(
              'Performans Özeti',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.2,
              children: [
                _StatCard(
                  title: 'Aktif Proje',
                  value: '8',
                  icon: Icons.campaign_outlined,
                  color: const Color(0xFF7C4DFF),
                  surface: surface,
                  onSurfaceVariant: onSurfaceVariant,
                ),
                _StatCard(
                  title: 'Onay Oranı',
                  value: '92%',
                  icon: Icons.verified_outlined,
                  color: const Color(0xFF26A69A),
                  surface: surface,
                  onSurfaceVariant: onSurfaceVariant,
                ),
                _StatCard(
                  title: 'Haftalık Video',
                  value: '12',
                  icon: Icons.movie_creation_outlined,
                  color: const Color(0xFFFFB300),
                  surface: surface,
                  onSurfaceVariant: onSurfaceVariant,
                ),
                _StatCard(
                  title: 'Bekleyen Taslak',
                  value: '5',
                  icon: Icons.schedule_outlined,
                  color: const Color(0xFF42A5F5),
                  surface: surface,
                  onSurfaceVariant: onSurfaceVariant,
                ),
              ],
            ),
            const SizedBox(height: 24),

            Text(
              'Son Aktiviteler',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            ...[
              _ActivityTile(
                title: 'Summer Glow Kampanyası',
                subtitle: 'Video onaylandı • 2 saat önce',
                icon: Icons.check_circle_outline,
                iconColor: colorScheme.primary,
                backgroundColor: surface,
              ),
              _ActivityTile(
                title: 'Premium Gadget Lansmanı',
                subtitle: 'Revizyon talep edildi • 6 saat önce',
                icon: Icons.edit_note_outlined,
                iconColor: Colors.amber[400]!,
                backgroundColor: surface,
              ),
              _ActivityTile(
                title: 'Healthy Snacks Serisi',
                subtitle: 'Video teslim edildi • Dün',
                icon: Icons.send_outlined,
                iconColor: Colors.green[400]!,
                backgroundColor: surface,
              ),
            ],
            const SizedBox(height: 24),

            Text(
              'Hızlı Erişim',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: const [
                _QuickActionChip(
                  icon: Icons.auto_awesome_mosaic,
                  label: 'Taslaklar',
                ),
                _QuickActionChip(
                  icon: Icons.group_outlined,
                  label: 'Markalar',
                ),
                _QuickActionChip(
                  icon: Icons.analytics_outlined,
                  label: 'Analiz',
                ),
                _QuickActionChip(
                  icon: Icons.school_outlined,
                  label: 'Eğitim',
                ),
                _QuickActionChip(
                  icon: Icons.support_agent_outlined,
                  label: 'Destek',
                ),
              ],
            ),
            const SizedBox(height: 24),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                color: colorScheme.surfaceContainerHighest,
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.lightbulb_outline,
                    size: 36,
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'UGC İçerik İpuçu',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Markanın tonunu yakalamak için prompt içerisinde marka değerlerini mutlaka belirtmeyi unutma.',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.surface,
    required this.onSurfaceVariant,
  });

  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color surface;
  final Color onSurfaceVariant;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: onSurfaceVariant.withValues(alpha: 0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.black.withValues(alpha: 0.85)),
          ),
          const Spacer(),
          Text(
            value,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: onSurfaceVariant,
                ),
          ),
        ],
      ),
    );
  }
}

class _ActivityTile extends StatelessWidget {
  const _ActivityTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.iconColor,
    required this.backgroundColor,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color iconColor;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: backgroundColor,
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: iconColor.withValues(alpha: 0.15),
          child: Icon(icon, color: iconColor),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      ),
    );
  }
}

class _QuickActionChip extends StatelessWidget {
  const _QuickActionChip({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: colorScheme.surfaceContainerHighest,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: colorScheme.onSurfaceVariant),
          const SizedBox(width: 8),
          Text(label),
        ],
      ),
    );
  }
}
