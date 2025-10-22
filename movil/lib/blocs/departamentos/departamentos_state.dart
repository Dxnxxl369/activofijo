part of 'departamentos_cubit.dart';

enum DepartamentosStatus { initial, loading, success, failure }

class DepartamentosState extends Equatable {
  final DepartamentosStatus status;
  final List<Departamento> departamentos;
  final String? errorMessage;

  const DepartamentosState({
    this.status = DepartamentosStatus.initial,
    this.departamentos = const [],
    this.errorMessage,
  });

  DepartamentosState copyWith({
    DepartamentosStatus? status,
    List<Departamento>? departamentos,
    String? errorMessage,
  }) {
    return DepartamentosState(
      status: status ?? this.status,
      departamentos: departamentos ?? this.departamentos,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, departamentos, errorMessage];
}