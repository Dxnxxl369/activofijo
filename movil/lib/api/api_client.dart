import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/constants.dart'; // Crearemos este archivo

class ApiClient {
  final Dio _dio;
  final FlutterSecureStorage _secureStorage;

  ApiClient()
      : _dio = Dio(BaseOptions(baseUrl: AppConstants.apiBaseUrl)), // Usa la URL base
        _secureStorage = const FlutterSecureStorage() {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // Añade el token a cada petición si existe
          final token = await _secureStorage.read(key: AppConstants.tokenKey);
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
           print('--> ${options.method.toUpperCase()} ${options.uri}'); // Log petición
          return handler.next(options); // Continúa con la petición
        },
        onResponse: (response, handler) {
           print('<-- ${response.statusCode} ${response.requestOptions.uri}'); // Log respuesta
          return handler.next(response); // Continúa con la respuesta
        },
        onError: (DioException e, handler) async {
           print('<-- Error: ${e.response?.statusCode} ${e.requestOptions.uri}'); // Log error
          // Aquí se podría implementar la lógica de refresco de token si es 401
          // Por ahora, solo pasamos el error
          return handler.next(e);
        },
      ),
    );
  }

  Dio get dio => _dio; // Getter para acceder a Dio si es necesario directamente

  // Funciones helper para guardar/borrar token (usadas por AuthService)
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: AppConstants.tokenKey, value: token);
  }

  Future<void> deleteToken() async {
    await _secureStorage.delete(key: AppConstants.tokenKey);
  }

   Future<String?> getToken() async {
     return await _secureStorage.read(key: AppConstants.tokenKey);
   }
}

// Singleton instance (opcional pero común)
final apiClient = ApiClient();