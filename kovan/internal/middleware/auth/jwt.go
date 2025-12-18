package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/go-chi/jwtauth/v5"
	"github.com/golang-jwt/jwt/v5"
)

var jwtAuth *jwtauth.JWTAuth

// InitJWT initializes the JWT authentication
func InitJWT(secret string) {
	jwtAuth = jwtauth.New("HS256", []byte(secret), nil)
}

// JWTAuth middleware for JWT authentication
func JWTAuth(next http.Handler) http.Handler {
	return jwtauth.Verifier(jwtAuth)(jwtAuthenticator(next))
}

// jwtAuthenticator handles JWT token validation and user context
func jwtAuthenticator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, claims, err := jwtauth.FromContext(r.Context())
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if token == nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract user information from claims
		userID, ok := claims["user_id"].(string)
		if !ok {
			http.Error(w, "Invalid user ID in token", http.StatusUnauthorized)
			return
		}

		userType, ok := claims["user_type"].(string)
		if !ok {
			http.Error(w, "Invalid user type in token", http.StatusUnauthorized)
			return
		}

		tenantID, ok := claims["tenant_id"].(string)
		if !ok {
			http.Error(w, "Invalid tenant ID in token", http.StatusUnauthorized)
			return
		}

		// Add user context to request
		ctx := context.WithValue(r.Context(), "user_id", userID)
		ctx = context.WithValue(ctx, "user_type", userType)
		ctx = context.WithValue(ctx, "tenant_id", tenantID)
		ctx = context.WithValue(ctx, "claims", claims)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GenerateToken creates a new JWT token for a user
func GenerateToken(userID, userType, tenantID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id":   userID,
		"user_type": userType,
		"tenant_id": tenantID,
	}

	_, tokenString, err := jwtAuth.Encode(claims)
	return tokenString, err
}

// GetUserFromContext extracts user information from request context
func GetUserFromContext(ctx context.Context) (userID, userType, tenantID string, ok bool) {
	userID, ok = ctx.Value("user_id").(string)
	if !ok {
		return "", "", "", false
	}

	userType, ok = ctx.Value("user_type").(string)
	if !ok {
		return "", "", "", false
	}

	tenantID, ok = ctx.Value("tenant_id").(string)
	if !ok {
		return "", "", "", false
	}

	return userID, userType, tenantID, true
}

// ExtractTokenFromHeader extracts JWT token from Authorization header
func ExtractTokenFromHeader(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return ""
	}

	// Check if it's a Bearer token
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	return ""
}
