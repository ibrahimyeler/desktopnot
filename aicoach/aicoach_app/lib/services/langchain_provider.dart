import 'dart:convert';
import 'package:http/http.dart' as http;
import 'ai_provider.dart';
import '../models/chat_message.dart';

/// LangChain provider implementation
/// This communicates with a backend LangChain API
class LangChainProvider extends AIProvider {
  LangChainProvider({
    required String apiKey,
    this.baseUrl = 'http://localhost:8000/api/langchain',
  }) : super(name: 'LangChain', apiKey: apiKey);

  final String baseUrl;

  @override
  Future<String> sendMessage({
    required String message,
    required List<ChatMessage> conversationHistory,
    String? modelId,
    Map<String, dynamic>? additionalParams,
  }) async {
    final url = Uri.parse('$baseUrl/chat');

    // Convert conversation history to LangChain format
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
      'messages': messages,
      'model': modelId ?? 'gpt-4',
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
        return data['response'] as String? ?? data['content'] as String? ?? '';
      } else {
        throw Exception(
          'LangChain API error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to send message to LangChain: $e');
    }
  }

  /// Execute a LangChain chain
  Future<Map<String, dynamic>> executeChain({
    required String chainId,
    required Map<String, dynamic> inputs,
  }) async {
    final url = Uri.parse('$baseUrl/chains/$chainId/run');

    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'inputs': inputs}),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception(
          'LangChain Chain error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to execute chain: $e');
    }
  }

  /// Run a LangChain agent
  Future<Map<String, dynamic>> runAgent({
    required String agentId,
    required String query,
    List<String>? tools,
  }) async {
    final url = Uri.parse('$baseUrl/agents/$agentId/run');

    try {
      final response = await http.post(
        url,
        headers: {
          'Authorization': 'Bearer $apiKey',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'query': query,
          if (tools != null) 'tools': tools,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception(
          'LangChain Agent error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to run agent: $e');
    }
  }

  /// Search in vector store
  Future<List<Map<String, dynamic>>> searchVectorStore({
    required String vectorStoreId,
    required String query,
    int? k,
  }) async {
    final url = Uri.parse('$baseUrl/vector-stores/$vectorStoreId/search');

    try {
      final response = await http.get(
        url.replace(queryParameters: {
          'query': query,
          if (k != null) 'k': k.toString(),
        }),
        headers: {
          'Authorization': 'Bearer $apiKey',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['results'] ?? []);
      } else {
        throw Exception(
          'LangChain Vector Store error: ${response.statusCode} - ${response.body}',
        );
      }
    } catch (e) {
      throw Exception('Failed to search vector store: $e');
    }
  }

  @override
  Future<List<String>> getAvailableModels() async {
    try {
      final url = Uri.parse('$baseUrl/models');
      final response = await http.get(
        url,
        headers: {
          'Authorization': 'Bearer $apiKey',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<String>.from(data['models'] ?? []);
      }
      return [];
    } catch (e) {
      // Return default models if API call fails
      return [
        'gpt-4',
        'gpt-3.5-turbo',
        'claude-3-opus',
        'claude-3-sonnet',
        'gemini-pro',
      ];
    }
  }

  @override
  Future<bool> validateApiKey() async {
    try {
      final url = Uri.parse('$baseUrl/health');
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

