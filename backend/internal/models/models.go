package models

import "time"

// Role / status enums kept as string constants (mirror frontend types.ts).
const (
	RoleUser  = "user"
	RoleAdmin = "admin"

	CourtActive   = "active"
	CourtInactive = "inactive"

	BookingPendingPayment = "pending_payment"
	BookingConfirmed      = "confirmed"
	BookingCompleted      = "completed"
	BookingCancelled      = "cancelled"
	BookingExpired        = "expired"

	PayUnpaid  = "unpaid"
	PayPending = "pending"
	PayPaid    = "paid"
	PayFailed  = "failed"
	PayExpired = "expired"

	ProviderManual   = "manual"
	ProviderMidtrans = "midtrans"
)

type User struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	Phone        string    `json:"phone"`
	PasswordHash string    `gorm:"not null" json:"-"`
	Role         string    `gorm:"default:user" json:"role"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type Court struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Description  string    `json:"description"`
	Location     string    `json:"location"`
	PricePerHour int       `gorm:"not null" json:"pricePerHour"` // IDR
	ImageURL     string    `json:"imageUrl"`
	Status       string    `gorm:"default:active" json:"status"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// OperatingHour: per court per weekday (0=Sun .. 6=Sat).
type OperatingHour struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	CourtID   uint   `gorm:"index;not null" json:"courtId"`
	DayOfWeek int    `gorm:"not null" json:"dayOfWeek"`
	OpenTime  string `gorm:"not null" json:"openTime"`  // HH:mm
	CloseTime string `gorm:"not null" json:"closeTime"` // HH:mm
	Closed    bool   `gorm:"default:false" json:"closed"`
}

type BlockedTime struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CourtID   uint      `gorm:"index;not null" json:"courtId"`
	Court     Court     `gorm:"foreignKey:CourtID" json:"-"`
	Date      string    `gorm:"index;not null" json:"date"` // YYYY-MM-DD
	StartTime string    `gorm:"not null" json:"startTime"`  // HH:mm
	EndTime   string    `gorm:"not null" json:"endTime"`    // HH:mm
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"createdAt"`
}

type Booking struct {
	ID            uint       `gorm:"primaryKey" json:"id"`
	UserID        uint       `gorm:"index;not null" json:"userId"`
	User          User       `gorm:"foreignKey:UserID" json:"-"`
	CourtID       uint       `gorm:"index;not null" json:"courtId"`
	Court         Court      `gorm:"foreignKey:CourtID" json:"-"`
	Date          string     `gorm:"index;not null" json:"date"` // YYYY-MM-DD
	StartTime     string     `gorm:"not null" json:"startTime"`  // HH:mm
	EndTime       string     `gorm:"not null" json:"endTime"`    // HH:mm
	Status        string     `gorm:"index;default:pending_payment" json:"status"`
	PaymentStatus string     `gorm:"default:unpaid" json:"paymentStatus"`
	TotalPrice    int        `gorm:"not null" json:"totalPrice"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
	CancelledAt   *time.Time `json:"cancelledAt,omitempty"`

	// Denormalized for API responses (filled in handlers).
	UserName  string `gorm:"-" json:"userName,omitempty"`
	UserEmail string `gorm:"-" json:"userEmail,omitempty"`
	CourtName string `gorm:"-" json:"courtName,omitempty"`
}

type Payment struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	BookingID  uint      `gorm:"uniqueIndex;not null" json:"bookingId"`
	Amount     int       `gorm:"not null" json:"amount"`
	Provider   string    `gorm:"default:manual" json:"provider"`
	Status     string    `gorm:"default:pending" json:"status"`
	PaymentURL string    `json:"paymentUrl,omitempty"`
	Reference  string    `json:"reference,omitempty"`
	ProofURL   string    `json:"proofUrl,omitempty"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
}

type AutomationLog struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	WorkflowName string    `json:"workflowName"`
	EventType    string    `gorm:"index" json:"eventType"`
	Status       string    `gorm:"index" json:"status"`
	Message      string    `json:"message"`
	BookingID    *uint     `json:"bookingId,omitempty"`
	ExecutedAt   time.Time `json:"executedAt"`
}
