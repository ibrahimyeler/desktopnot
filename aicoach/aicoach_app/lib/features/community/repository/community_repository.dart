import 'package:flutter/material.dart';
import '../models/post.dart';
import '../models/comment.dart';
import '../models/category.dart';
import '../models/user_profile.dart';
import '../models/leaderboard_item.dart';
import 'dart:math';

/// Repository for community data with mock implementation
class CommunityRepository {
  static final CommunityRepository _instance = CommunityRepository._internal();
  factory CommunityRepository() => _instance;
  CommunityRepository._internal();

  // Mock data storage (in real app, this would be API calls)
  final List<Post> _posts = [];
  final Map<String, List<Comment>> _postComments = {};
  final List<Category> _categories = [];
  final Map<String, UserProfile> _userProfiles = {};
  final List<LeaderboardItem> _leaderboard = [];

  /// Initialize mock data
  Future<void> initializeMockData() async {
    if (_posts.isNotEmpty) return; // Already initialized

    // Initialize categories
    _categories.addAll(_generateMockCategories());

    // Initialize posts
    _posts.addAll(_generateMockPosts());

    // Initialize comments
    for (var post in _posts.take(10)) {
      _postComments[post.id] = _generateMockComments(post.id);
    }

    // Initialize user profiles
    _userProfiles.addAll(_generateMockUserProfiles());

    // Initialize leaderboard
    _leaderboard.addAll(_generateMockLeaderboard());
  }

  // ==================== POSTS ====================

  /// Get feed posts with pagination
  Future<List<Post>> getFeedPosts({
    String? category,
    String sortBy = 'trending', // trending, new, top
    int page = 1,
    int limit = 20,
  }) async {
    await initializeMockData();

    var filteredPosts = List<Post>.from(_posts);

    // Filter by category
    if (category != null && category.isNotEmpty) {
      filteredPosts = filteredPosts
          .where((post) => post.category.toLowerCase() == category.toLowerCase())
          .toList();
    }

    // Sort posts
    switch (sortBy) {
      case 'trending':
        filteredPosts.sort((a, b) => b.trendingScore.compareTo(a.trendingScore));
        break;
      case 'new':
        filteredPosts.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
      case 'top':
        filteredPosts.sort((a, b) {
          final aScore = a.likes + (a.comments * 2) + (a.shares * 3);
          final bScore = b.likes + (b.comments * 2) + (b.shares * 3);
          return bScore.compareTo(aScore);
        });
        break;
    }

    // Pagination
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit;

    if (startIndex >= filteredPosts.length) {
      return [];
    }

    return filteredPosts.sublist(
      startIndex,
      endIndex > filteredPosts.length ? filteredPosts.length : endIndex,
    );
  }

  /// Get post by ID
  Future<Post?> getPostById(String postId) async {
    await initializeMockData();
    try {
      return _posts.firstWhere((post) => post.id == postId);
    } catch (e) {
      return null;
    }
  }

  /// Like/Unlike post
  Future<Post> toggleLikePost(String postId, String userId) async {
    await initializeMockData();
    final postIndex = _posts.indexWhere((p) => p.id == postId);
    if (postIndex == -1) {
      throw Exception('Post not found');
    }

    final post = _posts[postIndex];
    final isLiked = post.isLiked;
    
    _posts[postIndex] = post.copyWith(
      isLiked: !isLiked,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
    );

    return _posts[postIndex];
  }

  /// Save/Unsave post
  Future<Post> toggleSavePost(String postId, String userId) async {
    await initializeMockData();
    final postIndex = _posts.indexWhere((p) => p.id == postId);
    if (postIndex == -1) {
      throw Exception('Post not found');
    }

    final post = _posts[postIndex];
    final isSaved = post.isSaved;
    
    _posts[postIndex] = post.copyWith(
      isSaved: !isSaved,
      saves: isSaved ? post.saves - 1 : post.saves + 1,
    );

    return _posts[postIndex];
  }

  /// Create new post
  Future<Post> createPost({
    required String authorId,
    required String title,
    required String content,
    required String category,
    List<String>? images,
    List<String>? hashtags,
  }) async {
    await initializeMockData();

    final userProfile = _userProfiles[authorId] ?? 
        UserProfile(
          id: authorId,
          username: 'user_$authorId',
          displayName: 'Kullanıcı',
          joinedAt: DateTime.now(),
        );

    final newPost = Post(
      id: 'post_${DateTime.now().millisecondsSinceEpoch}',
      authorId: authorId,
      authorName: userProfile.displayName,
      authorAvatar: userProfile.avatar,
      title: title,
      content: content,
      category: category,
      images: images,
      hashtags: hashtags,
      createdAt: DateTime.now(),
      isVerified: userProfile.isVerified,
    );

    _posts.insert(0, newPost);
    return newPost;
  }

