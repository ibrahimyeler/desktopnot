package main

import (
	"context"
	"crypto/rand"
	"database/sql"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	AuthProvider string    `json:"auth_provider"` // "email", "google", "apple"
	ProviderID   *string   `json:"provider_id,omitempty"`
	IsActive     bool      `json:"is_active"`
	IsAdmin      bool      `json:"is_admin"`
	CreatedAt    time.Time `json:"created_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Username string `json:"username" binding:"required"`
}

type AuthResponse struct {
	Token        string `json:"token"`
	RefreshToken string `json:"refresh_token,omitempty"`
	User         User   `json:"user"`
}

type GoogleAuthRequest struct {
	IDToken     string `json:"id_token" binding:"required"`
	AccessToken string `json:"access_token" binding:"required"`
}

type AppleAuthRequest struct {
	IDToken           string `json:"id_token" binding:"required"`
	AuthorizationCode string `json:"authorization_code" binding:"required"`
	Email             string `json:"email"`
	FullName          string `json:"full_name,omitempty"`
}

type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required"`
}

type ResetPasswordRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Code        string `json:"code" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type SendVerificationCodeResponse struct {
	Message string `json:"message"`
	TTL     int    `json:"ttl_seconds"` // Time to live in seconds
}

var db *sql.DB
var jwtSecret []byte

func init() {
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		jwtSecret = []byte("default-secret-change-in-production")
	}
}

func main() {
	// Connect to PostgreSQL
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@auth-db:5432/authdb?sslmode=disable"
	}

	db, err = sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Create tables
	if err := createTables(); err != nil {
		log.Fatal("Failed to create tables:", err)
	}

	// Setup Gin router
	r := gin.Default()
	r.Use(corsMiddleware())

	// Public routes
	r.POST("/auth/register", register)
	r.POST("/auth/login", login)
	r.POST("/auth/google", googleAuth)
	r.POST("/auth/apple", appleAuth)
	r.POST("/auth/forgot-password", forgotPassword)
	r.POST("/auth/verify-code", verifyCode)
	r.POST("/auth/reset-password", resetPassword)
	r.POST("/auth/refresh", refreshToken)
	r.GET("/auth/validate", validateToken)
	r.GET("/health", healthCheck)

	// Admin routes
	admin := r.Group("/admin")
	admin.POST("/login", adminLogin)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}

	log.Printf("Auth service running on port %s", port)
	r.Run(":" + port)
}

func createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS users (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		email VARCHAR(255) UNIQUE NOT NULL,
		username VARCHAR(100) NOT NULL,
		password_hash VARCHAR(255),
		auth_provider VARCHAR(50) NOT NULL DEFAULT 'email',
		provider_id VARCHAR(255),
		is_active BOOLEAN DEFAULT true,
		is_admin BOOLEAN DEFAULT false,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE IF NOT EXISTS verification_codes (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		email VARCHAR(255) NOT NULL,
		code VARCHAR(6) NOT NULL,
		type VARCHAR(50) NOT NULL, -- 'password_reset', 'email_verification'
		expires_at TIMESTAMP NOT NULL,
		used BOOLEAN DEFAULT false,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE IF NOT EXISTS refresh_tokens (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		token TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	CREATE INDEX IF NOT EXISTS idx_users_provider ON users(auth_provider, provider_id);
	CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
	CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
	`
	_, err := db.Exec(query)
	return err
}

