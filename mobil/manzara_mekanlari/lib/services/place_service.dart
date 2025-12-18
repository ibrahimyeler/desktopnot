import '../models/place.dart';
import '../models/review.dart';

class PlaceService {
  // Statik mekanlar
  List<Place> getAllPlaces() {
    return _getSamplePlaces();
  }

  // Tüm mekanları döndür (statik)
  List<Place> getNearbyPlaces() {
    return _getSamplePlaces();
  }

  // Mekan için yorumları getir (statik)
  List<Review> getReviewsForPlace(String placeId) {
    final allReviews = _getSampleReviews();
    return allReviews.where((review) => review.placeId == placeId).toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  // Tüm yorumları getir (sosyal feed için)
  List<Review> getAllReviews() {
    final allReviews = _getSampleReviews();
    return allReviews..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  // Statik mekanlar
  List<Place> _getSamplePlaces() {
    return [
      Place(
        id: '1',
        name: 'Bebek Kahve',
        description: 'Boğaz manzaralı harika bir cafe',
        latitude: 41.0820,
        longitude: 29.0430,
        address: 'Bebek, Beşiktaş, İstanbul',
        category: 'cafe',
        rating: 4.5,
        reviewCount: 23,
        createdAt: DateTime(2024, 1, 1),
      ),
      Place(
        id: '2',
        name: 'Pierre Loti Tepesi',
        description: 'İstanbul\'un en güzel manzara noktalarından biri',
        latitude: 41.0600,
        longitude: 28.9500,
        address: 'Eyüpsultan, İstanbul',
        category: 'park',
        rating: 4.8,
        reviewCount: 45,
        createdAt: DateTime(2024, 1, 10),
      ),
      Place(
        id: '3',
        name: 'Galata Kulesi Teras',
        description: '360 derece İstanbul manzarası',
        latitude: 41.0256,
        longitude: 28.9744,
        address: 'Beyoğlu, İstanbul',
        category: 'restaurant',
        rating: 4.3,
        reviewCount: 67,
        createdAt: DateTime(2024, 1, 15),
      ),
      Place(
        id: '4',
        name: 'Çamlıca Tepesi',
        description: 'İstanbul\'un en yüksek noktalarından biri, muhteşem manzara',
        latitude: 41.0200,
        longitude: 29.0600,
        address: 'Üsküdar, İstanbul',
        category: 'park',
        rating: 4.7,
        reviewCount: 89,
        createdAt: DateTime(2024, 1, 5),
      ),
      Place(
        id: '5',
        name: 'Maiden\'s Tower Cafe',
        description: 'Kız Kulesi manzaralı özel bir mekan',
        latitude: 41.0211,
        longitude: 29.0042,
        address: 'Salacak, Üsküdar, İstanbul',
        category: 'cafe',
        rating: 4.6,
        reviewCount: 112,
        createdAt: DateTime(2024, 1, 8),
      ),
    ];
  }

  // Statik yorumlar
  List<Review> _getSampleReviews() {
    return [
      Review(
        id: '1',
        placeId: '1',
        userId: 'user1',
        userName: 'Ahmet Yılmaz',
        comment: 'Harika bir manzara ve lezzetli kahve. Kesinlikle tavsiye ederim!',
        rating: 5.0,
        createdAt: DateTime(2024, 1, 20),
      ),
      Review(
        id: '2',
        placeId: '1',
        userId: 'user2',
        userName: 'Ayşe Demir',
        comment: 'Boğaz manzarası muhteşem. Fiyatlar biraz yüksek ama manzaraya değer.',
        rating: 4.0,
        createdAt: DateTime(2024, 1, 18),
      ),
      Review(
        id: '3',
        placeId: '2',
        userId: 'user3',
        userName: 'Mehmet Kaya',
        comment: 'İstanbul\'u görmek için en iyi yerlerden biri. Teleferik yolculuğu da çok keyifli.',
        rating: 5.0,
        createdAt: DateTime(2024, 1, 22),
      ),
      Review(
        id: '4',
        placeId: '2',
        userId: 'user4',
        userName: 'Zeynep Şahin',
        comment: 'Gün batımında çok güzel. Kalabalık olabiliyor ama manzara buna değer.',
        rating: 4.5,
        createdAt: DateTime(2024, 1, 19),
      ),
      Review(
        id: '5',
        placeId: '3',
        userId: 'user5',
        userName: 'Can Özkan',
        comment: '360 derece İstanbul manzarası gerçekten etkileyici. Yemekler de güzel.',
        rating: 4.5,
        createdAt: DateTime(2024, 1, 21),
      ),
      Review(
        id: '6',
        placeId: '3',
        userId: 'user6',
        userName: 'Elif Yıldız',
        comment: 'Tarihi bir yerde yemek yemek çok özel bir deneyim. Fiyatlar yüksek ama değer.',
        rating: 4.0,
        createdAt: DateTime(2024, 1, 17),
      ),
    ];
  }
}

