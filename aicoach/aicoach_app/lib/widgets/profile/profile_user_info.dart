import 'package:flutter/material.dart';

/// Kullanıcı bilgileri widget'ı (İsim ve Email)
class ProfileUserInfo extends StatelessWidget {
  final String name;
  final String email;

  const ProfileUserInfo({
    super.key,
    required this.name,
    required this.email,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          name,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          email,
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey[400],
          ),
        ),
      ],
    );
  }
}

