package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Order struct {
	ID          uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	UserID      uuid.UUID `gorm:"type:uuid;not null" json:"user_id"`
	VendorID    uuid.UUID `gorm:"type:uuid" json:"vendor_id"`
	TotalAmount float64   `gorm:"type:decimal(10,2)" json:"total_amount"`
	Status      string    `json:"status"` // pending, confirmed, processing, shipped, delivered, cancelled
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	Items []OrderItem `gorm:"foreignKey:OrderID" json:"items,omitempty"`
}

type OrderItem struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	OrderID   uuid.UUID `gorm:"type:uuid;not null" json:"order_id"`
	ProductID string    `json:"product_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `gorm:"type:decimal(10,2)" json:"price"`
}

type Payment struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key;default:gen_random_uuid()" json:"id"`
	OrderID       uuid.UUID `gorm:"type:uuid;not null" json:"order_id"`
	Amount        float64   `gorm:"type:decimal(10,2)" json:"amount"`
	PaymentMethod string    `json:"payment_method"` // stripe, paypal
	Status        string    `json:"status"`         // pending, completed, failed, refunded
	TransactionID string   `json:"transaction_id"`
	CreatedAt     time.Time `json:"created_at"`
}

