import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../repository/community_repository.dart';
import '../providers/feed_provider.dart';
import '../widgets/category_chip.dart';
import '../providers/category_provider.dart';

/// Create Post Screen - Form to create a new community post
class CreatePostScreen extends StatefulWidget {
  const CreatePostScreen({super.key});

  @override
  State<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  final CommunityRepository _repository = CommunityRepository();
  
  String? _selectedCategoryId;
  bool _isSubmitting = false;
  final String _currentUserId = 'user_0'; // Mock user ID

  @override
  void initState() {
    super.initState();
    // Load categories
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CategoryProvider>().loadCategories();
    });
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  Future<void> _publishPost() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCategoryId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen bir kategori seçin'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final category = context.read<CategoryProvider>().getCategoryById(_selectedCategoryId!);
      if (category == null) {
        throw Exception('Kategori bulunamadı');
      }

      // Extract hashtags from content
      final hashtags = _extractHashtags(_contentController.text);

      await _repository.createPost(
        authorId: _currentUserId,
        title: _titleController.text.trim(),
        content: _contentController.text.trim(),
        category: category.name,
        hashtags: hashtags.isNotEmpty ? hashtags : null,
      );

      // Refresh feed if available
      if (mounted) {
        final feedProvider = context.read<FeedProvider>();
        if (feedProvider.posts.isNotEmpty) {
          await feedProvider.refresh();
        }
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Gönderi başarıyla oluşturuldu!'),
            backgroundColor: Color(0xFFFFB800),
          ),
        );
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Hata: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  List<String> _extractHashtags(String text) {
    final regex = RegExp(r'#\w+');
    return regex.allMatches(text).map((match) => match.group(0)!).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Yeni Gönderi',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (_isSubmitting)
            const Padding(
              padding: EdgeInsets.all(16),
              child: SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  color: Color(0xFFFFB800),
                  strokeWidth: 2,
                ),
              ),
            )
          else
            TextButton(
              onPressed: _publishPost,
              child: const Text(
                'Yayınla',
                style: TextStyle(
                  color: Color(0xFFFFB800),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Category selector
              const Text(
                'Kategori',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              
              Consumer<CategoryProvider>(
                builder: (context, categoryProvider, child) {
                  if (categoryProvider.isLoading) {
                    return const Center(
                      child: CircularProgressIndicator(
                        color: Color(0xFFFFB800),
                      ),
                    );
                  }

                  return Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: categoryProvider.categories.map((category) {
                      final isSelected = _selectedCategoryId == category.id;
                      return CategoryChip(
                        category: category,
                        isSelected: isSelected,
                        onTap: () {
                          setState(() {
                            _selectedCategoryId = category.id;
                          });
                        },
                        compact: true,
                      );
                    }).toList(),
                  );
                },
              ),
              
              const SizedBox(height: 24),
              
              // Title
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Başlık',
                  hintStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0xFF1F2937),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[800]!),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[800]!),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFFFB800)),
                  ),
                  contentPadding: const EdgeInsets.all(16),
                ),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Lütfen başlık girin';
                  }
                  if (value.trim().length < 3) {
                    return 'Başlık en az 3 karakter olmalı';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),
              
              // Content
              TextFormField(
                controller: _contentController,
                maxLines: null,
                minLines: 10,
                decoration: InputDecoration(
                  hintText: 'Gönderinizi buraya yazın...\n\nHashtag eklemek için # işareti kullanın',
                  hintStyle: const TextStyle(color: Colors.white70),
                  filled: true,
                  fillColor: const Color(0xFF1F2937),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[800]!),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: Colors.grey[800]!),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFFFB800)),
                  ),
                  contentPadding: const EdgeInsets.all(16),
                ),
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  height: 1.6,
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Lütfen gönderi içeriği girin';
                  }
                  if (value.trim().length < 10) {
                    return 'İçerik en az 10 karakter olmalı';
                  }
                  return null;
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
