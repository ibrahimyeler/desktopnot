import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../app/navigation/route_names.dart';
import '../providers/post_provider.dart';
import '../widgets/comment_item.dart';
import '../models/post.dart';

/// Post Detail Screen - Shows detailed post with comments
class PostDetailScreen extends StatefulWidget {
  final String postId;

  const PostDetailScreen({
    super.key,
    required this.postId,
  });

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  final TextEditingController _commentController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final String _currentUserId = 'user_0'; // Mock user ID

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PostProvider>().loadPost(widget.postId);
      
      // Infinite scroll for comments
      _scrollController.addListener(_onCommentScroll);
    });
  }

  void _onCommentScroll() {
    final postProvider = context.read<PostProvider>();
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent * 0.9) {
      if (!postProvider.commentsLoading && postProvider.hasMoreComments) {
        postProvider.loadComments(widget.postId);
      }
    }
  }

  @override
  void dispose() {
    _commentController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Color _getCategoryColor(String category) {
    switch (category.toLowerCase()) {
      case 'üretkenlik':
        return Colors.orange;
      case 'dil':
        return Colors.blue;
      case 'finans':
        return Colors.green;
      case 'sağlık':
        return Colors.red;
      default:
        return Colors.purple;
    }
  }

  void _submitComment() {
    if (_commentController.text.trim().isEmpty) return;

    context.read<PostProvider>().addComment(
      postId: widget.postId,
      authorId: _currentUserId,
      content: _commentController.text.trim(),
    );

    _commentController.clear();
    FocusScope.of(context).unfocus();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Gönderi',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.flag_outlined, color: Colors.white),
            onPressed: () => context.push(AppRoutes.reportPost),
          ),
        ],
      ),
      body: Consumer<PostProvider>(
        builder: (context, postProvider, child) {
          if (postProvider.isLoading && postProvider.post == null) {
            return const Center(
              child: CircularProgressIndicator(
                color: Color(0xFFFFB800),
              ),
            );
          }

          if (postProvider.post == null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, color: Colors.red, size: 48),
                  const SizedBox(height: 16),
                  const Text(
                    'Gönderi bulunamadı',
                    style: TextStyle(color: Colors.white, fontSize: 16),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.pop(),
                    child: const Text('Geri Dön'),
                  ),
                ],
              ),
            );
          }

          final post = postProvider.post!;
          final categoryColor = _getCategoryColor(post.category);

          return Column(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Author info
                      Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              // Navigate to user profile
                            },
                            child: CircleAvatar(
                              radius: 24,
                              backgroundColor: categoryColor.withOpacity(0.2),
                              backgroundImage: post.authorAvatar != null
                                  ? NetworkImage(post.authorAvatar!)
                                  : null,
                              child: post.authorAvatar == null
                                  ? Text(
                                      post.authorName[0].toUpperCase(),
                                      style: TextStyle(
                                        color: categoryColor,
                                        fontWeight: FontWeight.bold,
                                        fontSize: 20,
                                      ),
                                    )
                                  : null,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Flexible(
                                      child: Text(
                                        post.authorName,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (post.isVerified) ...[
                                      const SizedBox(width: 4),
                                      const Icon(
                                        Icons.verified,
                                        color: Color(0xFFFFB800),
                                        size: 18,
                                      ),
                                    ],
                                  ],
                                ),
                                Text(
                                  _formatTime(post.createdAt),
                                  style: TextStyle(
                                    color: Colors.grey[500],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          // Category badge
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            decoration: BoxDecoration(
                              color: categoryColor.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: categoryColor),
                            ),
                            child: Text(
                              post.category,
                              style: TextStyle(
                                color: categoryColor,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      
                      // Title
                      Text(
                        post.title,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Content
                      Text(
                        post.content,
                        style: const TextStyle(
                          color: Colors.white70,
                          fontSize: 16,
                          height: 1.6,
                        ),
                      ),
                      
                      // Hashtags
                      if (post.hashtags != null && post.hashtags!.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Wrap(
                          spacing: 8,
                          runSpacing: 4,
                          children: post.hashtags!.map((tag) {
                            return Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFF111827),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                tag,
                                style: TextStyle(
                                  color: categoryColor,
                                  fontSize: 13,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                      
                      const SizedBox(height: 24),
                      
                      // Actions
                      Row(
                        children: [
                          InkWell(
                            onTap: () => postProvider.toggleLike(_currentUserId),
                            borderRadius: BorderRadius.circular(20),
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 12,
                                vertical: 8,
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    post.isLiked
                                        ? Icons.favorite
                                        : Icons.favorite_outline,
                                    color: post.isLiked
                                        ? Colors.red
                                        : Colors.grey[400],
                                    size: 24,
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    _formatCount(post.likes),
                                    style: TextStyle(
                                      color: post.isLiked
                                          ? Colors.red
                                          : Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 24),
                          Row(
                            children: [
                              const Icon(
                                Icons.comment_outlined,
                                color: Colors.blue,
                                size: 24,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _formatCount(post.comments),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                          const Spacer(),
                          InkWell(
                            onTap: () => postProvider.toggleSave(_currentUserId),
                            borderRadius: BorderRadius.circular(20),
                            child: Padding(
                              padding: const EdgeInsets.all(8),
                              child: Icon(
                                post.isSaved
                                    ? Icons.bookmark
                                    : Icons.bookmark_border,
                                color: post.isSaved
                                    ? const Color(0xFFFFB800)
                                    : Colors.grey[400],
                                size: 24,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.share, color: Colors.white),
                            onPressed: () {
                              // Share functionality
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      
                      // Comments section
                      Text(
                        'Yorumlar (${postProvider.comments.length})',
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Comments list
                      if (postProvider.comments.isEmpty && !postProvider.commentsLoading)
                        const Padding(
                          padding: EdgeInsets.all(32),
                          child: Center(
                            child: Text(
                              'Henüz yorum yok. İlk yorumu sen yap!',
                              style: TextStyle(
                                color: Color(0xFF9CA3AF),
                                fontSize: 14,
                              ),
                            ),
                          ),
                        )
                      else
                        ...postProvider.comments.map((comment) => Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: CommentItem(
                                comment: comment,
                                onLike: () => postProvider.toggleCommentLike(
                                  comment.id,
                                  widget.postId,
                                ),
                                onReply: () {
                                  // Show reply dialog
                                },
                                showReplies: true,
                              ),
                            )),
                      
                      // Loading indicator for comments
                      if (postProvider.commentsLoading)
                        const Padding(
                          padding: EdgeInsets.all(20),
                          child: Center(
                            child: CircularProgressIndicator(
                              color: Color(0xFFFFB800),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              
              // Comment input
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFF1F2937),
                  border: Border(
                    top: BorderSide(color: Color(0xFF374151)),
                  ),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _commentController,
                        decoration: InputDecoration(
                          hintText: 'Yorum yazın...',
                          hintStyle: TextStyle(color: Colors.grey[600]),
                          filled: true,
                          fillColor: const Color(0xFF111827),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(color: Colors.grey[800]!),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide(color: Colors.grey[800]!),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: const BorderSide(
                              color: Color(0xFFFFB800),
                            ),
                          ),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 12,
                          ),
                        ),
                        style: const TextStyle(color: Colors.white),
                        maxLines: null,
                        textInputAction: TextInputAction.send,
                        onSubmitted: (_) => _submitComment(),
                      ),
                    ),
                    const SizedBox(width: 12),
                    InkWell(
                      onTap: _submitComment,
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        width: 48,
                        height: 48,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFFB800),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.send, color: Color(0xFF111827)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  String _formatTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        if (difference.inMinutes == 0) return 'Az önce';
        return '${difference.inMinutes}dk';
      }
      return '${difference.inHours}sa';
    }
    if (difference.inDays == 1) return 'Dün';
    if (difference.inDays < 7) return '${difference.inDays}g';
    
    return '${date.day}/${date.month}/${date.year}';
  }

  String _formatCount(int count) {
    if (count >= 1000) {
      return '${(count / 1000).toStringAsFixed(1)}K';
    }
    return count.toString();
  }
}
