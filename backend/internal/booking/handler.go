package booking

import (
	"errors"
	"strconv"
	"time"

	"courtflow/internal/automation"
	"courtflow/internal/availability"
	"courtflow/internal/middleware"
	"courtflow/internal/models"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	db   *gorm.DB
	auto *automation.Client
}

func NewHandler(db *gorm.DB, auto *automation.Client) *Handler { return &Handler{db, auto} }

var (
	ErrOverlap      = errors.New("slot unavailable")
	ErrBlocked      = errors.New("slot blocked")
	ErrOutsideHours = errors.New("outside operating hours")
)

type createReq struct {
	CourtID   uint   `json:"courtId"`
	Date      string `json:"date"`
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
}

// Create books a slot. Overlap is validated inside a transaction that locks the
// court's bookings for the date (AC-6.6, AC-6.7, AC-6.8, AC-15.10).
func (h *Handler) Create(c *gin.Context) {
	var req createReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	fields := map[string]string{}
	if req.CourtID == 0 {
		fields["courtId"] = "Court is required"
	}
	if req.Date == "" {
		fields["date"] = "Date is required"
	}
	if !availability.ValidRange(req.StartTime, req.EndTime) { // AC-5.5
		fields["time"] = "End time must be after start time"
	}
	bookingDate, dateErr := time.Parse("2006-01-02", req.Date)
	if req.Date != "" && dateErr != nil {
		fields["date"] = "Date must use YYYY-MM-DD"
	} else if dateErr == nil && req.Date < time.Now().Format("2006-01-02") { // AC-5.x no past bookings (ISO sorts lexically)
		fields["date"] = "Cannot book a past date"
	}
	if len(fields) > 0 {
		response.ValidationError(c, fields)
		return
	}

	uid := middleware.CurrentUserID(c)
	var booking models.Booking

	err := h.db.Transaction(func(tx *gorm.DB) error {
		// AC-5.3 court must exist and be active.
		var court models.Court
		if err := tx.First(&court, req.CourtID).Error; err != nil {
			return gorm.ErrRecordNotFound
		}
		if court.Status != models.CourtActive {
			return errors.New("court inactive")
		}

		// Advisory lock covers the empty-slot race where SELECT FOR UPDATE locks zero rows.
		if err := tx.Exec("SELECT pg_advisory_xact_lock(hashtext(?), hashtext(?))", itoa(req.CourtID), req.Date).Error; err != nil {
			return err
		}

		var oh models.OperatingHour
		if err := tx.Where("court_id = ? AND day_of_week = ?", req.CourtID, int(bookingDate.Weekday())).First(&oh).Error; err != nil {
			return ErrOutsideHours
		}
		if oh.Closed || req.StartTime < oh.OpenTime || req.EndTime > oh.CloseTime {
			return ErrOutsideHours
		}

		var blocked []models.BlockedTime
		if err := tx.Where("court_id = ? AND date = ?", req.CourtID, req.Date).Find(&blocked).Error; err != nil {
			return err
		}
		for _, b := range blocked {
			if availability.Overlap(b.StartTime, b.EndTime, req.StartTime, req.EndTime) {
				return ErrBlocked
			}
		}

		var active []models.Booking
		if err := tx.Where("court_id = ? AND date = ? AND status IN ?", req.CourtID, req.Date,
			[]string{models.BookingPendingPayment, models.BookingConfirmed}).Find(&active).Error; err != nil {
			return err
		}
		for _, b := range active { // AC-6.3 overlap rule
			if availability.Overlap(b.StartTime, b.EndTime, req.StartTime, req.EndTime) {
				return ErrOverlap
			}
		}

		total := int(availability.DurationHours(req.StartTime, req.EndTime) * float64(court.PricePerHour)) // AC-5.7
		booking = models.Booking{
			UserID: uid, CourtID: req.CourtID, Date: req.Date,
			StartTime: req.StartTime, EndTime: req.EndTime,
			Status: models.BookingPendingPayment, PaymentStatus: models.PayUnpaid,
			TotalPrice: total,
		}
		if err := tx.Create(&booking).Error; err != nil {
			return err
		}
		// One payment record per booking (AC-7.1).
		return tx.Create(&models.Payment{
			BookingID: booking.ID, Amount: total, Provider: models.ProviderManual, Status: models.PayPending,
			Reference: "INV-" + itoa(booking.ID),
		}).Error
	})

	switch {
	case errors.Is(err, ErrOverlap):
		response.Error(c, 409, "slot_unavailable", "The selected time slot is no longer available")
		return
	case errors.Is(err, ErrBlocked):
		response.Error(c, 409, "slot_blocked", "The selected time is blocked by admin")
		return
	case errors.Is(err, ErrOutsideHours):
		response.Error(c, 409, "outside_hours", "The selected time is outside operating hours")
		return
	case errors.Is(err, gorm.ErrRecordNotFound):
		response.Error(c, 404, "not_found", "Court not found")
		return
	case err != nil:
		response.Error(c, 400, "booking_failed", "Could not create booking")
		return
	}

	// AC-9.1 fire booking_created (non-blocking).
	go h.auto.Fire("booking_created", booking.ID, h.eventPayload(booking))
	response.Created(c, h.enrich(booking))
}

