import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../blocs/departamentos/departamentos_cubit.dart';
import '../../blocs/theme/theme_cubit.dart'; // Para colores
import '../../blocs/theme/theme_state.dart';   // Para colores
import '../../widgets/common/loading_indicator.dart';
// import 'departamento_detail_screen.dart'; // Para navegar a crear/editar

class DepartamentosListScreen extends StatelessWidget {
  const DepartamentosListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.fromConfig(context.watch<ThemeCubit>().state);
    // Aquí usarías usePermissions si ya lo tienes en Dart
    // final canManage = usePermissions().hasPermission('manage_departamento');
    const bool canManage = true; // Placeholder - Reemplaza con lógica real

    return Scaffold(
      backgroundColor: colors.primaryBg,
      appBar: AppBar(
        title: Text('Departamentos', style: TextStyle(color: colors.primaryText)),
        backgroundColor: colors.secondaryBg,
        elevation: 1,
        shadowColor: colors.borderColor,
        iconTheme: IconThemeData(color: colors.primaryText),
      ),
      body: BlocBuilder<DepartamentosCubit, DepartamentosState>(
        builder: (context, state) {
          if (state.status == DepartamentosStatus.loading && state.departamentos.isEmpty) {
            return const LoadingIndicator();
          }
          if (state.status == DepartamentosStatus.failure) {
            return Center(child: Text('Error: ${state.errorMessage}', style: TextStyle(color: Colors.red.shade400)));
          }
          if (state.departamentos.isEmpty) {
            return Center(child: Text('No hay departamentos para mostrar.', style: TextStyle(color: colors.secondaryText)));
          }

          // Lista de Departamentos
          return ListView.builder(
            itemCount: state.departamentos.length,
            itemBuilder: (context, index) {
              final depto = state.departamentos[index];
              return ListTile(
                leading: Icon(LucideIcons.building2, color: colors.accent),
                title: Text(depto.nombre, style: TextStyle(color: colors.primaryText)),
                subtitle: Text(depto.descripcion ?? 'Sin descripción', style: TextStyle(color: colors.secondaryText)),
                trailing: canManage ? Row( // Mostrar botones solo si tiene permiso
                  mainAxisSize: MainAxisSize.min,
                  children: [
                     IconButton(
                       icon: Icon(LucideIcons.edit, color: colors.tertiaryText, size: 20),
                       onPressed: () {
                         // Navegar a DetailScreen para editar
                         // Navigator.push(context, MaterialPageRoute(builder: (_) => DepartamentoDetailScreen(departamento: depto)));
                         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Editar no implementado')));
                       },
                     ),
                      IconButton(
                        icon: Icon(LucideIcons.trash2, color: Colors.red.shade400, size: 20),
                        onPressed: () {
                           // Mostrar diálogo de confirmación y llamar a cubit.delete
                           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Eliminar no implementado')));
                        },
                      ),
                  ],
                ) : null, // No mostrar botones si no puede gestionar
                 onTap: () {
                    // Si no puede gestionar, quizás mostrar solo vista
                     if (!canManage) {
                         // Navigator.push(context, MaterialPageRoute(builder: (_) => DepartamentoDetailScreen(departamento: depto, readOnly: true)));
                         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vista no implementada')));
                     }
                 },
              );
            },
          );
        },
      ),
      floatingActionButton: canManage ? FloatingActionButton( // Mostrar FAB solo si puede gestionar
        onPressed: () {
           // Navegar a DetailScreen para crear
           // Navigator.push(context, MaterialPageRoute(builder: (_) => DepartamentoDetailScreen()));
            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Crear no implementado')));
        },
        backgroundColor: colors.accent,
        foregroundColor: Colors.white,
        child: const Icon(LucideIcons.plus),
        // Aplicar efecto neón si está activo
        shape: CircleBorder(side: BorderSide(color: colors.accent.withOpacity(context.watch<ThemeCubit>().state.glowEnabled ? 0.5 : 0.0), width: 4)),
         elevation: context.watch<ThemeCubit>().state.glowEnabled ? 5 : 2,

      ) : null, // No mostrar FAB si no puede gestionar
    );
  }
}