/// AI Coach model
class Coach {
  final String id;
  final String name;
  final String category; // 'finance', 'health', etc.
  final String description;
  final String icon;
  final Map<String, dynamic> config;
  final bool isActive;
  final double? price; // Fiyat (null ise ücretsiz)
  final String? priceType; // 'purchase' (satın alma) veya 'rent' (kiralama)
  final bool isMarketplace; // Market'te satışa sunulmuş mu?

  Coach({
    required this.id,
    required this.name,
    required this.category,
    required this.description,
    required this.icon,
    this.config = const {},
    this.isActive = true,
    this.price,
    this.priceType,
    this.isMarketplace = false,
  });

  factory Coach.fromJson(Map<String, dynamic> json) {
    return Coach(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      description: json['description'] as String,
      icon: json['icon'] as String,
      config: json['config'] as Map<String, dynamic>? ?? {},
      isActive: json['isActive'] as bool? ?? true,
      price: json['price'] != null ? (json['price'] as num).toDouble() : null,
      priceType: json['priceType'] as String?,
      isMarketplace: json['isMarketplace'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'description': description,
      'icon': icon,
      'config': config,
      'isActive': isActive,
      'price': price,
      'priceType': priceType,
      'isMarketplace': isMarketplace,
    };
  }

  Coach copyWith({
    String? id,
    String? name,
    String? category,
    String? description,
    String? icon,
    Map<String, dynamic>? config,
    bool? isActive,
    double? price,
    String? priceType,
    bool? isMarketplace,
  }) {
    return Coach(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      description: description ?? this.description,
      icon: icon ?? this.icon,
      config: config ?? this.config,
      isActive: isActive ?? this.isActive,
      price: price ?? this.price,
      priceType: priceType ?? this.priceType,
      isMarketplace: isMarketplace ?? this.isMarketplace,
    );
  }
}

