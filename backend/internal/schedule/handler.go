package schedule

import (
	"strconv"
	"time"

	"courtflow/internal/availability"
	"courtflow/internal/models"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct{ db *gorm.DB }

func NewHandler(db *gorm.DB) *Handler { return &Handler{db} }

// Availability is public: GET /courts/:id/availability?date=YYYY-MM-DD (AC-4.6).
func (h *Handler) Availability(c *gin.Context) {
	date := c.Query("date")
	parsed, err := time.Parse("2006-01-02", date)
	if err != nil {
		response.Error(c, 400, "bad_request", "date query (YYYY-MM-DD) is required")
		return
	}
	var court models.Court
	if err := h.db.First(&court, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Court not found")
		return
	}
	slots, err := availability.Compute(h.db, court.ID, date, int(parsed.Weekday()))
	if err != nil {
		response.Error(c, 500, "server_error", "Could not compute availability")
		return
	}
	response.OK(c, gin.H{"courtId": court.ID, "date": date, "slots": slots})
}

// --- Operating hours (admin) ---

func (h *Handler) GetOperatingHours(c *gin.Context) {
	var hours []models.OperatingHour
	h.db.Where("court_id = ?", c.Param("id")).Order("day_of_week").Find(&hours)
	response.OK(c, hours)
}

type ohReq struct {
	Hours []models.OperatingHour `json:"hours"`
}

// SetOperatingHours replaces the weekly schedule for a court (AC-4.1, AC-4.2).
func (h *Handler) SetOperatingHours(c *gin.Context) {
	var req ohReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	cid64, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		response.Error(c, 400, "bad_request", "Invalid court id")
		return
	}
	courtID := uint(cid64)
	// AC-4.x validate each row; force CourtID from URL so body cannot target another court.
	for i := range req.Hours {
		h := req.Hours[i]
		if h.DayOfWeek < 0 || h.DayOfWeek > 6 {
			response.ValidationError(c, map[string]string{"dayOfWeek": "Must be 0 (Sun) to 6 (Sat)"})
			return
		}
		if !h.Closed && !availability.ValidRange(h.OpenTime, h.CloseTime) {
			response.ValidationError(c, map[string]string{"time": "openTime must be before closeTime (HH:mm)"})
			return
		}
	}
	err = h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("court_id = ?", courtID).Delete(&models.OperatingHour{}).Error; err != nil {
			return err
		}
		for i := range req.Hours {
			req.Hours[i].ID = 0
			req.Hours[i].CourtID = courtID
			if err := tx.Create(&req.Hours[i]).Error; err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		response.Error(c, 500, "server_error", "Could not save operating hours")
		return
	}
	response.OK(c, req.Hours)
}

// --- Blocked times (admin) ---

func (h *Handler) ListBlocked(c *gin.Context) {
	var blocked []models.BlockedTime
	h.db.Order("date").Find(&blocked)
	// denormalize court name
	out := make([]gin.H, len(blocked))
	for i, b := range blocked {
		var ct models.Court
		h.db.Select("name").First(&ct, b.CourtID)
		out[i] = gin.H{"id": b.ID, "courtId": b.CourtID, "courtName": ct.Name,
			"date": b.Date, "startTime": b.StartTime, "endTime": b.EndTime, "reason": b.Reason}
	}
	response.OK(c, out)
}

type blockReq struct {
	CourtID   uint   `json:"courtId"`
	Date      string `json:"date"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Reason    string `json:"reason"`
}

func (h *Handler) CreateBlocked(c *gin.Context) {
	var req blockReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	if req.CourtID == 0 || req.Date == "" || !availability.ValidRange(req.StartTime, req.EndTime) {
		response.ValidationError(c, map[string]string{"time": "courtId, date and start<end are required"})
		return
	}
	if _, err := time.Parse("2006-01-02", req.Date); err != nil {
		response.ValidationError(c, map[string]string{"date": "Date must use YYYY-MM-DD"})
		return
	}
	bt := models.BlockedTime{CourtID: req.CourtID, Date: req.Date, StartTime: req.StartTime, EndTime: req.EndTime, Reason: req.Reason}
	if err := h.db.Create(&bt).Error; err != nil {
		response.Error(c, 500, "server_error", "Could not create blocked time")
		return
	}
	response.Created(c, bt)
}

func (h *Handler) DeleteBlocked(c *gin.Context) {
	if err := h.db.Delete(&models.BlockedTime{}, c.Param("blockId")).Error; err != nil {
		response.Error(c, 500, "server_error", "Could not delete blocked time")
		return
	}
	response.OK(c, gin.H{"deleted": true})
}
