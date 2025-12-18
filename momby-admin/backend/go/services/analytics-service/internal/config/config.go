package config

import "os"

type Config struct {
	ClickHouseURL string
	KafkaURL      string
	Port          string
}

func Load() *Config {
	return &Config{
		ClickHouseURL: getEnv("CLICKHOUSE_URL", "clickhouse://localhost:9000/default"),
		KafkaURL:      getEnv("KAFKA_URL", "localhost:9092"),
		Port:          getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

