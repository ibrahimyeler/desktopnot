package customer

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/kovan/backend/internal/middleware/auth"
)

// LoginRequest represents the login request structure
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// RegisterRequest represents the registration request structure
type RegisterRequest struct {
	Email           string `json:"email"`
	EmailConfirm    string `json:"email_confirm"`
	Password        string `json:"password"`
	PasswordConfirm string `json:"password_confirm"`
	FirstName       string `json:"first_name"`
	LastName        string `json:"last_name"`
	Phone           string `json:"phone"`
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

// CustomerLogin handles customer login
func CustomerLogin(w http.ResponseWriter, r *http.Request) {
	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if loginReq.Email == "" || loginReq.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// TODO: Implement actual authentication logic
	// For now, we'll use a simple hardcoded check
	if loginReq.Email == "customer@example.com" && loginReq.Password == "customer123" {
		// Generate JWT token
		token, err := auth.GenerateToken("customer_user_123", "customer", "travel_tenant")
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		// Create response
		response := LoginResponse{
			Token:     token,
			UserID:    "customer_user_123",
			UserType:  "customer",
			TenantID:  "travel_tenant",
			ExpiresAt: time.Now().Add(24 * time.Hour),
			Message:   "Login successful",
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Invalid credentials
	http.Error(w, "Invalid email or password", http.StatusUnauthorized)
}

// CustomerRegister handles customer registration
func CustomerRegister(w http.ResponseWriter, r *http.Request) {
	var registerReq RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if registerReq.Email == "" || registerReq.Password == "" || registerReq.FirstName == "" || registerReq.LastName == "" {
		http.Error(w, "Email, password, first name and last name are required", http.StatusBadRequest)
		return
	}

	// Validate email confirmation
	if registerReq.Email != registerReq.EmailConfirm {
		http.Error(w, "Email and email confirmation do not match", http.StatusBadRequest)
		return
	}

	// Validate password confirmation
	if registerReq.Password != registerReq.PasswordConfirm {
		http.Error(w, "Password and password confirmation do not match", http.StatusBadRequest)
		return
	}

	// Validate password strength (minimum 8 characters)
	if len(registerReq.Password) < 8 {
		http.Error(w, "Password must be at least 8 characters long", http.StatusBadRequest)
		return
	}

	// TODO: Implement actual registration logic
	// For now, we'll create a mock user
	userID := "customer_user_" + time.Now().Format("20060102150405")

	// Generate JWT token
	token, err := auth.GenerateToken(userID, "customer", "travel_tenant")
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Create response
	response := LoginResponse{
		Token:     token,
		UserID:    userID,
		UserType:  "customer",
		TenantID:  "travel_tenant",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Message:   "Registration successful",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}
