import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'dart:async';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// English Coach Speaking Test - AI'ye kısa ses kaydı gönderilir
class EnglishCoachSpeakingTestScreen extends StatefulWidget {
  const EnglishCoachSpeakingTestScreen({super.key});

  @override
  State<EnglishCoachSpeakingTestScreen> createState() => _EnglishCoachSpeakingTestScreenState();
}

class _EnglishCoachSpeakingTestScreenState extends State<EnglishCoachSpeakingTestScreen> {
  bool _isRecording = false;
  bool _isAnalyzing = false;
  Duration _recordingDuration = Duration.zero;
  Timer? _timer;
  Map<String, dynamic>? _results;

  void _startRecording() {
    setState(() {
      _isRecording = true;
      _recordingDuration = Duration.zero;
    });

    // TODO: Start audio recording
    // await _audioRecorder.start();

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _recordingDuration = Duration(seconds: timer.tick);
      });
    });
  }

  Future<void> _stopRecording() async {
    _timer?.cancel();
    
    setState(() {
      _isRecording = false;
      _isAnalyzing = true;
    });

    try {
      // TODO: Stop recording and send to backend
      // final audioFile = await _audioRecorder.stop();
      // final results = await _analyzeSpeaking(audioFile);
      
      // Mock for development
      await Future.delayed(const Duration(seconds: 3));
      
      setState(() {
        _isAnalyzing = false;
        _results = {
          'fluency': 7.5,
          'pronunciation': 8.0,
          'grammar': 7.0,
          'overall': 7.5,
          'level': 'B2',
        };
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isAnalyzing = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  void _continue() {
    // TODO: Save results to backend
    // await _saveSpeakingTest(_results!);

    context.push(AppRoutes.aiModelSettings);
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  @override
  void dispose() {
    _timer?.cancel();
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
        title: const Text(
          'Speaking Test',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 40),
              
              // Prompt
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: LoginColors.lightGray,
                    width: 1,
                  ),
                ),
                child: Column(
                  children: [
                    const Icon(
                      Icons.mic,
                      size: 48,
                      color: LoginColors.orangeBright,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Kendini Tanıt',
                      style: TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'İngilizce olarak kendini tanıt. Adın, yaşın, nereden geldiğin ve hobilerin hakkında konuş.',
                      style: TextStyle(
                        color: LoginColors.textSecondary,
                        fontSize: 14,
                        height: 1.5,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 48),
              
              // Recording area
              if (!_isAnalyzing && _results == null)
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Amplitude animation placeholder
                      Container(
                        width: 200,
                        height: 200,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: _isRecording
                                ? LoginColors.orangeBright
                                : LoginColors.lightGray,
                            width: 3,
                          ),
                        ),
                        child: Center(
                          child: Icon(
                            _isRecording ? Icons.mic : Icons.mic_none,
                            size: 80,
                            color: _isRecording
                                ? LoginColors.orangeBright
                                : LoginColors.textSecondary,
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                      
                      if (_isRecording) ...[
                        Text(
                          _formatDuration(_recordingDuration),
                          style: const TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            fontFeatures: [FontFeature.tabularFigures()],
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Kayıt yapılıyor...',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 14,
                          ),
                        ),
                      ] else ...[
                        const Text(
                          'Kayıt butonuna basarak başlayın',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ],
                  ),
                )
              else if (_isAnalyzing)
                const Expanded(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(
                          color: LoginColors.orangeBright,
                        ),
                        SizedBox(height: 24),
                        Text(
                          'Analiz ediliyor...',
                          style: TextStyle(
                            color: LoginColors.textSecondary,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
              else if (_results != null)
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: LoginColors.mediumGray,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              Icons.check_circle,
                              size: 64,
                              color: Colors.green,
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'Test Tamamlandı!',
                              style: TextStyle(
                                color: LoginColors.textPrimary,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 24),
                            _buildResultItem('Akıcılık', _results!['fluency'] as double),
                            _buildResultItem('Telaffuz', _results!['pronunciation'] as double),
                            _buildResultItem('Gramer', _results!['grammar'] as double),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: Colors.blue.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                'Seviye: ${_results!['level']}',
                                style: const TextStyle(
                                  color: Colors.blue,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              
              const SizedBox(height: 32),
              
              // Record/Continue button
              if (_results == null)
                CustomButton(
                  text: _isRecording ? 'Kaydı Durdur' : 'Kayda Başla',
                  icon: _isRecording ? Icons.stop : Icons.mic,
                  onPressed: _isRecording ? _stopRecording : _startRecording,
                )
              else
                CustomButton(
                  text: 'Devam Et',
                  icon: Icons.arrow_forward,
                  onPressed: _continue,
                ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildResultItem(String label, double score) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                color: LoginColors.textPrimary,
                fontSize: 14,
              ),
            ),
          ),
          Text(
            '${score.toStringAsFixed(1)}/10',
            style: TextStyle(
              color: score >= 7
                  ? Colors.green
                  : score >= 5
                      ? LoginColors.orangeBright
                      : Colors.red,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: 12),
          SizedBox(
            width: 100,
            child: LinearProgressIndicator(
              value: score / 10,
              backgroundColor: LoginColors.lightGray,
              valueColor: AlwaysStoppedAnimation<Color>(
                score >= 7
                    ? Colors.green
                    : score >= 5
                        ? LoginColors.orangeBright
                        : Colors.red,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

