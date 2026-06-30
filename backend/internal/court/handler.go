package court

import (
	"courtflow/internal/models"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct{ db *gorm.DB }

func NewHandler(db *gorm.DB) *Handler { return &Handler{db} }

// ListPublic returns only active courts (AC-3.8).
func (h *Handler) ListPublic(c *gin.Context) {
	var courts []models.Court
	h.db.Where("status = ?", models.CourtActive).Order("id").Find(&courts)
	response.OK(c, courts)
}

func (h *Handler) Get(c *gin.Context) {
	var court models.Court
	if err := h.db.First(&court, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Court not found")
		return
	}
	response.OK(c, court)
}

// ListAll (admin) includes inactive courts (AC-3.5).
func (h *Handler) ListAll(c *gin.Context) {
	var courts []models.Court
	h.db.Order("id").Find(&courts)
	response.OK(c, courts)
}

type courtReq struct {
	Name         string `json:"name"`
	Description  string `json:"description"`
	Location     string `json:"location"`
	PricePerHour int    `json:"pricePerHour"`
	ImageURL     string `json:"imageUrl"`
	Status       string `json:"status"`
}

func (h *Handler) Create(c *gin.Context) {
	var req courtReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	fields := map[string]string{}
	if req.Name == "" {
		fields["name"] = "Name is required"
	}
	if req.PricePerHour < 0 { // AC-3.6
		fields["pricePerHour"] = "Price must be >= 0"
	}
	if req.Status == "" {
		req.Status = models.CourtActive
	}
	if req.Status != models.CourtActive && req.Status != models.CourtInactive { // AC-3.7
		fields["status"] = "Status must be active or inactive"
	}
	if len(fields) > 0 {
		response.ValidationError(c, fields)
		return
	}
	court := models.Court{
		Name: req.Name, Description: req.Description, Location: req.Location,
		PricePerHour: req.PricePerHour, ImageURL: req.ImageURL, Status: req.Status,
	}
	if err := h.db.Create(&court).Error; err != nil {
		response.Error(c, 500, "server_error", "Could not create court")
		return
	}
	response.Created(c, court)
}

func (h *Handler) Update(c *gin.Context) {
	var court models.Court
	if err := h.db.First(&court, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Court not found")
		return
	}
	var req courtReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	if req.PricePerHour < 0 {
		response.ValidationError(c, map[string]string{"pricePerHour": "Price must be >= 0"})
		return
	}
	if req.Status != "" && req.Status != models.CourtActive && req.Status != models.CourtInactive {
		response.ValidationError(c, map[string]string{"status": "Status must be active or inactive"})
		return
	}
	// AC-3.10 court edits affect future bookings, never rewrite history (handled by
	// denormalizing court name onto bookings at read time, not stored).
	if req.Name != "" {
		court.Name = req.Name
	}
	court.Description = req.Description
	court.Location = req.Location
	court.PricePerHour = req.PricePerHour
	court.ImageURL = req.ImageURL
	if req.Status != "" {
		court.Status = req.Status
	}
	h.db.Save(&court)
	response.OK(c, court)
}

// Deactivate soft-disables a court, preserving booking history (AC-3.3, AC-3.9).
func (h *Handler) Deactivate(c *gin.Context) {
	var court models.Court
	if err := h.db.First(&court, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Court not found")
		return
	}
	court.Status = models.CourtInactive
	h.db.Save(&court)
	response.OK(c, court)
}
