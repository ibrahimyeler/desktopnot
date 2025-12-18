package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"pangea-api/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

// In-memory storage for categories (replace with database later)
var categories = []models.Category{
	{
		ID:          1,
		Name:        "Components",
		Slug:        "components",
		Description: "UI Components and elements",
		Icon:        "🧩",
		Color:       "#3B82F6",
		ParentID:    nil,
		SortOrder:   1,
		IsActive:    true,
		IsFeatured:  true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
	{
		ID:          2,
		Name:        "Sections",
		Slug:        "sections",
		Description: "Page sections and layouts",
		Icon:        "📄",
		Color:       "#10B981",
		ParentID:    nil,
		SortOrder:   2,
		IsActive:    true,
		IsFeatured:  true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
	{
		ID:          3,
		Name:        "Mobile Templates",
		Slug:        "mobile-templates",
		Description: "Mobile app templates",
		Icon:        "📱",
		Color:       "#F59E0B",
		ParentID:    nil,
		SortOrder:   3,
		IsActive:    true,
		IsFeatured:  false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
	{
		ID:          4,
		Name:        "Web Templates",
		Slug:        "web-templates",
		Description: "Web application templates",
		Icon:        "💻",
		Color:       "#8B5CF6",
		ParentID:    nil,
		SortOrder:   4,
		IsActive:    true,
		IsFeatured:  false,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	},
}

// Helper function to generate slug from name
func generateSlug(name string) string {
	return strings.ToLower(strings.ReplaceAll(name, " ", "-"))
}

// Helper function to find next ID
func getNextID() int {
	maxID := 0
	for _, cat := range categories {
		if cat.ID > maxID {
			maxID = cat.ID
		}
	}
	return maxID + 1
}

// Helper function to check if slug exists
func slugExists(slug string, excludeID int) bool {
	for _, cat := range categories {
		if cat.Slug == slug && cat.ID != excludeID {
			return true
		}
	}
	return false
}

// Helper function to find category by ID or slug
func findCategory(identifier string) (*models.Category, bool) {
	// Try as ID first
	if id, err := strconv.Atoi(identifier); err == nil {
		for _, cat := range categories {
			if cat.ID == id {
				return &cat, true
			}
		}
	}
	
	// Try as slug
	for _, cat := range categories {
		if cat.Slug == identifier {
			return &cat, true
		}
	}
	
	return nil, false
}

// @Summary Get all categories
// @Description Retrieve all categories
// @Tags categories
// @Accept json
// @Produce json
// @Param active query bool false "Filter by active status"
// @Param featured query bool false "Filter by featured status"
// @Success 200 {object} models.CategoryResponse
// @Failure 400 {object} models.CategoryResponse
// @Router /api/v1/categories [get]
func GetCategoriesHandler(c *gin.Context) {
	active := c.Query("active")
	featured := c.Query("featured")

	filteredCategories := categories

	// Filter by active status
	if active != "" {
		activeBool, err := strconv.ParseBool(active)
		if err == nil {
			var filtered []models.Category
			for _, cat := range filteredCategories {
				if cat.IsActive == activeBool {
					filtered = append(filtered, cat)
				}
			}
			filteredCategories = filtered
		}
	}

	// Filter by featured status
	if featured != "" {
		featuredBool, err := strconv.ParseBool(featured)
		if err == nil {
			var filtered []models.Category
			for _, cat := range filteredCategories {
				if cat.IsFeatured == featuredBool {
					filtered = append(filtered, cat)
				}
			}
			filteredCategories = filtered
		}
	}

	c.JSON(http.StatusOK, models.CategoryResponse{
		Success:    true,
		Message:    "Categories retrieved successfully",
		Categories: filteredCategories,
	})
}

// @Summary Get category by ID or slug
// @Description Retrieve a specific category by ID or slug
// @Tags categories
// @Accept json
// @Produce json
// @Param identifier path string true "Category ID or slug"
// @Success 200 {object} models.CategoryResponse
// @Failure 400 {object} models.CategoryResponse
// @Failure 404 {object} models.CategoryResponse
// @Router /api/v1/categories/{identifier} [get]
func GetCategoryHandler(c *gin.Context) {
	identifier := c.Param("identifier")
	if identifier == "" {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Category identifier is required",
		})
		return
	}

	category, found := findCategory(identifier)
	if !found {
		c.JSON(http.StatusNotFound, models.CategoryResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.CategoryResponse{
		Success:  true,
		Message:  "Category retrieved successfully",
		Category: category,
	})
}

// @Summary Create new category
// @Description Create a new category
// @Tags categories
// @Accept json
// @Produce json
// @Param request body models.CategoryRequest true "Category data"
// @Success 201 {object} models.CategoryResponse
// @Failure 400 {object} models.CategoryResponse
// @Router /api/v1/categories [post]
func CreateCategoryHandler(c *gin.Context) {
	var req models.CategoryRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// Check if category name already exists
	for _, cat := range categories {
		if cat.Name == req.Name {
			c.JSON(http.StatusBadRequest, models.CategoryResponse{
				Success: false,
				Message: "Category with this name already exists",
			})
			return
		}
	}

	// Generate slug
	slug := generateSlug(req.Name)
	
	// Check if slug already exists
	if slugExists(slug, 0) {
		// Add number to make slug unique
		counter := 1
		originalSlug := slug
		for slugExists(slug, 0) {
			slug = fmt.Sprintf("%s-%d", originalSlug, counter)
			counter++
		}
	}

	// Create new category
	newCategory := models.Category{
		ID:          getNextID(),
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Icon:        req.Icon,
		Color:       req.Color,
		ParentID:    req.ParentID,
		SortOrder:   req.SortOrder,
		IsActive:    req.IsActive,
		IsFeatured:  req.IsFeatured,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}

	// Add to categories slice
	categories = append(categories, newCategory)

	c.JSON(http.StatusCreated, models.CategoryResponse{
		Success:  true,
		Message:  "Category created successfully",
		Category: &newCategory,
	})
}

// @Summary Update category by ID or slug
// @Description Update an existing category by ID or slug
// @Tags categories
// @Accept json
// @Produce json
// @Param identifier path string true "Category ID or slug"
// @Param request body models.CategoryRequest true "Category data"
// @Success 200 {object} models.CategoryResponse
// @Failure 400 {object} models.CategoryResponse
// @Failure 404 {object} models.CategoryResponse
// @Router /api/v1/categories/{identifier} [put]
func UpdateCategoryHandler(c *gin.Context) {
	identifier := c.Param("identifier")
	if identifier == "" {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Category identifier is required",
		})
		return
	}

	var req models.CategoryRequest

	// Parse and validate the request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Invalid request data: " + err.Error(),
		})
		return
	}

	// Additional validation
	validate := validator.New()
	if err := validate.Struct(req); err != nil {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Validation failed: " + err.Error(),
		})
		return
	}

	// Find category by ID or slug
	var categoryIndex = -1
	var categoryID int
	
	// Try as ID first
	if id, err := strconv.Atoi(identifier); err == nil {
		for i, cat := range categories {
			if cat.ID == id {
				categoryIndex = i
				categoryID = id
				break
			}
		}
	}
	
	// Try as slug if not found by ID
	if categoryIndex == -1 {
		for i, cat := range categories {
			if cat.Slug == identifier {
				categoryIndex = i
				categoryID = cat.ID
				break
			}
		}
	}

	if categoryIndex == -1 {
		c.JSON(http.StatusNotFound, models.CategoryResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	// Check if name already exists (excluding current category)
	for i, cat := range categories {
		if i != categoryIndex && cat.Name == req.Name {
			c.JSON(http.StatusBadRequest, models.CategoryResponse{
				Success: false,
				Message: "Category with this name already exists",
			})
			return
		}
	}

	// Generate new slug
	newSlug := generateSlug(req.Name)
	
	// Check if new slug already exists (excluding current category)
	if slugExists(newSlug, categoryID) {
		// Add number to make slug unique
		counter := 1
		originalSlug := newSlug
		for slugExists(newSlug, categoryID) {
			newSlug = fmt.Sprintf("%s-%d", originalSlug, counter)
			counter++
		}
	}

	// Update category
	categories[categoryIndex].Name = req.Name
	categories[categoryIndex].Slug = newSlug
	categories[categoryIndex].Description = req.Description
	categories[categoryIndex].Icon = req.Icon
	categories[categoryIndex].Color = req.Color
	categories[categoryIndex].ParentID = req.ParentID
	categories[categoryIndex].SortOrder = req.SortOrder
	categories[categoryIndex].IsActive = req.IsActive
	categories[categoryIndex].IsFeatured = req.IsFeatured
	categories[categoryIndex].UpdatedAt = time.Now()

	c.JSON(http.StatusOK, models.CategoryResponse{
		Success:  true,
		Message:  "Category updated successfully",
		Category: &categories[categoryIndex],
	})
}

// @Summary Delete category by ID or slug
// @Description Delete a category by ID or slug
// @Tags categories
// @Accept json
// @Produce json
// @Param identifier path string true "Category ID or slug"
// @Success 200 {object} models.CategoryResponse
// @Failure 400 {object} models.CategoryResponse
// @Failure 404 {object} models.CategoryResponse
// @Router /api/v1/categories/{identifier} [delete]
func DeleteCategoryHandler(c *gin.Context) {
	identifier := c.Param("identifier")
	if identifier == "" {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Category identifier is required",
		})
		return
	}

	// Find category by ID or slug
	var categoryIndex = -1
	var categoryID int
	
	// Try as ID first
	if id, err := strconv.Atoi(identifier); err == nil {
		for i, cat := range categories {
			if cat.ID == id {
				categoryIndex = i
				categoryID = id
				break
			}
		}
	}
	
	// Try as slug if not found by ID
	if categoryIndex == -1 {
		for i, cat := range categories {
			if cat.Slug == identifier {
				categoryIndex = i
				categoryID = cat.ID
				break
			}
		}
	}

	if categoryIndex == -1 {
		c.JSON(http.StatusNotFound, models.CategoryResponse{
			Success: false,
			Message: "Category not found",
		})
		return
	}

	// Check if category has children
	hasChildren := false
	for _, cat := range categories {
		if cat.ParentID != nil && *cat.ParentID == categoryID {
			hasChildren = true
			break
		}
	}

	if hasChildren {
		c.JSON(http.StatusBadRequest, models.CategoryResponse{
			Success: false,
			Message: "Cannot delete category with children",
		})
		return
	}

	// Remove category from slice
	categories = append(categories[:categoryIndex], categories[categoryIndex+1:]...)

	c.JSON(http.StatusOK, models.CategoryResponse{
		Success: true,
		Message: "Category deleted successfully",
	})
}

// @Summary Get category tree
// @Description Retrieve categories in hierarchical structure
// @Tags categories
// @Accept json
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /api/v1/categories/tree [get]
func GetCategoryTreeHandler(c *gin.Context) {
	// Build tree structure
	var tree []models.CategoryTree
	
	// Find root categories (no parent)
	for _, category := range categories {
		if category.ParentID == nil {
			treeItem := models.CategoryTree{
				Category: category,
				Children: []models.CategoryTree{},
			}
			
			// Find children
			for _, child := range categories {
				if child.ParentID != nil && *child.ParentID == category.ID {
					treeItem.Children = append(treeItem.Children, models.CategoryTree{
						Category: child,
					})
				}
			}
			
			tree = append(tree, treeItem)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Category tree retrieved successfully",
		"tree":    tree,
	})
} 