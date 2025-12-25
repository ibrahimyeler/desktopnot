import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../shared/widgets/app_scaffold.dart';
import '../home/home_view_model.dart';
import 'order_view_model.dart';
import 'widgets/order_summary.dart';
import 'widgets/order_payment_section.dart';
import 'widgets/order_type_selector.dart';

class OrderPage extends StatelessWidget {
  final VoidCallback? onBack;
  final Function(OrderViewModel)? onViewModelCreated;

  OrderPage({
    super.key,
    this.onBack,
    this.onViewModelCreated,
  });

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) {
        final viewModel = OrderViewModel();
        // HomeViewModel'den seçili firmayı al
        final homeViewModel = Provider.of<HomeViewModel>(context, listen: false);
        if (homeViewModel.state.selectedCompany != null) {
          viewModel.setCompany(homeViewModel.state.selectedCompany!);
        }
        onViewModelCreated?.call(viewModel);
        return viewModel;
      },
      child: AppScaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios, size: 20),
            onPressed: () {
              if (onBack != null) {
                onBack!();
              } else if (Navigator.canPop(context)) {
                Navigator.pop(context);
              }
            },
            color: AppColors.textPrimary,
          ),
          title: Text(
            AppStrings.orderTitle,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.w600,
            ),
          ),
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
        body: Consumer<OrderViewModel>(
          builder: (context, viewModel, _) {
            if (viewModel.selectedCompany == null) {
              return const Center(
                child: Text(
                  'Lütfen önce bir catering firması seçin',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSecondary,
                  ),
                ),
              );
            }

            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Company Info Card
                  Container(
                    margin: const EdgeInsets.all(AppSizes.paddingL),
                    padding: const EdgeInsets.all(AppSizes.paddingM),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(AppSizes.radiusM),
                      border: Border.all(
                        color: AppColors.border,
                        width: 1,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.restaurant,
                          color: AppColors.primary,
                          size: 24,
                        ),
                        const SizedBox(width: AppSizes.paddingM),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                viewModel.selectedCompany!.name,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                viewModel.selectedCompany!.address,
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Order Type Selector
                  if (viewModel.cartItems.isNotEmpty)
                    OrderTypeSelector(
                      selectedType: viewModel.orderType,
                      canSelectDelivery: viewModel.selectedCompany?.deliveryFee != null,
                      onTypeChanged: (OrderType type) => viewModel.setOrderType(type),
                    ),
                  const SizedBox(height: AppSizes.paddingM),
                  OrderSummary(
                    items: viewModel.cartItems,
                    onQuantityChanged: (itemId, quantity) {
                      viewModel.updateQuantity(itemId, quantity);
                    },
                    onRemove: (itemId) {
                      viewModel.removeFromCart(itemId);
                    },
                    deliveryFee: viewModel.deliveryFee,
                    orderType: viewModel.orderType,
                  ),
                  if (viewModel.cartItems.isNotEmpty)
                    OrderPaymentSection(
                      totalAmount: viewModel.totalAmount,
                      selectedPaymentMethod: viewModel.selectedPaymentMethod,
                      onPaymentMethodChanged: (method) {
                        viewModel.setPaymentMethod(method);
                      },
                      onPlaceOrder: () async {
                        final success = await viewModel.placeOrder();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                success
                                    ? 'Sipariş başarıyla verildi!'
                                    : 'Sipariş verilirken bir hata oluştu',
                              ),
                              backgroundColor: success
                                  ? AppColors.success
                                  : AppColors.error,
                            ),
                          );
                          if (success) {
                            Navigator.of(context).pop();
                          }
                        }
                      },
                    ),
                  const SizedBox(height: AppSizes.paddingXL),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
