package auth

import (
	"errors"
	"net/mail"
	"strings"

	"courtflow/internal/models"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Handler struct {
	db     *gorm.DB
	secret string
}

func NewHandler(db *gorm.DB, secret string) *Handler { return &Handler{db, secret} }

type registerReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (h *Handler) Register(c *gin.Context) {
	var req registerReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	fields := map[string]string{}
	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Name == "" {
		fields["name"] = "Name is required"
	}
	if _, err := mail.ParseAddress(req.Email); err != nil {
		fields["email"] = "Valid email is required"
	}
	if req.Phone == "" {
		fields["phone"] = "Phone is required"
	}
	if len(req.Password) < 6 {
		fields["password"] = "Password must be at least 6 characters"
	}
	if len(fields) > 0 {
		response.ValidationError(c, fields)
		return
	}

	// AC-1.4 unique email.
	var existing models.User
	if err := h.db.Where("email = ?", req.Email).First(&existing).Error; err == nil {
		response.Error(c, 409, "email_taken", "Email is already registered")
		return
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		response.Error(c, 500, "server_error", "Could not check email")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.Error(c, 500, "server_error", "Could not hash password")
		return
	}
	user := models.User{Name: req.Name, Email: req.Email, Phone: req.Phone, PasswordHash: string(hash), Role: models.RoleUser}
	if err := h.db.Create(&user).Error; err != nil {
		response.Error(c, 500, "server_error", "Could not create user")
		return
	}
	h.issueToken(c, user, 201)
}

func (h *Handler) Login(c *gin.Context) {
	var req loginReq
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "bad_request", "Invalid request body")
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	var user models.User
	if err := h.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		// AC-1.6 generic error, no user enumeration.
		response.Error(c, 401, "invalid_credentials", "Invalid email or password")
		return
	}
	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)) != nil {
		response.Error(c, 401, "invalid_credentials", "Invalid email or password")
		return
	}
	h.issueToken(c, user, 200)
}

// Me returns the current authenticated user.
func (h *Handler) Me(c *gin.Context) {
	var user models.User
	uid, _ := c.Get("uid")
	if err := h.db.First(&user, uid).Error; err != nil {
		response.Error(c, 404, "not_found", "User not found")
		return
	}
	response.OK(c, user)
}

func (h *Handler) issueToken(c *gin.Context, user models.User, status int) {
	token, err := Generate(h.secret, user.ID, user.Role)
	if err != nil {
		response.Error(c, 500, "server_error", "Could not generate token")
		return
	}
	payload := gin.H{"token": token, "user": user}
	if status == 201 {
		response.Created(c, payload)
	} else {
		response.OK(c, payload)
	}
}
