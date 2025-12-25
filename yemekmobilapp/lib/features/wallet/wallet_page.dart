import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_sizes.dart';
import '../../core/constants/app_strings.dart';
import '../../shared/widgets/app_scaffold.dart';
import '../cards/cards_view_model.dart';
import '../cards/widgets/wallet_card_carousel.dart';
import 'wallet_view_model.dart';
import 'widgets/wallet_balance_card.dart';
import 'widgets/wallet_transaction_item.dart';

class WalletPage extends StatefulWidget {
  final VoidCallback? onBack;

  const WalletPage({
    super.key,
    this.onBack,
  });

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => WalletViewModel()..loadWalletData(),
      child: AppScaffold(
        appBar: AppBar(
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios, size: 20),
            onPressed: () {
              if (widget.onBack != null) {
                widget.onBack!();
              } else if (Navigator.canPop(context)) {
                Navigator.pop(context);
              }
            },
            color: AppColors.textPrimary,
          ),
          title: Text(
            AppStrings.walletTitle,
            style: const TextStyle(
              color: AppColors.textPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          backgroundColor: Colors.white,
          elevation: 0,
          centerTitle: true,
        ),
        body: Consumer<WalletViewModel>(
          builder: (context, viewModel, _) {
            final state = viewModel.state;

            if (state.isLoading) {
              return const Center(child: CircularProgressIndicator());
            }

            if (state.error != null) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.error_outline, size: 48, color: AppColors.error),
                    const SizedBox(height: AppSizes.paddingM),
                    Text(
                      state.error!,
                      style: const TextStyle(fontSize: 16, color: AppColors.textPrimary),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: AppSizes.paddingL),
                    ElevatedButton(
                      onPressed: () => viewModel.loadWalletData(),
                      child: const Text('Yeniden Dene'),
                    ),
                  ],
                ),
              );
            }

            final incomingTransactions = state.transactions
                .where((t) => t['type'] == 'deposit')
                .toList();
            final outgoingTransactions = state.transactions
                .where((t) => t['type'] != 'deposit')
                .toList();

            return RefreshIndicator(
              onRefresh: () async => viewModel.loadWalletData(),
              child: Column(
                children: [
                  // Ekran genişliğinde kart
                  WalletBalanceCard(balance: state.balance),
                  // Kartlar carousel
                  Consumer<CardsViewModel>(
                    builder: (context, cardsViewModel, _) {
                      if (cardsViewModel.cards.isNotEmpty) {
                        return Padding(
                          padding: const EdgeInsets.only(
                            left: 0,
                            right: 0,
                            top: AppSizes.paddingL,
                            bottom: AppSizes.paddingM,
                          ),
                          child: WalletCardCarousel(
                            cards: cardsViewModel.cards,
                          ),
                        );
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                  // Tab bar
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: AppSizes.paddingL),
                    decoration: BoxDecoration(
                      color: AppColors.cardBackground,
                      borderRadius: BorderRadius.circular(AppSizes.radiusM),
                      border: Border.all(
                        color: AppColors.borderColor,
                        width: 1,
                      ),
                    ),
                    child: TabBar(
                      controller: _tabController,
                      indicator: BoxDecoration(
                        color: AppColors.secondaryColor,
                        borderRadius: BorderRadius.circular(AppSizes.radiusM),
                      ),
                      indicatorSize: TabBarIndicatorSize.tab,
                      dividerColor: Colors.transparent,
                      labelColor: Colors.white,
                      unselectedLabelColor: AppColors.textSecondary,
                      labelStyle: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                      unselectedLabelStyle: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                      tabs: const [
                        Tab(text: 'Gelen'),
                        Tab(text: 'Giden'),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppSizes.paddingM),
                  // Tab bar view
                  Expanded(
                    child: TabBarView(
                      controller: _tabController,
                      children: [
                        // Gelen işlemler
                        _buildTransactionList(
                          transactions: incomingTransactions,
                          emptyMessage: 'Henüz gelen işlem bulunmuyor',
                        ),
                        // Giden işlemler
                        _buildTransactionList(
                          transactions: outgoingTransactions,
                          emptyMessage: 'Henüz giden işlem bulunmuyor',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildTransactionList({
    required List<Map<String, dynamic>> transactions,
    required String emptyMessage,
  }) {
    if (transactions.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSizes.paddingXL),
          child: Text(
            emptyMessage,
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 14,
            ),
          ),
        ),
      );
    }

    return SingleChildScrollView(
      physics: const AlwaysScrollableScrollPhysics(),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSizes.paddingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: transactions.map(
            (transaction) => Padding(
              padding: const EdgeInsets.only(bottom: AppSizes.paddingS + 2),
              child: WalletTransactionItem(
                transaction: transaction,
              ),
            ),
          ).toList(),
        ),
      ),
    );
  }
}
