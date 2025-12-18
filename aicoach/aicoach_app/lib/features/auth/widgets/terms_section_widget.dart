import 'package:flutter/material.dart';

/// Terms Section Widget - Terms of service content
class TermsSectionWidget extends StatelessWidget {
  const TermsSectionWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Kullanım Koşulları',
          style: TextStyle(
            color: Color(0xFF818CF8),
            fontSize: 22,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          '''Gofocus uygulamasını kullanarak aşağıdaki şartları kabul etmiş sayılırsınız:

1. Hesap Sorumluluğu
   • Hesabınızın güvenliğinden siz sorumlusunuz.
   • Şifrenizi kimseyle paylaşmayın.

2. Kullanım Kuralları
   • Uygulamayı yasalara aykırı amaçlarla kullanmayın.
   • Diğer kullanıcılara zarar verecek içerik paylaşmayın.

3. Hizmet Değişiklikleri
   • Uygulama özellikleri önceden haber verilmeksizin değiştirilebilir.
   • Hizmet kesintilerinden sorumlu değiliz.''',
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.8),
            fontSize: 14,
            height: 1.6,
            fontWeight: FontWeight.w300,
            letterSpacing: 0.2,
          ),
        ),
      ],
    );
  }
}

