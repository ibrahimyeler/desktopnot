package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Phone        string    `json:"phone"`
	ProfileImage string    `json:"profile_image"`
	Role         string    `gorm:"default:customer" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`

	// Relations
	PregnancyInfo *PregnancyInfo `gorm:"foreignKey:UserID" json:"pregnancy_info,omitempty"`
	Addresses     []Address      `gorm:"foreignKey:UserID" json:"addresses,omitempty"`
	Favorites     []Favorite     `gorm:"foreignKey:UserID" json:"favorites,omitempty"`
}

type PregnancyInfo struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID        uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	CurrentWeek   int       `json:"current_week"`
	DueDate       *time.Time `json:"due_date"`
	PregnancyType string    `json:"pregnancy_type"` // single, twin, etc.
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type Address struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	Title       string    `json:"title"`
	FullName    string    `json:"full_name"`
	Phone       string    `json:"phone"`
	AddressLine string    `json:"address_line"`
	City        string    `json:"city"`
	District    string    `json:"district"`
	PostalCode  string    `json:"postal_code"`
	Country     string    `json:"country"`
	IsDefault   bool      `gorm:"default:false" json:"is_default"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Favorite struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID    uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	ItemID    string    `json:"item_id"` // Product or service ID
	ItemType  string    `json:"item_type"` // product, service
	CreatedAt time.Time `json:"created_at"`
}

