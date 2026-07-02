package config

import (
	"fmt"
	"log"
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

	cfg := &Config{
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

	// Fail fast in production if security-critical defaults were not overridden.
	if cfg.AppEnv == "production" {
		if cfg.JWTSecret == "change-me-in-production-at-least-32-chars" {
			log.Fatal("config: JWT_SECRET must be set in production")
		}
		if cfg.MidtransServerKey == "SB-Mid-server-PLACEHOLDER" {
			log.Fatal("config: MIDTRANS_SERVER_KEY must be set in production")
		}
	}
	return cfg
}

func (c *Config) DSN() string {
	// TimeZone=UTC: postgres:alpine lacks tzdata, so a named zone (Asia/Jakarta) fails
	// at connect. Storage is UTC; WIB display is handled in app code and the frontend.
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s TimeZone=UTC",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, env("DB_SSLMODE", "disable"))
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
