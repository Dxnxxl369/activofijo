import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/theme/theme_cubit.dart'; // Ajusta path
import '../../blocs/theme/theme_state.dart';   // Ajusta path

class LoadingIndicator extends StatelessWidget {
  const LoadingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.fromConfig(context.watch<ThemeCubit>().state);
    return Center(
      child: CircularProgressIndicator(
        valueColor: AlwaysStoppedAnimation<Color>(colors.accent),
        strokeWidth: 3.0,
      ),
    );
  }
}