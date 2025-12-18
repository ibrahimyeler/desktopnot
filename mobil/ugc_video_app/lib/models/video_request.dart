import 'dart:io';

class VideoRequest {
  final String prompt;
  final File? productImage;
  final DateTime createdAt;
  String? videoUrl; // Statik tasarım için
  bool isProcessing;
  bool isCompleted;

  VideoRequest({
    required this.prompt,
    this.productImage,
    required this.createdAt,
    this.videoUrl,
    this.isProcessing = false,
    this.isCompleted = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'prompt': prompt,
      'productImagePath': productImage?.path,
      'createdAt': createdAt.toIso8601String(),
      'videoUrl': videoUrl,
      'isProcessing': isProcessing,
      'isCompleted': isCompleted,
    };
  }
}

