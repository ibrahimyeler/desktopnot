import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../home_state.dart';
import 'selected_state_indicator.dart';

class MenuItemOption extends StatelessWidget {
  final MenuItem item;
  final bool isSelected;
  final bool isCompleted;
  final VoidCallback? onTap;

  const MenuItemOption({
    super.key,
    required this.item,
    this.isSelected = false,
    this.isCompleted = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppSizes.radiusM),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSizes.paddingM,
          vertical: AppSizes.paddingS + 2,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withOpacity(0.15) // Primary soft background
              : isCompleted
                  ? AppColors.secondary.withOpacity(0.12) // Secondary soft background
                  : AppColors.surface, // Açık bej kart rengi
          border: Border.all(
            color: isSelected
                ? AppColors.primary // Primary border
                : isCompleted
                    ? AppColors.secondary.withOpacity(0.4) // Secondary border
                    : AppColors.border,
            width: isSelected ? 1.5 : 1,
          ),
          borderRadius: BorderRadius.circular(AppSizes.radiusM),
        ),
        child: Row(
          children: [
            SelectedStateIndicator(
              isSelected: isSelected,
              isCompleted: isCompleted,
            ),
            const SizedBox(width: AppSizes.paddingS + 4),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    item.name,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: isSelected
                          ? AppColors.primary // Primary renk
                          : isCompleted
                              ? AppColors.secondary // Secondary renk
                              : AppColors.textPrimary,
                      height: 1.2,
                    ),
                  ),
                  if (item.description != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      item.description!,
                      style: TextStyle(
                        fontSize: 12,
                        color: isSelected || isCompleted
                            ? AppColors.textSecondary.withOpacity(0.7)
                            : AppColors.textSecondary,
                        height: 1.2,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: AppSizes.paddingS),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.local_fire_department,
                  size: 16,
                  color: const Color(0xFFFF6B35), // Kırmızı-sarımsı turuncu
                ),
                const SizedBox(width: 4),
                Text(
                  '${item.calories ?? 0} kcal',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: isSelected
                        ? AppColors.primary // Primary renk
                        : isCompleted
                            ? AppColors.secondary // Secondary renk
                            : AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
