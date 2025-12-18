package models

import (
	"time"
)

// Item represents a single item in a category
type Item struct {
	ID          int       `json:"id" db:"id"`
	CategoryID  int       `json:"category_id" db:"category_id"`
	CategorySlug string   `json:"category_slug" db:"category_slug"`
	Name        string    `json:"name" db:"name"`
	Slug        string    `json:"slug" db:"slug"`
	Description string    `json:"description" db:"description"`
	Content     string    `json:"content" db:"content"`
	PreviewURL  string    `json:"preview_url" db:"preview_url"`
	DemoURL     string    `json:"demo_url" db:"demo_url"`
	DownloadURL string    `json:"download_url" db:"download_url"`
	Price       float64   `json:"price" db:"price"`
	IsFree      bool      `json:"is_free" db:"is_free"`
	IsPremium   bool      `json:"is_premium" db:"is_premium"`
	IsFeatured  bool      `json:"is_featured" db:"is_featured"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	Tags        []string  `json:"tags" db:"tags"`
	Rating      float64   `json:"rating" db:"rating"`
	RatingCount int       `json:"rating_count" db:"rating_count"`
	ViewCount   int       `json:"view_count" db:"view_count"`
	DownloadCount int     `json:"download_count" db:"download_count"`
	LikeCount   int       `json:"like_count" db:"like_count"`
	Author      string    `json:"author" db:"author"`
	AuthorID    string    `json:"author_id" db:"author_id"`
	Version     string    `json:"version" db:"version"`
	License     string    `json:"license" db:"license"`
	Framework   string    `json:"framework" db:"framework"`
	Technology  string    `json:"technology" db:"technology"`
	FileSize    string    `json:"file_size" db:"file_size"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

// ItemRequest represents the request structure for creating/updating items
type ItemRequest struct {
	Name        string   `json:"name" validate:"required,min=2,max=100"`
	Description string   `json:"description" validate:"required,min=10,max=500"`
	Content     string   `json:"content" validate:"required"`
	PreviewURL  string   `json:"preview_url" validate:"required,url"`
	DemoURL     string   `json:"demo_url" validate:"omitempty,url"`
	DownloadURL string   `json:"download_url" validate:"omitempty,url"`
	Price       float64  `json:"price" validate:"min=0"`
	IsFree      bool     `json:"is_free"`
	IsPremium   bool     `json:"is_premium"`
	IsFeatured  bool     `json:"is_featured"`
	IsActive    bool     `json:"is_active"`
	Tags        []string `json:"tags" validate:"max=10"`
	Author      string   `json:"author" validate:"required,min=2,max=50"`
	Version     string   `json:"version" validate:"required"`
	License     string   `json:"license" validate:"required"`
	Framework   string   `json:"framework" validate:"required"`
	Technology  string   `json:"technology" validate:"required"`
	FileSize    string   `json:"file_size" validate:"required"`
}

// ItemResponse represents the response structure for item operations
type ItemResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Item    *Item  `json:"item,omitempty"`
	Items   []Item `json:"items,omitempty"`
	Total   int    `json:"total,omitempty"`
	Page    int    `json:"page,omitempty"`
	Limit   int    `json:"limit,omitempty"`
	Pages   int    `json:"pages,omitempty"`
}

// ItemStats represents statistics for items in a category
type ItemStats struct {
	TotalItems      int     `json:"total_items"`
	FreeItems       int     `json:"free_items"`
	PremiumItems    int     `json:"premium_items"`
	FeaturedItems   int     `json:"featured_items"`
	ActiveItems     int     `json:"active_items"`
	TotalViews      int     `json:"total_views"`
	TotalDownloads  int     `json:"total_downloads"`
	TotalLikes      int     `json:"total_likes"`
	AverageRating   float64 `json:"average_rating"`
	TopTags         []TagCount `json:"top_tags"`
	TopAuthors      []AuthorCount `json:"top_authors"`
	RecentItems     []Item  `json:"recent_items"`
	PopularItems    []Item  `json:"popular_items"`
}

// TagCount represents tag usage statistics
type TagCount struct {
	Tag   string `json:"tag"`
	Count int    `json:"count"`
}

// AuthorCount represents author statistics
type AuthorCount struct {
	Author string `json:"author"`
	Count  int    `json:"count"`
}

// ItemQuery represents query parameters for item filtering
type ItemQuery struct {
	Search   string `form:"search"`
	Filter   string `form:"filter"` // free, paid, featured, active
	Sort     string `form:"sort"`   // newest, oldest, popular, rating, name, price
	Page     int    `form:"page"`
	Limit    int    `form:"limit"`
	Tag      string `form:"tag"`
	Author   string `form:"author"`
	Framework string `form:"framework"`
	Technology string `form:"technology"`
	MinPrice float64 `form:"min_price"`
	MaxPrice float64 `form:"max_price"`
	Rating   float64 `form:"rating"`
} 