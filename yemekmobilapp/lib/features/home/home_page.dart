import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../shared/widgets/app_scaffold.dart';
import 'home_view_model.dart';
import 'home_state.dart';
import 'widgets/home_header.dart';
import 'widgets/step_menu_section.dart';
import 'widgets/order_summary_bar.dart';

class HomePage extends StatelessWidget {
  final Function(List<Map<String, dynamic>>)? onNavigateToOrder;

  const HomePage({
    super.key,
    this.onNavigateToOrder,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => HomeViewModel()..loadDailyMenu(),
      child: AppScaffold(
        body: Consumer<HomeViewModel>(
          builder: (context, viewModel, _) {
            final state = viewModel.state;

            if (state.isLoading) {
              return const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                ),
              );
            }

            if (state.error != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 48,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: AppSizes.paddingM),
                    Text(
                      state.error!,
                      style: const TextStyle(
                        fontSize: 16,
                        color: AppColors.textPrimary,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSizes.paddingL),
                    ElevatedButton(
                      onPressed: () => viewModel.refresh(),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Yeniden Dene'),
                    ),
                  ],
                ),
              );
            }

            return Column(
              children: [
                Expanded(
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const HomeHeader(),
                        Padding(
                          padding: const EdgeInsets.all(AppSizes.paddingL),
                          child: StepMenuSection(
                            state: state,
                            viewModel: viewModel,
                          ),
                        ),
                        // Bottom padding for order summary bar
                        const SizedBox(height: AppSizes.paddingXL),
                      ],
                    ),
                  ),
                ),
                OrderSummaryBar(
                  state: state,
                  onCompleteOrder: () async {
                    if (!state.isOrderComplete) return;

                    // Seçili ürünleri listeye çevir
                    final items = <Map<String, dynamic>>[];
                    if (state.selectedSoup != null) {
                      items.add(state.selectedSoup!.toJson());
                    }
                    if (state.selectedMainDish != null) {
                      items.add(state.selectedMainDish!.toJson());
                    }
                    if (state.selectedSideDish != null) {
                      items.add(state.selectedSideDish!.toJson());
                    }
                    if (state.selectedDessert != null) {
                      items.add(state.selectedDessert!.toJson());
                    }

                    // Sipariş sayfasına yönlendir
                    if (onNavigateToOrder != null) {
                      onNavigateToOrder!(items);
                    }
                  },
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
