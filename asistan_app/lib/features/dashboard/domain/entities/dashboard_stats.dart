class DashboardStats {
  final int totalTodos;
  final int completedTodos;
  final int pendingTodos;
  final int totalNotes;
  final int recentChats;

  DashboardStats({
    required this.totalTodos,
    required this.completedTodos,
    required this.pendingTodos,
    required this.totalNotes,
    required this.recentChats,
  });

  double get todoCompletionRate {
    if (totalTodos == 0) return 0.0;
    return completedTodos / totalTodos;
  }

  DashboardStats copyWith({
    int? totalTodos,
    int? completedTodos,
    int? pendingTodos,
    int? totalNotes,
    int? recentChats,
  }) {
    return DashboardStats(
      totalTodos: totalTodos ?? this.totalTodos,
      completedTodos: completedTodos ?? this.completedTodos,
      pendingTodos: pendingTodos ?? this.pendingTodos,
      totalNotes: totalNotes ?? this.totalNotes,
      recentChats: recentChats ?? this.recentChats,
    );
  }
}

