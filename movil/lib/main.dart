import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'blocs/auth/auth_cubit.dart';
import 'blocs/theme/theme_cubit.dart';
import 'blocs/theme/theme_state.dart';
import 'config/theme_service.dart';
import 'api/auth_service.dart'; // Importa AuthService
import 'api/api_client.dart';   // Importa ApiClient
import 'screens/auth/login_screen.dart';
import 'screens/main_layout.dart';      // Importa el Layout principal
import 'widgets/common/loading_indicator.dart'; // Para estado inicial


void main() {
  // Asegura inicialización de bindings
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // MultiBlocProvider para Auth y Theme
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (context) => ThemeCubit(ThemeService())),
        // Proveemos AuthCubit con sus dependencias
        BlocProvider(create: (context) => AuthCubit(AuthService(), apiClient)),
      ],
      child: BlocBuilder<ThemeCubit, ThemeConfig>(
        builder: (context, themeConfig) {
          final colors = AppThemeColors.fromConfig(themeConfig);
          final lightTheme = ThemeData(
            brightness: Brightness.light,
            primaryColor: colors.accent,
            scaffoldBackgroundColor: colors.primaryBg,
            appBarTheme: AppBarTheme(
              backgroundColor: colors.secondaryBg,
               foregroundColor: colors.primaryText, // Icon/Title color
               elevation: 0.5,
               shadowColor: colors.borderColor,
            ),
             colorScheme: ColorScheme.light(
               primary: colors.accent,
               secondary: colors.accent,
               background: colors.primaryBg,
               surface: colors.secondaryBg,
               onPrimary: Colors.white,
               onSecondary: Colors.white,
               onBackground: colors.primaryText,
               onSurface: colors.primaryText,
               error: Colors.red.shade400,
               onError: Colors.white,
             ),
             // Define other theme properties (text styles, button themes, etc.)
          );

          final darkTheme = ThemeData(
             brightness: Brightness.dark,
             primaryColor: colors.accent,
             scaffoldBackgroundColor: colors.primaryBg,
             appBarTheme: AppBarTheme(
               backgroundColor: colors.secondaryBg,
                foregroundColor: colors.primaryText,
                elevation: 0.5,
                shadowColor: colors.borderColor,
             ),
              colorScheme: ColorScheme.dark(
                primary: colors.accent,
                secondary: colors.accent,
                background: colors.primaryBg,
                surface: colors.secondaryBg,
                onPrimary: Colors.white,
                onSecondary: Colors.white,
                onBackground: colors.primaryText,
                onSurface: colors.primaryText,
                error: Colors.red.shade400,
                onError: Colors.white,
              ),
              // Define other theme properties
          );

          return MaterialApp(
            title: 'ActFijo App Mobile',
            themeMode: themeConfig.themeMode,
            theme: lightTheme,
            darkTheme: darkTheme,
            debugShowCheckedModeBanner: false,
            // --- MANEJO DE ESTADO AUTH ---
            home: BlocBuilder<AuthCubit, AuthState>(
              builder: (context, authState) {
                switch (authState.status) {
                  case AuthStatus.authenticated:
                    return const MainLayoutScreen(); // Muestra la app principal
                  case AuthStatus.unauthenticated:
                    return const LoginScreen(); // Muestra el login
                  case AuthStatus.loading: // Muestra loader mientras loguea
                  case AuthStatus.unknown: // Muestra loader mientras verifica token inicial
                    return Scaffold( // Scaffold para tener fondo
                      backgroundColor: colors.primaryBg,
                      body: const LoadingIndicator(),
                    );
                }
              },
            ),
            // --- FIN MANEJO AUTH ---
          );
        },
      ),
    );
  }
}

          