import 'package:flutter/material.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/empty_chat_view.dart';
import '../widgets/message_input_field.dart';
import '../../domain/entities/chat_message.dart';
import '../../domain/repositories/chat_repository.dart';
import '../../domain/usecases/send_message_usecase.dart';
import '../../domain/usecases/get_chat_history_usecase.dart';
import '../../data/repositories/chat_repository_impl.dart';
import '../../../../core/constants/app_constants.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  
  late final ChatRepository _chatRepository;
  late final SendMessageUseCase _sendMessageUseCase;
  late final GetChatHistoryUseCase _getChatHistoryUseCase;
  
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _initializeDependencies();
    _loadChatHistory();
  }

  void _initializeDependencies() {
    _chatRepository = ChatRepositoryImpl();
    _sendMessageUseCase = SendMessageUseCase(_chatRepository);
    _getChatHistoryUseCase = GetChatHistoryUseCase(_chatRepository);
  }

  Future<void> _loadChatHistory() async {
    final history = await _getChatHistoryUseCase.execute();
    setState(() {
      _messages.addAll(history);
    });
    _scrollToBottom();
  }

  Future<void> _sendMessage() async {
    if (_messageController.text.trim().isEmpty || _isLoading) return;

    final userMessageText = _messageController.text.trim();
    _messageController.clear();
    
    setState(() {
      _isLoading = true;
    });

    try {
      // Kullanıcı mesajını hemen göster
      final userMessage = ChatMessage(
        text: userMessageText,
        isUser: true,
        timestamp: DateTime.now(),
        id: DateTime.now().millisecondsSinceEpoch.toString(),
      );

      setState(() {
        _messages.add(userMessage);
      });
      _scrollToBottom();

      // Asistan yanıtını al
      final assistantMessage = await _sendMessageUseCase.execute(userMessageText);

      setState(() {
        _messages.add(assistantMessage);
      });
      _scrollToBottom();
    } catch (e) {
      // Hata durumunda kullanıcıya bilgi ver
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Mesaj gönderilirken bir hata oluştu: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _scrollToBottom() {
    Future.delayed(
      const Duration(milliseconds: AppConstants.scrollDelayMs),
      () {
        if (_scrollController.hasClients) {
          _scrollController.animateTo(
            _scrollController.position.maxScrollExtent,
            duration: const Duration(
              milliseconds: AppConstants.scrollAnimationDurationMs,
            ),
            curve: Curves.easeOut,
          );
        }
      },
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Row(
          children: [
            CircleAvatar(
              radius: AppConstants.avatarRadius,
              backgroundColor: Colors.white,
              child: Icon(Icons.smart_toy, color: Colors.blue, size: 20),
            ),
            SizedBox(width: 12),
            Text(AppConstants.appName),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _messages.isEmpty
                ? const EmptyChatView()
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      return ChatBubble(message: _messages[index]);
                    },
                  ),
          ),
          MessageInputField(
            controller: _messageController,
            onSend: _sendMessage,
          ),
        ],
      ),
    );
  }
}

