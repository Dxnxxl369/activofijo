import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../config/theme_service.dart'; // Adjust import path
import 'theme_state.dart';          // Adjust import path

class ThemeCubit extends Cubit<ThemeConfig> {
  final ThemeService _themeService;

  ThemeCubit(this._themeService) : super(ThemeConfig.initial()) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final mode = await _themeService.loadThemeMode();
    final identifier = await _themeService.loadThemeIdentifier();
    final color = await _themeService.loadCustomColor();
    final glow = await _themeService.loadGlowEnabled();
    emit(state.copyWith(
        themeMode: mode,
        themeIdentifier: identifier,
        customColor: color,
        glowEnabled: glow));
  }

  Future<void> setTheme(String identifier) async {
    ThemeMode newMode;
    switch (identifier) {
      case 'light':
        newMode = ThemeMode.light;
        break;
      case 'dark':
      case 'custom': // Use dark background for custom color theme
        newMode = ThemeMode.dark;
        break;
      default:
        newMode = ThemeMode.dark;
    }
    emit(state.copyWith(themeMode: newMode, themeIdentifier: identifier));
    await _savePreferences();
  }

  Future<void> setCustomColor(Color color) async {
    emit(state.copyWith(customColor: color));
     // Ensure theme identifier is 'custom' if a color is manually set
     if (state.themeIdentifier != 'custom') {
       emit(state.copyWith(themeIdentifier: 'custom', themeMode: ThemeMode.dark));
     }
    await _savePreferences();
  }

  Future<void> setGlowEnabled(bool enabled) async {
    emit(state.copyWith(glowEnabled: enabled));
    await _savePreferences();
  }

  Future<void> _savePreferences() async {
    await _themeService.saveThemePreferences(
      themeIdentifier: state.themeIdentifier,
      customColor: state.customColor,
      glowEnabled: state.glowEnabled,
    );
  }
}

// Helper to get Theme Colors based on ThemeConfig (place in theme_cubit.dart or app_theme.dart)
class AppThemeColors {
  final Color primaryBg;
  final Color secondaryBg;
  final Color tertiaryBg;
  final Color primaryText;
  final Color secondaryText;
  final Color tertiaryText;
  final Color accent;
  final Color borderColor;

  AppThemeColors({
    required this.primaryBg,
    required this.secondaryBg,
    required this.tertiaryBg,
    required this.primaryText,
    required this.secondaryText,
    required this.tertiaryText,
    required this.accent,
    required this.borderColor,
  });

  factory AppThemeColors.fromConfig(ThemeConfig config) {
    if (config.themeIdentifier == 'light') {
      return AppThemeColors(
        primaryBg: const Color(0xFFF9FAFB),
        secondaryBg: Colors.white,
        tertiaryBg: const Color(0xFFF3F4F6),
        primaryText: const Color(0xFF111827),
        secondaryText: const Color(0xFF6B7280),
        tertiaryText: const Color(0xFF9CA3AF),
        accent: config.customColor, // Use custom color even in light mode
        borderColor: const Color(0xFFE5E7EB),
      );
    } else { // Dark or Custom
      return AppThemeColors(
        primaryBg: const Color(0xFF111827),
        secondaryBg: const Color(0xFF1F2937),
        tertiaryBg: const Color(0xFF374151),
        primaryText: const Color(0xFFF9FAFB),
        secondaryText: const Color(0xFFD1D5DB),
        tertiaryText: const Color(0xFF9CA3AF),
        accent: config.customColor,
        borderColor: const Color(0xFF374151),
      );
    }
  }
}