  // ==================== COMMENTS ====================

  /// Get comments for a post
  Future<List<Comment>> getPostComments(String postId, {int page = 1, int limit = 20}) async {
    await initializeMockData();
    
    if (!_postComments.containsKey(postId)) {
      _postComments[postId] = _generateMockComments(postId);
    }

    final comments = _postComments[postId]!;
    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit;

    if (startIndex >= comments.length) {
      return [];
    }

    return comments.sublist(
      startIndex,
      endIndex > comments.length ? comments.length : endIndex,
    );
  }

  /// Add comment to post
  Future<Comment> addComment({
    required String postId,
    required String authorId,
    required String content,
    String? parentCommentId,
  }) async {
    await initializeMockData();

    final userProfile = _userProfiles[authorId] ?? 
        UserProfile(
          id: authorId,
          username: 'user_$authorId',
          displayName: 'Kullanıcı',
          joinedAt: DateTime.now(),
        );

    final newComment = Comment(
      id: 'comment_${DateTime.now().millisecondsSinceEpoch}',
      postId: postId,
      authorId: authorId,
      authorName: userProfile.displayName,
      authorAvatar: userProfile.avatar,
      content: content,
      createdAt: DateTime.now(),
      parentCommentId: parentCommentId,
      isVerified: userProfile.isVerified,
      userLevel: userProfile.levelName,
    );

    if (!_postComments.containsKey(postId)) {
      _postComments[postId] = [];
    }

    if (parentCommentId != null) {
      // Add as reply
      final comments = _postComments[postId]!;
      final parentIndex = comments.indexWhere((c) => c.id == parentCommentId);
      if (parentIndex != -1) {
        final parent = comments[parentIndex];
        final replies = parent.replies ?? [];
        replies.add(newComment);
        comments[parentIndex] = parent.copyWith(replies: replies);
        _postComments[postId] = comments;
      }
    } else {
      _postComments[postId]!.insert(0, newComment);
    }

    // Update post comment count
    final postIndex = _posts.indexWhere((p) => p.id == postId);
    if (postIndex != -1) {
      _posts[postIndex] = _posts[postIndex].copyWith(
        comments: _posts[postIndex].comments + 1,
      );
    }

    return newComment;
  }

  /// Like/Unlike comment
  Future<Comment> toggleLikeComment(String commentId, String postId) async {
    await initializeMockData();
    
    if (!_postComments.containsKey(postId)) return throw Exception('Post not found');

    final comments = _postComments[postId]!;
    final commentIndex = comments.indexWhere((c) => c.id == commentId);
    
    if (commentIndex == -1) {
      throw Exception('Comment not found');
    }

    final comment = comments[commentIndex];
    final isLiked = comment.isLiked;

    comments[commentIndex] = comment.copyWith(
      isLiked: !isLiked,
      likes: isLiked ? comment.likes - 1 : comment.likes + 1,
    );

    return comments[commentIndex];
  }

  // ==================== CATEGORIES ====================

  /// Get all categories
  Future<List<Category>> getCategories() async {
    await initializeMockData();
    return List.from(_categories);
  }

  /// Get category by ID
  Future<Category?> getCategoryById(String categoryId) async {
    await initializeMockData();
    try {
      return _categories.firstWhere((cat) => cat.id == categoryId);
    } catch (e) {
      return null;
    }
  }

  // ==================== USER PROFILES ====================

  /// Get user profile
  Future<UserProfile?> getUserProfile(String userId) async {
    await initializeMockData();
    return _userProfiles[userId];
  }

  /// Follow/Unfollow user
  Future<UserProfile> toggleFollowUser(String userId, String currentUserId) async {
    await initializeMockData();
    
    if (!_userProfiles.containsKey(userId)) {
      throw Exception('User not found');
    }

    final profile = _userProfiles[userId]!;
    final isFollowing = profile.isFollowing;

    _userProfiles[userId] = profile.copyWith(
      isFollowing: !isFollowing,
      followers: isFollowing ? profile.followers - 1 : profile.followers + 1,
    );

    return _userProfiles[userId]!;
  }

  /// Get user posts
  Future<List<Post>> getUserPosts(String userId, {int page = 1, int limit = 20}) async {
    await initializeMockData();
    
    final userPosts = _posts
        .where((post) => post.authorId == userId)
        .toList();
    
    userPosts.sort((a, b) => b.createdAt.compareTo(a.createdAt));

    final startIndex = (page - 1) * limit;
    final endIndex = startIndex + limit;

    if (startIndex >= userPosts.length) {
      return [];
    }

    return userPosts.sublist(
      startIndex,
      endIndex > userPosts.length ? userPosts.length : endIndex,
    );
  }

