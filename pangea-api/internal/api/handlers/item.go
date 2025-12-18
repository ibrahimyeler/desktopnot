package handlers

import (
	"fmt"
	"math"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"pangea-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// In-memory storage for items (replace with database later)
var items = []models.Item{
	{
		ID:           1,
		CategoryID:   1,
		CategorySlug: "components",
		Name:         "Modern Button Component",
		Slug:         "modern-button-component",
		Description:  "A beautiful, customizable button component with hover effects and animations",
		Content:      "<button class='btn-modern'>Click me</button>",
		PreviewURL:   "https://example.com/preview/button",
		DemoURL:      "https://example.com/demo/button",
		DownloadURL:  "https://example.com/download/button",
		Price:        0.0,
		IsFree:       true,
		IsPremium:    false,
		IsFeatured:   true,
		IsActive:     true,
		Tags:         []string{"button", "ui", "component", "modern"},
		Rating:       4.5,
		RatingCount:  128,
		ViewCount:    1250,
		DownloadCount: 890,
		LikeCount:    156,
		Author:       "John Doe",
		AuthorID:     "user_001",
		Version:      "1.2.0",
		License:      "MIT",
		Framework:    "React",
		Technology:   "TypeScript",
		FileSize:     "2.5 KB",
		CreatedAt:    time.Now().AddDate(0, -1, 0),
		UpdatedAt:    time.Now(),
	},
	{
		ID:           2,
		CategoryID:   1,
		CategorySlug: "components",
		Name:         "Premium Card Layout",
		Slug:         "premium-card-layout",
		Description:  "Professional card component with shadow effects and responsive design",
		Content:      "<div class='card-premium'>...</div>",
		PreviewURL:   "https://example.com/preview/card",
		DemoURL:      "https://example.com/demo/card",
		DownloadURL:  "https://example.com/download/card",
		Price:        9.99,
		IsFree:       false,
		IsPremium:    true,
		IsFeatured:   true,
		IsActive:     true,
		Tags:         []string{"card", "layout", "premium", "responsive"},
		Rating:       4.8,
		RatingCount:  89,
		ViewCount:    2340,
		DownloadCount: 156,
		LikeCount:    234,
		Author:       "Jane Smith",
		AuthorID:     "user_002",
		Version:      "2.1.0",
		License:      "Commercial",
		Framework:    "Vue.js",
		Technology:   "JavaScript",
		FileSize:     "5.2 KB",
		CreatedAt:    time.Now().AddDate(0, -2, 0),
		UpdatedAt:    time.Now(),
	},
	{
		ID:           3,
		CategoryID:   2,
		CategorySlug: "sections",
		Name:         "Hero Section Template",
		Slug:         "hero-section-template",
		Description:  "Full-width hero section with background image and call-to-action",
		Content:      "<section class='hero'>...</section>",
		PreviewURL:   "https://example.com/preview/hero",
		DemoURL:      "https://example.com/demo/hero",
		DownloadURL:  "https://example.com/download/hero",
		Price:        0.0,
		IsFree:       true,
		IsPremium:    false,
		IsFeatured:   false,
		IsActive:     true,
		Tags:         []string{"hero", "section", "landing", "cta"},
		Rating:       4.2,
		RatingCount:  67,
		ViewCount:    890,
		DownloadCount: 445,
		LikeCount:    78,
		Author:       "Mike Johnson",
		AuthorID:     "user_003",
		Version:      "1.0.0",
		License:      "MIT",
		Framework:    "HTML/CSS",
		Technology:   "CSS3",
		FileSize:     "8.7 KB",
		CreatedAt:    time.Now().AddDate(0, -3, 0),
		UpdatedAt:    time.Now(),
	},
}

// Helper function to generate slug from name
func generateItemSlug(name string) string {
	return strings.ToLower(strings.ReplaceAll(name, " ", "-"))
}

// Helper function to find next item ID
func getNextItemID() int {
	maxID := 0
	for _, item := range items {
		if item.ID > maxID {
			maxID = item.ID
		}
	}
	return maxID + 1
}

// Helper function to check if item slug exists
func itemSlugExists(slug string, excludeID int) bool {
	for _, item := range items {
		if item.Slug == slug && item.ID != excludeID {
			return true
		}
	}
	return false
}

// Helper function to find category by slug
func findCategoryBySlug(slug string) (*models.Category, bool) {
	for _, cat := range categories {
		if cat.Slug == slug {
			return &cat, true
		}
	}
	return nil, false
}

// Helper function to find item by ID
func findItemByID(id int) (*models.Item, bool) {
	for _, item := range items {
		if item.ID == id {
			return &item, true
		}
	}
	return nil, false
}

// Helper function to filter items by category slug
func getItemsByCategorySlug(categorySlug string) []models.Item {
	var filteredItems []models.Item
	for _, item := range items {
		if item.CategorySlug == categorySlug {
			filteredItems = append(filteredItems, item)
		}
	}
	return filteredItems
}

// @Summary Get items by category slug
// @Description Retrieve all items in a specific category
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Param search query string false "Search term"
// @Param filter query string false "Filter (free, paid, featured, active)"
// @Param sort query string false "Sort (newest, oldest, popular, rating, name, price)"
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Param tag query string false "Filter by tag"
// @Param author query string false "Filter by author"
// @Param framework query string false "Filter by framework"
// @Param technology query string false "Filter by technology"
// @Param min_price query number false "Minimum price"
// @Param max_price query number false "Maximum price"
// @Param rating query number false "Minimum rating"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/categories/{slug}/items [get]
func GetItemsByCategoryHandler(c *gin.Context) {
	categorySlug := c.Param("slug")
	if categorySlug == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Category slug is required",
		})
		return
	}

	// Check if category exists
	if _, found := findCategoryBySlug(categorySlug); !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	// Parse query parameters
	var query models.ItemQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid query parameters",
		})
		return
	}

	// Set default values
	if query.Page <= 0 {
		query.Page = 1
	}
	if query.Limit <= 0 {
		query.Limit = 12
	}
	if query.Limit > 100 {
		query.Limit = 100
	}

	// Get items for this category
	categoryItems := getItemsByCategorySlug(categorySlug)
	var filteredItems []models.Item

	// Apply filters
	for _, item := range categoryItems {
		// Search filter
		if query.Search != "" {
			searchLower := strings.ToLower(query.Search)
			nameMatch := strings.Contains(strings.ToLower(item.Name), searchLower)
			descMatch := strings.Contains(strings.ToLower(item.Description), searchLower)
			tagMatch := false
			for _, tag := range item.Tags {
				if strings.Contains(strings.ToLower(tag), searchLower) {
					tagMatch = true
					break
				}
			}
			if !nameMatch && !descMatch && !tagMatch {
				continue
			}
		}

		// Filter by type
		if query.Filter != "" {
			switch query.Filter {
			case "free":
				if !item.IsFree {
					continue
				}
			case "paid":
				if item.IsFree {
					continue
				}
			case "featured":
				if !item.IsFeatured {
					continue
				}
			case "active":
				if !item.IsActive {
					continue
				}
			}
		}

		// Filter by tag
		if query.Tag != "" {
			tagFound := false
			for _, tag := range item.Tags {
				if strings.EqualFold(tag, query.Tag) {
					tagFound = true
					break
				}
			}
			if !tagFound {
				continue
			}
		}

		// Filter by author
		if query.Author != "" {
			if !strings.Contains(strings.ToLower(item.Author), strings.ToLower(query.Author)) {
				continue
			}
		}

		// Filter by framework
		if query.Framework != "" {
			if !strings.EqualFold(item.Framework, query.Framework) {
				continue
			}
		}

		// Filter by technology
		if query.Technology != "" {
			if !strings.EqualFold(item.Technology, query.Technology) {
				continue
			}
		}

		// Filter by price range
		if query.MinPrice > 0 && item.Price < query.MinPrice {
			continue
		}
		if query.MaxPrice > 0 && item.Price > query.MaxPrice {
			continue
		}

		// Filter by rating
		if query.Rating > 0 && item.Rating < query.Rating {
			continue
		}

		filteredItems = append(filteredItems, item)
	}

	// Apply sorting
	switch query.Sort {
	case "newest":
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].CreatedAt.After(filteredItems[j].CreatedAt)
		})
	case "oldest":
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].CreatedAt.Before(filteredItems[j].CreatedAt)
		})
	case "popular":
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].ViewCount > filteredItems[j].ViewCount
		})
	case "rating":
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].Rating > filteredItems[j].Rating
		})
	case "name":
		sort.Slice(filteredItems, func(i, j int) bool {
			return strings.ToLower(filteredItems[i].Name) < strings.ToLower(filteredItems[j].Name)
		})
	case "price":
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].Price < filteredItems[j].Price
		})
	default:
		// Default: newest first
		sort.Slice(filteredItems, func(i, j int) bool {
			return filteredItems[i].CreatedAt.After(filteredItems[j].CreatedAt)
		})
	}

	// Apply pagination
	total := len(filteredItems)
	totalPages := int(math.Ceil(float64(total) / float64(query.Limit)))
	
	start := (query.Page - 1) * query.Limit
	end := start + query.Limit
	
	if start >= total {
		filteredItems = []models.Item{}
	} else if end > total {
		filteredItems = filteredItems[start:]
	} else {
		filteredItems = filteredItems[start:end]
	}

	c.JSON(http.StatusOK, models.ItemResponse{
		Success: true,
		Message: "Items retrieved successfully",
		Items:   filteredItems,
		Total:   total,
		Page:    query.Page,
		Limit:   query.Limit,
		Pages:   totalPages,
	})
}

