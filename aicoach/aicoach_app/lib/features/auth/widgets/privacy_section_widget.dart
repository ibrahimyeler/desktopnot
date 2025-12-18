import 'package:flutter/material.dart';

/// Privacy Section Widget - Privacy policy content
class PrivacySectionWidget extends StatelessWidget {
  const PrivacySectionWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Gizlilik Politikası',
          style: TextStyle(
            color: Color(0xFF818CF8),
            fontSize: 22,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          '''Kişisel verilerinizin korunması bizim için çok önemlidir:

1. Veri Toplama
   • E-posta adresi, kullanıcı adı gibi temel bilgiler toplanır.
   • Uygulama kullanım istatistikleri anonim olarak toplanır.

2. Veri Kullanımı
   • Kişisel verileriniz sadece hizmet kalitesini artırmak için kullanılır.
   • Üçüncü şahıslarla paylaşılmaz.

3. Veri Güvenliği
   • Verileriniz şifrelenmiş olarak saklanır.
   • Güvenlik önlemleri sürekli güncellenir.

4. Haklarınız
   • Verilerinize erişim talep edebilirsiniz.
   • Hesabınızı istediğiniz zaman silebilirsiniz.

Sorularınız için: privacy@gofocus.app''',
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

