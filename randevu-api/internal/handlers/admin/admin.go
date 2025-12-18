package admin

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
	"randevu-api/internal/models"
)

type AdminHandler struct {
	db *gorm.DB
}

func NewAdminHandler(db *gorm.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// GetAllUsers - Admin'in tüm kullanıcıları görüntülemesi
func (h *AdminHandler) GetAllUsers(c echo.Context) error {
	var users []models.User
	if err := h.db.Find(&users).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch users")
	}

	return c.JSON(http.StatusOK, users)
}

// GetUser - Admin'in belirli bir kullanıcıyı görüntülemesi
func (h *AdminHandler) GetUser(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	var user models.User
	if err := h.db.First(&user, userID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	return c.JSON(http.StatusOK, user)
}

// UpdateUser - Admin'in kullanıcı bilgilerini güncellemesi
func (h *AdminHandler) UpdateUser(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
		Phone     string `json:"phone"`
		Role      string `json:"role"`
		IsActive  *bool  `json:"is_active"`
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
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}
	if req.Role != "" {
		user.Role = models.UserRole(req.Role)
	}
	if req.IsActive != nil {
		user.IsActive = *req.IsActive
	}

	if err := h.db.Save(&user).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update user")
	}

	return c.JSON(http.StatusOK, user)
}

// DeleteUser - Admin'in kullanıcıyı silmesi
func (h *AdminHandler) DeleteUser(c echo.Context) error {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid user ID")
	}

	if err := h.db.Delete(&models.User{}, userID).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete user")
	}

	return c.NoContent(http.StatusNoContent)
}

// GetAllAppointments - Admin'in tüm randevuları görüntülemesi
func (h *AdminHandler) GetAllAppointments(c echo.Context) error {
	var appointments []models.Appointment
	if err := h.db.Preload("Customer").Preload("Seller").Find(&appointments).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch appointments")
	}

	return c.JSON(http.StatusOK, appointments)
}

// GetAppointment - Admin'in belirli bir randevuyu görüntülemesi
func (h *AdminHandler) GetAppointment(c echo.Context) error {
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	var appointment models.Appointment
	if err := h.db.Preload("Customer").Preload("Seller").First(&appointment, appointmentID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Appointment not found")
	}

	return c.JSON(http.StatusOK, appointment)
}

// UpdateAppointment - Admin'in randevu bilgilerini güncellemesi
func (h *AdminHandler) UpdateAppointment(c echo.Context) error {
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	var req struct {
		Title       string `json:"title"`
		Description string `json:"description"`
		StartTime   string `json:"start_time"`
		EndTime     string `json:"end_time"`
		Status      string `json:"status"`
		Location    string `json:"location"`
		Notes       string `json:"notes"`
	}

	if err := c.Bind(&req); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request body")
	}

	var appointment models.Appointment
	if err := h.db.First(&appointment, appointmentID).Error; err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Appointment not found")
	}

	// Update fields
	if req.Title != "" {
		appointment.Title = req.Title
	}
	if req.Description != "" {
		appointment.Description = req.Description
	}
	if req.StartTime != "" {
		// Parse and update start time
		// Implementation needed
	}
	if req.EndTime != "" {
		// Parse and update end time
		// Implementation needed
	}
	if req.Status != "" {
		appointment.Status = models.AppointmentStatus(req.Status)
	}
	if req.Location != "" {
		appointment.Location = req.Location
	}
	if req.Notes != "" {
		appointment.Notes = req.Notes
	}

	if err := h.db.Save(&appointment).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to update appointment")
	}

	return c.JSON(http.StatusOK, appointment)
}

// DeleteAppointment - Admin'in randevuyu silmesi
func (h *AdminHandler) DeleteAppointment(c echo.Context) error {
	appointmentID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid appointment ID")
	}

	if err := h.db.Delete(&models.Appointment{}, appointmentID).Error; err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete appointment")
	}

	return c.NoContent(http.StatusNoContent)
}

// GetDashboardStats - Admin dashboard istatistikleri
func (h *AdminHandler) GetDashboardStats(c echo.Context) error {
	var stats struct {
		TotalUsers      int64 `json:"total_users"`
		TotalCustomers  int64 `json:"total_customers"`
		TotalSellers    int64 `json:"total_sellers"`
		TotalAdmins     int64 `json:"total_admins"`
		TotalAppointments int64 `json:"total_appointments"`
		PendingAppointments int64 `json:"pending_appointments"`
		ConfirmedAppointments int64 `json:"confirmed_appointments"`
		CancelledAppointments int64 `json:"cancelled_appointments"`
		CompletedAppointments int64 `json:"completed_appointments"`
	}

	// User counts
	h.db.Model(&models.User{}).Count(&stats.TotalUsers)
	h.db.Model(&models.User{}).Where("role = ?", models.RoleCustomer).Count(&stats.TotalCustomers)
	h.db.Model(&models.User{}).Where("role = ?", models.RoleSeller).Count(&stats.TotalSellers)
	h.db.Model(&models.User{}).Where("role = ?", models.RoleAdmin).Count(&stats.TotalAdmins)

	// Appointment counts
	h.db.Model(&models.Appointment{}).Count(&stats.TotalAppointments)
	h.db.Model(&models.Appointment{}).Where("status = ?", models.StatusPending).Count(&stats.PendingAppointments)
	h.db.Model(&models.Appointment{}).Where("status = ?", models.StatusConfirmed).Count(&stats.ConfirmedAppointments)
	h.db.Model(&models.Appointment{}).Where("status = ?", models.StatusCancelled).Count(&stats.CancelledAppointments)
	h.db.Model(&models.Appointment{}).Where("status = ?", models.StatusCompleted).Count(&stats.CompletedAppointments)

	return c.JSON(http.StatusOK, stats)
}
