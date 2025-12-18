package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"

	"github.com/momby/user-service/internal/models"
)

func Initialize(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// Auto migrate
	if err := db.AutoMigrate(
		&models.User{},
		&models.PregnancyInfo{},
		&models.Address{},
		&models.Favorite{},
	); err != nil {
		log.Printf("Failed to auto migrate: %v", err)
	}

	log.Println("Database connection established")
	return db, nil
}
