package repositories

import (
	"github.com/google/uuid"
	"github.com/momby/order-service/internal/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

func (r *OrderRepository) Create(order models.Order) (models.Order, error) {
	err := r.db.Create(&order).Error
	return order, err
}

func (r *OrderRepository) GetByID(id uuid.UUID) (models.Order, error) {
	var order models.Order
	err := r.db.Preload("Items").First(&order, "id = ?", id).Error
	return order, err
}

func (r *OrderRepository) GetOrders(userID, vendorID string) ([]models.Order, error) {
	var orders []models.Order
	query := r.db.Preload("Items")

	if userID != "" {
		query = query.Where("user_id = ?", userID)
	}
	if vendorID != "" {
		query = query.Where("vendor_id = ?", vendorID)
	}

	err := query.Find(&orders).Error
	return orders, err
}

func (r *OrderRepository) UpdateStatus(id uuid.UUID, status string) (models.Order, error) {
	var order models.Order
	if err := r.db.First(&order, "id = ?", id).Error; err != nil {
		return order, err
	}

	order.Status = status
	err := r.db.Save(&order).Error
	return order, err
}

func (r *OrderRepository) Cancel(id uuid.UUID) (models.Order, error) {
	return r.UpdateStatus(id, "cancelled")
}

func (r *OrderRepository) Refund(id uuid.UUID) (models.Order, error) {
	var order models.Order
	if err := r.db.First(&order, "id = ?", id).Error; err != nil {
		return order, err
	}

	order.Status = "refunded"
	err := r.db.Save(&order).Error

	// Update payment status
	r.db.Model(&models.Payment{}).Where("order_id = ?", id).Update("status", "refunded")

	return order, err
}

func (r *OrderRepository) CreatePayment(payment models.Payment) (models.Payment, error) {
	err := r.db.Create(&payment).Error
	return payment, err
}

func (r *OrderRepository) GetPayment(id uuid.UUID) (models.Payment, error) {
	var payment models.Payment
	err := r.db.First(&payment, "id = ?", id).Error
	return payment, err
}

