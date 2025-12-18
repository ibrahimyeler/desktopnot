import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../services/auth_service.dart';
import '../../../app/navigation/route_names.dart';

/// Magic Link Login Screen - E-posta ile şifresiz giriş
class MagicLinkLoginScreen extends StatefulWidget {
  const MagicLinkLoginScreen({super.key});

  @override
  State<MagicLinkLoginScreen> createState() => _MagicLinkLoginScreenState();
}

class _MagicLinkLoginScreenState extends State<MagicLinkLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  bool _isEmailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _sendMagicLink() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // TODO: Uncomment when backend is ready
      // await _authService.sendMagicLink(_emailController.text.trim());
      
      // Mock data for development
      await Future.delayed(const Duration(seconds: 2));

      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _isEmailSent = true;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Giriş linki ${_emailController.text.trim()} adresine gönderildi'),
          backgroundColor: Colors.green,
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
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
                
                // Logo
                Center(
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      gradient: LoginColors.orangeGradient,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.email,
                      size: 40,
                      color: Colors.white,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
                
                // Başlık
                const Text(
                  'Şifresiz Giriş',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  _isEmailSent
                      ? 'E-postanızı kontrol edin ve giriş linkine tıklayın'
                      : 'E-posta adresinize gönderilecek link ile giriş yapın',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 16,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 48),
                
                if (!_isEmailSent) ...[
                  // Email input
                  CustomTextField(
                    controller: _emailController,
                    label: 'E-posta Adresi',
                    hint: 'ornek@email.com',
                    keyboardType: TextInputType.emailAddress,
                    icon: Icons.email_outlined,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'E-posta adresi gerekli';
                      }
                      if (!value.contains('@')) {
                        return 'Geçerli bir e-posta adresi girin';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  
                  // Send button
                  CustomButton(
                    text: 'Giriş Linki Gönder',
                    icon: Icons.send,
                    isLoading: _isLoading,
                    onPressed: _sendMagicLink,
                  ),
                ] else ...[
                  // Success state
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: LoginColors.orange.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: LoginColors.orangeBright,
                        width: 1,
                      ),
                    ),
                    child: Column(
                      children: [
                        Icon(
                          Icons.mark_email_read,
                          size: 64,
                          color: LoginColors.orangeBright,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'E-posta Gönderildi!',
                          style: TextStyle(
                            color: LoginColors.orangeBright,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _emailController.text.trim(),
                          style: const TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  
                  // Resend button
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _isEmailSent = false;
                      });
                    },
                    child: Text(
                      'Yeniden Gönder',
                      style: TextStyle(
                        color: LoginColors.orangeBright,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
                
                const Spacer(),
                
                // Back to login
                TextButton(
                  onPressed: () => context.push(AppRoutes.login),
                  child: Text(
                    'Şifre ile giriş yap',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 14,
                    ),
                  ),
                ),
                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

