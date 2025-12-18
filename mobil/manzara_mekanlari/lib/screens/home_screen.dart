import 'package:flutter/material.dart';
import '../models/place.dart';
import '../services/location_service.dart';
import '../services/place_service.dart';
import '../components/bottom_nav_bar.dart';
import '../components/hero_section.dart';
import '../components/category_chips.dart';
import '../components/featured_places.dart';
import '../components/place_card.dart';
import '../components/custom_drawer.dart';
import 'place_detail_screen.dart';
import 'social_screen.dart';
import 'profile_screen.dart';
import 'explore_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final LocationService _locationService = LocationService();
  final PlaceService _placeService = PlaceService();
  late double _currentLatitude;
  late double _currentLongitude;
  late List<Place> _nearbyPlaces;
  
  int _bottomNavIndex = 0; // Bottom navigation index
  String? _selectedCategory;
  bool _isDrawerOpen = false;

  @override
  void initState() {
    super.initState();
    // Statik verileri yükle
    _currentLatitude = _locationService.getCurrentLatitude();
    _currentLongitude = _locationService.getCurrentLongitude();
    _nearbyPlaces = _placeService.getNearbyPlaces();
  }

  void _onBottomNavTapped(int index) {
      setState(() {
      _bottomNavIndex = index;
    });
  }

  Widget _getCurrentPage() {
    switch (_bottomNavIndex) {
      case 0: // Ana Sayfa
        return _buildHomePage();
      case 1: // Keşfet
        return ExploreScreen(
          onBackToHome: () {
      setState(() {
              _bottomNavIndex = 0; // Ana sayfaya dön
            });
          },
        );
      case 2: // Harita
        return _buildMapPage();
      case 3: // Sosyal
        return SocialScreen(
          onBackToHome: () {
      setState(() {
              _bottomNavIndex = 0; // Ana sayfaya dön
            });
          },
        );
      case 4: // Profil
        return const ProfileScreen();
      default:
        return _buildHomePage();
    }
  }

  List<Place> get _filteredPlaces {
    if (_selectedCategory == null || _selectedCategory == 'all') {
      return _nearbyPlaces;
    }
    return _nearbyPlaces
        .where((place) => place.category == _selectedCategory)
        .toList();
  }

  Widget _buildHomePage() {
    return RefreshIndicator(
      onRefresh: () async {
        // Yenileme işlemi
        await Future.delayed(const Duration(seconds: 1));
      },
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Section
            const SizedBox(height: 8),
            HeroSection(
              onMenuTap: () {
                setState(() {
                  _isDrawerOpen = true;
                });
              },
            ),
            const SizedBox(height: 24),
            // Kategori Filtreleri
            CategoryChips(
              selectedCategory: _selectedCategory,
              onCategorySelected: (category) {
                setState(() {
                  _selectedCategory = category == 'all' ? null : category;
                });
              },
            ),
            const SizedBox(height: 24),
            // Öne Çıkan Mekanlar
            FeaturedPlaces(
              places: _nearbyPlaces,
              onPlaceTap: (place) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => PlaceDetailScreen(place: place),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            // Hızlı Erişim
            _buildQuickAccessSection(),
            const SizedBox(height: 24),
            // Tüm Mekanlar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Tüm Mekanlar',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
              ),
            ),
            const SizedBox(height: 12),
            // Mekanlar Listesi
            _filteredPlaces.isEmpty
                ? Padding(
                    padding: const EdgeInsets.all(32),
                    child: Center(
                      child: Column(
                        children: [
                          Icon(Icons.search_off, size: 64, color: Colors.grey[600]),
                          const SizedBox(height: 16),
                          Text(
                            'Bu kategoride mekan bulunamadı',
                            style: TextStyle(fontSize: 16, color: Colors.grey[400]),
                          ),
                        ],
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _filteredPlaces.length,
                    itemBuilder: (context, index) {
                      final place = _filteredPlaces[index];
                      return PlaceCard(
                        place: place,
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => PlaceDetailScreen(place: place),
              ),
            );
          },
                      );
                    },
                  ),
            const SizedBox(height: 20),
          ],
        ),
        ),
      );
    }

  Widget _buildQuickAccessSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'Hızlı Erişim',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
          ),
        ),
        const SizedBox(height: 12),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
                  children: [
                    Expanded(
                child: _buildQuickAccessCard(
                  icon: Icons.explore,
                  title: 'Keşfet',
                  color: Colors.blue,
                  onTap: () {
                    setState(() {
                      _bottomNavIndex = 1;
                    });
                  },
                ),
              ),
              const SizedBox(width: 12),
                    Expanded(
                child: _buildQuickAccessCard(
                  icon: Icons.map,
                  title: 'Harita',
                  color: Colors.green,
                  onTap: () {
                    setState(() {
                      _bottomNavIndex = 2;
                    });
                  },
                ),
              ),
              const SizedBox(width: 12),
                Expanded(
                child: _buildQuickAccessCard(
                  icon: Icons.people,
                  title: 'Sosyal',
                  color: Colors.purple,
                  onTap: () {
                    setState(() {
                      _bottomNavIndex = 3;
                    });
                  },
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuickAccessCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
      child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
            color: const Color(0xFF1E1E1E),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.grey[800]!,
              width: 1,
            ),
          ),
          child: Column(
          children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 24,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
              ),
            ),
          ],
          ),
        ),
      ),
    );
  }

  Widget _buildMapPage() {
    return _buildMapView();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
          children: [
        Scaffold(
          appBar: _bottomNavIndex == 2
              ? AppBar(
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () {
                      setState(() {
                        _bottomNavIndex = 0; // Ana sayfaya dön
                      });
                    },
                  ),
                  title: const Text('Harita'),
                  backgroundColor: const Color(0xFF1E1E1E),
                  foregroundColor: Colors.white,
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.search),
                      onPressed: () {
                        // Arama özelliği
                      },
                    ),
                    IconButton(
                      icon: const Icon(Icons.my_location),
                      onPressed: () {
                        // Konumumu göster
                      },
                    ),
                  ],
                )
              : null,
          body: _getCurrentPage(),
          bottomNavigationBar: CustomBottomNavBar(
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
          ),
        ),
        // Custom drawer - header'ın üstünde görünecek
        if (_isDrawerOpen)
          CustomDrawer(
            onClose: () {
              setState(() {
                _isDrawerOpen = false;
              });
            },
            onMenuItemTap: (index) {
              setState(() {
                _bottomNavIndex = index;
              });
            },
          ),
      ],
    );
  }

  Widget _buildMapView() {
    return Container(
      color: const Color(0xFF121212),
      child: Column(
        children: [
          // Harita placeholder - Google Maps API key olmadan çalışmayacağı için
          Expanded(
            flex: 2,
            child: Container(
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Theme.of(context).colorScheme.primary.withOpacity(0.1),
                    const Color(0xFF1E1E1E),
                  ],
                ),
              ),
              child: Stack(
                children: [
                  // Harita placeholder
                  Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
              child: Icon(
                            Icons.map,
                            size: 80,
                color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        const SizedBox(height: 24),
                        Text(
                          'Harita Görünümü',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 32),
                          child: Text(
                            'Google Maps API key gereklidir',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[400],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Konum butonu (sağ alt)
                  Positioned(
                    bottom: 20,
                    right: 20,
                    child: FloatingActionButton(
                      onPressed: () {
                        // Konumumu göster
                      },
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      child: const Icon(Icons.my_location, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Mekanlar listesi
          Container(
            height: 300,
            decoration: const BoxDecoration(
              color: Color(0xFF1E1E1E),
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: Column(
              children: [
                // Başlık ve sayı
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                      Text(
                        'Yakındaki Mekanlar',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '${_nearbyPlaces.length} mekan',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const Divider(height: 1, color: Colors.grey),
                // Mekanlar listesi
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    itemCount: _nearbyPlaces.length,
                    itemBuilder: (context, index) {
                      final place = _nearbyPlaces[index];
                      return _buildMapPlaceCard(context, place);
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMapPlaceCard(BuildContext context, Place place) {
    final categoryColor = _getCategoryColor(place.category);
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
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
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                // İkon - renkli
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10),
                    color: Colors.grey[900]!.withOpacity(0.5),
                    border: Border.all(
                      color: Colors.grey[800]!,
                      width: 1,
                    ),
                  ),
                  child: Icon(
                    _getCategoryIcon(place.category),
                    size: 30,
                    color: categoryColor,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        place.name,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 12,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              place.address,
                              style: TextStyle(
                                fontSize: 11,
                                color: Colors.grey[400],
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
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
                              fontWeight: FontWeight.w500,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Icon(
                            Icons.people,
                            size: 12,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${place.reviewCount} yorum',
                            style: TextStyle(
                              fontSize: 11,
                              color: Colors.grey[400],
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
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Color _getCategoryColor(String? category) {
    if (category == null) {
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

