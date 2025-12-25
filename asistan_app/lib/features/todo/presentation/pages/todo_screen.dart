import 'package:flutter/material.dart';
import '../widgets/todo_item_card.dart';
import '../widgets/add_todo_dialog.dart';
import '../../domain/entities/todo_item.dart';
import '../../domain/repositories/todo_repository.dart';
import '../../domain/usecases/get_all_todos_usecase.dart';
import '../../domain/usecases/create_todo_usecase.dart';
import '../../domain/usecases/toggle_todo_usecase.dart';
import '../../domain/usecases/delete_todo_usecase.dart';
import '../../data/repositories/todo_repository_impl.dart';

class TodoScreen extends StatefulWidget {
  const TodoScreen({super.key});

  @override
  State<TodoScreen> createState() => _TodoScreenState();
}

class _TodoScreenState extends State<TodoScreen> {
  List<TodoItem> _todos = [];
  bool _isLoading = true;
  String _filter = 'all'; // all, pending, completed

  late final GetAllTodosUseCase _getAllTodosUseCase;
  late final CreateTodoUseCase _createTodoUseCase;
  late final ToggleTodoUseCase _toggleTodoUseCase;
  late final DeleteTodoUseCase _deleteTodoUseCase;

  @override
  void initState() {
    super.initState();
    _initializeDependencies();
    _loadTodos();
  }

  void _initializeDependencies() {
    final repository = TodoRepositoryImpl();
    _getAllTodosUseCase = GetAllTodosUseCase(repository);
    _createTodoUseCase = CreateTodoUseCase(repository);
    _toggleTodoUseCase = ToggleTodoUseCase(repository);
    _deleteTodoUseCase = DeleteTodoUseCase(repository);
  }

  Future<void> _loadTodos() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final todos = await _getAllTodosUseCase.execute();
      setState(() {
        _todos = todos;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Görevler yüklenirken hata oluştu: $e')),
        );
      }
    }
  }

  Future<void> _addTodo() async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => const AddTodoDialog(),
    );

    if (result != null) {
      try {
        await _createTodoUseCase.execute(
          title: result['title'],
          description: result['description'],
          dueDate: result['dueDate'],
          priority: result['priority'],
        );
        _loadTodos();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Görev eklendi')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Görev eklenirken hata oluştu: $e')),
          );
        }
      }
    }
  }

  Future<void> _toggleTodo(String id) async {
    try {
      await _toggleTodoUseCase.execute(id);
      _loadTodos();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Görev güncellenirken hata oluştu: $e')),
        );
      }
    }
  }

  Future<void> _deleteTodo(String id) async {
    try {
      await _deleteTodoUseCase.execute(id);
      _loadTodos();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Görev silindi')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Görev silinirken hata oluştu: $e')),
        );
      }
    }
  }

  List<TodoItem> get _filteredTodos {
    switch (_filter) {
      case 'pending':
        return _todos.where((todo) => !todo.isCompleted).toList();
      case 'completed':
        return _todos.where((todo) => todo.isCompleted).toList();
      default:
        return _todos;
    }
  }

  @override
  Widget build(BuildContext context) {
    final pendingCount = _todos.where((todo) => !todo.isCompleted).length;
    final completedCount = _todos.where((todo) => todo.isCompleted).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Yapılacaklar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTodos,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filtreler
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildFilterChip('all', 'Tümü', _todos.length),
                _buildFilterChip('pending', 'Bekleyen', pendingCount),
                _buildFilterChip('completed', 'Tamamlanan', completedCount),
              ],
            ),
          ),
          const Divider(),

          // Liste
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredTodos.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.check_circle_outline,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _filter == 'pending'
                                  ? 'Bekleyen görev yok'
                                  : _filter == 'completed'
                                      ? 'Tamamlanan görev yok'
                                      : 'Henüz görev eklenmedi',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadTodos,
                        child: ListView.builder(
                          itemCount: _filteredTodos.length,
                          itemBuilder: (context, index) {
                            final todo = _filteredTodos[index];
                            return TodoItemCard(
                              todo: todo,
                              onTap: () {
                                // Detay sayfasına gidebilir
                              },
                              onToggle: () => _toggleTodo(todo.id),
                              onDelete: () => _deleteTodo(todo.id),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addTodo,
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChip(String value, String label, int count) {
    final isSelected = _filter == value;
    return FilterChip(
      label: Text('$label ($count)'),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _filter = value;
        });
      },
    );
  }
}

