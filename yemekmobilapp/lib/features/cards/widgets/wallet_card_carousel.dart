import 'package:flutter/material.dart';
import 'dart:math' as math;
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';

class WalletCardCarousel extends StatefulWidget {
  final List<Map<String, dynamic>> cards;

  const WalletCardCarousel({
    super.key,
    required this.cards,
  });

  @override
  State<WalletCardCarousel> createState() => _WalletCardCarouselState();
}

class _WalletCardCarouselState extends State<WalletCardCarousel> {
  late PageController _pageController;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(viewportFraction: 0.85);
    _pageController.addListener(() {
      final newIndex = _pageController.page?.round() ?? 0;
      if (newIndex != _currentIndex) {
        setState(() {
          _currentIndex = newIndex;
        });
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  String _maskCardNumber(String cardNumber) {
    final digitsOnly = cardNumber.replaceAll(RegExp(r'\D'), '');
    if (digitsOnly.length < 4) return cardNumber;
    
    final last4 = digitsOnly.substring(digitsOnly.length - 4);
    return '**** **** **** $last4';
  }

  Widget _buildCardContent(Map<String, dynamic> card, bool isActive) {
    final cardNumber = card['cardNumber'] as String? ?? '';
    final cardHolder = card['cardHolder'] as String? ?? '';
    final expiryDate = card['expiryDate'] as String? ?? '';
    final isDefault = card['isDefault'] as bool? ?? false;

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFF6B9BD1),
            const Color(0xFF8BB5D8),
          ],
        ),
        borderRadius: BorderRadius.circular(AppSizes.radiusL),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6B9BD1).withOpacity(isActive ? 0.3 : 0.2),
            blurRadius: isActive ? 20 : 12,
            offset: Offset(0, isActive ? 10 : 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppSizes.paddingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(AppSizes.radiusS),
                      ),
                      child: Icon(
                        Icons.credit_card,
                        color: Colors.white,
                        size: isActive ? 20 : 18,
                      ),
                    ),
                    if (isDefault && isActive) ...[
                      const SizedBox(width: AppSizes.paddingS),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Varsayılan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _maskCardNumber(cardNumber),
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: isActive ? 20 : 18,
                    fontWeight: FontWeight.w700,
                    letterSpacing: isActive ? 2 : 1.5,
                  ),
                ),
                const SizedBox(height: AppSizes.paddingM),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Kart Sahibi',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: isActive ? 11 : 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          cardHolder.toUpperCase(),
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: isActive ? 14 : 12,
                            fontWeight: FontWeight.w600,
                            letterSpacing: isActive ? 1 : 0.5,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Son Kullanma',
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontSize: isActive ? 11 : 10,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          expiryDate,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: isActive ? 14 : 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (widget.cards.isEmpty) {
      return const SizedBox.shrink();
    }

    return SizedBox(
      height: 220,
      child: Stack(
        children: [
          // Arka kartlar (sadece görsel efekt için)
          if (widget.cards.length > 1)
            ...List.generate(
              math.min(widget.cards.length - _currentIndex - 1, 2),
              (backIndex) {
                final cardIndex = _currentIndex + backIndex + 1;
                if (cardIndex >= widget.cards.length) return const SizedBox.shrink();
                
                final offset = 20.0 + (backIndex * 15.0);
                final scale = 0.85 - (backIndex * 0.05);
                final opacity = 0.5 - (backIndex * 0.1);
                
                return Positioned(
                  left: offset,
                  right: AppSizes.paddingL - offset,
                  child: Transform.scale(
                    scale: scale,
                    child: Opacity(
                      opacity: opacity,
                      child: _buildCardContent(
                        widget.cards[cardIndex],
                        false,
                      ),
                    ),
                  ),
                );
              },
            ),
          // Ön kart (swipe edilebilir)
          PageView.builder(
            controller: _pageController,
            itemCount: widget.cards.length,
            itemBuilder: (context, index) {
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: AppSizes.paddingL),
                child: _buildCardContent(
                  widget.cards[index],
                  index == _currentIndex,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
