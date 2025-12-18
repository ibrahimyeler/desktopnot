import 'package:flutter/material.dart';

class CommunityFeaturedPostsSection extends StatelessWidget {
  const CommunityFeaturedPostsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Öne Çıkan Gönderiler',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Text(
                  'Tümünü Gör',
                  style: TextStyle(
                    color: const Color(0xFFFFB800),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        _buildFeaturedPost(
          context,
          'Finansal Bağımsızlığa Giden Yol',
          'Finansal bağımsızlığa ulaşmak için benim stratejim...',
          'Ahmet K.',
          '2 saat önce',
          '125',
          '43',
          Icons.account_balance,
        ),
        _buildFeaturedPost(
          context,
          'Haftalık Antrenman Programı',
          'Fitness hedefime ulaştım! İşte programım...',
          'Ayşe Y.',
          '5 saat önce',
          '89',
          '32',
          Icons.fitness_center,
        ),
        _buildFeaturedPost(
          context,
          'Kariyer Gelişimi İpuçları',
          'Son 6 ayda terfi aldım, deneyimlerimi paylaşıyorum...',
          'Mehmet D.',
          '1 gün önce',
          '234',
          '78',
          Icons.work,
        ),
      ],
    );
  }

  Widget _buildFeaturedPost(
    BuildContext context,
    String title,
    String content,
    String author,
    String time,
    String likes,
    String comments,
    IconData icon,
  ) {
    final color = const Color(0xFFFFB800);
    
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1F2937),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF374151),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        author,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        time,
                        style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              content,
              style: TextStyle(
                color: Colors.grey[400],
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                _buildActionButton(
                  Icons.favorite_outline,
                  likes,
                  Colors.red,
                ),
                const SizedBox(width: 16),
                _buildActionButton(
                  Icons.comment_outlined,
                  comments,
                  Colors.grey[400]!,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String count, Color color) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 4),
        Text(
          count,
          style: TextStyle(
            color: color,
            fontSize: 13,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
}

