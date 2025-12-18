import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:io';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/register_header_widget.dart';
import '../widgets/register_form_widget.dart';
import '../widgets/register_social_buttons_widget.dart';
import '../widgets/register_footer_widget.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isGoogleLoading = false;
  bool _isAppleLoading = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Call backend auth service /auth/register
      final result = await _authService.register(
        _emailController.text.trim(),
        _passwordController.text,
        _usernameController.text.trim(),
      );
      
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      // TODO: Store token and user data in local storage
      // await storageService.saveToken(result['token']);
      // await storageService.saveUser(result['user']);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Kayıt başarılı! Giriş yapabilirsiniz.'),
          backgroundColor: Color(0xFF10B981),
        ),
      );

      // Navigate back to login screen
      context.pop();
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Kayıt başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
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
          content: Text('Google ile kayıt başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  Future<void> _handleAppleSignIn() async {
    if (!Platform.isIOS) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Apple ile giriş sadece iOS cihazlarda kullanılabilir'),
          backgroundColor: Color(0xFFF59E0B),
        ),
      );
      return;
    }

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
          content: Text('Apple ile kayıt başarısız: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
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
              const RegisterHeaderWidget(),
              
              // Form
              RegisterFormWidget(
                formKey: _formKey,
                usernameController: _usernameController,
                emailController: _emailController,
                passwordController: _passwordController,
                confirmPasswordController: _confirmPasswordController,
                isLoading: _isLoading,
                obscurePassword: _obscurePassword,
                obscureConfirmPassword: _obscureConfirmPassword,
                onRegisterPressed: _handleRegister,
                onTogglePassword: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
                onToggleConfirmPassword: () {
                  setState(() {
                    _obscureConfirmPassword = !_obscureConfirmPassword;
                  });
                },
              ),
              
              const SizedBox(height: 32),
              
              // Social Buttons
              RegisterSocialButtonsWidget(
                isLoading: _isLoading,
                isGoogleLoading: _isGoogleLoading,
                isAppleLoading: _isAppleLoading,
                onGoogleSignIn: _handleGoogleSignIn,
                onAppleSignIn: _handleAppleSignIn,
              ),
              
              const SizedBox(height: 32),
              
              // Footer
              const RegisterFooterWidget(),
            ],
          ),
        ),
      ),
    );
  }
}

