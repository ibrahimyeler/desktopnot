import 'package:flutter/material.dart';

/// Siyah-Turuncu renk paleti için login renkleri
class LoginColors {
  // Siyah tonları
  static const Color black = Color(0xFF000000);
  static const Color darkGray = Color(0xFF111827);
  static const Color mediumGray = Color(0xFF1F2937);
  static const Color lightGray = Color(0xFF374151);
  
  // Turuncu tonları
  static const Color orange = Color(0xFFFF8C00);
  static const Color orangeBright = Color(0xFFFFB800);
  static const Color orangeLight = Color(0xFFFFC947);
  static const Color orangeDark = Color(0xFFFF6B00);
  
  // Gradient renkler
  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      orangeBright,
      orange,
    ],
  );
  
  static const LinearGradient blackGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      darkGray,
      black,
    ],
  );
  
  // Metin renkleri
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFF9CA3AF);
  static const Color textTertiary = Color(0xFF6B7280);
}

