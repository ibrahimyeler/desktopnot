import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/utils/time_utils.dart';

class WalletTransactionItem extends StatelessWidget {
  final Map<String, dynamic> transaction;

  const WalletTransactionItem({
    super.key,
    required this.transaction,
  });

  @override
  Widget build(BuildContext context) {
    final isDeposit = transaction['type'] == 'deposit';
    final amount = transaction['amount'] as double;
    final date = transaction['date'] as DateTime;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.paddingS + 2),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(AppSizes.radiusM),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSizes.paddingM,
          vertical: AppSizes.paddingS + 4,
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: isDeposit
                    ? AppColors.successColor.withValues(alpha: 0.15)
                    : AppColors.errorColor.withValues(alpha: 0.15),
                shape: BoxShape.circle,
              ),
              child: Icon(
                isDeposit ? Icons.add : Icons.remove,
                color: isDeposit ? AppColors.successColor : AppColors.errorColor,
                size: 20,
              ),
            ),
            const SizedBox(width: AppSizes.paddingM),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    transaction['description'] ?? '',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    TimeUtils.formatDateTime(date),
                    style: TextStyle(
                      color: AppColors.textSecondary,
                      fontSize: 11,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '${isDeposit ? '+' : ''}${amount.toStringAsFixed(2)} TL',
              style: TextStyle(
                color: isDeposit ? AppColors.successColor : AppColors.errorColor,
                fontWeight: FontWeight.w700,
                fontSize: 15,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
