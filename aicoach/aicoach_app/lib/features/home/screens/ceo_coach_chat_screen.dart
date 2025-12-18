import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// CEO Coach Chat Screen - Tüm koçların yöneticisi, Assistant Orchestrator
class CeoCoachChatScreen extends StatefulWidget {
  const CeoCoachChatScreen({super.key});

  @override
  State<CeoCoachChatScreen> createState() => _CeoCoachChatScreenState();
}

class _CeoCoachChatScreenState extends State<CeoCoachChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Map<String, dynamic>> _messages = [];
  bool _isLoading = false;

  final List<String> _smartSuggestions = [
    'Bugünün planını çıkar',
    'Hedeflerimi güncelle',
    'Speaking practice başlat',
    'Focus mode başlat',
    'Günlük özetimi göster',
    'İngilizce seviyemi kontrol et',
  ];

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  void _addWelcomeMessage() {
    _messages.add({
      'text': 'Merhaba! Ben CEO Coach, tüm koçlarınızı yöneten akıllı asistanım. Size nasıl yardımcı olabilirim?',
      'isUser': false,
      'mode': 'CEO',
      'timestamp': DateTime.now(),
    });
  }

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'text': text,
        'isUser': true,
        'timestamp': DateTime.now(),
      });
      _isLoading = true;
    });

    _messageController.clear();
    _scrollToBottom();

    // TODO: Send to backend
    // final response = await _sendToCeoOrchestrator(text);
    
    // Mock response
    await Future.delayed(const Duration(seconds: 1));

    if (!mounted) return;

    setState(() {
      _messages.add({
        'text': _generateMockResponse(text),
        'isUser': false,
        'mode': _detectMode(text),
        'timestamp': DateTime.now(),
      });
      _isLoading = false;
    });

    _scrollToBottom();
  }

  String _generateMockResponse(String userMessage) {
    final lower = userMessage.toLowerCase();
    if (lower.contains('plan') || lower.contains('günlük')) {
      return 'Bugünün planınızı hazırlıyorum. Günlük rutininize göre 3 kritik görev belirledim. Detayları görmek ister misiniz?';
    } else if (lower.contains('hedef') || lower.contains('goal')) {
      return 'Hedeflerinizi kontrol ediyorum. Şu anda 2 aktif hedefiniz var. Hangi hedefi güncellemek istersiniz?';
    } else if (lower.contains('speaking') || lower.contains('ingilizce')) {
      return 'English Coach\'u hazırlıyorum. Speaking practice için hazır mısınız?';
    } else if (lower.contains('focus') || lower.contains('odak')) {
      return 'Focus Coach\'u aktif ediyorum. Derin çalışma moduna geçmek ister misiniz?';
    } else {
      return 'Anladım. Size en uygun koçla bağlantı kuruyorum. Biraz bekleyin...';
    }
  }

  String _detectMode(String message) {
    final lower = message.toLowerCase();
    if (lower.contains('ingilizce') || lower.contains('english') || lower.contains('speaking')) {
      return 'English Mode';
    } else if (lower.contains('focus') || lower.contains('odak')) {
      return 'Focus Mode';
    } else if (lower.contains('plan') || lower.contains('görev')) {
      return 'Planning Mode';
    }
    return 'CEO';
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
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
      backgroundColor: LoginColors.darkGray,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: LoginColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                gradient: LoginColors.orangeGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.psychology,
                color: Colors.white,
                size: 24,
              ),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CEO Coach',
                  style: TextStyle(
                    color: LoginColors.textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Tüm koçlarınızı yöneten asistan',
                  style: TextStyle(
                    color: LoginColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.mic, color: LoginColors.orangeBright),
            onPressed: () => context.push(AppRoutes.ceoVoiceChat),
          ),
          IconButton(
            icon: const Icon(Icons.more_vert, color: LoginColors.textPrimary),
            onPressed: () => _showAttachmentMenu(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Smart suggestions
          if (_messages.length <= 1)
            Container(
              height: 100,
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _smartSuggestions.length,
                itemBuilder: (context, index) {
                  final suggestion = _smartSuggestions[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ActionChip(
                      label: Text(suggestion),
                      onPressed: () => _sendMessage(suggestion),
                      backgroundColor: LoginColors.mediumGray,
                      labelStyle: const TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 12,
                      ),
                      side: BorderSide(
                        color: LoginColors.orangeBright.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                  );
                },
              ),
            ),

          // Messages
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: CircularProgressIndicator(
                        color: LoginColors.orangeBright,
                      ),
                    ),
                  );
                }

                final message = _messages[index];
                return _buildMessageBubble(message);
              },
            ),
          ),

          // Input area
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: LoginColors.mediumGray,
              border: Border(
                top: BorderSide(
                  color: LoginColors.lightGray,
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    style: const TextStyle(color: LoginColors.textPrimary),
                    decoration: InputDecoration(
                      hintText: 'Mesajınızı yazın...',
                      hintStyle: const TextStyle(color: LoginColors.textSecondary),
                      filled: true,
                      fillColor: LoginColors.darkGray,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                    onSubmitted: _sendMessage,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    gradient: LoginColors.orangeGradient,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: () => _sendMessage(_messageController.text),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isUser = message['isUser'] as bool;
    final text = message['text'] as String;
    final mode = message['mode'] as String?;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                gradient: LoginColors.orangeGradient,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.psychology,
                size: 18,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isUser
                    ? LoginColors.orangeBright
                    : LoginColors.mediumGray,
                borderRadius: BorderRadius.circular(20).copyWith(
                  bottomRight: isUser ? const Radius.circular(4) : null,
                  bottomLeft: !isUser ? const Radius.circular(4) : null,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (mode != null && !isUser)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: LoginColors.orangeBright.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          mode,
                          style: const TextStyle(
                            color: LoginColors.orangeBright,
                            fontSize: 10,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  Text(
                    text,
                    style: TextStyle(
                      color: isUser ? Colors.white : LoginColors.textPrimary,
                      fontSize: 14,
                      height: 1.4,
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isUser) ...[
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: LoginColors.lightGray,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.person,
                size: 18,
                color: LoginColors.textPrimary,
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _showAttachmentMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: LoginColors.mediumGray,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildAttachmentOption(
              context,
              Icons.task_alt,
              'Görev Oluştur',
              () {
                context.pop();
                context.push(AppRoutes.createTask);
              },
            ),
            const SizedBox(height: 12),
            _buildAttachmentOption(
              context,
              Icons.assessment,
              'Rapor Oluştur',
              () {
                context.pop();
                context.push(AppRoutes.profileAnalytics);
              },
            ),
            const SizedBox(height: 12),
            _buildAttachmentOption(
              context,
              Icons.calendar_today,
              'Plan Oluştur',
              () {
                context.pop();
                context.push(AppRoutes.dailyPlan);
              },
            ),
            const SizedBox(height: 12),
            _buildAttachmentOption(
              context,
              Icons.mic,
              'Ses Gönder',
              () {
                context.pop();
                context.push(AppRoutes.ceoVoiceChat);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttachmentOption(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: LoginColors.darkGray,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(icon, color: LoginColors.orangeBright, size: 24),
            const SizedBox(width: 16),
            Text(
              label,
              style: const TextStyle(
                color: LoginColors.textPrimary,
                fontSize: 16,
              ),
            ),
            const Spacer(),
            const Icon(
              Icons.arrow_forward_ios,
              size: 16,
              color: LoginColors.textSecondary,
            ),
          ],
        ),
      ),
    );
  }
}

