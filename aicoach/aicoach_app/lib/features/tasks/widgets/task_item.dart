import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../../../widgets/home/home_colors.dart';

/// Task item widget for task list
class TaskItem extends StatelessWidget {
  final String id;
  final String title;
  final String? description;
  final bool isCompleted;
  final String priority; // 'critical', 'important', 'low'
  final DateTime? dueDate;

  const TaskItem({
    super.key,
    required this.id,
    required this.title,
    this.description,
    this.isCompleted = false,
    this.priority = 'low',
    this.dueDate,
  });

  Color _getPriorityColor() {
    switch (priority) {
      case 'critical':
        return Colors.red;
      case 'important':
        return HomeColors.orange;
      default:
        return HomeColors.blue;
    }
  }

  @override
  Widget build(BuildContext context) {
    final priorityColor = _getPriorityColor();
    
    return GestureDetector(
      onTap: () => context.push(AppRoutes.taskDetail(id)),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFF374151),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            // Checkbox
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                border: Border.all(
                  color: isCompleted ? priorityColor : Colors.grey[600]!,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(6),
                color: isCompleted ? priorityColor : Colors.transparent,
              ),
              child: isCompleted
                  ? const Icon(Icons.check, color: Colors.white, size: 16)
                  : null,
            ),
            const SizedBox(width: 16),
            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      color: isCompleted ? Colors.grey[600] : Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      decoration: isCompleted
                          ? TextDecoration.lineThrough
                          : TextDecoration.none,
                    ),
                  ),
                  if (description != null && description!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      description!,
                      style: TextStyle(
                        color: Colors.grey[500],
                        fontSize: 12,
                        decoration: isCompleted
                            ? TextDecoration.lineThrough
                            : TextDecoration.none,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                  if (dueDate != null) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.access_time, size: 14, color: Colors.grey[600]),
                        const SizedBox(width: 4),
                        Text(
                          _formatDate(dueDate!),
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
            // Priority indicator
            Container(
              width: 4,
              height: 40,
              decoration: BoxDecoration(
                color: priorityColor,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = date.difference(now).inDays;

    if (difference == 0) return 'Bugün';
    if (difference == 1) return 'Yarın';
    if (difference == -1) return 'Dün';
    if (difference > 0 && difference <= 7) return '$difference gün sonra';
    
    return '${date.day}/${date.month}/${date.year}';
  }
}

