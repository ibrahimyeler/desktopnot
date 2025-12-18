import 'package:flutter/material.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/constants/app_colors.dart';
import '../home_state.dart';
import '../home_view_model.dart';
import 'menu_category_card.dart';

class StepMenuSection extends StatelessWidget {
  final HomeState state;
  final HomeViewModel viewModel;

  const StepMenuSection({
    super.key,
    required this.state,
    required this.viewModel,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Günün Menüsü',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: AppColors.textPrimary,
            letterSpacing: -0.5,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Bugünün menüsünü adım adım seçin',
          style: TextStyle(
            fontSize: 14,
            color: AppColors.textSecondary.withOpacity(0.8),
            height: 1.3,
          ),
        ),
        const SizedBox(height: AppSizes.paddingL + 4),
        
        // Çorba Seçimi
        MenuCategoryCard(
          title: 'Çorba Seçimi',
          stepNumber: 1,
          options: state.soupOptions ?? [],
          selectedItem: state.selectedSoup,
          isActive: state.activeStep == 0,
          isCompleted: state.selectedSoup != null && state.activeStep > 0,
          onItemSelected: (item) => viewModel.selectSoup(item),
          onEdit: state.selectedSoup != null
              ? () => viewModel.goToStep(0)
              : null,
        ),

        // Ana Yemek Seçimi
        MenuCategoryCard(
          title: 'Ana Yemek Seçimi',
          stepNumber: 2,
          options: state.mainDishOptions ?? [],
          selectedItem: state.selectedMainDish,
          isActive: state.activeStep == 1,
          isCompleted: state.selectedMainDish != null && state.activeStep > 1,
          onItemSelected: (item) => viewModel.selectMainDish(item),
          onEdit: state.selectedMainDish != null
              ? () => viewModel.goToStep(1)
              : null,
        ),

        // Yan Yemek Seçimi
        MenuCategoryCard(
          title: 'Yan Yemek Seçimi',
          stepNumber: 3,
          options: state.sideDishOptions ?? [],
          selectedItem: state.selectedSideDish,
          isActive: state.activeStep == 2,
          isCompleted: state.selectedSideDish != null && state.activeStep > 2,
          onItemSelected: (item) => viewModel.selectSideDish(item),
          onEdit: state.selectedSideDish != null
              ? () => viewModel.goToStep(2)
              : null,
        ),

        // Tatlı Seçimi
        MenuCategoryCard(
          title: 'Tatlı Seçimi',
          stepNumber: 4,
          options: state.dessertOptions ?? [],
          selectedItem: state.selectedDessert,
          isActive: state.activeStep == 3,
          isCompleted: state.selectedDessert != null,
          onItemSelected: (item) => viewModel.selectDessert(item),
          onEdit: state.selectedDessert != null
              ? () => viewModel.goToStep(3)
              : null,
        ),
      ],
    );
  }
}
