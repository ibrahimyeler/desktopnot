import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../widgets/custom_button.dart';
import '../../../widgets/login/login_colors.dart';
import '../../../app/navigation/route_names.dart';

/// Focus Coach Config Form - Kullanıcıdan alınacak ayarlar
class FocusCoachConfigScreen extends StatefulWidget {
  const FocusCoachConfigScreen({super.key});

  @override
  State<FocusCoachConfigScreen> createState() => _FocusCoachConfigScreenState();
}

class _FocusCoachConfigScreenState extends State<FocusCoachConfigScreen> {
  int _dailyWorkHours = 6;
  int _targetTasks = 5;
  String _workTimeRange = '09:00-18:00';
  String _notificationFrequency = 'moderate'; // 'low', 'moderate', 'high'

  final List<String> _timeRanges = [
    '06:00-12:00',
    '09:00-18:00',
    '14:00-22:00',
    '18:00-02:00',
    'Esnek',
  ];

  void _continue() {
    // TODO: Save to backend
    // await _saveFocusCoachConfig({
    //   'daily_work_hours': _dailyWorkHours,
    //   'target_tasks': _targetTasks,
    //   'work_time_range': _workTimeRange,
    //   'notification_frequency': _notificationFrequency,
    // });

    context.push(AppRoutes.englishCoachIntro);
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
          'Focus Coach Ayarları',
          style: TextStyle(
            color: LoginColors.textPrimary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 20),
              
              // Başlık
              const Text(
                'Focus Coach\'unuzu Özelleştirin',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Bu bilgiler koçunuzun size daha iyi öneriler sunmasını sağlar',
                style: TextStyle(
                  color: LoginColors.textSecondary,
                  fontSize: 16,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 32),
              
              // Daily work hours
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Günlük Çalışma Süresi',
                      style: TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          '$_dailyWorkHours saat',
                          style: const TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                      ],
                    ),
                    Slider(
                      value: _dailyWorkHours.toDouble(),
                      min: 2,
                      max: 12,
                      divisions: 10,
                      activeColor: LoginColors.orangeBright,
                      inactiveColor: LoginColors.lightGray,
                      onChanged: (value) {
                        setState(() {
                          _dailyWorkHours = value.toInt();
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Target tasks
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: LoginColors.mediumGray,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Hedef İş Sayısı (Günlük)',
                      style: TextStyle(
                        color: LoginColors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          '$_targetTasks görev',
                          style: const TextStyle(
                            color: LoginColors.textPrimary,
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Spacer(),
                      ],
                    ),
                    Slider(
                      value: _targetTasks.toDouble(),
                      min: 1,
                      max: 20,
                      divisions: 19,
                      activeColor: LoginColors.orangeBright,
                      inactiveColor: LoginColors.lightGray,
                      onChanged: (value) {
                        setState(() {
                          _targetTasks = value.toInt();
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              
              // Work time range
              const Text(
                'Çalışma Saat Aralığı',
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
                children: _timeRanges.map((range) {
                  final isSelected = _workTimeRange == range;
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _workTimeRange = range;
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
                      child: Text(
                        range,
                        style: TextStyle(
                          color: isSelected
                              ? LoginColors.textPrimary
                              : LoginColors.textSecondary,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 24),
              
              // Notification frequency
              const Text(
                'Bildirim Sıklığı',
                style: TextStyle(
                  color: LoginColors.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              Column(
                children: [
                  RadioListTile<String>(
                    title: const Text(
                      'Düşük',
                      style: TextStyle(color: LoginColors.textPrimary),
                    ),
                    subtitle: const Text(
                      'Sadece önemli hatırlatmalar',
                      style: TextStyle(color: LoginColors.textSecondary),
                    ),
                    value: 'low',
                    groupValue: _notificationFrequency,
                    activeColor: LoginColors.orangeBright,
                    onChanged: (value) {
                      setState(() {
                        _notificationFrequency = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text(
                      'Orta',
                      style: TextStyle(color: LoginColors.textPrimary),
                    ),
                    subtitle: const Text(
                      'Günlük özet ve hatırlatmalar',
                      style: TextStyle(color: LoginColors.textSecondary),
                    ),
                    value: 'moderate',
                    groupValue: _notificationFrequency,
                    activeColor: LoginColors.orangeBright,
                    onChanged: (value) {
                      setState(() {
                        _notificationFrequency = value!;
                      });
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text(
                      'Yüksek',
                      style: TextStyle(color: LoginColors.textPrimary),
                    ),
                    subtitle: const Text(
                      'Tüm aktiviteler ve öneriler',
                      style: TextStyle(color: LoginColors.textSecondary),
                    ),
                    value: 'high',
                    groupValue: _notificationFrequency,
                    activeColor: LoginColors.orangeBright,
                    onChanged: (value) {
                      setState(() {
                        _notificationFrequency = value!;
                      });
                    },
                  ),
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
}

