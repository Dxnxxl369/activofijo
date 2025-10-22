import 'package:equatable/equatable.dart';

class Departamento extends Equatable {
  final String id;
  final String nombre;
  final String? descripcion;
  // Añade otros campos si los necesitas (empresa, etc.)

  const Departamento({
    required this.id,
    required this.nombre,
    this.descripcion,
  });

  factory Departamento.fromJson(Map<String, dynamic> json) {
    return Departamento(
      id: json['id'] as String,
      nombre: json['nombre'] as String,
      descripcion: json['descripcion'] as String?,
    );
  }

  // Necesario para Equatable
  @override
  List<Object?> get props => [id, nombre, descripcion];
}