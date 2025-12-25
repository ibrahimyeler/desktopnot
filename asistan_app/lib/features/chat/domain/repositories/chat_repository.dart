import '../entities/chat_message.dart';

abstract class ChatRepository {
  Future<String> sendMessage(String userMessage);
  Future<List<ChatMessage>> getChatHistory();
  Future<void> saveMessage(ChatMessage message);
  Future<void> clearChatHistory();
}

