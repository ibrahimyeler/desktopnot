import 'package:flutter/material.dart';

class AppColors {
  // Modern Color Palette - Barber-Customer Style
  
  // Primary Colors
  static const Color primaryColor = Color(0xFF2C3E50); // Dark Blue-Gray
  static const Color secondaryColor = Color(0xFF3498DB); // Bright Blue
  static const Color accentColor = Color(0xFFE74C3C); // Red Accent
  
  // Background Colors
  static const Color backgroundColor = Color(0xFFF5F5F5); // Light Gray Background
  static const Color cardBackground = Colors.white; // White Cards
  
  // Text Colors
  static const Color textPrimary = Color(0xFF2C3E50); // Dark Text
  static const Color textSecondary = Color(0xFF7F8C8D); // Gray Text
  static const Color textMuted = Color(0xFFBDC3C7); // Light Gray Text
  
  // Status Colors
  static const Color successColor = Color(0xFF27AE60); // Green
  static const Color warningColor = Color(0xFFF39C12); // Orange
  static const Color errorColor = Color(0xFFE74C3C); // Red
  
  // Border & Divider
  static const Color borderColor = Color(0xFFE0E0E0); // Light Border
  static const Color dividerColor = Color(0xFFE0E0E0);
  
  // Legacy Support (for backward compatibility)
  static const Color primary = primaryColor;
  static const Color primaryDark = Color(0xFF1A252F);
  static const Color primaryLight = Color(0xFF34495E);
  static const Color secondary = secondaryColor;
  static const Color secondaryDark = Color(0xFF2980B9);
  static const Color secondaryLight = Color(0xFF5DADE2);
  static const Color surface = cardBackground;
  static const Color surfaceDark = Color(0xFF1F2937);
  static const Color accent = accentColor;
  static const Color accentLight = Color(0xFFEC7063);
  static const Color success = successColor;
  static const Color warning = warningColor;
  static const Color error = errorColor;
  static const Color border = borderColor;
  static const Color borderLight = Color(0xFFF5F5F5);
  static const Color textHint = textMuted;
  static const Color textOnPrimary = Colors.white;
  static const Color info = secondaryColor;
  static const Color disabled = Color(0xFFBDC3C7);
  static const Color disabledBackground = Color(0xFFF5F5F5);
}

