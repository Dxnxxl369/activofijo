import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart'; // Or flutter_lucide
import '../../blocs/auth/auth_cubit.dart';
import '../../blocs/theme/theme_cubit.dart'; // For colors
import '../../blocs/theme/theme_state.dart';   // For colors
// Import your permissions utility (create this based on usePermissions.js)
// import '../../utils/permissions.dart'; 
// Import Settings Screen
import '../../screens/settings/settings_screen.dart'; // Adjust path

// Placeholder for permissions check - replace with your actual implementation
bool canAccess(BuildContext context, String moduleName) {
  // TODO: Implement permission check based on user roles/permissions from AuthCubit/Token
  // For now, allow all authenticated users to see everything for layout testing
  return true; 
}


class SideMenuDrawer extends StatelessWidget {
  // Callback to handle navigation item taps
  final Function(String screenName) onSelectItem;

  const SideMenuDrawer({super.key, required this.onSelectItem});

  @override
  Widget build(BuildContext context) {
    final themeConfig = context.watch<ThemeCubit>().state;
    final colors = AppThemeColors.fromConfig(themeConfig);
    // TODO: Get user info from AuthCubit state if needed for header

    return Drawer(
      backgroundColor: colors.secondaryBg,
      child: Column(
        children: [
          // Drawer Header (App Title) - Non-scrollable
          Container(
            height: kToolbarHeight + MediaQuery.of(context).padding.top, // Standard AppBar height + status bar
            padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top, left: 16, right: 16),
            alignment: Alignment.centerLeft,
            decoration: BoxDecoration(
               border: Border(bottom: BorderSide(color: colors.borderColor, width: 1.0)),
            ),
            child: Text(
              'ActFijo App',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: colors.primaryText),
            ),
          ),

          // Scrollable Navigation List
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero, // Remove default padding
              children: <Widget>[
                // Use _buildDrawerItem helper
                if (canAccess(context,'dashboard')) _buildDrawerItem(context, colors, 'Dashboard', LucideIcons.layoutGrid, () => onSelectItem('dashboard')),
                if (canAccess(context,'activos_fijos')) _buildDrawerItem(context, colors, 'Activos Fijos', LucideIcons.box, () => onSelectItem('activos_fijos')),
                if (canAccess(context,'departamentos')) _buildDrawerItem(context, colors, 'Departamentos', LucideIcons.building2, () => onSelectItem('departamentos')),
                if (canAccess(context,'cargos')) _buildDrawerItem(context, colors, 'Cargos', LucideIcons.briefcase, () => onSelectItem('cargos')),
                if (canAccess(context,'empleados')) _buildDrawerItem(context, colors, 'Empleados', LucideIcons.users, () => onSelectItem('empleados')),
                if (canAccess(context,'roles')) _buildDrawerItem(context, colors, 'Roles', LucideIcons.shieldCheck, () => onSelectItem('roles')),
                if (canAccess(context,'presupuestos')) _buildDrawerItem(context, colors, 'Presupuestos', LucideIcons.piggyBank, () => onSelectItem('presupuestos')),
                if (canAccess(context,'ubicaciones')) _buildDrawerItem(context, colors, 'Ubicaciones', LucideIcons.mapPin, () => onSelectItem('ubicaciones')),
                if (canAccess(context,'proveedores')) _buildDrawerItem(context, colors, 'Proveedores', LucideIcons.truck, () => onSelectItem('proveedores')),
                if (canAccess(context,'categorias')) _buildDrawerItem(context, colors, 'Categorías', LucideIcons.folderTree, () => onSelectItem('categorias')),
                if (canAccess(context,'estados')) _buildDrawerItem(context, colors, 'Estados', LucideIcons.activitySquare, () => onSelectItem('estados')),
                if (canAccess(context,'reportes')) _buildDrawerItem(context, colors, 'Reportes', LucideIcons.fileText, () => onSelectItem('reportes')),
                if (canAccess(context,'permisos')) _buildDrawerItem(context, colors, 'Permisos', LucideIcons.keyRound, () => onSelectItem('permisos')),
                 // Add more items based on permissions...
              ],
            ),
          ),

          // Footer Section (Settings, Logout) - Non-scrollable
          Container(
             decoration: BoxDecoration(
               border: Border(top: BorderSide(color: colors.borderColor, width: 1.0)),
            ),
            child: Column(
              children: [
                 _buildDrawerItem(context, colors, 'Personalizar', LucideIcons.settings, () {
                    Navigator.pop(context); // Close drawer first
                    Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
                 }),
                 const Divider(height: 1, thickness: 1, indent: 16, endIndent: 16), // Visual separator
                 _buildDrawerItem(context, colors, 'Cerrar Sesión', LucideIcons.logOut, () {
                    context.read<AuthCubit>().logout();
                    Navigator.pop(context); // Close drawer
                 }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Helper widget for drawer items
  Widget _buildDrawerItem(BuildContext context, AppThemeColors colors, String title, IconData icon, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: colors.secondaryText, size: 22),
      title: Text(title, style: TextStyle(color: colors.primaryText, fontSize: 15)),
      onTap: onTap,
      dense: true, // Make items a bit smaller
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}