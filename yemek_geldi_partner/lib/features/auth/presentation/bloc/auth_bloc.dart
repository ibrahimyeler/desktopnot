import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import '../../domain/entities/user.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository authRepository;
  final FlutterSecureStorage storage = const FlutterSecureStorage();
  
  AuthBloc(this.authRepository) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<AuthStatusChecked>(_onAuthStatusChecked);
  }
  
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    final result = await authRepository.login(event.request);
    
    // Either'ı kontrol et ve async işlemleri await et
    final eitherResult = result.fold<Future<void>>(
      (failure) async {
        emit(AuthError(failure.message));
      },
      (data) async {
        final token = data['token'] as String? ?? '';
        final userData = data['user'] as Map<String, dynamic>? ?? {};
        
        await storage.write(key: 'auth_token', value: token);
        
        final user = User(
          id: userData['id']?.toString() ?? '',
          email: userData['email']?.toString() ?? '',
          name: userData['name']?.toString() ?? '',
          phone: userData['phone']?.toString(),
          avatar: userData['avatar']?.toString(),
        );
        
        emit(AuthAuthenticated(user: user, token: token));
      },
    );
    
    await eitherResult;
  }
  
  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    final result = await authRepository.logout();
    
    final eitherResult = result.fold<Future<void>>(
      (failure) async {
        emit(AuthError(failure.message));
      },
      (_) async {
        await storage.delete(key: 'auth_token');
        emit(AuthUnauthenticated());
      },
    );
    
    await eitherResult;
  }
  
  Future<void> _onAuthStatusChecked(
    AuthStatusChecked event,
    Emitter<AuthState> emit,
  ) async {
    final token = await storage.read(key: 'auth_token');
    
    if (token != null && token.isNotEmpty) {
      // TODO: Validate token and get user data
      emit(AuthUnauthenticated());
    } else {
      emit(AuthUnauthenticated());
    }
  }
}

