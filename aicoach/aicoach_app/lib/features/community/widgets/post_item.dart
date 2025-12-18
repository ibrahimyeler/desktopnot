import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../models/post.dart';

/// Post item widget for community feed - Profesyonel versiyon
class PostItem extends StatelessWidget {
  final Post post;
  final VoidCallback? onLike;
  final VoidCallback? onSave;
  final VoidCallback? onTapAuthor;

  const PostItem({
    super.key,
    required this.post,
    this.onLike,
    this.onSave,
    this.onTapAuthor,
  });

  Color _getCategoryColor() {
    switch (post.category.toLowerCase()) {
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

  @override
  Widget build(BuildContext context) {
    final categoryColor = _getCategoryColor();
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    // Avatar - tıklanabilir
                    GestureDetector(
                      onTap: onTapAuthor,
                      child: CircleAvatar(
                        radius: 20,
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
                                child: GestureDetector(
                                  onTap: onTapAuthor,
                                  child: Text(
                                    post.authorName,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                              if (post.isVerified) ...[
                                const SizedBox(width: 4),
                                const Icon(
                                  Icons.verified,
                                  color: Color(0xFFFFB800),
                                  size: 16,
                                ),
                              ],
                            ],
                          ),
                          Text(
                            _formatDate(post.createdAt),
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
                const SizedBox(height: 12),
                
                // Title
                GestureDetector(
                  onTap: () => context.push(AppRoutes.postDetail(post.id)),
                  child: Text(
                    post.title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                
                // Content preview
                GestureDetector(
                  onTap: () => context.push(AppRoutes.postDetail(post.id)),
                  child: Text(
                    post.content,
                    style: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 14,
                      height: 1.4,
                    ),
                    maxLines: 4,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                
                // Hashtags
                if (post.hashtags != null && post.hashtags!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: post.hashtags!.take(3).map((tag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: const Color(0xFF111827),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          tag,
                          style: TextStyle(
                            color: categoryColor,
                            fontSize: 12,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
          
          // Featured image
          if (post.featuredImage != null || (post.images != null && post.images!.isNotEmpty))
            ClipRRect(
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)),
              child: Image.network(
                post.featuredImage ?? post.images!.first,
                width: double.infinity,
                height: 200,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 200,
                    color: const Color(0xFF2F3336),
                    child: const Center(
                      child: Icon(
                        Icons.broken_image,
                        color: Color(0xFF9CA3AF),
                        size: 48,
                      ),
                    ),
                  );
                },
              ),
            ),
          
          // Action bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // Like button
                InkWell(
                  onTap: onLike,
                  borderRadius: BorderRadius.circular(20),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        Icon(
                          post.isLiked ? Icons.favorite : Icons.favorite_outline,
                          color: post.isLiked ? Colors.red : Colors.grey[400],
                          size: 20,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _formatCount(post.likes),
                          style: TextStyle(
                            color: post.isLiked ? Colors.red : Colors.grey[400],
                            fontSize: 14,
                            fontWeight: post.isLiked ? FontWeight.w600 : FontWeight.normal,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                
                // Comment button
                InkWell(
                  onTap: () => context.push(AppRoutes.postDetail(post.id)),
                  borderRadius: BorderRadius.circular(20),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.comment_outlined,
                          color: Colors.grey[400],
                          size: 20,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _formatCount(post.comments),
                          style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                
                // Share button
                InkWell(
                  onTap: () {
                    // Share functionality
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.share_outlined,
                          color: Colors.grey[400],
                          size: 20,
                        ),
                        if (post.shares > 0) ...[
                          const SizedBox(width: 6),
                          Text(
                            _formatCount(post.shares),
                            style: TextStyle(
                              color: Colors.grey[400],
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                
                const Spacer(),
                
                // Save button
                InkWell(
                  onTap: onSave,
                  borderRadius: BorderRadius.circular(20),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                    child: Icon(
                      post.isSaved ? Icons.bookmark : Icons.bookmark_border,
                      color: post.isSaved ? const Color(0xFFFFB800) : Colors.grey[400],
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
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
