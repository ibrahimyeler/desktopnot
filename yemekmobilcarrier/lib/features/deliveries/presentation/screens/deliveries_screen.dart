import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class DeliveriesScreen extends StatelessWidget {
  const DeliveriesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Teslimatlar'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Yeni'),
              Tab(text: 'Devam Eden'),
              Tab(text: 'Tamamlanan'),
              Tab(text: 'İptal'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _NewDeliveriesTab(),
            _ActiveDeliveriesTab(),
            _CompletedDeliveriesTab(),
            _CancelledDeliveriesTab(),
          ],
        ),
      ),
    );
  }
}

class _NewDeliveriesTab extends StatelessWidget {
  const _NewDeliveriesTab();

  // Mock data - sadece "Teslim Edilecek" siparişler
  static final List<Map<String, dynamic>> _mockDeliveries = [
    {
      'id': '1',
      'restaurantName': 'Lezzet Durağı',
      'customerName': 'Ahmet Yılmaz',
      'address': 'Kadıköy, İstanbul - Örnek Mahalle, Örnek Sokak No: 1',
      'distance': 2.5,
      'orderType': 'delivery', // Teslim Edilecek
      'totalAmount': 125.0,
      'estimatedTime': 45,
    },
    {
      'id': '2',
      'restaurantName': 'Anadolu Sofrası',
      'customerName': 'Mehmet Demir',
      'address': 'Üsküdar, İstanbul - Örnek Mahalle, Örnek Sokak No: 2',
      'distance': 3.2,
      'orderType': 'delivery',
      'totalAmount': 98.0,
      'estimatedTime': 50,
    },
    {
      'id': '3',
      'restaurantName': 'Günlük Menü',
      'customerName': 'Ayşe Kaya',
      'address': 'Beşiktaş, İstanbul - Örnek Mahalle, Örnek Sokak No: 3',
      'distance': 1.8,
      'orderType': 'delivery',
      'totalAmount': 145.0,
      'estimatedTime': 40,
    },
  ];

  @override
  Widget build(BuildContext context) {
    if (_mockDeliveries.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.local_shipping_outlined,
              size: 64,
              color: AppColors.textSecondary.withValues(alpha: 0.5),
            ),
            const SizedBox(height: 16),
            Text(
              'Yeni teslimat bulunmuyor',
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
      itemCount: _mockDeliveries.length,
      itemBuilder: (context, index) {
        final delivery = _mockDeliveries[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.secondaryColor.withValues(alpha: 0.15),
              child: const Icon(
                Icons.restaurant,
                color: AppColors.secondaryColor,
              ),
            ),
            title: Text(delivery['restaurantName'] as String),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text('Müşteri: ${delivery['customerName']}'),
                const SizedBox(height: 4),
                Text(
                  'Adres: ${delivery['address']}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      Icons.location_on,
                      size: 14,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Mesafe: ${delivery['distance']} km',
                      style: const TextStyle(color: AppColors.textSecondary),
                    ),
                    const SizedBox(width: 16),
                    Icon(
                      Icons.access_time,
                      size: 14,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '~${delivery['estimatedTime']} dk',
                  style: const TextStyle(color: AppColors.textSecondary),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Tutar: ₺${delivery['totalAmount']}',
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: AppColors.successColor,
                  ),
                ),
              ],
            ),
            trailing: ElevatedButton(
              onPressed: () {
                // TODO: Teslimat kabul etme işlemi
              },
              child: const Text('Kabul Et'),
            ),
          ),
        );
      },
    );
  }
}

class _ActiveDeliveriesTab extends StatelessWidget {
  const _ActiveDeliveriesTab();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 3,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ExpansionTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.warningColor.withValues(alpha: 0.15),
              child: const Icon(
                Icons.local_shipping,
                color: AppColors.warningColor,
              ),
            ),
            title: Text('Teslimat #${index + 1}'),
            subtitle: const Text('Devam ediyor...'),
            children: [
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildDeliveryInfo('Restoran', 'Restoran Adı ${index + 1}'),
                    const Divider(),
                    _buildDeliveryInfo('Müşteri', 'Ahmet Yılmaz'),
                    const Divider(),
                    _buildDeliveryInfo('Adres', 'Örnek Mahalle, Örnek Sokak No: ${index + 1}'),
                    const Divider(),
                    _buildDeliveryInfo('Mesafe', '${index + 1}.5 km'),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () {},
                            child: const Text('Ayrıntılar'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {},
                            child: const Text('Tamamla'),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDeliveryInfo(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 14,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

class _CompletedDeliveriesTab extends StatelessWidget {
  const _CompletedDeliveriesTab();

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 10,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.successColor.withValues(alpha: 0.15),
              child: const Icon(
                Icons.check_circle,
                color: AppColors.successColor,
              ),
            ),
            title: Text('Teslimat #${index + 1}'),
            subtitle: Text(
              'Tamamlandı • ${index + 1} saat önce',
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            trailing: Text(
              '₺${(index + 1) * 15}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.successColor,
              ),
            ),
            onTap: () {},
          ),
        );
      },
    );
  }
}

class _CancelledDeliveriesTab extends StatelessWidget {
  const _CancelledDeliveriesTab();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.cancel_outlined,
            size: 64,
            color: AppColors.textSecondary.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'İptal edilen teslimat yok',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }
}

