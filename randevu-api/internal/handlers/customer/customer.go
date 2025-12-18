package customer

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"randevu-api/internal/models"
)

type CustomerHandler struct {
	db *gorm.DB
}

func NewCustomerHandler(db *gorm.DB) *CustomerHandler {
	return &CustomerHandler{db: db}
}

// GetProfile - Customer'ın kendi profilini görüntülemesi
func (h *CustomerHandler) GetProfile(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	return c.JSON(http.StatusOK, user)
}

// UpdateProfile - Customer'ın kendi profilini güncellemesi
func (h *CustomerHandler) UpdateProfile(c echo.Context) error {
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

// GetMyAppointments - Customer'ın kendi randevularını görüntülemesi
func (h *CustomerHandler) GetMyAppointments(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var appointments []models.Appointment
	if err := h.db.Where("customer_id = ?", userID).
		Preload("Seller").
		Order("start_time DESC").
		Find(&appointments).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch appointments")
	}

	return c.JSON(http.StatusOK, appointments)
}

// CreateAppointment - Customer'ın yeni randevu oluşturması
func (h *CustomerHandler) CreateAppointment(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	
	var req struct {
		SellerID    uint   `json:"seller_id" validate:"required"`
		Title       string `json:"title" validate:"required"`
		Description string `json:"description"`
		StartTime   string `json:"start_time" validate:"required"`
		EndTime     string `json:"end_time" validate:"required"`
		Location    string `json:"location"`
		Notes       string `json:"notes"`
	}

	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	// Parse time
	startTime, err := parseTime(req.StartTime)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid start time format")
	}

	endTime, err := parseTime(req.EndTime)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid end time format")
	}

	// Check if seller exists and is a seller
	var seller models.User
	if err := h.db.Where("id = ? AND role = ?", req.SellerID, models.RoleSeller).First(&seller).Error; err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid seller")
	}

	appointment := models.Appointment{
		CustomerID:  userID,
		SellerID:    req.SellerID,
		Title:       req.Title,
		Description: req.Description,
		StartTime:   startTime,
		EndTime:     endTime,
		Location:    req.Location,
		Notes:       req.Notes,
		Status:      models.StatusPending,
	}

	if err := h.db.Create(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to create appointment")
	}

	return c.JSON(http.StatusCreated, appointment)
}

// CancelAppointment - Customer'ın randevusunu iptal etmesi
func (h *CustomerHandler) CancelAppointment(c echo.Context) error {
	userID := c.Get("user_id").(uint)
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	var appointment models.Appointment
	if err := h.db.Where("id = ? AND customer_id = ?", appointmentID, userID).First(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Appointment not found")
	}

	// Only allow cancellation if status is pending or confirmed
	if appointment.Status != models.StatusPending && appointment.Status != models.StatusConfirmed {
		return echo.NewHTTPError(http.StatusBadRequest, "Cannot cancel appointment with current status")
	}

	appointment.Status = models.StatusCancelled
	if err := h.db.Save(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to cancel appointment")
	}

	return c.JSON(http.StatusOK, appointment)
}

// Helper function to parse time
func parseTime(timeStr string) (time.Time, error) {
	return time.Parse("2006-01-02T15:04:05Z", timeStr)
}
