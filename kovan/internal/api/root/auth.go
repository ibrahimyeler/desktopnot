package root

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/kovan/backend/internal/middleware/auth"
)

// LoginRequest represents the login request structure
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// LoginResponse represents the login response structure
type LoginResponse struct {
	Token     string    `json:"token"`
	UserID    string    `json:"user_id"`
	UserType  string    `json:"user_type"`
	TenantID  string    `json:"tenant_id"`
	ExpiresAt time.Time `json:"expires_at"`
	Message   string    `json:"message"`
}

// RootLogin handles root admin login
func RootLogin(w http.ResponseWriter, r *http.Request) {
	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if loginReq.Username == "" || loginReq.Password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	// TODO: Implement actual authentication logic
	// For now, we'll use a simple hardcoded check
	if loginReq.Username == "root" && loginReq.Password == "admin123" {
		// Generate JWT token
		token, err := auth.GenerateToken("root_user_123", "root", "root_tenant")
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		// Create response
		response := LoginResponse{
			Token:     token,
			UserID:    "root_user_123",
			UserType:  "root",
			TenantID:  "root_tenant",
			ExpiresAt: time.Now().Add(24 * time.Hour),
			Message:   "Login successful",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Invalid credentials
	http.Error(w, "Invalid username or password", http.StatusUnauthorized)
}

// RootLogout handles root admin logout
func RootLogout(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement logout logic (e.g., blacklist token)
	response := map[string]interface{}{
		"message": "Logout successful",
		"timestamp": time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// RootProfile returns the current root admin profile
func RootProfile(w http.ResponseWriter, r *http.Request) {
	// Get user info from context (set by JWT middleware)
	userID, userType, tenantID, ok := auth.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "User context not found", http.StatusUnauthorized)
		return
	}

	// TODO: Fetch actual user profile from database
	profile := map[string]interface{}{
		"id":          userID,
		"username":    "root_admin",
		"email":       "root@kovan.com",
		"user_type":   userType,
		"tenant_id":   tenantID,
		"permissions": []string{"read", "write", "delete", "act_as"},
		"created_at":  "2024-01-01T00:00:00Z",
		"last_login":  time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}
