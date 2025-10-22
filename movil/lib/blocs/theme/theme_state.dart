import 'package:flutter/material.dart';
import 'package:equatable/equatable.dart'; // Add equatable to pubspec.yaml if not already (flutter_bloc usually brings it)

// Represents the overall theme configuration
class ThemeConfig extends Equatable {
  final ThemeMode themeMode;
  final String themeIdentifier; // 'light', 'dark', 'custom'
  final Color customColor;
  final bool glowEnabled;

  const ThemeConfig({
    required this.themeMode,
    required this.themeIdentifier,
    required this.customColor,
    required this.glowEnabled,
  });

  // Default theme
  factory ThemeConfig.initial() => const ThemeConfig(
        themeMode: ThemeMode.dark,
        themeIdentifier: 'dark',
        customColor: Color(0xFF6366F1), // Indigo
        glowEnabled: false,
      );

  ThemeConfig copyWith({
    ThemeMode? themeMode,
    String? themeIdentifier,
    Color? customColor,
    bool? glowEnabled,
  }) {
    return ThemeConfig(
      themeMode: themeMode ?? this.themeMode,
      themeIdentifier: themeIdentifier ?? this.themeIdentifier,
      customColor: customColor ?? this.customColor,
      glowEnabled: glowEnabled ?? this.glowEnabled,
    );
  }

  @override
  List<Object> get props => [themeMode, themeIdentifier, customColor, glowEnabled];
}