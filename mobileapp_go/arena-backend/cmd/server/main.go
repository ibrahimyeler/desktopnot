package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"arena-backend/internal/gateway"
	"arena-backend/internal/lobby"
	"arena-backend/internal/match"
	"arena-backend/internal/store"
	"arena-backend/internal/util"

	"github.com/sirupsen/logrus"
)

func main() {
	// Load configuration
	config, err := util.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Setup logging
	setupLogging(config)

	logrus.Info("Starting Arena Backend Server...")

	// Initialize stores
	postgresStore, err := store.NewPostgresStore(config)
	if err != nil {
		logrus.Fatalf("Failed to initialize PostgreSQL store: %v", err)
	}
	defer postgresStore.Close()

	redisStore, err := store.NewRedisStore(config)
	if err != nil {
		logrus.Fatalf("Failed to initialize Redis store: %v", err)
	}
	defer redisStore.Close()

	// Initialize services
	lobbyService := lobby.NewService(redisStore, postgresStore, config)
	matchService := match.NewService(redisStore, postgresStore, config)

	// Initialize gateway
	gateway := gateway.NewGateway(lobbyService, matchService, config)

	// Setup HTTP server
	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", config.Server.Host, config.Server.Port),
		Handler: gateway.Router(),
	}

	// Start server in a goroutine
	go func() {
		logrus.Infof("Server starting on %s:%d", config.Server.Host, config.Server.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logrus.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logrus.Info("Shutting down server...")

	// Create a deadline for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		logrus.Errorf("Server forced to shutdown: %v", err)
	}

	logrus.Info("Server exited")
}

func setupLogging(config *util.Config) {
	// Set log level
	level, err := logrus.ParseLevel(config.Log.Level)
	if err != nil {
		logrus.SetLevel(logrus.InfoLevel)
	} else {
		logrus.SetLevel(level)
	}

	// Set log format
	logrus.SetFormatter(&logrus.TextFormatter{
		FullTimestamp: true,
		ForceColors:   true,
	})

	// Log startup info
	logrus.WithFields(logrus.Fields{
		"version": "1.0.0",
		"port":    config.Server.Port,
		"level":   config.Log.Level,
	}).Info("Arena Backend initialized")
}
