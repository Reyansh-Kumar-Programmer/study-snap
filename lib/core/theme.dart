import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const charcoal = Color(0xFF0F172A);
  static const electricBlue = Color(0xFF3B82F6);
  static const teal = Color(0xFF14B8A6);
  static const softBlue = Color(0xFFF1F7FF);
  static const slate50 = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate400 = Color(0xFF94A3B8);
  static const slate600 = Color(0xFF475569);
  static const white = Colors.white;
}

class AppTheme {
  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.electricBlue,
        primary: AppColors.electricBlue,
        secondary: AppColors.teal,
        surface: AppColors.white,
      ),
      scaffoldBackgroundColor: AppColors.white,
      textTheme: TextTheme(
        displayLarge: GoogleFonts.fraunces(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: AppColors.charcoal,
        ),
        headlineMedium: GoogleFonts.fraunces(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: AppColors.charcoal,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: AppColors.charcoal,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          color: AppColors.charcoal,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: AppColors.slate600,
        ),
      ),
    );
  }
}