// @Summary Create new item in category
// @Description Create a new item in a specific category
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Param request body models.ItemRequest true "Item data"
// @Success 201 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/categories/{slug}/items [post]
func CreateItemHandler(c *gin.Context) {
	categorySlug := c.Param("slug")
	if categorySlug == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Category slug is required",
		})
		return
	}

	// Check if category exists
	category, found := findCategoryBySlug(categorySlug)
	if !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	var req models.ItemRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// Check if item name already exists in this category
	for _, item := range items {
		if item.CategorySlug == categorySlug && item.Name == req.Name {
			c.JSON(http.StatusBadRequest, models.ItemResponse{
				Success: false,
				Message: "Item with this name already exists in this category",
			})
			return
		}
	}

	// Generate slug
	slug := generateItemSlug(req.Name)
	
	// Check if slug already exists
	if itemSlugExists(slug, 0) {
		// Add number to make slug unique
		counter := 1
		originalSlug := slug
		for itemSlugExists(slug, 0) {
			slug = fmt.Sprintf("%s-%d", originalSlug, counter)
			counter++
		}
	}

	// Create new item
	newItem := models.Item{
		ID:           getNextItemID(),
		CategoryID:   category.ID,
		CategorySlug: categorySlug,
		Name:         req.Name,
		Slug:         slug,
		Description:  req.Description,
		Content:      req.Content,
		PreviewURL:   req.PreviewURL,
		DemoURL:      req.DemoURL,
		DownloadURL:  req.DownloadURL,
		Price:        req.Price,
		IsFree:       req.IsFree,
		IsPremium:    req.IsPremium,
		IsFeatured:   req.IsFeatured,
		IsActive:     req.IsActive,
		Tags:         req.Tags,
		Rating:       0.0,
		RatingCount:  0,
		ViewCount:    0,
		DownloadCount: 0,
		LikeCount:    0,
		Author:       req.Author,
		AuthorID:     "user_001", // TODO: Get from auth context
		Version:      req.Version,
		License:      req.License,
		Framework:    req.Framework,
		Technology:   req.Technology,
		FileSize:     req.FileSize,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Add to items slice
	items = append(items, newItem)

	c.JSON(http.StatusCreated, models.ItemResponse{
		Success: true,
		Message: "Item created successfully",
		Item:    &newItem,
	})
}

