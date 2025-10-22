part of 'auth_cubit.dart'; // Usa 'part of' para enlazar

// Estados posibles de la autenticación
enum AuthStatus { unknown, authenticated, unauthenticated, loading }

class AuthState extends Equatable {
  final AuthStatus status;
  final String? token; // Guardamos el token aquí también (o info decodificada)
  final String? errorMessage;

  const AuthState({
    this.status = AuthStatus.unknown,
    this.token,
    this.errorMessage,
  });

  AuthState copyWith({
    AuthStatus? status,
    String? token, // Usa String? para poder ponerlo a null
    String? errorMessage,
  }) {
    return AuthState(
      status: status ?? this.status,
      token: token ?? this.token,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, token, errorMessage];
}