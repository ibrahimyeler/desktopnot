package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// RegisterRequest represents the registration request structure
type RegisterRequest struct {
	FirstName       string `json:"firstname" binding:"required"`
	LastName        string `json:"lastname" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

// RegisterResponse represents the registration response structure
type RegisterResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	UserID  string `json:"user_id,omitempty"`
}

// LoginRequest represents the login request structure
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse represents the login response structure
type LoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	User    *User  `json:"user,omitempty"`
}

// User represents user data
type User struct {
	ID        string `json:"id"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Email     string `json:"email"`
}

// AdminLoginRequest represents the admin login request structure
type AdminLoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// AdminLoginResponse represents the admin login response structure
type AdminLoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	Admin   *Admin `json:"admin,omitempty"`
	TokenInfo *TokenInfo `json:"token_info,omitempty"`
}

// TokenInfo represents token details
type TokenInfo struct {
	Type        string `json:"type"`
	ExpiresIn   int64  `json:"expires_in"`
	IssuedAt    int64  `json:"issued_at"`
	ExpiresAt   int64  `json:"expires_at"`
	RefreshToken string `json:"refresh_token,omitempty"`
}

// Admin represents admin data
type Admin struct {
	ID        string   `json:"id"`
	FirstName string   `json:"firstname"`
	LastName  string   `json:"lastname"`
	Email     string   `json:"email"`
	Role      string   `json:"role"`
	Permissions []string `json:"permissions"`
}

// @Summary Register a new user
// @Description Register a new user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body RegisterRequest true "User registration data"
// @Success 200 {object} RegisterResponse
// @Failure 400 {object} RegisterResponse
// @Router /register [post]
func RegisterHandler(c *gin.Context) {
	var req RegisterRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, RegisterResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Validate password confirmation
	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, RegisterResponse{
			Success: false,
			Message: "Password and confirm password do not match",
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, RegisterResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// TODO: Here you would typically:
	// 1. Check if email already exists
	// 2. Hash the password
	// 3. Save user to database
	// 4. Generate JWT token or session

	// For now, we'll just return a success response
	c.JSON(http.StatusOK, RegisterResponse{
		Success: true,
		Message: "User registered successfully",
		UserID:  "user_" + req.Email, // This would be the actual user ID from database
	})
}

// @Summary Login user
// @Description Authenticate user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param request body LoginRequest true "User login data"
// @Success 200 {object} LoginResponse
// @Failure 400 {object} LoginResponse
// @Failure 401 {object} LoginResponse
// @Router /login [post]
func LoginHandler(c *gin.Context) {
	var req LoginRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, LoginResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, LoginResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// TODO: Here you would typically:
	// 1. Check if user exists in database
	// 2. Verify password hash
	// 3. Generate JWT token
	// 4. Return user data and token

	if req.Email == "test@example.com" && req.Password == "password123" {
		user := &User{
			ID:        "user_123",
			FirstName: "John",
			LastName:  "Doe",
			Email:     req.Email,
		}

		c.JSON(http.StatusOK, LoginResponse{
			Success: true,
			Message: "Login successful",
			Token:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8xMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJleHAiOjE3MzU4NzY4MDB9.example_token",
			User:    user,
		})
		return
	}

	// Invalid credentials
	c.JSON(http.StatusUnauthorized, LoginResponse{
		Success: false,
		Message: "Invalid email or password",
	})
}

// @Summary Admin login
// @Description Authenticate admin with email and password
// @Tags admin
// @Accept json
// @Produce json
// @Param request body AdminLoginRequest true "Admin login data"
// @Success 200 {object} AdminLoginResponse
// @Failure 400 {object} AdminLoginResponse
// @Failure 401 {object} AdminLoginResponse
// @Router /admin/login [post]
func AdminLoginHandler(c *gin.Context) {
	var req AdminLoginRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, AdminLoginResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, AdminLoginResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// TODO: Here you would typically:
	// 1. Check if admin exists in database
	// 2. Verify password hash
	// 3. Check admin role and permissions
	// 4. Generate JWT token with admin claims
	// 5. Log admin login activity

	// For demo purposes, we'll check against hardcoded admin credentials
	if req.Email == "admin@example.com" && req.Password == "admin123" {
		admin := &Admin{
			ID:        "admin_001",
			FirstName: "Admin",
			LastName:  "User",
			Email:     req.Email,
			Role:      "super_admin",
			Permissions: []string{
				"user_management",
				"content_management", 
				"system_settings",
				"analytics",
				"security_logs",
			},
		}

		c.JSON(http.StatusOK, AdminLoginResponse{
			Success: true,
			Message: "Admin login successful",
			Token:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6ImFkbWluXzAwMSIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJleHAiOjE3MzU4NzY4MDB9.admin_token",
			Admin:   admin,
		})
		return
	}

	// Check for other admin roles
	if req.Email == "moderator@example.com" && req.Password == "mod123" {
		admin := &Admin{
			ID:        "admin_002",
			FirstName: "Moderator",
			LastName:  "User",
			Email:     req.Email,
			Role:      "moderator",
			Permissions: []string{
				"content_moderation",
				"user_reports",
				"basic_analytics",
			},
		}

		c.JSON(http.StatusOK, AdminLoginResponse{
			Success: true,
			Message: "Admin login successful",
			Token:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6ImFkbWluXzAwMiIsImVtYWlsIjoibW9kZXJhdG9yQGV4YW1wbGUuY29tIiwicm9sZSI6Im1vZGVyYXRvciIsImV4cCI6MTczNTg3NjgwMH0.moderator_token",
			Admin:   admin,
		})
		return
	}

	c.JSON(http.StatusUnauthorized, AdminLoginResponse{
		Success: false,
		Message: "Invalid admin credentials",
	})
}

// @Summary Logout user
// @Description Logout user and invalidate token
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Router /api/v1/auth/logout [post]
func LogoutHandler(c *gin.Context) {
	// TODO: Invalidate JWT token
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

// @Summary Refresh token
// @Description Refresh JWT token
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Router /api/v1/auth/refresh [post]
func RefreshTokenHandler(c *gin.Context) {
	// TODO: Validate refresh token and generate new access token
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Token refreshed successfully",
		"token":   "new_jwt_token_here",
	})
}

// @Summary Get user profile
// @Description Get current user profile information
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {object} User
// @Failure 401 {object} map[string]interface{}
// @Router /api/v1/auth/me [get]
func GetProfileHandler(c *gin.Context) {
	// TODO: Get user from JWT token
	user := &User{
		ID:        "user_123",
		FirstName: "John",
		LastName:  "Doe",
		Email:     "test@example.com",
	}

	c.JSON(http.StatusOK, user)
}

// @Summary Update user profile
// @Description Update current user profile information
// @Tags auth
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param request body User true "User profile data"
// @Success 200 {object} User
// @Failure 400 {object} map[string]interface{}
// @Failure 401 {object} map[string]interface{}
// @Router /api/v1/auth/profile [put]
func UpdateProfileHandler(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// TODO: Update user in database
	c.JSON(http.StatusOK, user)
} 