import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../shared/widgets/primary_button.dart';

class OrderPaymentSection extends StatelessWidget {
  final double totalAmount;
  final String selectedPaymentMethod;
  final Function(String) onPaymentMethodChanged;
  final VoidCallback onPlaceOrder;
  final bool isProcessing;

  const OrderPaymentSection({
    super.key,
    required this.totalAmount,
    required this.selectedPaymentMethod,
    required this.onPaymentMethodChanged,
    required this.onPlaceOrder,
    this.isProcessing = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(AppSizes.paddingL),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSizes.radiusL),
        border: Border.all(
          color: AppColors.border,
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.paddingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Icon(
                  Icons.payment,
                  size: 20,
                  color: AppColors.accent,
                ),
                const SizedBox(width: AppSizes.paddingS),
                const Text(
                  AppStrings.payment,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.paddingM),
            _PaymentMethodOption(
              icon: Icons.account_balance_wallet,
              title: 'Cüzdan',
              value: 'wallet',
              selectedValue: selectedPaymentMethod,
              onChanged: onPaymentMethodChanged,
            ),
            const SizedBox(height: AppSizes.paddingS),
            _PaymentMethodOption(
              icon: Icons.credit_card,
              title: 'Kredi Kartı',
              value: 'card',
              selectedValue: selectedPaymentMethod,
              onChanged: onPaymentMethodChanged,
            ),
            const SizedBox(height: AppSizes.paddingL),
            const Divider(),
            const SizedBox(height: AppSizes.paddingL),
            // Subtotal
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Ara Toplam',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textSecondary,
                  ),
                ),
                Text(
                  '${(totalAmount - (totalAmount * 0.1)).toStringAsFixed(0)} TL',
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.paddingS),
            // Delivery fee (if applicable)
            // This will be handled by parent component
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Toplam',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: AppColors.textSecondary,
                  ),
                ),
                Text(
                  '${totalAmount.toStringAsFixed(0)} TL',
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: AppColors.accent,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSizes.paddingL),
            PrimaryButton(
              text: 'Siparişi Tamamla',
              onPressed: isProcessing ? null : onPlaceOrder,
              isLoading: isProcessing,
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentMethodOption extends StatelessWidget {
  final IconData icon;
  final String title;
  final String value;
  final String selectedValue;
  final Function(String) onChanged;

  const _PaymentMethodOption({
    required this.icon,
    required this.title,
    required this.value,
    required this.selectedValue,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = selectedValue == value;

    return InkWell(
      onTap: () => onChanged(value),
      borderRadius: BorderRadius.circular(AppSizes.radiusM),
      child: Container(
        padding: const EdgeInsets.all(AppSizes.paddingM),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.15)
              : AppColors.backgroundColor,
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
          borderRadius: BorderRadius.circular(AppSizes.radiusM),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.accent.withOpacity(0.1)
                    : AppColors.backgroundColor,
                borderRadius: BorderRadius.circular(AppSizes.radiusS),
              ),
              child: Icon(
                icon,
                size: 20,
                color: isSelected ? AppColors.accent : AppColors.textSecondary,
              ),
            ),
            const SizedBox(width: AppSizes.paddingM),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: isSelected ? AppColors.accent : AppColors.textPrimary,
                ),
              ),
            ),
            Container(
              width: 20,
              height: 20,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? AppColors.accent : AppColors.border,
                  width: 2,
                ),
                color: isSelected ? AppColors.accent : Colors.transparent,
              ),
              child: isSelected
                  ? const Icon(
                      Icons.check,
                      size: 14,
                      color: Colors.white,
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
