import '../entities/note.dart';
import '../repositories/notes_repository.dart';

class GetAllNotesUseCase {
  final NotesRepository repository;

  GetAllNotesUseCase(this.repository);

  Future<List<Note>> execute() async {
    return await repository.getAllNotes();
  }
}

