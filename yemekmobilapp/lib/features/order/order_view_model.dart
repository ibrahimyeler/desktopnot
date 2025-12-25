import 'package:flutter/foundation.dart';
import '../../shared/models/catering_company.dart';

enum OrderType {
  pickup, // Gel Al
  delivery, // Teslim Edilecek
}

class OrderViewModel extends ChangeNotifier {
  final List<Map<String, dynamic>> _cartItems = [];
  String _selectedPaymentMethod = 'wallet';
  CateringCompany? _selectedCompany;
  OrderType _orderType = OrderType.pickup;

  List<Map<String, dynamic>> get cartItems => _cartItems;
  String get selectedPaymentMethod => _selectedPaymentMethod;
  CateringCompany? get selectedCompany => _selectedCompany;
  OrderType get orderType => _orderType;

  double get totalAmount {
    double itemsTotal = _cartItems.fold(
      0.0,
      (sum, item) => sum + (item['price'] as num).toDouble() * (item['quantity'] as int),
    );
    
    // Teslim edilecek siparişlerde kurye ücreti ekle
    if (_orderType == OrderType.delivery && _selectedCompany?.deliveryFee != null) {
      itemsTotal += _selectedCompany!.deliveryFee!;
    }
    
    return itemsTotal;
  }

  double get deliveryFee {
    if (_orderType == OrderType.delivery && _selectedCompany?.deliveryFee != null) {
      return _selectedCompany!.deliveryFee!;
    }
    return 0.0;
  }

  void setCompany(CateringCompany company) {
    _selectedCompany = company;
    // Eğer firma sadece gel al destekliyorsa, order type'ı pickup yap
    if (company.deliveryFee == null) {
      _orderType = OrderType.pickup;
    }
    notifyListeners();
  }

  void setOrderType(OrderType type) {
    // Eğer firma sadece gel al destekliyorsa, delivery seçilemez
    if (type == OrderType.delivery && 
        (_selectedCompany == null || _selectedCompany!.deliveryFee == null)) {
      return;
    }
    _orderType = type;
    notifyListeners();
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
