import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../order_view_model.dart';

class OrderTypeSelector extends StatelessWidget {
  final OrderType selectedType;
  final bool canSelectDelivery;
  final Function(OrderType) onTypeChanged;

  const OrderTypeSelector({
    super.key,
    required this.selectedType,
    required this.canSelectDelivery,
    required this.onTypeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: AppSizes.paddingL),
      padding: const EdgeInsets.all(AppSizes.paddingM),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radiusM),
        border: Border.all(
          color: AppColors.border,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(
                Icons.local_shipping,
                size: 20,
                color: AppColors.primary,
              ),
              const SizedBox(width: AppSizes.paddingS),
              const Text(
                'Sipariş Tipi',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSizes.paddingM),
          Row(
            children: [
              Expanded(
                child: _OrderTypeOption(
                  icon: Icons.store,
                  title: 'Gel Al',
                  subtitle: 'Kurye ücreti yok',
                  type: OrderType.pickup,
                  selectedType: selectedType,
                  onTap: () => onTypeChanged(OrderType.pickup),
                ),
              ),
              const SizedBox(width: AppSizes.paddingM),
              Expanded(
                child: _OrderTypeOption(
                  icon: Icons.delivery_dining,
                  title: 'Teslim Edilecek',
                  subtitle: 'Kurye ücreti var',
                  type: OrderType.delivery,
                  selectedType: selectedType,
                  onTap: canSelectDelivery
                      ? () => onTypeChanged(OrderType.delivery)
                      : null,
                  disabled: !canSelectDelivery,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _OrderTypeOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final OrderType type;
  final OrderType selectedType;
  final VoidCallback? onTap;
  final bool disabled;

  const _OrderTypeOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.type,
    required this.selectedType,
    this.onTap,
    this.disabled = false,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = selectedType == type;
    final isDisabled = disabled || onTap == null;

    return InkWell(
      onTap: isDisabled ? null : onTap,
      borderRadius: BorderRadius.circular(AppSizes.radiusM),
      child: Container(
        padding: const EdgeInsets.all(AppSizes.paddingM),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.15)
              : (isDisabled
                  ? AppColors.backgroundColor.withOpacity(0.5)
                  : AppColors.backgroundColor),
          border: Border.all(
            color: isSelected
                ? AppColors.primary
                : (isDisabled
                    ? AppColors.border.withOpacity(0.5)
                    : AppColors.border),
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(AppSizes.radiusM),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 32,
              color: isSelected
                  ? AppColors.primary
                  : (isDisabled
                      ? AppColors.textSecondary.withOpacity(0.5)
                      : AppColors.textSecondary),
            ),
            const SizedBox(height: AppSizes.paddingS),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: isSelected
                    ? AppColors.primary
                    : (isDisabled
                        ? AppColors.textSecondary.withOpacity(0.5)
                        : AppColors.textPrimary),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: TextStyle(
                fontSize: 11,
                color: isDisabled
                    ? AppColors.textSecondary.withOpacity(0.5)
                    : AppColors.textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            if (isSelected)
              Padding(
                padding: const EdgeInsets.only(top: AppSizes.paddingS),
                child: Icon(
                  Icons.check_circle,
                  size: 20,
                  color: AppColors.primary,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

