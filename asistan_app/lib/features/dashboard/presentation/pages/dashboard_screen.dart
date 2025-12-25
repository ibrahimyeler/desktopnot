import 'package:flutter/material.dart';
import '../widgets/stat_card.dart';
import '../widgets/progress_card.dart';
import '../widgets/quick_action_button.dart';
import '../../domain/entities/dashboard_stats.dart';
import '../../domain/repositories/dashboard_repository.dart';
import '../../domain/usecases/get_dashboard_stats_usecase.dart';
import '../../data/repositories/dashboard_repository_impl.dart';
class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  DashboardStats? _stats;
  bool _isLoading = true;

  late final GetDashboardStatsUseCase _getStatsUseCase;

  @override
  void initState() {
    super.initState();
    _initializeDependencies();
    _loadStats();
  }

  void _initializeDependencies() {
    final repository = DashboardRepositoryImpl();
    _getStatsUseCase = GetDashboardStatsUseCase(repository);
  }

  Future<void> _loadStats() async {
    try {
      final stats = await _getStatsUseCase.execute();
      setState(() {
        _stats = stats;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('İstatistikler yüklenirken hata oluştu: $e')),
        );
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadStats,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 40),
                    // Kişiselleştirilmiş hoş geldin mesajı
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Merhaba İbrahim!',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Theme.of(context).brightness == Brightness.dark
                                  ? Colors.white
                                  : Colors.grey[800],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Bugün nasıl yardımcı olabilirim?',
                            style: TextStyle(
                              fontSize: 16,
                              color: Theme.of(context).brightness == Brightness.dark
                                  ? Colors.grey[400]
                                  : Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // İstatistikler
                    if (_stats != null) ...[
                      Text(
                        'İstatistikler',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Theme.of(context).brightness == Brightness.dark
                              ? Colors.white
                              : Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),
                      GridView.count(
                        crossAxisCount: 2,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.2,
                        children: [
                          StatCard(
                            icon: Icons.check_circle,
                            title: 'Tamamlanan',
                            value: '${_stats!.completedTodos}',
                            color: Colors.green,
                          ),
                          StatCard(
                            icon: Icons.pending,
                            title: 'Bekleyen',
                            value: '${_stats!.pendingTodos}',
                            color: Colors.orange,
                          ),
                          StatCard(
                            icon: Icons.note,
                            title: 'Notlar',
                            value: '${_stats!.totalNotes}',
                            color: Colors.blue,
                          ),
                          StatCard(
                            icon: Icons.chat,
                            title: 'Sohbetler',
                            value: '${_stats!.recentChats}',
                            color: Colors.purple,
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // İlerleme
                      ProgressCard(
                        title: 'Yapılacaklar İlerlemesi',
                        progress: _stats!.todoCompletionRate,
                        progressText:
                            '${_stats!.completedTodos} / ${_stats!.totalTodos} tamamlandı',
                      ),
                      const SizedBox(height: 24),
                    ],

                    // Hızlı Erişim
                    Text(
                      'Hızlı Erişim',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).brightness == Brightness.dark
                            ? Colors.white
                            : Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 12),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.5,
                      children: [
                        QuickActionButton(
                          icon: Icons.chat,
                          label: 'Sohbet Başlat',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Sohbet sekmesine geçmek için alt menüyü kullanın'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          color: Colors.blue,
                        ),
                        QuickActionButton(
                          icon: Icons.add_task,
                          label: 'Yeni Görev',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Yapılacaklar sekmesine geçmek için alt menüyü kullanın'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          color: Colors.green,
                        ),
                        QuickActionButton(
                          icon: Icons.note_add,
                          label: 'Yeni Not',
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Notlar sekmesine geçmek için alt menüyü kullanın'),
                                duration: Duration(seconds: 2),
                              ),
                            );
                          },
                          color: Colors.orange,
                        ),
                        QuickActionButton(
                          icon: Icons.analytics,
                          label: 'İstatistikler',
                          onTap: _loadStats,
                          color: Colors.purple,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}

