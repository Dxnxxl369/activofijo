import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeService {
  static const _themeModeKey = 'appThemeMode';
  static const _customColorKey = 'appCustomColor';
  static const _glowEnabledKey = 'appGlowEnabled';

  Future<ThemeMode> loadThemeMode() async {
    final prefs = await SharedPreferences.getInstance();
    final themeString = prefs.getString(_themeModeKey) ?? 'dark'; // Default to dark
    switch (themeString) {
      case 'light':
        return ThemeMode.light;
      case 'dark':
        return ThemeMode.dark;
      case 'custom': // Treat custom theme as dark background initially
        return ThemeMode.dark; // Or ThemeMode.system if preferred
      default:
        return ThemeMode.dark;
    }
  }

  Future<Color> loadCustomColor() async {
    final prefs = await SharedPreferences.getInstance();
    final colorValue = prefs.getInt(_customColorKey) ?? 0xFF6366F1; // Default Indigo
    return Color(colorValue);
  }

  Future<bool> loadGlowEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_glowEnabledKey) ?? false; // Default off
  }

   Future<String> loadThemeIdentifier() async {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_themeModeKey) ?? 'dark';
   }


  Future<void> saveThemePreferences({
    required String themeIdentifier, // 'light', 'dark', 'custom'
    required Color customColor,
    required bool glowEnabled,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeModeKey, themeIdentifier);
    await prefs.setInt(_customColorKey, customColor.value);
    await prefs.setBool(_glowEnabledKey, glowEnabled);
  }
}