import 'package:flutter/material.dart';

/// Profile Settings için özel list item widget'ı
class ProfileSettingsItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool showTrailing;
  final Color? textColor;
  final Function(BuildContext)? onTap;

  const ProfileSettingsItem({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.showTrailing = true,
    this.textColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = textColor ?? Theme.of(context).colorScheme.primary;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: color,
            size: 22,
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: textColor ?? Colors.white,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(fontSize: 12, color: Colors.grey[400]),
        ),
        trailing: showTrailing
            ? Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFF374151),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Icon(Icons.chevron_right, size: 16, color: Colors.grey[400]),
              )
            : null,
        onTap: onTap != null ? () => onTap!(context) : null,
      ),
    );
  }
}

