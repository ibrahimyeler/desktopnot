import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../widgets/wallet_balance_card.dart';
import '../widgets/transaction_list.dart';
import '../widgets/quick_actions.dart';

class WalletPage extends StatelessWidget {
  const WalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.backgroundColor,
      appBar: AppBar(
        title: const Text('Cüzdan'),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Bakiye Kartı
            const WalletBalanceCard(
              balance: 287500.0,
              monthlyIncome: 287500.0,
              monthlyExpense: 96000.0,
            ),
            const SizedBox(height: 24),
            
            // Hızlı İşlemler
            const QuickActions(),
            const SizedBox(height: 24),
            
            // İşlem Geçmişi Başlığı
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'İşlem Geçmişi',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // Tümünü gör
                  },
                  child: const Text('Tümünü Gör'),
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            // İşlem Listesi
            const TransactionList(),
          ],
        ),
      ),
    );
  }
}

