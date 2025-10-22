import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../api/data_service.dart';    // Ajusta path
import '../../models/departamento.dart'; // Ajusta path

part  'departamentos_state.dart';

class DepartamentosCubit extends Cubit<DepartamentosState> {
  final DataService _dataService;

  DepartamentosCubit(this._dataService) : super(const DepartamentosState());

  Future<void> fetchDepartamentos() async {
    emit(state.copyWith(status: DepartamentosStatus.loading, errorMessage: null));
    try {
      final deptos = await _dataService.getDepartamentos();
      emit(state.copyWith(status: DepartamentosStatus.success, departamentos: deptos));
    } catch (e) {
      emit(state.copyWith(
        status: DepartamentosStatus.failure,
        errorMessage: e is Exception ? e.toString().replaceFirst('Exception: ', '') : 'Error desconocido',
      ));
    }
  }

  // Aquí añadirías métodos para create, update, delete
  // que llaman a _dataService y luego llaman a fetchDepartamentos() para refrescar
}