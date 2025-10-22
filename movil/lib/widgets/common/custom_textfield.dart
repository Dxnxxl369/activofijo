import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../blocs/theme/theme_cubit.dart'; // Ajusta path

class CustomTextField extends StatelessWidget {
  final TextEditingController controller;
  final String labelText;
  final IconData prefixIcon;
  final bool obscureText;
  final String? Function(String?)? validator;
  final AppThemeColors colors; // Recibe los colores
   final Function(String)? onFieldSubmitted;

  const CustomTextField({
    super.key,
    required this.controller,
    required this.labelText,
    required this.prefixIcon,
    this.obscureText = false,
    this.validator,
    required this.colors,
     this.onFieldSubmitted,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      style: TextStyle(color: colors.primaryText),
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: TextStyle(color: colors.secondaryText),
        prefixIcon: Icon(prefixIcon, color: colors.tertiaryText, size: 20),
        filled: true,
        fillColor: colors.tertiaryBg.withOpacity(0.5), // Fondo semi-transparente
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colors.borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colors.borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: colors.accent, width: 2), // Borde accent al enfocar
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.red.shade400, width: 1.5),
        ),
         focusedErrorBorder: OutlineInputBorder(
           borderRadius: BorderRadius.circular(12),
           borderSide: BorderSide(color: Colors.red.shade400, width: 2),
         ),
      ),
      validator: validator,
      onFieldSubmitted: onFieldSubmitted,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}