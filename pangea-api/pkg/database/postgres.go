package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

type Database struct {
	*sql.DB
}


func NewDatabase() (*Database, error) {
	// Database connection string for macOS with Homebrew PostgreSQL
	connStr := "host=localhost port=5432 user=macbookpro dbname=pangea_api sslmode=disable"

	log.Printf("Connecting to database with: %s", connStr)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	log.Println("✅ Database connected successfully")
	return &Database{db}, nil
}

// User model
type DBUser struct {
	ID           string `json:"id"`
	FirstName    string `json:"firstname"`
	LastName     string `json:"lastname"`
	Email        string `json:"email"`
	PasswordHash string `json:"password_hash"`
	CreatedAt    string `json:"created_at"`
	UpdatedAt    string `json:"updated_at"`
}

// Admin model
type DBAdmin struct {
	ID           string   `json:"id"`
	FirstName    string   `json:"firstname"`
	LastName     string   `json:"lastname"`
	Email        string   `json:"email"`
	PasswordHash string   `json:"password_hash"`
	Role         string   `json:"role"`
	Permissions  []string `json:"permissions"`
	CreatedAt    string   `json:"created_at"`
	UpdatedAt    string   `json:"updated_at"`
}

// Create tables
func (db *Database) CreateTables() error {
	// Users table
	usersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		firstname VARCHAR(100) NOT NULL,
		lastname VARCHAR(100) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	// Admins table
	adminsTable := `
	CREATE TABLE IF NOT EXISTS admins (
		id SERIAL PRIMARY KEY,
		firstname VARCHAR(100) NOT NULL,
		lastname VARCHAR(100) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		role VARCHAR(50) NOT NULL DEFAULT 'moderator',
		permissions JSONB DEFAULT '[]',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	// OAuth users table
	oauthUsersTable := `
	CREATE TABLE IF NOT EXISTS oauth_users (
		id SERIAL PRIMARY KEY,
		provider VARCHAR(50) NOT NULL,
		provider_user_id VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		firstname VARCHAR(100),
		lastname VARCHAR(100),
		picture VARCHAR(500),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		UNIQUE(provider, provider_user_id)
	);`

	// Execute table creation
	if _, err := db.Exec(usersTable); err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}

	if _, err := db.Exec(adminsTable); err != nil {
		return fmt.Errorf("failed to create admins table: %v", err)
	}

	if _, err := db.Exec(oauthUsersTable); err != nil {
		return fmt.Errorf("failed to create oauth_users table: %v", err)
	}

	log.Println("✅ Database tables created successfully")
	return nil
}

// Insert sample data
func (db *Database) InsertSampleData() error {
	// Insert sample admin
	adminQuery := `
	INSERT INTO admins (firstname, lastname, email, password_hash, role, permissions) 
	VALUES ($1, $2, $3, $4, $5, $6)
	ON CONFLICT (email) DO NOTHING;`

	// Super admin
	_, err := db.Exec(adminQuery, 
		"Admin", 
		"User", 
		"admin@example.com", 
		"$2a$10$hashed_password_here", // In real app, hash the password
		"super_admin",
		`["user_management", "content_management", "system_settings", "analytics", "security_logs"]`,
	)
	if err != nil {
		return fmt.Errorf("failed to insert super admin: %v", err)
	}

	// Moderator
	_, err = db.Exec(adminQuery,
		"Moderator",
		"User", 
		"moderator@example.com",
		"$2a$10$hashed_password_here", // In real app, hash the password
		"moderator",
		`["content_moderation", "user_reports", "basic_analytics"]`,
	)
	if err != nil {
		return fmt.Errorf("failed to insert moderator: %v", err)
	}

	log.Println("✅ Sample data inserted successfully")
	return nil
} 