/// User profile model for community
class UserProfile {
  final String id;
  final String username;
  final String displayName;
  final String? avatar;
  final String? bio;
  final int followers;
  final int following;
  final int posts;
  final int level;
  final int xp;
  final String? levelBadge;
  final List<String>? achievements;
  final bool isVerified;
  final bool isFollowing;
  final bool isFollowingYou;
  final DateTime joinedAt;
  final Map<String, int>? categoryStats; // Posts per category

  UserProfile({
    required this.id,
    required this.username,
    required this.displayName,
    this.avatar,
    this.bio,
    this.followers = 0,
    this.following = 0,
    this.posts = 0,
    this.level = 1,
    this.xp = 0,
    this.levelBadge,
    this.achievements,
    this.isVerified = false,
    this.isFollowing = false,
    this.isFollowingYou = false,
    required this.joinedAt,
    this.categoryStats,
  });

  /// Calculate XP needed for next level
  int get xpNeededForNextLevel {
    return (level * 1000) - xp;
  }

  /// Calculate XP progress (0.0 to 1.0)
  double get xpProgress {
    final currentLevelXp = (level - 1) * 1000;
    final nextLevelXp = level * 1000;
    final progress = (xp - currentLevelXp) / (nextLevelXp - currentLevelXp);
    return progress.clamp(0.0, 1.0);
  }

  /// Get level name
  String get levelName {
    if (level < 5) return 'Beginner';
    if (level < 10) return 'Intermediate';
    if (level < 20) return 'Advanced';
    if (level < 30) return 'Expert';
    return 'Master';
  }

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'displayName': displayName,
      'avatar': avatar,
      'bio': bio,
      'followers': followers,
      'following': following,
      'posts': posts,
      'level': level,
      'xp': xp,
      'levelBadge': levelBadge,
      'achievements': achievements,
      'isVerified': isVerified,
      'isFollowing': isFollowing,
      'isFollowingYou': isFollowingYou,
      'joinedAt': joinedAt.toIso8601String(),
      'categoryStats': categoryStats,
    };
  }

  /// Create from JSON
  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String,
      username: json['username'] as String,
      displayName: json['displayName'] as String,
      avatar: json['avatar'] as String?,
      bio: json['bio'] as String?,
      followers: json['followers'] as int? ?? 0,
      following: json['following'] as int? ?? 0,
      posts: json['posts'] as int? ?? 0,
      level: json['level'] as int? ?? 1,
      xp: json['xp'] as int? ?? 0,
      levelBadge: json['levelBadge'] as String?,
      achievements: json['achievements'] != null
          ? List<String>.from(json['achievements'] as List)
          : null,
      isVerified: json['isVerified'] as bool? ?? false,
      isFollowing: json['isFollowing'] as bool? ?? false,
      isFollowingYou: json['isFollowingYou'] as bool? ?? false,
      joinedAt: DateTime.parse(json['joinedAt'] as String),
      categoryStats: json['categoryStats'] != null
          ? Map<String, int>.from(json['categoryStats'] as Map)
          : null,
    );
  }

  /// Create copy with updated values
  UserProfile copyWith({
    String? id,
    String? username,
    String? displayName,
    String? avatar,
    String? bio,
    int? followers,
    int? following,
    int? posts,
    int? level,
    int? xp,
    String? levelBadge,
    List<String>? achievements,
    bool? isVerified,
    bool? isFollowing,
    bool? isFollowingYou,
    DateTime? joinedAt,
    Map<String, int>? categoryStats,
  }) {
    return UserProfile(
      id: id ?? this.id,
      username: username ?? this.username,
      displayName: displayName ?? this.displayName,
      avatar: avatar ?? this.avatar,
      bio: bio ?? this.bio,
      followers: followers ?? this.followers,
      following: following ?? this.following,
      posts: posts ?? this.posts,
      level: level ?? this.level,
      xp: xp ?? this.xp,
      levelBadge: levelBadge ?? this.levelBadge,
      achievements: achievements ?? this.achievements,
      isVerified: isVerified ?? this.isVerified,
      isFollowing: isFollowing ?? this.isFollowing,
      isFollowingYou: isFollowingYou ?? this.isFollowingYou,
      joinedAt: joinedAt ?? this.joinedAt,
      categoryStats: categoryStats ?? this.categoryStats,
    );
  }
}

