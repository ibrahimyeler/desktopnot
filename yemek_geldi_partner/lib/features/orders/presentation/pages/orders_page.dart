import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

enum OrderType {
  pickup, // Gel Al
  delivery, // Teslim Edilecek
}

enum OrderStatus {
  pending, // Bekliyor
  preparing, // Hazırlanıyor
  ready, // Hazır
  completed, // Tamamlandı
  cancelled, // İptal
}

class Order {
  final String id;
  final String customerName;
  final String customerPhone;
  final List<OrderItem> items;
  final double totalAmount;
  final OrderType orderType;
  final OrderStatus status;
  final DateTime createdAt;
  final String? deliveryAddress;
  final String? notes;

  Order({
    required this.id,
    required this.customerName,
    required this.customerPhone,
    required this.items,
    required this.totalAmount,
    required this.orderType,
    required this.status,
    required this.createdAt,
    this.deliveryAddress,
    this.notes,
  });
}

class OrderItem {
  final String name;
  final int quantity;
  final double price;

  OrderItem({
    required this.name,
    required this.quantity,
    required this.price,
  });
}

class OrdersPage extends StatefulWidget {
  const OrdersPage({super.key});
  
  @override
  State<OrdersPage> createState() => _OrdersPageState();
}

class _OrdersPageState extends State<OrdersPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  // Mock siparişler
  final List<Order> _allOrders = [
    Order(
      id: '1',
      customerName: 'Ahmet Yılmaz',
      customerPhone: '0532 123 45 67',
      items: [
        OrderItem(name: 'Köfte', quantity: 1, price: 45.0),
        OrderItem(name: 'Pilav', quantity: 1, price: 18.0),
        OrderItem(name: 'Salata', quantity: 1, price: 15.0),
      ],
      totalAmount: 78.0,
      orderType: OrderType.delivery,
      status: OrderStatus.pending,
      createdAt: DateTime.now().subtract(const Duration(minutes: 10)),
      deliveryAddress: 'Kadıköy, İstanbul - Örnek Mahalle, Örnek Sokak No: 1',
    ),
    Order(
      id: '2',
      customerName: 'Mehmet Demir',
      customerPhone: '0533 234 56 78',
      items: [
        OrderItem(name: 'Tavuk Şiş', quantity: 2, price: 42.0),
        OrderItem(name: 'Makarna', quantity: 1, price: 20.0),
      ],
      totalAmount: 104.0,
      orderType: OrderType.pickup,
      status: OrderStatus.preparing,
      createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
    ),
    Order(
      id: '3',
      customerName: 'Ayşe Kaya',
      customerPhone: '0534 345 67 89',
      items: [
        OrderItem(name: 'İskender', quantity: 1, price: 48.0),
        OrderItem(name: 'Baklava', quantity: 1, price: 25.0),
      ],
      totalAmount: 73.0,
      orderType: OrderType.delivery,
      status: OrderStatus.ready,
      createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      deliveryAddress: 'Beşiktaş, İstanbul - Örnek Mahalle, Örnek Sokak No: 3',
    ),
    Order(
      id: '4',
      customerName: 'Fatma Şahin',
      customerPhone: '0535 456 78 90',
      items: [
        OrderItem(name: 'Mantı', quantity: 1, price: 40.0),
        OrderItem(name: 'Sütlaç', quantity: 1, price: 18.0),
      ],
      totalAmount: 58.0,
      orderType: OrderType.pickup,
      status: OrderStatus.completed,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Order> get _pendingOrders => 
      _allOrders.where((o) => o.status == OrderStatus.pending).toList();
  
  List<Order> get _preparingOrders => 
      _allOrders.where((o) => o.status == OrderStatus.preparing).toList();
  
  List<Order> get _readyOrders => 
      _allOrders.where((o) => o.status == OrderStatus.ready).toList();
  
  List<Order> get _completedOrders => 
      _allOrders.where((o) => o.status == OrderStatus.completed).toList();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Siparişler'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Bekleyen', icon: Icon(Icons.access_time)),
            Tab(text: 'Hazırlanıyor', icon: Icon(Icons.restaurant)),
            Tab(text: 'Hazır', icon: Icon(Icons.check_circle_outline)),
            Tab(text: 'Tamamlanan', icon: Icon(Icons.done_all)),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildOrdersList(_pendingOrders),
          _buildOrdersList(_preparingOrders),
          _buildOrdersList(_readyOrders),
          _buildOrdersList(_completedOrders),
        ],
      ),
    );
  }

  Widget _buildOrdersList(List<Order> orders) {
    if (orders.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.receipt_long_outlined,
              size: 64,
              color: AppColors.textSecondary.withOpacity(0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'Sipariş bulunmuyor',
              style: TextStyle(
                color: AppColors.textSecondary,
                fontSize: 16,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: orders.length,
      itemBuilder: (context, index) {
        return _OrderCard(order: orders[index]);
      },
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;

  const _OrderCard({required this.order});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(order.status).withOpacity(0.15),
          child: Icon(
            _getStatusIcon(order.status),
            color: _getStatusColor(order.status),
          ),
        ),
        title: Text(
          'Sipariş #${order.id}',
          style: const TextStyle(
            fontWeight: FontWeight.w600,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text('Müşteri: ${order.customerName}'),
            Text(
              'Tutar: ₺${order.totalAmount.toStringAsFixed(0)}',
              style: TextStyle(
                color: AppColors.successColor,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: order.orderType == OrderType.delivery
                        ? AppColors.primaryColor.withOpacity(0.1)
                        : AppColors.warningColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        order.orderType == OrderType.delivery
                            ? Icons.delivery_dining
                            : Icons.store,
                        size: 14,
                        color: order.orderType == OrderType.delivery
                            ? AppColors.primaryColor
                            : AppColors.warningColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        order.orderType == OrderType.delivery
                            ? 'Teslim Edilecek'
                            : 'Gel Al',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w500,
                          color: order.orderType == OrderType.delivery
                              ? AppColors.primaryColor
                              : AppColors.warningColor,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(order.status).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    _getStatusText(order.status),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: _getStatusColor(order.status),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildInfoRow('Müşteri', order.customerName),
                _buildInfoRow('Telefon', order.customerPhone),
                if (order.deliveryAddress != null)
                  _buildInfoRow('Teslimat Adresi', order.deliveryAddress!),
                const Divider(),
                const Text(
                  'Sipariş Detayları:',
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                ...order.items.map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${item.quantity}x ${item.name}',
                            style: const TextStyle(fontSize: 14),
                          ),
                          Text(
                            '₺${(item.price * item.quantity).toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    )),
                const Divider(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Toplam',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      '₺${order.totalAmount.toStringAsFixed(0)}',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 18,
                        color: AppColors.successColor,
                      ),
                    ),
                  ],
                ),
                if (order.orderType == OrderType.delivery && order.deliveryAddress != null) ...[
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {
                        // TODO: Kurye çağırma işlemi
                      },
                      icon: const Icon(Icons.local_shipping),
                      label: const Text('Kurye Çağır'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primaryColor,
                        foregroundColor: Colors.white,
                      ),
                    ),
                  ),
                ],
                if (order.orderType == OrderType.pickup) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.warningColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: AppColors.warningColor,
                          size: 20,
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Müşteri siparişi kendisi alacak. Kurye gerekmiyor.',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.warningColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(
                color: AppColors.textSecondary,
                fontSize: 14,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return AppColors.warningColor;
      case OrderStatus.preparing:
        return AppColors.primaryColor;
      case OrderStatus.ready:
        return AppColors.successColor;
      case OrderStatus.completed:
        return AppColors.successColor;
      case OrderStatus.cancelled:
        return AppColors.errorColor;
    }
  }

  IconData _getStatusIcon(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return Icons.access_time;
      case OrderStatus.preparing:
        return Icons.restaurant;
      case OrderStatus.ready:
        return Icons.check_circle;
      case OrderStatus.completed:
        return Icons.done_all;
      case OrderStatus.cancelled:
        return Icons.cancel;
    }
  }

  String _getStatusText(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Bekliyor';
      case OrderStatus.preparing:
        return 'Hazırlanıyor';
      case OrderStatus.ready:
        return 'Hazır';
      case OrderStatus.completed:
        return 'Tamamlandı';
      case OrderStatus.cancelled:
        return 'İptal';
    }
  }
}

