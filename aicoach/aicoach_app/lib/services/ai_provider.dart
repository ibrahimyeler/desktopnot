import 'dart:async';
import '../models/chat_message.dart';

/// Abstract base class for AI providers
abstract class AIProvider {
  final String name;
  final String apiKey;

  AIProvider({
    required this.name,
    required this.apiKey,
  });

  /// Send a message to the AI and get a response
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  });

  /// Get the list of available models for this provider
  Future<List<String>> getAvailableModels();

  /// Validate if the API key is valid
  Future<bool> validateApiKey();
}

