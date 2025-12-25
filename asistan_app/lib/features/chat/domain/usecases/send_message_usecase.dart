import '../entities/chat_message.dart';
import '../repositories/chat_repository.dart';

class SendMessageUseCase {
  final ChatRepository repository;

  SendMessageUseCase(this.repository);

  Future<ChatMessage> execute(String userMessage) async {
    // Kullanıcı mesajını kaydet
    final userChatMessage = ChatMessage(
      text: userMessage,
      isUser: true,
      timestamp: DateTime.now(),
      id: DateTime.now().millisecondsSinceEpoch.toString(),
    );
    
    await repository.saveMessage(userChatMessage);

    // Asistan yanıtını al
    final assistantResponse = await repository.sendMessage(userMessage);

    // Asistan mesajını oluştur
    final assistantMessage = ChatMessage(
      text: assistantResponse,
      isUser: false,
      timestamp: DateTime.now(),
      id: DateTime.now().millisecondsSinceEpoch.toString(),
    );

    await repository.saveMessage(assistantMessage);

    return assistantMessage;
  }
}

