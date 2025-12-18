import 'package:flutter/material.dart';
import 'home_colors.dart';

/// Agenda Todo kartı widget'ı
class AgendaTodoCard extends StatelessWidget {
  final String id;
  final String title;
  final bool isCompleted;
  final Function(String) onToggle;

  const AgendaTodoCard({
    super.key,
    required this.id,
    required this.title,
    required this.isCompleted,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: HomeColors.backgroundColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: HomeColors.borderColor,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Checkbox(
            value: isCompleted,
            onChanged: (value) => onToggle(id),
            activeColor: HomeColors.orange,
            checkColor: HomeColors.backgroundColor,
            side: BorderSide(
              color: isCompleted ? HomeColors.orange : HomeColors.borderColor,
              width: 2,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: isCompleted
                    ? HomeColors.textSecondary.withOpacity(0.6)
                    : HomeColors.textPrimary,
                decoration: isCompleted
                    ? TextDecoration.lineThrough
                    : TextDecoration.none,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

