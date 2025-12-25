import '../entities/todo_item.dart';
import '../repositories/todo_repository.dart';

class ToggleTodoUseCase {
  final TodoRepository repository;

  ToggleTodoUseCase(this.repository);

  Future<TodoItem> execute(String id) async {
    final todo = await repository.getTodoById(id);
    if (todo == null) {
      throw Exception('Todo bulunamadı');
    }

    final updatedTodo = todo.copyWith(
      isCompleted: !todo.isCompleted,
      completedAt: !todo.isCompleted ? DateTime.now() : null,
    );

    return await repository.updateTodo(updatedTodo);
  }
}