// @Summary Update item in category
// @Description Update an existing item in a category
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Param item_id path int true "Item ID"
// @Param request body models.ItemRequest true "Item data"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/categories/{slug}/items/{item_id} [put]
func UpdateItemHandler(c *gin.Context) {
	categorySlug := c.Param("slug")
	itemIDStr := c.Param("item_id")

	if categorySlug == "" || itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Category slug and item ID are required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	// Check if category exists
	if _, found := findCategoryBySlug(categorySlug); !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	// Find item
	var itemIndex = -1
	for i, item := range items {
		if item.ID == itemID && item.CategorySlug == categorySlug {
			itemIndex = i
			break
		}
	}

	if itemIndex == -1 {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Item not found in this category",
		})
		return
	}

	var req models.ItemRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// Check if name already exists (excluding current item)
	for i, item := range items {
		if i != itemIndex && item.CategorySlug == categorySlug && item.Name == req.Name {
			c.JSON(http.StatusBadRequest, models.ItemResponse{
				Success: false,
				Message: "Item with this name already exists in this category",
			})
			return
		}
	}

	// Generate new slug
	newSlug := generateItemSlug(req.Name)
	
	// Check if new slug already exists (excluding current item)
	if itemSlugExists(newSlug, itemID) {
		// Add number to make slug unique
		counter := 1
		originalSlug := newSlug
		for itemSlugExists(newSlug, itemID) {
			newSlug = fmt.Sprintf("%s-%d", originalSlug, counter)
			counter++
		}
	}

	// Update item
	items[itemIndex].Name = req.Name
	items[itemIndex].Slug = newSlug
	items[itemIndex].Description = req.Description
	items[itemIndex].Content = req.Content
	items[itemIndex].PreviewURL = req.PreviewURL
	items[itemIndex].DemoURL = req.DemoURL
	items[itemIndex].DownloadURL = req.DownloadURL
	items[itemIndex].Price = req.Price
	items[itemIndex].IsFree = req.IsFree
	items[itemIndex].IsPremium = req.IsPremium
	items[itemIndex].IsFeatured = req.IsFeatured
	items[itemIndex].IsActive = req.IsActive
	items[itemIndex].Tags = req.Tags
	items[itemIndex].Author = req.Author
	items[itemIndex].Version = req.Version
	items[itemIndex].License = req.License
	items[itemIndex].Framework = req.Framework
	items[itemIndex].Technology = req.Technology
	items[itemIndex].FileSize = req.FileSize
	items[itemIndex].UpdatedAt = time.Now()

	c.JSON(http.StatusOK, models.ItemResponse{
		Success: true,
		Message: "Item updated successfully",
		Item:    &items[itemIndex],
	})
}

