package config

import (
	"os"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	API      APIConfig
}

type ServerConfig struct {
	Port string
	Host string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret string
	Expiry string
}

type APIConfig struct {
	Version        string
	CustomerBaseURL string
	SellerBaseURL   string
	AdminBaseURL    string
}

var AppConfig *Config

func LoadConfig() *Config {
	config := &Config{
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
			Host: getEnv("SERVER_HOST", "localhost"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "password"),
			Name:     getEnv("DB_NAME", "randevu_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret: getEnv("JWT_SECRET", "your-super-secret-jwt-key-here"),
			Expiry: getEnv("JWT_EXPIRY", "24h"),
		},
		API: APIConfig{
			Version:        getEnv("API_VERSION", "v1"),
			CustomerBaseURL: getEnv("CUSTOMER_BASE_URL", "http://localhost:8080/api/v1/customer"),
			SellerBaseURL:   getEnv("SELLER_BASE_URL", "http://localhost:8080/api/v1/seller"),
			AdminBaseURL:    getEnv("ADMIN_BASE_URL", "http://localhost:8080/api/v1/admin"),
		},
	}

	AppConfig = config
	return config
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func GetConfig() *Config {
	if AppConfig == nil {
		return LoadConfig()
	}
	return AppConfig
}

// Helper functions for easy access
func GetAPIVersion() string {
	return GetConfig().API.Version
}

func GetCustomerBaseURL() string {
	return GetConfig().API.CustomerBaseURL
}

func GetSellerBaseURL() string {
	return GetConfig().API.SellerBaseURL
}

func GetAdminBaseURL() string {
	return GetConfig().API.AdminBaseURL
}

func GetServerPort() string {
	return GetConfig().Server.Port
}

func GetJWTSecret() string {
	return GetConfig().JWT.Secret
}

func GetJWTExpiry() string {
	return GetConfig().JWT.Expiry
}

