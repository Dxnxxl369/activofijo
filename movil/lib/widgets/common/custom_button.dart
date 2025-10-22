import 'package:flutter/material.dart';
import '../../blocs/theme/theme_cubit.dart'; // Ajusta path

class CustomButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final IconData? icon;
  final AppThemeColors colors;
  final bool glow; // Flag para efecto neón

  const CustomButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    required this.colors,
    this.glow = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container( // Contenedor para aplicar sombra neón
      decoration: BoxDecoration(
        boxShadow: glow ? [
          BoxShadow(
            color: colors.accent.withOpacity(0.5),
            blurRadius: 12,
            spreadRadius: 1,
            offset: const Offset(0, 2),
          )
        ] : [],
        borderRadius: BorderRadius.circular(12), // Debe coincidir con el botón
      ),
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: colors.accent,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 0, // La sombra la maneja el Container
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) Icon(icon, size: 20),
            if (icon != null) const SizedBox(width: 8),
            Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}