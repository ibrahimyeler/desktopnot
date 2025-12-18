import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeScreen extends StatefulWidget {
  const ThemeScreen({super.key});

  @override
  State<ThemeScreen> createState() => _ThemeScreenState();
}

class _ThemeScreenState extends State<ThemeScreen> {
  String _selectedTheme = 'system'; // system, light, dark
  String _selectedColorScheme = 'default'; // default, blue, green, purple, orange

  @override
  void initState() {
    super.initState();
    _loadThemeSettings();
  }

  Future<void> _loadThemeSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _selectedTheme = prefs.getString('theme_mode') ?? 'system';
      _selectedColorScheme = prefs.getString('color_scheme') ?? 'default';
    });
  }

  Future<void> _saveThemeSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme_mode', _selectedTheme);
    await prefs.setString('color_scheme', _selectedColorScheme);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.arrow_back_ios_new, color: Colors.grey[800], size: 18),
          ),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Tema Ayarları',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Theme Mode Section
            _buildSectionTitle('Tema Modu'),
            const SizedBox(height: 16),
            _buildThemeModeOption(
              'Otomatik',
              'Sistem ayarlarınızı takip eder',
              Icons.brightness_auto,
              'system',
            ),
            _buildThemeModeOption(
              'Açık Tema',
              'Her zaman açık tema kullan',
              Icons.light_mode,
              'light',
            ),
            _buildThemeModeOption(
              'Koyu Tema',
              'Her zaman koyu tema kullan',
              Icons.dark_mode,
              'dark',
            ),
            const SizedBox(height: 32),
            // Color Scheme Section
            _buildSectionTitle('Renk Teması'),
            const SizedBox(height: 16),
            _buildColorSchemeGrid(),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF1F2937).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.palette_outlined,
            size: 18,
            color: Colors.grey[800],
          ),
        ),
        const SizedBox(width: 12),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Color(0xFF111827),
          ),
        ),
      ],
    );
  }

  Widget _buildThemeModeOption(
    String title,
    String subtitle,
    IconData icon,
    String value,
  ) {
    final isSelected = _selectedTheme == value;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isSelected ? const Color(0xFFFFB800).withValues(alpha: 0.1) : const Color(0xFFF9FAFB),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSelected ? const Color(0xFFFFB800).withValues(alpha: 0.3) : Colors.grey[200]!,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: isSelected
                ? const Color(0xFFFFB800).withValues(alpha: 0.2)
                : Colors.grey[200],
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: isSelected ? const Color(0xFFFF8C00) : Colors.grey[600],
            size: 22,
          ),
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 15,
            color: isSelected ? const Color(0xFF111827) : Colors.grey[900],
          ),
        ),
        subtitle: Text(
          subtitle,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        trailing: isSelected
            ? Container(
                padding: const EdgeInsets.all(4),
                decoration: const BoxDecoration(
                  color: Color(0xFFFFB800),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check,
                  color: Colors.white,
                  size: 14,
                ),
              )
            : null,
        onTap: () {
          setState(() {
            _selectedTheme = value;
          });
          _saveThemeSettings();
        },
      ),
    );
  }

  Widget _buildColorSchemeGrid() {
    final schemes = [
      {
        'name': 'Varsayılan',
        'color': const Color(0xFF6366F1),
        'value': 'default',
      },
      {
        'name': 'Mavi',
        'color': const Color(0xFF3B82F6),
        'value': 'blue',
      },
      {
        'name': 'Yeşil',
        'color': const Color(0xFF10B981),
        'value': 'green',
      },
      {
        'name': 'Mor',
        'color': const Color(0xFF8B5CF6),
        'value': 'purple',
      },
      {
        'name': 'Turuncu',
        'color': const Color(0xFFF59E0B),
        'value': 'orange',
      },
      {
        'name': 'Kırmızı',
        'color': const Color(0xFFEF4444),
        'value': 'red',
      },
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1,
      ),
      itemCount: schemes.length,
      itemBuilder: (context, index) {
        final scheme = schemes[index];
        final isSelected = _selectedColorScheme == scheme['value'];
        
        return InkWell(
          onTap: () {
            setState(() {
              _selectedColorScheme = scheme['value'] as String;
            });
            _saveThemeSettings();
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            decoration: BoxDecoration(
              color: const Color(0xFFF9FAFB),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected
                    ? scheme['color'] as Color
                    : Colors.grey[200]!,
                width: isSelected ? 3 : 1,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: scheme['color'] as Color,
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  scheme['name'] as String,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.grey[900],
                  ),
                ),
                if (isSelected)
                  const Padding(
                    padding: EdgeInsets.only(top: 4),
                    child: Icon(
                      Icons.check_circle,
                      size: 16,
                      color: Color(0xFFFFB800),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }
}

