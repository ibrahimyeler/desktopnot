import '../entities/todo_item.dart';
import '../repositories/todo_repository.dart';

class GetAllTodosUseCase {
  final TodoRepository repository;

  GetAllTodosUseCase(this.repository);

  Future<List<TodoItem>> execute() async {
    return await repository.getAllTodos();
  }
}

