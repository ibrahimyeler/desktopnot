import 'package:flutter/material.dart';

class RecentChatsSection extends StatelessWidget {
  const RecentChatsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Son Konuşmalar',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
            TextButton(
              onPressed: () {},
              child: const Text('Tümünü Gör'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _AnimatedRecentChatItem(
          title: '💰 Finans Koçu',
          subtitle: 'Bütçe planlaması hakkında...',
          time: '2 dk önce',
          color: const Color(0xFF10B981),
          delay: const Duration(milliseconds: 200),
        ),
        _AnimatedRecentChatItem(
          title: '💪 Spor Koçu',
          subtitle: 'Antrenman planı hazırladım...',
          time: '1 saat önce',
          color: const Color(0xFFF59E0B),
          delay: const Duration(milliseconds: 400),
        ),
      ],
    );
  }
}

class _AnimatedRecentChatItem extends StatefulWidget {
  final String title;
  final String subtitle;
  final String time;
  final Color color;
  final Duration delay;

  const _AnimatedRecentChatItem({
    required this.title,
    required this.subtitle,
    required this.time,
    required this.color,
    required this.delay,
  });

  @override
  State<_AnimatedRecentChatItem> createState() =>
      _AnimatedRecentChatItemState();
}

class _AnimatedRecentChatItemState extends State<_AnimatedRecentChatItem>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0.3, 0),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    Future.delayed(widget.delay, () {
      if (mounted) {
        _controller.forward();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: SlideTransition(
        position: _slideAnimation,
        child: _RecentChatItem(
          title: widget.title,
          subtitle: widget.subtitle,
          time: widget.time,
          color: widget.color,
        ),
      ),
    );
  }
}

class _RecentChatItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final String time;
  final Color color;

  const _RecentChatItem({
    required this.title,
    required this.subtitle,
    required this.time,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.withValues(alpha: 0.1)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: CircleAvatar(
          radius: 24,
          backgroundColor: color.withValues(alpha: 0.1),
          child: Text(
            title.split(' ')[0],
            style: TextStyle(
              fontSize: 20,
              color: color,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(
          subtitle,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(fontSize: 13, color: Colors.grey[600]),
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              time,
              style: TextStyle(fontSize: 12, color: Colors.grey[500]),
            ),
            const SizedBox(height: 4),
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

