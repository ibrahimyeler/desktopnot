import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Voice Settings Screen - Configure voice coach settings
class VoiceSettingsScreen extends StatefulWidget {
  const VoiceSettingsScreen({super.key});

  @override
  State<VoiceSettingsScreen> createState() => _VoiceSettingsScreenState();
}

class _VoiceSettingsScreenState extends State<VoiceSettingsScreen> {
  bool _voiceEnabled = true;
  bool _autoPlay = true;
  double _speechRate = 1.0;
  String _voiceType = 'natural';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Ses Ayarları',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _buildSwitchTile(
              'Sesli Yanıt',
              'Koçların sesli yanıt vermesini etkinleştir',
              _voiceEnabled,
              (value) => setState(() => _voiceEnabled = value),
            ),
            const SizedBox(height: 16),
            _buildSwitchTile(
              'Otomatik Oynat',
              'Mesajlar otomatik olarak sesli oynatılsın',
              _autoPlay,
              (value) => setState(() => _autoPlay = value),
            ),
            const SizedBox(height: 32),
            const Text(
              'Konuşma Hızı',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              '${_speechRate.toStringAsFixed(1)}x',
              style: TextStyle(
                color: Colors.grey[400],
                fontSize: 14,
              ),
            ),
            Slider(
              value: _speechRate,
              min: 0.5,
              max: 2.0,
              divisions: 15,
              label: '${_speechRate.toStringAsFixed(1)}x',
              activeColor: const Color(0xFFFFB800),
              onChanged: (value) {
                setState(() => _speechRate = value);
              },
            ),
            const SizedBox(height: 32),
            const Text(
              'Ses Tipi',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildVoiceTypeOption('natural', 'Doğal', true),
            _buildVoiceTypeOption('professional', 'Profesyonel', false),
            _buildVoiceTypeOption('friendly', 'Samimi', false),
          ],
        ),
      ),
    );
  }

  Widget _buildSwitchTile(
    String title,
    String subtitle,
    bool value,
    ValueChanged<bool> onChanged,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: const Color(0xFFFFB800),
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceTypeOption(String value, String label, bool isSelected) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => setState(() => _voiceType = value),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFFFFB800).withOpacity(0.2)
                : const Color(0xFF1F2937),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFFFFB800)
                  : const Color(0xFF374151),
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? const Color(0xFFFFB800)
                        : Colors.grey[600]!,
                    width: 2,
                  ),
                  color: isSelected
                      ? const Color(0xFFFFB800)
                      : Colors.transparent,
                ),
                child: isSelected
                    ? const Icon(Icons.check, color: Colors.white, size: 16)
                    : null,
              ),
              const SizedBox(width: 16),
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.white70,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

