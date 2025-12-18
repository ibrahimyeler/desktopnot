import 'package:flutter/material.dart';
import '../models/place.dart';
import '../services/place_service.dart';
import '../components/place_card.dart';
import 'place_detail_screen.dart';

class ExploreScreen extends StatefulWidget {
  final VoidCallback? onBackToHome;
  
  const ExploreScreen({super.key, this.onBackToHome});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final PlaceService _placeService = PlaceService();
  late List<Place> _allPlaces;
  String? _selectedCategory;
  late PageController _pageController;
  final List<String> _categories = ['all', 'cafe', 'restaurant', 'park'];
  int _currentPageIndex = 0;

  @override
  void initState() {
    super.initState();
    _allPlaces = _placeService.getAllPlaces();
    _pageController = PageController(initialPage: 0);
    _selectedCategory = null; // 'all' için null
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () {
            if (widget.onBackToHome != null) {
              widget.onBackToHome!();
            } else {
              Navigator.of(context).pop();
            }
          },
        ),
        title: const Text('Keşfet'),
        backgroundColor: const Color(0xFF1E1E1E),
        foregroundColor: Colors.white,
      ),
      backgroundColor: const Color(0xFF121212),
      body: Column(
        children: [
          // Kategori filtreleri
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
            color: const Color(0xFF121212),
            child: Row(
              children: [
                Expanded(
                  child: _buildCategoryChip('Tümü', 'all', Icons.all_inclusive, Colors.purple, 0),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildCategoryChip('Cafe', 'cafe', Icons.local_cafe, Colors.orange, 1),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildCategoryChip('Restoran', 'restaurant', Icons.restaurant, Colors.red, 2),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildCategoryChip('Park', 'park', Icons.park, Colors.green, 3),
                ),
              ],
            ),
          ),
          Container(
            height: 1,
            color: Colors.grey[800],
          ),
          // PageView ile swipe özelliği
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              onPageChanged: (index) {
                setState(() {
                  _currentPageIndex = index;
                  _selectedCategory = _categories[index] == 'all' ? null : _categories[index];
                });
              },
              itemCount: _categories.length,
              itemBuilder: (context, pageIndex) {
                final category = _categories[pageIndex];
                final filteredPlaces = category == 'all'
                    ? _allPlaces
                    : _allPlaces.where((place) => place.category == category).toList();
                
                return filteredPlaces.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: _getCategoryColor(category).withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                Icons.search_off,
                                size: 64,
                                color: _getCategoryColor(category),
                              ),
                            ),
                            const SizedBox(height: 24),
                            Text(
                              'Bu kategoride mekan bulunamadı',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Farklı bir kategori seçmeyi deneyin',
                              style: TextStyle(
                                fontSize: 14,
                                color: Colors.grey[400],
                              ),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        itemCount: filteredPlaces.length,
                        itemBuilder: (context, index) {
                          final place = filteredPlaces[index];
                          return _buildColorfulPlaceCard(context, place);
                        },
                      );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String label, String value, IconData icon, Color categoryColor, int pageIndex) {
    final isSelected = _currentPageIndex == pageIndex;

    return InkWell(
      onTap: () {
        _pageController.animateToPage(
          pageIndex,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
      },
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: isSelected
              ? categoryColor.withOpacity(0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? categoryColor
                : Colors.grey[800]!,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: isSelected
                    ? categoryColor.withOpacity(0.3)
                    : Colors.grey[800]!.withOpacity(0.5),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon,
                color: isSelected
                    ? categoryColor
                    : Colors.grey[400],
                size: 20,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                color: isSelected
                    ? categoryColor
                    : Colors.grey[400],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getCategoryColor(String? category) {
    if (category == null || category == 'all') {
      return Colors.purple;
    }
    switch (category) {
      case 'cafe':
        return Colors.orange;
      case 'restaurant':
        return Colors.red;
      case 'park':
        return Colors.green;
      default:
        return Colors.purple;
    }
  }

  Widget _buildColorfulPlaceCard(BuildContext context, Place place) {
    final categoryColor = _getCategoryColor(place.category);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: const Color(0xFF1E1E1E),
        border: Border.all(
          color: Colors.grey[800]!,
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PlaceDetailScreen(place: place),
              ),
            );
          },
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Görsel - Sadece ikon renkli
                Container(
                  width: 90,
                  height: 90,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    color: Colors.grey[900]!.withOpacity(0.5),
                    border: Border.all(
                      color: Colors.grey[800]!,
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    _getCategoryIcon(place.category),
                    size: 45,
                    color: categoryColor, // Sadece ikon renkli
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              place.name,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.grey[800]!.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.star,
                                  size: 14,
                                  color: Colors.amber,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  place.rating.toStringAsFixed(1),
                                  style: const TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        place.description,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.grey[300],
                          height: 1.3,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 14,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              place.address,
                              style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey[400],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.chevron_right,
                  color: Colors.grey[600],
                  size: 24,
                ),
              ],
            ),
          ),
        ),
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

