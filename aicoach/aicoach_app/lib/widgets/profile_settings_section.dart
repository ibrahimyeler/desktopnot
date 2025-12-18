import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../app/navigation/route_names.dart';
import '../features/profile/screens/notifications_screen.dart';
import '../features/profile/screens/theme_screen.dart';
import '../features/profile/screens/language_screen.dart';
import 'profile/profile_settings_item.dart';

class ProfileSettingsSection extends StatelessWidget {
  const ProfileSettingsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF374151),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.settings_outlined,
                size: 18,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'Ayarlar',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        ProfileSettingsItem(
          icon: Icons.notifications_outlined,
          title: 'Bildirimler',
          subtitle: 'Tüm bildirimlerinizi görüntüleyin',
          onTap: (context) {
            context.push(AppRoutes.notificationSettings);
          },
        ),
        ProfileSettingsItem(
          icon: Icons.palette_outlined,
          title: 'Tema',
          subtitle: 'Koyu tema ve diğer ayarlar',
          onTap: (context) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const ThemeScreen(),
              ),
            );
          },
        ),
        ProfileSettingsItem(
          icon: Icons.language_outlined,
          title: 'Dil',
          subtitle: 'Uygulama dili',
          onTap: (context) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => const LanguageScreen(),
              ),
            );
          },
        ),
        ProfileSettingsItem(
          icon: Icons.psychology_outlined,
          title: 'AI Model Ayarları',
          subtitle: 'AI model ve ayarları',
          onTap: (context) {
            context.push(AppRoutes.aiModelSettings);
          },
        ),
        ProfileSettingsItem(
          icon: Icons.mic_outlined,
          title: 'Ses Ayarları',
          subtitle: 'Sesli koç ayarları',
          onTap: (context) {
            context.push(AppRoutes.voiceSettings);
          },
        ),
        ProfileSettingsItem(
          icon: Icons.account_circle_outlined,
          title: 'Hesap Yönetimi',
          subtitle: 'Hesap bilgileri ve güvenlik',
          onTap: (context) {
            context.push(AppRoutes.accountManagement);
          },
        ),
        ProfileSettingsItem(
          icon: Icons.star_outline,
          title: 'Premium',
          subtitle: 'Abonelik ve premium özellikler',
          onTap: (context) {
            context.push(AppRoutes.subscription);
          },
        ),
        ProfileSettingsItem(
          icon: Icons.logout,
          title: 'Çıkış Yap',
          subtitle: 'Hesabınızdan çıkış yapın',
          showTrailing: false,
          textColor: Colors.red,
        ),
      ],
    );
  }
}

