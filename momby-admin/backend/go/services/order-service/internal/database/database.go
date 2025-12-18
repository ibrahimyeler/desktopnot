package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"

	"github.com/momby/order-service/internal/models"
)

func Initialize(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
	); err != nil {
		log.Printf("Failed to auto migrate: %v", err)
	}

	log.Println("Database connection established")
	return db, nil
}

