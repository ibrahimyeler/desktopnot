import 'package:flutter/material.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key, this.onBackToHome});

  final VoidCallback? onBackToHome;

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final _filters = const ['Hepsi', 'Onaylandı', 'Yayınlandı', 'Revizyon', 'Taslak'];
  int _selectedFilter = 0;

  List<_LibraryItem> get _items => [
        _LibraryItem(
          title: 'GlowUp Serum Lansmanı',
          date: DateTime(2025, 11, 5),
          duration: '00:42',
          status: 'Onaylandı',
          statusColor: Colors.green[400]!,
          thumbnailColor: const Color(0xFF7E57C2),
          campaign: 'Glow Cosmetics',
          views: '12.4K',
          platform: 'Instagram Reels',
        ),
        _LibraryItem(
          title: 'SmartFit Saat Review',
          date: DateTime(2025, 11, 2),
          duration: '01:05',
          status: 'Revizyon Bekleniyor',
          statusColor: Colors.orange[400]!,
          thumbnailColor: const Color(0xFF26A69A),
          campaign: 'SmartFit',
          views: '8.1K',
          platform: 'TikTok',
        ),
        _LibraryItem(
          title: 'HealthySnack Challenge',
          date: DateTime(2025, 10, 28),
          duration: '00:58',
          status: 'Yayınlandı',
          statusColor: Colors.blue[400]!,
          thumbnailColor: const Color(0xFFFF7043),
          campaign: 'HealthySnack Co.',
          views: '25.6K',
          platform: 'YouTube Shorts',
        ),
        _LibraryItem(
          title: 'Minimalist Decor Story',
          date: DateTime(2025, 10, 24),
          duration: '00:37',
          status: 'Taslak',
          statusColor: Colors.purple[400]!,
          thumbnailColor: const Color(0xFF42A5F5),
          campaign: 'NordicHome',
          views: '-',
          platform: 'Instagram Story',
        ),
      ];

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final cardColor = Theme.of(context).cardTheme.color ?? const Color(0xFF1E1F26);

    final filteredItems = _selectedFilter == 0
        ? _items
        : _items.where((item) => item.status.toLowerCase().contains(_filters[_selectedFilter].toLowerCase())).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Video Kütüphanesi'),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: widget.onBackToHome ?? () => Navigator.maybePop(context),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.filter_list),
            tooltip: 'Filtrele',
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.more_vert),
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
              child: _LibraryHero(colorScheme: colorScheme, itemsCount: _items.length),
            ),
          ),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 44,
              child: ListView.separated(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                scrollDirection: Axis.horizontal,
                itemBuilder: (context, index) {
                  final isSelected = _selectedFilter == index;
                  return ChoiceChip(
                    label: Text(_filters[index]),
                    selected: isSelected,
                    onSelected: (_) => setState(() => _selectedFilter = index),
                    selectedColor: colorScheme.primary.withValues(alpha: 0.2),
                    backgroundColor: colorScheme.surfaceContainerHighest,
                    labelStyle: TextStyle(
                      color: isSelected ? colorScheme.primary : colorScheme.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
                  );
                },
                separatorBuilder: (_, __) => const SizedBox(width: 12),
                itemCount: _filters.length,
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            sliver: SliverList.separated(
              itemBuilder: (context, index) {
                final item = filteredItems[index];
                return _LibraryCard(
                  item: item,
                  cardColor: cardColor,
                  colorScheme: colorScheme,
                );
              },
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemCount: filteredItems.length,
            ),
          ),
        ],
      ),
    );
  }
}

class _LibraryHero extends StatelessWidget {
  const _LibraryHero({required this.colorScheme, required this.itemsCount});

  final ColorScheme colorScheme;
  final int itemsCount;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            colorScheme.secondary,
            colorScheme.secondary.withValues(alpha: 0.5),
          ],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Video Kütüphanen',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onSecondary,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Tüm UGC videoların tek yerde. Onay durumuna göre filtrele, yeniden indirin ya da paylaşın.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onSecondary.withValues(alpha: 0.85),
                ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _HeroBadge(icon: Icons.video_library_outlined, label: '$itemsCount video'),
              const _HeroBadge(icon: Icons.publish_outlined, label: '%78 yayınlandı'),
              const _HeroBadge(icon: Icons.access_time, label: 'Son video: 3 gün önce'),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroBadge extends StatelessWidget {
  const _HeroBadge({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.18),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: Colors.white),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }
}

class _LibraryItem {
  const _LibraryItem({
    required this.title,
    required this.date,
    required this.duration,
    required this.status,
    required this.statusColor,
    required this.thumbnailColor,
    required this.campaign,
    required this.views,
    required this.platform,
  });

  final String title;
  final DateTime date;
  final String duration;
  final String status;
  final Color statusColor;
  final Color thumbnailColor;
  final String campaign;
  final String views;
  final String platform;
}

class _LibraryCard extends StatelessWidget {
  const _LibraryCard({
    required this.item,
    required this.cardColor,
    required this.colorScheme,
  });

  final _LibraryItem item;
  final Color cardColor;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 14,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            height: 180,
            decoration: BoxDecoration(
              color: item.thumbnailColor,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
            ),
            child: Stack(
              children: [
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Colors.black.withValues(alpha: 0.45),
                        ],
                      ),
                    ),
                  ),
                ),
                Center(
                  child: Container(
                    width: 68,
                    height: 68,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.play_arrow_rounded,
                      size: 40,
                      color: item.thumbnailColor,
                    ),
                  ),
                ),
                Positioned(
                  top: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.25),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      item.platform,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.title,
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.bold,
                                ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            item.campaign,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                  color: colorScheme.onSurfaceVariant,
                                ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: item.statusColor.withValues(alpha: 0.18),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        item.status,
                        style: TextStyle(
                          color: item.statusColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 16,
                  runSpacing: 8,
                  children: [
                    _MetaRow(
                      icon: Icons.calendar_today_outlined,
                      value: _formatDate(item.date),
                    ),
                    _MetaRow(
                      icon: Icons.timer_outlined,
                      value: item.duration,
                    ),
                    _MetaRow(
                      icon: Icons.bar_chart_outlined,
                      value: '${item.views} izlenme',
                    ),
                  ],
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.play_arrow),
                      label: const Text('İzle'),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        side: BorderSide(color: colorScheme.outline.withValues(alpha: 0.3)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.download_outlined),
                      label: const Text('İndir'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      tooltip: 'Paylaş',
                      onPressed: () {},
                      icon: const Icon(Icons.share_outlined),
                    ),
                    IconButton(
                      tooltip: 'Daha fazla',
                      onPressed: () {},
                      icon: const Icon(Icons.more_vert),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}.${date.month.toString().padLeft(2, '0')}.${date.year}';
  }
}

class _MetaRow extends StatelessWidget {
  const _MetaRow({required this.icon, required this.value});

  final IconData icon;
  final String value;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 18, color: colorScheme.onSurfaceVariant),
        const SizedBox(width: 6),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
      ],
    );
  }
}
