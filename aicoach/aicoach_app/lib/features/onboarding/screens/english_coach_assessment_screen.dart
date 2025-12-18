import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// English Coach Seviye Tespiti - 10 soruluk quiz (CEFR A1–C1)
class EnglishCoachAssessmentScreen extends StatefulWidget {
  const EnglishCoachAssessmentScreen({super.key});

  @override
  State<EnglishCoachAssessmentScreen> createState() => _EnglishCoachAssessmentScreenState();
}

class _EnglishCoachAssessmentScreenState extends State<EnglishCoachAssessmentScreen> {
  int _currentQuestion = 0;
  String? _selectedAnswer;
  final List<String> _answers = [];
  bool _isSubmitting = false;

  final List<Map<String, dynamic>> _questions = [
    {
      'question': 'What is your name?',
      'options': ['My name is John', 'I am fine', 'I like pizza', 'I am 25 years old'],
      'correct': 0,
      'level': 'A1',
    },
    {
      'question': 'I _____ to the store yesterday.',
      'options': ['go', 'went', 'going', 'goes'],
      'correct': 1,
      'level': 'A2',
    },
    {
      'question': 'If I _____ rich, I would travel the world.',
      'options': ['am', 'was', 'were', 'be'],
      'correct': 2,
      'level': 'B1',
    },
    {
      'question': 'The project _____ by the team last month.',
      'options': ['completed', 'was completed', 'completing', 'complete'],
      'correct': 1,
      'level': 'B2',
    },
    {
      'question': 'Not only _____ the exam, but she also got the highest score.',
      'options': ['she passed', 'did she pass', 'she did pass', 'passed she'],
      'correct': 1,
      'level': 'C1',
    },
  ];

  void _selectAnswer(String answer) {
    setState(() {
      _selectedAnswer = answer;
    });
  }

  void _nextQuestion() {
    if (_selectedAnswer == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Lütfen bir cevap seçin'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
      return;
    }

    _answers.add(_selectedAnswer!);
    _selectedAnswer = null;

    if (_currentQuestion < _questions.length - 1) {
      setState(() {
        _currentQuestion++;
      });
    } else {
      _submitAssessment();
    }
  }

  Future<void> _submitAssessment() async {
    setState(() {
      _isSubmitting = true;
    });

    try {
      // TODO: Calculate level and save to backend
      // final level = _calculateLevel(_answers);
      // await _saveAssessment(level);
      
      // Mock for development
      await Future.delayed(const Duration(seconds: 2));

      if (!mounted) return;

      setState(() {
        _isSubmitting = false;
      });

      context.push(AppRoutes.englishCoachSpeakingTest);
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isSubmitting = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Hata: ${e.toString()}'),
          backgroundColor: LoginColors.orangeDark,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isSubmitting) {
      return Scaffold(
        backgroundColor: LoginColors.darkGray,
        body: const Center(
          child: CircularProgressIndicator(
            color: LoginColors.orangeBright,
          ),
        ),
      );
    }

    final question = _questions[_currentQuestion];
    final progress = (_currentQuestion + 1) / _questions.length;

    return Scaffold(
      backgroundColor: LoginColors.darkGray,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: LoginColors.textPrimary),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Soru ${_currentQuestion + 1}/${_questions.length}',
          style: const TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 16,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              
              // Progress bar
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: progress,
                  backgroundColor: LoginColors.lightGray,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    LoginColors.orangeBright,
                  ),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 32),
              
              // Level badge
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: Colors.blue.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: Colors.blue,
                      width: 1,
                    ),
                  ),
                  child: Text(
                    'Seviye: ${question['level']}',
                    style: const TextStyle(
                      color: Colors.blue,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),
              
              // Question
              Text(
                question['question'] as String,
                style: const TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  height: 1.4,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              
              // Options
              Expanded(
                child: Column(
                  children: (question['options'] as List<String>).map((option) {
                    final isSelected = _selectedAnswer == option;
                    
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: GestureDetector(
                        onTap: () => _selectAnswer(option),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? LoginColors.orange.withOpacity(0.2)
                                : LoginColors.mediumGray,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSelected
                                  ? LoginColors.orangeBright
                                  : LoginColors.lightGray,
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
                                        ? LoginColors.orangeBright
                                        : LoginColors.textSecondary,
                                    width: 2,
                                  ),
                                  color: isSelected
                                      ? LoginColors.orangeBright
                                      : Colors.transparent,
                                ),
                                child: isSelected
                                    ? const Icon(
                                        Icons.check,
                                        size: 16,
                                        color: Colors.white,
                                      )
                                    : null,
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Text(
                                  option,
                                  style: TextStyle(
                                    color: isSelected
                                        ? LoginColors.textPrimary
                                        : LoginColors.textSecondary,
                                    fontSize: 16,
                                    fontWeight: isSelected
                                        ? FontWeight.w600
                                        : FontWeight.normal,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              
              const SizedBox(height: 24),
              
              // Next button
              CustomButton(
                text: _currentQuestion < _questions.length - 1
                    ? 'Sonraki Soru'
                    : 'Değerlendirmeyi Tamamla',
                icon: Icons.arrow_forward,
                onPressed: _nextQuestion,
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

