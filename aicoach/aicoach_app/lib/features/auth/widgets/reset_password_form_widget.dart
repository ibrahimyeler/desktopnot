import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';

/// Reset Password Form Widget - Password inputs and button
class ResetPasswordFormWidget extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController passwordController;
  final TextEditingController confirmPasswordController;
  final bool isLoading;
  final bool obscurePassword;
  final bool obscureConfirmPassword;
  final VoidCallback onResetPassword;
  final VoidCallback onTogglePassword;
  final VoidCallback onToggleConfirmPassword;

  const ResetPasswordFormWidget({
    super.key,
    required this.formKey,
    required this.passwordController,
    required this.confirmPasswordController,
    required this.isLoading,
    required this.obscurePassword,
    required this.obscureConfirmPassword,
    required this.onResetPassword,
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
          // Password input
          CustomTextField(
            controller: passwordController,
            label: 'Yeni Şifre',
            hint: 'En az 8 karakter',
            isPassword: true,
            obscureText: obscurePassword,
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
                return 'Şifre en az 8 karakter olmalı';
              }
              return null;
            },
          ),
          const SizedBox(height: 20),
          // Confirm password input
          CustomTextField(
            controller: confirmPasswordController,
            label: 'Şifre Tekrar',
            hint: 'Şifrenizi tekrar girin',
            isPassword: true,
            obscureText: obscureConfirmPassword,
            suffixIcon: IconButton(
              icon: Icon(
                obscureConfirmPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                color: Colors.white.withValues(alpha: 0.7),
              ),
              onPressed: onToggleConfirmPassword,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Şifre tekrarı gerekli';
              }
              if (value != passwordController.text) {
                return 'Şifreler eşleşmiyor';
              }
              return null;
            },
          ),
          const SizedBox(height: 32),
          // Reset button
          CustomButton(
            text: 'Şifreyi Sıfırla',
            icon: Icons.check_circle,
            isLoading: isLoading,
            onPressed: onResetPassword,
          ),
        ],
      ),
    );
  }
}

