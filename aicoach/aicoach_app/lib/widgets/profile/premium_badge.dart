import 'package:flutter/material.dart';

/// Premium Üye badge widget'ı
class PremiumBadge extends StatelessWidget {
  final String text;

  const PremiumBadge({
    super.key,
    this.text = 'Premium Üye',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFFFB800).withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.star,
            size: 14,
            color: const Color(0xFFFF8C00),
          ),
          const SizedBox(width: 6),
          Text(
            text,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: Color(0xFFFF8C00),
            ),
          ),
        ],
      ),
    );
  }
}

