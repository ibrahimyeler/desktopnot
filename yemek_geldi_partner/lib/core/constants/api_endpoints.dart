class ApiEndpoints {
  // Base URL
  static const String baseUrl = 'https://api.example.com';
  
  // Auth endpoints
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  
  // Dashboard endpoints
  static const String dashboard = '/dashboard';
  
  // Menu endpoints
  static const String menus = '/menus';
  static String menuById(String id) => '/menus/$id';
  
  // Order endpoints
  static const String orders = '/orders';
  static String orderById(String id) => '/orders/$id';
  static String updateOrderStatus(String id) => '/orders/$id/status';
  
  // Production endpoints
  static const String production = '/production';
  static String productionById(String id) => '/production/$id';
  
  // Delivery endpoints
  static const String deliveries = '/deliveries';
  static String deliveryById(String id) => '/deliveries/$id';
  
  // QR endpoints
  static const String qrGenerate = '/qr/generate';
  static const String qrScan = '/qr/scan';
  
  // Profile endpoints
  static const String profile = '/profile';
  static const String updateProfile = '/profile/update';
}

