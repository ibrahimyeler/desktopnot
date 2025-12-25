import '../entities/todo_item.dart';
import '../repositories/todo_repository.dart';

class CreateTodoUseCase {
  final TodoRepository repository;

  CreateTodoUseCase(this.repository);

  Future<TodoItem> execute({
    required String title,
    String? description,
    DateTime? dueDate,
    int priority = 1,
  }) async {
    final todo = TodoItem(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      title: title,
      description: description,
      createdAt: DateTime.now(),
      dueDate: dueDate,
      priority: priority,
    );

    return await repository.createTodo(todo);
  }
}

