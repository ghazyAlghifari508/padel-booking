package automation

import (
	"bytes"
	"encoding/json"
	"net/http"
	"time"

	"courtflow/internal/models"

	"gorm.io/gorm"
)

// Client fires n8n webhook events and records an automation log for each attempt
// (AC-9.x, AC-10.1, AC-11.8). Failures never abort the caller (AC-11.7).
type Client struct {
	db        *gorm.DB
	webhook   string
	secret    string
	http      *http.Client
}

func NewClient(db *gorm.DB, webhook, secret string) *Client {
	return &Client{db: db, webhook: webhook, secret: secret, http: &http.Client{Timeout: 5 * time.Second}}
}

var workflowName = map[string]string{
	"booking_created":   "Booking Created Notification",
	"booking_confirmed": "Booking Confirmed Automation",
	"booking_cancelled": "Booking Cancelled Automation",
}

// Fire sends event async and logs the result. Safe to call in a goroutine.
func (c *Client) Fire(event string, bookingID uint, payload any) {
	log := models.AutomationLog{
		WorkflowName: workflowName[event],
		EventType:    event,
		ExecutedAt:   time.Now(),
		BookingID:    &bookingID,
	}

	body, _ := json.Marshal(payload)
	req, err := http.NewRequest(http.MethodPost, c.webhook+"/"+event, bytes.NewReader(body))
	if err == nil {
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("X-Webhook-Secret", c.secret) // AC-9.12 secret token
		resp, errDo := c.http.Do(req)
		if errDo != nil {
			log.Status = models.PayFailed
			log.Message = "Webhook request failed: " + errDo.Error()
		} else {
			defer resp.Body.Close()
			if resp.StatusCode < 300 {
				log.Status = "success"
				log.Message = "Event delivered to n8n"
			} else {
				log.Status = "failed"
				log.Message = "n8n returned status " + resp.Status
			}
		}
	} else {
		log.Status = "failed"
		log.Message = "Could not build webhook request: " + err.Error()
	}
	c.db.Create(&log)
}
