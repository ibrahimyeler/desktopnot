import 'package:flutter/material.dart';

class CustomDrawer extends StatefulWidget {
  final VoidCallback onClose;
  final Function(int)? onMenuItemTap;

  const CustomDrawer({
    super.key,
    required this.onClose,
    this.onMenuItemTap,
  });

  @override
  State<CustomDrawer> createState() => _CustomDrawerState();
}

class _CustomDrawerState extends State<CustomDrawer>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(-1.0, 0.0),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: GestureDetector(
        onTap: widget.onClose,
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Container(
            color: Colors.black54,
            child: GestureDetector(
              onTap: () {}, // Drawer içine tıklanınca kapanmasın
              child: Align(
                alignment: Alignment.centerLeft,
                child: SlideTransition(
                  position: _slideAnimation,
                  child: Container(
                    width: MediaQuery.of(context).size.width * 0.75,
                    height: double.infinity,
                    decoration: const BoxDecoration(
                      color: Color(0xFF1E1E1E),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black26,
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        // Drawer Header - Status bar'ın altından başlar
                        Container(
                          padding: EdgeInsets.only(
                            top: MediaQuery.of(context).padding.top + 10,
                            bottom: 10,
                            left: 20,
                            right: 20,
                          ),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                Theme.of(context).colorScheme.primary,
                                Theme.of(context).colorScheme.primary.withOpacity(0.7),
                              ],
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Menü',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.close, color: Colors.white),
                                onPressed: widget.onClose,
                              ),
                            ],
                          ),
                        ),
                        // Drawer Content
                        Expanded(
                          child: ListView(
                            padding: EdgeInsets.zero,
                            children: [
                              _buildMenuItem(
                                context,
                                icon: Icons.home,
                                title: 'Ana Sayfa',
                                onTap: () {
                                  widget.onMenuItemTap?.call(0);
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.explore,
                                title: 'Keşfet',
                                onTap: () {
                                  widget.onMenuItemTap?.call(1);
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.map,
                                title: 'Harita',
                                onTap: () {
                                  widget.onMenuItemTap?.call(2);
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.people,
                                title: 'Sosyal',
                                onTap: () {
                                  widget.onMenuItemTap?.call(3);
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.person,
                                title: 'Profil',
                                onTap: () {
                                  widget.onMenuItemTap?.call(4);
                                  widget.onClose();
                                },
                              ),
                              Divider(color: Colors.grey[800], height: 32),
                              _buildMenuItem(
                                context,
                                icon: Icons.settings,
                                title: 'Ayarlar',
                                onTap: () {
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.info,
                                title: 'Hakkında',
                                onTap: () {
                                  widget.onClose();
                                },
                              ),
                              _buildMenuItem(
                                context,
                                icon: Icons.help,
                                title: 'Yardım',
                                onTap: () {
                                  widget.onClose();
                                },
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey[400]),
      title: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 16,
        ),
      ),
      trailing: Icon(Icons.chevron_right, color: Colors.grey[600]),
      onTap: onTap,
    );
  }
}
