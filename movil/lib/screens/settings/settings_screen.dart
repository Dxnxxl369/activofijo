import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_colorpicker/flutter_colorpicker.dart';
import 'package:lucide_icons/lucide_icons.dart'; // Or flutter_lucide
import '../../blocs/theme/theme_cubit.dart';  // Adjust path
import '../../blocs/theme/theme_state.dart';   // Adjust path

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Get theme colors based on current state
    final currentConfig = context.watch<ThemeCubit>().state;
    final colors = AppThemeColors.fromConfig(currentConfig);

    // Predefined colors (similar to web)
    final List<Color> predefinedColors = [
      const Color(0xFF6366F1), const Color(0xFF8B5CF6), const Color(0xFFD946EF),
      const Color(0xFFEC4899), const Color(0xFFF43F5E), const Color(0xFFF97316),
      const Color(0xFFEAB308), const Color(0xFF22C55E), const Color(0xFF10B981),
      const Color(0xFF06B6D4), const Color(0xFF0EA5E9), const Color(0xFF3B82F6),
    ];

    return Scaffold(
      // Use Scaffold background color from theme
      backgroundColor: colors.primaryBg,
      // Simple AppBar for now
      appBar: AppBar(
        title: Text('Personalizar Apariencia', style: TextStyle(color: colors.primaryText)),
        backgroundColor: colors.secondaryBg,
        elevation: 1,
        shadowColor: colors.borderColor,
        iconTheme: IconThemeData(color: colors.primaryText),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // --- Theme Mode Selection ---
            _buildSectionCard(
              colors: colors,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Modo de Tema', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.primaryText)),
                  const SizedBox(height: 15),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _ThemeButton(
                        label: 'Claro',
                        identifier: 'light',
                        currentIdentifier: currentConfig.themeIdentifier,
                        colors: colors,
                        onPressed: () => context.read<ThemeCubit>().setTheme('light'),
                      ),
                      _ThemeButton(
                        label: 'Oscuro',
                        identifier: 'dark',
                        currentIdentifier: currentConfig.themeIdentifier,
                        colors: colors,
                        onPressed: () => context.read<ThemeCubit>().setTheme('dark'),
                      ),
                      _ThemeButton(
                        label: 'Personalizado',
                        identifier: 'custom',
                        currentIdentifier: currentConfig.themeIdentifier,
                        colors: colors,
                        onPressed: () => context.read<ThemeCubit>().setTheme('custom'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // --- Glow Effect Toggle ---
            _buildSectionCard(
              colors: colors,
              child: Row(
                children: [
                  Icon(LucideIcons.sparkles, color: colors.accent, size: 24),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Efectos Visuales', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.primaryText)),
                        Text('Activar brillo de neón', style: TextStyle(color: colors.secondaryText)),
                      ],
                    ),
                  ),
                  Switch(
                    value: currentConfig.glowEnabled,
                    onChanged: (value) => context.read<ThemeCubit>().setGlowEnabled(value),
                    activeColor: colors.accent, // Use accent color for the active track
                    inactiveThumbColor: colors.tertiaryText,
                    inactiveTrackColor: colors.tertiaryBg,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // --- Custom Color Picker (Only if theme is 'custom') ---
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (child, animation) {
                return FadeTransition(opacity: animation, child: child);
              },
              child: currentConfig.themeIdentifier == 'custom'
                  ? _buildSectionCard(
                      key: const ValueKey('customColorPicker'), // Key for animation
                      colors: colors,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(children: [
                             Icon(LucideIcons.palette, color: colors.accent, size: 24),
                             const SizedBox(width: 15),
                             Text('Elige tu Color Primario', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: colors.primaryText)),
                          ]),
                          const SizedBox(height: 10),
                           Text('El color se aplica en tiempo real.', style: TextStyle(color: colors.secondaryText)),
                          const SizedBox(height: 20),
                          // Color Picker Button (opens dialog)
                          GestureDetector(
                            onTap: () => _showColorPickerDialog(context, currentConfig.customColor),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
                              decoration: BoxDecoration(
                                color: colors.tertiaryBg,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: colors.borderColor)
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min, // Fit content
                                children: [
                                   Container(width: 24, height: 24, decoration: BoxDecoration(color: currentConfig.customColor, shape: BoxShape.circle)),
                                   const SizedBox(width: 10),
                                   Text('Cambiar Color', style: TextStyle(color: colors.primaryText)),
                                ],
                              ),
                            ),
                          ),
                           const SizedBox(height: 20),
                           Text('Colores Sugeridos', style: TextStyle(color: colors.primaryText, fontWeight: FontWeight.w500)),
                          const SizedBox(height: 10),
                          Wrap( // Use Wrap for responsiveness
                            spacing: 10,
                            runSpacing: 10,
                            children: predefinedColors.map((color) => GestureDetector(
                              onTap: () => context.read<ThemeCubit>().setCustomColor(color),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                width: 40, height: 40,
                                decoration: BoxDecoration(
                                  color: color,
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: currentConfig.customColor == color ? colors.primaryText : Colors.transparent,
                                    width: 2
                                  ),
                                  boxShadow: currentConfig.customColor == color && currentConfig.glowEnabled ? [ // Neon effect on selection
                                      BoxShadow(color: color.withOpacity(0.7), blurRadius: 8, spreadRadius: 1)
                                  ] : [],
                                ),
                              ),
                            )).toList(),
                          )
                        ],
                      ),
                    )
                  : const SizedBox.shrink(key: ValueKey('noPicker')), // Empty SizedBox when not custom
            ),
          ],
        ),
      ),
    );
  }

  // Helper to build section cards
  Widget _buildSectionCard({required AppThemeColors colors, required Widget child, Key? key}) {
    return Container(
      key: key,
      padding: const EdgeInsets.all(15.0),
      decoration: BoxDecoration(
        color: colors.secondaryBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: colors.borderColor),
      ),
      child: child,
    );
  }

  // Helper to show Color Picker Dialog
  void _showColorPickerDialog(BuildContext context, Color currentColor) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Selecciona un color'),
        content: SingleChildScrollView(
          child: ColorPicker(
            pickerColor: currentColor,
            onColorChanged: (color) => context.read<ThemeCubit>().setCustomColor(color),
            pickerAreaHeightPercent: 0.8,
          ),
        ),
        actions: <Widget>[
          TextButton(
            child: const Text('OK'),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }
}

