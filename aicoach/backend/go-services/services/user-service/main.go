package main

import (
	"database/sql"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type UserProfile struct {
	ID          string    `json:"id"`
	Email       string    `json:"email"`
	Username    string    `json:"username"`
	FullName    string    `json:"full_name"`
	Avatar      string    `json:"avatar"`
	Bio         string    `json:"bio"`
	PhoneNumber string    `json:"phone_number"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type UpdateProfileRequest struct {
	FullName    string `json:"full_name"`
	Avatar      string `json:"avatar"`
	Bio         string `json:"bio"`
	PhoneNumber string `json:"phone_number"`
}

type Stats struct {
	TotalCoaches    int `json:"total_coaches"`
	ActiveGoals     int `json:"active_goals"`
	CompletedGoals  int `json:"completed_goals"`
	ChatMessages    int `json:"chat_messages"`
	CommunityPosts  int `json:"community_posts"`
}

var db *sql.DB

func main() {
	// Connect to PostgreSQL
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@user-db:5432/userdb?sslmode=disable"
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
	r.Use(authMiddleware())

	// Routes
	r.GET("/users/:id", getUserProfile)
	r.PUT("/users/:id", updateUserProfile)
	r.GET("/users/:id/stats", getUserStats)
	r.DELETE("/users/:id", deleteUser)
	r.GET("/health", healthCheck)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8002"
	}

	log.Printf("User service running on port %s", port)
	r.Run(":" + port)
}

func createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS user_profiles (
		id UUID PRIMARY KEY,
		email VARCHAR(255) NOT NULL,
		username VARCHAR(100) NOT NULL,
		full_name VARCHAR(255),
		avatar TEXT,
		bio TEXT,
		phone_number VARCHAR(20),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE TABLE IF NOT EXISTS user_stats (
		user_id UUID PRIMARY KEY,
		total_coaches INT DEFAULT 0,
		active_goals INT DEFAULT 0,
		completed_goals INT DEFAULT 0,
		chat_messages INT DEFAULT 0,
		community_posts INT DEFAULT 0,
		FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE
	);
	
	CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
	`
	_, err := db.Exec(query)
	return err
}

func getUserProfile(c *gin.Context) {
	userID := c.Param("id")
	
	// Verify user can access this profile
	authUserID := c.GetString("user_id")
	if authUserID != userID {
		c.JSON(403, gin.H{"error": "Forbidden"})
		return
	}

	var profile UserProfile
	query := `
		SELECT id, email, username, full_name, avatar, bio, phone_number, created_at, updated_at
		FROM user_profiles
		WHERE id = $1
	`
	
	err := db.QueryRow(query, userID).Scan(
		&profile.ID, &profile.Email, &profile.Username, &profile.FullName,
		&profile.Avatar, &profile.Bio, &profile.PhoneNumber,
		&profile.CreatedAt, &profile.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	c.JSON(200, profile)
}

func updateUserProfile(c *gin.Context) {
	userID := c.Param("id")
	
	// Verify user can update this profile
	authUserID := c.GetString("user_id")
	if authUserID != userID {
		c.JSON(403, gin.H{"error": "Forbidden"})
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	query := `
		UPDATE user_profiles
		SET full_name = $1, avatar = $2, bio = $3, phone_number = $4, updated_at = CURRENT_TIMESTAMP
		WHERE id = $5
	`
	
	_, err := db.Exec(query, req.FullName, req.Avatar, req.Bio, req.PhoneNumber, userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to update profile"})
		return
	}

	// Return updated profile
	getUserProfile(c)
}

func getUserStats(c *gin.Context) {
	userID := c.Param("id")
	
	// Verify user can access these stats
	authUserID := c.GetString("user_id")
	if authUserID != userID {
		c.JSON(403, gin.H{"error": "Forbidden"})
		return
	}

	var stats Stats
	query := `
		SELECT total_coaches, active_goals, completed_goals, chat_messages, community_posts
		FROM user_stats
		WHERE user_id = $1
	`
	
	err := db.QueryRow(query, userID).Scan(
		&stats.TotalCoaches, &stats.ActiveGoals, &stats.CompletedGoals,
		&stats.ChatMessages, &stats.CommunityPosts,
	)
	
	if err == sql.ErrNoRows {
		// Initialize stats if not exists
		stats = Stats{}
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	c.JSON(200, stats)
}

func deleteUser(c *gin.Context) {
	userID := c.Param("id")
	
	// Verify user can delete this profile
	authUserID := c.GetString("user_id")
	if authUserID != userID {
		c.JSON(403, gin.H{"error": "Forbidden"})
		return
	}

	query := "DELETE FROM user_profiles WHERE id = $1"
	_, err := db.Exec(query, userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete user"})
		return
	}

	c.JSON(200, gin.H{"message": "User deleted successfully"})
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "healthy"})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// In production, validate JWT token with auth service
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
			// For now, allow test requests
			userID = c.Query("user_id")
		}
		
		if userID != "" {
			c.Set("user_id", userID)
		}
		c.Next()
	}
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

