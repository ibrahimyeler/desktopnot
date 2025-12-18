import 'package:flutter/material.dart';

/// Microphone button widget for voice input
class VoiceMicrophoneButton extends StatelessWidget {
  final bool isRecording;
  final VoidCallback onTap;

  const VoiceMicrophoneButton({
    super.key,
    required this.isRecording,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 80,
        height: 80,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: isRecording
                ? [
                    const Color(0xFFFF6B6B),
                    const Color(0xFFEE5A6F),
                  ]
                : [
                    const Color(0xFFFFB800),
                    const Color(0xFFFF9500),
                  ],
          ),
          boxShadow: [
            BoxShadow(
              color: (isRecording ? Colors.red : Colors.orange).withOpacity(0.4),
              blurRadius: 20,
              spreadRadius: 5,
            ),
          ],
        ),
        child: Icon(
          isRecording ? Icons.mic : Icons.mic_none,
          color: Colors.white,
          size: 40,
        ),
      ),
    );
  }
}

