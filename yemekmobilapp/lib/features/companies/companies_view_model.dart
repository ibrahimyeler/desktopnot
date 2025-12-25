import 'package:flutter/foundation.dart';
import '../../shared/models/catering_company.dart';
import '../../shared/services/catering_service.dart';

class CompaniesViewModel extends ChangeNotifier {
  List<CateringCompany> _companies = [];
  bool _isLoading = false;
  String? _error;

  List<CateringCompany> get companies => _companies;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadCompanies() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final companies = await CateringService.getCompanies();
      _companies = companies;
      _error = null;
    } catch (e) {
      _error = 'Firmalar yüklenirken bir hata oluştu: $e';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

