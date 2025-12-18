import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';
import '../widgets/task_item.dart';

/// Tasks List Screen - Shows all tasks
class TasksListScreen extends StatelessWidget {
  const TasksListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Görevler',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: Colors.white),
            onPressed: () {
              // Filter dialog
            },
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Filter tabs
            Container(
              height: 50,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  _buildFilterTab(context, 'Tümü', true),
                  const SizedBox(width: 12),
                  _buildFilterTab(context, 'Aktif', false),
                  const SizedBox(width: 12),
                  _buildFilterTab(context, 'Tamamlanan', false),
                ],
              ),
            ),
            // Task list
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(20),
                children: [
                  const Text(
                    'Kritik Görevler',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  TaskItem(
                    id: '1',
                    title: 'Proje sunumunu hazırla',
                    description: 'Müşteri toplantısı için',
                    priority: 'critical',
                    dueDate: DateTime.now().add(const Duration(days: 1)),
                  ),
                  TaskItem(
                    id: '2',
                    title: 'Raporu gözden geçir',
                    priority: 'critical',
                    dueDate: DateTime.now(),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Önemli Görevler',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  TaskItem(
                    id: '3',
                    title: 'Email\'leri yanıtla',
                    priority: 'important',
                    dueDate: DateTime.now().add(const Duration(days: 2)),
                  ),
                  TaskItem(
                    id: '4',
                    title: 'Takım toplantısı',
                    priority: 'important',
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Tamamlanan',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  TaskItem(
                    id: '5',
                    title: 'Dokümantasyon güncelle',
                    isCompleted: true,
                    priority: 'low',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push(AppRoutes.createTask),
        backgroundColor: const Color(0xFFFFB800),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildFilterTab(BuildContext context, String label, bool isActive) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isActive
              ? const Color(0xFFFFB800)
              : const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : Colors.grey[400],
            fontSize: 14,
            fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

