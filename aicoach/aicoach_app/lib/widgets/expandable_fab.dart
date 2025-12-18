import 'dart:math' as math;
import 'package:flutter/material.dart';

/// Expandable FAB Widget - 3 action butonu ile
class ExpandableFab extends StatefulWidget {
  final List<FabAction> actions;

  const ExpandableFab({
    super.key,
    required this.actions,
  });

  @override
  State<ExpandableFab> createState() => _ExpandableFabState();
}

class _ExpandableFabState extends State<ExpandableFab>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isExpanded = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400), // Daha sleek animasyon için süre artırıldı
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleExpanded() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  void _onActionTap(int index) {
    _toggleExpanded();
    widget.actions[index].onPressed();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      alignment: Alignment.bottomCenter,
      children: [
        // Action buttons - açısal yerleşim
        if (_isExpanded)
          ...List.generate(widget.actions.length, (index) {
            double angle;
            double distance = 50.0; // Boşluk daha da azaltıldı
            
            if (index == 1) {
              // Ortadaki buton (index 1) - tam üstte
              angle = -90 * (math.pi / 180); // -90 derece (yukarı)
            } else if (index == 0) {
              // İlk buton - sol üst 75 derece açı ile
              angle = -165 * (math.pi / 180); // -165 derece (-90 - 75)
            } else {
              // Son buton - sağ üst 75 derece açı ile
              angle = -15 * (math.pi / 180); // -15 derece (-90 + 75)
            }
            
            final offsetX = distance * cos(angle);
            final offsetY = distance * sin(angle);
            
            return Positioned(
              bottom: 68 + 2, // FAB'a çok daha yakın
              left: 0,
              right: 0,
              child: Transform.translate(
                offset: Offset(offsetX, offsetY),
                child: ScaleTransition(
                  scale: Tween<double>(begin: 0.0, end: 1.0).animate(
                    CurvedAnimation(
                      parent: _controller,
                      curve: Interval(
                        index * 0.12,
                        0.5 + index * 0.12,
                        curve: Curves.easeOutCubic, // Daha sleek curve
                      ),
                    ),
                  ),
                  child: FadeTransition(
                    opacity: CurvedAnimation(
                      parent: _controller,
                      curve: Interval(
                        index * 0.12,
                        0.5 + index * 0.12,
                        curve: Curves.easeOutCubic,
                      ),
                    ),
                    child: _buildActionButton(index),
                  ),
                ),
              ),
            );
          }),
        // Main FAB button
        _buildMainButton(),
      ],
    );
  }

  Widget _buildActionButton(int index) {
    final action = widget.actions[index];
    return GestureDetector(
      onTap: () => _onActionTap(index),
      child: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: const Color(0xFF2C2C2C), // Kurumsal koyu gri
          shape: BoxShape.circle,
          border: Border.all(
            color: const Color(0xFF4A4A4A).withOpacity(0.5), // Soft border
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 8,
              spreadRadius: 0,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Icon(
          action.icon,
          color: const Color(0xFFFFB800), // Turuncu accent
          size: 24,
        ),
      ),
    );
  }
  
  double cos(double angle) => math.cos(angle);
  double sin(double angle) => math.sin(angle);

  Widget _buildMainButton() {
    return GestureDetector(
      onTap: _toggleExpanded,
      child: AnimatedRotation(
        turns: _isExpanded ? 0.125 : 0.0, // 45 derece döner
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOutCubic, // Daha sleek curve
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 400),
          curve: Curves.easeInOutCubic, // Daha sleek curve
          width: 68,
          height: 68,
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Color(0xFFFFB800),
                Color(0xFFFF8C00),
              ],
            ),
            shape: BoxShape.circle,
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFFFB800).withOpacity(_isExpanded ? 0.5 : 0.3),
                blurRadius: _isExpanded ? 20 : 12,
                spreadRadius: _isExpanded ? 4 : 2,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.white.withOpacity(0.2),
                width: 2,
              ),
            ),
            child: Icon(
              _isExpanded ? Icons.close_rounded : Icons.store_rounded,
              color: const Color(0xFF000000),
              size: 32,
            ),
          ),
        ),
      ),
    );
  }
}

/// FAB Action modeli
class FabAction {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;

  const FabAction({
    required this.icon,
    required this.label,
    required this.onPressed,
  });
}
