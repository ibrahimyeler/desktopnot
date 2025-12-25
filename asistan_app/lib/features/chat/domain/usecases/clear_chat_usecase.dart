import '../repositories/chat_repository.dart';

class ClearChatUseCase {
  final ChatRepository repository;

  ClearChatUseCase(this.repository);

  Future<void> execute() async {
    await repository.clearChatHistory();
  }
}

