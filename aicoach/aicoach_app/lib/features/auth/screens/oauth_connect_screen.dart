import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:io';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';

/// Google/Apple OAuth Connect Screen - OAuth bağlantı ekranı
class OAuthConnectScreen extends StatefulWidget {
  final String? provider; // 'google' veya 'apple'
  
  const OAuthConnectScreen({
    super.key,
    this.provider,
  });

  @override
  State<OAuthConnectScreen> createState() => _OAuthConnectScreenState();
}

class _OAuthConnectScreenState extends State<OAuthConnectScreen> {
  final _authService = AuthService();
  bool _isGoogleLoading = false;
  bool _isAppleLoading = false;

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isGoogleLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // final result = await _authService.signInWithGoogle();
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 2));
      
      final result = {
        'token': 'mock_google_jwt_token',
        'refresh_token': 'mock_refresh_token',
        'user': {
          'id': 'mock_user_id',
          'email': 'user@gmail.com',
          'username': 'Google User',
          'auth_provider': 'google',
          'is_active': true,
        }
      };

      if (!mounted) return;

      setState(() {
        _isGoogleLoading = false;
      });

      context.go(AppRoutes.home);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isGoogleLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Google ile giriş başarısız: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  Future<void> _handleAppleSignIn() async {
    setState(() {
      _isAppleLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // final result = await _authService.signInWithApple();
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 2));
      
      final result = {
        'token': 'mock_apple_jwt_token',
        'refresh_token': 'mock_refresh_token',
        'user': {
          'id': 'mock_user_id',
          'email': 'user@icloud.com',
          'username': 'Apple User',
          'auth_provider': 'apple',
          'is_active': true,
        }
      };

      if (!mounted) return;

      setState(() {
        _isAppleLoading = false;
      });

      context.go(AppRoutes.home);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isAppleLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Apple ile giriş başarısız: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: LoginColors.textPrimary),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  gradient: LoginColors.orangeGradient,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.link,
                  size: 50,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Sosyal Medya ile Bağlan',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Hızlı ve güvenli giriş için sosyal medya hesabınızı kullanın',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Google Button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _isGoogleLoading ? null : _handleGoogleSignIn,
                  icon: _isGoogleLoading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          ),
                        )
                      : Image.asset(
                          'assets/images/google_logo.png',
                          width: 24,
                          height: 24,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(Icons.g_mobiledata, size: 24);
                          },
                        ),
                  label: Text(
                    _isGoogleLoading ? 'Bağlanıyor...' : 'Google ile Devam Et',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black87,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              
              // Apple Button (iOS only)
              if (Platform.isIOS)
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton.icon(
                    onPressed: _isAppleLoading ? null : _handleAppleSignIn,
                    icon: _isAppleLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Icon(Icons.apple, size: 24),
                    label: Text(
                      _isAppleLoading ? 'Bağlanıyor...' : 'Apple ile Devam Et',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.black,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                ),
              
              const SizedBox(height: 32),
              
              // Divider
              Row(
                children: [
                  Expanded(child: Divider(color: LoginColors.lightGray)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'veya',
                      style: TextStyle(color: LoginColors.textSecondary),
                    ),
                  ),
                  Expanded(child: Divider(color: LoginColors.lightGray)),
                ],
              ),
              
              const SizedBox(height: 32),
              
              // Email ile giriş
              TextButton(
                onPressed: () => context.push(AppRoutes.login),
                child: Text(
                  'E-posta ile giriş yap',
                  style: TextStyle(
                    color: LoginColors.orangeBright,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

