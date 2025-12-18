import 'package:flutter/material.dart';
import '../models/place.dart';
import 'place_card.dart';

class FeaturedPlaces extends StatelessWidget {
  final List<Place> places;
  final Function(Place) onPlaceTap;

  const FeaturedPlaces({
    super.key,
    required this.places,
    required this.onPlaceTap,
  });

  @override
  Widget build(BuildContext context) {
    if (places.isEmpty) {
      return const SizedBox.shrink();
    }

    // En yüksek puanlı 3 mekanı göster
    final featuredPlaces = places.take(3).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Öne Çıkan Mekanlar',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'Tümünü Gör',
                  style: TextStyle(color: Theme.of(context).colorScheme.primary),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 260,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: featuredPlaces.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.only(right: 16),
                child: PlaceCard(
                  place: featuredPlaces[index],
                  onTap: () => onPlaceTap(featuredPlaces[index]),
                  isFeatured: true,
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

