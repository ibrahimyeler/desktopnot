package routes

import (
	"github.com/labstack/echo/v4"
	"randevu-api/internal/handlers"
	"randevu-api/internal/handlers/admin"
	"randevu-api/internal/handlers/customer"
	"randevu-api/internal/handlers/seller"
	"randevu-api/internal/middleware/auth"
	"gorm.io/gorm"
)

// SetupRoutes configures all application routes
func SetupRoutes(e *echo.Echo, db *gorm.DB) {
	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)
	customerHandler := customer.NewCustomerHandler(db)
	sellerHandler := seller.NewSellerHandler(db)
	adminHandler := admin.NewAdminHandler(db)

	// API v1 group
	api := e.Group("/api/v1")

	// Public routes (no authentication required)
	setupPublicRoutes(api, authHandler)

	// Customer routes
	setupCustomerRoutes(api, customerHandler)

	// Seller routes
	setupSellerRoutes(api, sellerHandler)

	// Admin routes
	setupAdminRoutes(api, adminHandler)
}

// setupPublicRoutes configures public routes
func setupPublicRoutes(api *echo.Group, authHandler *handlers.AuthHandler) {
	api.POST("/auth/register", authHandler.Register)
	api.POST("/auth/login", authHandler.Login)
}

// setupCustomerRoutes configures customer-specific routes
func setupCustomerRoutes(api *echo.Group, customerHandler *customer.CustomerHandler) {
	customerGroup := api.Group("/customer")
	customerGroup.Use(auth.JWTMiddleware)
	customerGroup.Use(auth.RequireRole("customer"))

	customerGroup.GET("/profile", customerHandler.GetProfile)
	customerGroup.PUT("/profile", customerHandler.UpdateProfile)
	customerGroup.GET("/appointments", customerHandler.GetMyAppointments)
	customerGroup.POST("/appointments", customerHandler.CreateAppointment)
	customerGroup.DELETE("/appointments/:id", customerHandler.CancelAppointment)
}

// setupSellerRoutes configures seller-specific routes
func setupSellerRoutes(api *echo.Group, sellerHandler *seller.SellerHandler) {
	sellerGroup := api.Group("/seller")
	sellerGroup.Use(auth.JWTMiddleware)
	sellerGroup.Use(auth.RequireRole("seller"))

	sellerGroup.GET("/profile", sellerHandler.GetProfile)
	sellerGroup.PUT("/profile", sellerHandler.UpdateProfile)
	sellerGroup.GET("/appointments", sellerHandler.GetMyAppointments)
	sellerGroup.GET("/appointments/:id", sellerHandler.GetAppointment)
	sellerGroup.PUT("/appointments/:id/status", sellerHandler.UpdateAppointmentStatus)
	sellerGroup.GET("/customers", sellerHandler.GetCustomers)
	sellerGroup.GET("/stats", sellerHandler.GetAppointmentStats)
}

// setupAdminRoutes configures admin-specific routes
func setupAdminRoutes(api *echo.Group, adminHandler *admin.AdminHandler) {
	adminGroup := api.Group("/admin")
	adminGroup.Use(auth.JWTMiddleware)
	adminGroup.Use(auth.RequireRole("admin"))

	adminGroup.GET("/dashboard/stats", adminHandler.GetDashboardStats)
	adminGroup.GET("/users", adminHandler.GetAllUsers)
	adminGroup.GET("/users/:id", adminHandler.GetUser)
	adminGroup.PUT("/users/:id", adminHandler.UpdateUser)
	adminGroup.DELETE("/users/:id", adminHandler.DeleteUser)
	adminGroup.GET("/appointments", adminHandler.GetAllAppointments)
	adminGroup.GET("/appointments/:id", adminHandler.GetAppointment)
	adminGroup.PUT("/appointments/:id", adminHandler.UpdateAppointment)
	adminGroup.DELETE("/appointments/:id", adminHandler.DeleteAppointment)
}
