// Auth & User Types
export type UserRole = "super_admin" | "support" | "accounting" | "operations";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
}

// Catering Types
export type ContractStatus = "active" | "pending" | "suspended" | "expired";
export type SubscriptionPlan = "basic" | "premium" | "enterprise";

export interface Catering {
  id: string;
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  taxOffice: string;
  authorizedPerson: string;
  authorizedPersonPhone: string;
  contractStartDate: Date;
  contractEndDate: Date;
  subscriptionPlan: SubscriptionPlan;
  status: "active" | "inactive" | "suspended";
  rating: number;
  menuEnabled: boolean;
  dailyMaxCapacity: number;
  linkedCompanies: string[];
  createdAt: Date;
}

// Company Types
export type ContractType = "monthly" | "yearly";

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address: string;
  sector: string;
  employeeCount: number;
  capacity: number;
  location: string;
  contractType: ContractType;
  subscriptionPlan: SubscriptionPlan;
  workDays: number[]; // 1-7, Monday to Sunday
  adminId: string;
  adminEmail: string;
  adminName: string;
  cateringId?: string;
  cateringName?: string;
  favoriteMenus: string[];
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  companyId: string;
  companyName: string;
  allergens: string[];
  status: "active" | "inactive";
  hasOrderedToday: boolean;
  createdAt: Date;
}

// Menu & Food Types
export type FoodCategory = "soup" | "main" | "dessert" | "vegan" | "vegetarian" | "salad";

export interface FoodItem {
  id: string;
  name: string;
  nameTr: string;
  calories?: number;
  allergens: string[];
  photo?: string;
  category: FoodCategory;
  description?: string;
}

export interface Menu {
  id: string;
  cateringId: string;
  cateringName: string;
  date: Date;
  items: MenuItem[];
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: Date;
}

export interface MenuItem {
  foodItemId: string;
  foodItem: FoodItem;
  price?: number;
}

export type Allergen = 
  | "gluten" 
  | "dairy" 
  | "eggs" 
  | "fish" 
  | "shellfish" 
  | "nuts" 
  | "peanuts" 
  | "soy" 
  | "sesame";

// Order Types
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
export type DeliveryMethod = "qr" | "manual";

export interface Order {
  id: string;
  employeeId: string;
  employeeName: string;
  companyId: string;
  companyName: string;
  cateringId: string;
  cateringName: string;
  menuItemId: string;
  menuItemName: string;
  date: Date;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  qrCode?: string;
  deliveredAt?: Date;
  createdAt: Date;
}

// Delivery & QR Types
export interface QRLog {
  id: string;
  employeeId: string;
  employeeName: string;
  orderId: string;
  cateringId: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
  ipAddress?: string;
}

export interface DeliveryReport {
  date: Date;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  hourlyDeliveryRate: { hour: number; count: number }[];
  completionPercentage: number;
}

// Pricing & Payment Types
export interface SubscriptionPlanDetail {
  id: string;
  name: string;
  type: "catering" | "company";
  price: number;
  currency: "TRY" | "USD" | "EUR";
  limits: {
    users?: number;
    menus?: number;
    capacity?: number;
  };
  features: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyId?: string;
  cateringId?: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "overdue";
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  pdfUrl?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: string;
  method: "stripe" | "iyzico" | "paytr" | "manual";
  status: "success" | "failed" | "pending";
  transactionId?: string;
  errorMessage?: string;
  createdAt: Date;
}

// Support & Ticket Types
export type TicketType = 
  | "food_not_hot"
  | "bad_taste"
  | "missing_delivery"
  | "allergen_not_marked"
  | "invoice_issue"
  | "app_problem"
  | "other";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";

export type TicketSource = "catering" | "company" | "employee";

export interface Ticket {
  id: string;
  ticketNumber: string;
  type: TicketType;
  source: TicketSource;
  sourceId: string; // cateringId, companyId, or employeeId
  sourceName: string;
  subject: string;
  description: string;
  status: TicketStatus;
  assignedTo?: string;
  assignedToName?: string;
  priority: "low" | "medium" | "high" | "urgent";
  notes: TicketNote[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface TicketNote {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  note: string;
  createdAt: Date;
}

// Notification Types
export type NotificationType = 
  | "order_reminder"
  | "invoice_reminder"
  | "password_reset"
  | "menu_approved"
  | "announcement"
  | "system";

export type NotificationChannel = "push" | "email" | "sms";

export interface Notification {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipientId: string;
  recipientType: "catering" | "company" | "employee" | "all";
  title: string;
  message: string;
  status: "sent" | "delivered" | "failed";
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  variables: string[];
}

// Dashboard & Reporting Types
export interface DashboardMetrics {
  totalCatering: number;
  totalCompanies: number;
  totalEmployees: number;
  todayOrders: number;
  deliveredOrders: number;
  pendingMenuApprovals: number;
}

export interface OrderTrend {
  date: string;
  count: number;
}

export interface PopularFood {
  foodItemId: string;
  foodItemName: string;
  orderCount: number;
}

export interface CateringPerformance {
  cateringId: string;
  cateringName: string;
  orderCount: number;
  averageRating: number;
  onTimeDeliveryRate: number;
}

// System Settings Types
export interface SystemSettings {
  general: {
    logo?: string;
    brandName: string;
    brandColor: string;
    emailProvider: "smtp" | "sendgrid" | "other";
    emailConfig?: Record<string, any>;
    paymentGateway: "stripe" | "iyzico" | "paytr";
    paymentConfig?: Record<string, any>;
    orderCutoffTime: string; // HH:mm format
  };
  security: {
    ipWhitelist: string[];
    apiKey: string;
    logRetentionDays: number;
    rateLimit: {
      requests: number;
      window: number; // seconds
    };
  };
}

// Log Types
export interface SystemLog {
  id: string;
  type: "admin_action" | "api" | "login" | "error";
  userId?: string;
  userName?: string;
  action: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface IntegrationLog {
  id: string;
  type: "push_notification" | "email" | "payment_webhook";
  status: "success" | "failed";
  request?: Record<string, any>;
  response?: Record<string, any>;
  errorMessage?: string;
  createdAt: Date;
}

