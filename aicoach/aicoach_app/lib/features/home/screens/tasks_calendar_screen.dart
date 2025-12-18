import 'package:flutter/material.dart';
import '../../../widgets/home/home_colors.dart';

/// Görevler için takvim ekranı
class TasksCalendarScreen extends StatefulWidget {
  const TasksCalendarScreen({super.key});

  @override
  State<TasksCalendarScreen> createState() => _TasksCalendarScreenState();
}

class _TasksCalendarScreenState extends State<TasksCalendarScreen> {
  DateTime _selectedDate = DateTime.now();
  DateTime _focusedDate = DateTime.now();
  late Map<String, List<_Task>> _tasksByDate;

  static String _getDateKey(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  @override
  void initState() {
    super.initState();
    _initializeTasks();
  }

  void _initializeTasks() {
    final now = DateTime.now();
    _tasksByDate = {
      _getDateKey(now): [
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
      ],
      _getDateKey(now.add(const Duration(days: 1))): [
        _Task(
          id: '4',
          title: 'Haftalık raporu hazırla',
          isCompleted: false,
          priority: 1,
        ),
        _Task(
          id: '5',
          title: 'Yeni koçlar ile tanış',
          isCompleted: false,
          priority: 2,
        ),
      ],
      _getDateKey(now.subtract(const Duration(days: 1))): [
        _Task(
          id: '6',
          title: 'Önceki günün görevleri',
          isCompleted: true,
          priority: 2,
        ),
      ],
    };
  }

  List<_Task> _getTasksForDate(DateTime date) {
    final key = _getDateKey(date);
    return _tasksByDate[key] ?? [];
  }

  int _getTaskCountForDate(DateTime date) {
    return _getTasksForDate(date).length;
  }

  int _getCompletedTaskCountForDate(DateTime date) {
    return _getTasksForDate(date).where((t) => t.isCompleted).length;
  }

  @override
  Widget build(BuildContext context) {
    final selectedTasks = _getTasksForDate(_selectedDate);
    final selectedDateKey = _getDateKey(_selectedDate);
    final isToday = _getDateKey(DateTime.now()) == selectedDateKey;

    return Scaffold(
      backgroundColor: HomeColors.backgroundColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
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
          'Takvim',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Takvim
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: HomeColors.cardBackground,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: HomeColors.borderColor,
                width: 1,
              ),
            ),
            child: Column(
              children: [
                // Ay ve yıl başlığı
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.chevron_left, color: Colors.white),
                      onPressed: () {
                        setState(() {
                          _focusedDate = DateTime(_focusedDate.year, _focusedDate.month - 1);
                        });
                      },
                    ),
                    Text(
                      _getMonthYearText(_focusedDate),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.chevron_right, color: Colors.white),
                      onPressed: () {
                        setState(() {
                          _focusedDate = DateTime(_focusedDate.year, _focusedDate.month + 1);
                        });
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Hafta günleri başlıkları
                _buildWeekdayHeaders(),
                const SizedBox(height: 8),
                // Takvim grid
                _buildCalendarGrid(),
              ],
            ),
          ),
          // Seçilen tarihin görevleri
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: HomeColors.cardBackground,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: HomeColors.borderColor,
                  width: 1,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.task_outlined,
                        color: HomeColors.orange,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        isToday
                            ? 'Bugünün Görevleri'
                            : _getFormattedDate(_selectedDate),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const Spacer(),
                      if (selectedTasks.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: HomeColors.orange.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            '${selectedTasks.where((t) => t.isCompleted).length}/${selectedTasks.length}',
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: HomeColors.orange,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  selectedTasks.isEmpty
                      ? _buildEmptyState()
                      : Expanded(
                          child: ListView.builder(
                            itemCount: selectedTasks.length,
                            itemBuilder: (context, index) {
                              final task = selectedTasks[index];
                              return _buildTaskItem(task, selectedDateKey);
                            },
                          ),
                        ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildWeekdayHeaders() {
    const weekdays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: weekdays.map((day) {
        return SizedBox(
          width: 40,
          child: Text(
            day,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: HomeColors.textSecondary,
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCalendarGrid() {
    final firstDayOfMonth = DateTime(_focusedDate.year, _focusedDate.month, 1);
    final lastDayOfMonth = DateTime(_focusedDate.year, _focusedDate.month + 1, 0);
    final firstDayWeekday = firstDayOfMonth.weekday % 7; // 0 = Pazartesi
    final daysInMonth = lastDayOfMonth.day;

    return Column(
      children: [
        for (int week = 0; week < 6; week++)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(7, (dayIndex) {
                final day = week * 7 + dayIndex - firstDayWeekday + 1;
                
                if (day < 1 || day > daysInMonth) {
                  return const SizedBox(width: 40, height: 40);
                }

                final date = DateTime(_focusedDate.year, _focusedDate.month, day);
                final isSelected = _getDateKey(date) == _getDateKey(_selectedDate);
                final isToday = _getDateKey(date) == _getDateKey(DateTime.now());
                final taskCount = _getTaskCountForDate(date);
                final completedCount = _getCompletedTaskCountForDate(date);
                final hasTasks = taskCount > 0;

                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedDate = date;
                    });
                  },
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? HomeColors.orange
                          : isToday
                              ? HomeColors.orange.withValues(alpha: 0.2)
                              : Colors.transparent,
                      shape: BoxShape.circle,
                      border: isToday && !isSelected
                          ? Border.all(
                              color: HomeColors.orange,
                              width: 1.5,
                            )
                          : null,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          day.toString(),
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: isSelected || isToday
                                ? FontWeight.bold
                                : FontWeight.normal,
                            color: isSelected
                                ? Colors.black
                                : Colors.white,
                          ),
                        ),
                        if (hasTasks)
                          Container(
                            margin: const EdgeInsets.only(top: 2),
                            width: 4,
                            height: 4,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected
                                  ? Colors.black
                                  : completedCount == taskCount
                                      ? HomeColors.orange
                                      : HomeColors.textSecondary,
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
      ],
    );
  }

  Widget _buildTaskItem(_Task task, String dateKey) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          setState(() {
            final tasks = _tasksByDate[dateKey] ?? [];
            final index = tasks.indexWhere((t) => t.id == task.id);
            if (index != -1) {
              tasks[index] = tasks[index].copyWith(
                isCompleted: !tasks[index].isCompleted,
              );
              _tasksByDate[dateKey] = tasks;
            }
          });
        },
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: HomeColors.backgroundColor,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: HomeColors.borderColor,
              width: 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 20,
                height: 20,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: task.isCompleted
                        ? HomeColors.orange
                        : HomeColors.borderColor,
                    width: 2,
                  ),
                  color: task.isCompleted
                      ? HomeColors.orange
                      : Colors.transparent,
                ),
                child: task.isCompleted
                    ? const Icon(
                        Icons.check,
                        size: 12,
                        color: Colors.black,
                      )
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  task.title,
                  style: TextStyle(
                    fontSize: 14,
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

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.task_alt,
            size: 48,
            color: HomeColors.textSecondary.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'Bu tarihte görev yok',
            style: TextStyle(
              fontSize: 14,
              color: HomeColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  String _getMonthYearText(DateTime date) {
    const months = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık'
    ];
    return '${months[date.month - 1]} ${date.year}';
  }

  String _getFormattedDate(DateTime date) {
    const months = [
      'Ocak',
      'Şubat',
      'Mart',
      'Nisan',
      'Mayıs',
      'Haziran',
      'Temmuz',
      'Ağustos',
      'Eylül',
      'Ekim',
      'Kasım',
      'Aralık'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  Color _getPriorityColor(int priority) {
    switch (priority) {
      case 1:
        return const Color(0xFFEF4444);
      case 2:
        return const Color(0xFFF59E0B);
      default:
        return HomeColors.textSecondary;
    }
  }
}

class _Task {
  final String id;
  final String title;
  final bool isCompleted;
  final int priority;

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

