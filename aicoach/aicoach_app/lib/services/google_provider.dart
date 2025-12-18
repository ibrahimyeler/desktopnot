import 'dart:convert';
import 'package:http/http.dart' as http;
import 'ai_provider.dart';
import '../models/chat_message.dart';

/// Google (Gemini) provider implementation
class GoogleProvider extends AIProvider {
  GoogleProvider({required String apiKey})
      : super(name: 'Google', apiKey: apiKey);

  final String baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  @override
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  }) async {
    final url = Uri.parse(
      '$baseUrl/${modelId ?? 'gemini-pro'}:generateContent?key=$apiKey',
    );

    // Convert conversation history to Google format
    final contents = conversationHistory
        .map((msg) => {
              'role': msg.isUser ? 'user' : 'model',
              'parts': [
                {'text': msg.content}
              ],
            })
        .toList();

    // Add the current message
    contents.add({
      'role': 'user',
      'parts': [
        {'text': message}
      ],
    });

    final body = {
      'contents': contents,
      'generationConfig': {
        'temperature': 0.7,
        'maxOutputTokens': 2048,
      },
    };

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['candidates'][0]['content']['parts'][0]['text'] as String;
      } else {
        throw Exception(
          'Google API error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to send message to Google: $e');
    }
  }

  @override
  Future<List<String>> getAvailableModels() async {
    // Return common Google models
    return [
      'gemini-pro',
      'gemini-pro-vision',
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

