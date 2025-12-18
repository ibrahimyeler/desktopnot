import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../shared/widgets/primary_button.dart';
import '../home_state.dart';

class OrderSummaryBar extends StatelessWidget {
  final HomeState state;
  final VoidCallback onCompleteOrder;
  final bool isProcessing;

  const OrderSummaryBar({
    super.key,
    required this.state,
    required this.onCompleteOrder,
    this.isProcessing = false,
  });

  @override
  Widget build(BuildContext context) {
    if (!state.isOrderComplete) {
      return const SizedBox.shrink();
    }

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface, // Açık bej kart rengi
        boxShadow: [
          BoxShadow(
            color: AppColors.border.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(
            horizontal: AppSizes.paddingL,
            vertical: AppSizes.paddingM + 4,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Toplam bilgileri
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Toplam',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${state.totalPrice.toStringAsFixed(0)} TL',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textPrimary,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.local_fire_department,
                            size: 14,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Toplam Kalori',
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${state.totalCalories} kcal',
                        style: const TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: AppColors.primary, // Primary renk
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: AppSizes.paddingM + 4),
              // Buton
              PrimaryButton(
                text: 'Siparişi Tamamla',
                onPressed: isProcessing ? null : onCompleteOrder,
                isLoading: isProcessing,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
