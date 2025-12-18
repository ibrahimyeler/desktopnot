import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';

/// Register Form Widget - Username, email, password, and confirm password
class RegisterFormWidget extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController usernameController;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final bool isLoading;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final VoidCallback onRegisterPressed;
  final VoidCallback onTogglePassword;
  final VoidCallback onToggleConfirmPassword;

  const RegisterFormWidget({
    super.key,
    required this.formKey,
    required this.usernameController,
    required this.emailController,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.isLoading,
    required this.obscurePassword,
    required this.obscureConfirmPassword,
    required this.onRegisterPressed,
    required this.onTogglePassword,
    required this.onToggleConfirmPassword,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Username field
          CustomTextField(
            label: 'Kullanıcı Adı',
            hint: 'örnek: ahmet',
            controller: usernameController,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Kullanıcı adı gerekli';
              }
              if (value.length < 3) {
                return 'En az 3 karakter olmalı';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          // Email field
          CustomTextField(
            label: 'E-posta',
            hint: 'ornek@email.com',
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'E-posta gerekli';
              }
              if (!value.contains('@')) {
                return 'Geçerli bir e-posta girin';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          // Password field
          CustomTextField(
            label: 'Şifre',
            hint: '••••••••',
            isPassword: true,
            obscureText: obscurePassword,
            controller: passwordController,
            suffixIcon: IconButton(
              icon: Icon(
                obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                color: Colors.white.withValues(alpha: 0.7),
              ),
              onPressed: onTogglePassword,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Şifre gerekli';
              }
              if (value.length < 8) {
                return 'En az 8 karakter olmalı';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          // Confirm password field
          CustomTextField(
            label: 'Şifre Tekrar',
            hint: '••••••••',
            isPassword: true,
            obscureText: obscureConfirmPassword,
            controller: confirmPasswordController,
            suffixIcon: IconButton(
              icon: Icon(
                obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                color: Colors.white.withValues(alpha: 0.7),
              ),
              onPressed: onToggleConfirmPassword,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Şifre tekrar gerekli';
              }
              if (value != passwordController.text) {
                return 'Şifreler eşleşmiyor';
              }
              return null;
            },
          ),
          const SizedBox(height: 32),
          // Register button
          CustomButton(
            text: 'Kayıt Ol',
            onPressed: onRegisterPressed,
            isLoading: isLoading,
          ),
        ],
      ),
    );
  }
}

