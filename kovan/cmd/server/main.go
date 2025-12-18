package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/kovan/backend/internal/api"
	"github.com/kovan/backend/internal/middleware/auth"
	"github.com/kovan/backend/internal/observability"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize observability
	obsConfig := observability.NewConfig()
	obsManager, err := observability.NewObservabilityManager(obsConfig)
	if err != nil {
		log.Fatalf("Failed to initialize observability: %v", err)
	}
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := obsManager.Shutdown(ctx); err != nil {
			log.Printf("Failed to shutdown observability: %v", err)
		}
	}()

	logger := obsManager.GetLogger()
	meter := obsManager.GetMeter()

	// Initialize Telescope UI (Laravel Telescope benzeri)
	telescopeUI := observability.NewTelescopeUI(
		logger,
		obsConfig.ServiceName,
		obsConfig.ServiceVersion,
		obsConfig.Environment,
	)

	logger.Info().Msg("Starting Kovan Backend with observability")

	// Initialize JWT authentication
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "default-secret-key-change-in-production"
	}
	auth.InitJWT(jwtSecret)

	// Initialize router
	r := chi.NewRouter()

	// Initialize HTTP metrics
	httpMetrics, err := observability.NewHTTPMetrics(meter)
	if err != nil {
		logger.Fatal().Err(err).Msg("Failed to initialize HTTP metrics")
	}

	// Global middleware (order matters!)
	r.Use(observability.HealthCheckFilter)                          // Skip observability for health checks
	r.Use(middleware.RequestID)                                     // Add request ID first
	r.Use(middleware.RealIP)                                        // Get real IP
	r.Use(observability.TracingMiddleware(obsConfig.ServiceName))     // OpenTelemetry tracing
	r.Use(observability.LoggingMiddleware(logger, telescopeUI))      // Structured logging with Telescope
	r.Use(observability.MetricsMiddleware(httpMetrics))             // HTTP metrics
	r.Use(observability.SentryMiddleware())                         // Error tracking
	r.Use(middleware.Recoverer)                                     // Panic recovery
	r.Use(middleware.Timeout(60 * time.Second))                     // Request timeout

	// CORS middleware
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"}, // Configure based on your domains
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Kovan Backend is healthy"))
	})

	// Setup observability endpoints
	if obsConfig.EnableProfiling {
		observability.SetupProfilingRoutes(r, logger)
	}
	observability.SetupMetricsEndpoint(r, logger)

	// Setup Telescope UI (Laravel Telescope benzeri)
	telescopeUI.SetupTelescopeRoutes(r)

	// API routes
	r.Route("/api/v1", func(r chi.Router) {
		// Add tenant context middleware for API routes
		r.Use(observability.TenantContextMiddleware())

		// Customer Panel API
		r.Route("/customer", func(r chi.Router) {
			api.SetupCustomerRoutes(r)
		})

		// Vendor Admin Panel API
		r.Route("/vendor", func(r chi.Router) {
			api.SetupVendorRoutes(r)
		})

		// Root Admin Panel API
		r.Route("/root", func(r chi.Router) {
			api.SetupRootRoutes(r)
		})
	})

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create server
	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		logger.Info().
			Str("port", port).
			Str("environment", obsConfig.Environment).
			Bool("profiling", obsConfig.EnableProfiling).
			Bool("tracing", obsConfig.EnableTracing).
			Bool("metrics", obsConfig.EnableMetrics).
			Msg("Starting Kovan Backend server")
		
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal().Err(err).Msg("Server error")
		}
	}()

	// Wait for interrupt signal to gracefully shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info().Msg("Shutting down server...")

	// Graceful shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal().Err(err).Msg("Server forced to shutdown")
	}

	logger.Info().Msg("Server exited gracefully")
}
