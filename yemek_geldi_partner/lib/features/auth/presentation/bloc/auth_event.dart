import 'package:equatable/equatable.dart';
import '../../data/models/login_request_model.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();
  
  @override
  List<Object> get props => [];
}

class LoginRequested extends AuthEvent {
  final LoginRequestModel request;
  
  const LoginRequested(this.request);
  
  @override
  List<Object> get props => [request];
}

class LogoutRequested extends AuthEvent {
  const LogoutRequested();
}

class AuthStatusChecked extends AuthEvent {
  const AuthStatusChecked();
}

