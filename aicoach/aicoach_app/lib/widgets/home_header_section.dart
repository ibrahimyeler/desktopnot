import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home/home_notification_button.dart';
import 'home/home_profile_avatar.dart';
import 'home/home_greeting_text.dart';
import 'home/home_colors.dart';

/// Home Screen Header Section
class HomeHeaderSection extends StatefulWidget {
  const HomeHeaderSection({super.key});

  @override
  State<HomeHeaderSection> createState() => _HomeHeaderSectionState();
}

class _HomeHeaderSectionState extends State<HomeHeaderSection>
    with WidgetsBindingObserver {
  String _userName = 'Kullanıcı';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadUserName();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      // Uygulama geri döndüğünde sayacı güncellemek için state'i yenile
      setState(() {});
    }
  }

  Future<void> _loadUserName() async {
    final prefs = await SharedPreferences.getInstance();
    final userName = prefs.getString('user_name') ?? 'Kullanıcı';
    if (mounted) {
      setState(() {
        _userName = userName;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      duration: const Duration(milliseconds: 800),
      tween: Tween(begin: 0.0, end: 1.0),
      curve: Curves.easeOut,
      builder: (context, value, child) {
        return Opacity(
          opacity: value,
          child: Transform.translate(
            offset: Offset(0, 20 * (1 - value)),
            child: child,
          ),
        );
      },
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          HomeGreetingText(userName: _userName),
          Row(
            children: [
              const HomeNotificationButton(),
              const SizedBox(width: 12),
              const HomeProfileAvatar(),
            ],
          ),
        ],
      ),
    );
  }
}

