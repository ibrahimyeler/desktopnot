package util

import (
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server ServerConfig
	DB     DBConfig
	Redis  RedisConfig
	Game   GameConfig
	Log    LogConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port int
	Host string
}

// DBConfig holds database configuration
type DBConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// RedisConfig holds Redis configuration
type RedisConfig struct {
	Host     string
	Port     int
	Password string
	DB       int
}

// GameConfig holds game configuration
type GameConfig struct {
	TickRate            int
	MatchDuration       int
	CountdownDuration   int
	MaxPlayersPerRoom   int
	ItemSpawnInterval   int
	ArenaWidth          float64
	ArenaHeight         float64
	PlayerRadius        float64
	MaxPlayerSpeed      float64
	ItemPickupDistance  float64
}

// LogConfig holds logging configuration
type LogConfig struct {
	Level string
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	// Load .env file if it exists
	godotenv.Load()

	config := &Config{
		Server: ServerConfig{
			Port: getEnvAsInt("SERVER_PORT", 8080),
			Host: getEnv("SERVER_HOST", "0.0.0.0"),
		},
		DB: DBConfig{
			Host:     getEnv("POSTGRES_HOST", "localhost"),
			Port:     getEnvAsInt("POSTGRES_PORT", 5432),
			User:     getEnv("POSTGRES_USER", "arena_user"),
			Password: getEnv("POSTGRES_PASSWORD", "arena_password"),
			DBName:   getEnv("POSTGRES_DB", "arena_db"),
			SSLMode:  getEnv("POSTGRES_SSLMODE", "disable"),
		},
		Redis: RedisConfig{
			Host:     getEnv("REDIS_HOST", "localhost"),
			Port:     getEnvAsInt("REDIS_PORT", 6379),
			Password: getEnv("REDIS_PASSWORD", ""),
			DB:       getEnvAsInt("REDIS_DB", 0),
		},
		Game: GameConfig{
			TickRate:            getEnvAsInt("GAME_TICK_RATE", 15),
			MatchDuration:       getEnvAsInt("GAME_MATCH_DURATION", 180),
			CountdownDuration:   getEnvAsInt("GAME_COUNTDOWN_DURATION", 5),
			MaxPlayersPerRoom:   getEnvAsInt("GAME_MAX_PLAYERS_PER_ROOM", 10),
			ItemSpawnInterval:   getEnvAsInt("GAME_ITEM_SPAWN_INTERVAL", 20),
			ArenaWidth:          getEnvAsFloat("GAME_ARENA_WIDTH", 50.0),
			ArenaHeight:         getEnvAsFloat("GAME_ARENA_HEIGHT", 50.0),
			PlayerRadius:        getEnvAsFloat("GAME_PLAYER_RADIUS", 0.5),
			MaxPlayerSpeed:      getEnvAsFloat("GAME_MAX_PLAYER_SPEED", 5.0),
			ItemPickupDistance:  getEnvAsFloat("GAME_ITEM_PICKUP_DISTANCE", 1.5),
		},
		Log: LogConfig{
			Level: getEnv("LOG_LEVEL", "info"),
		},
	}

	return config, nil
}

// Helper functions
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getEnvAsFloat(key string, defaultValue float64) float64 {
	if value := os.Getenv(key); value != "" {
		if floatValue, err := strconv.ParseFloat(value, 64); err == nil {
			return floatValue
		}
	}
	return defaultValue
}

// GetTickDuration returns the duration of a single game tick
func (c *Config) GetTickDuration() time.Duration {
	return time.Duration(1000/c.Game.TickRate) * time.Millisecond
}

// GetMatchDuration returns the match duration as time.Duration
func (c *Config) GetMatchDuration() time.Duration {
	return time.Duration(c.Game.MatchDuration) * time.Second
}

// GetCountdownDuration returns the countdown duration as time.Duration
func (c *Config) GetCountdownDuration() time.Duration {
	return time.Duration(c.Game.CountdownDuration) * time.Second
}
