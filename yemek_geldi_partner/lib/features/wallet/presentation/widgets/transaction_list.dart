import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../../core/constants/app_colors.dart';

class TransactionList extends StatelessWidget {
  const TransactionList({super.key});

  // Mock data - sonra provider ile değiştirilecek
  final List<Map<String, dynamic>> _transactions = const [
    {
      'id': '1',
      'type': 'income',
      'amount': 1250.0,
      'description': 'Sipariş Ödemesi',
      'date': '2024-12-18T14:30:00',
      'status': 'completed',
    },
    {
      'id': '2',
      'type': 'expense',
      'amount': 450.0,
      'description': 'Malzeme Alışverişi',
      'date': '2024-12-18T10:15:00',
      'status': 'completed',
    },
    {
      'id': '3',
      'type': 'income',
      'amount': 890.0,
      'description': 'Sipariş Ödemesi',
      'date': '2024-12-17T16:45:00',
      'status': 'completed',
    },
    {
      'id': '4',
      'type': 'income',
      'amount': 2100.0,
      'description': 'Toplu Sipariş',
      'date': '2024-12-17T09:20:00',
      'status': 'completed',
    },
    {
      'id': '5',
      'type': 'expense',
      'amount': 320.0,
      'description': 'Kargo Ücreti',
      'date': '2024-12-16T15:00:00',
      'status': 'completed',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: _transactions.map((transaction) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _TransactionCard(transaction: transaction),
        );
      }).toList(),
    );
  }
}

class _TransactionCard extends StatelessWidget {
  final Map<String, dynamic> transaction;

  const _TransactionCard({required this.transaction});

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction['type'] == 'income';
    final amount = transaction['amount'] as double;
    final date = DateTime.parse(transaction['date'] as String);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.cardBackground,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.borderColor,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: (isIncome ? AppColors.successColor : AppColors.errorColor)
                  .withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              isIncome ? Icons.arrow_downward : Icons.arrow_upward,
              color: isIncome ? AppColors.successColor : AppColors.errorColor,
              size: 20,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['description'] as String,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  DateFormat('dd MMMM yyyy, HH:mm', 'tr_TR').format(date),
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${isIncome ? '+' : '-'}₺${NumberFormat('#,###.00').format(amount)}',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isIncome ? AppColors.successColor : AppColors.errorColor,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.successColor.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'Tamamlandı',
                  style: TextStyle(
                    fontSize: 10,
                    color: AppColors.successColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

