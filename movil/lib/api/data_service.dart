import 'package:dio/dio.dart';
import 'api_client.dart';
import '../models/departamento.dart'; // Crearemos este modelo

class DataService {
  final ApiClient _apiClient;

  DataService() : _apiClient = apiClient;

  // --- Funciones para Departamentos ---
  Future<List<Departamento>> getDepartamentos() async {
    try {
      final response = await _apiClient.dio.get('/departamentos/');
      // Asume respuesta paginada o lista directa
      final data = response.data;
      final List results = (data is Map && data.containsKey('results')) ? data['results'] : data;
      return results.map((json) => Departamento.fromJson(json)).toList();
    } catch (e) {
      print("Error fetching departamentos: $e");
      throw Exception('No se pudieron cargar los departamentos');
    }
  }

   Future<Departamento> createDepartamento(String nombre, String? descripcion) async {
     try {
       final response = await _apiClient.dio.post('/departamentos/', data: {
         'nombre': nombre,
         'descripcion': descripcion,
       });
       // Aquí también podrías llamar a logAction si lo implementas en Dart
       return Departamento.fromJson(response.data);
     } catch (e) {
       print("Error creating departamento: $e");
       throw Exception('Error al crear el departamento');
     }
   }

   Future<Departamento> updateDepartamento(String id, String nombre, String? descripcion) async {
     try {
       final response = await _apiClient.dio.put('/departamentos/$id/', data: {
         'nombre': nombre,
         'descripcion': descripcion,
       });
       return Departamento.fromJson(response.data);
     } catch (e) {
       print("Error updating departamento: $e");
       throw Exception('Error al actualizar el departamento');
     }
   }

   Future<void> deleteDepartamento(String id) async {
     try {
       await _apiClient.dio.delete('/departamentos/$id/');
       // El delete exitoso devuelve 204 No Content
     } catch (e) {
       print("Error deleting departamento: $e");
       throw Exception('Error al eliminar el departamento');
     }
   }

  // ... (Aquí irían funciones para ActivosFijos, Empleados, etc.)
}

// Singleton
final dataService = DataService();