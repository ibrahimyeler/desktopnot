import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/forgot_password_header_widget.dart';
import '../widgets/forgot_password_email_step_widget.dart';
import '../widgets/forgot_password_verify_step_widget.dart';
import '../widgets/forgot_password_reset_step_widget.dart';
import '../widgets/forgot_password_footer_widget.dart';
import '../widgets/verification_code_modal.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _codeController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _codeSent = false;
  bool _codeVerified = false;
  bool _obscureNewPassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleSendCode() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Call backend /auth/forgot-password endpoint when ready
      // await _authService.forgotPassword(_emailController.text.trim());
      
      // Simulate API call
      await Future.delayed(const Duration(seconds: 1));
      
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _codeSent = true;
      });

      // Show verification code modal
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => VerificationCodeModal(
          email: _emailController.text.trim(),
          onCodeVerified: (code) {
            setState(() {
              _codeController.text = code;
              _codeVerified = true;
            });
          },
          onResendCode: () {
            Navigator.of(context).pop();
            _handleSendCode();
          },
        ),
      );
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  Future<void> _handleVerifyCode() async {
    if (_codeController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen doğrulama kodunu girin'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Call backend /auth/verify-code endpoint
      final isValid = await _authService.verifyCode(
        _emailController.text.trim(),
        _codeController.text,
      );
      
      if (!mounted) return;

      if (!isValid) {
        throw Exception('Geçersiz kod');
      }

      setState(() {
        _isLoading = false;
        _codeVerified = true;
      });
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Geçersiz kod: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  Future<void> _handleResetPassword() async {
    if (_newPasswordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Şifreler eşleşmiyor'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Call backend /auth/reset-password endpoint
      await _authService.resetPassword(
        _emailController.text.trim(),
        _codeController.text,
        _newPasswordController.text,
      );
      
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Şifreniz başarıyla değiştirildi'),
          backgroundColor: Color(0xFF10B981),
        ),
      );

      context.go(AppRoutes.login);
    } catch (e) {
      if (!mounted) return;
      
      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  int get _currentStep {
    if (_codeVerified) return 2;
    if (_codeSent) return 1;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827), // Dark background
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              ForgotPasswordHeaderWidget(step: _currentStep),
              
              // Step content
              if (_currentStep == 0)
                ForgotPasswordEmailStepWidget(
                  formKey: _formKey,
                  emailController: _emailController,
                  isLoading: _isLoading,
                  onSendCode: _handleSendCode,
                ),
              
              if (_currentStep == 1)
                ForgotPasswordVerifyStepWidget(
                  codeController: _codeController,
                  isLoading: _isLoading,
                  onVerifyCode: _handleVerifyCode,
                  onResendCode: _handleSendCode,
                ),
              
              if (_currentStep == 2)
                ForgotPasswordResetStepWidget(
                  newPasswordController: _newPasswordController,
                  confirmPasswordController: _confirmPasswordController,
                  isLoading: _isLoading,
                  obscureNewPassword: _obscureNewPassword,
                  obscureConfirmPassword: _obscureConfirmPassword,
                  onResetPassword: _handleResetPassword,
                  onToggleNewPassword: () {
                    setState(() {
                      _obscureNewPassword = !_obscureNewPassword;
                    });
                  },
                  onToggleConfirmPassword: () {
                    setState(() {
                      _obscureConfirmPassword = !_obscureConfirmPassword;
                    });
                  },
                ),
              
              const SizedBox(height: 24),
              
              // Footer
              const ForgotPasswordFooterWidget(),
            ],
          ),
        ),
      ),
    );
  }
}

