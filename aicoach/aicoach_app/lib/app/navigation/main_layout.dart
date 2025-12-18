import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../widgets/expandable_fab.dart';
import 'route_names.dart';

/// Main layout with bottom navigation bar
class MainLayout extends StatelessWidget {
  final StatefulNavigationShell navShell;

  const MainLayout({
    super.key,
    required this.navShell,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navShell,
      bottomNavigationBar: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.bottomCenter,
        children: [
          Container(
            decoration: const BoxDecoration(
              color: Color(0xFF1F2937),
              border: Border(
                top: BorderSide(
                  color: Color(0xFF374151),
                  width: 1,
                ),
              ),
            ),
            child: SafeArea(
              child: Container(
                height: 70,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Expanded(
                      child: _buildNavItem(
                        context,
                        0,
                        Icons.home_outlined,
                        Icons.home,
                        'Ana Sayfa',
                      ),
                    ),
                    Expanded(
                      child: _buildNavItem(
                        context,
                        1,
                        Icons.psychology_outlined,
                        Icons.psychology,
                        'Koçlarım',
                      ),
                    ),
                    // FAB placeholder
                    const SizedBox(width: 68),
                    Expanded(
                      child: _buildNavItem(
                        context,
                        2,
                        Icons.group_outlined,
                        Icons.group,
                        'Topluluk',
                      ),
                    ),
                    Expanded(
                      child: _buildNavItem(
                        context,
                        3,
                        Icons.person_outline,
                        Icons.person,
                        'Profil',
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // FAB ortada, "Koçlarım" ve "Topluluk" arasında
          Positioned(
            bottom: 35,
            left: 0,
            right: 0,
            child: Center(
              child: Transform.translate(
                offset: const Offset(0, -38),
                child: ExpandableFab(
                  actions: [
                    FabAction(
                      icon: Icons.task_alt,
                      label: 'Görev Ekle',
                      onPressed: () {
                        context.push(AppRoutes.createTask);
                      },
                    ),
                    FabAction(
                      icon: Icons.note_add,
                      label: 'Not Ekle',
                      onPressed: () {
                        context.push(AppRoutes.createNote);
                      },
                    ),
                    FabAction(
                      icon: Icons.flag,
                      label: 'Hedef Ekle',
                      onPressed: () {
                        context.push(AppRoutes.createGoal);
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    int index,
    IconData icon,
    IconData selectedIcon,
    String label,
  ) {
    final isSelected = navShell.currentIndex == index;
    const selectedColor = Color(0xFFFFB800);
    const unselectedColor = Color(0xFF9CA3AF);

    return GestureDetector(
      onTap: () {
        navShell.goBranch(
          index,
          initialLocation: index == navShell.currentIndex,
        );
      },
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            curve: Curves.easeInOut,
            child: Icon(
              isSelected ? selectedIcon : icon,
              size: isSelected ? 26 : 24,
              color: isSelected ? selectedColor : unselectedColor,
            ),
          ),
          const SizedBox(height: 4),
          AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: TextStyle(
              fontSize: isSelected ? 11 : 10,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
              color: isSelected ? selectedColor : unselectedColor,
            ),
            child: Text(label),
          ),
        ],
      ),
    );
  }
}

