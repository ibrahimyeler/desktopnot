import 'package:flutter/material.dart';
import '../../../widgets/custom_button.dart';

/// Verify Code Actions Widget - Verify button and resend link
class VerifyCodeActionsWidget extends StatelessWidget {
  final bool isLoading;
  final bool isResending;
  final VoidCallback onVerify;
  final VoidCallback onResend;

  const VerifyCodeActionsWidget({
    super.key,
    required this.isLoading,
    required this.isResending,
    required this.onVerify,
    required this.onResend,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Verify button
        CustomButton(
          text: 'Doğrula',
          icon: Icons.check_circle,
          isLoading: isLoading,
          onPressed: onVerify,
        ),
        const SizedBox(height: 24),
        // Resend code
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              'Kod gelmedi mi? ',
              style: TextStyle(
                color: Colors.white.withValues(alpha: 0.7),
                fontSize: 14,
              ),
            ),
            TextButton(
              onPressed: isResending ? null : onResend,
              child: isResending
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Color(0xFF818CF8),
                        ),
                      ),
                    )
                  : const Text(
                      'Yeniden Gönder',
                      style: TextStyle(
                        color: Color(0xFF818CF8),
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
            ),
          ],
        ),
      ],
    );
  }
}

