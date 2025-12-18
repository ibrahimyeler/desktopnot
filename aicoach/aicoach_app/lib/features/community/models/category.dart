import 'package:flutter/material.dart';

/// Category model for community posts
class Category {
  final String id;
  final String name;
  final String emoji;
  final String iconName;
  final Color primaryColor;
  final Color secondaryColor;
  final int memberCount;
  final int postCount;
  final String description;
  final bool isFollowing;

  Category({
    required this.id,
    required this.name,
    required this.emoji,
    required this.iconName,
    required this.primaryColor,
    required this.secondaryColor,
    this.memberCount = 0,
    this.postCount = 0,
    this.description = '',
    this.isFollowing = false,
  });

  /// Convert to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'emoji': emoji,
      'iconName': iconName,
      'primaryColor': primaryColor.value,
      'secondaryColor': secondaryColor.value,
      'memberCount': memberCount,
      'postCount': postCount,
      'description': description,
      'isFollowing': isFollowing,
    };
  }

  /// Create from JSON
  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      emoji: json['emoji'] as String,
      iconName: json['iconName'] as String,
      primaryColor: Color(json['primaryColor'] as int),
      secondaryColor: Color(json['secondaryColor'] as int),
      memberCount: json['memberCount'] as int? ?? 0,
      postCount: json['postCount'] as int? ?? 0,
      description: json['description'] as String? ?? '',
      isFollowing: json['isFollowing'] as bool? ?? false,
    );
  }

  /// Create copy with updated values
  Category copyWith({
    String? id,
    String? name,
    String? emoji,
    String? iconName,
    Color? primaryColor,
    Color? secondaryColor,
    int? memberCount,
    int? postCount,
    String? description,
    bool? isFollowing,
  }) {
    return Category(
      id: id ?? this.id,
      name: name ?? this.name,
      emoji: emoji ?? this.emoji,
      iconName: iconName ?? this.iconName,
      primaryColor: primaryColor ?? this.primaryColor,
      secondaryColor: secondaryColor ?? this.secondaryColor,
      memberCount: memberCount ?? this.memberCount,
      postCount: postCount ?? this.postCount,
      description: description ?? this.description,
      isFollowing: isFollowing ?? this.isFollowing,
    );
  }
}

