import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../shared/widgets/app_scaffold.dart';
import '../../shared/widgets/primary_button.dart';
import 'cards_view_model.dart';
import 'widgets/add_card_bottom_sheet.dart';
import 'widgets/card_item.dart';

class CardsPage extends StatelessWidget {
  const CardsPage({super.key});

  void _showAddCardBottomSheet(BuildContext context) async {
    final result = await showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const AddCardBottomSheet(),
    );

    if (result != null) {
      final viewModel = Provider.of<CardsViewModel>(context, listen: false);
      viewModel.addCard(result);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CardsViewModel>(
      builder: (context, viewModel, _) {
        final cards = viewModel.cards;

        return AppScaffold(
          appBar: AppBar(
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, size: 20),
              onPressed: () => Navigator.of(context).pop(),
              color: AppColors.textPrimary,
            ),
            title: Text(
              AppStrings.myCards,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 20,
                fontWeight: FontWeight.w600,
              ),
            ),
            backgroundColor: Colors.transparent,
            elevation: 0,
            centerTitle: true,
            actions: [
              if (cards.isNotEmpty)
                IconButton(
                  icon: const Icon(Icons.add, color: AppColors.accent),
                  onPressed: () => _showAddCardBottomSheet(context),
                ),
            ],
          ),
          body: cards.isEmpty
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSizes.paddingXL * 2),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.credit_card_outlined,
                          size: 64,
                          color: AppColors.textSecondary.withOpacity(0.5),
                        ),
                        const SizedBox(height: AppSizes.paddingL),
                        Text(
                          'Henüz kart eklenmemiş',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: AppSizes.paddingS),
                        Text(
                          'Kartlarınız burada görünecek',
                          style: TextStyle(
                            fontSize: 14,
                            color: AppColors.textSecondary.withOpacity(0.7),
                          ),
                        ),
                        const SizedBox(height: AppSizes.paddingXL),
                        PrimaryButton(
                          text: 'Kart Ekle',
                          onPressed: () => _showAddCardBottomSheet(context),
                          width: 200,
                        ),
                      ],
                    ),
                  ),
                )
              : SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.all(AppSizes.paddingL),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        ...cards.map(
                          (card) => CardItem(
                            card: card,
                            onDelete: () => viewModel.deleteCard(card['id']),
                          ),
                        ),
                        const SizedBox(height: AppSizes.paddingM),
                        PrimaryButton(
                          text: 'Yeni Kart Ekle',
                          onPressed: () => _showAddCardBottomSheet(context),
                        ),
                        const SizedBox(height: AppSizes.paddingXL),
                      ],
                    ),
                  ),
                ),
        );
      },
    );
  }
}