func register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}
	if exists {
		c.JSON(400, gin.H{"error": "User already exists"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	// Insert user
	var user User
	query := "INSERT INTO users (email, username, password_hash, auth_provider, is_active, is_admin) VALUES ($1, $2, $3, 'email', true, false) RETURNING id, email, username, auth_provider, provider_id, is_active, is_admin, created_at"
	err = db.QueryRow(query, req.Email, req.Username, string(hashedPassword)).
		Scan(&user.ID, &user.Email, &user.Username, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
	if err != nil {
		log.Printf("Database insert error: %v", err)
		c.JSON(500, gin.H{"error": "Failed to create user"})
		return
	}

	// Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		log.Printf("Token generation error: %v", err)
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := generateRefreshToken(user.ID)
	if err != nil {
		log.Printf("Refresh token generation error: %v", err)
		c.JSON(500, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(201, AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find user
	var user User
	var passwordHash string
	query := "SELECT id, email, username, password_hash, auth_provider, provider_id, is_active, is_admin, created_at FROM users WHERE email = $1"
	err := db.QueryRow(query, req.Email).
		Scan(&user.ID, &user.Email, &user.Username, &passwordHash, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
	if err == sql.ErrNoRows {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(200, AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

func validateToken(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(401, gin.H{"error": "Missing authorization header"})
		return
	}

	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil || !token.Valid {
		c.JSON(401, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(401, gin.H{"error": "Invalid token claims"})
		return
	}

	c.JSON(200, gin.H{
		"user_id": claims["user_id"],
		"valid":   true,
	})
}

func generateToken(userID string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func healthCheck(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		c.JSON(500, gin.H{"status": "unhealthy"})
		return
	}

	c.JSON(200, gin.H{"status": "healthy"})
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// Helper function to generate random verification code
func generateVerificationCode() (string, error) {
	code := ""
	for i := 0; i < 6; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		code += num.String()
	}
	return code, nil
}

// sendVerificationCodeSMS sends verification code via SMS (Twilio or Verimor)
func sendVerificationCodeSMS(email string, code string) error {
	// TODO: Implement SMS sending via Twilio or Verimor
	// For now, log the code (IN PRODUCTION, REMOVE THIS!)
	log.Printf("Verification code for %s: %s", email, code)
	return nil
}

// Google OAuth authentication
func googleAuth(c *gin.Context) {
	var req GoogleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// TODO: Verify Google ID token with Google API
	// For now, accept it and extract email from token claims
	// In production, validate token with Google's public keys

	// Mock: Extract email from ID token (NOT SECURE - implement proper validation)
	// This is a placeholder - you must verify the token with Google

	// For security, you should verify the ID token with Google's API:
	// https://developers.google.com/identity/sign-in/web/backend-auth

	email := extractEmailFromIDToken(req.IDToken) // Placeholder function
	if email == "" {
		c.JSON(400, gin.H{"error": "Invalid Google ID token"})
		return
	}

	// Check if user exists
	var user User
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		// Create new user
		query := "INSERT INTO users (email, username, auth_provider, provider_id, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, email, username, auth_provider, provider_id, is_active, is_admin, created_at"
		err = db.QueryRow(query, email, email, "google", email).
			Scan(&user.ID, &user.Email, &user.Username, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}
	} else {
		// Get existing user
		query := "SELECT id, email, username, auth_provider, provider_id, is_active, is_admin, created_at FROM users WHERE email = $1"
		err = db.QueryRow(query, email).
			Scan(&user.ID, &user.Email, &user.Username, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}
	}

	// Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(200, AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

// Apple OAuth authentication
func appleAuth(c *gin.Context) {
	var req AppleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// TODO: Verify Apple ID token with Apple API
	// For now, accept it and use email from request

	email := req.Email
	if email == "" {
		c.JSON(400, gin.H{"error": "Email is required for Apple sign-in"})
		return
	}

	// Check if user exists
	var user User
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", email).Scan(&exists)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		// Create new user
		query := "INSERT INTO users (email, username, auth_provider, provider_id, is_active) VALUES ($1, $2, $3, $4, true) RETURNING id, email, username, auth_provider, provider_id, is_active, is_admin, created_at"
		err = db.QueryRow(query, email, req.FullName, "apple", email).
			Scan(&user.ID, &user.Email, &user.Username, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to create user"})
			return
		}
	} else {
		// Get existing user
		query := "SELECT id, email, username, auth_provider, provider_id, is_active, is_admin, created_at FROM users WHERE email = $1"
		err = db.QueryRow(query, email).
			Scan(&user.ID, &user.Email, &user.Username, &user.AuthProvider, &user.ProviderID, &user.IsActive, &user.IsAdmin, &user.CreatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error": "Database error"})
			return
		}
	}

	// Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	refreshToken, err := generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate refresh token"})
		return
	}

	c.JSON(200, AuthResponse{
		Token:        token,
		RefreshToken: refreshToken,
		User:         user,
	})
}

// Forgot password - send verification code
func forgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		// Don't reveal that email doesn't exist (security best practice)
		c.JSON(200, SendVerificationCodeResponse{
			Message: "If the email exists, a verification code has been sent",
			TTL:     600,
		})
		return
	}

	// Generate verification code
	code, err := generateVerificationCode()
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate verification code"})
		return
	}

	// Store verification code (expires in 10 minutes)
	expiresAt := time.Now().Add(10 * time.Minute)
	query := "INSERT INTO verification_codes (email, code, type, expires_at) VALUES ($1, $2, $3, $4)"
	_, err = db.Exec(query, req.Email, code, "password_reset", expiresAt)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to save verification code"})
		return
	}

	// Send code via SMS
	err = sendVerificationCodeSMS(req.Email, code)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to send verification code"})
		return
	}

	c.JSON(200, SendVerificationCodeResponse{
		Message: "Verification code sent",
		TTL:     600, // 10 minutes
	})
}

// Verify code
func verifyCode(c *gin.Context) {
	var req VerifyCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Check if code is valid
	var isValid bool
	var expiresAt time.Time
	var used bool
	err := db.QueryRow(`
		SELECT expires_at > CURRENT_TIMESTAMP, expires_at, used 
		FROM verification_codes 
		WHERE email = $1 AND code = $2 AND type = 'password_reset'
		ORDER BY created_at DESC LIMIT 1`,
		req.Email, req.Code).
		Scan(&isValid, &expiresAt, &used)

	if err == sql.ErrNoRows || !isValid || used {
		c.JSON(400, gin.H{"error": "Invalid or expired code"})
		return
	}

	c.JSON(200, gin.H{"valid": true})
}

// Reset password
func resetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Verify code
	var codeID string
	err := db.QueryRow(`
		SELECT id 
		FROM verification_codes 
		WHERE email = $1 AND code = $2 AND type = 'password_reset' 
		AND expires_at > CURRENT_TIMESTAMP AND used = false
		ORDER BY created_at DESC LIMIT 1`,
		req.Email, req.Code).Scan(&codeID)

	if err == sql.ErrNoRows {
		c.JSON(400, gin.H{"error": "Invalid or expired code"})
		return
	}

	// Hash new password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	// Update password
	query := "UPDATE users SET password_hash = $1 WHERE email = $2"
	_, err = db.Exec(query, string(hashedPassword), req.Email)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to reset password"})
		return
	}

	// Mark code as used
	_, err = db.Exec("UPDATE verification_codes SET used = true WHERE id = $1", codeID)
	if err != nil {
		log.Printf("Failed to mark code as used: %v", err)
	}

	c.JSON(200, gin.H{"message": "Password reset successfully"})
}

// Refresh token
func refreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Verify refresh token
	var userID string
	var expiresAt time.Time
	err := db.QueryRow(`
		SELECT user_id, expires_at 
		FROM refresh_tokens 
		WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
		req.RefreshToken).Scan(&userID, &expiresAt)

	if err == sql.ErrNoRows {
		c.JSON(401, gin.H{"error": "Invalid or expired refresh token"})
		return
	}

	// Generate new access token
	token, err := generateToken(userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, gin.H{"token": token})
}

// Admin login
func adminLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Find user
	var user User
	var passwordHash string
	query := "SELECT id, email, username, password_hash, created_at, is_admin FROM users WHERE email = $1"
	err := db.QueryRow(query, req.Email).
		Scan(&user.ID, &user.Email, &user.Username, &passwordHash, &user.CreatedAt, &user.IsAdmin)
	if err == sql.ErrNoRows {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	// Check if admin
	if !user.IsAdmin {
		c.JSON(403, gin.H{"error": "Access denied"})
		return
	}

	// Verify password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	// Generate token
	token, err := generateToken(user.ID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(200, gin.H{
		"token": token,
		"user":  user,
	})
}

// Generate refresh token
func generateRefreshToken(userID string) (string, error) {
	// Generate random token
	tokenBytes := make([]byte, 32)
	_, err := rand.Read(tokenBytes)
	if err != nil {
		return "", err
	}
	token := fmt.Sprintf("%x", tokenBytes)

	// Store in database (expires in 30 days)
	expiresAt := time.Now().Add(30 * 24 * time.Hour)
	query := "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)"
	_, err = db.Exec(query, userID, token, expiresAt)
	if err != nil {
		return "", err
	}

	return token, nil
}

// Helper function to extract email from ID token (PLACEHOLDER - implement properly!)
func extractEmailFromIDToken(idToken string) string {
	// TODO: Implement proper JWT parsing and validation with Google's public keys
	// For now, parse without signature verification (NOT SECURE for production!)

	// Parse JWT token without verification
	token, _, err := new(jwt.Parser).ParseUnverified(idToken, jwt.MapClaims{})
	if err != nil {
		log.Printf("Failed to parse ID token: %v", err)
		return ""
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return ""
	}

	email, ok := claims["email"].(string)
	if !ok {
		return ""
	}

	return email
}
