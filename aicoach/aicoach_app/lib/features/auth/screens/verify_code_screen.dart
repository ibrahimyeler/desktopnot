import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/verify_code_header_widget.dart';
import '../widgets/verify_code_input_widget.dart';
import '../widgets/verify_code_actions_widget.dart';

/// Verify Code Screen - Kod doğrulama ekranı (2FA, Magic Link, Reset Password için)
class VerifyCodeScreen extends StatefulWidget {
  final String email;
  final String purpose; // '2fa', 'magic_link', 'reset_password'
  
  const VerifyCodeScreen({
    super.key,
    required this.email,
    this.purpose = 'magic_link',
  });

  @override
  State<VerifyCodeScreen> createState() => _VerifyCodeScreenState();
}

class _VerifyCodeScreenState extends State<VerifyCodeScreen> {
  final List<TextEditingController> _controllers = List.generate(
    6,
    (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(
    6,
    (index) => FocusNode(),
  );
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isResending = false;

  @override
  void dispose() {
    for (var controller in _controllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    super.dispose();
  }


  Future<void> _verifyCode() async {
    final code = _controllers.map((c) => c.text).join();
    
    if (code.length != 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen 6 haneli kodu girin'),
          backgroundColor: Color(0xFFEF4444),
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // await _authService.verifyCode(widget.email, code, widget.purpose);
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 2));

      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      // Navigate based on purpose
      if (widget.purpose == 'reset_password') {
        context.push(AppRoutes.resetPassword, extra: {
          'email': widget.email,
          'code': code,
        });
      } else {
        context.go(AppRoutes.home);
      }
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Kod doğrulanamadı: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      
      // Clear all fields
      for (var controller in _controllers) {
        controller.clear();
      }
      _focusNodes[0].requestFocus();
    }
  }

  Future<void> _resendCode() async {
    setState(() {
      _isResending = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // await _authService.resendCode(widget.email, widget.purpose);
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 1));

      if (!mounted) return;

      setState(() {
        _isResending = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Yeni kod gönderildi'),
          backgroundColor: Color(0xFF10B981),
        ),
      );
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isResending = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  void _onCodeChanged(int index, String value) {
    if (value.length == 1 && index < 5) {
      _focusNodes[index + 1].requestFocus();
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    
    // Auto verify when all fields are filled
    if (index == 5 && value.isNotEmpty) {
      final allFilled = _controllers.every((c) => c.text.isNotEmpty);
      if (allFilled) {
        _verifyCode();
      }
    }
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
              VerifyCodeHeaderWidget(
                email: widget.email,
                purpose: widget.purpose,
              ),
              
              // Code Input
              VerifyCodeInputWidget(
                controllers: _controllers,
                focusNodes: _focusNodes,
                onCodeChanged: _onCodeChanged,
              ),
              
              const SizedBox(height: 32),
              
              // Actions
              VerifyCodeActionsWidget(
                isLoading: _isLoading,
                isResending: _isResending,
                onVerify: _verifyCode,
                onResend: _resendCode,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

