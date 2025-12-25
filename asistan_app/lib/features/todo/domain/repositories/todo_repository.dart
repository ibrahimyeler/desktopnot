import '../entities/todo_item.dart';

abstract class TodoRepository {
  Future<List<TodoItem>> getAllTodos();
  Future<TodoItem> createTodo(TodoItem todo);
  Future<TodoItem> updateTodo(TodoItem todo);
  Future<void> deleteTodo(String id);
  Future<TodoItem?> getTodoById(String id);
}

