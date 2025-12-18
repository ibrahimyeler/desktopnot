import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../features/auth/screens/splash_screen.dart';
import '../../features/auth/screens/welcome_screen.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/auth/screens/forgot_password_screen.dart';
import '../../features/auth/screens/terms_privacy_screen.dart';
import '../../features/auth/screens/oauth_connect_screen.dart';
import '../../features/auth/screens/magic_link_login_screen.dart';
import '../../features/auth/screens/verify_code_screen.dart';
import '../../features/auth/screens/reset_password_screen.dart';
import '../../features/auth/screens/two_factor_setup_screen.dart';
import '../../features/auth/screens/two_factor_verify_screen.dart';
import '../../features/auth/screens/session_expired_screen.dart';
import '../../features/auth/screens/logout_confirm_screen.dart';
import '../../features/auth/screens/account_reactivation_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/home/screens/voice_coach_overlay_screen.dart';
import '../../features/home/screens/today_summary_screen.dart';
import '../../features/home/screens/recent_activity_detail_screen.dart';
import '../../features/home/screens/quick_actions_menu_screen.dart';
import '../../features/coaches/screens/coach_list_screen.dart';
import '../../features/methods/screens/methods_list_screen.dart';
import '../../features/methods/screens/method_detail_screen.dart';
import '../../features/methods/screens/method_start_screen.dart';
import '../../features/methods/screens/method_daily_plan_screen.dart';
import '../../features/methods/screens/method_chat_screen.dart';
import '../../features/methods/screens/method_report_screen.dart';
import '../../features/methods/screens/chain_breaker_screen.dart';
import '../../features/methods/screens/pomodoro_timer_screen.dart';
import '../../features/methods/screens/time_blocking_screen.dart';
import '../../features/tasks/screens/tasks_list_screen.dart';
import '../../features/tasks/screens/task_detail_screen.dart';
import '../../features/tasks/screens/create_task_screen.dart';
import '../../features/tasks/screens/edit_task_screen.dart';
import '../../features/notes/screens/notes_list_screen.dart';
import '../../features/notes/screens/note_detail_screen.dart';
import '../../features/notes/screens/create_note_screen.dart';
import '../../features/notes/screens/edit_note_screen.dart';
import '../../features/goals/screens/goals_list_screen.dart';
import '../../features/goals/screens/goal_detail_screen.dart';
import '../../features/goals/screens/create_goal_screen.dart';
import '../../features/goals/screens/goal_report_screen.dart';
import '../../features/community/screens/post_detail_screen.dart';
import '../../features/community/screens/create_post_screen.dart';
import '../../features/community/screens/category_filter_screen.dart';
import '../../features/community/screens/report_post_screen.dart';
import '../../features/community/screens/community_guidelines_screen.dart';
import '../../features/community/providers/feed_provider.dart';
import '../../features/community/providers/post_provider.dart';
import '../../features/community/providers/category_provider.dart';
import '../../features/community/providers/leaderboard_provider.dart';
import '../../features/profile/screens/ai_model_settings_screen.dart';
import '../../features/profile/screens/voice_settings_screen.dart';
import '../../features/profile/screens/account_management_screen.dart';
import '../../features/profile/screens/subscription_screen.dart';
import '../../features/profile/screens/edit_profile_screen.dart';
import '../../features/profile/screens/analytics_report_screen.dart';
import '../../features/profile/screens/notifications_screen.dart';
import '../../features/profile/screens/theme_screen.dart';
import '../../features/profile/screens/language_screen.dart';
import '../../features/voice/screens/transcript_history_screen.dart';
import '../../features/voice/screens/voice_mode_settings_screen.dart';
import '../../features/onboarding/screens/onboarding_intro_screen.dart';
import '../../features/onboarding/screens/onboarding_slide1_screen.dart';
import '../../features/onboarding/screens/onboarding_slide2_screen.dart';
import '../../features/onboarding/screens/onboarding_slide3_screen.dart';
import '../../features/onboarding/screens/onboarding_finish_screen.dart';
import '../../features/onboarding/screens/onboarding_purpose_screen.dart';
import '../../features/onboarding/screens/onboarding_development_areas_screen.dart';
import '../../features/onboarding/screens/onboarding_daily_routine_screen.dart';
import '../../features/onboarding/screens/onboarding_learning_style_screen.dart';
import '../../features/onboarding/screens/onboarding_notification_permission_screen.dart';
import '../../features/onboarding/screens/onboarding_premium_offer_screen.dart';
import '../../features/onboarding/screens/focus_coach_config_screen.dart';
import '../../features/onboarding/screens/english_coach_intro_screen.dart';
import '../../features/onboarding/screens/english_coach_assessment_screen.dart';
import '../../features/onboarding/screens/english_coach_speaking_test_screen.dart';
import '../../features/onboarding/screens/coach_setup_completed_screen.dart';
import '../../features/onboarding/screens/lina_onboarding_screen.dart';
import '../../features/onboarding/screens/onboarding_summary_screen.dart';
import '../../features/home/screens/agenda_detail_screen.dart';
import '../../features/home/screens/ceo_coach_chat_screen.dart';
import '../../features/home/screens/ceo_voice_chat_screen.dart';
import '../../features/home/screens/daily_summary_screen.dart';
import '../../features/home/screens/weekly_summary_screen.dart';
import '../../features/home/screens/monthly_insights_screen.dart';
import '../../features/home/screens/productivity_heatmap_screen.dart';
import '../../features/home/screens/daily_plan_screen.dart';
import '../../features/home/screens/routine_builder_screen.dart';
import '../../features/debug/screens/debug_menu_screen.dart';
import '../../features/debug/screens/cache_inspector_screen.dart';
import '../../features/debug/screens/ai_provider_test_screen.dart';
import '../../features/coaches/screens/coach_detail_screen.dart';
import '../../features/coaches/screens/coach_chat_screen.dart';
import '../../features/coaches/screens/coach_overview_screen.dart';
import '../../features/coaches/screens/coach_tasks_screen.dart';
import '../../features/coaches/screens/coach_goals_screen.dart';
import '../../features/coaches/screens/coach_notes_screen.dart';
import '../../features/coaches/screens/coach_exercises_screen.dart';
import '../../features/coaches/screens/coach_progress_screen.dart';
import '../../features/community/screens/community_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import 'main_layout.dart';
import 'route_names.dart';

