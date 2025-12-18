import 'package:flutter/material.dart';
import 'dart:io';

/// Login Social Buttons Widget - Google and Apple sign in
class LoginSocialButtonsWidget extends StatelessWidget {
  final bool isLoading;
  final bool isGoogleLoading;
  final bool isAppleLoading;
  final VoidCallback onGoogleSignIn;
  final VoidCallback onAppleSignIn;

  const LoginSocialButtonsWidget({
    super.key,
    required this.isLoading,
    required this.isGoogleLoading,
    required this.isAppleLoading,
    required this.onGoogleSignIn,
    required this.onAppleSignIn,
  });

  @override
  Widget build(BuildContext context) {
    final isDisabled = isLoading || isGoogleLoading || isAppleLoading;

    if (Platform.isIOS) {
      // iOS: Google and Apple side by side
      return Row(
        children: [
          Expanded(
            child: _buildSocialButton(
              icon: isGoogleLoading
                  ? _buildLoadingIndicator()
                  : const Icon(Icons.g_mobiledata, size: 24, color: Colors.white),
              label: 'Google',
              onPressed: isDisabled ? null : onGoogleSignIn,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _buildSocialButton(
              icon: isAppleLoading
                  ? _buildLoadingIndicator()
                  : const Icon(Icons.apple, size: 24, color: Colors.white),
              label: 'Apple',
              onPressed: isDisabled ? null : onAppleSignIn,
            ),
          ),
        ],
      );
    } else {
      // Android/Web: Only Google
      return _buildSocialButton(
        icon: isGoogleLoading
            ? _buildLoadingIndicator()
            : const Icon(Icons.g_mobiledata, size: 24, color: Colors.white),
        label: 'Google ile Giriş Yap',
        onPressed: isDisabled ? null : onGoogleSignIn,
      );
    }
  }

  Widget _buildSocialButton({
    required Widget icon,
    required String label,
    required VoidCallback? onPressed,
  }) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: icon,
      label: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 15,
          fontWeight: FontWeight.w500,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF1F2937),
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: Colors.white.withValues(alpha: 0.1),
            width: 1,
          ),
        ),
        elevation: 0,
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return const SizedBox(
      width: 20,
      height: 20,
      child: CircularProgressIndicator(
        strokeWidth: 2,
        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
      ),
    );
  }
}

