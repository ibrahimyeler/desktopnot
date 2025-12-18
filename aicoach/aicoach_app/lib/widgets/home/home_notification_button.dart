import 'package:flutter/material.dart';
import '../../features/profile/screens/notifications_screen.dart';
import '../../services/notification_service.dart';
import 'home_colors.dart';

/// Home header için bildirim butonu
class HomeNotificationButton extends StatefulWidget {
  final int? badgeCount;

  const HomeNotificationButton({
    super.key,
    this.badgeCount,
  });

  @override
  State<HomeNotificationButton> createState() => _HomeNotificationButtonState();
}

class _HomeNotificationButtonState extends State<HomeNotificationButton> {
  final NotificationService _notificationService = NotificationService();
  int _unreadCount = 0;

  @override
  void initState() {
    super.initState();
    _loadUnreadCount();
  }

  Future<void> _loadUnreadCount() async {
    if (widget.badgeCount != null) {
      setState(() {
        _unreadCount = widget.badgeCount!;
      });
    } else {
      final count = await _notificationService.getUnreadCount();
      if (mounted) {
        setState(() {
          _unreadCount = count;
        });
      }
    }
  }

  @override
  void didUpdateWidget(HomeNotificationButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.badgeCount != oldWidget.badgeCount) {
      _loadUnreadCount();
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Ekran geri döndüğünde sayacı güncelle
    _loadUnreadCount();
  }

  @override
  Widget build(BuildContext context) {
    final displayCount = widget.badgeCount ?? _unreadCount;
    final showBadge = displayCount > 0;

    return GestureDetector(
      onTap: () async {
        final result = await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => NotificationsScreen(),
          ),
        );
        // Bildirim ekranından döndükten sonra sayacı güncelle
        if (mounted) {
          _loadUnreadCount();
        }
      },
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: HomeColors.cardBackground,
              shape: BoxShape.circle,
              border: Border.all(
                color: HomeColors.borderColor,
                width: 1,
              ),
            ),
            child: const Icon(
              Icons.notifications_outlined,
              color: HomeColors.textSecondary,
              size: 20,
            ),
          ),
          if (showBadge)
            Positioned(
              right: -2,
              top: -2,
              child: Container(
                padding: EdgeInsets.symmetric(
                  horizontal: displayCount > 9 ? 5 : 6,
                  vertical: 2,
                ),
                decoration: BoxDecoration(
                  color: HomeColors.orange,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: HomeColors.cardBackground,
                    width: 2,
                  ),
                ),
                constraints: const BoxConstraints(
                  minWidth: 18,
                  minHeight: 18,
                ),
                child: Text(
                  displayCount > 99 ? '99+' : displayCount > 9 ? '9+' : displayCount.toString(),
                  style: const TextStyle(
                    color: Colors.black,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

