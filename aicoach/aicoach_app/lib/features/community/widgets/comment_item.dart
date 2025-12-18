import 'package:flutter/material.dart';
import '../models/comment.dart';

/// Comment item widget with modern design
class CommentItem extends StatelessWidget {
  final Comment comment;
  final VoidCallback? onLike;
  final VoidCallback? onReply;
  final bool showReplies;

  const CommentItem({
    super.key,
    required this.comment,
    this.onLike,
    this.onReply,
    this.showReplies = true,
  });

  Color _getLevelColor() {
    switch (comment.userLevel) {
      case 'Beginner':
        return Colors.green;
      case 'Intermediate':
        return Colors.blue;
      case 'Advanced':
        return Colors.orange;
      case 'Pro':
        return Colors.purple;
      default:
        return Colors.grey;
    }
  }

  String _formatTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      if (difference.inHours == 0) {
        return '${difference.inMinutes}dk';
      }
      return '${difference.inHours}sa';
    }
    if (difference.inDays == 1) return 'Dün';
    if (difference.inDays < 7) return '${difference.inDays}g';
    
    return '${date.day}/${date.month}';
  }

  @override
  Widget build(BuildContext context) {
    final levelColor = _getLevelColor();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Avatar
            GestureDetector(
              onTap: () {
                // Navigate to user profile
              },
              child: CircleAvatar(
                radius: 20,
                backgroundColor: levelColor.withOpacity(0.2),
                backgroundImage: comment.authorAvatar != null
                    ? NetworkImage(comment.authorAvatar!)
                    : null,
                child: comment.authorAvatar == null
                    ? Text(
                        comment.authorName[0].toUpperCase(),
                        style: TextStyle(
                          color: levelColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      )
                    : null,
              ),
            ),
            const SizedBox(width: 12),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          comment.authorName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (comment.isVerified) ...[
                        const SizedBox(width: 4),
                        const Icon(
                          Icons.verified,
                          color: Color(0xFFFFB800),
                          size: 14,
                        ),
                      ],
                      if (comment.userLevel != null) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: levelColor.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: levelColor, width: 1),
                          ),
                          child: Text(
                            comment.userLevel!,
                            style: TextStyle(
                              color: levelColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                      const SizedBox(width: 8),
                      Text(
                        _formatTime(comment.createdAt),
                        style: TextStyle(
                          color: Colors.grey[500],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  // Content
                  Text(
                    comment.content,
                    style: TextStyle(
                      color: Colors.grey[300],
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Actions
                  Row(
                    children: [
                      InkWell(
                        onTap: onLike,
                        borderRadius: BorderRadius.circular(20),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                comment.isLiked
                                    ? Icons.favorite
                                    : Icons.favorite_outline,
                                color: comment.isLiked
                                    ? Colors.red
                                    : Colors.grey[400],
                                size: 16,
                              ),
                              if (comment.likes > 0) ...[
                                const SizedBox(width: 4),
                                Text(
                                  '${comment.likes}',
                                  style: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                      if (onReply != null && showReplies) ...[
                        const SizedBox(width: 16),
                        InkWell(
                          onTap: onReply,
                          borderRadius: BorderRadius.circular(20),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.reply,
                                  color: Colors.grey[400],
                                  size: 16,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Yanıtla',
                                  style: TextStyle(
                                    color: Colors.grey[400],
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
        // Nested Replies
        if (comment.hasReplies && showReplies) ...[
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.only(left: 52),
            child: Column(
              children: comment.replies!.map((reply) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: CommentItem(
                    comment: reply,
                    onLike: () {},
                    showReplies: false,
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ],
    );
  }
}

