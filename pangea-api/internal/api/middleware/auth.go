package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks for valid JWT token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authorization token required",
			})
			c.Abort()
			return
		}

		// Check token format
		if !strings.HasPrefix(token, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token format",
			})
			c.Abort()
			return
		}

		// Extract token value
		tokenValue := strings.TrimPrefix(token, "Bearer ")
		
		// TODO: Implement proper JWT validation
		// For now, check if token contains expected patterns
		if !isValidToken(tokenValue) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid or expired token",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// AdminAuthMiddleware checks for valid admin JWT token
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := c.GetHeader("Authorization")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authorization token required",
			})
			c.Abort()
			return
		}

		// Check token format
		if !strings.HasPrefix(token, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid token format",
			})
			c.Abort()
			return
		}

		// Extract token value
		tokenValue := strings.TrimPrefix(token, "Bearer ")
		
		// TODO: Implement proper JWT validation with admin role check
		// For now, check if token contains admin patterns
		if !isValidAdminToken(tokenValue) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid admin token or insufficient permissions",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// isValidToken checks if token has valid format (temporary implementation)
func isValidToken(token string) bool {
	// TODO: Implement proper JWT validation
	// For now, check if token contains expected patterns
	return strings.Contains(token, ".") && len(token) > 20
}

// isValidAdminToken checks if token is a valid admin token (temporary implementation)
func isValidAdminToken(token string) bool {
	// TODO: Implement proper JWT validation with admin role check
	// For now, check if token contains admin patterns
	return strings.Contains(token, "admin") && strings.Contains(token, ".") && len(token) > 20
} 