import 'package:flutter/material.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/custom_button.dart';

/// Forgot Password Email Step Widget - Email input step
class ForgotPasswordEmailStepWidget extends StatelessWidget {
  final GlobalKey<FormState> formKey;
  final TextEditingController emailController;
  final bool isLoading;
  final VoidCallback onSendCode;

  const ForgotPasswordEmailStepWidget({
    super.key,
    required this.formKey,
    required this.emailController,
    required this.isLoading,
    required this.onSendCode,
  });

  @override
  Widget build(BuildContext context) {
    return Form(
      key: formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          CustomTextField(
            label: 'E-posta',
            hint: 'ornek@email.com',
            controller: emailController,
            keyboardType: TextInputType.emailAddress,
            enabled: !isLoading,
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
          const SizedBox(height: 32),
          CustomButton(
            text: 'Kod Gönder',
            onPressed: onSendCode,
            isLoading: isLoading,
          ),
        ],
      ),
    );
  }
}

