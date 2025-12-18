import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../../../models/coach.dart';
import '../../../services/coach_service.dart';
import '../../../services/chat_service.dart';
import '../../../widgets/coach_card_horizontal.dart';
import '../../../widgets/coaches_header_section.dart';
import 'coach_chat_screen.dart';
import '../../../app/navigation/route_names.dart';

class CoachListScreen extends StatefulWidget {
  const CoachListScreen({super.key});

  @override
  State<CoachListScreen> createState() => _CoachListScreenState();
}

class _CoachListScreenState extends State<CoachListScreen> with SingleTickerProviderStateMixin {
  CoachService? _coachService;
  List<Coach> _coaches = [];
  bool _isLoading = true;
  late TabController _tabController;
  int _selectedTabIndex = 0;

  // Default coach IDs (purchased coaches)
  final List<String> _defaultCoachIds = [
    'focus-planning-coach',
    'english-coach',
    'finance-coach',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      setState(() {
        _selectedTabIndex = _tabController.index;
      });
    });
    _loadCoaches();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadCoaches() async {
    setState(() {
      _isLoading = true;
    });
    
    _coachService = CoachService();
    final coaches = await _coachService!.getCoaches();
    
    if (mounted) {
      setState(() {
        _coaches = coaches;
        _isLoading = false;
      });
    }
  }

  List<Coach> get _customCoaches {
    return _coaches.where((coach) => !_defaultCoachIds.contains(coach.id)).toList();
  }

  List<Coach> get _purchasedCoaches {
    return _coaches.where((coach) => _defaultCoachIds.contains(coach.id)).toList();
  }

  Widget _buildCoachesTab(List<Coach> coaches, String tabName) {
    if (coaches.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      const Color(0xFF1F2937),
                      const Color(0xFF111827),
                    ],
                  ),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFF374151),
                    width: 1.5,
                  ),
                ),
                child: Icon(
                  tabName == 'Oluşturduklarım'
                      ? Icons.add_circle_outline
                      : Icons.shopping_bag_outlined,
                  size: 48,
                  color: const Color(0xFF9CA3AF),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                tabName == 'Oluşturduklarım'
                    ? 'Henüz koç oluşturmadınız'
                    : 'Henüz koç satın almadınız',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                tabName == 'Oluşturduklarım'
                    ? 'Yeni koç oluşturmak için\nKoç Market\'e gidin'
                    : 'Koç Market\'ten koç satın alabilirsiniz',
                style: const TextStyle(
                  fontSize: 14,
                  color: Color(0xFF9CA3AF),
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(20.0, 16.0, 20.0, 100.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with count badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: const Color(0xFF374151),
                width: 1,
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        const Color(0xFFFFB800).withOpacity(0.2),
                        const Color(0xFFFFB800).withOpacity(0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    tabName == 'Oluşturduklarım'
                        ? Icons.auto_awesome
                        : Icons.shopping_bag,
                    color: const Color(0xFFFFB800),
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tabName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${coaches.length} koç',
                        style: const TextStyle(
                          color: Color(0xFF9CA3AF),
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFB800).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: const Color(0xFFFFB800).withOpacity(0.3),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    '${coaches.length}',
                    style: const TextStyle(
                      color: Color(0xFFFFB800),
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: coaches.length,
            itemBuilder: (context, index) {
              final coach = coaches[index];
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Column(
                  children: [
                    AnimatedSlideCoachCard(
                      coach: coach,
                      onTap: () => _navigateToChat(coach),
                      delay: Duration(milliseconds: index * 100),
                    ),
                    // Market'e Ekle butonu (sadece Oluşturduklarım sekmesi için)
                    if (tabName == 'Oluşturduklarım') ...[
                      const SizedBox(height: 12),
                      _buildAddToMarketButton(coach),
                    ],
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildAddToMarketButton(Coach coach) {
    // Eğer zaten market'teyse farklı bir buton göster
    if (coach.isMarketplace) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFF10B981).withOpacity(0.15),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFF10B981).withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.check_circle,
              color: Color(0xFF10B981),
              size: 18,
            ),
            const SizedBox(width: 8),
            Text(
              'Market\'te Yayında',
              style: const TextStyle(
                color: Color(0xFF10B981),
                fontSize: 14,
                fontWeight: FontWeight.w600,
              ),
            ),
            if (coach.price != null) ...[
              const SizedBox(width: 8),
              Text(
                '• ${coach.price!.toStringAsFixed(2)} ₺',
                style: const TextStyle(
                  color: Color(0xFF10B981),
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ],
        ),
      );
    }

    return InkWell(
      onTap: () => _showAddToMarketDialog(coach),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFB800),
              Color(0xFFFF8C00),
            ],
          ),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.store,
              color: Colors.white,
              size: 18,
            ),
            const SizedBox(width: 8),
            const Text(
              'Market\'e Ekle',
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showAddToMarketDialog(Coach coach) async {
    final TextEditingController priceController = TextEditingController();
    String selectedPriceType = 'purchase'; // 'purchase' veya 'rent'

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          backgroundColor: const Color(0xFF1F2937),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(
              color: Color(0xFF374151),
              width: 1,
            ),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      Color(0xFFFFB800),
                      Color(0xFFFF8C00),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.store,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(
                child: Text(
                  'Market\'e Ekle',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Koç bilgisi
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF111827),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF374151),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Text(
                        coach.icon,
                        style: const TextStyle(fontSize: 32),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              coach.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              coach.description,
                              style: const TextStyle(
                                color: Color(0xFF9CA3AF),
                                fontSize: 12,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Fiyat tipi seçimi
                const Text(
                  'Satış Tipi',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () {
                          setState(() {
                            selectedPriceType = 'purchase';
                          });
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: selectedPriceType == 'purchase'
                                ? const Color(0xFF10B981).withOpacity(0.15)
                                : const Color(0xFF1F2937),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: selectedPriceType == 'purchase'
                                  ? const Color(0xFF10B981)
                                  : const Color(0xFF374151),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            children: [
                              Icon(
                                Icons.shopping_bag,
                                color: selectedPriceType == 'purchase'
                                    ? const Color(0xFF10B981)
                                    : const Color(0xFF9CA3AF),
                                size: 24,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Satın Al',
                                style: TextStyle(
                                  color: selectedPriceType == 'purchase'
                                      ? const Color(0xFF10B981)
                                      : const Color(0xFF9CA3AF),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: InkWell(
                        onTap: () {
                          setState(() {
                            selectedPriceType = 'rent';
                          });
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: selectedPriceType == 'rent'
                                ? const Color(0xFF3B82F6).withOpacity(0.15)
                                : const Color(0xFF1F2937),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: selectedPriceType == 'rent'
                                  ? const Color(0xFF3B82F6)
                                  : const Color(0xFF374151),
                              width: 2,
                            ),
                          ),
                          child: Column(
                            children: [
                              Icon(
                                Icons.schedule,
                                color: selectedPriceType == 'rent'
                                    ? const Color(0xFF3B82F6)
                                    : const Color(0xFF9CA3AF),
                                size: 24,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Kiralama',
                                style: TextStyle(
                                  color: selectedPriceType == 'rent'
                                      ? const Color(0xFF3B82F6)
                                      : const Color(0xFF9CA3AF),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Fiyat girişi
                const Text(
                  'Fiyat (₺)',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: priceController,
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Örn: 299.99',
                    hintStyle: const TextStyle(color: Color(0xFF6B7280)),
                    filled: true,
                    fillColor: const Color(0xFF111827),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(
                        color: Color(0xFF374151),
                        width: 1,
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(
                        color: Color(0xFF374151),
                        width: 1,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(
                        color: Color(0xFFFFB800),
                        width: 2,
                      ),
                    ),
                    prefixIcon: const Icon(
                      Icons.currency_lira,
                      color: Color(0xFF9CA3AF),
                    ),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text(
                'İptal',
                style: TextStyle(
                  color: Color(0xFF9CA3AF),
                  fontSize: 16,
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                final priceText = priceController.text.trim();
                if (priceText.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Lütfen fiyat girin'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                final price = double.tryParse(priceText);
                if (price == null || price <= 0) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Geçerli bir fiyat girin'),
                      backgroundColor: Colors.red,
                    ),
                  );
                  return;
                }

                // Koçu güncelle
                _addCoachToMarketplace(coach, price, selectedPriceType);
                Navigator.pop(context);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFFB800),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Market\'e Ekle',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _addCoachToMarketplace(Coach coach, double price, String priceType) async {
    try {
      // Koçu güncelle
      final updatedCoach = coach.copyWith(
        price: price,
        priceType: priceType,
        isMarketplace: true,
      );

      // Tüm koçları al
      final allCoaches = await _coachService!.getCoaches();
      
      // Güncellenmiş koçu bul ve değiştir
      final index = allCoaches.indexWhere((c) => c.id == coach.id);
      if (index != -1) {
        allCoaches[index] = updatedCoach;
        
        // Kaydet
        await _coachService!.saveCoaches(allCoaches);
        
        // Listeyi yenile
        await _loadCoaches();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${coach.name} market\'e eklendi!'),
              backgroundColor: const Color(0xFF10B981),
              duration: const Duration(seconds: 2),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Hata: ${e.toString()}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _navigateToChat(Coach coach) async {
    // Check if onboarding is completed
    final prefs = await SharedPreferences.getInstance();
    final onboardingCompleted = prefs.getBool('onboarding_completed') ?? false;

    if (!onboardingCompleted) {
      // Show onboarding as full screen modal
      // Navigate to onboarding then coach detail
      // TODO: Implement onboarding flow
      context.push(AppRoutes.coachDetail(coach.id));
    } else {
      // Navigate directly to coach detail screen
      context.push(AppRoutes.coachDetail(coach.id));
    }
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
            child: const Icon(Icons.arrow_back_ios_new, color: Colors.white, size: 18),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Koçlarım',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
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
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
              unselectedLabelStyle: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.normal,
              ),
              tabs: const [
                Tab(text: 'Oluşturduklarım'),
                Tab(text: 'Satın Aldıklarım'),
              ],
            ),
          ),
        ),
      ),
      body: _isLoading
          ? const Center(
              child: CircularProgressIndicator(
                color: Color(0xFFFFB800),
              ),
            )
          : TabBarView(
              controller: _tabController,
              children: [
                _buildCoachesTab(_customCoaches, 'Oluşturduklarım'),
                _buildCoachesTab(_purchasedCoaches, 'Satın Aldıklarım'),
              ],
            ),
    );
  }
}

// Animated version with delay
class AnimatedSlideCoachCard extends StatefulWidget {
  final Coach coach;
  final VoidCallback onTap;
  final Duration delay;

  const AnimatedSlideCoachCard({
    super.key,
    required this.coach,
    required this.onTap,
    required this.delay,
  });

  @override
  State<AnimatedSlideCoachCard> createState() =>
      _AnimatedSlideCoachCardState();
}

class _AnimatedSlideCoachCardState extends State<AnimatedSlideCoachCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.3, 0),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    Future.delayed(widget.delay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: CoachCardHorizontal(
          coach: widget.coach,
          onTap: widget.onTap,
        ),
      ),
    );
  }
}
