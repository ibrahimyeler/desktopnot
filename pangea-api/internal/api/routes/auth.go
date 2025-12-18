package routes

import (
	"pangea-api/internal/api/handlers"
	"pangea-api/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

// SetupAuthRoutes sets up authentication routes
func SetupAuthRoutes(r *gin.Engine) {
	// Auth endpoints
	r.POST("/register", handlers.RegisterHandler)
	r.POST("/api/v1/auth/register", handlers.RegisterHandler) // Versioned endpoint
	r.POST("/login", handlers.LoginHandler)
	r.POST("/api/v1/auth/login", handlers.LoginHandler) // Versioned endpoint
	r.POST("/admin/login", handlers.AdminLoginHandler)
	r.POST("/api/v1/auth/admin/login", handlers.AdminLoginHandler) // Versioned endpoint
	r.POST("/api/v1/auth/logout", middleware.AuthMiddleware(), handlers.LogoutHandler)
	r.POST("/api/v1/auth/refresh", handlers.RefreshTokenHandler)
	r.GET("/api/v1/auth/me", middleware.AuthMiddleware(), handlers.GetProfileHandler)
	r.PUT("/api/v1/auth/profile", middleware.AuthMiddleware(), handlers.UpdateProfileHandler)
} 