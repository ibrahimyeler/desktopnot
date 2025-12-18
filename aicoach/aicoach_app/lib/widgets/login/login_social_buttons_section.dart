import 'package:flutter/material.dart';
import 'dart:io';
import 'login_colors.dart';

/// Sosyal medya giriş butonları bölümü
class LoginSocialButtonsSection extends StatelessWidget {
  final bool isLoading;
  final bool isGoogleLoading;
  final bool isAppleLoading;
  final VoidCallback onGoogleSignIn;
  final VoidCallback onAppleSignIn;

  const LoginSocialButtonsSection({
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
      // iOS: Google ve Apple yan yana
      return Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _buildSocialButton(
                  icon: isGoogleLoading
                      ? _buildLoadingIndicator()
                      : Image.asset(
                          'assets/google.png',
                          width: 20,
                          height: 20,
                        ),
                  label: 'Google ile Giriş',
                  onPressed: isDisabled ? null : onGoogleSignIn,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSocialButton(
                  icon: isAppleLoading
                      ? _buildLoadingIndicator()
                      : Image.asset(
                          'assets/apple.png',
                          width: 20,
                          height: 20,
                        ),
                  label: 'Apple ile Giriş',
                  onPressed: isDisabled ? null : onAppleSignIn,
                ),
              ),
            ],
          ),
        ],
      );
    } else {
      // Android/Web: Sadece Google
      return _buildSocialButton(
        icon: isGoogleLoading
            ? _buildLoadingIndicator()
            : Image.asset(
                'assets/google.png',
                width: 20,
                height: 20,
              ),
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
          color: LoginColors.black,
          fontSize: 15,
          fontWeight: FontWeight.w600,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        padding: const EdgeInsets.symmetric(vertical: 14),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: LoginColors.lightGray.withOpacity(0.3),
            width: 1,
          ),
        ),
        elevation: 0, // Shadow yok
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return const SizedBox(
      width: 20,
      height: 20,
      child: CircularProgressIndicator(
        strokeWidth: 2,
        valueColor: AlwaysStoppedAnimation<Color>(LoginColors.black),
      ),
    );
  }
}

