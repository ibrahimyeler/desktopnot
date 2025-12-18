package routes

import (
	"pangea-api/internal/api/handlers"
	"pangea-api/internal/api/middleware"

	"github.com/gin-gonic/gin"
)

// SetupCategoryRoutes sets up category routes
func SetupCategoryRoutes(r *gin.Engine) {
	// Category endpoints
	categories := r.Group("/api/v1/categories")
	{
		categories.GET("", handlers.GetCategoriesHandler)
		categories.GET("/tree", handlers.GetCategoryTreeHandler)
		categories.GET("/:identifier", handlers.GetCategoryHandler)  // ID veya slug ile
		categories.POST("", middleware.AdminAuthMiddleware(), handlers.CreateCategoryHandler)
		categories.PUT("/:identifier", middleware.AdminAuthMiddleware(), handlers.UpdateCategoryHandler)  // ID veya slug ile
		categories.DELETE("/:identifier", middleware.AdminAuthMiddleware(), handlers.DeleteCategoryHandler)  // ID veya slug ile
	}
	
	// Item endpoints (completely separate structure)
	items := r.Group("/api/v1/items")
	{
		// Category-based item operations
		items.GET("/by-category/:slug", handlers.GetItemsByCategoryHandler)
		items.POST("/by-category/:slug", middleware.AdminAuthMiddleware(), handlers.CreateItemHandler)
		items.PUT("/by-category/:slug/:item_id", middleware.AdminAuthMiddleware(), handlers.UpdateItemHandler)
		items.DELETE("/by-category/:slug/:item_id", middleware.AdminAuthMiddleware(), handlers.DeleteItemHandler)
		items.GET("/category-stats/:slug", handlers.GetCategoryStatsHandler)
		
		// Individual item operations
		items.GET("/:item_id", handlers.GetItemHandler)
		items.GET("/slug/:slug", handlers.GetItemBySlugHandler)
		items.POST("/:item_id/view", handlers.IncrementItemViewHandler)
		items.POST("/:item_id/like", handlers.ToggleItemLikeHandler)
		items.POST("/:item_id/rate", handlers.RateItemHandler)
		items.GET("/:item_id/related", handlers.GetRelatedItemsHandler)
		items.GET("/:item_id/download", handlers.GetItemDownloadHandler)
	}
} 