package admin

import (
	"time"

	"courtflow/internal/automation"
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

// ListBookings (admin) with filters by date, court, status, paymentStatus (AC-2.3, AC-8.7).
func (h *Handler) ListBookings(c *gin.Context) {
	q := h.db.Model(&models.Booking{})
	if v := c.Query("date"); v != "" {
		q = q.Where("date = ?", v)
	}
	if v := c.Query("courtId"); v != "" {
		q = q.Where("court_id = ?", v)
	}
	if v := c.Query("status"); v != "" {
		q = q.Where("status = ?", v)
	}
	if v := c.Query("paymentStatus"); v != "" {
		q = q.Where("payment_status = ?", v)
	}
	var bookings []models.Booking
	q.Order("created_at DESC").Find(&bookings)
	response.OK(c, h.enrichMany(bookings))
}

type statusReq struct {
	Status string `json:"status"`
}

// UpdateBookingStatus lets admin approve/reject/cancel/complete (AC-5.15, AC-5.16, AC-5.17).
func (h *Handler) UpdateBookingStatus(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	var req statusReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	valid := map[string]bool{
		models.BookingPendingPayment: true, models.BookingConfirmed: true,
		models.BookingCompleted: true, models.BookingCancelled: true, models.BookingExpired: true,
	}
	if !valid[req.Status] {
		response.ValidationError(c, map[string]string{"status": "Invalid booking status"})
		return
	}
	prev := b.Status
	b.Status = req.Status
	if req.Status == models.BookingCancelled && b.CancelledAt == nil {
		now := time.Now()
		b.CancelledAt = &now
	}
	h.db.Save(&b) // updated_at auto-bumped by GORM

	if req.Status == models.BookingConfirmed && prev != models.BookingConfirmed {
		go h.auto.Fire("booking_confirmed", b.ID, gin.H{"bookingId": b.ID, "status": b.Status})
	}
	if req.Status == models.BookingCancelled && prev != models.BookingCancelled {
		go h.auto.Fire("booking_cancelled", b.ID, gin.H{"bookingId": b.ID, "status": b.Status})
	}
	response.OK(c, h.enrich(b))
}

// MarkPaid confirms a manual payment after external verification (AC-7.5, AC-7.11).
func (h *Handler) MarkPaid(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	var p models.Payment
	if err := h.db.Where("booking_id = ?", b.ID).First(&p).Error; err != nil {
		response.Error(c, 404, "not_found", "Payment not found")
		return
	}
	p.Status = models.PayPaid
	b.PaymentStatus = models.PayPaid
	b.Status = models.BookingConfirmed
	h.db.Save(&p)
	h.db.Save(&b)
	go h.auto.Fire("booking_confirmed", b.ID, gin.H{"bookingId": b.ID, "status": b.Status, "totalPrice": b.TotalPrice})
	response.OK(c, h.enrich(b))
}

// Dashboard summarizes operations for a date range (AC-8.x).
func (h *Handler) Dashboard(c *gin.Context) {
	from := c.DefaultQuery("from", "0001-01-01")
	to := c.DefaultQuery("to", "9999-12-31")
	scope := h.db.Model(&models.Booking{}).Where("date BETWEEN ? AND ?", from, to)

	count := func(status string) int64 {
		var n int64
		scope.Session(&gorm.Session{}).Where("status = ?", status).Count(&n)
		return n
	}
	var total int64
	scope.Session(&gorm.Session{}).Count(&total)

	var revenue int64 // AC-8.5 / AC-12.3 paid revenue only
	h.db.Model(&models.Booking{}).
		Where("date BETWEEN ? AND ? AND payment_status = ?", from, to, models.PayPaid).
		Select("COALESCE(SUM(total_price),0)").Scan(&revenue)

	var latest []models.Booking
	h.db.Order("created_at DESC").Limit(8).Find(&latest)

	response.OK(c, gin.H{
		"totalBookings":     total,
		"pendingBookings":   count(models.BookingPendingPayment),
		"confirmedBookings": count(models.BookingConfirmed),
		"cancelledBookings": count(models.BookingCancelled),
		"expiredBookings":   count(models.BookingExpired),
		"completedBookings": count(models.BookingCompleted),
		"totalRevenue":      revenue,
		"latestBookings":    h.enrichMany(latest),
	})
}

// Reports: per-court usage + revenue, calculated from DB (AC-12.x).
func (h *Handler) Reports(c *gin.Context) {
	from := c.DefaultQuery("from", "0001-01-01")
	to := c.DefaultQuery("to", "9999-12-31")

	type courtRow struct {
		CourtID   uint   `json:"courtId"`
		CourtName string `json:"courtName"`
		Bookings  int64  `json:"bookings"`
		Revenue   int64  `json:"revenue"`
	}
	var rows []courtRow
	// AC-12.5 cancelled/expired excluded from revenue (paid only).
	h.db.Raw(`
		SELECT c.id AS court_id, c.name AS court_name,
		       COUNT(b.id) AS bookings,
		       COALESCE(SUM(CASE WHEN b.payment_status = ? THEN b.total_price ELSE 0 END),0) AS revenue
		FROM courts c
		LEFT JOIN bookings b ON b.court_id = c.id AND b.date BETWEEN ? AND ?
		GROUP BY c.id, c.name ORDER BY c.id`,
		models.PayPaid, from, to).Scan(&rows)

	var totalRevenue int64
	for _, r := range rows {
		totalRevenue += r.Revenue
	}
	response.OK(c, gin.H{"from": from, "to": to, "courts": rows, "totalRevenue": totalRevenue})
}

// Logs lists automation logs with filters (AC-10.4, AC-10.5).
func (h *Handler) Logs(c *gin.Context) {
	q := h.db.Model(&models.AutomationLog{})
	if v := c.Query("status"); v != "" {
		q = q.Where("status = ?", v)
	}
	if v := c.Query("eventType"); v != "" {
		q = q.Where("event_type = ?", v)
	}
	if v := c.Query("bookingId"); v != "" {
		q = q.Where("booking_id = ?", v)
	}
	var logs []models.AutomationLog
	q.Order("executed_at DESC").Find(&logs)
	response.OK(c, logs)
}

// ListPayments (admin).
func (h *Handler) ListPayments(c *gin.Context) {
	var payments []models.Payment
	h.db.Order("created_at DESC").Find(&payments)
	response.OK(c, payments)
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
