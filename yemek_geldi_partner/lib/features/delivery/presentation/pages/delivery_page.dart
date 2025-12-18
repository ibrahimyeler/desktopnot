import 'package:flutter/material.dart';
import '../../../../core/widgets/empty_state.dart';

class DeliveryPage extends StatelessWidget {
  const DeliveryPage({super.key});
  
  @override
  Widget build(BuildContext context) {
    return const EmptyState(
      title: 'Teslimat',
      message: 'Teslimat durumu burada görüntülenecek',
      icon: Icons.local_shipping,
    );
  }
}

