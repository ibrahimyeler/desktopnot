import '../entities/note.dart';
import '../repositories/notes_repository.dart';

class SearchNotesUseCase {
  final NotesRepository repository;

  SearchNotesUseCase(this.repository);

  Future<List<Note>> execute(String query) async {
    return await repository.searchNotes(query);
  }
}

