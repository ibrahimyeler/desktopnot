import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final cardColor = Theme.of(context).cardTheme.color ?? const Color(0xFF1E1F26);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.settings_outlined),
            tooltip: 'Ayarlar',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        colorScheme.primary,
                        colorScheme.primary.withValues(alpha: 0.5),
                      ],
                    ),
                  ),
                  child: const Center(
                    child: Text(
                      'EZ',
                      style: TextStyle(
                        fontSize: 28,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Ezgi Karaman',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Senior UGC Content Creator',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: colorScheme.onSurfaceVariant,
                            ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Icon(Icons.location_on_outlined, size: 18, color: colorScheme.onSurfaceVariant),
                          const SizedBox(width: 4),
                          Text('İstanbul, Türkiye', style: Theme.of(context).textTheme.bodySmall),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () {},
                  icon: const Icon(Icons.edit_outlined),
                  tooltip: 'Profili Düzenle',
                ),
              ],
            ),
            const SizedBox(height: 24),

            Row(
              children: const [
                _ProfileStat(label: 'Toplam Video', value: '148'),
                SizedBox(width: 12),
                _ProfileStat(label: 'Aktif Kampanya', value: '6'),
                SizedBox(width: 12),
                _ProfileStat(label: 'Onay Oranı', value: '%94'),
              ],
            ),
            const SizedBox(height: 24),

            Text(
              'Hakkımda',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            const Text(
              'Markalar için etkileyici hikayeler anlatmayı ve ürünleri gerçek kullanıcı deneyimleriyle buluşturmayı seviyorum. Son iki yılda 20+ marka için 140’tan fazla UGC videosu ürettim.',
            ),
            const SizedBox(height: 24),

            Text(
              'Uzmanlık Alanları',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: const [
                _ChipPill(icon: Icons.face_retouching_natural, label: 'Beauty & Care'),
                _ChipPill(icon: Icons.fitness_center_outlined, label: 'Fitness'),
                _ChipPill(icon: Icons.kitchen_outlined, label: 'Healthy Food'),
                _ChipPill(icon: Icons.home_outlined, label: 'Home Decor'),
                _ChipPill(icon: Icons.light_mode_outlined, label: 'Lifestyle'),
              ],
            ),
            const SizedBox(height: 24),

            Text(
              'Hesap Ayarları',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 12),
            Card(
              color: cardColor,
              child: Column(
                children: const [
                  _SettingsTile(
                    icon: Icons.person_outline,
                    title: 'Profil Bilgileri',
                    subtitle: 'Ad, iletişim, sosyal profiller',
                  ),
                  Divider(height: 0),
                  _SettingsTile(
                    icon: Icons.palette_outlined,
                    title: 'Üretim Tercihleri',
                    subtitle: 'Format, dil, ses, marka tonu',
                  ),
                  Divider(height: 0),
                  _SettingsTile(
                    icon: Icons.attach_money_outlined,
                    title: 'Ödeme Ayarları',
                    subtitle: 'Faturalandırma, banka bilgileri',
                  ),
                  Divider(height: 0),
                  _SettingsTile(
                    icon: Icons.privacy_tip_outlined,
                    title: 'Gizlilik ve Güvenlik',
                    subtitle: 'İki faktör, oturum yönetimi',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.logout),
              label: const Text('Çıkış Yap'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red[300],
                side: const BorderSide(color: Color(0x66FF5252)),
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileStat extends StatelessWidget {
  const _ProfileStat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: colorScheme.surfaceContainerHighest,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ChipPill extends StatelessWidget {
  const _ChipPill({required this.icon, required this.label});

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        color: colorScheme.surfaceContainerHighest,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 18, color: colorScheme.onSurfaceVariant),
          const SizedBox(width: 8),
          Text(label),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
  });

  final IconData icon;
  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: Theme.of(context).colorScheme.primary),
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold),
      ),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: () {},
    );
  }
}
