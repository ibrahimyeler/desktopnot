package customer

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/kovan/backend/internal/middleware/tenant"
)

// CustomerHandlers handles customer panel requests
type CustomerHandlers struct {
	// Add service dependencies here
}

// NewCustomerHandlers creates a new customer handlers instance
func NewCustomerHandlers() *CustomerHandlers {
	return &CustomerHandlers{}
}

// GetServices returns a list of services for the current tenant
func (h *CustomerHandlers) GetServices(w http.ResponseWriter, r *http.Request) {
	tenantCtx, ok := tenant.GetTenantContext(r.Context())
	if !ok {
		http.Error(w, "Tenant context not found", http.StatusBadRequest)
		return
	}

	// TODO: Implement service retrieval logic
	services := []map[string]interface{}{
		{
			"id":          "1",
			"name":        "Sample Service",
			"description": "A sample service for " + tenantCtx.TenantID,
			"price":       99.99,
		},
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"services": services,
		"tenant":   tenantCtx.TenantID,
	})
}

// GetService returns a specific service by ID
func (h *CustomerHandlers) GetService(w http.ResponseWriter, r *http.Request) {
	serviceID := chi.URLParam(r, "serviceID")
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement service retrieval logic
	service := map[string]interface{}{
		"id":          serviceID,
		"name":        "Service " + serviceID,
		"description": "Detailed description for service " + serviceID,
		"price":       99.99,
		"tenant":      tenantCtx.TenantID,
	}

	json.NewEncoder(w).Encode(service)
}

// GetServiceAvailability returns availability for a service
func (h *CustomerHandlers) GetServiceAvailability(w http.ResponseWriter, r *http.Request) {
	serviceID := chi.URLParam(r, "serviceID")
	
	// TODO: Implement availability logic
	availability := map[string]interface{}{
		"service_id": serviceID,
		"available":  true,
		"slots": []map[string]interface{}{
			{"time": "09:00", "available": true},
			{"time": "10:00", "available": true},
			{"time": "11:00", "available": false},
		},
	}

	json.NewEncoder(w).Encode(availability)
}

// CreateBooking creates a new booking
func (h *CustomerHandlers) CreateBooking(w http.ResponseWriter, r *http.Request) {
	var bookingRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&bookingRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement booking creation logic
	booking := map[string]interface{}{
		"id":          "booking_123",
		"service_id":  bookingRequest["service_id"],
		"customer_id": "customer_456",
		"tenant_id":   tenantCtx.TenantID,
		"status":      "pending",
		"created_at":  "2024-01-01T10:00:00Z",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(booking)
}

// GetBooking returns a specific booking
func (h *CustomerHandlers) GetBooking(w http.ResponseWriter, r *http.Request) {
	bookingID := chi.URLParam(r, "bookingID")

	// TODO: Implement booking retrieval logic
	booking := map[string]interface{}{
		"id":         bookingID,
		"service_id": "service_123",
		"status":     "confirmed",
		"created_at": "2024-01-01T10:00:00Z",
	}

	json.NewEncoder(w).Encode(booking)
}

// UpdateBooking updates a booking
func (h *CustomerHandlers) UpdateBooking(w http.ResponseWriter, r *http.Request) {
	bookingID := chi.URLParam(r, "bookingID")
	
	var updateRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement booking update logic
	booking := map[string]interface{}{
		"id":         bookingID,
		"updated":    true,
		"changes":    updateRequest,
	}

	json.NewEncoder(w).Encode(booking)
}

// CancelBooking cancels a booking
func (h *CustomerHandlers) CancelBooking(w http.ResponseWriter, r *http.Request) {
	bookingID := chi.URLParam(r, "bookingID")

	// TODO: Implement booking cancellation logic
	response := map[string]interface{}{
		"id":      bookingID,
		"status":  "cancelled",
		"message": "Booking cancelled successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// GetProfile returns customer profile
func (h *CustomerHandlers) GetProfile(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement profile retrieval logic
	profile := map[string]interface{}{
		"id":       "customer_123",
		"name":     "John Doe",
		"email":    "john@example.com",
		"phone":    "+1234567890",
		"language": "en",
	}

	json.NewEncoder(w).Encode(profile)
}

// UpdateProfile updates customer profile
func (h *CustomerHandlers) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var profileRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&profileRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement profile update logic
	profile := map[string]interface{}{
		"id":       "customer_123",
		"updated":  true,
		"changes":  profileRequest,
	}

	json.NewEncoder(w).Encode(profile)
}

// GetTranslations returns translations for a specific locale
func (h *CustomerHandlers) GetTranslations(w http.ResponseWriter, r *http.Request) {
	locale := chi.URLParam(r, "locale")
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement translation retrieval logic
	translations := map[string]interface{}{
		"locale": locale,
		"tenant": tenantCtx.TenantID,
		"translations": map[string]string{
			"welcome":     "Welcome",
			"book_now":    "Book Now",
			"services":    "Services",
			"profile":     "Profile",
		},
	}

	json.NewEncoder(w).Encode(translations)
}

// GetVendorPage returns a vendor-defined page
func (h *CustomerHandlers) GetVendorPage(w http.ResponseWriter, r *http.Request) {
	pageSlug := chi.URLParam(r, "pageSlug")
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement vendor page retrieval logic
	page := map[string]interface{}{
		"slug":   pageSlug,
		"tenant": tenantCtx.TenantID,
		"title":  "Vendor Page: " + pageSlug,
		"blocks": []map[string]interface{}{
			{
				"type":    "hero",
				"content": "Welcome to our service",
			},
			{
				"type":    "services",
				"content": "Our services list",
			},
		},
	}

	json.NewEncoder(w).Encode(page)
}

// Export handler functions for use in routes
func GetServices(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetServices(w, r)
}

func GetService(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetService(w, r)
}

func GetServiceAvailability(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetServiceAvailability(w, r)
}

func CreateBooking(w http.ResponseWriter, r *http.Request) {
	customerHandlers.CreateBooking(w, r)
}

func GetBooking(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetBooking(w, r)
}

func UpdateBooking(w http.ResponseWriter, r *http.Request) {
	customerHandlers.UpdateBooking(w, r)
}

func CancelBooking(w http.ResponseWriter, r *http.Request) {
	customerHandlers.CancelBooking(w, r)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetProfile(w, r)
}

func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	customerHandlers.UpdateProfile(w, r)
}

func GetTranslations(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetTranslations(w, r)
}

func GetVendorPage(w http.ResponseWriter, r *http.Request) {
	customerHandlers.GetVendorPage(w, r)
}

// Export handlers for use in routes
var customerHandlers = NewCustomerHandlers()
