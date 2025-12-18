class Review {
  final String id;
  final String placeId;
  final String userId;
  final String userName;
  final String? userAvatarUrl;
  final String comment;
  final double rating;
  final List<String> imageUrls;
  final DateTime createdAt;

  Review({
    required this.id,
    required this.placeId,
    required this.userId,
    required this.userName,
    this.userAvatarUrl,
    required this.comment,
    required this.rating,
    this.imageUrls = const [],
    required this.createdAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'placeId': placeId,
      'userId': userId,
      'userName': userName,
      'userAvatarUrl': userAvatarUrl,
      'comment': comment,
      'rating': rating,
      'imageUrls': imageUrls,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? '',
      placeId: json['placeId'] ?? '',
      userId: json['userId'] ?? '',
      userName: json['userName'] ?? '',
      userAvatarUrl: json['userAvatarUrl'],
      comment: json['comment'] ?? '',
      rating: (json['rating'] ?? 0.0).toDouble(),
      imageUrls: List<String>.from(json['imageUrls'] ?? []),
      createdAt: DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}

