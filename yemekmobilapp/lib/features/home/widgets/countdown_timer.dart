import 'package:flutter/material.dart';
import 'dart:async';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/constants/app_sizes.dart';
import '../../../../core/utils/time_utils.dart';

class CountdownTimer extends StatefulWidget {
  final DateTime deadline;

  const CountdownTimer({
    super.key,
    required this.deadline,
  });

  @override
  State<CountdownTimer> createState() => _CountdownTimerState();
}

class _CountdownTimerState extends State<CountdownTimer> {
  Timer? _timer;
  Duration _remaining = Duration.zero;

  @override
  void initState() {
    super.initState();
    _updateTimer();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateTimer();
    });
  }

  void _updateTimer() {
    final remaining = TimeUtils.getTimeRemaining(widget.deadline);
    if (mounted) {
      setState(() {
        _remaining = remaining;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final hasPassed = _remaining.inSeconds <= 0;
    
    return Container(
      padding: const EdgeInsets.all(AppSizes.paddingM),
      decoration: BoxDecoration(
        color: hasPassed ? AppColors.error.withOpacity(0.1) : AppColors.warning.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppSizes.radiusM),
        border: Border.all(
          color: hasPassed ? AppColors.error : AppColors.warning,
          width: 1,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            hasPassed ? Icons.error_outline : Icons.access_time,
            color: hasPassed ? AppColors.error : AppColors.warning,
            size: AppSizes.iconM,
          ),
          const SizedBox(width: AppSizes.paddingS),
          Text(
            hasPassed
                ? 'Süre doldu'
                : 'Kalan süre: ${TimeUtils.formatDurationLong(_remaining.inSeconds)}',
            style: TextStyle(
              color: hasPassed ? AppColors.error : AppColors.warning,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

