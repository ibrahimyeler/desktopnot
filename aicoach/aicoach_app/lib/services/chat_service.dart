import '../models/chat_message.dart';
import '../models/coach.dart';
import 'ai_provider.dart';

/// Service to manage chat conversations
class ChatService {
  final List<ChatMessage> _messages = [];

  ChatService();

  /// Get all messages
  List<ChatMessage> get messages => _messages;

  /// Send a message to the selected AI coach
  Future<String> sendMessage({
    required String message,
    required Coach coach,
    required AIProvider provider,
  }) async {
    // Add user message to history
    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: message,
      isUser: true,
      timestamp: DateTime.now(),
      modelId: coach.id,
    );
    _messages.add(userMessage);

    try {
      final response = await provider.sendMessage(
        message: message,
        conversationHistory: _messages.sublist(0, _messages.length - 1),
        modelId: coach.config['model'] as String?,
        additionalParams: {
          'system': coach.config['systemPrompt'] as String?,
        },
      );

      // Add AI response to history
      final aiMessage = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: response,
        isUser: false,
        timestamp: DateTime.now(),
        modelId: coach.id,
      );
      _messages.add(aiMessage);

      return response;
    } catch (e) {
      // Remove user message if request failed
      _messages.removeLast();
      throw Exception('Failed to send message: $e');
    }
  }

  /// Clear conversation
  void clearMessages() {
    _messages.clear();
  }
}

