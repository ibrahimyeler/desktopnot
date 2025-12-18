class MenuItem {
  final String id;
  final String name;
  final String? description;
  final double price;
  final int? calories;

  const MenuItem({
    required this.id,
    required this.name,
    this.description,
    required this.price,
    this.calories,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'price': price,
        'calories': calories,
      };
}

class HomeState {
  final bool isLoading;
  final String? error;
  final DateTime? menuDate;
  
  // Step-based selection
  final int activeStep; // 0: Çorba, 1: Ana Yemek, 2: Yan Yemek, 3: Tatlı
  final MenuItem? selectedSoup;
  final MenuItem? selectedMainDish;
  final MenuItem? selectedSideDish;
  final MenuItem? selectedDessert;
  
  // Menu data
  final List<MenuItem>? soupOptions;
  final List<MenuItem>? mainDishOptions;
  final List<MenuItem>? sideDishOptions;
  final List<MenuItem>? dessertOptions;
  
  // Wallet balance (optional)
  final double? walletBalance;

  HomeState({
    this.isLoading = false,
    this.error,
    this.menuDate,
    this.activeStep = 0,
    this.selectedSoup,
    this.selectedMainDish,
    this.selectedSideDish,
    this.selectedDessert,
    this.soupOptions,
    this.mainDishOptions,
    this.sideDishOptions,
    this.dessertOptions,
    this.walletBalance,
  });

  bool get isOrderComplete {
    return selectedSoup != null &&
        selectedMainDish != null &&
        selectedSideDish != null &&
        selectedDessert != null;
  }

  double get totalPrice {
    double total = 0.0;
    if (selectedSoup != null) total += selectedSoup!.price;
    if (selectedMainDish != null) total += selectedMainDish!.price;
    if (selectedSideDish != null) total += selectedSideDish!.price;
    if (selectedDessert != null) total += selectedDessert!.price;
    return total;
  }

  int get totalCalories {
    int total = 0;
    if (selectedSoup != null && selectedSoup!.calories != null) {
      total += selectedSoup!.calories!;
    }
    if (selectedMainDish != null && selectedMainDish!.calories != null) {
      total += selectedMainDish!.calories!;
    }
    if (selectedSideDish != null && selectedSideDish!.calories != null) {
      total += selectedSideDish!.calories!;
    }
    if (selectedDessert != null && selectedDessert!.calories != null) {
      total += selectedDessert!.calories!;
    }
    return total;
  }

  HomeState copyWith({
    bool? isLoading,
    String? error,
    DateTime? menuDate,
    int? activeStep,
    MenuItem? selectedSoup,
    MenuItem? selectedMainDish,
    MenuItem? selectedSideDish,
    MenuItem? selectedDessert,
    List<MenuItem>? soupOptions,
    List<MenuItem>? mainDishOptions,
    List<MenuItem>? sideDishOptions,
    List<MenuItem>? dessertOptions,
    double? walletBalance,
  }) {
    return HomeState(
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
      menuDate: menuDate ?? this.menuDate,
      activeStep: activeStep ?? this.activeStep,
      selectedSoup: selectedSoup ?? this.selectedSoup,
      selectedMainDish: selectedMainDish ?? this.selectedMainDish,
      selectedSideDish: selectedSideDish ?? this.selectedSideDish,
      selectedDessert: selectedDessert ?? this.selectedDessert,
      soupOptions: soupOptions ?? this.soupOptions,
      mainDishOptions: mainDishOptions ?? this.mainDishOptions,
      sideDishOptions: sideDishOptions ?? this.sideDishOptions,
      dessertOptions: dessertOptions ?? this.dessertOptions,
      walletBalance: walletBalance ?? this.walletBalance,
    );
  }
}
