import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../blocs/auth/auth_cubit.dart';
import '../../blocs/theme/theme_cubit.dart'; // Para colores
import '../../blocs/theme/theme_state.dart';   // Para colores
import '../../widgets/common/custom_textfield.dart'; // Crearemos este
import '../../widgets/common/custom_button.dart';   // Crearemos este
import '../../widgets/common/loading_indicator.dart'; // Crearemos este

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _performLogin() {
    if (_formKey.currentState!.validate()) {
      context.read<AuthCubit>().login(
            _usernameController.text.trim(),
            _passwordController.text.trim(),
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Escucha el estado del tema para obtener colores dinámicos
    final themeConfig = context.watch<ThemeCubit>().state;
    final colors = AppThemeColors.fromConfig(themeConfig);

    return Scaffold(
      backgroundColor: colors.primaryBg, // Fondo oscuro
      body: BlocConsumer<AuthCubit, AuthState>(
        listener: (context, state) {
          // No necesitamos listener aquí si el cambio de pantalla se maneja en main.dart
        },
        builder: (context, state) {
          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(30.0),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Icono y Título
                    Icon(LucideIcons.logIn, size: 60, color: colors.accent),
                    const SizedBox(height: 20),
                    Text(
                      'Iniciar Sesión',
                      style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: colors.primaryText),
                    ),
                    Text(
                      'Accede a tu panel de control',
                      style: TextStyle(fontSize: 16, color: colors.secondaryText),
                    ),
                    const SizedBox(height: 40),

                    // Campos de Texto (Usando widget reutilizable)
                    CustomTextField(
                      controller: _usernameController,
                      labelText: 'Username',
                      prefixIcon: LucideIcons.user,
                      colors: colors, // Pasa los colores del tema
                      validator: (value) => value!.isEmpty ? 'Ingresa tu usuario' : null,
                    ),
                    const SizedBox(height: 20),
                    CustomTextField(
                      controller: _passwordController,
                      labelText: 'Password',
                      prefixIcon: LucideIcons.lock,
                      obscureText: true,
                      colors: colors,
                      validator: (value) => value!.isEmpty ? 'Ingresa tu contraseña' : null,
                       onFieldSubmitted: (_) => _performLogin(), // Permite login con Enter
                    ),
                    const SizedBox(height: 15),

                    // Mensaje de Error
                    if (state.status == AuthStatus.unauthenticated && state.errorMessage != null)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 15.0),
                        child: Text(
                          state.errorMessage!,
                          style: TextStyle(color: Colors.red.shade400, fontSize: 14),
                          textAlign: TextAlign.center,
                        ),
                      ),

                    // Botón de Login (Usando widget reutilizable)
                    state.status == AuthStatus.loading
                        ? const LoadingIndicator()
                        : CustomButton(
                            text: 'Entrar',
                            onPressed: _performLogin,
                            icon: LucideIcons.arrowRight,
                            colors: colors,
                            glow: themeConfig.glowEnabled, // Pasa el estado de glow
                          ),
                    const SizedBox(height: 30),

                    // Enlace a Suscripción (más adelante)
                    // TextButton(
                    //   onPressed: () { /* Navegar a /subscribe */ },
                    //   child: Text(
                    //     '¿No tienes una cuenta? Suscríbete aquí',
                    //     style: TextStyle(color: colors.accent.withOpacity(0.8)),
                    //   ),
                    // ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}