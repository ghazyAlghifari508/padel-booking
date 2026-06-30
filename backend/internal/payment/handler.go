package payment

import (
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"courtflow/internal/automation"
	"courtflow/internal/config"
	"courtflow/internal/middleware"
	"courtflow/internal/models"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
	midtrans "github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gorm.io/gorm"
)

type Handler struct {
	db   *gorm.DB
	cfg  *config.Config
	auto *automation.Client
	snap snap.Client
}

func NewHandler(db *gorm.DB, cfg *config.Config, auto *automation.Client) *Handler {
	env := midtrans.Sandbox
	if cfg.MidtransEnv == "production" {
		env = midtrans.Production
	}
	var s snap.Client
	s.New(cfg.MidtransServerKey, env)
	return &Handler{db: db, cfg: cfg, auto: auto, snap: s}
}

// GetByBooking returns the payment for a booking (owner or admin).
func (h *Handler) GetByBooking(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	if c.GetString("role") != models.RoleAdmin && b.UserID != middleware.CurrentUserID(c) {
		response.Error(c, 403, "forbidden", "You cannot access this payment")
		return
	}
	var p models.Payment
	if err := h.db.Where("booking_id = ?", b.ID).First(&p).Error; err != nil {
		response.Error(c, 404, "not_found", "Payment not found")
		return
	}
	response.OK(c, p)
}

const maxProofBytes = 5 << 20 // 5MB

var proofMIMEExt = map[string]string{
	"image/jpeg":      ".jpg",
	"image/png":       ".png",
	"application/pdf": ".pdf",
}

// UploadProof stores a manual transfer proof for the authenticated booking owner.
func (h *Handler) UploadProof(c *gin.Context) {
	var b models.Booking
	if err := h.db.First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	if b.UserID != middleware.CurrentUserID(c) {
		response.Error(c, 403, "forbidden", "You cannot upload proof for this booking")
		return
	}

	file, header, err := c.Request.FormFile("proof")
	if err != nil {
		response.Error(c, 400, "bad_request", "proof file is required")
		return
	}
	defer file.Close()
	if header.Size > maxProofBytes {
		response.Error(c, 422, "file_too_large", "Proof file must be 5MB or smaller")
		return
	}

	buf := make([]byte, 512)
	n, _ := file.Read(buf)
	mime := http.DetectContentType(buf[:n])
	ext, ok := proofMIMEExt[mime]
	if !ok {
		response.Error(c, 422, "invalid_file_type", "Proof must be JPG, PNG, or PDF")
		return
	}
	if _, err := file.Seek(0, io.SeekStart); err != nil {
		response.Error(c, 500, "server_error", "Could not read proof file")
		return
	}

	dir := filepath.Join("uploads", "payment-proofs")
	if err := os.MkdirAll(dir, 0755); err != nil {
		response.Error(c, 500, "server_error", "Could not create upload directory")
		return
	}
	name := fmt.Sprintf("booking-%d-%d%s", b.ID, time.Now().UnixNano(), ext)
	path := filepath.Join(dir, name)
	out, err := os.Create(path)
	if err != nil {
		response.Error(c, 500, "server_error", "Could not save proof file")
		return
	}
	defer out.Close()
	if _, err := io.Copy(out, file); err != nil {
		response.Error(c, 500, "server_error", "Could not write proof file")
		return
	}

	var p models.Payment
	if err := h.db.Where("booking_id = ?", b.ID).First(&p).Error; err != nil {
		response.Error(c, 404, "not_found", "Payment not found")
		return
	}
	p.ProofURL = "/" + strings.ReplaceAll(path, string(os.PathSeparator), "/")
	p.Status = models.PayPending
	h.db.Save(&p)
	response.OK(c, p)
}

type initReq struct {
	Provider string `json:"provider"` // manual | midtrans
}

