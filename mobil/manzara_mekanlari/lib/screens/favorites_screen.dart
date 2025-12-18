import 'package:flutter/material.dart';
import '../models/place.dart';
import '../services/place_service.dart';
import 'place_detail_screen.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final PlaceService placeService = PlaceService();
    final List<Place> allPlaces = placeService.getAllPlaces();
    
    // Statik olarak ilk 2 mekanı favori olarak göster
    final List<Place> favoritePlaces = allPlaces.take(2).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Favoriler'),
        backgroundColor: const Color(0xFF1E1E1E),
        foregroundColor: Colors.white,
      ),
      backgroundColor: const Color(0xFF121212),
      body: favoritePlaces.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 64, color: Colors.grey[600]),
                  const SizedBox(height: 16),
                  Text(
                    'Henüz favori mekanınız yok',
                    style: TextStyle(fontSize: 16, color: Colors.grey[400]),
                  ),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: favoritePlaces.length,
              itemBuilder: (context, index) {
                final place = favoritePlaces[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: const Color(0xFF1E1E1E),
                    border: Border.all(
                      color: Colors.grey[800]!,
                      width: 1,
                    ),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Theme.of(context).colorScheme.primaryContainer.withOpacity(0.3),
                      child: Icon(
                        _getCategoryIcon(place.category),
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    title: Text(
                      place.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          place.description,
                          style: TextStyle(color: Colors.grey[400]),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.star, size: 16, color: Colors.amber),
                            const SizedBox(width: 4),
                            Text(
                              place.rating.toStringAsFixed(1),
                              style: const TextStyle(color: Colors.white),
                            ),
                            const SizedBox(width: 16),
                            Icon(Icons.location_on, size: 16, color: Colors.grey[400]),
                            Text(
                              place.address,
                              style: TextStyle(color: Colors.grey[400]),
                            ),
                          ],
                        ),
                      ],
                    ),
                    trailing: Icon(Icons.chevron_right, color: Colors.grey[600]),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => PlaceDetailScreen(place: place),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'cafe':
        return Icons.local_cafe;
      case 'restaurant':
        return Icons.restaurant;
      case 'park':
        return Icons.park;
      default:
        return Icons.place;
    }
  }
}

