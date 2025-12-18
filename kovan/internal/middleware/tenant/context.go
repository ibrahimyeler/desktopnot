package tenant

import (
	"context"
	"net/http"
	"strings"
)

// TenantContext adds tenant information to request context
type TenantContext struct {
	TenantID   string
	TenantType string
	Domain     string
}

// CustomerContext middleware for customer panel requests
func CustomerContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract tenant from domain or subdomain
		domain := r.Host
		tenantID := extractTenantFromDomain(domain)

		ctx := context.WithValue(r.Context(), "tenant_context", TenantContext{
			TenantID:   tenantID,
			TenantType: "customer",
			Domain:     domain,
		})

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// VendorContext middleware for vendor admin panel requests
func VendorContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// For vendor context, we get tenant ID from JWT claims
		// This middleware runs after JWT auth, so we can access user context
		userID, userType, tenantID, ok := getUserFromContext(r.Context())
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if userType != "vendor" {
			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}

		ctx := context.WithValue(r.Context(), "tenant_context", TenantContext{
			TenantID:   tenantID,
			TenantType: "vendor",
			Domain:     r.Host,
		})

		// Also add vendor-specific context
		ctx = context.WithValue(ctx, "vendor_id", userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}



// RootContext middleware for root admin panel requests
func RootContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID, userType, tenantID, ok := getUserFromContext(r.Context())
		if !ok {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if userType != "root" {
			http.Error(w, "Access denied", http.StatusForbidden)
			return
		}

		ctx := context.WithValue(r.Context(), "tenant_context", TenantContext{
			TenantID:   tenantID,
			TenantType: "root",
			Domain:     r.Host,
		})

		// Add root-specific context
		ctx = context.WithValue(ctx, "root_id", userID)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetTenantContext extracts tenant context from request context
func GetTenantContext(ctx context.Context) (TenantContext, bool) {
	tenantCtx, ok := ctx.Value("tenant_context").(TenantContext)
	return tenantCtx, ok
}

// GetVendorID extracts vendor ID from request context
func GetVendorID(ctx context.Context) (string, bool) {
	vendorID, ok := ctx.Value("vendor_id").(string)
	return vendorID, ok
}



// GetRootID extracts root ID from request context
func GetRootID(ctx context.Context) (string, bool) {
	rootID, ok := ctx.Value("root_id").(string)
	return rootID, ok
}

// extractTenantFromDomain extracts tenant ID from domain
func extractTenantFromDomain(domain string) string {
	// Remove port if present
	if idx := strings.Index(domain, ":"); idx != -1 {
		domain = domain[:idx]
	}

	// Handle subdomain format: tenant.example.com
	parts := strings.Split(domain, ".")
	if len(parts) > 2 {
		return parts[0]
	}

	// Handle custom domain format: example.com
	// In this case, we might need to look up the tenant in the database
	return domain
}

// getUserFromContext extracts user information from context
// This is a helper function that mimics the auth.GetUserFromContext
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
