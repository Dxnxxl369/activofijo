import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../api/auth_service.dart'; // Ajusta path
import '../../api/api_client.dart';   // Ajusta path

part 'auth_state.dart'; // Usa 'part' para enlazar

class AuthCubit extends Cubit<AuthState> {
  final AuthService _authService;
  final ApiClient _apiClient;

  AuthCubit(this._authService, this._apiClient) : super(const AuthState()) {
    _checkInitialAuthStatus();
  }

  Future<void> _checkInitialAuthStatus() async {
     final token = await _apiClient.getToken();
     if (token != null && token.isNotEmpty) {
        // Aquí podrías decodificar el token para verificar expiración si quieres
        emit(state.copyWith(status: AuthStatus.authenticated, token: token));
     } else {
        emit(state.copyWith(status: AuthStatus.unauthenticated));
     }
  }


  Future<void> login(String username, String password) async {
    emit(state.copyWith(status: AuthStatus.loading, errorMessage: null)); // Borra errores previos
    try {
      final token = await _authService.login(username, password);
      emit(state.copyWith(status: AuthStatus.authenticated, token: token));
    } catch (e) {
      emit(state.copyWith(
        status: AuthStatus.unauthenticated,
        errorMessage: e is Exception ? e.toString().replaceFirst('Exception: ', '') : 'Error desconocido',
      ));
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    emit(state.copyWith(status: AuthStatus.unauthenticated, token: null)); // Usa null explícito
  }
}