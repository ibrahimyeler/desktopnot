package models

import (
	"time"
)

// Category represents a category in the system
type Category struct {
	ID          int       `json:"id" db:"id"`
	Name        string    `json:"name" db:"name" binding:"required"`
	Slug        string    `json:"slug" db:"slug"`
	Description string    `json:"description" db:"description"`
	Icon        string    `json:"icon" db:"icon"`
	Color       string    `json:"color" db:"color"`
	ParentID    *int      `json:"parent_id,omitempty" db:"parent_id"`
	SortOrder   int       `json:"sort_order" db:"sort_order"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	IsFeatured  bool      `json:"is_featured" db:"is_featured"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// CategoryRequest represents the request structure for creating/updating categories
type CategoryRequest struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Color       string `json:"color"`
	ParentID    *int   `json:"parent_id,omitempty"`
	SortOrder   int    `json:"sort_order"`
	IsActive    bool   `json:"is_active"`
	IsFeatured  bool   `json:"is_featured"`
}

// CategoryResponse represents the response structure for categories
type CategoryResponse struct {
	Success  bool       `json:"success"`
	Message  string     `json:"message"`
	Category *Category  `json:"category,omitempty"`
	Categories []Category `json:"categories,omitempty"`
}

// CategoryTree represents a hierarchical category structure
type CategoryTree struct {
	Category  Category       `json:"category"`
	Children  []CategoryTree `json:"children,omitempty"`
} 