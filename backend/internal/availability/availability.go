package availability

import (
	"errors"
	"strconv"
	"strings"

	"courtflow/internal/models"

	"gorm.io/gorm"
)

// toMinutes parses "HH:mm" -> minutes since midnight. Returns -1 on bad input.
func toMinutes(hhmm string) int {
	parts := strings.SplitN(hhmm, ":", 2)
	if len(parts) != 2 {
		return -1
	}
	h, err1 := strconv.Atoi(parts[0])
	m, err2 := strconv.Atoi(parts[1])
	if err1 != nil || err2 != nil {
		return -1
	}
	return h*60 + m
}

// Overlap implements PRD §13: existing.start < new.end AND existing.end > new.start.
func Overlap(aStart, aEnd, bStart, bEnd string) bool {
	as, ae := toMinutes(aStart), toMinutes(aEnd)
	bs, be := toMinutes(bStart), toMinutes(bEnd)
	return as < be && ae > bs
}

// DurationHours returns the booking length in hours (may be fractional).
func DurationHours(start, end string) float64 {
	return float64(toMinutes(end)-toMinutes(start)) / 60.0
}

// Valid checks start<end and both parse.
func ValidRange(start, end string) bool {
	s, e := toMinutes(start), toMinutes(end)
	return s >= 0 && e >= 0 && e > s
}

type Slot struct {
	StartTime string `json:"startTime"`
	EndTime   string `json:"endTime"`
	Available bool   `json:"available"`
	Reason    string `json:"reason,omitempty"` // booked | blocked | outside_hours
}

// weekday: 0=Sun..6=Sat. date is YYYY-MM-DD.
// Generates hourly slots within operating hours, marking each unavailable
// if outside hours, blocked, or overlapped by an active booking (AC-4.6..4.10).
func Compute(db *gorm.DB, courtID uint, date string, weekday int) ([]Slot, error) {
	var oh models.OperatingHour
	err := db.Where("court_id = ? AND day_of_week = ?", courtID, weekday).First(&oh).Error
	if errors.Is(err, gorm.ErrRecordNotFound) || (err == nil && oh.Closed) {
		return []Slot{}, nil // closed/unscheduled day -> no slots (AC-4.3)
	}
	if err != nil {
		return nil, err // real DB error: do not pretend slots are available
	}

	var blocked []models.BlockedTime
	if err := db.Where("court_id = ? AND date = ?", courtID, date).Find(&blocked).Error; err != nil {
		return nil, err
	}

	var active []models.Booking
	if err := db.Where("court_id = ? AND date = ? AND status IN ?", courtID, date,
		[]string{models.BookingPendingPayment, models.BookingConfirmed}).Find(&active).Error; err != nil {
		return nil, err
	}

	open, close := toMinutes(oh.OpenTime), toMinutes(oh.CloseTime)
	slots := []Slot{}
	for t := open; t+60 <= close; t += 60 {
		start := fmtMin(t)
		end := fmtMin(t + 60)
		slot := Slot{StartTime: start, EndTime: end, Available: true}

		for _, b := range blocked {
			if Overlap(b.StartTime, b.EndTime, start, end) {
				slot.Available, slot.Reason = false, "blocked"
				break
			}
		}
		if slot.Available {
			for _, b := range active {
				if Overlap(b.StartTime, b.EndTime, start, end) {
					slot.Available, slot.Reason = false, "booked"
					break
				}
			}
		}
		slots = append(slots, slot)
	}
	return slots, nil
}

func fmtMin(m int) string {
	h := m / 60
	mm := m % 60
	return pad(h) + ":" + pad(mm)
}

func pad(n int) string {
	if n < 10 {
		return "0" + strconv.Itoa(n)
	}
	return strconv.Itoa(n)
}
