import 'dart:math' as math;
import '../models/catering_company.dart';

class CateringService {
  CateringService._();

  // Mock kullanıcı konumu (Kadıköy merkez)
  static const double mockUserLat = 40.9819;
  static const double mockUserLng = 29.0244;

  // HomeSupper şubeleri (5 şube)
  static List<CateringCompany> getMockCompanies() {
    return [
      CateringCompany(
        id: 'branch1',
        name: 'HomeSupper Kadıköy',
        description: 'Günlük taze yemekler, ev yapımı lezzetler',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
        rating: 4.8,
        reviewCount: 245,
        address: 'Kadıköy, İstanbul',
        deliveryFee: 15.0,
        estimatedDeliveryTime: 45,
        supportsPickup: true,
        latitude: 40.9819, // Kadıköy
        longitude: 29.0244,
      ),
      CateringCompany(
        id: 'branch2',
        name: 'HomeSupper Üsküdar',
        description: 'Geleneksel Türk mutfağı, organik ürünler',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
        rating: 4.6,
        reviewCount: 189,
        address: 'Üsküdar, İstanbul',
        deliveryFee: 20.0,
        estimatedDeliveryTime: 50,
        supportsPickup: true,
        latitude: 41.0214, // Üsküdar
        longitude: 29.0128,
      ),
      CateringCompany(
        id: 'branch3',
        name: 'HomeSupper Beşiktaş',
        description: 'Her gün farklı menü, uygun fiyatlar',
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
        rating: 4.5,
        reviewCount: 312,
        address: 'Beşiktaş, İstanbul',
        deliveryFee: 12.0,
        estimatedDeliveryTime: 40,
        supportsPickup: true,
        latitude: 41.0422, // Beşiktaş
        longitude: 29.0089,
      ),
      CateringCompany(
        id: 'branch4',
        name: 'HomeSupper Şişli',
        description: 'Diyet ve sağlıklı yemek seçenekleri',
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
        rating: 4.7,
        reviewCount: 156,
        address: 'Şişli, İstanbul',
        deliveryFee: 18.0,
        estimatedDeliveryTime: 35,
        supportsPickup: true,
        latitude: 41.0602, // Şişli
        longitude: 28.9874,
      ),
      CateringCompany(
        id: 'branch5',
        name: 'HomeSupper Beyoğlu',
        description: 'Sadece gel al seçeneği, kurye ücreti yok',
        imageUrl: 'https://images.unsplash.com/photo-1552568031-39ebc959cdb4?w=400&h=300&fit=crop',
        rating: 4.4,
        reviewCount: 98,
        address: 'Beyoğlu, İstanbul',
        deliveryFee: null, // Sadece gel al
        estimatedDeliveryTime: 30,
        supportsPickup: true,
        latitude: 41.0369, // Beyoğlu
        longitude: 28.9850,
      ),
    ];
  }

  // Konuma göre sıralanmış firmaları getir
  static Future<List<CateringCompany>> getCompaniesSortedByDistance({
    double? userLat,
    double? userLng,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    final companies = getMockCompanies();
    final lat = userLat ?? mockUserLat;
    final lng = userLng ?? mockUserLng;
    
    // Her firma için mesafe hesapla
    for (var company in companies) {
      company.distanceFromUser = company.calculateDistance(lat, lng);
    }
    
    // Mesafeye göre sırala
    companies.sort((a, b) {
      final distanceA = a.distanceFromUser ?? double.infinity;
      final distanceB = b.distanceFromUser ?? double.infinity;
      return distanceA.compareTo(distanceB);
    });
    
    return companies;
  }

  static Future<List<CateringCompany>> getCompanies() async {
    // Konuma göre sıralanmış firmaları getir
    return getCompaniesSortedByDistance();
  }

  static Future<CateringCompany?> getCompanyById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final companies = getMockCompanies();
    try {
      return companies.firstWhere((company) => company.id == id);
    } catch (e) {
      return null;
    }
  }
}

