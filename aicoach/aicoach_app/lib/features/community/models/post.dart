/// Post model for community feed
class Post {
  final String id;
  final String authorId;
  final String authorName;
  final String? authorAvatar;
  final String title;
  final String content;
  final String category;
  final List<String>? images;
  final List<String>? hashtags;
  final int likes;
  final int comments;
  final int shares;
  final int saves;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final bool isLiked;
  final bool isSaved;
  final bool isFollowed;
  final bool isVerified;
  final String? featuredImage;
  final Map<String, dynamic>? metadata;

  Post({
    required this.id,
    required this.authorId,
    required this.authorName,
    this.authorAvatar,
    required this.title,
    required this.content,
    required this.category,
    this.images,
    this.hashtags,
    this.likes = 0,
    this.comments = 0,
    this.shares = 0,
    this.saves = 0,
    required this.createdAt,
    this.updatedAt,
    this.isLiked = false,
    this.isSaved = false,
    this.isFollowed = false,
    this.isVerified = false,
    this.featuredImage,
    this.metadata,
  });

  /// Calculate trending score
  double get trendingScore {
    final hoursSincePost = DateTime.now().difference(createdAt).inHours;
    final timeFactor = hoursSincePost < 24 ? 1.0 : 1.0 / (hoursSincePost / 24);
    
    final engagementScore = (likes * 1.0) + 
                           (comments * 2.0) + 
                           (shares * 3.0) + 
                           (saves * 1.5);
    
    return engagementScore * timeFactor;
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'authorId': authorId,
      'authorName': authorName,
      'authorAvatar': authorAvatar,
      'title': title,
      'content': content,
      'category': category,
      'images': images,
      'hashtags': hashtags,
      'likes': likes,
      'comments': comments,
      'shares': shares,
      'saves': saves,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'isLiked': isLiked,
      'isSaved': isSaved,
      'isFollowed': isFollowed,
      'isVerified': isVerified,
      'featuredImage': featuredImage,
      'metadata': metadata,
    };
  }

  /// Create from JSON
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as String,
      authorId: json['authorId'] as String,
      authorName: json['authorName'] as String,
      authorAvatar: json['authorAvatar'] as String?,
      title: json['title'] as String,
      content: json['content'] as String,
      category: json['category'] as String,
      images: json['images'] != null 
          ? List<String>.from(json['images'] as List)
          : null,
      hashtags: json['hashtags'] != null
          ? List<String>.from(json['hashtags'] as List)
          : null,
      likes: json['likes'] as int? ?? 0,
      comments: json['comments'] as int? ?? 0,
      shares: json['shares'] as int? ?? 0,
      saves: json['saves'] as int? ?? 0,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null
          ? DateTime.parse(json['updatedAt'] as String)
          : null,
      isLiked: json['isLiked'] as bool? ?? false,
      isSaved: json['isSaved'] as bool? ?? false,
      isFollowed: json['isFollowed'] as bool? ?? false,
      isVerified: json['isVerified'] as bool? ?? false,
      featuredImage: json['featuredImage'] as String?,
      metadata: json['metadata'] as Map<String, dynamic>?,
    );
  }

  /// Create copy with updated values
  Post copyWith({
    String? id,
    String? authorId,
    String? authorName,
    String? authorAvatar,
    String? title,
    String? content,
    String? category,
    List<String>? images,
    List<String>? hashtags,
    int? likes,
    int? comments,
    int? shares,
    int? saves,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isLiked,
    bool? isSaved,
    bool? isFollowed,
    bool? isVerified,
    String? featuredImage,
    Map<String, dynamic>? metadata,
  }) {
    return Post(
      id: id ?? this.id,
      authorId: authorId ?? this.authorId,
      authorName: authorName ?? this.authorName,
      authorAvatar: authorAvatar ?? this.authorAvatar,
      title: title ?? this.title,
      content: content ?? this.content,
      category: category ?? this.category,
      images: images ?? this.images,
      hashtags: hashtags ?? this.hashtags,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
      shares: shares ?? this.shares,
      saves: saves ?? this.saves,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isLiked: isLiked ?? this.isLiked,
      isSaved: isSaved ?? this.isSaved,
      isFollowed: isFollowed ?? this.isFollowed,
      isVerified: isVerified ?? this.isVerified,
      featuredImage: featuredImage ?? this.featuredImage,
      metadata: metadata ?? this.metadata,
    );
  }
}

