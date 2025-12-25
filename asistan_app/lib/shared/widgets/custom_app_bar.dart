import 'package:flutter/material.dart';
import '../../core/constants/app_constants.dart';

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final List<Widget>? actions;

  const CustomAppBar({
    super.key,
    required this.title,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Row(
        children: [
          CircleAvatar(
            radius: AppConstants.avatarRadius,
            backgroundColor: Colors.white,
            child: const Icon(Icons.smart_toy, color: Colors.blue, size: 20),
          ),
          const SizedBox(width: 12),
          Text(title),
        ],
      ),
      actions: actions,
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}

