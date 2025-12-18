import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Community Guidelines Screen - Community rules and guidelines
class CommunityGuidelinesScreen extends StatelessWidget {
  const CommunityGuidelinesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Topluluk Kuralları',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildGuidelineSection(
                '1. Saygılı Olun',
                'Diğer üyelere saygılı davranın. Nefret söylemi, ayrımcılık veya taciz kabul edilmez.',
                Icons.favorite,
                Colors.red,
              ),
              const SizedBox(height: 24),
              _buildGuidelineSection(
                '2. Yapıcı İçerik Paylaşın',
                'Topluluğa faydalı, yapıcı içerikler paylaşın. Spam veya yanıltıcı içerik paylaşmayın.',
                Icons.thumb_up,
                Colors.green,
              ),
              const SizedBox(height: 24),
              _buildGuidelineSection(
                '3. Gizliliği Koruyun',
                'Kişisel bilgilerinizi veya başkalarının bilgilerini paylaşmayın.',
                Icons.lock,
                Colors.blue,
              ),
              const SizedBox(height: 24),
              _buildGuidelineSection(
                '4. Telif Haklarına Saygı Gösterin',
                'Telif hakkı korumalı içerik paylaşmayın. Kendi içeriğinizi veya izin verilmiş içeriği paylaşın.',
                Icons.copyright,
                Colors.orange,
              ),
              const SizedBox(height: 24),
              _buildGuidelineSection(
                '5. Doğru Bilgi Paylaşın',
                'Yanlış veya yanıltıcı bilgi paylaşmayın. Doğrulanmış kaynaklardan bilgi paylaşın.',
                Icons.verified,
                Colors.purple,
              ),
              const SizedBox(height: 32),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: const Color(0xFF1F2937),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: const Color(0xFF374151),
                    width: 1,
                  ),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.info_outline, color: Colors.blue, size: 32),
                    const SizedBox(height: 12),
                    const Text(
                      'Kuralları İhlal Etmek',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Topluluk kurallarını ihlal eden içerikler kaldırılabilir ve hesap geçici veya kalıcı olarak askıya alınabilir.',
                      style: TextStyle(
                        color: Colors.grey[400],
                        fontSize: 14,
                        height: 1.6,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGuidelineSection(
    String title,
    String description,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: TextStyle(
                    color: Colors.grey[400],
                    fontSize: 14,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

