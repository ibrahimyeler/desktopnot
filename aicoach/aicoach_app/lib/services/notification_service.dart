import 'package:shared_preferences/shared_preferences.dart';

/// Bildirim servisi - Okunmamış bildirim sayısını yönetir
class NotificationService {
  static const String _unreadCountKey = 'unread_notification_count';

  /// Okunmamış bildirim sayısını al
  Future<int> getUnreadCount() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_unreadCountKey) ?? 0;
  }

  /// Okunmamış bildirim sayısını güncelle
  Future<void> setUnreadCount(int count) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt(_unreadCountKey, count);
  }

  /// Okunmamış bildirim sayısını artır
  Future<void> incrementUnreadCount() async {
    final current = await getUnreadCount();
    await setUnreadCount(current + 1);
  }

  /// Okunmamış bildirim sayısını azalt
  Future<void> decrementUnreadCount() async {
    final current = await getUnreadCount();
    if (current > 0) {
      await setUnreadCount(current - 1);
    }
  }

  /// Tüm bildirimleri okundu olarak işaretle (sayacı sıfırla)
  Future<void> markAllAsRead() async {
    await setUnreadCount(0);
  }

  /// Bildirim sayısını sıfırla
  Future<void> resetCount() async {
    await setUnreadCount(0);
  }
}

