import '../../domain/entities/todo_item.dart';
import '../../domain/repositories/todo_repository.dart';

class TodoRepositoryImpl implements TodoRepository {
  final List<TodoItem> _todos = [];

  @override
  Future<List<TodoItem>> getAllTodos() async {
    return List.unmodifiable(_todos);
  }

  @override
  Future<TodoItem> createTodo(TodoItem todo) async {
    _todos.add(todo);
    return todo;
  }

  @override
  Future<TodoItem> updateTodo(TodoItem todo) async {
    final index = _todos.indexWhere((t) => t.id == todo.id);
    if (index != -1) {
      _todos[index] = todo;
      return todo;
    }
    throw Exception('Todo bulunamadı');
  }

  @override
  Future<void> deleteTodo(String id) async {
    _todos.removeWhere((todo) => todo.id == id);
  }

  @override
  Future<TodoItem?> getTodoById(String id) async {
    try {
      return _todos.firstWhere((todo) => todo.id == id);
    } catch (e) {
      return null;
    }
  }
}

