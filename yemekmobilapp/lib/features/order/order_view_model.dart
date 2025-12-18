import 'package:flutter/foundation.dart';

class OrderViewModel extends ChangeNotifier {
  final List<Map<String, dynamic>> _cartItems = [];
  String _selectedPaymentMethod = 'wallet';

  List<Map<String, dynamic>> get cartItems => _cartItems;
  String get selectedPaymentMethod => _selectedPaymentMethod;

  double get totalAmount {
    return _cartItems.fold(
      0.0,
      (sum, item) => sum + (item['price'] as num).toDouble() * (item['quantity'] as int),
    );
  }

  void addToCart(Map<String, dynamic> item) {
    final existingIndex = _cartItems.indexWhere((i) => i['id'] == item['id']);
    if (existingIndex >= 0) {
      _cartItems[existingIndex]['quantity'] =
          (_cartItems[existingIndex]['quantity'] as int) + 1;
    } else {
      _cartItems.add({...item, 'quantity': 1});
    }
    notifyListeners();
  }

  void addItemsFromHome(List<Map<String, dynamic>> items) {
    // Önce mevcut sepeti temizle (opsiyonel - eğer her seferinde yeni sipariş istiyorsanız)
    // _cartItems.clear();
    
    // Yeni ürünleri ekle
    for (var item in items) {
      addToCart(item);
    }
    notifyListeners();
  }

  void removeFromCart(String itemId) {
    _cartItems.removeWhere((item) => item['id'] == itemId);
    notifyListeners();
  }

  void updateQuantity(String itemId, int quantity) {
    final index = _cartItems.indexWhere((item) => item['id'] == itemId);
    if (index >= 0) {
      if (quantity <= 0) {
        _cartItems.removeAt(index);
      } else {
        _cartItems[index]['quantity'] = quantity;
      }
      notifyListeners();
    }
  }

  void setPaymentMethod(String method) {
    _selectedPaymentMethod = method;
    notifyListeners();
  }

  Future<bool> placeOrder() async {
    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
    _cartItems.clear();
    notifyListeners();
    return true;
  }
}
