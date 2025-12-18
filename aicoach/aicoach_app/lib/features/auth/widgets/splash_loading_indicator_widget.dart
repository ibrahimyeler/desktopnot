import 'package:flutter/material.dart';

/// Splash Loading Indicator Widget - Minimal progress indicator
class SplashLoadingIndicatorWidget extends StatefulWidget {
  final Animation<double> fadeAnimation;

  const SplashLoadingIndicatorWidget({
    super.key,
    required this.fadeAnimation,
  });

  @override
  State<SplashLoadingIndicatorWidget> createState() => _SplashLoadingIndicatorWidgetState();
}

class _SplashLoadingIndicatorWidgetState extends State<SplashLoadingIndicatorWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _progressAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );

    _progressAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([widget.fadeAnimation, _progressAnimation]),
      builder: (context, child) {
        return Opacity(
          opacity: widget.fadeAnimation.value * 0.6,
          child: SizedBox(
            width: 120,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(2),
              child: LinearProgressIndicator(
                value: _progressAnimation.value,
                backgroundColor: Colors.white.withValues(alpha: 0.15),
                valueColor: AlwaysStoppedAnimation<Color>(
                  Colors.white.withValues(alpha: 0.6),
                ),
                minHeight: 2,
              ),
            ),
          ),
        );
      },
    );
  }
}
