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
      _state = _state.copyWith(
        isLoading: false,
        balance: 150.0,
        transactions: [
          {
            'id': '1',
            'type': 'deposit',
            'amount': 100.0,
            'date': DateTime.now().subtract(const Duration(days: 2)),
            'description': 'Para yükleme',
          },
          {
            'id': '2',
            'type': 'payment',
            'amount': -25.0,
            'date': DateTime.now().subtract(const Duration(days: 1)),
            'description': 'Yemek siparişi',
          },
        ],
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

