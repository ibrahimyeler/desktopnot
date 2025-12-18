import 'package:flutter/foundation.dart';
import '../models/post.dart';
import '../repository/community_repository.dart';

/// Provider for community feed management
class FeedProvider with ChangeNotifier {
  final CommunityRepository _repository = CommunityRepository();

  List<Post> _posts = [];
  bool _isLoading = false;
  bool _hasMore = true;
  int _currentPage = 1;
  String? _selectedCategory;
  String _sortBy = 'trending'; // trending, new, top
  String? _error;

  List<Post> get posts => _posts;
  bool get isLoading => _isLoading;
  bool get hasMore => _hasMore;
  String? get selectedCategory => _selectedCategory;
  String get sortBy => _sortBy;
  String? get error => _error;

  /// Load feed posts
  Future<void> loadFeed({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _hasMore = true;
      _posts = [];
    }

    if (_isLoading || (!_hasMore && !refresh)) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Initialize mock data if not already done
      await _repository.initializeMockData();
      
      final newPosts = await _repository.getFeedPosts(
        category: _selectedCategory,
        sortBy: _sortBy,
        page: _currentPage,
        limit: 20,
      );

      if (refresh) {
        _posts = newPosts;
      } else {
        _posts.addAll(newPosts);
      }

      _hasMore = newPosts.length >= 20;
      _currentPage++;

      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Filter by category
  Future<void> filterByCategory(String? category) async {
    if (_selectedCategory == category) return;

    _selectedCategory = category;
    await loadFeed(refresh: true);
  }

  /// Change sort order
  Future<void> changeSortBy(String sortBy) async {
    if (_sortBy == sortBy) return;

    _sortBy = sortBy;
    await loadFeed(refresh: true);
  }

  /// Toggle like on post
  Future<void> toggleLike(String postId, String userId) async {
    try {
      final updatedPost = await _repository.toggleLikePost(postId, userId);
      
      final index = _posts.indexWhere((p) => p.id == postId);
      if (index != -1) {
        _posts[index] = updatedPost;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Toggle save on post
  Future<void> toggleSave(String postId, String userId) async {
    try {
      final updatedPost = await _repository.toggleSavePost(postId, userId);
      
      final index = _posts.indexWhere((p) => p.id == postId);
      if (index != -1) {
        _posts[index] = updatedPost;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Refresh feed
  Future<void> refresh() async {
    await loadFeed(refresh: true);
  }
}

