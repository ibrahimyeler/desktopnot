package vendor

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"regexp"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/kovan/backend/internal/middleware/tenant"
	"github.com/kovan/backend/internal/middleware/auth"
)

// VendorHandlers handles vendor admin panel requests
type VendorHandlers struct {
	// Add service dependencies here
}

// VendorLoginRequest represents the vendor login request
type VendorLoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// VendorRegisterRequest represents the vendor registration request
type VendorRegisterRequest struct {
	Name            string `json:"name"`
	LastName        string `json:"last_name"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirm_password"`
	Phone           string `json:"phone"`
	BrandName       string `json:"brand_name"`
}

// VendorLoginResponse represents the vendor login response
type VendorLoginResponse struct {
	Token     string    `json:"token"`
	UserID    string    `json:"user_id"`
	UserType  string    `json:"user_type"`
	TenantID  string    `json:"tenant_id"`
	BrandName string    `json:"brand_name"`
	ExpiresAt time.Time `json:"expires_at"`
	Message   string    `json:"message"`
}

// VendorProfileData represents the vendor profile information
type VendorProfileData struct {
	UserID      string    `json:"user_id"`
	Name        string    `json:"name"`
	LastName    string    `json:"last_name"`
	Email       string    `json:"email"`
	Phone       string    `json:"phone"`
	BrandName   string    `json:"brand_name"`
	TenantID    string    `json:"tenant_id"`
	UserType    string    `json:"user_type"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// NewVendorHandlers creates a new vendor handlers instance
func NewVendorHandlers() *VendorHandlers {
	return &VendorHandlers{}
}

// GetPages returns all pages for the vendor
func (h *VendorHandlers) GetPages(w http.ResponseWriter, r *http.Request) {
	vendorID, _ := tenant.GetVendorID(r.Context())
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement pages retrieval logic
	pages := []map[string]interface{}{
		{
			"id":          "page_1",
			"title":       "Home Page",
			"slug":        "home",
			"vendor_id":   vendorID,
			"tenant_id":   tenantCtx.TenantID,
			"status":      "published",
			"created_at":  "2024-01-01T10:00:00Z",
		},
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"pages": pages,
	})
}

// CreatePage creates a new page
func (h *VendorHandlers) CreatePage(w http.ResponseWriter, r *http.Request) {
	var pageRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&pageRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	vendorID, _ := tenant.GetVendorID(r.Context())
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement page creation logic
	page := map[string]interface{}{
		"id":          "page_new",
		"title":       pageRequest["title"],
		"slug":        pageRequest["slug"],
		"vendor_id":   vendorID,
		"tenant_id":   tenantCtx.TenantID,
		"blocks":      pageRequest["blocks"],
		"status":      "draft",
		"created_at":  "2024-01-01T10:00:00Z",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(page)
}

// GetPage returns a specific page
func (h *VendorHandlers) GetPage(w http.ResponseWriter, r *http.Request) {
	pageID := chi.URLParam(r, "pageID")
	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement page retrieval logic
	page := map[string]interface{}{
		"id":        pageID,
		"vendor_id": vendorID,
		"title":     "Sample Page",
		"blocks": []map[string]interface{}{
			{
				"type":    "hero",
				"content": "Welcome to our service",
			},
		},
	}

	json.NewEncoder(w).Encode(page)
}

// UpdatePage updates a page
func (h *VendorHandlers) UpdatePage(w http.ResponseWriter, r *http.Request) {
	pageID := chi.URLParam(r, "pageID")
	
	var updateRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement page update logic
	page := map[string]interface{}{
		"id":       pageID,
		"updated":  true,
		"changes":  updateRequest,
	}

	json.NewEncoder(w).Encode(page)
}

// DeletePage deletes a page
func (h *VendorHandlers) DeletePage(w http.ResponseWriter, r *http.Request) {
	pageID := chi.URLParam(r, "pageID")

	// TODO: Implement page deletion logic
	response := map[string]interface{}{
		"id":      pageID,
		"deleted": true,
		"message": "Page deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// GetAvailableBlocks returns available blocks for the vendor
func (h *VendorHandlers) GetAvailableBlocks(w http.ResponseWriter, r *http.Request) {
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement blocks retrieval logic
	blocks := []map[string]interface{}{
		{
			"id":          "hero_block",
			"name":        "Hero Section",
			"type":        "hero",
			"category":    "layout",
			"tenant_id":   tenantCtx.TenantID,
			"configurable": true,
		},
		{
			"id":          "services_block",
			"name":        "Services List",
			"type":        "services",
			"category":    "content",
			"tenant_id":   tenantCtx.TenantID,
			"configurable": true,
		},
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"blocks": blocks,
	})
}

// GetBlock returns a specific block
func (h *VendorHandlers) GetBlock(w http.ResponseWriter, r *http.Request) {
	blockID := chi.URLParam(r, "blockID")

	// TODO: Implement block retrieval logic
	block := map[string]interface{}{
		"id":   blockID,
		"name": "Sample Block",
		"type": "hero",
		"config": map[string]interface{}{
			"title":    "Welcome",
			"subtitle": "To our service",
		},
	}

	json.NewEncoder(w).Encode(block)
}

// GetCatalog returns the vendor's catalog
func (h *VendorHandlers) GetCatalog(w http.ResponseWriter, r *http.Request) {
	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement catalog retrieval logic
	catalog := map[string]interface{}{
		"vendor_id": vendorID,
		"services": []map[string]interface{}{
			{
				"id":          "service_1",
				"name":        "Basic Service",
				"description": "A basic service offering",
				"price":       99.99,
				"status":      "active",
			},
		},
	}

	json.NewEncoder(w).Encode(catalog)
}

// CreateService creates a new service
func (h *VendorHandlers) CreateService(w http.ResponseWriter, r *http.Request) {
	var serviceRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&serviceRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement service creation logic
	service := map[string]interface{}{
		"id":          "service_new",
		"name":        serviceRequest["name"],
		"description": serviceRequest["description"],
		"price":       serviceRequest["price"],
		"vendor_id":   vendorID,
		"status":      "active",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(service)
}

// UpdateService updates a service
func (h *VendorHandlers) UpdateService(w http.ResponseWriter, r *http.Request) {
	serviceID := chi.URLParam(r, "serviceID")
	
	var updateRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&updateRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement service update logic
	service := map[string]interface{}{
		"id":       serviceID,
		"updated":  true,
		"changes":  updateRequest,
	}

	json.NewEncoder(w).Encode(service)
}

// DeleteService deletes a service
func (h *VendorHandlers) DeleteService(w http.ResponseWriter, r *http.Request) {
	serviceID := chi.URLParam(r, "serviceID")

	// TODO: Implement service deletion logic
	response := map[string]interface{}{
		"id":      serviceID,
		"deleted": true,
		"message": "Service deleted successfully",
	}

	json.NewEncoder(w).Encode(response)
}

// GetAvailability returns availability settings
func (h *VendorHandlers) GetAvailability(w http.ResponseWriter, r *http.Request) {
	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement availability retrieval logic
	availability := map[string]interface{}{
		"vendor_id": vendorID,
		"schedule": map[string]interface{}{
			"monday":    map[string]string{"start": "09:00", "end": "17:00"},
			"tuesday":   map[string]string{"start": "09:00", "end": "17:00"},
			"wednesday": map[string]string{"start": "09:00", "end": "17:00"},
			"thursday":  map[string]string{"start": "09:00", "end": "17:00"},
			"friday":    map[string]string{"start": "09:00", "end": "17:00"},
		},
	}

	json.NewEncoder(w).Encode(availability)
}

// SetAvailability sets availability
func (h *VendorHandlers) SetAvailability(w http.ResponseWriter, r *http.Request) {
	var availabilityRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&availabilityRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement availability setting logic
	response := map[string]interface{}{
		"updated": true,
		"schedule": availabilityRequest["schedule"],
	}

	json.NewEncoder(w).Encode(response)
}

// GetPayments returns payment information
func (h *VendorHandlers) GetPayments(w http.ResponseWriter, r *http.Request) {
	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement payments retrieval logic
	payments := map[string]interface{}{
		"vendor_id": vendorID,
		"payments": []map[string]interface{}{
			{
				"id":        "payment_1",
				"amount":    99.99,
				"status":    "completed",
				"created_at": "2024-01-01T10:00:00Z",
			},
		},
	}

	json.NewEncoder(w).Encode(payments)
}

// GetPayment returns a specific payment
func (h *VendorHandlers) GetPayment(w http.ResponseWriter, r *http.Request) {
	paymentID := chi.URLParam(r, "paymentID")

	// TODO: Implement payment retrieval logic
	payment := map[string]interface{}{
		"id":        paymentID,
		"amount":    99.99,
		"status":    "completed",
		"created_at": "2024-01-01T10:00:00Z",
	}

	json.NewEncoder(w).Encode(payment)
}

// GetThemes returns available themes
func (h *VendorHandlers) GetThemes(w http.ResponseWriter, r *http.Request) {
	tenantCtx, _ := tenant.GetTenantContext(r.Context())

	// TODO: Implement themes retrieval logic
	themes := []map[string]interface{}{
		{
			"id":        "theme_1",
			"name":      "Default Theme",
			"tenant_id": tenantCtx.TenantID,
			"active":    true,
		},
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"themes": themes,
	})
}

// UpdateTheme updates a theme
func (h *VendorHandlers) UpdateTheme(w http.ResponseWriter, r *http.Request) {
	themeID := chi.URLParam(r, "themeID")
	
	var themeRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&themeRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement theme update logic
	theme := map[string]interface{}{
		"id":      themeID,
		"updated": true,
		"changes": themeRequest,
	}

	json.NewEncoder(w).Encode(theme)
}

// GetSEO returns SEO settings
func (h *VendorHandlers) GetSEO(w http.ResponseWriter, r *http.Request) {
	vendorID, _ := tenant.GetVendorID(r.Context())

	// TODO: Implement SEO retrieval logic
	seo := map[string]interface{}{
		"vendor_id": vendorID,
		"title":     "Vendor SEO Title",
		"description": "Vendor SEO description",
		"keywords":  []string{"service", "vendor"},
	}

	json.NewEncoder(w).Encode(seo)
}

// UpdateSEO updates SEO settings
func (h *VendorHandlers) UpdateSEO(w http.ResponseWriter, r *http.Request) {
	var seoRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&seoRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement SEO update logic
	seo := map[string]interface{}{
		"updated": true,
		"changes": seoRequest,
	}

	json.NewEncoder(w).Encode(seo)
}

// PublishVersion publishes a new version
func (h *VendorHandlers) PublishVersion(w http.ResponseWriter, r *http.Request) {
	var publishRequest map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&publishRequest); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// TODO: Implement version publishing logic
	version := map[string]interface{}{
		"id":          "version_1",
		"vendor_id":   "vendor_123",
		"version":     "1.0.0",
		"status":      "published",
		"published_at": "2024-01-01T10:00:00Z",
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(version)
}

// GetVersions returns all versions
func (h *VendorHandlers) GetVersions(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement versions retrieval logic
	versions := []map[string]interface{}{
		{
			"id":          "version_1",
			"version":     "1.0.0",
			"status":      "published",
			"published_at": "2024-01-01T10:00:00Z",
		},
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"versions": versions,
	})
}

// GetVersion returns a specific version
func (h *VendorHandlers) GetVersion(w http.ResponseWriter, r *http.Request) {
	versionID := chi.URLParam(r, "versionID")

	// TODO: Implement version retrieval logic
	version := map[string]interface{}{
		"id":      versionID,
		"version": "1.0.0",
		"status":  "published",
		"changes": "Initial release",
	}

	json.NewEncoder(w).Encode(version)
}

// Export handler functions for use in routes
func GetPages(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetPages(w, r)
}

func CreatePage(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.CreatePage(w, r)
}

func GetPage(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetPage(w, r)
}

func UpdatePage(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.UpdatePage(w, r)
}

func DeletePage(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.DeletePage(w, r)
}

func GetAvailableBlocks(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetAvailableBlocks(w, r)
}

func GetBlock(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetBlock(w, r)
}

func GetCatalog(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetCatalog(w, r)
}

func CreateService(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.CreateService(w, r)
}

func UpdateService(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.UpdateService(w, r)
}

func DeleteService(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.DeleteService(w, r)
}

func GetAvailability(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetAvailability(w, r)
}

func SetAvailability(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.SetAvailability(w, r)
}

func GetPayments(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetPayments(w, r)
}

func GetPayment(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetPayment(w, r)
}

func GetThemes(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetThemes(w, r)
}

func UpdateTheme(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.UpdateTheme(w, r)
}

func GetSEO(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetSEO(w, r)
}

func UpdateSEO(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.UpdateSEO(w, r)
}

func PublishVersion(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.PublishVersion(w, r)
}

func GetVersions(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetVersions(w, r)
}

func GetVersion(w http.ResponseWriter, r *http.Request) {
	vendorHandlers.GetVersion(w, r)
}

// VendorLogin handles vendor login requests
func VendorLogin(w http.ResponseWriter, r *http.Request) {
	var loginReq VendorLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if loginReq.Email == "" || loginReq.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	// TODO: Implement actual authentication logic with database
	// For now, using mock authentication
	if loginReq.Email == "vendor@example.com" && loginReq.Password == "vendor123" {
		// Generate JWT token
		token, err := auth.GenerateToken("vendor_user_123", "vendor", "vendor_tenant_123")
		if err != nil {
			http.Error(w, "Failed to generate token", http.StatusInternalServerError)
			return
		}

		response := VendorLoginResponse{
			Token:     token,
			UserID:    "vendor_user_123",
			UserType:  "vendor",
			TenantID:  "vendor_tenant_123",
			BrandName: "Example Brand",
			ExpiresAt: time.Now().Add(24 * time.Hour),
			Message:   "Login successful",
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	http.Error(w, "Invalid email or password", http.StatusUnauthorized)
}

// VendorRegister handles vendor registration requests
func VendorRegister(w http.ResponseWriter, r *http.Request) {
	var registerReq VendorRegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&registerReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if registerReq.Name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}
	if registerReq.LastName == "" {
		http.Error(w, "Last name is required", http.StatusBadRequest)
		return
	}
	if registerReq.Email == "" {
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}
	if registerReq.Password == "" {
		http.Error(w, "Password is required", http.StatusBadRequest)
		return
	}
	if registerReq.ConfirmPassword == "" {
		http.Error(w, "Password confirmation is required", http.StatusBadRequest)
		return
	}
	if registerReq.Phone == "" {
		http.Error(w, "Phone is required", http.StatusBadRequest)
		return
	}
	if registerReq.BrandName == "" {
		http.Error(w, "Brand name is required", http.StatusBadRequest)
		return
	}

	// Validate email format
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(registerReq.Email) {
		http.Error(w, "Invalid email format", http.StatusBadRequest)
		return
	}

	// Validate password confirmation
	if registerReq.Password != registerReq.ConfirmPassword {
		http.Error(w, "Passwords do not match", http.StatusBadRequest)
		return
	}

	// Validate password strength
	if len(registerReq.Password) < 6 {
		http.Error(w, "Password must be at least 6 characters long", http.StatusBadRequest)
		return
	}

	// Validate phone format (basic validation)
	phoneRegex := regexp.MustCompile(`^\+?[1-9]\d{1,14}$`)
	if !phoneRegex.MatchString(strings.ReplaceAll(registerReq.Phone, " ", "")) {
		http.Error(w, "Invalid phone format", http.StatusBadRequest)
		return
	}

	// Validate brand name length
	if len(registerReq.BrandName) < 2 {
		http.Error(w, "Brand name must be at least 2 characters long", http.StatusBadRequest)
		return
	}

	// TODO: Implement actual user creation logic with database
	// For now, return success response
	
	// Generate JWT token for the new vendor
	vendorID := "vendor_" + strings.ToLower(strings.ReplaceAll(registerReq.BrandName, " ", "_")) + "_123"
	tenantID := "tenant_" + strings.ToLower(strings.ReplaceAll(registerReq.BrandName, " ", "_"))
	
	token, err := auth.GenerateToken(vendorID, "vendor", tenantID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	response := VendorLoginResponse{
		Token:     token,
		UserID:    vendorID,
		UserType:  "vendor",
		TenantID:  tenantID,
		BrandName: registerReq.BrandName,
		ExpiresAt: time.Now().Add(24 * time.Hour),
		Message:   "Registration successful",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// VendorProfile handles vendor profile requests
func VendorProfile(w http.ResponseWriter, r *http.Request) {
	// Get user information from JWT context
	userID, userType, tenantID, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if userType != "vendor" {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	// TODO: Implement actual profile retrieval from database
	// For now, return mock data based on user ID
	var profile VendorProfileData

	// Mock different profiles based on user ID
	if userID == "vendor_user_123" {
		profile = VendorProfileData{
			UserID:    userID,
			Name:      "John",
			LastName:  "Doe",
			Email:     "vendor@example.com",
			Phone:     "+905551234567",
			BrandName: "Example Brand",
			TenantID:  tenantID,
			UserType:  userType,
			Status:    "active",
			CreatedAt: time.Now().AddDate(0, -6, 0), // 6 months ago
			UpdatedAt: time.Now().AddDate(0, 0, -1), // 1 day ago
		}
	} else if strings.Contains(userID, "ahmet_travel_agency") {
		profile = VendorProfileData{
			UserID:    userID,
			Name:      "Ahmet",
			LastName:  "Yılmaz",
			Email:     "ahmet@example.com",
			Phone:     "+905551234567",
			BrandName: "Ahmet Travel Agency",
			TenantID:  tenantID,
			UserType:  userType,
			Status:    "active",
			CreatedAt: time.Now().AddDate(0, 0, -1), // 1 day ago
			UpdatedAt: time.Now(),
		}
	} else if strings.Contains(userID, "mehmet_hotel_group") {
		profile = VendorProfileData{
			UserID:    userID,
			Name:      "Mehmet",
			LastName:  "Kaya",
			Email:     "mehmet@example.com",
			Phone:     "+905559876543",
			BrandName: "Mehmet Hotel Group",
			TenantID:  tenantID,
			UserType:  userType,
			Status:    "active",
			CreatedAt: time.Now().AddDate(0, 0, -1), // 1 day ago
			UpdatedAt: time.Now(),
		}
	} else {
		// Generic profile for other vendors
		profile = VendorProfileData{
			UserID:    userID,
			Name:      "Vendor",
			LastName:  "User",
			Email:     "vendor@company.com",
			Phone:     "+905551234567",
			BrandName: "Brand Name",
			TenantID:  tenantID,
			UserType:  userType,
			Status:    "active",
			CreatedAt: time.Now().AddDate(0, -1, 0), // 1 month ago
			UpdatedAt: time.Now().AddDate(0, 0, -7), // 1 week ago
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

// getUserFromContext extracts user information from context
func getUserFromContext(ctx context.Context) (userID, userType, tenantID string, ok bool) {
	userID, ok = ctx.Value("user_id").(string)
	if !ok {
		return "", "", "", false
	}

	userType, ok = ctx.Value("user_type").(string)
	if !ok {
		return "", "", "", false
	}

	tenantID, ok = ctx.Value("tenant_id").(string)
	if !ok {
		return "", "", "", false
	}

	return userID, userType, tenantID, true
}

// VendorLogout handles vendor logout requests
func VendorLogout(w http.ResponseWriter, r *http.Request) {
	// Get user information from JWT context
	userID, userType, tenantID, ok := getUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	if userType != "vendor" {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	// TODO: Implement actual logout logic with database
	// - Invalidate the JWT token (add to blacklist)
	// - Clear any session data
	// - Log the logout event
	
	// For now, we'll just return a success message
	// The client should remove the token from storage
	
	response := map[string]interface{}{
		"message":   "Logout successful",
		"user_id":   userID,
		"tenant_id": tenantID,
		"timestamp": time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Export handlers for use in routes
var vendorHandlers = NewVendorHandlers()