// Helper Widget for Theme Buttons
class _ThemeButton extends StatelessWidget {
  final String label;
  final String identifier;
  final String currentIdentifier;
  final AppThemeColors colors;
  final VoidCallback onPressed;

  const _ThemeButton({
    required this.label,
    required this.identifier,
    required this.currentIdentifier,
    required this.colors,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    final bool isActive = identifier == currentIdentifier;
    final themeCubit = context.read<ThemeCubit>();

    return Expanded( // Make buttons take equal space
      child: GestureDetector( // Use GestureDetector for scale animation
        onTap: onPressed,
        child: AnimatedScale( // Scale animation on selection
          scale: isActive ? 1.05 : 1.0,
          duration: const Duration(milliseconds: 200),
          child: AnimatedContainer( // Color and shadow animation
            duration: const Duration(milliseconds: 300),
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              color: isActive ? colors.accent : colors.tertiaryBg,
              borderRadius: BorderRadius.circular(8),
              boxShadow: isActive && themeCubit.state.glowEnabled ? [ // Neon effect
                 BoxShadow(color: colors.accent.withOpacity(0.6), blurRadius: 10, spreadRadius: 1)
              ] : [],
            ),
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: TextStyle(
                color: isActive ? Colors.white : colors.primaryText,
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        ),
      ),
    );
  }
}