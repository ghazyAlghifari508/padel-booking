package middleware

import (
	"sync"
	"time"

	"courtflow/pkg/response"

	"github.com/gin-gonic/gin"
)

type bucket struct {
	count int
	reset time.Time
}

// RateLimit is a tiny in-memory per-IP fixed-window limiter.
// ponytail: per-process limiter; use Redis/shared limiter when horizontally scaling.
func RateLimit(max int, window time.Duration) gin.HandlerFunc {
	var mu sync.Mutex
	buckets := map[string]bucket{}

	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()
		mu.Lock()
		b := buckets[ip]
		if now.After(b.reset) {
			b = bucket{reset: now.Add(window)}
		}
		b.count++
		buckets[ip] = b
		mu.Unlock()

		if b.count > max {
			response.Error(c, 429, "rate_limited", "Too many requests. Try again later.")
			c.Abort()
			return
		}
		c.Next()
	}
}
