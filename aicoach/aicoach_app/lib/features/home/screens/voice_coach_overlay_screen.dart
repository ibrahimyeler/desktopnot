import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../widgets/voice_overlay/voice_microphone_button.dart';
import '../widgets/voice_overlay/voice_transcript_display.dart';

/// CEO Voice Coach Overlay - Full screen voice interaction
class VoiceCoachOverlayScreen extends StatefulWidget {
  const VoiceCoachOverlayScreen({super.key});

  @override
  State<VoiceCoachOverlayScreen> createState() => _VoiceCoachOverlayScreenState();
}

class _VoiceCoachOverlayScreenState extends State<VoiceCoachOverlayScreen>
    with SingleTickerProviderStateMixin {
  bool _isRecording = false;
  bool _isProcessing = false;
  String _transcript = '';
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _handleMicrophoneTap() {
    setState(() {
      if (_isRecording) {
        _isRecording = false;
        _isProcessing = true;
        // Simulate processing
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            setState(() {
              _isProcessing = false;
              _transcript = 'Merhaba! Bugün nasıl yardımcı olabilirim?';
            });
          }
        });
      } else {
        _isRecording = true;
        _transcript = '';
        _isProcessing = false;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => context.pop(),
                  ),
                  const Expanded(
                    child: Text(
                      'Sesli Koç',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48), // Balance close button
                ],
              ),
            ),

            // Main content
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // AI Avatar/Icon
                  AnimatedBuilder(
                    animation: _pulseController,
                    builder: (context, child) {
                      return Transform.scale(
                        scale: _isRecording
                            ? 1.0 + (_pulseController.value * 0.1)
                            : 1.0,
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            gradient: RadialGradient(
                              colors: [
                                const Color(0xFFFFB800).withOpacity(0.3),
                                const Color(0xFFFFB800).withOpacity(0.0),
                              ],
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              '🧠',
                              style: TextStyle(fontSize: 64),
                            ),
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 40),

                  // Status text
                  Text(
                    _isRecording
                        ? 'Dinliyorum...'
                        : _isProcessing
                            ? 'İşleniyor...'
                            : 'Mikrofonu açmak için dokunun',
                    style: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(height: 60),

                  // Transcript display
                  VoiceTranscriptDisplay(
                    transcript: _transcript,
                    isProcessing: _isProcessing,
                  ),

                  const Spacer(),

                  // Microphone button
                  VoiceMicrophoneButton(
                    isRecording: _isRecording,
                    onTap: _handleMicrophoneTap,
                  ),

                  const SizedBox(height: 60),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