// @Summary Delete item in category
// @Description Delete an item from a category
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Param item_id path int true "Item ID"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/categories/{slug}/items/{item_id} [delete]
func DeleteItemHandler(c *gin.Context) {
	categorySlug := c.Param("slug")
	itemIDStr := c.Param("item_id")

	if categorySlug == "" || itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Category slug and item ID are required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	// Find item
	var itemIndex = -1
	for i, item := range items {
		if item.ID == itemID && item.CategorySlug == categorySlug {
			itemIndex = i
			break
		}
	}

	if itemIndex == -1 {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Item not found in this category",
		})
		return
	}

	// Remove item from slice
	items = append(items[:itemIndex], items[itemIndex+1:]...)

	c.JSON(http.StatusOK, models.ItemResponse{
		Success: true,
		Message: "Item deleted successfully",
	})
}

// @Summary Get category statistics
// @Description Get detailed statistics for items in a category
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Category slug"
// @Success 200 {object} models.ItemStats
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/categories/{slug}/stats [get]
func GetCategoryStatsHandler(c *gin.Context) {
	categorySlug := c.Param("slug")
	if categorySlug == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Category slug is required",
		})
		return
	}

	// Check if category exists
	if _, found := findCategoryBySlug(categorySlug); !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	// Get items for this category
	categoryItems := getItemsByCategorySlug(categorySlug)

	// Calculate statistics
	stats := models.ItemStats{
		TotalItems:    len(categoryItems),
		FreeItems:     0,
		PremiumItems:  0,
		FeaturedItems: 0,
		ActiveItems:   0,
		TotalViews:    0,
		TotalDownloads: 0,
		TotalLikes:    0,
		AverageRating: 0.0,
		TopTags:       []models.TagCount{},
		TopAuthors:    []models.AuthorCount{},
		RecentItems:   []models.Item{},
		PopularItems:  []models.Item{},
	}

	// Tag and author counters
	tagCounts := make(map[string]int)
	authorCounts := make(map[string]int)

	for _, item := range categoryItems {
		// Count by type
		if item.IsFree {
			stats.FreeItems++
		}
		if item.IsPremium {
			stats.PremiumItems++
		}
		if item.IsFeatured {
			stats.FeaturedItems++
		}
		if item.IsActive {
			stats.ActiveItems++
		}

		// Sum totals
		stats.TotalViews += item.ViewCount
		stats.TotalDownloads += item.DownloadCount
		stats.TotalLikes += item.LikeCount

		// Count tags
		for _, tag := range item.Tags {
			tagCounts[tag]++
		}

		// Count authors
		authorCounts[item.Author]++
	}

	// Calculate average rating
	if len(categoryItems) > 0 {
		totalRating := 0.0
		for _, item := range categoryItems {
			totalRating += item.Rating
		}
		stats.AverageRating = totalRating / float64(len(categoryItems))
	}

	// Get top tags
	for tag, count := range tagCounts {
		stats.TopTags = append(stats.TopTags, models.TagCount{
			Tag:   tag,
			Count: count,
		})
	}
	sort.Slice(stats.TopTags, func(i, j int) bool {
		return stats.TopTags[i].Count > stats.TopTags[j].Count
	})
	if len(stats.TopTags) > 10 {
		stats.TopTags = stats.TopTags[:10]
	}

	// Get top authors
	for author, count := range authorCounts {
		stats.TopAuthors = append(stats.TopAuthors, models.AuthorCount{
			Author: author,
			Count:  count,
		})
	}
	sort.Slice(stats.TopAuthors, func(i, j int) bool {
		return stats.TopAuthors[i].Count > stats.TopAuthors[j].Count
	})
	if len(stats.TopAuthors) > 5 {
		stats.TopAuthors = stats.TopAuthors[:5]
	}

	// Get recent items (last 5)
	sort.Slice(categoryItems, func(i, j int) bool {
		return categoryItems[i].CreatedAt.After(categoryItems[j].CreatedAt)
	})
	if len(categoryItems) > 5 {
		stats.RecentItems = categoryItems[:5]
	} else {
		stats.RecentItems = categoryItems
	}

	// Get popular items (by views, last 5)
	sort.Slice(categoryItems, func(i, j int) bool {
		return categoryItems[i].ViewCount > categoryItems[j].ViewCount
	})
	if len(categoryItems) > 5 {
		stats.PopularItems = categoryItems[:5]
	} else {
		stats.PopularItems = categoryItems
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Category statistics retrieved successfully",
		"stats":   stats,
	})
} 

