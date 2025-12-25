import 'package:flutter/foundation.dart';
import 'wallet_state.dart';

class WalletViewModel extends ChangeNotifier {
  WalletState _state = const WalletState();

  WalletState get state => _state;

  void loadWalletData() {
    _state = _state.copyWith(isLoading: true, error: null);
    notifyListeners();

    // Simulate API call
    Future.delayed(const Duration(seconds: 1), () {
      final now = DateTime.now();
      
      // 10 gelen işlem (deposit) - Tarihe göre sıralı (en yeni üstte)
      final incomingTransactions = List.generate(10, (index) {
        final daysAgo = index;
        final hoursAgo = (index * 3) % 24; // Daha çeşitli saatler
        return {
          'id': 'incoming_${index + 1}',
          'type': 'deposit',
          'amount': [100.0, 200.0, 150.0, 75.0, 250.0, 125.0, 300.0, 80.0, 175.0, 50.0][index],
          'date': now.subtract(Duration(days: daysAgo, hours: hoursAgo, minutes: (index * 15) % 60)),
          'description': [
            'Para yükleme',
            'Hesap transferi',
            'Kredi kartı yükleme',
            'Banka transferi',
            'Nakit yükleme',
            'Hediye bakiyesi',
            'Promosyon bonusu',
            'İade işlemi',
            'Ödeme geri ödemesi',
            'Bonus puan',
          ][index],
        };
      });

      // 10 giden işlem (payment) - Tarihe göre sıralı (en yeni üstte)
      final outgoingTransactions = List.generate(10, (index) {
        final daysAgo = index;
        final hoursAgo = (index * 4) % 24; // Daha çeşitli saatler
        return {
          'id': 'outgoing_${index + 1}',
          'type': 'payment',
          'amount': -[45.0, 60.0, 30.0, 50.0, 70.0, 25.0, 90.0, 35.0, 55.0, 40.0][index],
          'date': now.subtract(Duration(days: daysAgo, hours: hoursAgo, minutes: (index * 20) % 60)),
          'description': [
            'Yemek siparişi',
            'Günlük menü',
            'Çorba siparişi',
            'Ana yemek',
            'Tatlı siparişi',
            'İçecek siparişi',
            'Öğle yemeği',
            'Akşam yemeği',
            'Kahvaltı',
            'Atıştırmalık',
          ][index],
        };
      });

      // Tüm işlemleri birleştir ve tarihe göre sırala (en yeni üstte)
      final allTransactions = [...incomingTransactions, ...outgoingTransactions];
      allTransactions.sort((a, b) {
        final dateA = a['date'] as DateTime;
        final dateB = b['date'] as DateTime;
        return dateB.compareTo(dateA); // En yeni üstte
      });

      _state = _state.copyWith(
        isLoading: false,
        balance: 150.0,
        transactions: allTransactions,
      );
      notifyListeners();
    });
  }

  void addFunds(double amount) {
    _state = _state.copyWith(
      balance: _state.balance + amount,
    );
    notifyListeners();
  }
}

