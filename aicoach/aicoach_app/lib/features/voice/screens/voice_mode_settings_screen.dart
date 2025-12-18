import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Voice Mode Settings Screen - Configure voice coach mode settings
class VoiceModeSettingsScreen extends StatefulWidget {
  const VoiceModeSettingsScreen({super.key});

  @override
  State<VoiceModeSettingsScreen> createState() => _VoiceModeSettingsScreenState();
}

class _VoiceModeSettingsScreenState extends State<VoiceModeSettingsScreen> {
  String _selectedMode = 'normal';
  bool _handsFreeMode = false;
  bool _wakeWordEnabled = false;

  final List<Map<String, dynamic>> _modes = [
    {
      'id': 'normal',
      'name': 'Normal Sohbet',
      'description': 'Standart sohbet modu',
      'icon': Icons.chat_bubble_outline,
    },
    {
      'id': 'planning',
      'name': 'Planlama Modu',
      'description': 'Görev ve planlama odaklı',
      'icon': Icons.calendar_today_outlined,
    },
    {
      'id': 'english',
      'name': 'İngilizce Pratik',
      'description': 'Dil pratiği modu',
      'icon': Icons.language,
    },
    {
      'id': 'motivation',
      'name': 'Motivasyon Modu',
      'description': 'Motivasyonel destek',
      'icon': Icons.emoji_events_outlined,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Ses Modu Ayarları',
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
            // Mode selection
            const Text(
              'Varsayılan Mod',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ..._modes.map((mode) => _buildModeOption(mode)),
            const SizedBox(height: 32),
            
            // Settings
            _buildSwitchTile(
              'Hands-Free Modu',
              'Araç kullanırken aktif edin',
              _handsFreeMode,
              (value) => setState(() => _handsFreeMode = value),
            ),
            const SizedBox(height: 16),
            _buildSwitchTile(
              'Uyandırma Kelimesi',
              '"Hey Gofocus" ile aktif et',
              _wakeWordEnabled,
              (value) => setState(() => _wakeWordEnabled = value),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModeOption(Map<String, dynamic> mode) {
    final isSelected = _selectedMode == mode['id'];
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => setState(() => _selectedMode = mode['id'] as String),
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
              Icon(
                mode['icon'] as IconData,
                color: isSelected ? const Color(0xFFFFB800) : Colors.grey[400],
                size: 24,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      mode['name'] as String,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.white70,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      mode['description'] as String,
                      style: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
              if (isSelected)
                const Icon(Icons.check_circle, color: Color(0xFFFFB800)),
            ],
          ),
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
}

