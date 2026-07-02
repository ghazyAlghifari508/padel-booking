# CourtFlow Backend

Go + Gin + PostgreSQL API for the padel court booking system. Implements the PRD acceptance criteria: auth, courts, schedule/availability, bookings (with overlap + race-safe locking), payments (manual + Midtrans sandbox structure), admin dashboard/reports/logs, and n8n webhook automation.

## Stack
- Go 1.x + Gin
- GORM + PostgreSQL 16
- JWT (HS256) auth, bcrypt password hashing
- n8n webhooks for automation events

## Run

1. Start infra (from repo root):
   ```
   cp .env.example .env        # edit secrets
   docker compose up -d        # postgres + n8n
   ```
2. Start API:
   ```
   cd backend
   cp ../.env .env             # or create backend/.env
   go run ./cmd/server
   ```
   On first boot it auto-migrates and seeds the DB (idempotent — skips if users exist).

Health check: `GET http://localhost:8080/health`

## Seed account
Bootstrap admin: `admin@courtflow.id` / `password`.

## API

Envelope: `{ "success": true, "data": ... }` or `{ "success": false, "error": { code, message } }`.

### Public
| Method | Path | |
|---|---|---|
| POST | `/api/auth/register` | name, email, phone, password |
| POST | `/api/auth/login` | email, password → token + user |
| GET | `/api/courts` | active courts only |
| GET | `/api/courts/:id` | court detail |
| GET | `/api/courts/:id/availability?date=YYYY-MM-DD` | hourly slots |
| POST | `/api/webhooks/midtrans` | gateway callback (secret-verified) |

### Authenticated (Bearer token)
| Method | Path | |
|---|---|---|
| GET | `/api/auth/me` | current user |
| POST | `/api/bookings` | create (courtId, date, startTime, endTime) |
| GET | `/api/bookings` | my bookings |
| GET | `/api/bookings/:id` | my booking (owner-checked) |
| POST | `/api/bookings/:id/cancel` | cancel |
| GET | `/api/bookings/:id/payment` | payment record |
| POST | `/api/bookings/:id/payment/init` | choose provider (manual\|midtrans) |

### Admin (Bearer token + admin role)
`/api/admin/courts` CRUD + `/deactivate`, `/courts/:id/operating-hours`, `/blocked-times`,
`/bookings` (filterable), `/bookings/:id/status`, `/bookings/:id/mark-paid`,
`/payments`, `/dashboard`, `/reports`, `/logs`.

## Booking safety
`POST /api/bookings` runs inside a transaction that `SELECT ... FOR UPDATE`s the
court's active bookings for the date, then applies the overlap rule
`existing.start < new.end AND existing.end > new.start` (PRD §6). Concurrent
double-booking attempts serialize on the row lock; only one wins.

## Tests
```
go test ./...
```
`internal/availability` covers the overlap rule and duration math (PRD scenarios).
