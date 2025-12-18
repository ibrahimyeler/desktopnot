import 'package:flutter/foundation.dart' hide Category;
import '../models/category.dart';
import '../repository/community_repository.dart';

/// Provider for category management
class CategoryProvider with ChangeNotifier {
  final CommunityRepository _repository = CommunityRepository();

  List<Category> _categories = [];
  bool _isLoading = false;
  String? _error;

  List<Category> get categories => _categories;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Load all categories
  Future<void> loadCategories() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      // Initialize mock data if not already done
      await _repository.initializeMockData();
      
      _categories = await _repository.getCategories();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  /// Get category by ID
  Category? getCategoryById(String categoryId) {
    try {
      return _categories.firstWhere((cat) => cat.id == categoryId);
    } catch (e) {
      return null;
    }
  }
}