// @Summary Get item by ID
// @Description Retrieve a specific item by ID
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id} [get]
func GetItemHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	item, found := findItemByID(itemID)
	if !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Item not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.ItemResponse{
		Success: true,
		Message: "Item retrieved successfully",
		Item:    item,
	})
}

// @Summary Get item by slug
// @Description Retrieve a specific item by slug
// @Tags items
// @Accept json
// @Produce json
// @Param slug path string true "Item slug"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/slug/{slug} [get]
func GetItemBySlugHandler(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item slug is required",
		})
		return
	}

	for _, item := range items {
		if item.Slug == slug {
			c.JSON(http.StatusOK, models.ItemResponse{
				Success: true,
				Message: "Item retrieved successfully",
				Item:    &item,
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ItemResponse{
		Success: false,
		Message: "Item not found",
	})
}

// @Summary Increment item view count
// @Description Increment the view count for an item
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id}/view [post]
func IncrementItemViewHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	// Find and update item
	for i, item := range items {
		if item.ID == itemID {
			items[i].ViewCount++
			c.JSON(http.StatusOK, models.ItemResponse{
				Success: true,
				Message: "View count incremented successfully",
				Item:    &items[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ItemResponse{
		Success: false,
		Message: "Item not found",
	})
}

// @Summary Like/unlike item
// @Description Toggle like status for an item
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id}/like [post]
func ToggleItemLikeHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	// Find and update item
	for i, item := range items {
		if item.ID == itemID {
			items[i].LikeCount++
			c.JSON(http.StatusOK, models.ItemResponse{
				Success: true,
				Message: "Item liked successfully",
				Item:    &items[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ItemResponse{
		Success: false,
		Message: "Item not found",
	})
}

// @Summary Rate item
// @Description Rate an item (1-5 stars)
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Param rating body map[string]float64 true "Rating (1-5)"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id}/rate [post]
func RateItemHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	var ratingReq map[string]float64
	if err := c.ShouldBindJSON(&ratingReq); err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid rating data",
		})
		return
	}

	rating, exists := ratingReq["rating"]
	if !exists {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Rating is required",
		})
		return
	}

	if rating < 1 || rating > 5 {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Rating must be between 1 and 5",
		})
		return
	}

	// Find and update item
	for i, item := range items {
		if item.ID == itemID {
			// Calculate new average rating
			totalRating := item.Rating * float64(item.RatingCount) + rating
			newRatingCount := item.RatingCount + 1
			newAverageRating := totalRating / float64(newRatingCount)
			
			items[i].Rating = newAverageRating
			items[i].RatingCount = newRatingCount
			
			c.JSON(http.StatusOK, models.ItemResponse{
				Success: true,
				Message: "Item rated successfully",
				Item:    &items[i],
			})
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ItemResponse{
		Success: false,
		Message: "Item not found",
	})
}

