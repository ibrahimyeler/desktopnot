import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// AI Model Settings Screen - Configure AI model preferences
class AiModelSettingsScreen extends StatefulWidget {
  const AiModelSettingsScreen({super.key});

  @override
  State<AiModelSettingsScreen> createState() => _AiModelSettingsScreenState();
}

class _AiModelSettingsScreenState extends State<AiModelSettingsScreen> {
  String _selectedModel = 'gpt-4';
  double _temperature = 0.7;
  int _maxTokens = 1000;

  final List<Map<String, dynamic>> _models = [
    {
      'id': 'gpt-4',
      'name': 'GPT-4',
      'description': 'En gelişmiş model',
      'provider': 'OpenAI',
    },
    {
      'id': 'gpt-3.5-turbo',
      'name': 'GPT-3.5 Turbo',
      'description': 'Hızlı ve verimli',
      'provider': 'OpenAI',
    },
    {
      'id': 'claude-3',
      'name': 'Claude 3',
      'description': 'Anthropic modeli',
      'provider': 'Anthropic',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'AI Model Ayarları',
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
            // Model selection
            const Text(
              'AI Modeli',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            ..._models.map((model) => _buildModelOption(model)),
            const SizedBox(height: 32),
            
            // Temperature
            const Text(
              'Yaratıcılık (Temperature)',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              '${_temperature.toStringAsFixed(1)} - ${_getTemperatureLabel(_temperature)}',
              style: TextStyle(
                color: Colors.grey[400],
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Slider(
              value: _temperature,
              min: 0.0,
              max: 1.0,
              divisions: 10,
              label: _temperature.toStringAsFixed(1),
              activeColor: const Color(0xFF3B82F6),
              onChanged: (value) {
                setState(() => _temperature = value);
              },
            ),
            const SizedBox(height: 32),
            
            // Max tokens
            const Text(
              'Maksimum Token',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Container(
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
                    child: Text(
                      _maxTokens.toString(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.remove_circle_outline, color: Colors.white),
                    onPressed: () {
                      if (_maxTokens > 100) {
                        setState(() => _maxTokens -= 100);
                      }
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline, color: Colors.white),
                    onPressed: () {
                      if (_maxTokens < 4000) {
                        setState(() => _maxTokens += 100);
                      }
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            
            // Save button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save settings
                  context.pop();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3B82F6),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  'Ayarları Kaydet',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModelOption(Map<String, dynamic> model) {
    final isSelected = _selectedModel == model['id'];
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      child: GestureDetector(
        onTap: () => setState(() => _selectedModel = model['id'] as String),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFF3B82F6).withOpacity(0.2)
                : const Color(0xFF1F2937),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected
                  ? const Color(0xFF3B82F6)
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
                        ? const Color(0xFF3B82F6)
                        : Colors.grey[600]!,
                    width: 2,
                  ),
                  color: isSelected
                      ? const Color(0xFF3B82F6)
                      : Colors.transparent,
                ),
                child: isSelected
                    ? const Icon(Icons.check, color: Colors.white, size: 16)
                    : null,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      model['name'] as String,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.white70,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      model['description'] as String,
                      style: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getTemperatureLabel(double value) {
    if (value < 0.3) return 'Çok Kesin';
    if (value < 0.7) return 'Dengeli';
    return 'Yaratıcı';
  }
}

