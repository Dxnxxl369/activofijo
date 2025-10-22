import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../blocs/auth/auth_cubit.dart'; // For logout & user info
import '../blocs/theme/theme_cubit.dart';
import '../blocs/theme/theme_state.dart';
import '../widgets/layout/side_menu_drawer.dart'; // Import the drawer
// Import screen widgets
import 'dashboard/dashboard_screen.dart';
import 'departamentos/departamentos_list_screen.dart';
import '../blocs/departamentos/departamentos_cubit.dart'; // Import cubit for provider
import '../api/data_service.dart'; // Import service for provider
// Import other list screens...

// Helper to get initials (similar to React)
String getInitials(String? name) {
  if (name == null || name.isEmpty) return '??';
  List<String> parts = name.trim().split(' ');
  if (parts.length > 1 && parts.first.isNotEmpty && parts.last.isNotEmpty) {
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
  } else if (parts.isNotEmpty && parts.first.isNotEmpty) {
    return (parts.first.substring(0, parts.first.length > 1 ? 2 : 1)).toUpperCase();
  }
  return '??';
}


class MainLayoutScreen extends StatefulWidget {
  const MainLayoutScreen({super.key});

  @override
  State<MainLayoutScreen> createState() => _MainLayoutScreenState();
}

class _MainLayoutScreenState extends State<MainLayoutScreen> {
  String _selectedScreen = 'dashboard'; // Default screen

  // Function to build the currently selected screen widget
  Widget _buildScreenWidget() {
    switch (_selectedScreen) {
      case 'dashboard':
        return const DashboardScreen(); // Needs to be created
      case 'departamentos':
        // Provide the Cubit needed for this specific screen
        return BlocProvider(
          create: (context) => DepartamentosCubit(dataService)..fetchDepartamentos(),
          child: const DepartamentosListScreen(),
        );
      // Add cases for other screens...
      // case 'activos_fijos':
      //   return BlocProvider( ... child: const ActivosFijosListScreen());
      default:
        return const DashboardScreen(); // Fallback
    }
  }

  // Map screen names to titles for the AppBar
  String _getScreenTitle() {
    switch (_selectedScreen) {
      case 'dashboard': return 'Dashboard';
      case 'activos_fijos': return 'Activos Fijos';
      case 'departamentos': return 'Departamentos';
      // Add other titles...
      default: return 'ActFijo App';
    }
  }

  @override
  Widget build(BuildContext context) {
    final themeConfig = context.watch<ThemeCubit>().state;
    final colors = AppThemeColors.fromConfig(themeConfig);
    // TODO: Get user info from AuthCubit for profile button
    // final authState = context.watch<AuthCubit>().state;
    // final userName = // Get name from decoded token in authState.token

    return Scaffold(
      backgroundColor: colors.primaryBg,
      appBar: AppBar(
        title: Text(_getScreenTitle(), style: TextStyle(color: colors.primaryText)),
        backgroundColor: colors.secondaryBg,
        elevation: 1,
        shadowColor: colors.borderColor,
        iconTheme: IconThemeData(color: colors.primaryText), // Drawer icon color
        actions: [
          // Profile Action Button - Placeholder
          Padding(
            padding: const EdgeInsets.only(right: 10.0),
            child: CircleAvatar(
              backgroundColor: colors.accent,
              foregroundColor: Colors.white,
              radius: 18,
              // child: Text(getInitials(userName)), // Use real initials later
              child: const Text("AG"), // Placeholder
              // TODO: Add onTap to show profile menu (logout, maybe settings)
            ),
          )
        ],
      ),
      drawer: SideMenuDrawer(
        onSelectItem: (screenName) {
          setState(() {
            _selectedScreen = screenName;
          });
          Navigator.pop(context); // Close the drawer
        },
      ),
      body: _buildScreenWidget(), // Display the selected screen
    );
  }
}

// Dummy DashboardScreen for layout testing
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});
  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.fromConfig(context.watch<ThemeCubit>().state);
    return Center(child: Text('Dashboard Screen', style: TextStyle(color: colors.primaryText)));
  }
}