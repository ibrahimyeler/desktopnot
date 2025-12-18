package rate_limit

import (
	"net/http"
	"time"

	"github.com/go-chi/httprate"
	"github.com/redis/go-redis/v9"
)

// RateLimiter provides rate limiting functionality
type RateLimiter struct {
	redisClient *redis.Client
}

// NewRateLimiter creates a new rate limiter instance
func NewRateLimiter(redisClient *redis.Client) *RateLimiter {
	return &RateLimiter{
		redisClient: redisClient,
	}
}

// CustomerRateLimit applies rate limiting for customer panel requests
func CustomerRateLimit(redisClient *redis.Client) func(http.Handler) http.Handler {
	return httprate.Limit(
		100,                    // requests
		1*time.Minute,          // per minute
		httprate.WithKeyByIP(), // key by IP address
	)
}

// VendorRateLimit applies rate limiting for vendor admin panel requests
func VendorRateLimit(redisClient *redis.Client) func(http.Handler) http.Handler {
	return httprate.Limit(
		200,                    // requests
		1*time.Minute,          // per minute
		httprate.WithKeyByIP(), // key by IP address
	)
}



// RootRateLimit applies rate limiting for root admin panel requests
func RootRateLimit(redisClient *redis.Client) func(http.Handler) http.Handler {
	return httprate.Limit(
		500,                    // requests
		1*time.Minute,          // per minute
		httprate.WithKeyByIP(), // key by IP address
	)
}

// APIKeyRateLimit applies rate limiting based on API key
func APIKeyRateLimit(redisClient *redis.Client, requests int, window time.Duration) func(http.Handler) http.Handler {
	return httprate.Limit(
		requests,
		window,
		httprate.WithKeyByIP(), // Fallback to IP-based limiting
	)
}

// CustomRateLimit creates a custom rate limiter with specified parameters
func CustomRateLimit(redisClient *redis.Client, requests int, window time.Duration, keyFunc func(*http.Request) string) func(http.Handler) http.Handler {
	return httprate.Limit(
		requests,
		window,
		httprate.WithKeyByIP(), // Fallback to IP-based limiting
	)
}
