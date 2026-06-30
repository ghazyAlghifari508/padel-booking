package seed

import (
	"log"
	"time"

	"courtflow/internal/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func dateOffset(days int) string {
	wib := time.FixedZone("WIB", 7*3600)
	base := time.Now().In(wib)
	return base.AddDate(0, 0, days).Format("2006-01-02")
}

// Run seeds the database if empty. Idempotent: skips when users already exist.
func Run(db *gorm.DB) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		log.Println("seed: data already present, skipping")
		return
	}
	log.Println("seed: populating database")

	pw, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	users := []models.User{
		{Name: "Andi Pratama", Email: "andi@mail.com", Phone: "0812-1111-2222", PasswordHash: string(pw), Role: models.RoleUser},
		{Name: "Bunga Lestari", Email: "bunga@mail.com", Phone: "0813-3333-4444", PasswordHash: string(pw), Role: models.RoleUser},
		{Name: "Citra Dewi", Email: "citra@mail.com", Phone: "0814-5555-6666", PasswordHash: string(pw), Role: models.RoleUser},
		{Name: "Admin CourtFlow", Email: "admin@courtflow.id", Phone: "0811-0000-0000", PasswordHash: string(pw), Role: models.RoleAdmin},
	}
	db.Create(&users)

	img := func(id string) string {
		return "https://images.unsplash.com/" + id + "?auto=format&fit=crop&w=800&q=70"
	}
	courts := []models.Court{
		{Name: "Court Emerald A", Description: "Indoor premium court with panoramic glass walls and pro-grade turf.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 180000, ImageURL: img("photo-1554068865-24cecd4e34b8"), Status: models.CourtActive},
		{Name: "Court Emerald B", Description: "Indoor court with LED lighting, ideal for evening matches.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 160000, ImageURL: img("photo-1622279457486-62dcc4a431d6"), Status: models.CourtActive},
		{Name: "Court Lime Outdoor", Description: "Open-air court surrounded by greenery. Best in the morning.", Location: "CourtFlow Garden, Depok", PricePerHour: 120000, ImageURL: img("photo-1611251126118-b66bb2818b94"), Status: models.CourtActive},
		{Name: "Court Slate Pro", Description: "Tournament-spec court with stadium seating.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 220000, ImageURL: img("photo-1626224583764-f87db24ac4ea"), Status: models.CourtActive},
		{Name: "Court Carbon Indoor", Description: "Climate-controlled indoor court with shock-absorbing flooring.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 200000, ImageURL: img("photo-1558618666-fcd25c85f82e"), Status: models.CourtActive},
		{Name: "Court Voltage VIP", Description: "Exclusive VIP court with private lounge and premium amenities.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 280000, ImageURL: img("photo-1599474924187-334a4ae5bd3c"), Status: models.CourtActive},
		{Name: "Court Legacy (Retired)", Description: "Older court kept for historical booking records.", Location: "CourtFlow Arena, Jakarta Selatan", PricePerHour: 90000, ImageURL: img("photo-1595435934249-5df7ed86e1c0"), Status: models.CourtInactive},
	}
	db.Create(&courts)

	// Operating hours: all courts 08:00-22:00 Mon-Sun; Court Lime (id 3) closed Mondays.
	var hours []models.OperatingHour
	for _, ct := range courts {
		for dow := 0; dow < 7; dow++ {
			hours = append(hours, models.OperatingHour{
				CourtID: ct.ID, DayOfWeek: dow, OpenTime: "08:00", CloseTime: "22:00",
				Closed: ct.ID == 3 && dow == 1,
			})
		}
	}
	db.Create(&hours)

	db.Create(&[]models.BlockedTime{
		{CourtID: 1, Date: dateOffset(0), StartTime: "12:00", EndTime: "14:00", Reason: "Scheduled maintenance"},
		{CourtID: 4, Date: dateOffset(1), StartTime: "18:00", EndTime: "22:00", Reason: "Private tournament"},
	})

	ts := func(offset int, clock string) time.Time {
		t, _ := time.Parse("2006-01-02T15:04", dateOffset(offset)+"T"+clock)
		return t
	}
	cancelled := ts(-1, "09:00")
	bookings := []models.Booking{
		{UserID: 1, CourtID: 1, Date: dateOffset(0), StartTime: "19:00", EndTime: "20:00", Status: models.BookingConfirmed, PaymentStatus: models.PayPaid, TotalPrice: 180000},
		{UserID: 1, CourtID: 3, Date: dateOffset(2), StartTime: "08:00", EndTime: "09:30", Status: models.BookingPendingPayment, PaymentStatus: models.PayPending, TotalPrice: 180000},
		{UserID: 2, CourtID: 2, Date: dateOffset(1), StartTime: "17:00", EndTime: "18:00", Status: models.BookingConfirmed, PaymentStatus: models.PayPaid, TotalPrice: 160000},
		{UserID: 2, CourtID: 4, Date: dateOffset(-3), StartTime: "20:00", EndTime: "21:00", Status: models.BookingCompleted, PaymentStatus: models.PayPaid, TotalPrice: 220000},
		{UserID: 3, CourtID: 1, Date: dateOffset(-1), StartTime: "10:00", EndTime: "11:00", Status: models.BookingCancelled, PaymentStatus: models.PayFailed, TotalPrice: 180000, CancelledAt: &cancelled},
		{UserID: 3, CourtID: 2, Date: dateOffset(-4), StartTime: "16:00", EndTime: "17:00", Status: models.BookingExpired, PaymentStatus: models.PayExpired, TotalPrice: 160000},
		{UserID: 1, CourtID: 2, Date: dateOffset(3), StartTime: "20:00", EndTime: "21:30", Status: models.BookingConfirmed, PaymentStatus: models.PayPaid, TotalPrice: 240000},
	}
	db.Create(&bookings)

	var payments []models.Payment
	for _, b := range bookings {
		if b.PaymentStatus == models.PayUnpaid {
			continue
		}
		provider := models.ProviderManual
		if b.ID%2 == 0 {
			provider = models.ProviderMidtrans
		}
		p := models.Payment{BookingID: b.ID, Amount: b.TotalPrice, Provider: provider, Status: b.PaymentStatus, Reference: "INV-" + itoa(b.ID)}
		if b.PaymentStatus == models.PayPending {
			p.PaymentURL = "https://app.sandbox.midtrans.com/snap/v3/redirection/demo"
		}
		payments = append(payments, p)
	}
	db.Create(&payments)

	bid := func(id uint) *uint { return &id }
	db.Create(&[]models.AutomationLog{
		{WorkflowName: "Booking Created Notification", EventType: "booking_created", Status: "success", Message: "Telegram admin notified + appended to Google Sheets.", BookingID: bid(2), ExecutedAt: ts(0, "09:00")},
		{WorkflowName: "Booking Confirmed Automation", EventType: "booking_confirmed", Status: "success", Message: "Confirmation email sent + Google Calendar event created.", BookingID: bid(1), ExecutedAt: ts(-2, "10:30")},
		{WorkflowName: "Booking Cancelled Automation", EventType: "booking_cancelled", Status: "failed", Message: "SMTP timeout: could not send cancellation email to citra@mail.com.", BookingID: bid(5), ExecutedAt: ts(-1, "09:00")},
		{WorkflowName: "Booking Confirmed Automation", EventType: "booking_confirmed", Status: "success", Message: "Confirmation email sent + Telegram admin notified.", BookingID: bid(3), ExecutedAt: ts(-1, "14:20")},
	})

	log.Println("seed: done")
}

func itoa(n uint) string {
	if n == 0 {
		return "0"
	}
	var b []byte
	for n > 0 {
		b = append([]byte{byte('0' + n%10)}, b...)
		n /= 10
	}
	return string(b)
}
