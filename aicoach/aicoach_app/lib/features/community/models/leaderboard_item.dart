/// Leaderboard item model
class LeaderboardItem {
  final String userId;
  final String username;
  final String displayName;
  final String? avatar;
  final int rank;
  final int points;
  final int level;
  final String? badge;
  final bool isCurrentUser;
  final int posts;
  final int likes;
  final int comments;

  LeaderboardItem({
    required this.userId,
    required this.username,
    required this.displayName,
    this.avatar,
    required this.rank,
    required this.points,
    this.level = 1,
    this.badge,
    this.isCurrentUser = false,
    this.posts = 0,
    this.likes = 0,
    this.comments = 0,
  });

  /// Get rank emoji
  String get rankEmoji {
    switch (rank) {
      case 1:
        return '🏆';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '⭐';
    }
  }

  /// Get rank color name
  String get rankColorName {
    switch (rank) {
      case 1:
        return 'Altın';
      case 2:
        return 'Gümüş';
      case 3:
        return 'Bronz';
      default:
        return 'Aktif';
    }
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'username': username,
      'displayName': displayName,
      'avatar': avatar,
      'rank': rank,
      'points': points,
      'level': level,
      'badge': badge,
      'isCurrentUser': isCurrentUser,
      'posts': posts,
      'likes': likes,
      'comments': comments,
    };
  }

  /// Create from JSON
  factory LeaderboardItem.fromJson(Map<String, dynamic> json) {
    return LeaderboardItem(
      userId: json['userId'] as String,
      username: json['username'] as String,
      displayName: json['displayName'] as String,
      avatar: json['avatar'] as String?,
      rank: json['rank'] as int,
      points: json['points'] as int,
      level: json['level'] as int? ?? 1,
      badge: json['badge'] as String?,
      isCurrentUser: json['isCurrentUser'] as bool? ?? false,
      posts: json['posts'] as int? ?? 0,
      likes: json['likes'] as int? ?? 0,
      comments: json['comments'] as int? ?? 0,
    );
  }

  /// Create copy with updated values
  LeaderboardItem copyWith({
    String? userId,
    String? username,
    String? displayName,
    String? avatar,
    int? rank,
    int? points,
    int? level,
    String? badge,
    bool? isCurrentUser,
    int? posts,
    int? likes,
    int? comments,
  }) {
    return LeaderboardItem(
      userId: userId ?? this.userId,
      username: username ?? this.username,
      displayName: displayName ?? this.displayName,
      avatar: avatar ?? this.avatar,
      rank: rank ?? this.rank,
      points: points ?? this.points,
      level: level ?? this.level,
      badge: badge ?? this.badge,
      isCurrentUser: isCurrentUser ?? this.isCurrentUser,
      posts: posts ?? this.posts,
      likes: likes ?? this.likes,
      comments: comments ?? this.comments,
    );
  }
}

