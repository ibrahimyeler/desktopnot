import 'package:flutter/material.dart';
import '../../../models/coach.dart';
import 'package:go_router/go_router.dart';
import '../../../app/navigation/route_names.dart';

class FocusPlanningDetailScreen extends StatefulWidget {
  final Coach coach;

  const FocusPlanningDetailScreen({
    super.key,
    required this.coach,
  });

  @override
  State<FocusPlanningDetailScreen> createState() =>
      _FocusPlanningDetailScreenState();
}

class _FocusPlanningDetailScreenState extends State<FocusPlanningDetailScreen> {
  int _selectedTab = 0;

  Color _getCategoryColor() {
    return const Color(0xFFFFB800); // Yellow-orange
  }

  @override
  Widget build(BuildContext context) {
    final color = _getCategoryColor();

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
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
            child: const Icon(Icons.arrow_back_ios_new,
                color: Colors.white, size: 18),
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              widget.coach.icon,
              style: const TextStyle(fontSize: 24),
            ),
            const SizedBox(width: 8),
            const Text(
              'Odak ve Planlama Koçu',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ],
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Tab Bar
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF1F2937),
              border: Border(
                bottom: BorderSide(color: const Color(0xFF374151)),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _buildTab(0, 'Genel Bakış', Icons.dashboard_outlined),
                ),
                Expanded(
                  child: _buildTab(1, 'Hedefler', Icons.flag_outlined),
                ),
                Expanded(
                  child: _buildTab(2, 'Görevler', Icons.checklist_outlined),
                ),
                Expanded(
                  child: _buildTab(3, 'Notlar', Icons.note_outlined),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: IndexedStack(
              index: _selectedTab,
              children: [
                _buildOverviewTab(),
                _buildGoalsTab(),
                _buildTasksTab(),
                _buildNotesTab(),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: Container(
        margin: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFB800),
              Color(0xFFFF8C00),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => _navigateToChat(),
            borderRadius: BorderRadius.circular(16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.chat, color: Colors.white, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Lina ile Konuş',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTab(int index, String label, IconData icon) {
    final isSelected = _selectedTab == index;
    final color = _getCategoryColor();

    return GestureDetector(
      onTap: () => setState(() => _selectedTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          border: Border(
            bottom: BorderSide(
              color: isSelected ? color : Colors.transparent,
              width: 2,
            ),
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? color : Colors.grey[400],
              size: 20,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : Colors.grey[400],
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    final color = _getCategoryColor();

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        // Welcome Card
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color,
                color.withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: const Color(0xFF374151),
              width: 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Text(
                    '👋',
                    style: TextStyle(fontSize: 32),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Merhaba!',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.coach.description,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.9),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Stats Cards
        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Bugünkü Odak',
                '2.5 saat',
                Icons.timer_outlined,
                color,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Tamamlanan',
                '8 görev',
                Icons.check_circle_outline,
                color,
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        Row(
          children: [
            Expanded(
              child: _buildStatCard(
                'Aktif Hedefler',
                '3 hedef',
                Icons.flag_outlined,
                color,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildStatCard(
                'Günlük Streak',
                '5 gün',
                Icons.local_fire_department_outlined,
                color,
              ),
            ),
          ],
        ),

        const SizedBox(height: 24),

        // Quick Actions
        const Text(
          'Hızlı Erişim',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 12),

        _buildQuickActionCard(
          'Yeni Hedef Oluştur',
          'Hedeflerini belirle ve planla',
          Icons.add_circle_outline,
          color,
          () {},
        ),
        const SizedBox(height: 8),
        _buildQuickActionCard(
          'Pomodoro Başlat',
          '25 dakikalık odaklanma seansı',
          Icons.timer_outlined,
          color,
          () {},
        ),
        const SizedBox(height: 8),
        _buildQuickActionCard(
          'Günlük Planı Görüntüle',
          'Bugünün görevlerini kontrol et',
          Icons.calendar_today_outlined,
          color,
          () {},
        ),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 12),
          Text(
            value,
            style: TextStyle(
              color: color,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFF9CA3AF),
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActionCard(
    String title,
    String subtitle,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: const Color(0xFF374151),
            width: 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Color(0xFF9CA3AF),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: Colors.grey[400],
              size: 16,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalsTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.flag_outlined,
            size: 80,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          const Text(
            'Henüz hedef eklenmedi',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Lina ile konuşarak hedeflerini oluşturabilirsin',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildTasksTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.checklist_outlined,
            size: 80,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          const Text(
            'Henüz görev eklenmedi',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Lina ile konuşarak görevlerini planlayabilirsin',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildNotesTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.note_outlined,
            size: 80,
            color: Colors.grey[600],
          ),
          const SizedBox(height: 16),
          const Text(
            'Henüz not eklenmedi',
            style: TextStyle(
              fontSize: 16,
              color: Color(0xFF9CA3AF),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Lina ile konuşarak notlarını kaydedebilirsin',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  void _navigateToChat() {
    context.push(AppRoutes.coachChat(widget.coach.id));
  }
}

