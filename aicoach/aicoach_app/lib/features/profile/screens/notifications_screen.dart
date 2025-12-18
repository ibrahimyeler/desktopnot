import 'package:flutter/material.dart';
import '../../../services/notification_service.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedTab = 0;
  final NotificationService _notificationService = NotificationService();

  // Mock notification data
  final List<Map<String, dynamic>> _allNotifications = [
    {
      'id': '1',
      'title': 'Yatırım Koçu Mesajı',
      'message': 'Yeni yatırım önerisi hazır. Piyasa analizi tamamlandı.',
      'time': '2 dakika önce',
      'isRead': false,
      'type': 'message',
      'icon': '📈',
      'color': const Color(0xFF10B981),
    },
    {
      'id': '2',
      'title': 'Fitness Koçu Hatırlatma',
      'message': 'Bugünkü antrenmanınızı yapmayı unutmayın!',
      'time': '1 saat önce',
      'isRead': false,
      'type': 'reminder',
      'icon': '💪',
      'color': const Color(0xFFF59E0B),
    },
    {
      'id': '3',
      'title': 'Yazılım Koçu Feedback',
      'message': 'Kodunuzu inceledim. İyileştirme önerileri hazır.',
      'time': '3 saat önce',
      'isRead': true,
      'type': 'message',
      'icon': '💻',
      'color': const Color(0xFF3B82F6),
    },
    {
      'id': '4',
      'title': 'Yatırım Hedefi Güncellendi',
      'message': 'Yatırım hedefiniz %75 tamamlandı. Tebrikler!',
      'time': '5 saat önce',
      'isRead': true,
      'type': 'goal',
      'icon': '🎯',
      'color': const Color(0xFF6366F1),
    },
    {
      'id': '5',
      'title': 'Fitness İlerleme Raporu',
      'message': 'Bu hafta 12 antrenman tamamladınız. Harika!',
      'time': '1 gün önce',
      'isRead': true,
      'type': 'progress',
      'icon': '📊',
      'color': const Color(0xFF8B5CF6),
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() {
      setState(() {
        _selectedTab = _tabController.index;
      });
    });
    _initializeUnreadCount();
  }

  Future<void> _initializeUnreadCount() async {
    // İlk yüklemede mevcut okunmamış sayısını kontrol et
    final currentCount = await _notificationService.getUnreadCount();
    final actualUnreadCount = _unreadNotifications.length;
    
    // Eğer serviste kayıtlı sayı yoksa veya farklıysa, güncel sayıyı kaydet
    if (currentCount == 0 || currentCount != actualUnreadCount) {
      await _notificationService.setUnreadCount(actualUnreadCount);
    }
  }

  Future<void> _updateUnreadCount() async {
    final unreadCount = _unreadNotifications.length;
    await _notificationService.setUnreadCount(unreadCount);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _unreadNotifications {
    return _allNotifications.where((n) => !n['isRead']).toList();
  }

  List<Map<String, dynamic>> get _readNotifications {
    return _allNotifications.where((n) => n['isRead']).toList();
  }

  void _markAsRead(String id) async {
    setState(() {
      final index = _allNotifications.indexWhere((n) => n['id'] == id);
      if (index != -1) {
        _allNotifications[index]['isRead'] = true;
      }
    });
    await _updateUnreadCount();
  }

  void _markAllAsRead() async {
    setState(() {
      for (var notification in _allNotifications) {
        notification['isRead'] = true;
      }
    });
    await _updateUnreadCount();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF374151),
                width: 1,
              ),
            ),
            child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Bildirimler',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        actions: [
          if (_unreadNotifications.isNotEmpty)
            TextButton(
              onPressed: _markAllAsRead,
              child: const Text(
                'Tümünü Okundu İşaretle',
                style: TextStyle(
                  fontSize: 13,
                  color: Color(0xFFFFB800),
                ),
              ),
            ),
        ],
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              border: Border(bottom: BorderSide(color: const Color(0xFF374151))),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorColor: const Color(0xFFFFB800),
              labelColor: const Color(0xFFFFB800),
              unselectedLabelColor: const Color(0xFF9CA3AF),
              labelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
              tabs: [
                Tab(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Tümü'),
                      if (_allNotifications.isNotEmpty) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFB800).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${_allNotifications.length}',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFFFFB800),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                Tab(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('Okunmamış'),
                      if (_unreadNotifications.isNotEmpty) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFEF4444).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${_unreadNotifications.length}',
                            style: const TextStyle(
                              fontSize: 11,
                              color: Color(0xFFEF4444),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const Tab(text: 'Okunmuş'),
              ],
            ),
          ),
          // Content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildNotificationsList(_allNotifications),
                _buildNotificationsList(_unreadNotifications),
                _buildNotificationsList(_readNotifications),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationsList(List<Map<String, dynamic>> notifications) {
    if (notifications.isEmpty) {
      return _buildEmptyState(
        icon: _selectedTab == 0
            ? Icons.notifications_none_outlined
            : _selectedTab == 1
                ? Icons.done_all_outlined
                : Icons.mark_email_read_outlined,
        title: _selectedTab == 0
            ? 'Henüz bildirim yok'
            : _selectedTab == 1
                ? 'Okunmamış bildirim yok'
                : 'Okunmuş bildirim yok',
        subtitle: _selectedTab == 0
            ? 'Yeni bildirimler burada görünecek'
            : _selectedTab == 1
                ? 'Tüm bildirimleriniz okunmuş'
                : 'Okunmuş bildiriminiz bulunmuyor',
      );
    }

    return ListView.builder(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(20),
      itemCount: notifications.length,
      itemBuilder: (context, index) {
        final notification = notifications[index];
        return _buildNotificationItem(notification);
      },
    );
  }

  Widget _buildNotificationItem(Map<String, dynamic> notification) {
    final isRead = notification['isRead'] as bool;
    final color = notification['color'] as Color;
    final icon = notification['icon'] as String;
    final title = notification['title'] as String;
    final message = notification['message'] as String;
    final time = notification['time'] as String;

    return InkWell(
      onTap: () {
        if (!isRead) {
          _markAsRead(notification['id'] as String);
        }
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isRead ? const Color(0xFF1F2937) : color.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isRead ? const Color(0xFF374151) : color.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Icon
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Text(
                  icon,
                  style: const TextStyle(fontSize: 24),
                ),
              ),
            ),
            const SizedBox(width: 16),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: isRead ? FontWeight.w500 : FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      if (!isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: color,
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    message,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF9CA3AF),
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    time,
                    style: const TextStyle(
                      fontSize: 11,
                      color: Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
  }) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: const Color(0xFF1F2937),
                shape: BoxShape.circle,
                border: Border.all(
                  color: const Color(0xFF374151),
                  width: 1,
                ),
              ),
              child: Icon(
                icon,
                size: 64,
                color: const Color(0xFF9CA3AF),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              title,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: const TextStyle(
                fontSize: 14,
                color: Color(0xFF9CA3AF),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

