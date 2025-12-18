package api

import (
	"github.com/go-chi/chi/v5"
	"github.com/kovan/backend/internal/api/customer"
	"github.com/kovan/backend/internal/api/vendor"
	"github.com/kovan/backend/internal/api/root"
	"github.com/kovan/backend/internal/middleware/auth"
	"github.com/kovan/backend/internal/middleware/tenant"
)

// SetupCustomerRoutes sets up routes for the Customer Panel
func SetupCustomerRoutes(r chi.Router) {
	// Authentication routes (no auth required)
	r.Post("/auth/login", customer.CustomerLogin)
	r.Post("/auth/register", customer.CustomerRegister)
	
	// Public routes (no auth required)
	r.Get("/services", customer.GetServices)
	r.Get("/services/{serviceID}", customer.GetService)
	r.Get("/services/{serviceID}/availability", customer.GetServiceAvailability)
	r.Get("/translations/{locale}", customer.GetTranslations)
	r.Get("/pages/{pageSlug}", customer.GetVendorPage)
	
	// Protected routes (require JWT auth)
	r.Group(func(r chi.Router) {
		r.Use(auth.JWTAuth)
		r.Use(tenant.CustomerContext)
		
		// Booking and checkout
		r.Post("/bookings", customer.CreateBooking)
		r.Get("/bookings/{bookingID}", customer.GetBooking)
		r.Put("/bookings/{bookingID}", customer.UpdateBooking)
		r.Delete("/bookings/{bookingID}", customer.CancelBooking)
		
		// User profiles
		r.Get("/profile", customer.GetProfile)
		r.Put("/profile", customer.UpdateProfile)
	})
}

// SetupVendorRoutes sets up routes for the Vendor Admin Panel
func SetupVendorRoutes(r chi.Router) {
	// Authentication routes (no auth required)
	r.Post("/auth/login", vendor.VendorLogin)
	r.Post("/auth/register", vendor.VendorRegister)
	
	// Protected routes (require JWT auth)
	r.Group(func(r chi.Router) {
		r.Use(auth.JWTAuth)
		r.Use(tenant.VendorContext)
		
		// Profile and logout
		r.Get("/auth/profile", vendor.VendorProfile)
		r.Post("/auth/logout", vendor.VendorLogout)
		
		// Page builder
		r.Get("/pages", vendor.GetPages)
		r.Post("/pages", vendor.CreatePage)
		r.Get("/pages/{pageID}", vendor.GetPage)
		r.Put("/pages/{pageID}", vendor.UpdatePage)
		r.Delete("/pages/{pageID}", vendor.DeletePage)
		
		// Block management
		r.Get("/blocks", vendor.GetAvailableBlocks)
		r.Get("/blocks/{blockID}", vendor.GetBlock)
		
		// Catalog management
		r.Get("/catalog", vendor.GetCatalog)
		r.Post("/catalog/services", vendor.CreateService)
		r.Put("/catalog/services/{serviceID}", vendor.UpdateService)
		r.Delete("/catalog/services/{serviceID}", vendor.DeleteService)
		
		// Availability management
		r.Get("/availability", vendor.GetAvailability)
		r.Post("/availability", vendor.SetAvailability)
		
		// Payments
		r.Get("/payments", vendor.GetPayments)
		r.Get("/payments/{paymentID}", vendor.GetPayment)
		
		// Themes
		r.Get("/themes", vendor.GetThemes)
		r.Put("/themes/{themeID}", vendor.UpdateTheme)
		
		// SEO
		r.Get("/seo", vendor.GetSEO)
		r.Put("/seo", vendor.UpdateSEO)
		
		// Publishing
		r.Post("/publish", vendor.PublishVersion)
		r.Get("/versions", vendor.GetVersions)
		r.Get("/versions/{versionID}", vendor.GetVersion)
	})
}



// SetupRootRoutes sets up routes for the Root Admin Panel
func SetupRootRoutes(r chi.Router) {
	// Authentication routes (no auth required)
	r.Post("/auth/login", root.RootLogin)
	
	// Protected routes (require JWT auth)
	r.Group(func(r chi.Router) {
		r.Use(auth.JWTAuth)
		r.Use(tenant.RootContext)
		
		// Profile and logout
		r.Get("/auth/profile", root.RootProfile)
		r.Post("/auth/logout", root.RootLogout)
		
		// Cross-tenant oversight
		r.Get("/tenants", root.GetTenants)
		r.Post("/tenants", root.CreateTenant)
		r.Get("/tenants/{tenantID}", root.GetTenant)
		r.Put("/tenants/{tenantID}", root.UpdateTenant)
		r.Delete("/tenants/{tenantID}", root.DeleteTenant)
		
		// Billing
		r.Get("/billing", root.GetBilling)
		r.Get("/billing/tenants", root.GetTenantBilling)
		r.Get("/billing/tenants/{tenantID}", root.GetTenantBillingDetail)
		r.Get("/billing/payouts", root.GetPayouts)
		r.Post("/billing/payouts", root.CreatePayout)
		r.Get("/billing/revenue", root.GetRevenueReport)
		
		// Feature flags
		r.Get("/features", root.GetFeatureFlags)
		r.Post("/features", root.CreateFeatureFlag)
		r.Put("/features/{flagID}", root.UpdateFeatureFlag)
		r.Delete("/features/{flagID}", root.DeleteFeatureFlag)
		
		// Security and audit
		r.Get("/audit", root.GetAuditLogs)
		r.Get("/security", root.GetSecurityEvents)
		
		// Act-as support
		r.Post("/act-as/{userID}", root.ActAsUser)
		
		// User management
		r.Get("/users", root.GetUsers)
		r.Post("/users", root.CreateUser)
		r.Get("/users/{userID}", root.GetUser)
		r.Put("/users/{userID}", root.UpdateUser)
		r.Delete("/users/{userID}", root.DeleteUser)
		r.Post("/users/bulk", root.BulkUserOperations)
		r.Post("/users/{userID}/suspend", root.SuspendUser)
		r.Post("/users/{userID}/activate", root.ActivateUser)
		r.Get("/users/{userID}/activity", root.GetUserActivity)
		
		// Analytics & Reporting
		r.Get("/analytics/overview", root.GetAnalyticsOverview)
		r.Get("/analytics/revenue", root.GetRevenueAnalytics)
		r.Get("/analytics/users", root.GetUserAnalytics)
		r.Get("/analytics/performance", root.GetPerformanceAnalytics)
		r.Get("/analytics/business-intelligence", root.GetBusinessIntelligence)
		r.Get("/analytics/cross-tenant-comparison", root.GetCrossTenantComparison)
		r.Get("/analytics/real-time", root.GetRealTimeMetrics)
		r.Post("/analytics/reports", root.GenerateCustomReport)
		
		// System health
		r.Get("/health", root.GetSystemHealth)
		r.Get("/metrics", root.GetMetrics)
	})
}
