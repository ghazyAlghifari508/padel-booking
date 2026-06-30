package automation

import (
	"log"
	"time"

	"courtflow/internal/models"

	"gorm.io/gorm"
)

// StartExpiryJob expires unpaid bookings after ttl. Keeps availability from being blocked forever.
func StartExpiryJob(db *gorm.DB, auto *Client, ttl time.Duration) {
	go func() {
		ticker := time.NewTicker(5 * time.Minute)
		defer ticker.Stop()
		expirePending(db, auto, ttl)
		for range ticker.C {
			expirePending(db, auto, ttl)
		}
	}()
}

func expirePending(db *gorm.DB, auto *Client, ttl time.Duration) {
	cutoff := time.Now().Add(-ttl)
	var bookings []models.Booking
	if err := db.Where("status = ? AND created_at < ?", models.BookingPendingPayment, cutoff).Find(&bookings).Error; err != nil {
		log.Printf("expiry job find: %v", err)
		return
	}
	for _, b := range bookings {
		err := db.Transaction(func(tx *gorm.DB) error {
			if err := tx.Model(&models.Booking{}).Where("id = ? AND status = ?", b.ID, models.BookingPendingPayment).
				Updates(map[string]any{"status": models.BookingExpired, "payment_status": models.PayExpired}).Error; err != nil {
				return err
			}
			return tx.Model(&models.Payment{}).Where("booking_id = ?", b.ID).
				Updates(map[string]any{"status": models.PayExpired}).Error
		})
		if err != nil {
			log.Printf("expiry job booking %d: %v", b.ID, err)
			continue
		}
		go auto.Fire("booking_cancelled", b.ID, map[string]any{"bookingId": b.ID, "status": models.BookingExpired})
	}
}
