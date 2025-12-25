import 'api_service.dart';

class OrderService {
  OrderService._();

  static Future<Map<String, dynamic>> getDailyMenu() async {
    return await ApiService.get('/menu/daily');
  }

  static Future<Map<String, dynamic>> placeOrder(
    Map<String, dynamic> orderData,
  ) async {
    return await ApiService.post('/orders', orderData);
  }

  static Future<Map<String, dynamic>> getOrderHistory() async {
    return await ApiService.get('/orders/history');
  }

  static Future<Map<String, dynamic>> getOrderDetails(String orderId) async {
    return await ApiService.get('/orders/$orderId');
  }

  static Future<void> cancelOrder(String orderId) async {
    await ApiService.delete('/orders/$orderId');
  }
}

