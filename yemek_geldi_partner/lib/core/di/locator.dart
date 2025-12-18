import 'package:get_it/get_it.dart';
import 'package:dio/dio.dart';
import '../network/api_client.dart';
import '../network/dio_interceptor.dart';

final getIt = GetIt.instance;

Future<void> setupLocator() async {
  // Dio instance
  final dio = Dio();
  dio.interceptors.add(DioInterceptor());
  
  getIt.registerLazySingleton<Dio>(() => dio);
  
  // API Client
  getIt.registerLazySingleton<ApiClient>(
    () => ApiClient(getIt<Dio>()),
  );
  
  // Repositories will be registered here
  // Example:
  // getIt.registerLazySingleton<AuthRepository>(
  //   () => AuthRepositoryImpl(getIt<ApiClient>()),
  // );
  
  // Blocs will be registered here
  // Example:
  // getIt.registerFactory<AuthBloc>(
  //   () => AuthBloc(getIt<AuthRepository>()),
  // );
}

