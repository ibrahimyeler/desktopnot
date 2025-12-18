import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';

/// Forgot Password Verify Step Widget - Code verification step
class ForgotPasswordVerifyStepWidget extends StatelessWidget {
  final TextEditingController codeController;
  final bool isLoading;
  final VoidCallback onVerifyCode;
  final VoidCallback onResendCode;

  const ForgotPasswordVerifyStepWidget({
    super.key,
    required this.codeController,
    required this.isLoading,
    required this.onVerifyCode,
    required this.onResendCode,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        CustomTextField(
          label: 'Doğrulama Kodu',
          hint: '123456',
          controller: codeController,
          keyboardType: TextInputType.number,
          enabled: !isLoading,
          maxLength: 6,
          textAlign: TextAlign.center,
          style: const TextStyle(
            fontSize: 24,
            letterSpacing: 8,
            fontWeight: FontWeight.bold,
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Kod gerekli';
            }
            if (value.length != 6) {
              return '6 haneli kod girin';
            }
            return null;
          },
        ),
        const SizedBox(height: 32),
        CustomButton(
          text: 'Kodu Doğrula',
          onPressed: onVerifyCode,
          isLoading: isLoading,
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: isLoading ? null : onResendCode,
          child: const Text(
            'Yeni Kod Gönder',
            style: TextStyle(
              color: Color(0xFF818CF8),
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ],
    );
  }
}