/// Main GoRouter configuration
final GoRouter appRouter = GoRouter(
  initialLocation: AppRoutes.splash,
  routes: [
    // Splash
    GoRoute(
      path: AppRoutes.splash,
      builder: (context, state) => const SplashScreen(),
    ),

    // Auth Flow
    GoRoute(
      path: AppRoutes.login,
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: AppRoutes.register,
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: AppRoutes.forgotPassword,
      builder: (context, state) => const ForgotPasswordScreen(),
    ),
    GoRoute(
      path: AppRoutes.termsPrivacy,
      builder: (context, state) => const TermsPrivacyScreen(),
    ),
    GoRoute(
      path: AppRoutes.welcome,
      builder: (context, state) => const WelcomeScreen(),
    ),
    GoRoute(
      path: AppRoutes.oauthConnect,
      builder: (context, state) {
        final provider = state.uri.queryParameters['provider'];
        return OAuthConnectScreen(provider: provider);
      },
    ),
    GoRoute(
      path: AppRoutes.magicLinkLogin,
      builder: (context, state) => const MagicLinkLoginScreen(),
    ),
    GoRoute(
      path: AppRoutes.verifyCode,
      builder: (context, state) {
        final email = state.uri.queryParameters['email'] ?? '';
        final purpose = state.uri.queryParameters['purpose'] ?? 'magic_link';
        return VerifyCodeScreen(email: email, purpose: purpose);
      },
    ),
    GoRoute(
      path: AppRoutes.resetPassword,
      builder: (context, state) {
        final email = state.uri.queryParameters['email'];
        final code = state.uri.queryParameters['code'];
        return ResetPasswordScreen(email: email, code: code);
      },
    ),
    GoRoute(
      path: AppRoutes.twoFactorSetup,
      builder: (context, state) => const TwoFactorSetupScreen(),
    ),
    GoRoute(
      path: AppRoutes.twoFactorVerify,
      builder: (context, state) {
        final secret = state.uri.queryParameters['secret'];
        return TwoFactorVerifyScreen(secret: secret);
      },
    ),
    GoRoute(
      path: AppRoutes.sessionExpired,
      builder: (context, state) => const SessionExpiredScreen(),
    ),
    GoRoute(
      path: AppRoutes.logoutConfirm,
      builder: (context, state) => const LogoutConfirmScreen(),
    ),
    GoRoute(
      path: AppRoutes.accountReactivation,
      builder: (context, state) => const AccountReactivationScreen(),
    ),

    // Onboarding Flow
    GoRoute(
      path: AppRoutes.onboardingIntro,
      builder: (context, state) => const OnboardingIntroScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingSlide1,
      builder: (context, state) => const OnboardingSlide1Screen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingSlide2,
      builder: (context, state) => const OnboardingSlide2Screen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingSlide3,
      builder: (context, state) => const OnboardingSlide3Screen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingFinish,
      builder: (context, state) => const OnboardingFinishScreen(),
    ),

    // User Onboarding Routes
    GoRoute(
      path: AppRoutes.onboardingPurpose,
      builder: (context, state) => const OnboardingPurposeScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingDevelopmentAreas,
      builder: (context, state) => const OnboardingDevelopmentAreasScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingDailyRoutine,
      builder: (context, state) => const OnboardingDailyRoutineScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingLearningStyle,
      builder: (context, state) => const OnboardingLearningStyleScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingNotificationPermission,
      builder: (context, state) => const OnboardingNotificationPermissionScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingPremiumOffer,
      builder: (context, state) => const OnboardingPremiumOfferScreen(),
    ),
    GoRoute(
      path: AppRoutes.onboardingSummary,
      builder: (context, state) => const OnboardingSummaryScreen(),
    ),

    // Coach Onboarding Routes
    GoRoute(
      path: AppRoutes.focusCoachIntro,
      builder: (context, state) => LinaOnboardingScreen(
        onComplete: (data) {
          // Navigate to next step
          context.push(AppRoutes.focusCoachConfig);
        },
      ),
    ),
    GoRoute(
      path: AppRoutes.focusCoachConfig,
      builder: (context, state) => const FocusCoachConfigScreen(),
    ),
    GoRoute(
      path: AppRoutes.englishCoachIntro,
      builder: (context, state) => const EnglishCoachIntroScreen(),
    ),
    GoRoute(
      path: AppRoutes.englishCoachAssessment,
      builder: (context, state) => const EnglishCoachAssessmentScreen(),
    ),
    GoRoute(
      path: AppRoutes.englishCoachSpeakingTest,
      builder: (context, state) => const EnglishCoachSpeakingTestScreen(),
    ),
    GoRoute(
      path: AppRoutes.coachSetupCompleted,
      builder: (context, state) => const CoachSetupCompletedScreen(),
    ),

    // Main Shell (Bottom Navigation)
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) {
        return MainLayout(navShell: navigationShell);
      },
      branches: [
        // Home Tab
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.home,
              builder: (context, state) => const HomeScreen(),
            ),
            GoRoute(
              path: AppRoutes.voiceCoach,
              builder: (context, state) => const VoiceCoachOverlayScreen(),
            ),
            GoRoute(
              path: AppRoutes.agendaDetail,
              builder: (context, state) => const AgendaDetailScreen(),
            ),
            GoRoute(
              path: AppRoutes.todaySummary,
              builder: (context, state) => const TodaySummaryScreen(),
            ),
            GoRoute(
              path: AppRoutes.ceoCoachChat,
              builder: (context, state) => const CeoCoachChatScreen(),
            ),
            GoRoute(
              path: AppRoutes.ceoVoiceChat,
              builder: (context, state) => const CeoVoiceChatScreen(),
            ),
            GoRoute(
              path: AppRoutes.dailySummary,
              builder: (context, state) => const DailySummaryScreen(),
            ),
            GoRoute(
              path: AppRoutes.weeklySummary,
              builder: (context, state) => const WeeklySummaryScreen(),
            ),
            GoRoute(
              path: AppRoutes.monthlyInsights,
              builder: (context, state) => const MonthlyInsightsScreen(),
            ),
            GoRoute(
              path: AppRoutes.productivityHeatmap,
              builder: (context, state) => const ProductivityHeatmapScreen(),
            ),
            GoRoute(
              path: AppRoutes.dailyPlan,
              builder: (context, state) => const DailyPlanScreen(),
            ),
            GoRoute(
              path: AppRoutes.routineBuilder,
              builder: (context, state) => const RoutineBuilderScreen(),
            ),
            GoRoute(
              path: AppRoutes.recentActivityDetail,
              builder: (context, state) => const RecentActivityDetailScreen(),
            ),
            GoRoute(
              path: AppRoutes.quickActionsMenu,
              builder: (context, state) => const QuickActionsMenuScreen(),
            ),
          ],
        ),

        // Coaches Tab
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.coaches,
              builder: (context, state) => const CoachListScreen(),
            ),
            GoRoute(
              path: '/coaches/:id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return CoachDetailScreen(coachId: id);
              },
              routes: [
                GoRoute(
                  path: 'chat',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachChatScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'overview',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachOverviewScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'tasks',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachTasksScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'goals',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachGoalsScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'notes',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachNotesScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'exercises',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachExercisesScreen(coachId: id);
                  },
                ),
                GoRoute(
                  path: 'progress',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CoachProgressScreen(coachId: id);
                  },
                ),
              ],
            ),
          ],
        ),

        // Community Tab
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.community,
              builder: (context, state) => MultiProvider(
                providers: [
                  ChangeNotifierProvider(create: (_) => FeedProvider()),
                  ChangeNotifierProvider(create: (_) => CategoryProvider()),
                  ChangeNotifierProvider(create: (_) => LeaderboardProvider()),
                ],
                child: const CommunityScreen(),
              ),
            ),
            GoRoute(
              path: '/community/post/:id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return ChangeNotifierProvider(
                  create: (_) => PostProvider()..loadPost(id),
                  child: PostDetailScreen(postId: id),
                );
              },
            ),
            GoRoute(
              path: AppRoutes.createPost,
              builder: (context, state) => MultiProvider(
                providers: [
                  ChangeNotifierProvider(create: (_) => CategoryProvider()),
                  ChangeNotifierProvider(create: (_) => FeedProvider()),
                ],
                child: const CreatePostScreen(),
              ),
            ),
            GoRoute(
              path: AppRoutes.categoryFilter,
              builder: (context, state) => const CategoryFilterScreen(),
            ),
            GoRoute(
              path: AppRoutes.reportPost,
              builder: (context, state) => const ReportPostScreen(),
            ),
            GoRoute(
              path: AppRoutes.communityGuidelines,
              builder: (context, state) => const CommunityGuidelinesScreen(),
            ),
          ],
        ),

        // Profile Tab
        StatefulShellBranch(
          routes: [
            GoRoute(
              path: AppRoutes.profile,
              builder: (context, state) => const ProfileScreen(),
            ),
            GoRoute(
              path: AppRoutes.tasks,
              builder: (context, state) => const TasksListScreen(),
            ),
            GoRoute(
              path: '/tasks/:id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return TaskDetailScreen(taskId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.createTask,
              builder: (context, state) => const CreateTaskScreen(),
            ),
            GoRoute(
              path: '/tasks/:id/edit',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return EditTaskScreen(taskId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.notes,
              builder: (context, state) => const NotesListScreen(),
            ),
            GoRoute(
              path: '/notes/:id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return NoteDetailScreen(noteId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.createNote,
              builder: (context, state) => const CreateNoteScreen(),
            ),
            GoRoute(
              path: '/notes/:id/edit',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return EditNoteScreen(noteId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.goals,
              builder: (context, state) => const GoalsListScreen(),
            ),
            GoRoute(
              path: '/goals/:id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return GoalDetailScreen(goalId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.createGoal,
              builder: (context, state) => const CreateGoalScreen(),
            ),
            GoRoute(
              path: '/goals/:id/report',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return GoalReportScreen(goalId: id);
              },
            ),
            GoRoute(
              path: AppRoutes.notificationSettings,
              builder: (context, state) => const NotificationsScreen(),
            ),
            GoRoute(
              path: AppRoutes.themeSettings,
              builder: (context, state) => const ThemeScreen(),
            ),
            GoRoute(
              path: AppRoutes.languageSettings,
              builder: (context, state) => const LanguageScreen(),
            ),
            GoRoute(
              path: AppRoutes.aiModelSettings,
              builder: (context, state) => const AiModelSettingsScreen(),
            ),
            GoRoute(
              path: AppRoutes.voiceSettings,
              builder: (context, state) => const VoiceSettingsScreen(),
            ),
            GoRoute(
              path: AppRoutes.accountManagement,
              builder: (context, state) => const AccountManagementScreen(),
            ),
            GoRoute(
              path: AppRoutes.subscription,
              builder: (context, state) => const SubscriptionScreen(),
            ),
            GoRoute(
              path: AppRoutes.editProfile,
              builder: (context, state) => const EditProfileScreen(),
            ),
            GoRoute(
              path: AppRoutes.profileAnalytics,
              builder: (context, state) => const AnalyticsReportScreen(),
            ),
            // Voice routes (outside shell for overlay)
            GoRoute(
              path: AppRoutes.voiceTranscriptHistory,
              builder: (context, state) => const TranscriptHistoryScreen(),
            ),
            GoRoute(
              path: AppRoutes.voiceModeSettings,
              builder: (context, state) => const VoiceModeSettingsScreen(),
            ),
          ],
        ),
      ],
    ),

    // Methods routes (not in bottom navigation, accessed via push)
    GoRoute(
      path: AppRoutes.methods,
      builder: (context, state) => const MethodsListScreen(),
    ),
    GoRoute(
      path: '/methods/:id',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MethodDetailScreen(methodId: id);
      },
    ),
    GoRoute(
      path: '/methods/:id/start',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MethodStartScreen(methodId: id);
      },
    ),
    GoRoute(
      path: '/methods/:id/daily-plan',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MethodDailyPlanScreen(methodId: id);
      },
    ),
    GoRoute(
      path: '/methods/:id/chat',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MethodChatScreen(methodId: id);
      },
    ),
    GoRoute(
      path: '/methods/:id/report',
      builder: (context, state) {
        final id = state.pathParameters['id']!;
        return MethodReportScreen(methodId: id);
      },
    ),
    GoRoute(
      path: AppRoutes.chainBreaker,
      builder: (context, state) => const ChainBreakerScreen(),
    ),
    GoRoute(
      path: AppRoutes.pomodoroTimer,
      builder: (context, state) => const PomodoroTimerScreen(),
    ),
    GoRoute(
      path: AppRoutes.timeBlocking,
      builder: (context, state) => const TimeBlockingScreen(),
    ),

    // Debug routes
    GoRoute(
      path: AppRoutes.debugMenu,
      builder: (context, state) => const DebugMenuScreen(),
    ),
    GoRoute(
      path: AppRoutes.cacheInspector,
      builder: (context, state) => const CacheInspectorScreen(),
    ),
    GoRoute(
      path: AppRoutes.aiProviderTest,
      builder: (context, state) => const AiProviderTestScreen(),
    ),
  ],
);

