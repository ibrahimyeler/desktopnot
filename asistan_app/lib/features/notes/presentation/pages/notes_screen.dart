import 'package:flutter/material.dart';
import '../widgets/note_card.dart';
import '../widgets/note_editor_dialog.dart';
import '../../domain/entities/note.dart';
import '../../domain/repositories/notes_repository.dart';
import '../../domain/usecases/get_all_notes_usecase.dart';
import '../../domain/usecases/create_note_usecase.dart';
import '../../domain/usecases/update_note_usecase.dart';
import '../../domain/usecases/delete_note_usecase.dart';
import '../../domain/usecases/search_notes_usecase.dart';
import '../../data/repositories/notes_repository_impl.dart';

class NotesScreen extends StatefulWidget {
  const NotesScreen({super.key});

  @override
  State<NotesScreen> createState() => _NotesScreenState();
}

class _NotesScreenState extends State<NotesScreen> {
  List<Note> _notes = [];
  List<Note> _filteredNotes = [];
  bool _isLoading = true;
  final TextEditingController _searchController = TextEditingController();

  late final GetAllNotesUseCase _getAllNotesUseCase;
  late final CreateNoteUseCase _createNoteUseCase;
  late final UpdateNoteUseCase _updateNoteUseCase;
  late final DeleteNoteUseCase _deleteNoteUseCase;
  late final SearchNotesUseCase _searchNotesUseCase;

  @override
  void initState() {
    super.initState();
    _initializeDependencies();
    _loadNotes();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _initializeDependencies() {
    final repository = NotesRepositoryImpl();
    _getAllNotesUseCase = GetAllNotesUseCase(repository);
    _createNoteUseCase = CreateNoteUseCase(repository);
    _updateNoteUseCase = UpdateNoteUseCase(repository);
    _deleteNoteUseCase = DeleteNoteUseCase(repository);
    _searchNotesUseCase = SearchNotesUseCase(repository);
  }

  void _onSearchChanged() {
    final query = _searchController.text.trim();
    if (query.isEmpty) {
      setState(() {
        _filteredNotes = _notes;
      });
    } else {
      _searchNotes(query);
    }
  }

  Future<void> _searchNotes(String query) async {
    try {
      final results = await _searchNotesUseCase.execute(query);
      setState(() {
        _filteredNotes = results;
      });
    } catch (e) {
      // Hata durumunda tüm notları göster
      setState(() {
        _filteredNotes = _notes;
      });
    }
  }

  Future<void> _loadNotes() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final notes = await _getAllNotesUseCase.execute();
      setState(() {
        _notes = notes;
        _filteredNotes = notes;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Notlar yüklenirken hata oluştu: $e')),
        );
      }
    }
  }

  Future<void> _addNote() async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => const NoteEditorDialog(),
    );

    if (result != null) {
      try {
        await _createNoteUseCase.execute(
          title: result['title'],
          content: result['content'],
          tags: List<String>.from(result['tags']),
        );
        _loadNotes();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Not eklendi')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Not eklenirken hata oluştu: $e')),
          );
        }
      }
    }
  }

  Future<void> _editNote(Note note) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      builder: (context) => NoteEditorDialog(note: note),
    );

    if (result != null) {
      try {
        await _updateNoteUseCase.execute(
          id: note.id,
          title: result['title'],
          content: result['content'],
          tags: List<String>.from(result['tags']),
        );
        _loadNotes();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Not güncellendi')),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Not güncellenirken hata oluştu: $e')),
          );
        }
      }
    }
  }

  Future<void> _deleteNote(String id) async {
    try {
      await _deleteNoteUseCase.execute(id);
      _loadNotes();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Not silindi')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Not silinirken hata oluştu: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notlar'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadNotes,
          ),
        ],
      ),
      body: Column(
        children: [
          // Arama çubuğu
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Notlarda ara...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),

          // Liste
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredNotes.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.note_outlined,
                              size: 64,
                              color: Colors.grey[400],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _searchController.text.isNotEmpty
                                  ? 'Arama sonucu bulunamadı'
                                  : 'Henüz not eklenmedi',
                              style: TextStyle(
                                fontSize: 18,
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadNotes,
                        child: ListView.builder(
                          itemCount: _filteredNotes.length,
                          itemBuilder: (context, index) {
                            final note = _filteredNotes[index];
                            return NoteCard(
                              note: note,
                              onTap: () => _editNote(note),
                              onDelete: () => _deleteNote(note.id),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addNote,
        child: const Icon(Icons.add),
      ),
    );
  }
}

