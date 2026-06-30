package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	DBHost, DBPort, DBUser, DBPassword, DBName string
	JWTSecret                                  string
	Port                                       string
	AppEnv                                     string
	MidtransServerKey, MidtransClientKey       string
	MidtransEnv                                string
	N8NWebhookURL, N8NWebhookSecret            string
	FrontendURL                                string
}

func Load() *Config {
	// .env is optional in prod (real env vars take precedence).
	_ = godotenv.Load("../.env", ".env")

	return &Config{
		DBHost:            env("DB_HOST", "localhost"),
		DBPort:            env("DB_PORT", "5432"),
		DBUser:            env("DB_USER", "courtflow"),
		DBPassword:        env("DB_PASSWORD", "secret"),
		DBName:            env("DB_NAME", "courtflow"),
		JWTSecret:         env("JWT_SECRET", "change-me-in-production-at-least-32-chars"),
		Port:              env("PORT", "8080"),
		AppEnv:            env("APP_ENV", "development"),
		MidtransServerKey: env("MIDTRANS_SERVER_KEY", "SB-Mid-server-PLACEHOLDER"),
		MidtransClientKey: env("MIDTRANS_CLIENT_KEY", "SB-Mid-client-PLACEHOLDER"),
		MidtransEnv:       env("MIDTRANS_ENV", "sandbox"),
		N8NWebhookURL:     env("N8N_WEBHOOK_URL", "http://localhost:5678/webhook"),
		N8NWebhookSecret:  env("N8N_WEBHOOK_SECRET", "change-me-n8n-secret"),
		FrontendURL:       env("FRONTEND_URL", "http://localhost:3000"),
	}
}

func (c *Config) DSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable TimeZone=Asia/Jakarta",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName)
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
