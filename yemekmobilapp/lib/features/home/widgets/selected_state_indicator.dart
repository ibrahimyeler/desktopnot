import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class SelectedStateIndicator extends StatelessWidget {
  final bool isSelected;
  final bool isCompleted;

  const SelectedStateIndicator({
    super.key,
    this.isSelected = false,
    this.isCompleted = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isCompleted) {
      return Container(
        width: 20,
        height: 20,
        decoration: BoxDecoration(
          color: AppColors.secondary, // Secondary renk - tamamlanan
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check,
          color: Colors.white,
          size: 14,
        ),
      );
    }

    if (isSelected) {
      return Container(
        width: 20,
        height: 20,
        decoration: BoxDecoration(
          color: AppColors.primary, // Primary renk - seçili
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check,
          color: Colors.white,
          size: 14,
        ),
      );
    }

    return Container(
      width: 20,
      height: 20,
      decoration: BoxDecoration(
        border: Border.all(
          color: AppColors.border,
          width: 1.5,
        ),
        shape: BoxShape.circle,
      ),
    );
  }
}
