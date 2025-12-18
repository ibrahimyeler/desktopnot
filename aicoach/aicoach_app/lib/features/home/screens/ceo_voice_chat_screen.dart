import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// CEO Voice Chat Screen - Whisper STT → CEO model → TTS yanıt
class CeoVoiceChatScreen extends StatefulWidget {
  const CeoVoiceChatScreen({super.key});

  @override
  State<CeoVoiceChatScreen> createState() => _CeoVoiceChatScreenState();
}

class _CeoVoiceChatScreenState extends State<CeoVoiceChatScreen>
    with SingleTickerProviderStateMixin {
  bool _isRecording = false;
  bool _isProcessing = false;
  String _transcript = '';
  String _aiResponse = '';
  Timer? _recordingTimer;
  Duration _recordingDuration = Duration.zero;
  late AnimationController _waveformController;
  final List<Map<String, dynamic>> _history = [];

  @override
  void initState() {
    super.initState();
    _waveformController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _recordingTimer?.cancel();
    _waveformController.dispose();
    super.dispose();
  }

  void _startRecording() {
    setState(() {
      _isRecording = true;
      _transcript = '';
      _recordingDuration = Duration.zero;
    });

    // TODO: Start audio recording with Whisper STT
    // await _audioRecorder.start();

    _recordingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _recordingDuration = Duration(seconds: timer.tick);
      });
    });
  }

  Future<void> _stopRecording() async {
    _recordingTimer?.cancel();
    
    setState(() {
      _isRecording = false;
      _isProcessing = true;
    });

    try {
      // TODO: Stop recording and send to backend
      // final audioFile = await _audioRecorder.stop();
      // final transcript = await _sendToWhisper(audioFile);
      // final response = await _sendToCeoModel(transcript);
      // final audioResponse = await _sendToTTS(response);
      
      // Mock for development
      await Future.delayed(const Duration(seconds: 2));
      
      setState(() {
        _transcript = 'Bugünün planını hazırla ve odaklanmam gereken görevleri belirle';
        _aiResponse = 'Anladım! Bugün için 3 kritik görev belirledim. İlk olarak proje raporunu tamamlamanız gerekiyor. Ardından İngilizce speaking practice yapabilirsiniz. Son olarak haftalık hedeflerinizi gözden geçirebilirsiniz.';
        _isProcessing = false;
        
        _history.add({
          'transcript': _transcript,
          'response': _aiResponse,
          'timestamp': DateTime.now(),
        });
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isProcessing = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
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
        title: const Text(
          'CEO Voice Chat',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline, color: LoginColors.textPrimary),
            onPressed: () {
              context.pop();
              context.push(AppRoutes.ceoCoachChat);
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // History
          if (_history.isNotEmpty)
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: _history.length,
                itemBuilder: (context, index) {
                  final item = _history[index];
                  return _buildHistoryItem(item);
                },
              ),
            )
          else
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.mic,
                      size: 80,
                      color: LoginColors.textSecondary.withOpacity(0.5),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Sesli sohbet başlat',
                      style: TextStyle(
                        color: LoginColors.textSecondary,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // Current transcript
          if (_transcript.isNotEmpty && !_isProcessing)
            Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: LoginColors.mediumGray,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Sizin Mesajınız:',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _transcript,
                    style: const TextStyle(
                      color: LoginColors.textPrimary,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

          // AI Response
          if (_aiResponse.isNotEmpty && !_isProcessing)
            Container(
              padding: const EdgeInsets.all(16),
              margin: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                gradient: LoginColors.orangeGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'CEO Coach:',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _aiResponse,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

          // Processing indicator
          if (_isProcessing)
            Container(
              padding: const EdgeInsets.all(24),
              child: const Column(
                children: [
                  CircularProgressIndicator(
                    color: LoginColors.orangeBright,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'İşleniyor...',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),

          // Microphone button
          Container(
            padding: const EdgeInsets.all(32),
            child: Column(
              children: [
                GestureDetector(
                  onTap: _isRecording ? _stopRecording : _startRecording,
                  child: AnimatedBuilder(
                    animation: _waveformController,
                    builder: (context, child) {
                      return Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          gradient: _isRecording
                              ? LoginColors.orangeGradient
                              : LinearGradient(
                                  colors: [
                                    LoginColors.mediumGray,
                                    LoginColors.mediumGray,
                                  ],
                                ),
                          shape: BoxShape.circle,
                          boxShadow: _isRecording
                              ? [
                                  BoxShadow(
                                    color: LoginColors.orangeBright.withOpacity(
                                      0.3 + (_waveformController.value * 0.2),
                                    ),
                                    blurRadius: 20,
                                    spreadRadius: 5,
                                  ),
                                ]
                              : null,
                        ),
                        child: Icon(
                          _isRecording ? Icons.stop : Icons.mic,
                          size: 40,
                          color: _isRecording ? Colors.white : LoginColors.textPrimary,
                        ),
                      );
                    },
                  ),
                ),
                if (_isRecording) ...[
                  const SizedBox(height: 16),
                  Text(
                    _formatDuration(_recordingDuration),
                    style: const TextStyle(
                      color: LoginColors.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      fontFeatures: [FontFeature.tabularFigures()],
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Kayıt yapılıyor...',
                    style: TextStyle(
                      color: LoginColors.textSecondary,
                      fontSize: 14,
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryItem(Map<String, dynamic> item) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: LoginColors.mediumGray,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              item['transcript'] as String,
              style: const TextStyle(
                color: LoginColors.textPrimary,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: LoginColors.orangeGradient,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              item['response'] as String,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

