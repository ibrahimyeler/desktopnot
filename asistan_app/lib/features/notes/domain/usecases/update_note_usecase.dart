import '../entities/note.dart';
import '../repositories/notes_repository.dart';

class UpdateNoteUseCase {
  final NotesRepository repository;

  UpdateNoteUseCase(this.repository);

  Future<Note> execute({
    required String id,
    required String title,
    required String content,
    List<String> tags = const [],
  }) async {
    final existingNote = await repository.getNoteById(id);
    if (existingNote == null) {
      throw Exception('Not bulunamadı');
    }

    final updatedNote = existingNote.copyWith(
      title: title,
      content: content,
      updatedAt: DateTime.now(),
      tags: tags,
    );

    return await repository.updateNote(updatedNote);
  }
}

