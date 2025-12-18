package seller

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"randevu-api/internal/models"
)

type SellerHandler struct {
	db *gorm.DB
}

func NewSellerHandler(db *gorm.DB) *SellerHandler {
	return &SellerHandler{db: db}
}

// GetProfile - Seller'ın kendi profilini görüntülemesi
func (h *SellerHandler) GetProfile(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	return c.JSON(http.StatusOK, user)
}

// UpdateProfile - Seller'ın kendi profilini güncellemesi
func (h *SellerHandler) UpdateProfile(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Phone     string `json:"phone"`
	}

	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	// Update fields
	if req.FirstName != "" {
		user.FirstName = req.FirstName
	}
	if req.LastName != "" {
		user.LastName = req.LastName
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}

	if err := h.db.Save(&user).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update profile")
	}

	return c.JSON(http.StatusOK, user)
}

// GetMyAppointments - Seller'ın kendi randevularını görüntülemesi
func (h *SellerHandler) GetMyAppointments(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var appointments []models.Appointment
	if err := h.db.Where("seller_id = ?", userID).
		Preload("Customer").
		Order("start_time DESC").
		Find(&appointments).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch appointments")
	}

	return c.JSON(http.StatusOK, appointments)
}

// GetAppointment - Seller'ın belirli bir randevuyu görüntülemesi
func (h *SellerHandler) GetAppointment(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	var appointment models.Appointment
	if err := h.db.Where("id = ? AND seller_id = ?", appointmentID, userID).
		Preload("Customer").
		First(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Appointment not found")
	}

	return c.JSON(http.StatusOK, appointment)
}

// UpdateAppointmentStatus - Seller'ın randevu durumunu güncellemesi
func (h *SellerHandler) UpdateAppointmentStatus(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	var req struct {
		Status string `json:"status" validate:"required,oneof=confirmed cancelled completed"`
	}

	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	var appointment models.Appointment
	if err := h.db.Where("id = ? AND seller_id = ?", appointmentID, userID).First(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Appointment not found")
	}

	// Update status
	appointment.Status = models.AppointmentStatus(req.Status)
	if err := h.db.Save(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update appointment")
	}

	return c.JSON(http.StatusOK, appointment)
}

// GetCustomers - Seller'ın müşterilerini görüntülemesi
func (h *SellerHandler) GetCustomers(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var customers []models.User
	if err := h.db.Distinct("users.*").
		Joins("JOIN appointments ON appointments.customer_id = users.id").
		Where("appointments.seller_id = ? AND users.role = ?", userID, models.RoleCustomer).
		Find(&customers).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch customers")
	}

	return c.JSON(http.StatusOK, customers)
}

// GetAppointmentStats - Seller'ın randevu istatistiklerini görüntülemesi
func (h *SellerHandler) GetAppointmentStats(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var stats struct {
		Total       int64 `json:"total"`
		Pending     int64 `json:"pending"`
		Confirmed   int64 `json:"confirmed"`
		Cancelled   int64 `json:"cancelled"`
		Completed   int64 `json:"completed"`
	}

	// Get counts for each status
	h.db.Model(&models.Appointment{}).Where("seller_id = ?", userID).Count(&stats.Total)
	h.db.Model(&models.Appointment{}).Where("seller_id = ? AND status = ?", userID, models.StatusPending).Count(&stats.Pending)
	h.db.Model(&models.Appointment{}).Where("seller_id = ? AND status = ?", userID, models.StatusConfirmed).Count(&stats.Confirmed)
	h.db.Model(&models.Appointment{}).Where("seller_id = ? AND status = ?", userID, models.StatusCancelled).Count(&stats.Cancelled)
	h.db.Model(&models.Appointment{}).Where("seller_id = ? AND status = ?", userID, models.StatusCompleted).Count(&stats.Completed)

	return c.JSON(http.StatusOK, stats)
}
