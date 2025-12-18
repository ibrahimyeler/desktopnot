import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../data/models/login_request_model.dart';

abstract class AuthRepository {
  Future<Either<Failure, Map<String, dynamic>>> login(LoginRequestModel request);
  Future<Either<Failure, void>> logout();
}

