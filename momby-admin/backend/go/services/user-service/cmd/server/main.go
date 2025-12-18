package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/momby/user-service/internal/config"
	"github.com/momby/user-service/internal/database"
	"github.com/momby/user-service/internal/handlers"
	"github.com/momby/user-service/internal/middleware"
	"github.com/momby/user-service/pkg/cache"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Load configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize cache
	redisClient, err := cache.Initialize(cfg.RedisURL)
	if err != nil {
		log.Printf("Failed to connect to Redis: %v", err)
	}

	// Initialize handlers
	userHandler := handlers.NewUserHandler(db, redisClient)

	// Setup router
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"service": "user-service",
			"status":  "healthy",
			"version": "1.0.0",
		})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		users := api.Group("/users")
		{
			users.GET("/:id", userHandler.GetUser)
			users.PUT("/:id", userHandler.UpdateUser)
			users.DELETE("/:id", userHandler.DeleteUser)
			users.GET("/:id/pregnancy-info", userHandler.GetPregnancyInfo)
			users.PUT("/:id/pregnancy-info", userHandler.UpdatePregnancyInfo)
			users.GET("/:id/addresses", userHandler.GetAddresses)
			users.POST("/:id/addresses", userHandler.CreateAddress)
			users.PUT("/:id/addresses/:addressId", userHandler.UpdateAddress)
			users.DELETE("/:id/addresses/:addressId", userHandler.DeleteAddress)
			users.GET("/:id/favorites", userHandler.GetFavorites)
			users.POST("/:id/favorites", userHandler.AddFavorite)
			users.DELETE("/:id/favorites/:itemId", userHandler.RemoveFavorite)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

