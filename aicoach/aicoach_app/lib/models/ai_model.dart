/// AI Model configuration
class AIModel {
  final String id;
  final String name;
  final String description;
  final String provider; // 'openai', 'anthropic', 'google', etc.
  final bool isActive;
  final Map<String, dynamic> config;

  AIModel({
    required this.id,
    required this.name,
    required this.description,
    required this.provider,
    this.isActive = true,
    this.config = const {},
  });

  factory AIModel.fromJson(Map<String, dynamic> json) {
    return AIModel(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      provider: json['provider'] as String,
      isActive: json['isActive'] as bool? ?? true,
      config: json['config'] as Map<String, dynamic>? ?? {},
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'provider': provider,
      'isActive': isActive,
      'config': config,
    };
  }

  AIModel copyWith({
    String? id,
    String? name,
    String? description,
    String? provider,
    bool? isActive,
    Map<String, dynamic>? config,
  }) {
    return AIModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      provider: provider ?? this.provider,
      isActive: isActive ?? this.isActive,
      config: config ?? this.config,
    );
  }
}

