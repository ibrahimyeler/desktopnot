import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Category Filter Screen - Filter posts by category
class CategoryFilterScreen extends StatefulWidget {
  const CategoryFilterScreen({super.key});

  @override
  State<CategoryFilterScreen> createState() => _CategoryFilterScreenState();
}

class _CategoryFilterScreenState extends State<CategoryFilterScreen> {
  String? _selectedCategory;

  final List<Map<String, dynamic>> _categories = [
    {
      'name': 'Üretkenlik',
      'icon': Icons.work_outline,
      'color': Colors.orange,
      'count': 45,
    },
    {
      'name': 'Dil',
      'icon': Icons.language,
      'color': Colors.blue,
      'count': 32,
    },
    {
      'name': 'Finans',
      'icon': Icons.account_balance_wallet_outlined,
      'color': Colors.green,
      'count': 28,
    },
    {
      'name': 'Sağlık',
      'icon': Icons.favorite_outline,
      'color': Colors.red,
      'count': 19,
    },
    {
      'name': 'Genel',
      'icon': Icons.forum_outlined,
      'color': Colors.purple,
      'count': 67,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF111827),
      appBar: AppBar(
        title: const Text(
          'Kategori Filtrele',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          if (_selectedCategory != null)
            TextButton(
              onPressed: () {
                // Apply filter
                context.pop(_selectedCategory);
              },
              child: const Text(
                'Uygula',
                style: TextStyle(
                  color: Color(0xFF3B82F6),
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            _buildCategoryOption(null, 'Tümü', Icons.all_inclusive, Colors.grey, 191),
            const SizedBox(height: 12),
            ..._categories.map((category) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _buildCategoryOption(
                    category['name'] as String,
                    category['name'] as String,
                    category['icon'] as IconData,
                    category['color'] as Color,
                    category['count'] as int,
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryOption(
    String? value,
    String label,
    IconData icon,
    Color color,
    int count,
  ) {
    final isSelected = _selectedCategory == value;
    
    return GestureDetector(
      onTap: () => setState(() => _selectedCategory = value),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected
              ? color.withOpacity(0.2)
              : const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? color : const Color(0xFF374151),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
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
                    label,
                    style: TextStyle(
                      color: isSelected ? color : Colors.white,
                      fontSize: 16,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                  Text(
                    '$count gönderi',
                    style: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: Colors.white),
          ],
        ),
      ),
    );
  }
}

