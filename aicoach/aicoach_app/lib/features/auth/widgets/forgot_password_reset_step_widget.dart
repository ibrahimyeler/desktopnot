import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';

/// Forgot Password Reset Step Widget - New password step
class ForgotPasswordResetStepWidget extends StatelessWidget {
  final TextEditingController newPasswordController;
  final TextEditingController confirmPasswordController;
  final bool isLoading;
  final bool obscureNewPassword;
  final bool obscureConfirmPassword;
  final VoidCallback onResetPassword;
  final VoidCallback onToggleNewPassword;
  final VoidCallback onToggleConfirmPassword;

  const ForgotPasswordResetStepWidget({
    super.key,
    required this.newPasswordController,
    required this.confirmPasswordController,
    required this.isLoading,
    required this.obscureNewPassword,
    required this.obscureConfirmPassword,
    required this.onResetPassword,
    required this.onToggleNewPassword,
    required this.onToggleConfirmPassword,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        CustomTextField(
          label: 'Yeni Şifre',
          hint: '••••••••',
          isPassword: true,
          obscureText: obscureNewPassword,
          controller: newPasswordController,
          enabled: !isLoading,
          suffixIcon: IconButton(
            icon: Icon(
              obscureNewPassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
              color: Colors.white.withValues(alpha: 0.7),
            ),
            onPressed: onToggleNewPassword,
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
        CustomTextField(
          label: 'Şifre Tekrar',
          hint: '••••••••',
          isPassword: true,
          obscureText: obscureConfirmPassword,
          controller: confirmPasswordController,
          enabled: !isLoading,
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
            if (value != newPasswordController.text) {
              return 'Şifreler eşleşmiyor';
            }
            return null;
          },
        ),
        const SizedBox(height: 32),
        CustomButton(
          text: 'Şifreyi Değiştir',
          onPressed: onResetPassword,
          isLoading: isLoading,
        ),
      ],
    );
  }
}

