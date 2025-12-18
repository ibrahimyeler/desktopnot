package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"randevu-api/internal/routes"
	"randevu-api/pkg/config"
	"randevu-api/pkg/database"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("config.env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db, err := database.InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Create Echo instance
	e := echo.New()

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	// Setup routes
	routes.SetupRoutes(e, db)

	// Start server
	log.Printf("Server starting on %s:%s", cfg.Server.Host, cfg.Server.Port)
	log.Printf("Customer API: %s", cfg.API.CustomerBaseURL)
	log.Printf("Seller API: %s", cfg.API.SellerBaseURL)
	log.Printf("Admin API: %s", cfg.API.AdminBaseURL)
	e.Logger.Fatal(e.Start(":" + cfg.Server.Port))
}
