import 'api_service.dart';

class WalletService {
  WalletService._();

  static Future<Map<String, dynamic>> getBalance() async {
    return await ApiService.get('/wallet/balance');
  }

  static Future<Map<String, dynamic>> getTransactions() async {
    return await ApiService.get('/wallet/transactions');
  }

  static Future<Map<String, dynamic>> addFunds(double amount) async {
    return await ApiService.post('/wallet/add-funds', {'amount': amount});
  }

  static Future<Map<String, dynamic>> withdraw(double amount) async {
    return await ApiService.post('/wallet/withdraw', {'amount': amount});
  }
}

