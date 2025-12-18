import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Günlük Rutin Analizi Ekranı - AI'nin günlük plan önerilerini optimize etmesi
class OnboardingDailyRoutineScreen extends StatefulWidget {
  const OnboardingDailyRoutineScreen({super.key});

  @override
  State<OnboardingDailyRoutineScreen> createState() => _OnboardingDailyRoutineScreenState();
}

class _OnboardingDailyRoutineScreenState extends State<OnboardingDailyRoutineScreen> {
  int _sleepHours = 7;
  int _workHours = 8;
  bool _usesPomodoro = false;
  bool _hasMorningRoutine = false;
  bool _hasEveningRoutine = false;
  String? _workSchedule; // 'morning', 'afternoon', 'evening', 'flexible'

  void _continue() {
    // TODO: Save to backend
    // await _saveDailyRoutine({
    //   'sleep_hours': _sleepHours,
    //   'work_hours': _workHours,
    //   'uses_pomodoro': _usesPomodoro,
    //   'has_morning_routine': _hasMorningRoutine,
    //   'has_evening_routine': _hasEveningRoutine,
    //   'work_schedule': _workSchedule,
    // });

    context.push(AppRoutes.onboardingLearningStyle);
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
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              
              // Progress indicator
              Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Container(
                      height: 4,
                      decoration: BoxDecoration(
                        color: LoginColors.orangeBright,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              // Başlık
              const Text(
                'Günlük Rutininiz',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'AI\'nin size özel planlar oluşturabilmesi için rutininizi paylaşın',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              
              // Sleep hours
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.bedtime,
                          color: LoginColors.orangeBright,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Ortalama Uyku Saati',
                          style: TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          '$_sleepHours saat',
                          style: const TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Icon(
                          Icons.info_outline,
                          color: LoginColors.textSecondary,
                          size: 20,
                        ),
                      ],
                    ),
                    Slider(
                      value: _sleepHours.toDouble(),
                      min: 4,
                      max: 12,
                      divisions: 8,
                      activeColor: LoginColors.orangeBright,
                      inactiveColor: LoginColors.lightGray,
                      onChanged: (value) {
                        setState(() {
                          _sleepHours = value.toInt();
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Work hours
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(
                          Icons.work,
                          color: LoginColors.orangeBright,
                          size: 24,
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'Günlük Çalışma Saati',
                          style: TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          '$_workHours saat',
                          style: const TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                        Icon(
                          Icons.info_outline,
                          color: LoginColors.textSecondary,
                          size: 20,
                        ),
                      ],
                    ),
                    Slider(
                      value: _workHours.toDouble(),
                      min: 2,
                      max: 12,
                      divisions: 10,
                      activeColor: LoginColors.orangeBright,
                      inactiveColor: LoginColors.lightGray,
                      onChanged: (value) {
                        setState(() {
                          _workHours = value.toInt();
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Pomodoro
              SwitchListTile(
                title: const Text(
                  'Pomodoro Tekniği Kullanıyor musunuz?',
                  style: TextStyle(color: LoginColors.textPrimary),
                ),
                subtitle: const Text(
                  '25 dakika çalışma, 5 dakika mola',
                  style: TextStyle(color: LoginColors.textSecondary),
                ),
                value: _usesPomodoro,
                activeColor: LoginColors.orangeBright,
                onChanged: (value) {
                  setState(() {
                    _usesPomodoro = value;
                  });
                },
              ),
              const SizedBox(height: 8),
              
              // Morning routine
              SwitchListTile(
                title: const Text(
                  'Sabah Rutini Var mı?',
                  style: TextStyle(color: LoginColors.textPrimary),
                ),
                subtitle: const Text(
                  'Meditasyon, egzersiz, okuma vb.',
                  style: TextStyle(color: LoginColors.textSecondary),
                ),
                value: _hasMorningRoutine,
                activeColor: LoginColors.orangeBright,
                onChanged: (value) {
                  setState(() {
                    _hasMorningRoutine = value;
                  });
                },
              ),
              const SizedBox(height: 8),
              
              // Evening routine
              SwitchListTile(
                title: const Text(
                  'Akşam Rutini Var mı?',
                  style: TextStyle(color: LoginColors.textPrimary),
                ),
                subtitle: const Text(
                  'Günlük planlama, günlük yazma vb.',
                  style: TextStyle(color: LoginColors.textSecondary),
                ),
                value: _hasEveningRoutine,
                activeColor: LoginColors.orangeBright,
                onChanged: (value) {
                  setState(() {
                    _hasEveningRoutine = value;
                  });
                },
              ),
              const SizedBox(height: 24),
              
              // Work schedule
              const Text(
                'Çalışma Saatleri',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _buildScheduleOption('morning', 'Sabah', Icons.wb_sunny),
                  _buildScheduleOption('afternoon', 'Öğleden Sonra', Icons.lunch_dining),
                  _buildScheduleOption('evening', 'Akşam', Icons.nightlight),
                  _buildScheduleOption('flexible', 'Esnek', Icons.schedule),
                ],
              ),
              const SizedBox(height: 32),
              
              // Continue button
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

  Widget _buildScheduleOption(String value, String label, IconData icon) {
    final isSelected = _workSchedule == value;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          _workSchedule = value;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected
              ? LoginColors.orange.withOpacity(0.2)
              : LoginColors.mediumGray,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? LoginColors.orangeBright
                : LoginColors.lightGray,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected
                  ? LoginColors.orangeBright
                  : LoginColors.textSecondary,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                color: isSelected
                    ? LoginColors.textPrimary
                    : LoginColors.textSecondary,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

