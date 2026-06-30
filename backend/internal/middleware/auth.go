package middleware

import (
	"strings"

	"courtflow/internal/auth"
	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
)

// AuthRequired validates the Bearer token and stores uid/role in context (AC-2.9).
func AuthRequired(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		token, ok := strings.CutPrefix(header, "Bearer ")
		if !ok || token == "" {
			response.Error(c, 401, "unauthorized", "Authentication required")
			c.Abort()
			return
		}
		claims, err := auth.Parse(secret, token)
		if err != nil {
			response.Error(c, 401, "unauthorized", "Invalid or expired token")
			c.Abort()
			return
		}
		c.Set("uid", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

// AdminRequired rejects non-admin roles (AC-2.8). Must run after AuthRequired.
func AdminRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.GetString("role") != "admin" {
			response.Error(c, 403, "forbidden", "Admin access required")
			c.Abort()
			return
		}
		c.Next()
	}
}

// CurrentUserID is a helper for handlers.
func CurrentUserID(c *gin.Context) uint {
	v, _ := c.Get("uid")
	id, _ := v.(uint)
	return id
}
