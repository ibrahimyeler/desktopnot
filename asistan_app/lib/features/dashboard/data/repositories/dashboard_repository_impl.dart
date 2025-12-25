import '../../domain/entities/dashboard_stats.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../../../todo/domain/repositories/todo_repository.dart';
import '../../../notes/domain/repositories/notes_repository.dart';
import '../../../chat/domain/repositories/chat_repository.dart';
import '../../../todo/data/repositories/todo_repository_impl.dart';
import '../../../notes/data/repositories/notes_repository_impl.dart';
import '../../../chat/data/repositories/chat_repository_impl.dart';

class DashboardRepositoryImpl implements DashboardRepository {
  final TodoRepository _todoRepository = TodoRepositoryImpl();
  final NotesRepository _notesRepository = NotesRepositoryImpl();
  final ChatRepository _chatRepository = ChatRepositoryImpl();

  @override
  Future<DashboardStats> getStats() async {
    final todos = await _todoRepository.getAllTodos();
    final notes = await _notesRepository.getAllNotes();
    final chatHistory = await _chatRepository.getChatHistory();

    final completedTodos = todos.where((todo) => todo.isCompleted).length;
    final pendingTodos = todos.length - completedTodos;

    return DashboardStats(
      totalTodos: todos.length,
      completedTodos: completedTodos,
      pendingTodos: pendingTodos,
      totalNotes: notes.length,
      recentChats: chatHistory.length,
    );
  }
}