// ListMine returns the caller's bookings (AC-5.10).
func (h *Handler) ListMine(c *gin.Context) {
	var bookings []models.Booking
	h.db.Where("user_id = ?", middleware.CurrentUserID(c)).Order("created_at DESC").Find(&bookings)
	response.OK(c, h.enrichMany(bookings))
}

// GetMine returns a single booking, owner-checked (AC-5.11, AC-5.12, AC-15.8).
func (h *Handler) GetMine(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	if b.UserID != middleware.CurrentUserID(c) {
		response.Error(c, 403, "forbidden", "You cannot access this booking")
		return
	}
	response.OK(c, h.enrich(b))
}

// Cancel by owner (AC-5.13, AC-5.17, AC-5.18).
func (h *Handler) Cancel(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	if b.UserID != middleware.CurrentUserID(c) {
		response.Error(c, 403, "forbidden", "You cannot cancel this booking")
		return
	}
	if b.Status == models.BookingCompleted || b.Status == models.BookingCancelled || b.Status == models.BookingExpired {
		response.Error(c, 422, "not_cancellable", "This booking can no longer be cancelled")
		return
	}
	now := time.Now()
	b.Status = models.BookingCancelled
	b.CancelledAt = &now
	if err := h.db.Save(&b).Error; err != nil {
		response.Error(c, 500, "server_error", "Could not cancel booking")
		return
	}
	go h.auto.Fire("booking_cancelled", b.ID, h.eventPayload(b))
	response.OK(c, h.enrich(b))
}

// --- helpers ---

func (h *Handler) enrich(b models.Booking) models.Booking {
	var u models.User
	var ct models.Court
	h.db.Select("name", "email").First(&u, b.UserID)
	h.db.Select("name").First(&ct, b.CourtID)
	b.UserName, b.UserEmail, b.CourtName = u.Name, u.Email, ct.Name
	return b
}

func (h *Handler) enrichMany(bs []models.Booking) []models.Booking {
	for i := range bs {
		bs[i] = h.enrich(bs[i])
	}
	return bs
}

func itoa(n uint) string { return strconv.FormatUint(uint64(n), 10) }

func (h *Handler) eventPayload(b models.Booking) gin.H {
	e := h.enrich(b)
	return gin.H{
		"bookingId": e.ID, "userName": e.UserName, "userEmail": e.UserEmail,
		"courtName": e.CourtName, "date": e.Date, "startTime": e.StartTime,
		"endTime": e.EndTime, "status": e.Status, "totalPrice": e.TotalPrice,
	}
}
