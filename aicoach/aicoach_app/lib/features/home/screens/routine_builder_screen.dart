import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Routine Builder Screen - Sabah/akşam rutini oluşturma
class RoutineBuilderScreen extends StatefulWidget {
  const RoutineBuilderScreen({super.key});

  @override
  State<RoutineBuilderScreen> createState() => _RoutineBuilderScreenState();
}

class _RoutineBuilderScreenState extends State<RoutineBuilderScreen> {
  String _selectedType = 'morning'; // 'morning' or 'evening'
  final List<Map<String, dynamic>> _morningRoutine = [];
  final List<Map<String, dynamic>> _eveningRoutine = [];

  final List<Map<String, dynamic>> _availableActivities = const [
    {'id': 'meditation', 'title': 'Meditasyon', 'icon': Icons.self_improvement, 'duration': 10},
    {'id': 'goal_setting', 'title': 'Güne Hedef Belirleme', 'icon': Icons.flag, 'duration': 5},
    {'id': 'shower', 'title': 'Sıcak Duş', 'icon': Icons.shower, 'duration': 15},
    {'id': 'walk', 'title': 'Yürüyüş', 'icon': Icons.directions_walk, 'duration': 20},
    {'id': 'english', 'title': 'İngilizce 10 dk', 'icon': Icons.language, 'duration': 10},
    {'id': 'six_methods', 'title': '6 İş Planlama', 'icon': Icons.calendar_today, 'duration': 15},
    {'id': 'deep_work', 'title': 'Derin Çalışma Bloğu', 'icon': Icons.psychology, 'duration': 90},
    {'id': 'reflection', 'title': 'Evening Reflection', 'icon': Icons.lightbulb, 'duration': 10},
    {'id': 'journaling', 'title': 'Günlük Yazma', 'icon': Icons.edit, 'duration': 15},
    {'id': 'reading', 'title': 'Okuma', 'icon': Icons.menu_book, 'duration': 20},
  ];

  void _addActivity(Map<String, dynamic> activity) {
    setState(() {
      if (_selectedType == 'morning') {
        _morningRoutine.add(activity);
      } else {
        _eveningRoutine.add(activity);
      }
    });
  }

  void _removeActivity(int index) {
    setState(() {
      if (_selectedType == 'morning') {
        _morningRoutine.removeAt(index);
      } else {
        _eveningRoutine.removeAt(index);
      }
    });
  }

  void _reorderActivity(int oldIndex, int newIndex) {
    setState(() {
      if (_selectedType == 'morning') {
        if (newIndex > oldIndex) {
          newIndex -= 1;
        }
        final item = _morningRoutine.removeAt(oldIndex);
        _morningRoutine.insert(newIndex, item);
      } else {
        if (newIndex > oldIndex) {
          newIndex -= 1;
        }
        final item = _eveningRoutine.removeAt(oldIndex);
        _eveningRoutine.insert(newIndex, item);
      }
    });
  }

  Future<void> _saveRoutine() async {
    // TODO: Save to backend
    // await _saveRoutineToBackend({
    //   'morning': _morningRoutine,
    //   'evening': _eveningRoutine,
    // });

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Rutin kaydedildi'),
        backgroundColor: LoginColors.orangeBright,
      ),
    );

    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    final currentRoutine = _selectedType == 'morning' ? _morningRoutine : _eveningRoutine;

    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: LoginColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Rutin Oluşturucu',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.auto_awesome, color: LoginColors.orangeBright),
            onPressed: () {
              // TODO: AI rutin önerme
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('AI rutin önerisi hazırlanıyor...'),
                  backgroundColor: LoginColors.orangeBright,
                ),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Type selector
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: LoginColors.mediumGray,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _buildTypeButton('morning', 'Sabah Rutini', Icons.wb_sunny),
                ),
                Expanded(
                  child: _buildTypeButton('evening', 'Akşam Rutini', Icons.nightlight),
                ),
              ],
            ),
          ),

          // Routine list
          Expanded(
            child: ReorderableListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: currentRoutine.length,
              onReorder: _reorderActivity,
              itemBuilder: (context, index) {
                final activity = currentRoutine[index];
                return _buildRoutineItem(activity, index);
              },
            ),
          ),

          // Activity selector
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: LoginColors.mediumGray,
              border: Border(
                top: BorderSide(
                  color: LoginColors.lightGray,
                  width: 1,
                ),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Aktivite Ekle',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 100,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _availableActivities.length,
                    itemBuilder: (context, index) {
                      final activity = _availableActivities[index];
                      final isAdded = currentRoutine.any(
                        (item) => item['id'] == activity['id'],
                      );
                      
                      if (isAdded && _selectedType == 'morning' && activity['id'] == 'reflection') {
                        return const SizedBox.shrink();
                      }
                      if (isAdded && _selectedType == 'evening' && activity['id'] == 'six_methods') {
                        return const SizedBox.shrink();
                      }

                      return Padding(
                        padding: const EdgeInsets.only(right: 12),
                        child: GestureDetector(
                          onTap: isAdded
                              ? null
                              : () => _addActivity(activity),
                          child: Container(
                            width: 80,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isAdded
                                  ? LoginColors.lightGray
                                  : LoginColors.darkGray,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isAdded
                                    ? LoginColors.lightGray
                                    : LoginColors.orangeBright,
                                width: 1,
                              ),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  activity['icon'] as IconData,
                                  color: isAdded
                                      ? LoginColors.textSecondary
                                      : LoginColors.orangeBright,
                                  size: 24,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  activity['title'] as String,
                                  style: TextStyle(
                                    color: isAdded
                                        ? LoginColors.textSecondary
                                        : LoginColors.textPrimary,
                                    fontSize: 10,
                                  ),
                                  textAlign: TextAlign.center,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // Save button
          Container(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: _saveRoutine,
              style: ElevatedButton.styleFrom(
                backgroundColor: LoginColors.orangeBright,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Rutini Kaydet',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypeButton(String type, String label, IconData icon) {
    final isSelected = _selectedType == type;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedType = type;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? LoginColors.orangeBright
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : LoginColors.textSecondary,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : LoginColors.textSecondary,
                fontSize: 14,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoutineItem(Map<String, dynamic> activity, int index) {
    return Container(
      key: ValueKey('${activity['id']}_$index'),
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: LoginColors.mediumGray,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(
            Icons.drag_handle,
            color: LoginColors.textSecondary,
            size: 20,
          ),
          const SizedBox(width: 12),
          Icon(
            activity['icon'] as IconData,
            color: LoginColors.orangeBright,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  activity['title'] as String,
                  style: const TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${activity['duration']} dakika',
                  style: const TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: LoginColors.textSecondary),
            onPressed: () => _removeActivity(index),
          ),
        ],
      ),
    );
  }
}


