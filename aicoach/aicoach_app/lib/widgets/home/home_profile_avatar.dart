import 'package:flutter/material.dart';
import '../../features/profile/screens/profile_screen.dart';
import 'home_colors.dart';

/// Home header için profil avatarı
class HomeProfileAvatar extends StatelessWidget {
  final String? imageUrl;

  const HomeProfileAvatar({
    super.key,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProfileScreen(),
          ),
        );
      },
      child: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          gradient: HomeColors.orangeGradient,
          shape: BoxShape.circle,
          border: Border.all(
            color: HomeColors.borderColor,
            width: 2,
          ),
        ),
        child: imageUrl != null
            ? ClipOval(
                child: Image.network(
                  imageUrl!,
                  fit: BoxFit.cover,
                ),
              )
            : const Icon(
                Icons.person,
                color: Colors.white,
                size: 22,
              ),
      ),
    );
  }
}

