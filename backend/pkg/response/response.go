package response

import "github.com/gin-gonic/gin"

// Consistent JSON envelope (AC-14.1 / AC-14.2).

func OK(c *gin.Context, data any) {
	c.JSON(200, gin.H{"success": true, "data": data})
}

func Created(c *gin.Context, data any) {
	c.JSON(201, gin.H{"success": true, "data": data})
}

func Error(c *gin.Context, status int, code, message string) {
	c.JSON(status, gin.H{"success": false, "error": gin.H{"code": code, "message": message}})
}

// ValidationError reports invalid fields (AC-14.3).
func ValidationError(c *gin.Context, fields map[string]string) {
	c.JSON(422, gin.H{"success": false, "error": gin.H{
		"code": "validation_error", "message": "Validation failed", "fields": fields,
	}})
}
