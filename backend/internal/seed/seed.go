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
	log.Println("seed: populating base data")

	pw, _ := bcrypt.GenerateFromPassword([]byte("password"), bcrypt.DefaultCost)
	db.Create(&models.User{
		Name: "CourtFlow Admin", Email: "admin@courtflow.id", Phone: "0811-0000-0000",
		PasswordHash: string(pw), Role: models.RoleAdmin,
	})

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

	log.Println("seed: done")
}
