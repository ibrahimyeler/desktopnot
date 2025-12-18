package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type Coach struct {
	ID          string    `json:"id"`
	UserID      string    `json:"user_id"`
	Name        string    `json:"name"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	SystemPrompt string   `json:"system_prompt"`
	Config      string    `json:"config"` // JSON string
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CreateCoachRequest struct {
	Name        string                 `json:"name" binding:"required"`
	Category    string                 `json:"category" binding:"required"`
	Description string                 `json:"description" binding:"required"`
	Icon        string                 `json:"icon" binding:"required"`
	SystemPrompt string                `json:"system_prompt" binding:"required"`
	Config      map[string]interface{} `json:"config"`
}

type UpdateCoachRequest struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	SystemPrompt string                `json:"system_prompt"`
	Config      map[string]interface{} `json:"config"`
}

var db *sql.DB

func main() {
	// Connect to PostgreSQL
	var err error
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://postgres:postgres@coach-db:5432/coachdb?sslmode=disable"
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
	r.POST("/coaches", createCoach)
	r.GET("/coaches", getCoaches)
	r.GET("/coaches/:id", getCoach)
	r.PUT("/coaches/:id", updateCoach)
	r.DELETE("/coaches/:id", deleteCoach)
	r.GET("/health", healthCheck)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}

	log.Printf("Coach service running on port %s", port)
	r.Run(":" + port)
}

func createTables() error {
	query := `
	CREATE TABLE IF NOT EXISTS coaches (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		user_id UUID NOT NULL,
		name VARCHAR(255) NOT NULL,
		category VARCHAR(100) NOT NULL,
		description TEXT NOT NULL,
		icon VARCHAR(50) NOT NULL,
		system_prompt TEXT NOT NULL,
		config JSONB,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON coaches(user_id);
	CREATE INDEX IF NOT EXISTS idx_coaches_category ON coaches(category);
	`
	_, err := db.Exec(query)
	return err
}

func createCoach(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	var req CreateCoachRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Convert config to JSON
	configJSON, err := json.Marshal(req.Config)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid config format"})
		return
	}

	var coach Coach
	query := `
		INSERT INTO coaches (user_id, name, category, description, icon, system_prompt, config)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, user_id, name, category, description, icon, system_prompt, config::text, created_at, updated_at
	`
	
	err = db.QueryRow(query, userID, req.Name, req.Category, req.Description, req.Icon, req.SystemPrompt, string(configJSON)).
		Scan(&coach.ID, &coach.UserID, &coach.Name, &coach.Category, &coach.Description, &coach.Icon,
			&coach.SystemPrompt, &coach.Config, &coach.CreatedAt, &coach.UpdatedAt)
	
	if err != nil {
		log.Printf("Error creating coach: %v", err)
		c.JSON(500, gin.H{"error": "Failed to create coach"})
		return
	}

	c.JSON(201, coach)
}

func getCoaches(c *gin.Context) {
	userID := c.GetString("user_id")
	if userID == "" {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	category := c.Query("category")
	
	var rows *sql.Rows
	var err error
	
	if category != "" {
		query := `
			SELECT id, user_id, name, category, description, icon, system_prompt, config::text, created_at, updated_at
			FROM coaches
			WHERE user_id = $1 AND category = $2
			ORDER BY created_at DESC
		`
		rows, err = db.Query(query, userID, category)
	} else {
		query := `
			SELECT id, user_id, name, category, description, icon, system_prompt, config::text, created_at, updated_at
			FROM coaches
			WHERE user_id = $1
			ORDER BY created_at DESC
		`
		rows, err = db.Query(query, userID)
	}
	
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch coaches"})
		return
	}
	defer rows.Close()

	var coaches []Coach
	for rows.Next() {
		var coach Coach
		err := rows.Scan(&coach.ID, &coach.UserID, &coach.Name, &coach.Category, &coach.Description,
			&coach.Icon, &coach.SystemPrompt, &coach.Config, &coach.CreatedAt, &coach.UpdatedAt)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to parse coaches"})
			return
		}
		coaches = append(coaches, coach)
	}

	c.JSON(200, gin.H{"coaches": coaches})
}

func getCoach(c *gin.Context) {
	coachID := c.Param("id")
	userID := c.GetString("user_id")
	
	if userID == "" {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	var coach Coach
	query := `
		SELECT id, user_id, name, category, description, icon, system_prompt, config::text, created_at, updated_at
		FROM coaches
		WHERE id = $1 AND user_id = $2
	`
	
	err := db.QueryRow(query, coachID, userID).Scan(
		&coach.ID, &coach.UserID, &coach.Name, &coach.Category, &coach.Description,
		&coach.Icon, &coach.SystemPrompt, &coach.Config, &coach.CreatedAt, &coach.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		c.JSON(404, gin.H{"error": "Coach not found"})
		return
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Database error"})
		return
	}

	c.JSON(200, coach)
}

func updateCoach(c *gin.Context) {
	coachID := c.Param("id")
	userID := c.GetString("user_id")
	
	if userID == "" {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	var req UpdateCoachRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// Build update query dynamically
	var updates []string
	var values []interface{}
	argIndex := 1

	if req.Name != "" {
		updates = append(updates, "name = $"+string(rune('0'+argIndex)))
		values = append(values, req.Name)
		argIndex++
	}
	
	if req.Description != "" {
		updates = append(updates, "description = $"+string(rune('0'+argIndex)))
		values = append(values, req.Description)
		argIndex++
	}
	
	if req.SystemPrompt != "" {
		updates = append(updates, "system_prompt = $"+string(rune('0'+argIndex)))
		values = append(values, req.SystemPrompt)
		argIndex++
	}
	
	if req.Config != nil {
		configJSON, _ := json.Marshal(req.Config)
		updates = append(updates, "config = $"+string(rune('0'+argIndex))+"::jsonb")
		values = append(values, string(configJSON))
		argIndex++
	}

	if len(updates) == 0 {
		c.JSON(400, gin.H{"error": "No fields to update"})
		return
	}

	updates = append(updates, "updated_at = CURRENT_TIMESTAMP")
	values = append(values, coachID, userID)

	query := "UPDATE coaches SET " + 
		updates[0]
	for i := 1; i < len(updates); i++ {
		query += ", " + updates[i]
	}
	query += " WHERE id = $" + string(rune('0'+len(updates)+1)) + " AND user_id = $" + string(rune('0'+len(updates)+2))

	_, err := db.Exec(query, values...)
	if err != nil {
		log.Printf("Error updating coach: %v", err)
		c.JSON(500, gin.H{"error": "Failed to update coach"})
		return
	}

	// Return updated coach
	getCoach(c)
}

func deleteCoach(c *gin.Context) {
	coachID := c.Param("id")
	userID := c.GetString("user_id")
	
	if userID == "" {
		c.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}

	query := "DELETE FROM coaches WHERE id = $1 AND user_id = $2"
	_, err := db.Exec(query, coachID, userID)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete coach"})
		return
	}

	c.JSON(200, gin.H{"message": "Coach deleted successfully"})
}

func healthCheck(c *gin.Context) {
	c.JSON(200, gin.H{"status": "healthy"})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetHeader("X-User-ID")
		if userID == "" {
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

