import 'dart:math' as math;

class CateringCompany {
  final String id;
  final String name;
  final String description;
  final String imageUrl;
  final double rating;
  final int reviewCount;
  final String address;
  final double? deliveryFee; // null ise gel al seçeneği var
  final int estimatedDeliveryTime; // dakika cinsinden
  final bool supportsPickup; // Gel al desteği var mı
  final double latitude; // Enlem
  final double longitude; // Boylam
  double? distanceFromUser; // Kullanıcıya olan mesafe (km)

  CateringCompany({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.rating,
    required this.reviewCount,
    required this.address,
    this.deliveryFee,
    required this.estimatedDeliveryTime,
    this.supportsPickup = true,
    required this.latitude,
    required this.longitude,
    this.distanceFromUser,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        'imageUrl': imageUrl,
        'rating': rating,
        'reviewCount': reviewCount,
        'address': address,
        'deliveryFee': deliveryFee,
        'estimatedDeliveryTime': estimatedDeliveryTime,
        'supportsPickup': supportsPickup,
        'latitude': latitude,
        'longitude': longitude,
        'distanceFromUser': distanceFromUser,
      };

  factory CateringCompany.fromJson(Map<String, dynamic> json) {
    return CateringCompany(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      imageUrl: json['imageUrl'] as String,
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['reviewCount'] as int,
      address: json['address'] as String,
      deliveryFee: json['deliveryFee'] != null
          ? (json['deliveryFee'] as num).toDouble()
          : null,
      estimatedDeliveryTime: json['estimatedDeliveryTime'] as int,
      supportsPickup: json['supportsPickup'] as bool? ?? true,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      distanceFromUser: json['distanceFromUser'] != null
          ? (json['distanceFromUser'] as num).toDouble()
          : null,
    );
  }

  // Mesafe hesaplama (Haversine formülü)
  double calculateDistance(double userLat, double userLng) {
    const double earthRadius = 6371; // km
    final double dLat = _toRadians(latitude - userLat);
    final double dLng = _toRadians(longitude - userLng);
    final double a = math.sin(dLat / 2) * math.sin(dLat / 2) +
        math.cos(_toRadians(userLat)) *
            math.cos(_toRadians(latitude)) *
            math.sin(dLng / 2) *
            math.sin(dLng / 2);
    final double c = 2 * math.asin(math.sqrt(a));
    return earthRadius * c;
  }

  double _toRadians(double degrees) {
    return degrees * (math.pi / 180);
  }
}

