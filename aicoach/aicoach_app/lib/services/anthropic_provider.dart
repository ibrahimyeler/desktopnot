import 'dart:convert';
import 'package:http/http.dart' as http;
import 'ai_provider.dart';
import '../models/chat_message.dart';

/// Anthropic (Claude) provider implementation
class AnthropicProvider extends AIProvider {
  AnthropicProvider({required String apiKey})
      : super(name: 'Anthropic', apiKey: apiKey);

  final String baseUrl = 'https://api.anthropic.com/v1';

  @override
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  }) async {
    final url = Uri.parse('$baseUrl/messages');

    // Convert conversation history to Anthropic format
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
      'model': modelId ?? 'claude-3-opus-20240229',
      'max_tokens': 2048,
      'messages': messages,
      if (additionalParams != null) ...additionalParams,
    };

    try {
      final response = await http.post(
        url,
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['content'][0]['text'] as String;
      } else {
        throw Exception(
          'Anthropic API error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to send message to Anthropic: $e');
    }
  }

  @override
  Future<List<String>> getAvailableModels() async {
    // Return common Anthropic models
    return [
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307',
    ];
  }

  @override
  Future<bool> validateApiKey() async {
    try {
      // Simple validation by checking the API key format
      return apiKey.isNotEmpty;
    } catch (e) {
      return false;
    }
  }
}

