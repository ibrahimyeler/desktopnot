import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_repository.dart';

class ChatRepositoryImpl implements ChatRepository {
  final List<ChatMessage> _messages = [];

  @override
  Future<String> sendMessage(String userMessage) async {
    // Simüle edilmiş gecikme
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Basit bir yanıt üretici - daha sonra gerçek AI entegrasyonu eklenebilir
    return _generateResponse(userMessage);
  }

  String _generateResponse(String userMessage) {
    final lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.contains('merhaba') || lowerMessage.contains('selam')) {
      return 'Merhaba! Size nasıl yardımcı olabilirim?';
    } else if (lowerMessage.contains('nasılsın')) {
      return 'Teşekkür ederim, iyiyim! Siz nasılsınız?';
    } else if (lowerMessage.contains('teşekkür') || lowerMessage.contains('sağol')) {
      return 'Rica ederim! Başka bir şey için yardımcı olabilir miyim?';
    } else if (lowerMessage.contains('görüşürüz') || lowerMessage.contains('bye')) {
      return 'Görüşmek üzere! İyi günler!';
    } else {
      return 'Anladım. "$userMessage" hakkında daha fazla bilgi verebilir misiniz?';
    }
  }

  @override
  Future<List<ChatMessage>> getChatHistory() async {
    return List.unmodifiable(_messages);
  }

  @override
  Future<void> saveMessage(ChatMessage message) async {
    _messages.add(message);
  }

  @override
  Future<void> clearChatHistory() async {
    _messages.clear();
  }
}

