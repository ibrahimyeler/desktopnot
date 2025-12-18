import 'package:flutter/material.dart';
import '../models/leaderboard_item.dart';

/// Leaderboard card widget with premium design
class LeaderboardCard extends StatelessWidget {
  final LeaderboardItem item;
  final bool isTopThree;
  final VoidCallback? onTap;

  const LeaderboardCard({
    super.key,
    required this.item,
    this.isTopThree = false,
    this.onTap,
  });

  Color _getRankColor() {
    switch (item.rank) {
      case 1:
        return const Color(0xFFFFD700); // Gold
      case 2:
        return const Color(0xFFC0C0C0); // Silver
      case 3:
        return const Color(0xFFCD7F32); // Bronze
      default:
        return const Color(0xFF374151);
    }
  }

  @override
  Widget build(BuildContext context) {
    final rankColor = _getRankColor();
    final isTopThree = item.rank <= 3;

    if (isTopThree && this.isTopThree) {
      // Premium top 3 card design
      return _buildTopThreeCard(rankColor);
    }

    // Regular leaderboard card
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF1F2937),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: item.isCurrentUser
                ? const Color(0xFFFFB800)
                : const Color(0xFF374151),
            width: item.isCurrentUser ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            // Rank
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: rankColor.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: rankColor, width: 2),
              ),
              child: Center(
                child: Text(
                  '#${item.rank}',
                  style: TextStyle(
                    color: rankColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            // Avatar
            CircleAvatar(
              radius: 28,
              backgroundColor: rankColor.withOpacity(0.2),
              backgroundImage: item.avatar != null
                  ? NetworkImage(item.avatar!)
                  : null,
              child: item.avatar == null
                  ? Text(
                      item.displayName[0].toUpperCase(),
                      style: TextStyle(
                        color: rankColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 16),
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Flexible(
                        child: Text(
                          item.displayName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (item.isCurrentUser) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFB800).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: const Color(0xFFFFB800),
                              width: 1,
                            ),
                          ),
                          child: const Text(
                            'Sen',
                            style: TextStyle(
                              color: Color(0xFFFFB800),
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (item.badge != null) ...[
                        Text(
                          item.badge!,
                          style: TextStyle(
                            color: Colors.grey[400],
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '·',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        const SizedBox(width: 8),
                      ],
                      Text(
                        'Level ${item.level}',
                        style: TextStyle(
                          color: Colors.grey[400],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Points
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.star,
                      color: Color(0xFFFFB800),
                      size: 18,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '${item.points}',
                      style: const TextStyle(
                        color: Color(0xFFFFB800),
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  '${item.posts} gönderi',
                  style: TextStyle(
                    color: Colors.grey[500],
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopThreeCard(Color rankColor) {
    return Column(
      children: [
        Stack(
          alignment: Alignment.topCenter,
          children: [
            Container(
              width: item.rank == 1 ? 100 : 80,
              height: item.rank == 1 ? 100 : 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    rankColor.withOpacity(0.3),
                    rankColor.withOpacity(0.1),
                  ],
                ),
                border: Border.all(
                  color: rankColor,
                  width: 3,
                ),
                boxShadow: [
                  BoxShadow(
                    color: rankColor.withOpacity(0.5),
                    blurRadius: 12,
                    spreadRadius: 2,
                  ),
                ],
              ),
              child: Center(
                child: item.avatar != null
                    ? ClipOval(
                        child: Image.network(
                          item.avatar!,
                          width: double.infinity,
                          height: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      )
                    : Text(
                        item.displayName[0].toUpperCase(),
                        style: TextStyle(
                          color: rankColor,
                          fontSize: item.rank == 1 ? 36 : 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            Positioned(
              top: -8,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: rankColor,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: [
                    BoxShadow(
                      color: rankColor.withOpacity(0.5),
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      item.rankEmoji,
                      style: const TextStyle(fontSize: 16),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '#${item.rank}',
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          item.displayName,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        const SizedBox(height: 6),
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.star,
              color: rankColor,
              size: 16,
            ),
            const SizedBox(width: 4),
            Text(
              '${item.points}',
              style: TextStyle(
                color: rankColor,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