  // ==================== LEADERBOARD ====================

  /// Get leaderboard
  Future<List<LeaderboardItem>> getLeaderboard({int limit = 100}) async {
    await initializeMockData();
    return _leaderboard.take(limit).toList();
  }

  // ==================== MOCK DATA GENERATORS ====================

  List<Category> _generateMockCategories() {
    return [
      Category(
        id: 'productivity',
        name: 'Üretkenlik',
        emoji: '🚀',
        iconName: 'work',
        primaryColor: const Color(0xFFFFB800),
        secondaryColor: const Color(0xFFFF8C00),
        memberCount: 1250,
        postCount: 342,
        description: 'Üretkenlik teknikleri ve ipuçları',
      ),
      Category(
        id: 'language',
        name: 'Dil',
        emoji: '🌍',
        iconName: 'language',
        primaryColor: const Color(0xFF3B82F6),
        secondaryColor: const Color(0xFF2563EB),
        memberCount: 890,
        postCount: 156,
        description: 'Dil öğrenme stratejileri',
      ),
      Category(
        id: 'finance',
        name: 'Finans',
        emoji: '💰',
        iconName: 'wallet',
        primaryColor: const Color(0xFF10B981),
        secondaryColor: const Color(0xFF059669),
        memberCount: 2100,
        postCount: 489,
        description: 'Finansal özgürlük ve yatırım',
      ),
      Category(
        id: 'health',
        name: 'Sağlık',
        emoji: '🏥',
        iconName: 'favorite',
        primaryColor: const Color(0xFFEF4444),
        secondaryColor: const Color(0xFFDC2626),
        memberCount: 1670,
        postCount: 278,
        description: 'Sağlıklı yaşam ve wellness',
      ),
      Category(
        id: 'general',
        name: 'Genel',
        emoji: '💬',
        iconName: 'forum',
        primaryColor: const Color(0xFF8B5CF6),
        secondaryColor: const Color(0xFF7C3AED),
        memberCount: 980,
        postCount: 567,
        description: 'Genel sohbet ve paylaşımlar',
      ),
    ];
  }

  List<Post> _generateMockPosts() {
    final random = Random();
    final categories = ['Üretkenlik', 'Dil', 'Finans', 'Sağlık', 'Genel'];
    final authors = ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Şahin', 
                     'Can Özkan', 'Elif Yıldız', 'Burak Çelik', 'Selin Arslan'];

