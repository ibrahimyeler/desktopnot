import '../../../../core/constants/api_endpoints.dart';
import '../../../../core/errors/exceptions.dart';
import '../../../../core/network/api_client.dart';
import '../models/login_request_model.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login(LoginRequestModel request);
  Future<void> logout();
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;
  
  AuthRemoteDataSourceImpl(this.apiClient);
  
  @override
  Future<Map<String, dynamic>> login(LoginRequestModel request) async {
    // Tamamen statik login - herhangi bir email/şifre ile çalışır
    await Future.delayed(const Duration(milliseconds: 500)); // Kısa bir gecikme
    
    // Her zaman başarılı döner
    return {
      'token': 'static_jwt_token_${DateTime.now().millisecondsSinceEpoch}',
      'user': {
        'id': '1',
        'email': request.email,
        'name': 'Admin User',
        'phone': '+90 555 123 4567',
        'avatar': null,
      },
    };
  }
  
  @override
  Future<void> logout() async {
    // Statik logout - her zaman başarılı
    await Future.delayed(const Duration(milliseconds: 300));
  }
}

