import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/login_header_widget.dart';
import '../widgets/login_form_widget.dart';
import '../widgets/login_social_buttons_widget.dart';
import '../widgets/login_footer_widget.dart';


class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isAppleLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // final result = await _authService.login(
      //   _emailController.text.trim(),
      //   _passwordController.text,
      // );

      // Mock data for development
      await Future.delayed(const Duration(seconds: 1));
      
      final result = {
        'token': 'mock_jwt_token_for_development',
        'refresh_token': 'mock_refresh_token',
        'user': {
          'id': 'mock_user_id',
          'email': _emailController.text.trim(),
          'username': 'Test User',
          'auth_provider': 'email',
          'is_active': true,
          'is_admin': false,
          'created_at': DateTime.now().toIso8601String(),
        }
      };

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      context.go(AppRoutes.home);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Giriş başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  void _handleRegister() {
    context.push(AppRoutes.register);
  }

  Future<void> _handleGoogleSignIn() async {
    setState(() {
      _isGoogleLoading = true;
    });

    try {
      final userData = await _authService.signInWithGoogle();
      
      if (!mounted) return;

      if (userData != null) {
        context.go(AppRoutes.home);
      } else {
        setState(() {
          _isGoogleLoading = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isGoogleLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Google ile giriş başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  Future<void> _handleAppleSignIn() async {
    // Apple Sign In kontrolü için platform import edilmeli
    // Şimdilik sadece iOS kontrolü yapılıyor
    setState(() {
      _isAppleLoading = true;
    });

    try {
      final userData = await _authService.signInWithApple();
      
      if (!mounted) return;

      if (userData != null) {
        context.go(AppRoutes.home);
      } else {
        setState(() {
          _isAppleLoading = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isAppleLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Apple ile giriş başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  void _handleForgotPassword() {
    context.push(AppRoutes.forgotPassword);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827), // Dark background
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              const LoginHeaderWidget(),
              
              // Form
              LoginFormWidget(
                formKey: _formKey,
                emailController: _emailController,
                passwordController: _passwordController,
                isLoading: _isLoading,
                onLoginPressed: _handleLogin,
                onForgotPasswordPressed: _handleForgotPassword,
              ),
              
              const SizedBox(height: 32),
              
              // Social Buttons
              LoginSocialButtonsWidget(
                isLoading: _isLoading,
                isGoogleLoading: _isGoogleLoading,
                isAppleLoading: _isAppleLoading,
                onGoogleSignIn: _handleGoogleSignIn,
                onAppleSignIn: _handleAppleSignIn,
              ),
              
              const SizedBox(height: 32),
              
              // Footer
              LoginFooterWidget(
                onRegisterPressed: _handleRegister,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
