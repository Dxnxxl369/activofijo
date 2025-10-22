import 'package:dio/dio.dart';
import 'api_client.dart'; // Importa el singleton

class AuthService {
  final ApiClient _apiClient;

  AuthService() : _apiClient = apiClient;

  Future<String> login(String username, String password) async {
    try {
      final response = await _apiClient.dio.post(
        '/token/', // Endpoint de login
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200 && response.data['access'] != null) {
        final token = response.data['access'];
        await _apiClient.saveToken(token); // Guarda el token de forma segura
        return token;
      } else {
        throw Exception('Respuesta inválida del servidor');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw Exception('Usuario o contraseña incorrectos');
      }
      print("DioError en login: ${e.response?.data ?? e.message}");
      throw Exception('Error de red al iniciar sesión');
    } catch (e) {
      print("Error inesperado en login: $e");
      throw Exception('Ocurrió un error inesperado');
    }
  }

  Future<void> logout() async {
    await _apiClient.deleteToken(); // Borra el token guardado
  }

   // Podrías añadir aquí la función register() llamando a /api/register/
}