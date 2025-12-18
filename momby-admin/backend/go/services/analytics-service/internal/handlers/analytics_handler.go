package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/momby/analytics-service/internal/config"
	"github.com/momby/analytics-service/internal/services"
)

type AnalyticsHandler struct {
	analyticsService *services.AnalyticsService
	config           *config.Config
}

func NewAnalyticsHandler(cfg *config.Config) *AnalyticsHandler {
	return &AnalyticsHandler{
		analyticsService: services.NewAnalyticsService(cfg),
		config:           cfg,
	}
}

func (h *AnalyticsHandler) TrackEvent(c *gin.Context) {
	var event map[string]interface{}
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.analyticsService.TrackEvent(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event tracked"})
}

func (h *AnalyticsHandler) GetDashboard(c *gin.Context) {
	metrics, err := h.analyticsService.GetDashboardMetrics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, metrics)
}

func (h *AnalyticsHandler) GetFunnel(c *gin.Context) {
	funnel, err := h.analyticsService.GetFunnel()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, funnel)
}

func (h *AnalyticsHandler) GetCohort(c *gin.Context) {
	cohort, err := h.analyticsService.GetCohort()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, cohort)
}

