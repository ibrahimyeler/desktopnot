import 'package:flutter/foundation.dart';
import '../models/leaderboard_item.dart';
import '../repository/community_repository.dart';

/// Provider for leaderboard management
class LeaderboardProvider with ChangeNotifier {
  final CommunityRepository _repository = CommunityRepository();

  List<LeaderboardItem> _leaderboard = [];
  bool _isLoading = false;
  String? _error;

  List<LeaderboardItem> get leaderboard => _leaderboard;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Get top 3 leaders
  List<LeaderboardItem> get topThree {
    if (_leaderboard.length < 3) return _leaderboard;
    return _leaderboard.take(3).toList();
  }

  /// Get other leaders (after top 3)
  List<LeaderboardItem> get otherLeaders {
    if (_leaderboard.length <= 3) return [];
    return _leaderboard.skip(3).toList();
  }

  /// Load leaderboard
  Future<void> loadLeaderboard() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Initialize mock data if not already done
      await _repository.initializeMockData();
      
      _leaderboard = await _repository.getLeaderboard();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Refresh leaderboard
  Future<void> refresh() async {
    await loadLeaderboard();
  }
}

