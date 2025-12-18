import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../shared/widgets/app_scaffold.dart';
import 'order_view_model.dart';
import 'widgets/order_summary.dart';
import 'widgets/order_payment_section.dart';

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
            return SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  OrderSummary(
                    items: viewModel.cartItems,
                    onQuantityChanged: (itemId, quantity) {
                      viewModel.updateQuantity(itemId, quantity);
                    },
                    onRemove: (itemId) {
                      viewModel.removeFromCart(itemId);
                    },
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
