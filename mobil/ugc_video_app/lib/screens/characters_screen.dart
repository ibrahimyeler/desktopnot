import 'package:flutter/material.dart';

class CharactersScreen extends StatefulWidget {
  const CharactersScreen({super.key, this.onBackToHome});

  final VoidCallback? onBackToHome;

  @override
  State<CharactersScreen> createState() => _CharactersScreenState();
}

class _CharactersScreenState extends State<CharactersScreen> {
  final _filters = const ['Hepsi', 'Realistik', '3D', 'Çizgi', 'Minimal'];
  int _selectedFilter = 0;

  List<_CharacterData> get _characters => const [
        _CharacterData(
          name: 'Luna',
          subtitle: 'Dinamik Fitness Koçu',
          style: '3D Neon',
          persona: 'Enerjik, motive edici ve pozitif',
          accent: 'İngilizce (ABD)',
          voice: 'Luna Energetic',
          color: Color(0xFF7C4DFF),
          tags: ['Fitness', 'Enerjik', 'Reels'],
        ),
        _CharacterData(
          name: 'Mira',
          subtitle: 'Minimalist Tasarım Uzmanı',
          style: 'Realistik Pastel',
          persona: 'Sakin, güven verici, estetik',
          accent: 'Türkçe (TR)',
          voice: 'Mira Calm',
          color: Color(0xFF26A69A),
          tags: ['Dekor', 'Realist', 'Tutorial'],
        ),
        _CharacterData(
          name: 'Nova',
          subtitle: 'Teknoloji Hikaye Anlatıcısı',
          style: 'Cyber Çizgi',
          persona: 'Merak uyandırıcı, hızlı, bilgi dolu',
          accent: 'İngilizce (UK)',
          voice: 'Nova Story',
          color: Color(0xFFFF7043),
          tags: ['Teknoloji', 'Çizgi', 'TikTok'],
        ),
        _CharacterData(
          name: 'Ada',
          subtitle: 'Wellness Arkadaşı',
          style: 'Minimal Flat',
          persona: 'Yumuşak, destekleyici, doğal',
          accent: 'Türkçe (TR)',
          voice: 'Ada Soft',
          color: Color(0xFF5C6BC0),
          tags: ['Wellness', 'Minimal', 'YouTube'],
        ),
      ];

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final filteredCharacters = _selectedFilter == 0
        ? _characters
        : _characters
            .where((character) =>
                character.tags.any((tag) => tag.toLowerCase().contains(_filters[_selectedFilter].toLowerCase())) ||
                character.style.toLowerCase().contains(_filters[_selectedFilter].toLowerCase()))
            .toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Karakterler'),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new),
          onPressed: widget.onBackToHome ?? () => Navigator.maybePop(context),
        ),
        actions: [
          IconButton(
            tooltip: 'Favoriler',
            onPressed: () {},
            icon: const Icon(Icons.favorite_border),
          ),
          IconButton(
            tooltip: 'Ara',
            onPressed: () {},
            icon: const Icon(Icons.search),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.auto_awesome),
        label: const Text('Oluştur'),
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 8),
              child: _CharacterHero(colorScheme: colorScheme),
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
                final character = filteredCharacters[index];
                return _CharacterCard(data: character, colorScheme: colorScheme);
              },
              separatorBuilder: (_, __) => const SizedBox(height: 16),
              itemCount: filteredCharacters.length,
            ),
          ),
        ],
      ),
    );
  }
}

class _CharacterHero extends StatelessWidget {
  const _CharacterHero({required this.colorScheme});

  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: LinearGradient(
          colors: [
            colorScheme.primary,
            colorScheme.primary.withValues(alpha: 0.5),
          ],
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Karakter ve Ses Stüdyosu',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  color: colorScheme.onPrimary,
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 8),
          Text(
            'Markana uygun avatarı seç, görünümünü düzenle ve sesini belirle. Çoklu platform için tek studio.',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: colorScheme.onPrimary.withValues(alpha: 0.85),
                ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: const [
              _HeroTag(icon: Icons.person_pin, label: '18 hazır karakter'),
              _HeroTag(icon: Icons.graphic_eq, label: '30+ ses tonu'),
              _HeroTag(icon: Icons.language, label: '12 dil & aksan'),
            ],
          ),
        ],
      ),
    );
  }
}

class _HeroTag extends StatelessWidget {
  const _HeroTag({required this.icon, required this.label});

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

class _CharacterData {
  const _CharacterData({
    required this.name,
    required this.subtitle,
    required this.style,
    required this.persona,
    required this.accent,
    required this.voice,
    required this.color,
    required this.tags,
  });

  final String name;
  final String subtitle;
  final String style;
  final String persona;
  final String accent;
  final String voice;
  final Color color;
  final List<String> tags;
}

class _CharacterCard extends StatelessWidget {
  const _CharacterCard({required this.data, required this.colorScheme});

  final _CharacterData data;
  final ColorScheme colorScheme;

  @override
  Widget build(BuildContext context) {
    final cardColor = Theme.of(context).cardTheme.color;
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        color: cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.28),
            blurRadius: 12,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Container(
            height: 180,
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(18)),
              gradient: LinearGradient(
                colors: [data.color, data.color.withValues(alpha: 0.45)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: Stack(
              children: [
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
                      data.style,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
                Align(
                  alignment: Alignment.bottomLeft,
                  child: Padding(
                    padding: const EdgeInsets.all(18),
                    child: Text(
                      data.name,
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
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
                Text(
                  data.subtitle,
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
                const SizedBox(height: 8),
                Text(
                  data.persona,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: colorScheme.onSurfaceVariant,
                      ),
                ),
                const SizedBox(height: 14),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: data.tags
                      .map(
                        (tag) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(10),
                            color: colorScheme.surfaceContainerHighest,
                          ),
                          child: Text(
                            tag,
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ),
                      )
                      .toList(),
                ),
                const SizedBox(height: 18),
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(14),
                    color: colorScheme.surfaceContainerHighest,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.graphic_eq, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            'Ses: ${data.voice}',
                            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                  fontWeight: FontWeight.w600,
                                ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      Wrap(
                        spacing: 8,
                        children: [
                          _VoiceChip(icon: Icons.record_voice_over, label: data.accent),
                          const _VoiceChip(icon: Icons.music_note_outlined, label: 'Modülasyon +'),
                          const _VoiceChip(icon: Icons.mic_none_outlined, label: 'Ses Klonla'),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    OutlinedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.visibility_outlined),
                      label: const Text('Önizle'),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.tune),
                      label: const Text('Özelleştir'),
                    ),
                    const Spacer(),
                    IconButton(
                      tooltip: 'Favorilere ekle',
                      onPressed: () {},
                      icon: const Icon(Icons.favorite_border),
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
}

class _VoiceChip extends StatelessWidget {
  const _VoiceChip({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: colorScheme.surface,
        border: Border.all(color: colorScheme.outline.withValues(alpha: 0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 6),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}
