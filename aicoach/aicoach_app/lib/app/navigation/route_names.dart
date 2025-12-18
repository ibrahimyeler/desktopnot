/// Route names constants for type-safe navigation
class AppRoutes {
  // Auth routes
  static const String splash = '/splash';
  static const String welcome = '/welcome';
  static const String login = '/login';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String termsPrivacy = '/terms-privacy';
  static const String oauthConnect = '/oauth-connect';
  static const String magicLinkLogin = '/magic-link-login';
  static const String verifyCode = '/verify-code';
  static const String resetPassword = '/reset-password';
  static const String twoFactorSetup = '/2fa/setup';
  static const String twoFactorVerify = '/2fa/verify';
  static const String sessionExpired = '/session-expired';
  static const String logoutConfirm = '/logout-confirm';
  static const String accountReactivation = '/account-reactivation';

  // Main shell routes
  static const String home = '/home';
  static const String coaches = '/coaches';
  static const String methods = '/methods';
  static const String community = '/community';
  static const String profile = '/profile';

  // Home routes
  static const String ceoCoachChat = '/home/ceo/chat';
  static const String ceoVoiceChat = '/home/ceo/voice';
  static const String dailySummary = '/home/daily-summary';
  static const String weeklySummary = '/home/weekly-summary';
  static const String monthlyInsights = '/home/monthly-insights';
  static const String productivityHeatmap = '/home/productivity-heatmap';
  static const String dailyPlan = '/home/daily-plan';
  static const String routineBuilder = '/home/routine-builder';
  static const String agendaDetail = '/agenda-detail';
  static const String todaySummary = '/today-summary';
  static const String recentActivityDetail = '/recent-activity-detail';
  static const String quickActionsMenu = '/quick-actions-menu';
  static const String voiceCoach = '/voice-coach';

  // Coach routes
  static String coachDetail(String id) => '/coaches/$id';
  static String coachChat(String id) => '/coaches/$id/chat';
  static String coachOverview(String id) => '/coaches/$id/overview';
  static String coachTasks(String id) => '/coaches/$id/tasks';
  static String coachGoals(String id) => '/coaches/$id/goals';
  static String coachNotes(String id) => '/coaches/$id/notes';
  static String coachExercises(String id) => '/coaches/$id/exercises';
  static String coachProgress(String id) => '/coaches/$id/progress';

  // Methods routes
  static String methodDetail(String id) => '/methods/$id';
  static String methodStart(String id) => '/methods/$id/start';
  static String methodDailyPlan(String id) => '/methods/$id/daily-plan';
  static String methodChat(String id) => '/methods/$id/chat';
  static String methodReport(String id) => '/methods/$id/report';
  static const String chainBreaker = '/methods/chain-breaker';
  static const String pomodoroTimer = '/methods/pomodoro';
  static const String timeBlocking = '/methods/time-blocking';

  // Tasks routes
  static const String tasks = '/tasks';
  static String taskDetail(String id) => '/tasks/$id';
  static const String createTask = '/tasks/create';
  static String editTask(String id) => '/tasks/$id/edit';

  // Notes routes
  static const String notes = '/notes';
  static String noteDetail(String id) => '/notes/$id';
  static const String createNote = '/notes/create';
  static String editNote(String id) => '/notes/$id/edit';

  // Goals routes
  static const String goals = '/goals';
  static String goalDetail(String id) => '/goals/$id';
  static const String createGoal = '/goals/create';
  static String goalReport(String id) => '/goals/$id/report';

  // Community routes
  static String postDetail(String id) => '/community/post/$id';
  static const String createPost = '/community/post/create';
  static const String categoryFilter = '/community/category-filter';
  static const String reportPost = '/community/post/report';
  static const String communityGuidelines = '/community/guidelines';

  // Profile routes
  static const String profileSettings = '/profile/settings';
  static const String notificationSettings = '/profile/notifications';
  static const String themeSettings = '/profile/theme';
  static const String languageSettings = '/profile/language';
  static const String aiModelSettings = '/profile/ai-model';
  static const String voiceSettings = '/profile/voice';
  static const String accountManagement = '/profile/account';
  static const String subscription = '/profile/subscription';
  static const String editProfile = '/profile/edit';
  static const String profileAnalytics = '/profile/analytics';

  // Voice routes
  static const String voiceTranscriptHistory = '/voice/transcript-history';
  static const String voiceModeSettings = '/voice/settings';

  // Onboarding routes
  static const String onboardingIntro = '/onboarding/intro';
  static const String onboardingSlide1 = '/onboarding/slide/0';
  static const String onboardingSlide2 = '/onboarding/slide/1';
  static const String onboardingSlide3 = '/onboarding/slide/2';
  static const String onboardingFinish = '/onboarding/finish';
  
  // User Onboarding
  static const String onboardingPurpose = '/onboarding/purpose';
  static const String onboardingDevelopmentAreas = '/onboarding/development-areas';
  static const String onboardingDailyRoutine = '/onboarding/daily-routine';
  static const String onboardingLearningStyle = '/onboarding/learning-style';
  static const String onboardingNotificationPermission = '/onboarding/notification-permission';
  static const String onboardingPremiumOffer = '/onboarding/premium-offer';
  static const String onboardingSummary = '/onboarding/summary';
  
  // Coach Onboarding
  static const String focusCoachIntro = '/onboarding/coach/focus/intro';
  static const String focusCoachConfig = '/onboarding/coach/focus/config';
  static const String englishCoachIntro = '/onboarding/coach/english/intro';
  static const String englishCoachAssessment = '/onboarding/coach/english/assessment';
  static const String englishCoachSpeakingTest = '/onboarding/coach/english/speaking-test';
  static const String coachSetupCompleted = '/onboarding/coach/completed';

  // Debug routes
  static const String debugMenu = '/debug/menu';
  static const String cacheInspector = '/debug/cache-inspector';
  static const String aiProviderTest = '/debug/ai-provider-test';
}

