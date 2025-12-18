import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../features/goals/screens/goals_list_screen.dart';
import '../../features/home/screens/tasks_calendar_screen.dart';
import 'home_colors.dart';

/// Header altında gösterilen günlük yapılacaklar widget'ı - Sleek ve kompakt
class TodayTasksWidget extends StatefulWidget {
  const TodayTasksWidget({super.key});

  @override
  State<TodayTasksWidget> createState() => _TodayTasksWidgetState();
}

class _TodayTasksWidgetState extends State<TodayTasksWidget> {
  final List<_Task> _tasks = [
    _Task(
      id: '1',
      title: 'Günlük hedef kontrolü yap',
      isCompleted: false,
      priority: 1,
    ),
    _Task(
      id: '2',
      title: 'Lina ile odak planı oluştur',
      isCompleted: false,
      priority: 2,
    ),
    _Task(
      id: '3',
      title: 'Bugünkü görevleri önceliklendir',
      isCompleted: true,
      priority: 3,
    ),
  ];

  int get _completedCount => _tasks.where((t) => t.isCompleted).length;
  int get _totalCount => _tasks.length;
  double get _progress => _totalCount > 0 ? _completedCount / _totalCount : 0.0;

  @override
  Widget build(BuildContext context) {
    final uncompletedTasks = _tasks.where((t) => !t.isCompleted).take(2).toList();
    final hasMore = _tasks.where((t) => !t.isCompleted).length > 2;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: HomeColors.cardBackground,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: HomeColors.borderColor,
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header - Daha kompakt
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(5),
                decoration: BoxDecoration(
                  color: HomeColors.orange.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(7),
                ),
                child: const Icon(
                  Icons.today_outlined,
                  color: HomeColors.orange,
                  size: 14,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Row(
                  children: [
                    const Text(
                      'Bugünün Görevleri',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.bold,
                        color: HomeColors.textPrimary,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: HomeColors.orange.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '$_completedCount/$_totalCount',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: HomeColors.orange,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Takvim ikonu - Sağ üst köşe
              InkWell(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const TasksCalendarScreen(),
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(8),
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: HomeColors.blue.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: HomeColors.blue.withValues(alpha: 0.3),
                      width: 1,
                    ),
                  ),
                  child: const Icon(
                    Icons.calendar_today_outlined,
                    color: HomeColors.blue,
                    size: 14,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Progress bar - Sleek
          ClipRRect(
            borderRadius: BorderRadius.circular(3),
            child: LinearProgressIndicator(
              value: _progress,
              minHeight: 3,
              backgroundColor: HomeColors.borderColor,
              valueColor: AlwaysStoppedAnimation<Color>(
                HomeColors.orange,
              ),
            ),
          ),
          if (uncompletedTasks.isNotEmpty) ...[
            const SizedBox(height: 14),
            // Task list (max 2 items)
            ...uncompletedTasks.map((task) => _buildTaskItem(task)),
            if (hasMore) ...[
              const SizedBox(height: 8),
              _buildMoreTasksButton(),
            ],
          ] else ...[
            const SizedBox(height: 8),
            _buildAllCompletedMessage(),
          ],
        ],
      ),
    );
  }

  Widget _buildTaskItem(_Task task) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () {
          setState(() {
            final index = _tasks.indexWhere((t) => t.id == task.id);
            if (index != -1) {
              _tasks[index] = _tasks[index].copyWith(
                isCompleted: !_tasks[index].isCompleted,
              );
            }
          });
        },
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
          child: Row(
            children: [
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: task.isCompleted
                        ? HomeColors.orange
                        : HomeColors.borderColor,
                    width: 1.5,
                  ),
                  color: task.isCompleted
                      ? HomeColors.orange
                      : Colors.transparent,
                ),
                child: task.isCompleted
                    ? const Icon(
                        Icons.check,
                        size: 10,
                        color: Colors.black,
                      )
                    : null,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  task.title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: task.isCompleted
                        ? HomeColors.textSecondary
                        : HomeColors.textPrimary,
                    decoration: task.isCompleted
                        ? TextDecoration.lineThrough
                        : null,
                  ),
                ),
              ),
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _getPriorityColor(task.priority),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMoreTasksButton() {
    final remainingCount = _tasks.where((t) => !t.isCompleted).length - 2;
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => const GoalsListScreen(),
          ),
        );
      },
      borderRadius: BorderRadius.circular(6),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 10),
        decoration: BoxDecoration(
          color: HomeColors.orange.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '+$remainingCount görev daha',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: HomeColors.orange,
              ),
            ),
            const SizedBox(width: 4),
            const Icon(
              Icons.arrow_forward_ios,
              size: 11,
              color: HomeColors.orange,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAllCompletedMessage() {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: HomeColors.orange.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.check_circle,
            size: 14,
            color: HomeColors.orange,
          ),
          const SizedBox(width: 6),
          Text(
            'Tüm görevler tamamlandı',
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: HomeColors.orange,
            ),
          ),
        ],
      ),
    );
  }

  Color _getPriorityColor(int priority) {
    switch (priority) {
      case 1:
        return const Color(0xFFEF4444); // Kırmızı - Yüksek
      case 2:
        return const Color(0xFFF59E0B); // Turuncu - Orta
      default:
        return HomeColors.textSecondary; // Düşük
    }
  }

  String _getPriorityText(int priority) {
    switch (priority) {
      case 1:
        return 'Yüksek';
      case 2:
        return 'Orta';
      default:
        return 'Düşük';
    }
  }
}

class _Task {
  final String id;
  final String title;
  final bool isCompleted;
  final int priority; // 1: Yüksek, 2: Orta, 3: Düşük

  _Task({
    required this.id,
    required this.title,
    required this.isCompleted,
    required this.priority,
  });

  _Task copyWith({
    String? id,
    String? title,
    bool? isCompleted,
    int? priority,
  }) {
    return _Task(
      id: id ?? this.id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
      priority: priority ?? this.priority,
    );
  }
}

