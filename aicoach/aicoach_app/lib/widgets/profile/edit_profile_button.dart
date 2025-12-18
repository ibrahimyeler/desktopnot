import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../app/navigation/route_names.dart';

/// Profili Düzenle button widget'ı
class EditProfileButton extends StatelessWidget {
  final String text;

  const EditProfileButton({
    super.key,
    this.text = 'Profili Düzenle',
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => context.push(AppRoutes.editProfile),
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFF374151),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: const Color(0xFF4B5563),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.edit,
              size: 14,
              color: Colors.grey[300],
            ),
            const SizedBox(width: 6),
            Text(
              text,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.grey[300],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

