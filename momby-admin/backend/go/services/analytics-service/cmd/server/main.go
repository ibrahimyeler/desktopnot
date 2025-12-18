package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/momby/analytics-service/internal/config"
	"github.com/momby/analytics-service/internal/handlers"
	"github.com/momby/analytics-service/internal/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	cfg := config.Load()

	analyticsHandler := handlers.NewAnalyticsHandler(cfg)

	router := gin.Default()
	router.Use(middleware.CORS())
	router.Use(middleware.Logger())

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"service": "analytics-service",
			"status":  "healthy",
			"version": "1.0.0",
		})
	})

	api := router.Group("/api/v1")
	{
		events := api.Group("/events")
		{
			events.POST("", analyticsHandler.TrackEvent)
		}

		analytics := api.Group("/analytics")
		{
			analytics.GET("/dashboard", analyticsHandler.GetDashboard)
			analytics.GET("/funnel", analyticsHandler.GetFunnel)
			analytics.GET("/cohort", analyticsHandler.GetCohort)
		}
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

