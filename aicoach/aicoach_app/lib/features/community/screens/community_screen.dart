import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/post_item.dart';
import '../widgets/leaderboard_card.dart';
import '../widgets/category_chip.dart';
import '../providers/feed_provider.dart';
import '../providers/category_provider.dart';
import '../providers/leaderboard_provider.dart';
import '../models/post.dart';
import '../models/leaderboard_item.dart';

class CommunityScreen extends StatefulWidget {
  const CommunityScreen({super.key});

  @override
  State<CommunityScreen> createState() => _CommunityScreenState();
}

class _CommunityScreenState extends State<CommunityScreen> 
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  String _currentUserId = 'user_0'; // Mock user ID

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    
    // Initialize providers
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FeedProvider>().loadFeed();
      context.read<CategoryProvider>().loadCategories();
      context.read<LeaderboardProvider>().loadLeaderboard();
      
      // Infinite scroll
      _scrollController.addListener(_onScroll);
    });
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= 
        _scrollController.position.maxScrollExtent * 0.9) {
      final feedProvider = context.read<FeedProvider>();
      if (!feedProvider.isLoading && feedProvider.hasMore) {
        feedProvider.loadFeed();
      }
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        automaticallyImplyLeading: false,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: const Color(0xFF374151),
                width: 1,
              ),
            ),
            child: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.white,
              size: 18,
            ),
          ),
          onPressed: () => context.go(AppRoutes.home),
        ),
        title: const Text(
          'Topluluk',
          style: TextStyle(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(50),
          child: Container(
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: Color(0xFF1F2937),
                  width: 0.5,
                ),
              ),
            ),
            child: TabBar(
              controller: _tabController,
              indicatorColor: const Color(0xFFFFB800),
              indicatorSize: TabBarIndicatorSize.tab,
              indicatorWeight: 3,
              labelColor: Colors.white,
              unselectedLabelColor: const Color(0xFF9CA3AF),
              labelStyle: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
              isScrollable: true,
              tabs: const [
                Tab(text: 'Senin İçin'),
                Tab(text: 'Takip Edilenler'),
                Tab(text: 'Leaderboard'),
                Tab(text: 'Kategoriler'),
              ],
            ),
          ),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildForYouTab(),
          _buildFollowingTab(),
          _buildLeaderboardTab(),
          _buildCategoriesTab(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.createPost),
        backgroundColor: const Color(0xFFFFB800),
        child: const Icon(Icons.edit, color: Color(0xFF111827)),
      ),
    );
  }

  Widget _buildForYouTab() {
    return Consumer<FeedProvider>(
      builder: (context, feedProvider, child) {
        if (feedProvider.isLoading && feedProvider.posts.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(
              color: Color(0xFFFFB800),
            ),
          );
        }

        if (feedProvider.error != null && feedProvider.posts.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, color: Colors.red, size: 48),
                const SizedBox(height: 16),
                Text(
                  'Bir hata oluştu: ${feedProvider.error}',
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => feedProvider.refresh(),
                  child: const Text('Yeniden Dene'),
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => feedProvider.refresh(),
          color: const Color(0xFFFFB800),
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
            physics: const AlwaysScrollableScrollPhysics(),
            itemCount: feedProvider.posts.length + (feedProvider.hasMore ? 1 : 0),
            itemBuilder: (context, index) {
              if (index >= feedProvider.posts.length) {
                return const Padding(
                  padding: EdgeInsets.all(20),
                  child: Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFFFFB800),
                    ),
                  ),
                );
              }

              final post = feedProvider.posts[index];
              return PostItem(
                post: post,
                onLike: () => feedProvider.toggleLike(post.id, _currentUserId),
                onSave: () => feedProvider.toggleSave(post.id, _currentUserId),
                onTapAuthor: () {
                  // Navigate to user profile (will be implemented)
                },
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildFollowingTab() {
    return Consumer<FeedProvider>(
      builder: (context, feedProvider, child) {
        // Filter posts to only show followed users
        final followedPosts = feedProvider.posts
            .where((post) => post.isFollowed)
            .toList();

        if (feedProvider.isLoading && followedPosts.isEmpty) {
          return const Center(
            child: CircularProgressIndicator(
              color: Color(0xFFFFB800),
            ),
          );
        }

        if (followedPosts.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.person_add_outlined,
                  color: Color(0xFF9CA3AF),
                  size: 64,
                ),
                const SizedBox(height: 16),
                const Text(
                  'Henüz kimseyi takip etmiyorsunuz',
                  style: TextStyle(
                    color: Color(0xFF9CA3AF),
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'İlginç içerikleri görmek için kullanıcıları takip edin',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: () => feedProvider.refresh(),
          color: const Color(0xFFFFB800),
          child: ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
            physics: const AlwaysScrollableScrollPhysics(),
            itemCount: followedPosts.length,
      itemBuilder: (context, index) {
              final post = followedPosts[index];
              return PostItem(
                post: post,
                onLike: () => feedProvider.toggleLike(post.id, _currentUserId),
                onSave: () => feedProvider.toggleSave(post.id, _currentUserId),
                onTapAuthor: () {
                  // Navigate to user profile
                },
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildLeaderboardTab() {
    return Consumer<LeaderboardProvider>(
      builder: (context, leaderboardProvider, child) {
        if (leaderboardProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(
              color: Color(0xFFFFB800),
            ),
          );
        }

        if (leaderboardProvider.leaderboard.isEmpty) {
          return const Center(
            child: Text(
              'Henüz liderlik tablosu yok',
              style: TextStyle(color: Color(0xFF9CA3AF)),
            ),
          );
        }

        final topThree = leaderboardProvider.topThree;
        final otherLeaders = leaderboardProvider.otherLeaders;

        return RefreshIndicator(
          onRefresh: () => leaderboardProvider.refresh(),
          color: const Color(0xFFFFB800),
          child: ListView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
            physics: const AlwaysScrollableScrollPhysics(),
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFFFB800),
                Color(0xFFFF8C00),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
          ),
                child: const Column(
            children: [
                    Icon(
                Icons.emoji_events,
                color: Colors.white,
                size: 48,
              ),
                    SizedBox(height: 12),
                    Text(
                'Haftalık Liderler',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
                    SizedBox(height: 4),
              Text(
                'En aktif topluluk üyeleri',
                style: TextStyle(
                        color: Colors.white,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
              
        // Top 3 Leaders
              if (topThree.length >= 3)
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            // 2nd Place
                    Expanded(
                      child: LeaderboardCard(
                        item: topThree[1],
                        isTopThree: true,
                        onTap: () {
                          // Navigate to profile
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
            // 1st Place
                    Expanded(
                      child: LeaderboardCard(
                        item: topThree[0],
                        isTopThree: true,
                        onTap: () {
                          // Navigate to profile
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
            // 3rd Place
                    Expanded(
                      child: LeaderboardCard(
                        item: topThree[2],
                        isTopThree: true,
                        onTap: () {
                          // Navigate to profile
                        },
                      ),
                    ),
                  ],
                ),
              
        const SizedBox(height: 24),
              
        // Rest of Leaders
              if (otherLeaders.isNotEmpty) ...[
        const Text(
          'Diğer Liderler',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 16),
                ...otherLeaders.map((leader) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
                      child: LeaderboardCard(
                        item: leader,
                        isTopThree: false,
                        onTap: () {
                          // Navigate to profile
                        },
                      ),
            )),
      ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildCategoriesTab() {
    return Consumer<CategoryProvider>(
      builder: (context, categoryProvider, child) {
        if (categoryProvider.isLoading) {
          return const Center(
            child: CircularProgressIndicator(
              color: Color(0xFFFFB800),
            ),
          );
        }

        if (categoryProvider.categories.isEmpty) {
          return const Center(
            child: Text(
              'Henüz kategori yok',
              style: TextStyle(color: Color(0xFF9CA3AF)),
      ),
    );
  }

    return GridView.builder(
      padding: const EdgeInsets.all(20),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.1,
      ),
          itemCount: categoryProvider.categories.length,
      itemBuilder: (context, index) {
            final category = categoryProvider.categories[index];
            return CategoryChip(
              category: category,
              isSelected: false,
              onTap: () {
                // Filter by category
                context.read<FeedProvider>().filterByCategory(category.id);
                _tabController.animateTo(0);
              },
              compact: false,
            );
          },
        );
      },
    );
  }
}
