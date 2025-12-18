import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';

class QuickActions extends StatelessWidget {
  final VoidCallback? onWalletTap;
  final VoidCallback? onOrderTap;
  final VoidCallback? onSubscriptionTap;

  const QuickActions({
    super.key,
    this.onWalletTap,
    this.onOrderTap,
    this.onSubscriptionTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _ActionButton(
          icon: Icons.account_balance_wallet,
          label: 'Cüzdan',
          onTap: onWalletTap,
        ),
        _ActionButton(
          icon: Icons.shopping_cart,
          label: 'Sipariş',
          onTap: onOrderTap,
        ),
        _ActionButton(
          icon: Icons.subscriptions,
          label: 'Abonelik',
          onTap: onSubscriptionTap,
        ),
      ],
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;

  const _ActionButton({
    required this.icon,
    required this.label,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSizes.radiusM),
      child: Container(
        padding: const EdgeInsets.all(AppSizes.paddingM),
        decoration: BoxDecoration(
          color: AppColors.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(AppSizes.radiusM),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: AppColors.primary, size: AppSizes.iconL),
            const SizedBox(height: AppSizes.paddingS),
            Text(
              label,
              style: const TextStyle(
                color: AppColors.primary,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

