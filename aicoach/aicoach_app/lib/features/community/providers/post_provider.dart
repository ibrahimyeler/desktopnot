import 'package:flutter/foundation.dart';
import '../models/post.dart';
import '../models/comment.dart';
import '../repository/community_repository.dart';

/// Provider for individual post management
class PostProvider with ChangeNotifier {
  final CommunityRepository _repository = CommunityRepository();

  Post? _post;
  List<Comment> _comments = [];
  bool _isLoading = false;
  bool _commentsLoading = false;
  bool _hasMoreComments = true;
  int _commentsPage = 1;
  String? _error;

  Post? get post => _post;
  List<Comment> get comments => _comments;
  bool get isLoading => _isLoading;
  bool get commentsLoading => _commentsLoading;
  bool get hasMoreComments => _hasMoreComments;
  String? get error => _error;

  /// Load post by ID
  Future<void> loadPost(String postId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Initialize mock data if not already done
      await _repository.initializeMockData();
      
      _post = await _repository.getPostById(postId);
      if (_post == null) {
        _error = 'Post not found';
      }
      
      // Load comments
      await loadComments(postId);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Load comments for post
  Future<void> loadComments(String postId, {bool refresh = false}) async {
    if (refresh) {
      _commentsPage = 1;
      _hasMoreComments = true;
      _comments = [];
    }

    if (_commentsLoading || !_hasMoreComments) return;

    _commentsLoading = true;
    notifyListeners();

    try {
      // Initialize mock data if not already done
      await _repository.initializeMockData();
      
      final newComments = await _repository.getPostComments(
        postId,
        page: _commentsPage,
        limit: 20,
      );

      if (refresh) {
        _comments = newComments;
      } else {
        _comments.addAll(newComments);
      }

      _hasMoreComments = newComments.length >= 20;
      _commentsPage++;
    } catch (e) {
      _error = e.toString();
    } finally {
      _commentsLoading = false;
      notifyListeners();
    }
  }

  /// Add comment
  Future<void> addComment({
    required String postId,
    required String authorId,
    required String content,
    String? parentCommentId,
  }) async {
    try {
      final newComment = await _repository.addComment(
        postId: postId,
        authorId: authorId,
        content: content,
        parentCommentId: parentCommentId,
      );

      if (parentCommentId == null) {
        _comments.insert(0, newComment);
      } else {
        // Update parent comment with reply
        final parentIndex = _comments.indexWhere((c) => c.id == parentCommentId);
        if (parentIndex != -1) {
          final parent = _comments[parentIndex];
          final replies = parent.replies ?? [];
          replies.add(newComment);
          _comments[parentIndex] = parent.copyWith(replies: replies);
        }
      }

      // Update post comment count
      if (_post != null) {
        _post = _post!.copyWith(comments: _post!.comments + 1);
      }

      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Toggle like on comment
  Future<void> toggleCommentLike(String commentId, String postId) async {
    try {
      final updatedComment = await _repository.toggleLikeComment(commentId, postId);
      
      final index = _comments.indexWhere((c) => c.id == commentId);
      if (index != -1) {
        _comments[index] = updatedComment;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Toggle like on post
  Future<void> toggleLike(String userId) async {
    if (_post == null) return;

    try {
      final updatedPost = await _repository.toggleLikePost(_post!.id, userId);
      _post = updatedPost;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Toggle save on post
  Future<void> toggleSave(String userId) async {
    if (_post == null) return;

    try {
      final updatedPost = await _repository.toggleSavePost(_post!.id, userId);
      _post = updatedPost;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  /// Refresh post and comments
  Future<void> refresh() async {
    if (_post != null) {
      await loadPost(_post!.id);
    }
  }

  /// Clear provider state
  void clear() {
    _post = null;
    _comments = [];
    _commentsPage = 1;
    _hasMoreComments = true;
    _error = null;
    notifyListeners();
  }
}

