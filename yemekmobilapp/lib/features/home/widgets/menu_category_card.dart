import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../home_state.dart';
import 'menu_item_option.dart';

class MenuCategoryCard extends StatelessWidget {
  final String title;
  final int stepNumber;
  final List<MenuItem> options;
  final MenuItem? selectedItem;
  final bool isActive;
  final bool isCompleted;
  final Function(MenuItem) onItemSelected;
  final VoidCallback? onEdit;

  const MenuCategoryCard({
    super.key,
    required this.title,
    required this.stepNumber,
    required this.options,
    this.selectedItem,
    this.isActive = false,
    this.isCompleted = false,
    required this.onItemSelected,
    this.onEdit,
  });

  @override
  Widget build(BuildContext context) {
    if (!isActive && !isCompleted) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSizes.paddingM + 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: isCompleted
                      ? AppColors.secondary // Secondary renk - tamamlanan adım
                      : isActive
                          ? AppColors.primary // Primary renk - aktif seçim
                          : AppColors.border,
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(
                          Icons.check,
                          color: Colors.white,
                          size: 16,
                        )
                      : Text(
                          '$stepNumber',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                ),
              ),
              const SizedBox(width: AppSizes.paddingS + 4),
              Expanded(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w600,
                    color: isCompleted
                        ? AppColors.secondary // Secondary renk - tamamlanan
                        : AppColors.textPrimary,
                    height: 1.2,
                  ),
                ),
              ),
              if (isCompleted && onEdit != null)
                TextButton(
                  onPressed: onEdit,
                  style: TextButton.styleFrom(
                    foregroundColor: AppColors.primary, // Primary renk
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSizes.paddingS,
                      vertical: 4,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: const Text(
                    'Değiştir',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: AppSizes.paddingS + 4),
          if (isCompleted && selectedItem != null)
            MenuItemOption(
              item: selectedItem!,
              isCompleted: true,
              onTap: onEdit,
            )
          else
            ...options.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: AppSizes.paddingS + 2),
                child: MenuItemOption(
                  item: item,
                  isSelected: selectedItem?.id == item.id,
                  onTap: () => onItemSelected(item),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
