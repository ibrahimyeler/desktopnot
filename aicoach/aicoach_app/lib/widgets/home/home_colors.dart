import 'package:flutter/material.dart';

/// Home Screen için renk sabitleri
class HomeColors {
  static const Color backgroundColor = Color(0xFF111827);
  static const Color cardBackground = Color(0xFF1F2937);
  static const Color borderColor = Color(0xFF374151);
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFF9CA3AF);
  
  // Accent Colors
  static const Color orange = Color(0xFFFFB800);
  static const Color orangeDark = Color(0xFFFF8C00);
  static const Color green = Color(0xFF10B981);
  static const Color greenLight = Color(0xFF34D399);
  static const Color blue = Color(0xFF3B82F6);
  static const Color blueLight = Color(0xFF60A5FA);
  static const Color purple = Color(0xFF6366F1);
  static const Color orangeAccent = Color(0xFFF97316);
  
  // Gradients
  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [orange, orangeDark],
  );
}

