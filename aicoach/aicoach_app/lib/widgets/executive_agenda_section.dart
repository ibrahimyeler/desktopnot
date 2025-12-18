import 'package:flutter/material.dart';
import '../../features/goals/screens/goals_list_screen.dart';
import 'home/agenda_todo_card.dart';
import 'home/home_colors.dart';

class ExecutiveAgendaSection extends StatefulWidget {
  const ExecutiveAgendaSection({super.key});

  @override
  State<ExecutiveAgendaSection> createState() => _ExecutiveAgendaSectionState();
}

class _ExecutiveAgendaSectionState extends State<ExecutiveAgendaSection> {
  final List<_TodoItem> _todos = [
    _TodoItem(
      id: '1',
      title: 'Günlük hedef kontrolü yap',
      isCompleted: false,
    ),
    _TodoItem(
      id: '2',
      title: 'Lina ile odak planı oluştur',
      isCompleted: false,
    ),
    _TodoItem(
      id: '3',
      title: 'Bugünkü görevleri önceliklendir',
      isCompleted: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: HomeColors.cardBackground,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: HomeColors.borderColor, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: HomeColors.orange.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  Icons.task_outlined,
                  color: HomeColors.orange,
                  size: 18,
                ),
              ),
              const SizedBox(width: 10),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Bugünün Görevleri',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: HomeColors.textPrimary,
                      ),
                    ),
                    SizedBox(height: 2),
                    Text(
                      '3 görev',
                      style: TextStyle(
                        fontSize: 11,
                        color: HomeColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ..._todos.map((todo) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: AgendaTodoCard(
                  id: todo.id,
                  title: todo.title,
                  isCompleted: todo.isCompleted,
                  onToggle: (id) {
                    setState(() {
                      final index = _todos.indexWhere((t) => t.id == id);
                      if (index != -1) {
                        _todos[index] = _todos[index].copyWith(
                          isCompleted: !_todos[index].isCompleted,
                        );
                      }
                    });
                  },
                ),
              )),
          const SizedBox(height: 8),
          SizedBox(
            width: double.infinity,
            child: TextButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const GoalsListScreen(),
                  ),
                );
              },
              icon: const Icon(Icons.arrow_forward, size: 16),
              style: TextButton.styleFrom(
                foregroundColor: HomeColors.orange,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              label: const Text(
                'Tüm hedeflere git',
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 13,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TodoItem {
  final String id;
  final String title;
  final bool isCompleted;

  _TodoItem({
    required this.id,
    required this.title,
    required this.isCompleted,
  });

  _TodoItem copyWith({
    String? id,
    String? title,
    bool? isCompleted,
  }) {
    return _TodoItem(
      id: id ?? this.id,
      title: title ?? this.title,
      isCompleted: isCompleted ?? this.isCompleted,
    );
  }
}

