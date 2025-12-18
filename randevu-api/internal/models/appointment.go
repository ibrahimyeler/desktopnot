package models

import (
	"time"

	"gorm.io/gorm"
)

type AppointmentStatus string

const (
	StatusPending   AppointmentStatus = "pending"
	StatusConfirmed AppointmentStatus = "confirmed"
	StatusCancelled AppointmentStatus = "cancelled"
	StatusCompleted AppointmentStatus = "completed"
)

type Appointment struct {
	ID          uint              `json:"id" gorm:"primaryKey"`
	CustomerID  uint              `json:"customer_id" gorm:"not null"`
	SellerID    uint              `json:"seller_id" gorm:"not null"`
	Title       string            `json:"title" gorm:"not null"`
	Description string            `json:"description"`
	StartTime   time.Time         `json:"start_time" gorm:"not null"`
	EndTime     time.Time         `json:"end_time" gorm:"not null"`
	Status      AppointmentStatus `json:"status" gorm:"type:varchar(20);default:'pending'"`
	Location    string            `json:"location"`
	Notes       string            `json:"notes"`
	CreatedAt   time.Time         `json:"created_at"`
	UpdatedAt   time.Time         `json:"updated_at"`
	DeletedAt   gorm.DeletedAt    `json:"-" gorm:"index"`

	// Relations
	Customer User `json:"customer" gorm:"foreignKey:CustomerID"`
	Seller   User `json:"seller" gorm:"foreignKey:SellerID"`
}

// TableName specifies the table name for Appointment model
func (Appointment) TableName() string {
	return "appointments"
}
