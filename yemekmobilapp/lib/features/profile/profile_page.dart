import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../shared/widgets/app_scaffold.dart';
import '../cards/cards_page.dart';
import 'widgets/profile_menu_item.dart';

class ProfilePage extends StatelessWidget {
  final VoidCallback? onBack;

  ProfilePage({
    super.key,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 20),
          onPressed: () {
            if (onBack != null) {
              onBack!();
            } else if (Navigator.canPop(context)) {
              Navigator.pop(context);
            }
          },
          color: AppColors.textPrimary,
        ),
        title: Text(
          AppStrings.profileTitle,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profil bilgileri bölümü
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSizes.paddingL,
                vertical: AppSizes.paddingXL,
              ),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    AppColors.primaryLight,
                    AppColors.primary,
                  ],
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.accent.withOpacity(0.3),
                        width: 3,
                      ),
                    ),
                    child: const CircleAvatar(
                      radius: 48,
                      backgroundColor: AppColors.accent,
                      child: Icon(
                        Icons.person,
                        size: 48,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSizes.paddingM + 4),
                  const Text(
                    'Kullanıcı Adı',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textPrimary,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: AppSizes.paddingS),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.email_outlined,
                        size: 14,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: 6),
                      const Text(
                        'user@example.com',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Menü öğeleri bölümü
            Padding(
              padding: const EdgeInsets.all(AppSizes.paddingL),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: AppSizes.paddingM),
                  ProfileMenuItem(
                    icon: Icons.settings_outlined,
                    title: AppStrings.settings,
                    onTap: () {
                      // Navigate to settings
                    },
                  ),
                  ProfileMenuItem(
                    icon: Icons.account_balance_wallet_outlined,
                    title: AppStrings.walletTitle,
                    onTap: () {
                      // Navigate to wallet
                    },
                  ),
                  ProfileMenuItem(
                    icon: Icons.credit_card_outlined,
                    title: AppStrings.myCards,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (context) => const CardsPage(),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: AppSizes.paddingM),
                  ProfileMenuItem(
                    icon: Icons.logout_outlined,
                    title: AppStrings.logout,
                    isDestructive: true,
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(AppSizes.radiusL),
                          ),
                          title: const Text(
                            'Çıkış Yap',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          content: const Text(
                            'Çıkış yapmak istediğinize emin misiniz?',
                            style: TextStyle(
                              fontSize: 15,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.of(context).pop(),
                              child: const Text(
                                AppStrings.cancel,
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                Navigator.of(context).pop();
                                // Handle logout
                              },
                              child: const Text(
                                AppStrings.confirm,
                                style: TextStyle(
                                  color: AppColors.error,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: AppSizes.paddingXL),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
