import 'package:flutter/material.dart';
import '../../../../core/widgets/empty_state.dart';

class OrdersPage extends StatelessWidget {
  const OrdersPage({super.key});
  
  @override
  Widget build(BuildContext context) {
    return const EmptyState(
      title: 'Siparişler',
      message: 'Siparişler burada görüntülenecek',
      icon: Icons.receipt_long,
    );
  }
}

