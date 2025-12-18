/// Comment model for post comments
class Comment {
  final String id;
  final String postId;
  final String authorId;
  final String authorName;
  final String? authorAvatar;
  final String content;
  final int likes;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final bool isLiked;
  final bool isVerified;
  final List<Comment>? replies;
  final String? parentCommentId; // For nested comments
  final String? userLevel; // Beginner, Intermediate, Advanced, Pro

  Comment({
    required this.id,
    required this.postId,
    required this.authorId,
    required this.authorName,
    this.authorAvatar,
    required this.content,
    this.likes = 0,
    required this.createdAt,
    this.updatedAt,
    this.isLiked = false,
    this.isVerified = false,
    this.replies,
    this.parentCommentId,
    this.userLevel,
  });

  /// Check if comment has replies
  bool get hasReplies => replies != null && replies!.isNotEmpty;

  /// Total replies count
  int get totalRepliesCount {
    if (replies == null) return 0;
    int count = replies!.length;
    for (var reply in replies!) {
      count += reply.totalRepliesCount;
    }
    return count;
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'postId': postId,
      'authorId': authorId,
      'authorName': authorName,
      'authorAvatar': authorAvatar,
      'content': content,
      'likes': likes,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'isLiked': isLiked,
      'isVerified': isVerified,
      'replies': replies?.map((r) => r.toJson()).toList(),
      'parentCommentId': parentCommentId,
      'userLevel': userLevel,
    };
  }

  /// Create from JSON
  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'] as String,
      postId: json['postId'] as String,
      authorId: json['authorId'] as String,
      authorName: json['authorName'] as String,
      authorAvatar: json['authorAvatar'] as String?,
      content: json['content'] as String,
      likes: json['likes'] as int? ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      isLiked: json['isLiked'] as bool? ?? false,
      isVerified: json['isVerified'] as bool? ?? false,
      replies: json['replies'] != null
          ? (json['replies'] as List)
              .map((r) => Comment.fromJson(r as Map<String, dynamic>))
              .toList()
          : null,
      parentCommentId: json['parentCommentId'] as String?,
      userLevel: json['userLevel'] as String?,
    );
  }

  /// Create copy with updated values
  Comment copyWith({
    String? id,
    String? postId,
    String? authorId,
    String? authorName,
    String? authorAvatar,
    String? content,
    int? likes,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isLiked,
    bool? isVerified,
    List<Comment>? replies,
    String? parentCommentId,
    String? userLevel,
  }) {
    return Comment(
      id: id ?? this.id,
      postId: postId ?? this.postId,
      authorId: authorId ?? this.authorId,
      authorName: authorName ?? this.authorName,
      authorAvatar: authorAvatar ?? this.authorAvatar,
      content: content ?? this.content,
      likes: likes ?? this.likes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isLiked: isLiked ?? this.isLiked,
      isVerified: isVerified ?? this.isVerified,
      replies: replies ?? this.replies,
      parentCommentId: parentCommentId ?? this.parentCommentId,
      userLevel: userLevel ?? this.userLevel,
    );
  }
}

