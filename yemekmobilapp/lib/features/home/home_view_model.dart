import 'package:flutter/foundation.dart';
import 'home_state.dart';
import '../../shared/services/catering_service.dart';
import '../../shared/models/catering_company.dart';

class HomeViewModel extends ChangeNotifier {
  HomeState _state = HomeState();

  HomeState get state => _state;

  // İlk yüklemede firmaları getir
  Future<void> loadCompanies() async {
    _state = _state.copyWith(isLoading: true, error: null);
    notifyListeners();

    try {
      final companies = await CateringService.getCompaniesSortedByDistance();
      _state = _state.copyWith(
        isLoading: false,
        companies: companies,
        showCompaniesList: true,
      );
    } catch (e) {
      _state = _state.copyWith(
        isLoading: false,
        error: 'Firmalar yüklenirken bir hata oluştu: $e',
      );
    }
    notifyListeners();
  }

  // Firma seçildiğinde menüyü yükle
  Future<void> selectCompany(CateringCompany company) async {
    _state = _state.copyWith(
      selectedCompany: company,
      showCompaniesList: false,
      isLoading: true,
    );
    notifyListeners();

    // Menüyü yükle
    await loadDailyMenu();
  }

  // Firma listesine geri dön
  void goBackToCompanies() {
    _state = _state.copyWith(
      showCompaniesList: true,
      selectedCompany: null,
      activeStep: 0,
      selectedSoup: null,
      selectedMainDish: null,
      selectedSideDish: null,
      selectedDessert: null,
    );
    notifyListeners();
  }

  Future<void> loadDailyMenu() async {
    _state = _state.copyWith(isLoading: true, error: null);
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));
      _state = _state.copyWith(
        isLoading: false,
        menuDate: DateTime.now(),
        soupOptions: const [
          MenuItem(
            id: 'soup1',
            name: 'Mercimek Çorbası',
            description: 'Geleneksel lezzet',
            price: 15.0,
            calories: 185,
          ),
          MenuItem(
            id: 'soup2',
            name: 'Yayla Çorbası',
            description: 'Yoğurtlu çorba',
            price: 18.0,
            calories: 215,
          ),
          MenuItem(
            id: 'soup3',
            name: 'Domates Çorbası',
            description: 'Taze domates ile',
            price: 16.0,
            calories: 165,
          ),
          MenuItem(
            id: 'soup4',
            name: 'Ezogelin Çorbası',
            description: 'Bulgurlu çorba',
            price: 17.0,
            calories: 195,
          ),
          MenuItem(
            id: 'soup5',
            name: 'Tarhana Çorbası',
            description: 'Ev yapımı tarhana',
            price: 16.0,
            calories: 175,
          ),
        ],
        mainDishOptions: const [
          MenuItem(
            id: 'main1',
            name: 'Köfte',
            description: 'Izgara köfte, pilav ile',
            price: 45.0,
            calories: 485,
          ),
          MenuItem(
            id: 'main2',
            name: 'Tavuk Şiş',
            description: 'Marine edilmiş tavuk',
            price: 42.0,
            calories: 395,
          ),
          MenuItem(
            id: 'main3',
            name: 'Karnıyarık',
            description: 'Patlıcan dolması',
            price: 38.0,
            calories: 335,
          ),
          MenuItem(
            id: 'main4',
            name: 'İskender',
            description: 'Döner, yoğurt, tereyağ',
            price: 48.0,
            calories: 520,
          ),
          MenuItem(
            id: 'main5',
            name: 'Mantı',
            description: 'Ev yapımı mantı',
            price: 40.0,
            calories: 410,
          ),
          MenuItem(
            id: 'main6',
            name: 'Lahmacun',
            description: 'İnce hamur, kıyma',
            price: 35.0,
            calories: 290,
          ),
        ],
        sideDishOptions: const [
          MenuItem(
            id: 'side1',
            name: 'Makarna',
            description: 'Beyaz peynirli',
            price: 20.0,
            calories: 285,
          ),
          MenuItem(
            id: 'side2',
            name: 'Pilav',
            description: 'Tereyağlı pilav',
            price: 18.0,
            calories: 255,
          ),
          MenuItem(
            id: 'side3',
            name: 'Salata',
            description: 'Mevsim salatası',
            price: 15.0,
            calories: 85,
          ),
          MenuItem(
            id: 'side4',
            name: 'Bulgur Pilavı',
            description: 'Domatesli bulgur',
            price: 17.0,
            calories: 220,
          ),
          MenuItem(
            id: 'side5',
            name: 'Patates Kızartması',
            description: 'Taze patates',
            price: 19.0,
            calories: 315,
          ),
          MenuItem(
            id: 'side6',
            name: 'Zeytinyağlı Fasulye',
            description: 'Taze fasulye',
            price: 16.0,
            calories: 145,
          ),
        ],
        dessertOptions: const [
          MenuItem(
            id: 'dessert1',
            name: 'Baklava',
            description: 'Cevizli baklava',
            price: 25.0,
            calories: 365,
          ),
          MenuItem(
            id: 'dessert2',
            name: 'Sütlaç',
            description: 'Ev yapımı sütlaç',
            price: 18.0,
            calories: 195,
          ),
          MenuItem(
            id: 'dessert3',
            name: 'Künefe',
            description: 'Sıcak künefe',
            price: 28.0,
            calories: 435,
          ),
          MenuItem(
            id: 'dessert4',
            name: 'Kazandibi',
            description: 'Yanık sütlü tatlı',
            price: 20.0,
            calories: 210,
          ),
          MenuItem(
            id: 'dessert5',
            name: 'Revani',
            description: 'Şerbetli tatlı',
            price: 19.0,
            calories: 275,
          ),
          MenuItem(
            id: 'dessert6',
            name: 'Tulumba',
            description: 'Şerbetli tatlı',
            price: 17.0,
            calories: 245,
          ),
        ],
        walletBalance: 150.0,
      );
    notifyListeners();
  }

  void selectSoup(MenuItem item) {
    _state = _state.copyWith(
      selectedSoup: item,
      activeStep: 1, // Move to next step
    );
    notifyListeners();
  }

  void selectMainDish(MenuItem item) {
    _state = _state.copyWith(
      selectedMainDish: item,
      activeStep: 2, // Move to next step
    );
    notifyListeners();
  }

  void selectSideDish(MenuItem item) {
    _state = _state.copyWith(
      selectedSideDish: item,
      activeStep: 3, // Move to next step
    );
    notifyListeners();
  }

  void selectDessert(MenuItem item) {
    _state = _state.copyWith(
      selectedDessert: item,
    );
    notifyListeners();
  }

  void goToStep(int step) {
    if (step >= 0 && step <= 3) {
      _state = _state.copyWith(activeStep: step);
      notifyListeners();
    }
  }

  void refresh() {
    if (_state.showCompaniesList) {
      loadCompanies();
    } else {
      loadDailyMenu();
    }
  }

  Future<void> completeOrder() async {
    if (!_state.isOrderComplete) return;

    // Simulate order placement
    await Future.delayed(const Duration(seconds: 1));
    
    // Reset state after order
    _state = _state.copyWith(
      activeStep: 0,
      selectedSoup: null,
      selectedMainDish: null,
      selectedSideDish: null,
      selectedDessert: null,
    );
    notifyListeners();
  }
}
