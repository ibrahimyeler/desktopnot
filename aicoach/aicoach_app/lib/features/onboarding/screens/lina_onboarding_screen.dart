import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class LinaOnboardingScreen extends StatefulWidget {
  final Function(Map<String, dynamic>) onComplete;

  const LinaOnboardingScreen({
    super.key,
    required this.onComplete,
  });

  @override
  State<LinaOnboardingScreen> createState() => _LinaOnboardingScreenState();
}

class _LinaOnboardingScreenState extends State<LinaOnboardingScreen>
    with TickerProviderStateMixin {
  int _currentStep = 0;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;

  // User data
  String _userName = '';
  List<String> _focusAreas = [];
  String _dailyRhythm = '';
  String _planningStyle = '';
  List<String> _distractions = [];
  String _coachTone = '';

  final TextEditingController _nameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeIn),
    );

    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeOut),
    );

    _fadeController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _nameController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < 7) {
      setState(() {
        _currentStep++;
        _fadeController.reset();
        _fadeController.forward();
      });
    } else {
      _completeOnboarding();
    }
  }

  void _previousStep() {
    if (_currentStep > 0) {
      setState(() {
        _currentStep--;
        _fadeController.reset();
        _fadeController.forward();
      });
    }
  }

  Future<void> _completeOnboarding() async {
    final onboardingData = {
      'user_name': _userName,
      'focus_areas': _focusAreas,
      'daily_rhythm': _dailyRhythm,
      'planning_style': _planningStyle,
      'distractions': _distractions,
      'coach_tone': _coachTone,
      'onboarding_completed': true,
    };

    // Save to SharedPreferences
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('onboarding_data', jsonEncode(onboardingData));
    await prefs.setString('user_name', _userName);
    await prefs.setBool('onboarding_completed', true);

    widget.onComplete(onboardingData);
  }

  bool _canProceed() {
    switch (_currentStep) {
      case 0:
        return true;
      case 1:
        return _userName.isNotEmpty;
      case 2:
        return _focusAreas.isNotEmpty;
      case 3:
        return _dailyRhythm.isNotEmpty;
      case 4:
        return _planningStyle.isNotEmpty;
      case 5:
        return _distractions.isNotEmpty;
      case 6:
        return _coachTone.isNotEmpty;
      case 7:
        return true;
      default:
        return false;
    }
  }

  String _getLinaMessage() {
    switch (_currentStep) {
      case 0:
        return 'Hedeflerini planlamana ve odaklanmana yardımcı olacağım.';
      case 1:
        return _userName.isNotEmpty
            ? 'Harika, $_userName! Bundan sonra sana isminle sesleneceğim.'
            : '';
      case 2:
        return _focusAreas.isNotEmpty
            ? 'Süper! Bu alanlarda birlikte düzen ve denge kurabiliriz.'
            : '';
      case 3:
        return _dailyRhythm.isNotEmpty
            ? _getDailyRhythmMessage()
            : '';
      case 4:
        return _planningStyle.isNotEmpty
            ? _getPlanningStyleMessage()
            : '';
      case 5:
        return _distractions.isNotEmpty
            ? 'Bu konularda özel odak blokları oluşturalım, seni destekleyeceğim.'
            : '';
      case 6:
        return _coachTone.isNotEmpty
            ? _getCoachToneMessage()
            : '';
      case 7:
        return 'Şimdi sana özel bir başlangıç planı hazırlayacağım. Hazırsan birlikte ilk hedefini kuralım!';
      default:
        return '';
    }
  }

  String _getDailyRhythmMessage() {
    switch (_dailyRhythm) {
      case 'morning_focus':
        return 'Anladım. Demek ki senin için sabah saatleri altın zaman dilimi.';
      case 'day_focus':
        return 'Anladım. Gün içinde yoğun bir tempoda çalışıyorsun.';
      case 'night_focus':
        return 'Anladım. Demek ki senin için akşam saatleri altın zaman dilimi.';
      case 'irregular':
        return 'Anladım. Düzensiz bir yaşam tarzın var, birlikte düzen kurabiliriz.';
      default:
        return '';
    }
  }

  String _getPlanningStyleMessage() {
    switch (_planningStyle) {
      case 'written':
        return 'Harika, yazılı planlama bizim için büyük avantaj! Bunu birlikte optimize ederiz.';
      case 'mental':
        return 'Anladım. Kafanda tutmayı tercih ediyorsun, birlikte daha sistematik hale getirebiliriz.';
      case 'digital':
        return 'Harika, dijital planlama bizim için büyük avantaj! Bunu birlikte optimize ederiz.';
      case 'no_planning':
        return 'Anladım. Planlama konusunda destek olacağım, birlikte başlayalım.';
      default:
        return '';
    }
  }

  String _getCoachToneMessage() {
    switch (_coachTone) {
      case 'disciplined':
        return 'Anlaşıldı! Disiplinli ve hedef odaklı bir tarz benimseyeceğim.';
      case 'calm':
        return 'Anlaşıldı! Sakin ve dengeli bir tarz benimseyeceğim.';
      case 'motivational':
        return 'Anlaşıldı! Hafif motivasyonlu ama dengeli bir tarz benimseyeceğim.';
      default:
        return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: _getGradientForStep(),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Progress indicator
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: List.generate(8, (index) {
                    return Expanded(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        height: 4,
                        decoration: BoxDecoration(
                          color: index <= _currentStep
                              ? Colors.white
                              : Colors.white.withOpacity(0.3),
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    );
                  }),
                ),
              ),

              // Content
              Expanded(
                child: FadeTransition(
                  opacity: _fadeAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: _buildStepContent(),
                  ),
                ),
              ),

              // Navigation buttons
              Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  children: [
                    if (_currentStep > 0)
                      TextButton(
                        onPressed: _previousStep,
                        child: const Text(
                          'Geri',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ),
                    const Spacer(),
                    ElevatedButton(
                      onPressed: _canProceed() ? _nextStep : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _getPrimaryColorForStep(),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 32,
                          vertical: 16,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                      ),
                      child: Text(
                        _currentStep == 0
                            ? 'Tamam, başlayalım 🚀'
                            : _currentStep == 7
                                ? 'Başlayalım 🚀'
                                : 'Devam Et',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
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

  Widget _buildStepContent() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Title
          Text(
            _getStepTitle(),
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),

          // Subtitle
          if (_getStepSubtitle().isNotEmpty)
            Text(
              _getStepSubtitle(),
              style: TextStyle(
                fontSize: 16,
                color: Colors.white.withOpacity(0.9),
              ),
              textAlign: TextAlign.center,
            ),
          const SizedBox(height: 32),

          // Lina's message
          if (_getLinaMessage().isNotEmpty && _currentStep > 0)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.white.withOpacity(0.3),
                  width: 1,
                ),
              ),
              child: Text(
                _getLinaMessage(),
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.white,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          const SizedBox(height: 32),

          // Step-specific content
          _buildStepSpecificContent(),
        ],
      ),
    );
  }


  Widget _buildStepSpecificContent() {
    switch (_currentStep) {
      case 0:
        return _buildWelcomeStep();
      case 1:
        return _buildNameStep();
      case 2:
        return _buildFocusAreaStep();
      case 3:
        return _buildDailyRhythmStep();
      case 4:
        return _buildPlanningStyleStep();
      case 5:
        return _buildDistractionsStep();
      case 6:
        return _buildCoachToneStep();
      case 7:
        return _buildSummaryStep();
      default:
        return const SizedBox();
    }
  }

  Widget _buildWelcomeStep() {
    return Column(
      children: [
        Text(
          'Seninle biraz tanışmak istiyorum, böylece sana özel bir planlama tarzı oluşturabilirim.',
          style: TextStyle(
            fontSize: 16,
            color: Colors.white.withOpacity(0.9),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildNameStep() {
    return Column(
      children: [
        TextField(
          controller: _nameController,
          style: const TextStyle(color: Colors.white, fontSize: 18),
          decoration: InputDecoration(
            hintText: 'İsminizi girin',
            hintStyle: TextStyle(color: Colors.white.withOpacity(0.6)),
            filled: true,
            fillColor: Colors.white.withOpacity(0.2),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withOpacity(0.3),
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: BorderSide(
                color: Colors.white.withOpacity(0.3),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(16),
              borderSide: const BorderSide(color: Colors.white, width: 2),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 20,
              vertical: 16,
            ),
          ),
          onChanged: (value) {
            setState(() {
              _userName = value.trim();
            });
          },
        ),
        const SizedBox(height: 16),
        TextButton(
          onPressed: () {
            setState(() {
              _userName = 'koç';
              _nameController.text = 'koç';
            });
          },
          child: Text(
            'Bana kısaca "koç" diyebilirsin.',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 14,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildFocusAreaStep() {
    final options = [
      {'label': 'Kariyer ve verimlilik', 'value': 'kariyer'},
      {'label': 'Zihinsel denge ve odak', 'value': 'zihinsel denge'},
      {'label': 'Fiziksel enerji', 'value': 'fiziksel enerji'},
      {'label': 'Finansal düzen', 'value': 'finansal düzen'},
      {'label': 'Genel yaşam planı', 'value': 'genel yaşam'},
    ];

    return Column(
      children: options.map((option) {
        final isSelected = _focusAreas.contains(option['value']);
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              setState(() {
                if (isSelected) {
                  _focusAreas.remove(option['value']);
                } else {
                  _focusAreas.add(option['value'] as String);
                }
              });
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      option['label'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        color: isSelected
                            ? _getPrimaryColorForStep()
                            : Colors.white,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.green),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDailyRhythmStep() {
    final options = [
      {
        'label': 'Sabah erken kalkar, plan yaparım.',
        'value': 'morning_focus'
      },
      {
        'label': 'Gün içinde yoğun ve bölünmüş geçer.',
        'value': 'day_focus'
      },
      {
        'label': 'Gece saatlerinde daha verimli olurum.',
        'value': 'night_focus'
      },
      {
        'label': 'Düzensiz, her gün farklı.',
        'value': 'irregular'
      },
    ];

    return Column(
      children: options.map((option) {
        final isSelected = _dailyRhythm == option['value'];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              setState(() {
                _dailyRhythm = option['value'] as String;
              });
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      option['label'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        color: isSelected
                            ? _getPrimaryColorForStep()
                            : Colors.white,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.green),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildPlanningStyleStep() {
    final options = [
      {'label': 'Yazılı olarak not alırım', 'value': 'written'},
      {'label': 'Kafamda tutarım', 'value': 'mental'},
      {
        'label': 'Dijital uygulamalarda planlarım',
        'value': 'digital'
      },
      {'label': 'Genelde plan yapmam', 'value': 'no_planning'},
    ];

    return Column(
      children: options.map((option) {
        final isSelected = _planningStyle == option['value'];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              setState(() {
                _planningStyle = option['value'] as String;
              });
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      option['label'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        color: isSelected
                            ? _getPrimaryColorForStep()
                            : Colors.white,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.green),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDistractionsStep() {
    final options = [
      {'label': 'Telefon bildirimleri', 'value': 'bildirimler'},
      {'label': 'Sosyal medya', 'value': 'sosyal medya'},
      {'label': 'Aşırı görev yükü', 'value': 'görev yükü'},
      {
        'label': 'Motivasyon eksikliği',
        'value': 'motivasyon'
      },
    ];

    return Column(
      children: options.map((option) {
        final isSelected = _distractions.contains(option['value']);
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              setState(() {
                if (isSelected) {
                  _distractions.remove(option['value']);
                } else {
                  _distractions.add(option['value'] as String);
                }
              });
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      option['label'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        color: isSelected
                            ? _getPrimaryColorForStep()
                            : Colors.white,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.green),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCoachToneStep() {
    final options = [
      {
        'label': 'Disiplinli ve hedef odaklı',
        'value': 'disciplined'
      },
      {'label': 'Sakin ve dengeli', 'value': 'calm'},
      {
        'label': 'Motive edici ve destekleyici',
        'value': 'motivational'
      },
    ];

    return Column(
      children: options.map((option) {
        final isSelected = _coachTone == option['value'];
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              setState(() {
                _coachTone = option['value'] as String;
              });
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isSelected
                    ? Colors.white
                    : Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isSelected
                      ? Colors.white
                      : Colors.white.withOpacity(0.3),
                  width: isSelected ? 2 : 1,
                ),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      option['label'] as String,
                      style: TextStyle(
                        fontSize: 16,
                        color: isSelected
                            ? _getPrimaryColorForStep()
                            : Colors.white,
                        fontWeight: isSelected
                            ? FontWeight.bold
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                  if (isSelected)
                    const Icon(Icons.check_circle, color: Colors.green),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSummaryStep() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Colors.white.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Harika, $_userName!',
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Artık seni daha yakından tanıyorum.',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 24),
          _buildSummaryRow('Odak Alanları', _focusAreas.join(', ')),
          const SizedBox(height: 12),
          _buildSummaryRow('Günlük Ritim', _getDailyRhythmLabel()),
          const SizedBox(height: 12),
          _buildSummaryRow('Planlama Tarzı', _getPlanningStyleLabel()),
          const SizedBox(height: 12),
          _buildSummaryRow('Dikkat Dağıtıcı', _distractions.join(', ')),
          const SizedBox(height: 12),
          _buildSummaryRow('Koç Tarzı', _getCoachToneLabel()),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  String _getDailyRhythmLabel() {
    switch (_dailyRhythm) {
      case 'morning_focus':
        return 'Sabah Odaklı';
      case 'day_focus':
        return 'Gün İçi Yoğun';
      case 'night_focus':
        return 'Gece Odaklı';
      case 'irregular':
        return 'Düzensiz';
      default:
        return '';
    }
  }

  String _getPlanningStyleLabel() {
    switch (_planningStyle) {
      case 'written':
        return 'Yazılı';
      case 'mental':
        return 'Zihinsel';
      case 'digital':
        return 'Dijital';
      case 'no_planning':
        return 'Planlama Yok';
      default:
        return '';
    }
  }

  String _getCoachToneLabel() {
    switch (_coachTone) {
      case 'disciplined':
        return 'Disiplinli';
      case 'calm':
        return 'Sakin';
      case 'motivational':
        return 'Motive Edici';
      default:
        return '';
    }
  }

  String _getStepTitle() {
    switch (_currentStep) {
      case 0:
        return 'Merhaba! Ben Lina.';
      case 1:
        return 'Sana nasıl hitap etmemi istersin?';
      case 2:
        return 'Şu anda hayatında en çok hangi alanda odaklanmak istiyorsun?';
      case 3:
        return 'Bir günün genellikle nasıl geçiyor?';
      case 4:
        return 'Planlarını nasıl yapmayı seversin?';
      case 5:
        return 'Seni genelde en çok ne dağıtır?';
      case 6:
        return 'Benim sana nasıl rehberlik etmemi istersin?';
      case 7:
        return 'Harika, $_userName!';
      default:
        return '';
    }
  }

  String _getStepSubtitle() {
    switch (_currentStep) {
      case 0:
        return '';
      case 2:
        return '(Birden fazla seçenek seçebilirsin)';
      case 5:
        return '(Birden fazla seçenek seçebilirsin)';
      default:
        return '';
    }
  }

  LinearGradient _getGradientForStep() {
    switch (_currentStep) {
      case 0:
      case 7:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF9B59B6), // Purple
            Color(0xFFE91E63), // Pink
          ],
        );
      case 1:
      case 6:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFF6B6B), // Red-orange
            Color(0xFFFFA500), // Orange
          ],
        );
      case 2:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFFFFD700), // Gold
            Color(0xFFFFA500), // Orange
          ],
        );
      case 3:
      case 5:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF4A90E2), // Blue
            Color(0xFF5B9BD5), // Light blue
          ],
        );
      case 4:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF50C878), // Green
            Color(0xFF32CD32), // Lime green
          ],
        );
      default:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF9B59B6),
            Color(0xFFE91E63),
          ],
        );
    }
  }

  Color _getPrimaryColorForStep() {
    switch (_currentStep) {
      case 0:
      case 7:
        return const Color(0xFF9B59B6);
      case 1:
      case 6:
        return const Color(0xFFFF6B6B);
      case 2:
        return const Color(0xFFFFD700);
      case 3:
      case 5:
        return const Color(0xFF4A90E2);
      case 4:
        return const Color(0xFF50C878);
      default:
        return const Color(0xFF9B59B6);
    }
  }
}