// @Summary Get related items
// @Description Get items related to a specific item
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Param limit query int false "Number of related items (default: 6)"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id}/related [get]
func GetRelatedItemsHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	// Find the target item
	var targetItem *models.Item
	for _, item := range items {
		if item.ID == itemID {
			targetItem = &item
			break
		}
	}

	if targetItem == nil {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Item not found",
		})
		return
	}

	// Get limit parameter
	limitStr := c.DefaultQuery("limit", "6")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit <= 0 {
		limit = 6
	}

	// Find related items (same category, different items)
	var relatedItems []models.Item
	for _, item := range items {
		if item.ID != itemID && item.CategorySlug == targetItem.CategorySlug {
			relatedItems = append(relatedItems, item)
			if len(relatedItems) >= limit {
				break
			}
		}
	}

	c.JSON(http.StatusOK, models.ItemResponse{
		Success: true,
		Message: "Related items retrieved successfully",
		Items:   relatedItems,
		Total:   len(relatedItems),
	})
}

// @Summary Get item download URL
// @Description Get download URL for an item (with authentication check)
// @Tags items
// @Accept json
// @Produce json
// @Param item_id path int true "Item ID"
// @Success 200 {object} models.ItemResponse
// @Failure 400 {object} models.ItemResponse
// @Failure 404 {object} models.ItemResponse
// @Router /api/v1/items/{item_id}/download [get]
func GetItemDownloadHandler(c *gin.Context) {
	itemIDStr := c.Param("item_id")
	if itemIDStr == "" {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Item ID is required",
		})
		return
	}

	itemID, err := strconv.Atoi(itemIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ItemResponse{
			Success: false,
			Message: "Invalid item ID",
		})
		return
	}

	item, found := findItemByID(itemID)
	if !found {
		c.JSON(http.StatusNotFound, models.ItemResponse{
			Success: false,
			Message: "Item not found",
		})
		return
	}

	// Increment download count
	for i, it := range items {
		if it.ID == itemID {
			items[i].DownloadCount++
			break
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Download URL retrieved successfully",
		"download_url": item.DownloadURL,
		"file_size": item.FileSize,
		"item_name": item.Name,
	})
} 