    return List.generate(50, (index) {
      final category = categories[random.nextInt(categories.length)];
      final authorIndex = random.nextInt(authors.length);
      final authorName = authors[authorIndex];
      final createdAt = DateTime.now().subtract(Duration(hours: random.nextInt(168))); // Last 7 days
      
      final likes = random.nextInt(500);
      final comments = random.nextInt(50);
      final shares = random.nextInt(30);

      return Post(
        id: 'post_$index',
        authorId: 'user_$authorIndex',
        authorName: authorName,
        title: _getRandomPostTitle(category),
        content: _getRandomPostContent(category),
        category: category,
        likes: likes,
        comments: comments,
        shares: shares,
        saves: random.nextInt(20),
        createdAt: createdAt,
        isLiked: random.nextBool(),
        isSaved: random.nextBool(),
        isFollowed: random.nextBool(),
        isVerified: authorIndex < 3, // First 3 authors verified
        hashtags: _getRandomHashtags(category),
      );
    });
  }

  List<Comment> _generateMockComments(String postId) {
    final random = Random();
    final authors = ['Mehmet Demir', 'Ayşe Kaya', 'Can Yılmaz', 'Elif Şahin'];
    final levels = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];

    return List.generate(8, (index) {
      final authorIndex = random.nextInt(authors.length);
      
      return Comment(
        id: 'comment_${postId}_$index',
        postId: postId,
        authorId: 'user_comment_$index',
        authorName: authors[authorIndex],
        content: _getRandomCommentContent(),
        likes: random.nextInt(20),
        createdAt: DateTime.now().subtract(Duration(hours: random.nextInt(48))),
        isLiked: random.nextBool(),
        isVerified: authorIndex == 0,
        userLevel: levels[random.nextInt(levels.length)],
      );
    });
  }

  Map<String, UserProfile> _generateMockUserProfiles() {
    final profiles = <String, UserProfile>{};

    for (int i = 0; i < 8; i++) {
      final userId = 'user_$i';
      profiles[userId] = UserProfile(
        id: userId,
        username: 'user$i',
        displayName: ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Şahin',
                      'Can Özkan', 'Elif Yıldız', 'Burak Çelik', 'Selin Arslan'][i],
        followers: 100 + (i * 50),
        following: 50 + (i * 20),
        posts: 10 + (i * 5),
        level: 1 + (i * 2),
        xp: 500 + (i * 300),
        isVerified: i < 3,
        joinedAt: DateTime.now().subtract(Duration(days: 365 - (i * 30))),
        achievements: List.generate(3, (j) => 'Achievement ${j + 1}'),
        categoryStats: {'Üretkenlik': 5, 'Finans': 3, 'Sağlık': 2},
      );
    }

    return profiles;
  }

  List<LeaderboardItem> _generateMockLeaderboard() {
    final users = ['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Kaya', 'Zeynep Şahin',
                   'Can Özkan', 'Elif Yıldız', 'Burak Çelik', 'Selin Arslan'];

    return List.generate(users.length, (index) {
      final rank = index + 1;
      return LeaderboardItem(
        userId: 'user_$index',
        username: 'user$index',
        displayName: users[index],
        rank: rank,
        points: 1500 - (index * 100),
        level: 1 + (index * 2),
        badge: rank == 1 ? '🏆 Altın Üye' : rank == 2 ? '🥈 Gümüş Üye' : rank == 3 ? '🥉 Bronz Üye' : '⭐ Aktif Üye',
        posts: 10 + (index * 5),
        likes: 100 + (index * 50),
        comments: 50 + (index * 20),
      );
    });
  }

  // Helper methods for mock data
  String _getRandomPostTitle(String category) {
    final titles = {
      'Üretkenlik': [
        'Pomodoro Tekniği ile Verimliliğinizi Artırın',
        'Zaman Yönetimi İpuçları',
        'Odaklanma Sanatı',
        'Günlük Rutinlerinizi Optimize Edin',
      ],
      'Dil': [
        'Yeni Bir Dil Öğrenmek İçin 5 Strateji',
        'İngilizce Konuşma Pratiği',
        'Kelime Ezberleme Teknikleri',
        'Dil Öğrenme Uygulamaları',
      ],
      'Finans': [
        'Pasif Gelir Kaynakları Yaratmak',
        'Yatırım Portföyü Çeşitlendirme',
        'Bütçe Yönetimi Temelleri',
        'Erken Emeklilik Planı',
      ],
      'Sağlık': [
        'Sağlıklı Yaşam Rutinleri',
        'Evde Yapabileceğiniz Egzersizler',
        'Beslenme Alışkanlıkları',
        'Stres Yönetimi Teknikleri',
      ],
      'Genel': [
        'Kişisel Gelişim Yolculuğu',
        'Hedef Belirleme Rehberi',
        'Motivasyonu Koruma Yöntemleri',
        'Başarı Hikayeleri',
      ],
    };

    final categoryTitles = titles[category] ?? titles['Genel']!;
    return categoryTitles[Random().nextInt(categoryTitles.length)];
  }

  String _getRandomPostContent(String category) {
    return '''Bu konu hakkında düşüncelerimi paylaşmak istiyorum. 
    
${category} alanında önemli bir deneyim yaşadım ve bunu sizlerle paylaşmak istedim.

Sizlerin de bu konuda görüşleriniz varsa yorumlarda belirtmekten çekinmeyin! 💪

#${category} #KişiselGelişim #Gofocus''';
  }

  String _getRandomCommentContent() {
    final comments = [
      'Harika bir paylaşım, teşekkürler!',
      'Ben de deneyeceğim, umarım işe yarar.',
      'Çok faydalı bilgiler, devamını bekliyorum.',
      'Kendi deneyimlerim de benzer şekilde.',
      'Ekleme yapmak istiyorum: ...',
      'Çok teşekkürler, çok yardımcı oldu!',
    ];
    return comments[Random().nextInt(comments.length)];
  }

  List<String> _getRandomHashtags(String category) {
    final hashtags = {
      'Üretkenlik': ['#Üretkenlik', '#ZamanYönetimi', '#Odaklanma'],
      'Dil': ['#DilÖğrenme', '#İngilizce', '#Pratik'],
      'Finans': ['#Finans', '#Yatırım', '#Tasarruf'],
      'Sağlık': ['#Sağlık', '#Fitness', '#Wellness'],
      'Genel': ['#KişiselGelişim', '#Motivasyon', '#Başarı'],
    };

    return hashtags[category] ?? hashtags['Genel']!;
  }
}

