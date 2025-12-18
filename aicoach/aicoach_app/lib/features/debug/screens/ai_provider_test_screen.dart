import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// AI Provider Test Screen - Test AI provider connections
class AiProviderTestScreen extends StatefulWidget {
  const AiProviderTestScreen({super.key});

  @override
  State<AiProviderTestScreen> createState() => _AiProviderTestScreenState();
}

class _AiProviderTestScreenState extends State<AiProviderTestScreen> {
  final Map<String, String> _testResults = {};
  bool _isTesting = false;

  Future<void> _testProvider(String provider) async {
    setState(() {
      _isTesting = true;
      _testResults[provider] = 'Testing...';
    });

    // Simulate API test
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _testResults[provider] = 'Success';
      _isTesting = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final providers = ['OpenAI', 'Anthropic', 'Google'];

    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'AI Provider Test',
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
            ...providers.map((provider) => Container(
                  margin: const EdgeInsets.only(bottom: 12),
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
                              provider,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            if (_testResults.containsKey(provider)) ...[
                              const SizedBox(height: 4),
                              Text(
                                _testResults[provider]!,
                                style: TextStyle(
                                  color: _testResults[provider] == 'Success'
                                      ? Colors.green
                                      : Colors.orange,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _isTesting
                            ? null
                            : () => _testProvider(provider),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF3B82F6),
                        ),
                        child: const Text('Test'),
                      ),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }
}

