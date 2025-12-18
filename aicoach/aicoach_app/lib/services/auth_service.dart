import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

/// Authentication service for email, Google and Apple sign-in
class AuthService {
  static const String _baseUrl = 'http://localhost:8001';
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );

  // ==================== Email Authentication ====================

  /// Register with email and password
  Future<Map<String, dynamic>> register(String email, String password, String username) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
          'username': username,
        }),
      );

      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Registration failed');
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Login with email and password
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Login failed');
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Request password reset code
  Future<void> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/forgot-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );

      if (response.statusCode != 200) {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Failed to send code');
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Verify password reset code
  Future<bool> verifyCode(String email, String code) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/verify-code'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'code': code,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['valid'] ?? false;
      }
      return false;
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Reset password with code
  Future<void> resetPassword(String email, String code, String newPassword) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/reset-password'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'code': code,
          'new_password': newPassword,
        }),
      );

      if (response.statusCode != 200) {
        final error = jsonDecode(response.body);
        throw Exception(error['error'] ?? 'Failed to reset password');
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Refresh access token
  Future<String> refreshToken(String refreshToken) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/refresh'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'refresh_token': refreshToken}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['token'];
      } else {
        throw Exception('Token refresh failed');
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Validate token
  Future<bool> validateToken(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/auth/validate'),
        headers: {'Authorization': 'Bearer $token'},
      );

      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  // ==================== Google OAuth ====================

  /// Sign in with Google
  Future<Map<String, dynamic>?> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      
      if (googleUser == null) {
        return null;
      }

      final GoogleSignInAuthentication googleAuth =
          await googleUser.authentication;

      if (googleAuth.idToken == null || googleAuth.accessToken == null) {
        throw Exception('Google authentication tokens are null');
      }

      // Now send to backend API
      try {
        final response = await http.post(
          Uri.parse('$_baseUrl/auth/google'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'id_token': googleAuth.idToken,
            'access_token': googleAuth.accessToken,
          }),
        );

        if (response.statusCode == 200) {
          return jsonDecode(response.body);
        } else {
          throw Exception('Backend authentication failed: ${response.statusCode}');
        }
      } catch (e) {
        // If backend fails, still return local data
        print('Backend auth failed, using local data: $e');
        return {
          'id': googleUser.id,
          'email': googleUser.email,
          'displayName': googleUser.displayName,
          'photoUrl': googleUser.photoUrl,
          'idToken': googleAuth.idToken,
          'accessToken': googleAuth.accessToken,
        };
      }
    } catch (e) {
      print('Google sign-in error: $e');
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  // ==================== Apple OAuth ====================

  /// Sign in with Apple
  Future<Map<String, dynamic>?> signInWithApple() async {
    try {
      if (!Platform.isIOS) {
        throw Exception('Apple Sign In is only available on iOS');
      }

      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: [
          AppleIDAuthorizationScopes.email,
          AppleIDAuthorizationScopes.fullName,
        ],
      );

      // Now send to backend API
      try {
        final response = await http.post(
          Uri.parse('$_baseUrl/auth/apple'),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'id_token': credential.identityToken,
            'authorization_code': credential.authorizationCode,
            'email': credential.email ?? '',
            'full_name': credential.givenName != null && credential.familyName != null
                ? '${credential.givenName} ${credential.familyName}'
                : credential.givenName ?? credential.familyName ?? 'Apple User',
          }),
        );

        if (response.statusCode == 200) {
          return jsonDecode(response.body);
        } else {
          throw Exception('Backend authentication failed');
        }
      } catch (e) {
        // If backend fails, still return local data
        return {
          'id': credential.userIdentifier,
          'email': credential.email,
          'displayName': credential.givenName != null && credential.familyName != null
              ? '${credential.givenName} ${credential.familyName}'
              : credential.givenName ?? credential.familyName ?? 'Apple User',
          'idToken': credential.identityToken,
          'authorizationCode': credential.authorizationCode,
        };
      }
    } catch (e) {
      final errorMessage = _getUserFriendlyError(e.toString());
      throw Exception(errorMessage);
    }
  }

  /// Sign out from Google
  Future<void> signOutGoogle() async {
    await _googleSignIn.signOut();
  }

  /// Check if user is already signed in with Google
  Future<bool> isSignedInWithGoogle() async {
    return await _googleSignIn.isSignedIn();
  }

  /// Get current Google user
  Future<GoogleSignInAccount?> getCurrentGoogleUser() async {
    return await _googleSignIn.signInSilently();
  }

  /// Convert technical error messages to user-friendly Turkish messages
  String _getUserFriendlyError(String error) {
    final errorLower = error.toLowerCase();
    
    // MongoDB connection errors
    if (errorLower.contains('serverselectiontryonce') ||
        errorLower.contains('connection refused') ||
        errorLower.contains('27017') ||
        errorLower.contains('mongoclient') ||
        errorLower.contains('mongo')) {
      return 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.';
    }
    
    // Network errors
    if (errorLower.contains('socketexception') ||
        errorLower.contains('failed host lookup') ||
        errorLower.contains('connection refused') ||
        errorLower.contains('network is unreachable')) {
      return 'İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.';
    }
    
    // Timeout errors
    if (errorLower.contains('timeout') || errorLower.contains('timed out')) {
      return 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
    }
    
    // HTTP errors
    if (errorLower.contains('401') || errorLower.contains('unauthorized')) {
      return 'Giriş bilgileriniz hatalı. Lütfen kontrol edin.';
    }
    
    if (errorLower.contains('403') || errorLower.contains('forbidden')) {
      return 'Bu işlem için yetkiniz yok.';
    }
    
    if (errorLower.contains('404') || errorLower.contains('not found')) {
      return 'İstenen kaynak bulunamadı.';
    }
    
    if (errorLower.contains('500') || errorLower.contains('internal server error')) {
      return 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    }
    
    if (errorLower.contains('503') || errorLower.contains('service unavailable')) {
      return 'Servis şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.';
    }
    
    // Default: return a generic friendly message
    if (errorLower.contains('registration failed') ||
        errorLower.contains('kayıt')) {
      return 'Kayıt işlemi başarısız oldu. Lütfen bilgilerinizi kontrol edin.';
    }
    
    if (errorLower.contains('login failed') ||
        errorLower.contains('giriş')) {
      return 'Giriş yapılamadı. E-posta ve şifrenizi kontrol edin.';
    }
    
    if (errorLower.contains('google sign-in') ||
        errorLower.contains('google')) {
      return 'Google ile giriş yapılamadı. Lütfen tekrar deneyin.';
    }
    
    if (errorLower.contains('apple sign-in') ||
        errorLower.contains('apple')) {
      return 'Apple ile giriş yapılamadı. Lütfen tekrar deneyin.';
    }
    
    // Generic error
    return 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
}

