import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + AppSizes.paddingM,
        bottom: AppSizes.paddingL,
        left: AppSizes.paddingL,
        right: AppSizes.paddingL,
      ),
      decoration: BoxDecoration(
        color: AppColors.background, // Sıcak kırık beyaz
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(AppSizes.radiusXL),
          bottomRight: Radius.circular(AppSizes.radiusXL),
        ),
      ),
      child: Center(
        child: Text(
          'HomeSupper',
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary, // Koyu kömür
            letterSpacing: -0.5,
          ),
        ),
      ),
    );
  }
}