// Init selects the payment provider for a booking's pending payment.
// For Midtrans, it creates a real Snap transaction and stores redirect URL (AC-7.6).
func (h *Handler) Init(c *gin.Context) {
	var b models.Booking
	if err := h.db.Preload("User").Preload("Court").First(&b, c.Param("id")).Error; err != nil {
		response.Error(c, 404, "not_found", "Booking not found")
		return
	}
	if b.UserID != middleware.CurrentUserID(c) {
		response.Error(c, 403, "forbidden", "You cannot pay for this booking")
		return
	}
	var req initReq
	_ = c.ShouldBindJSON(&req)
	if req.Provider != models.ProviderMidtrans {
		req.Provider = models.ProviderManual
	}

	var p models.Payment
	if err := h.db.Where("booking_id = ?", b.ID).First(&p).Error; err != nil {
		response.Error(c, 404, "not_found", "Payment not found")
		return
	}
	if p.Amount != b.TotalPrice { // AC-7.2 / AC-14.8
		response.Error(c, 422, "payment_mismatch", "Payment amount does not match booking total")
		return
	}
	if req.Provider == models.ProviderMidtrans && p.Provider == models.ProviderMidtrans && p.PaymentURL != "" && p.Status == models.PayPending {
		response.OK(c, p)
		return
	}
	p.Provider = req.Provider
	p.Status = models.PayPending
	p.PaymentURL = ""
	p.Reference = "INV-" + strconv.FormatUint(uint64(b.ID), 10)

	if req.Provider == models.ProviderMidtrans {
		res, err := h.snap.CreateTransaction(&snap.Request{
			TransactionDetails: midtrans.TransactionDetails{
				OrderID:  p.Reference,
				GrossAmt: int64(p.Amount),
			},
			CreditCard: &snap.CreditCardDetails{Secure: true},
			CustomerDetail: &midtrans.CustomerDetails{
				FName: b.User.Name,
				Email: b.User.Email,
				Phone: b.User.Phone,
			},
			Items: &[]midtrans.ItemDetails{{
				ID:    strconv.FormatUint(uint64(b.CourtID), 10),
				Price: int64(p.Amount),
				Qty:   1,
				Name:  fmt.Sprintf("%s %s %s-%s", b.Court.Name, b.Date, b.StartTime, b.EndTime),
			}},
			CustomField1: strconv.FormatUint(uint64(b.ID), 10),
		})
		if err != nil {
			response.Error(c, 502, "midtrans_error", err.GetMessage())
			return
		}
		p.PaymentURL = res.RedirectURL
	}

	h.db.Save(&p)
	response.OK(c, p)
}

// MidtransWebhook receives gateway notifications. It verifies signature_key before
// mutating payment/booking state (AC-7.10, AC-15.9).
func (h *Handler) MidtransWebhook(c *gin.Context) {
	var body struct {
		OrderID           string `json:"order_id"`
		TransactionStatus string `json:"transaction_status"`
		StatusCode        string `json:"status_code"`
		GrossAmount       string `json:"gross_amount"`
		SignatureKey      string `json:"signature_key"`
		FraudStatus       string `json:"fraud_status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		response.Error(c, 400, "bad_request", "Invalid webhook body")
		return
	}
	if body.SignatureKey == "" || body.SignatureKey != signature(body.OrderID, body.StatusCode, body.GrossAmount, h.cfg.MidtransServerKey) {
		response.Error(c, 401, "unauthorized", "Invalid Midtrans signature")
		return
	}

	bookingID, ok := bookingIDFromOrder(body.OrderID)
	if !ok {
		response.Error(c, 400, "bad_request", "Invalid order_id")
		return
	}
	var p models.Payment
	if err := h.db.Where("booking_id = ?", bookingID).First(&p).Error; err != nil {
		response.Error(c, 404, "not_found", "Payment not found")
		return
	}
	var b models.Booking
	h.db.First(&b, p.BookingID)

	switch body.TransactionStatus {
	case "settlement":
		h.markPaid(&p, &b)
	case "capture":
		if body.FraudStatus == "accept" || body.FraudStatus == "" {
			h.markPaid(&p, &b)
		}
	case "pending":
		p.Status = models.PayPending
		b.PaymentStatus = models.PayPending
	case "deny", "cancel", "failure":
		p.Status = models.PayFailed
		b.PaymentStatus = models.PayFailed
	case "expire":
		p.Status = models.PayExpired
		b.PaymentStatus = models.PayExpired
		b.Status = models.BookingExpired
	}
	if err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&p).Error; err != nil {
			return err
		}
		return tx.Save(&b).Error
	}); err != nil {
		response.Error(c, 500, "server_error", "Could not update payment status")
		return
	}
	response.OK(c, gin.H{"received": true})
}

func signature(orderID, statusCode, grossAmount, serverKey string) string {
	sum := sha512.Sum512([]byte(orderID + statusCode + grossAmount + serverKey))
	return hex.EncodeToString(sum[:])
}

func bookingIDFromOrder(orderID string) (uint, bool) {
	const prefix = "INV-"
	if len(orderID) <= len(prefix) || orderID[:len(prefix)] != prefix {
		return 0, false
	}
	n, err := strconv.ParseUint(orderID[len(prefix):], 10, 64)
	return uint(n), err == nil
}

func (h *Handler) markPaid(p *models.Payment, b *models.Booking) {
	p.Status = models.PayPaid
	b.PaymentStatus = models.PayPaid
	b.Status = models.BookingConfirmed // AC-7.11
	go h.auto.Fire("booking_confirmed", b.ID, gin.H{"bookingId": b.ID, "status": b.Status, "totalPrice": b.TotalPrice})
}
