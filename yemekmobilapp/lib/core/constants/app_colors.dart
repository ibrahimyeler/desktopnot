import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // 🟤 ANA PALET – "AKŞAM & EV"
  
  // 1️⃣ Ana Renk (Primary) - Sıcak Koyu Toprak / Terracotta
  static const Color primary = Color(0xFF8B4A3B); // Ev yemeği, fırın, tencere, akşam ışığı
  static const Color primaryDark = Color(0xFF6B3A2B); // Daha koyu ton
  static const Color primaryLight = Color(0xFFB56A5A); // Daha açık ton
  // primaryAccent artık kullanılmıyor, doğrudan primary.withOpacity(0.15) kullanılacak

  // 2️⃣ İkincil Renk (Secondary) - Koyu Zeytin Yeşili
  static const Color secondary = Color(0xFF4F5D4A); // Doğallık, sağlık, dengelenmiş şehir hayatı
  static const Color secondaryDark = Color(0xFF3D4A3A);
  static const Color secondaryLight = Color(0xFF6B7A5A);

  // 3️⃣ Arka Plan (Background) - Sıcak Kırık Beyaz
  static const Color background = Color(0xFFF6F1EC); // Ev duvarı, sakinlik, okunabilirlik

  // 4️⃣ Kart & Yüzey Rengi - Açık Bej
  static const Color surface = Color(0xFFEDE3DA); // Sofra, seramik, doğallık
  static const Color surfaceDark = Color(0xFF1F2937);

  // 5️⃣ Metin – Ana - Koyu Kömür
  static const Color textPrimary = Color(0xFF2E2E2E); // Ciddiyet, güven, premium

  // 6️⃣ Metin – İkincil - Yumuşak Gri
  static const Color textSecondary = Color(0xFF7A7A7A); // Açıklamalar, notlar, yardım metinleri
  static const Color textDisabled = Color(0xFFB8B8B8);

  // Accent Colors - Primary kullanılacak
  static const Color accent = Color(0xFF8B4A3B); // Primary ile aynı
  static const Color accentLight = Color(0xFFB56A5A);

  // Bottom Navigation Colors - Primary temalı
  static const Color bottomNavSelected = Color(0xFF8B4A3B); // Primary
  static const Color bottomNavUnselected = Color(0xFF7A7A7A); // Text secondary
  static const Color bottomNavBackground = Color(0xFFEDE3DA); // Surface

  // 🟢 DURUM RENKLERİ (ÇOK SINIRLI KULLAN)
  static const Color success = Color(0xFF6B8E23); // Soft Olive - Başarılı / Tamamlandı
  static const Color warning = Color(0xFFC48A3A); // Amber-kahve arası - Uyarı (yumuşak)
  static const Color error = Color(0xFFA94442); // Koyu bordo - Hata (çok nadir)

  // Border & Divider - Sıcak tonlar
  static const Color border = Color(0xFFE5D9D0); // Açık bej tonu
  static const Color divider = Color(0xFFD8CCC3);
}
