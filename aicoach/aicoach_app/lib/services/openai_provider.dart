import 'dart:convert';
import 'package:http/http.dart' as http;
import 'ai_provider.dart';
import '../models/chat_message.dart';

/// OpenAI provider implementation
class OpenAIProvider extends AIProvider {
  OpenAIProvider({required String apiKey})
      : super(name: 'OpenAI', apiKey: apiKey);

  final String baseUrl = 'https://api.openai.com/v1';

  @override
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  }) async {
    final url = Uri.parse('$baseUrl/chat/completions');

    // Convert conversation history to OpenAI format
    final messages = conversationHistory
        .map((msg) => {
              'role': msg.isUser ? 'user' : 'assistant',
              'content': msg.content,
            })
        .toList();

    // Add the current message
    messages.add({
      'role': 'user',
      'content': message,
    });

    final body = {
      'model': modelId ?? 'gpt-4',
      'messages': messages,
      'temperature': 0.7,
      'max_tokens': 2000,
      if (additionalParams != null) ...additionalParams,
    };

    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['choices'][0]['message']['content'] as String;
      } else {
        throw Exception(
          'OpenAI API error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to send message to OpenAI: $e');
    }
  }

  @override
  Future<List<String>> getAvailableModels() async {
    // Return common OpenAI models
    return [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k',
    ];
  }

  @override
  Future<bool> validateApiKey() async {
    try {
      final url = Uri.parse('$baseUrl/models');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $apiKey',
        },
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}

