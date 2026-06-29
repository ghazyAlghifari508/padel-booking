# CourtFlow — AGENTS & SKILLS Guide

> **Platform**: Padel Court Booking Automation | **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind + shadcn/ui  
> **Backend**: Go 1.26 + Gin Framework + GORM | **Database**: PostgreSQL 16  
> **Automation**: n8n (Docker) | **Payment**: Midtrans Sandbox  
> **Timezone**: Asia/Jakarta (WIB) | **Currency**: IDR (Rp)

---

## Mandatory Coding Rules

- UTAMAKAN analisis codebase **MENYELURUH** sebelum menulis kode. Gunakan `graphify update` setelah perubahan file.
- Pahami alur data end-to-end: frontend → Go API → PostgreSQL → n8n webhook → response.
- Backend (Go/Gin) dan Frontend (Next.js) adalah **dua project terpisah** — struktur folder mencerminkan ini.
- Jangan breaking change, refactor besar, atau file baru tanpa alasan jelas & analisis matang.
- Jangan duplikasi logic — leverage pattern yang sudah ada di codebase Go maupun Next.js.
- Sebelum coding: jelaskan analisis, akar masalah, file terdampak, rencana implementasi.
- Jangan commit/push/merge tanpa instruksi eksplisit user.
- **Always check AGENTS.md dan PRD sebelum mulai implementasi fitur baru.**

---

## MCP Servers (Priority Order)

### 1. **Context7** — Documentation & API Lookup (REQUIRED)

- **Use for**: Fetch current docs untuk Next.js, Go Gin, GORM, PostgreSQL, n8n, Midtrans.
- **When**: User asks setup/API/version questions. Don't guess — fetch docs via Context7.
- **Example**: "How do I implement Midtrans Snap?" → `mcp__context7__resolve-library-id` + `mcp__context7__query-docs`.

### 2. **21st.dev / Magic MCP** — UI Components (RECOMMENDED)

- **Use for**: Generate, refine, or find inspiration for shadcn/ui components.
- **When**: Building new pages, forms, modals, tables, admin dashboard.
- **Example**: "Need a booking calendar picker" → `21st_magic_component_builder`.
- **Note**: Project uses shadcn/ui + Tailwind. Prefer Magic MCP over custom CSS.

### 3. **zai-mcp-server** — Screenshot Analysis & Error Diagnosis

- **Use for**: Analyze UI screenshots, diagnose error screenshots, extract text from screenshots.
- **When**: Debugging UI issues, verifying layout, understanding error messages from images.

### 4. **Chrome DevTools MCP** — E2E Testing & Browser QA

- **Use for**: Automated browser testing, form filling, UI verification, screenshot capture.
- **When**: Manual QA of booking flow, admin dashboard, payment flow.

---

## Graphify Knowledge Graph

- **Location**: `graphify-out/GRAPH_REPORT.md`
- **Use Before**: Answering architecture/relationship questions ("How does X relate to Y?").
- **Commands**:
  - `graphify query "<question>"` — traverse graph for cross-module patterns
  - `graphify path "<A>" "<B>"` — find dependency chain between features
  - `graphify explain "<concept>"` — understand concept's role in system
- **After Modifying Code**: Run `graphify update .` (AST-only, no API cost).

---

## Core Communities (Expected Architecture)

Setelah inisialisasi project, struktur communities akan berkembang. Berikut prakiraan arsitektur:

| Community | Role | Key Files |
|---|---|---|
| **Auth & User Management** | Register, login, JWT, role guard (user/admin) | `backend/internal/auth/*`, `backend/internal/middleware/*` |
| **Court CRUD (Admin)** | Court create/edit/deactivate/delete | `backend/internal/court/*`, `frontend/src/app/admin/courts/*` |
| **Schedule & Blocked Time** | Operating hours, blocked time management | `backend/internal/schedule/*`, `backend/internal/blocked-time/*` |
| **Availability Engine** | Slot calculation, overlap detection, availability query | `backend/internal/availability/*` |
| **Booking Engine** | Create, cancel, overlap validation, status flow | `backend/internal/booking/*` |
| **Payment (Midtrans)** | Snap transaction, webhook handler, status sync | `backend/internal/payment/*` |
| **n8n Automation** | Webhook events, automation log records | `backend/internal/automation/*` |
| **Admin Dashboard & Reports** | Stats, revenue, booking recap, filtering | `backend/internal/admin/*`, `frontend/src/app/admin/*` |
| **API Response & Error Handling** | Consistent JSON format, error codes | `backend/pkg/response/*` |
| **Database Schema & Migrations** | GORM models, migration files | `backend/internal/models/*`, `backend/migrations/*` |
| **Frontend Pages (User)** | Landing, court list, booking flow, my bookings | `frontend/src/app/*` |
| **Frontend Pages (Admin)** | Dashboard, courts mgmt, bookings mgmt, logs | `frontend/src/app/admin/*` |

---

## ECC Agents & When to Use

**🔴 REQUIRED (run immediately after editing):**

- **`ecc:go-reviewer`** — Go code changes. Reviews idiomatic Go, concurrency, error handling, performance.
- **`ecc:react-reviewer`** — React/TSX changes. Checks hooks, render performance, server/client boundaries, a11y, security.
- **`ecc:database-reviewer`** — PostgreSQL schema, query design, indexes, migrations, performance (PostgreSQL specialist).
- **`ecc:security-reviewer`** — Input validation, auth, JWT handling, payment webhooks, API endpoint security, OWASP Top 10.

**🟡 RECOMMENDED (use proactively):**

- **`ecc:go-build-resolver`** — Go build errors, compilation failures.
- **`ecc:react-build-resolver`** — Next.js build fails (JSX/TSX errors, hydration mismatch).
- **`ecc:code-reviewer`** — General quality, maintainability, efficiency review.
- **`ecc:code-simplifier`** — Refactor for clarity without behavior change.
- **`ecc:code-architect`** — Design complex feature before implementation (e.g., availability engine).
- **`ecc:code-explorer`** — Understand existing code before adding features.
- **`ecc:planner`** — Plan large features/refactors.
- **`ecc:refactor-cleaner`** — Remove dead code, duplicates.
- **`ecc:performance-optimizer`** — Profile bottlenecks, query optimization, bundle size.
- **`ecc:a11y-architect`** — WCAG 2.2 compliance for UI components.
- **`ecc:e2e-runner`** — Generate & maintain end-to-end tests (Playwright).
- **`ecc:silent-failure-hunter`** — Find swallowed errors, bad fallbacks in Go and JS.
- **`ecc:doc-updater`** — Update codemaps & docs.

**🟢 OPTIONAL (use as needed):**

- **`ecc:comment-analyzer`** — Audit comment accuracy & rot risk.
- **`ecc:type-design-analyzer`** — Analyze type encapsulation & invariants.

---

## ECC Skills (by Category)

### Go Backend

- **`ecc:golang-patterns`** — Idiomatic Go, project structure, error handling, concurrency.
- **`ecc:golang-testing`** — Go testing patterns, table-driven tests, mocking, integration tests.
- **`ecc:postgres-patterns`** — PostgreSQL idioms, indexes, query design, GORM optimization.
- **`ecc:database-migrations`** — Safe schema changes, versioning, rollback strategies.
- **`ecc:deployment-patterns`** — Docker multi-stage builds, docker-compose, CI/CD.

### Frontend & React

- **`ecc:react-patterns`** — React idioms, hooks, state management patterns.
- **`ecc:react-performance`** — Optimize renders, memoization, lazy loading.
- **`ecc:react-testing`** — Unit/component testing with React.
- **`ecc:nextjs-turbopack`** — Next.js 16 + Turbopack configuration, optimization.
- **`ecc:frontend-patterns`** — Frontend architecture, client/server boundary, SSR/CSR patterns.
- **`ecc:frontend-a11y`** — Accessibility: ARIA, keyboard nav, screen readers.

### UI/UX & Design System

- **`ecc:design-system`** — Build design system, component library, token management.
- **`ecc:make-interfaces-feel-better`** — Micro-interactions, animations, UX polish.
- **`ecc:liquid-glass-design`** — Glassmorphic, modern design trends.

### Quality & Security

- **`ecc:code-review`** — Structured code review at chosen effort level.
- **`ecc:test-coverage`** — Measure & improve test coverage.
- **`ecc:quality-gate`** — Pre-commit quality checks.
- **`ecc:security-review`** — OWASP Top 10, vulnerability assessment.
- **`ecc:security-scan`** — Automated security scanning.

### DevOps & Infrastructure

- **`ecc:docker-patterns`** — Containerization, multi-stage builds, docker-compose.
- **`ecc:git-workflow`** — Branch strategy, commit hygiene, rebase vs merge.
- **`ecc:github-ops`** — GitHub Actions, PR automation, releases.

### Methodologies

- **`ecc:tdd-guide`** — Test-driven development (write tests first).
- **`ecc:docs-lookup`** — Fetch current docs via Context7 (library-specific).

---

## Required Skills for CourtFlow

**STATUS**: ✅ **ALL INSTALLED** (as of 2026-06-29). Reference with `/[skill-name]` in prompts.

---

### `/golang-gin-api` — Go Gin REST API

- **Capability**: Build REST APIs with Go Gin — routing, middleware, binding, error handling, project structure.
- **GUNAKAN KETIKA**:
  - Membuat endpoint API baru (auth, court, booking, payment, dll.)
  - Menambahkan route group, middleware chaining
  - Struktur folder backend (handler, service, repository pattern)
  - Request binding & validation, consistent JSON response format
- **CONTOH KASUS**: "Buat endpoint POST /api/v1/bookings dengan body validation, auth middleware, dan JSON response sesuai standar. /golang-gin-api"
- **Status**: ✅ Installed

---

### `/golang-gin-auth` — JWT Auth & RBAC

- **Capability**: JWT authentication, role-based access control (user/admin), password hashing (bcrypt), protected routes.
- **GUNAKAN KETIKA**:
  - Setting up register/login endpoints
  - Generate & verify JWT access/refresh tokens
  - Middleware auth guard (require login)
  - Middleware admin guard (require admin role)
  - Password hashing & verification
- **CONTOH KASUS**: "Register endpoint → hash password → create user → return token. Login endpoint → verify password → return JWT. /golang-gin-auth"
- **Status**: ✅ Installed

---

### `/golang-gin-database` — PostgreSQL + GORM

- **Capability**: PostgreSQL integration with GORM/sqlx — migrations, repositories, queries, relationships.
- **GUNAKAN KETIKA**:
  - Mendefinisikan model database (User, Court, Booking, Payment, dll.)
  - Menulis repository layer queries
  - Running migrations & seed data
  - Optimasi query dengan joins, eager loading, indexes
- **CONTOH KASUS**: "Booking model perlu relasi ke User, Court, Payment. Overlap query pakai raw SQL dengan index. /golang-gin-database"
- **Status**: ✅ Installed

---

### `/integrate-midtrans-payments` — Midtrans Payment Gateway (Sandbox)

- **Capability**: Integrasi Midtrans Snap (popup/redirect), Core API, webhook signature verification, payment status handling.
- **GUNAKAN KETIKA**:
  - Integrasi Midtrans Sandbox untuk pembayaran booking
  - Membuat Snap transaction → redirect user ke payment page
  - Handling webhook notifikasi dari Midtrans (payment_status)
  - Verifikasi signature webhook
  - Mapping status Midtrans ke booking status (paid, failed, expired)
  - Amount validation (jumlah harus cocok dengan total_price booking)
- **CONTOH KASUS**: "Booking dibuat → hitung total_price → create Midtrans Snap transaction → return payment_url → user bayar → webhook handle update status. /integrate-midtrans-payments"
- **Status**: ✅ Installed

---

### `/n8n-workflow-patterns` — n8n Workflow Architecture

- **Capability**: Proven workflow patterns — webhook processing, HTTP API integration, scheduled tasks, batch processing.
- **GUNAKAN KETIKA**:
  - Mendesain workflow n8n untuk automation (email, Telegram, Google Calendar, Google Sheets)
  - Webhook receiver pattern untuk event `booking_created`, `booking_confirmed`, `booking_cancelled`
  - Scheduled workflow untuk reminder H-1 dan daily report
  - Error handling & retry pattern dalam workflow
- **CONTOH KASUS**: "Booking confirmed → trigger n8n workflow → kirim email user + create Google Calendar event + log ke Google Sheets. /n8n-workflow-patterns"
- **Status**: ✅ Installed

---

### `/n8n-node-configuration` — n8n Node Configuration

- **Capability**: Detailed node parameter configuration, required fields, display options, common patterns per node type.
- **GUNAKAN KETIKA**:
  - Konfigurasi HTTP Request node ke endpoint backend
  - Setup Webhook node untuk menerima events dari backend
  - Configurasi Gmail/Telegram/Google Calendar node
  - Debug node configuration errors
- **CONTOH KASUS**: "Setup Webhook node di n8n untuk menerima POST dari backend → parse JSON → trigger actions. /n8n-node-configuration"
- **Status**: ✅ Installed

---

### `/shadcn-component-discovery` — shadcn UI Component Discovery

- **Capability**: Discover shadcn-compatible components and registries across the ecosystem.
- **GUNAKAN KETIKA**:
  - Mencari komponen siap pakai untuk dashboard admin (tables, forms, charts)
  - Need komponen booking calendar, date picker, status badge
  - Ingin pakai Magic UI, Aceternity, atau registry lain
- **CONTOH KASUS**: "Cari komponen tabel dengan filter, sort, pagination untuk admin bookings page. /shadcn-component-discovery"
- **Status**: ✅ Installed

---

### `/nextjs-developer` — Next.js Patterns & App Router

- **Capability**: Next.js App Router, server/client components, routing, middleware, data fetching patterns.
- **GUNAKAN KETIKA**:
  - Membangun halaman baru (landing, court list, booking flow, admin dashboard)
  - Setup protected routes dengan middleware
  - Server-side data fetching dari Go backend API
  - Dynamic routes (`/bookings/[id]`, `/admin/courts/[id]/edit`)
- **CONTOH KASUS**: "Booking detail page — fetch dari Go API `/bookings/:id` — SSR dengan loading state. /nextjs-developer"
- **Status**: ✅ Installed

---

### `/vercel-react-best-practices` — React Patterns & Performance

- **Capability**: React hooks, state management, render optimization, server/client boundaries.
- **GUNAKAN KETIKA**:
  - Membangun booking flow multi-step (pilih court → pilih slot → konfirmasi → bayar)
  - Optimasi availability calendar dengan caching
  - Handling form state untuk booking creation
  - Refactoring komponen untuk performa lebih baik
- **CONTOH KASUS**: "Booking flow re-render tiap step change. Optimize dengan useMemo + useCallback. /vercel-react-best-practices"
- **Status**: ✅ Installed

---

### `/ui-design-system` — UI Components & Design System

- **Capability**: shadcn/ui patterns, TailwindCSS, component library, dark mode, theming.
- **GUNAKAN KETIKA**:
  - Building admin dashboard pages (tables, stats cards, filters)
  - Mendesain status badge komponen (pending_payment, confirmed, cancelled, completed)
  - Membuat booking card, court card
  - Consistent button/input/modal patterns
- **CONTOH KASUS**: "Admin bookings table perlu filter, sort, status badges dengan warna konsisten. /ui-design-system"
- **Status**: ✅ Installed

---

### `/ui-ux-pro-max` — Advanced UI/UX & Animations

- **Capability**: Micro-interactions, animations, form UX, responsive design polish.
- **GUNAKAN KETIKA**:
  - Animasi status change booking (pending → confirmed)
  - Loading states skeleton untuk availability calendar
  - Form validation UX dengan inline error messages
  - Mobile responsive booking flow
- **CONTOH KASUS**: "Ketika booking confirmed, animasi card booking dengan status update + confetti effect. /ui-ux-pro-max"
- **Status**: ✅ Installed

---

### `/supabase-postgres-best-practices` — PostgreSQL & DB Optimization

- **Capability**: Query design, indexes, schema patterns, performance optimization.
- **GUNAKAN KETIKA**:
  - Mendesain overlap query untuk availability engine (gunakan exclusion constraint atau raw SQL)
  - Optimasi dashboard aggregate queries (total bookings, revenue by date range)
  - Index strategy untuk booking queries (court_id, booking_date, status)
  - Designing safe migrations untuk schema changes
- **CONTOH KASUS**: "Availability query slow untuk range date besar. Tambah composite index (court_id, booking_date, start_time, end_time) + gunakan exclusion constraint. /supabase-postgres-best-practices"
- **Status**: ✅ Installed

---

### `/webapp-testing` — Web App Testing & QA

- **Capability**: Test web app behavior, fill forms, click buttons, verify UI states, screenshot capture.
- **GUNAKAN KETIKA**:
  - E2E test booking flow (pilih court → pilih slot → booking → bayar)
  - Test admin CRUD court
  - Verifikasi overlap rejection
  - Screenshot dashboard untuk dokumentasi
- **CONTOH KASUS**: "Test booking flow: login → pilih court → pilih available slot → confirm booking → verify status pending_payment. /webapp-testing"
- **Status**: ✅ Installed

---

### `/agent-browser` — Browser Automation

- **Capability**: Navigate websites, fill forms, click buttons, extract data, take screenshots.
- **GUNAKAN KETIKA**:
  - Manual QA testing booking flow di berbagai screen size
  - Verifikasi admin dashboard metrics
  - Test responsive layout mobile
- **CONTOH KASUS**: "Test mobile responsive booking flow: pilih court → slot → booking → verify layout tidak broken. /agent-browser"
- **Status**: ✅ Installed

---

### `/better-auth-security-best-practices` — Auth Security Patterns

- **Capability**: JWT security, rate limiting, secure token handling, session management.
- **GUNAKAN KETIKA**:
  - Hardening login endpoint terhadap brute force
  - Implementasi refresh token rotation
  - Secure cookie vs localStorage decision
  - Audit auth flow for vulnerabilities
- **CONTOH KASUS**: "Login endpoint perlu rate limiting. JWT refresh token harus dirotate setiap usage. /better-auth-security-best-practices"
- **Status**: ✅ Installed

---

### `/test-driven-development` — Test-Driven Development

- **Capability**: Write tests BEFORE implementation, TDD patterns, test coverage.
- **GUNAKAN KETIKA**:
  - Building overlap detection logic (critical business rule)
  - Implementing booking status state machine
  - Payment amount validation
  - Availability calculation engine
- **CONTOH KASUS**: "Overlap detection: test case 19:00-20:00 vs 19:30-20:30 → reject. 20:00-21:00 → accept. Write test first. /test-driven-development"
- **Status**: ✅ Installed

---

## Additional Installed Skills (Already Available)

### Next.js & Frontend

- **`nextjs-developer`** — Next.js patterns, App Router, middleware.
  Use: `/nextjs-developer` ketika build fitur Next.js.

- **`vercel-react-best-practices`** — React patterns, hooks, performance.
  Use: `/vercel-react-best-practices` untuk guidance React component.

### UI/UX & Design

- **`ui-ux-pro-max`** — Advanced UI/UX design, interaction patterns, accessibility, animations.
  Use: `/ui-ux-pro-max` untuk UI design guidance & user experience.

### Utility

- **`interactive-portfolio`** — Not relevant for CourtFlow (booking app).
  Use: Skip for this project.

- **`game-development`** — Not relevant for CourtFlow.
  Use: Skip for this project.

### Legacy (Remove Reference)

- **`insforge`**, **`insforge-cli`**, **`insforge-debug`**, **`insforge-integrations`** — InsForge backend skills.
  ⚠️ **DO NOT USE** — Project uses Go + Gin backend, not InsForge.

---

## How to Use Installed Skills

1. **In Prompts**: Reference as `/[skill-name]`
   Example: "I need to build overlap detection. /golang-gin-database /test-driven-development"

2. **In Configuration**: Skills are globally available via `~/.agents/skills/` symlinks.

3. **Discovery**: List all skills:
   ```bash
   npx skills list
   ```

---

## Project Structure

```
padel-booking/
├── backend/                    # Go + Gin API
│   ├── cmd/
│   │   └── server/
│   │       └── main.go         # Entry point
│   ├── internal/
│   │   ├── auth/               # Auth handler, service, repository
│   │   ├── user/               # User management
│   │   ├── court/              # Court CRUD
│   │   ├── schedule/           # Operating hours, blocked time
│   │   ├── availability/       # Slot calculation, overlap detection
│   │   ├── booking/            # Booking engine
│   │   ├── payment/            # Midtrans integration
│   │   ├── automation/         # n8n webhook events, automation logs
│   │   ├── admin/              # Dashboard stats, reports
│   │   ├── middleware/         # Auth guard, admin guard, CORS
│   │   └── models/             # GORM models
│   ├── pkg/
│   │   └── response/           # Consistent JSON response format
│   ├── migrations/             # SQL migration files
│   ├── config/                 # Environment & app config
│   ├── go.mod
│   └── Dockerfile
├── frontend/                   # Next.js + TypeScript
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/         # Protected routes group
│   │   │   ├── admin/          # Admin dashboard pages
│   │   │   ├── api/            # Next.js API routes (proxy ke Go)
│   │   │   └── page.tsx        # Landing page
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── booking/        # Booking flow components
│   │   │   ├── court/          # Court listing components
│   │   │   └── admin/          # Admin dashboard components
│   │   ├── lib/                # Utils, API client, types
│   │   └── hooks/              # Custom React hooks
│   ├── public/
│   ├── package.json
│   └── next.config.js
├── n8n/                        # n8n workflow exports & config
│   └── workflows/
├── docker-compose.yml          # PostgreSQL, n8n, backend
├── AGENTS.md                   # This file
├── PRD.md                      # Product Requirements
├── acceptance-criteria.md      # Acceptance Criteria
└── README.md
```

---

## Custom Skills & Agents (in `.agents/`)

_Location for project-specific agents & skills to be added as needed._

### Example Structure:

```
.agents/
├── skills/
│   └── courtflow-booking-engine/
│       ├── SKILL.md
│       └── README.md
└── agents/
    └── courtflow-architect/
        ├── AGENT.md
        └── system-prompt.md
```

---

## Caveman & Ponytail (Always Active)

### Caveman — Terse Communication

- Drop articles (a/an/the), filler (just, really, basically), pleasantries (sure, of course).
- Fragment sentences OK. Short synonyms (big not extensive, fix not "implement a solution for").
- Pattern: `[thing] [action] [reason]. [next step].`
- **Exception**: Write NORMAL for code, commits, security warnings, multi-step sequences.

### Ponytail — Lazy Efficiency

Climb this ladder, stop at first rung that holds:

1. Does this need to exist? Speculative = skip (YAGNI).
2. Already in codebase? Reuse (search first).
3. Stdlib/native platform? Use it.
4. Dependency installed? Use it (don't add new).
5. Can be one line? Make it one line.
6. Only then: minimum code that works.

**Apply AFTER understanding problem**, not instead of it. **Bug fix = root cause**, not symptom. **No unrequested abstractions** (no 1-impl interfaces, no config for fixed values). **Delete > add. Boring > clever.**

Mark deliberate shortcuts: `// ponytail: [reason], upgrade path [when]`.

---

## Project-Specific Patterns

### Auth & Roles

- **Mechanism**: JWT access + refresh token (Go backend).
- **Roles**: `user` (default) dan `admin`.
- **Guard Middleware**: `AuthRequired()` — verify JWT, inject user context.
- **Admin Guard**: `AdminRequired()` — check role claim in JWT.
- **Session**: Stateless JWT (no server-side session store for MVP).

### Database (PostgreSQL via GORM)

- **ORM**: GORM v2 dengan raw SQL untuk query kompleks (overlap detection).
- **Concurrency**: Gunakan `SELECT FOR UPDATE` atau PostgreSQL advisory lock untuk mencegah double booking (AC-6.7/6.8).
- **Exclusion Constraint**: `USING gist (court_id WITH =, booking_daterange WITH &&)` — prevent overlapping bookings at DB level.
- **Migrations**: AutoMigrate untuk development, SQL migration files untuk production.
- **Timezone**: Semua timestamp stored as TIMESTAMPTZ (UTC), display di Asia/Jakarta.

### API Response Format

- **Success**: `{"success": true, "message": "...", "data": {...}}`
- **Error**: `{"success": false, "message": "...", "errors": [...]}`
- **HTTP Status Codes**: 200, 201, 400, 401, 403, 404, 409, 422, 500.

### Booking Status Flow

```
pending_payment → confirmed → completed
                → cancelled
                → expired
```

### Payment Flow (Midtrans Sandbox)
```
Booking created → Create Snap Transaction → Return payment_url
→ User pays → Midtrans webhook → Verify signature → Update status
→ If paid: booking → confirmed, trigger n8n booking_confirmed
→ If failed/expired: booking → cancelled/expired
```

### n8n Event Payload
```json
{
  "event": "booking_created|booking_confirmed|booking_cancelled",
  "timestamp": "2026-06-29T10:00:00+07:00",
  "data": {
    "booking_id": 1,
    "user": { "name": "...", "email": "..." },
    "court": { "name": "...", "price_per_hour": 150000 },
    "date": "2026-07-01",
    "start_time": "08:00",
    "end_time": "09:00",
    "status": "confirmed",
    "total_price": 150000
  }
}
```

### Overlap Detection
```sql
-- Core overlap query (AC-6.3)
SELECT EXISTS (
  SELECT 1 FROM bookings
  WHERE court_id = ?
    AND booking_date = ?
    AND status IN ('pending_payment', 'confirmed')
    AND start_time < ?  -- new.end_time
    AND end_time > ?    -- new.start_time
);
```

---

## When to Use Each Tool

| Scenario | Use | Why |
|---|---|---|
| Build fails (Go) | `ecc:go-build-resolver` | Go compilation errors |
| Build fails (React/Next.js) | `ecc:react-build-resolver` | JSX/TSX/hydration errors |
| Change Go backend code | `ecc:go-reviewer` | Idiomatic Go, concurrency, error handling |
| Change React/TSX component | `ecc:react-reviewer` | Hooks, performance, a11y, server/client |
| SQL/migration/schema change | `ecc:database-reviewer` | PostgreSQL expert, query optimization |
| Handling auth/payment/webhook | `ecc:security-reviewer` | OWASP compliance, data integrity |
| Code quality general | `ecc:code-reviewer` | After writing substantial change |
| Code looks repetitive | `ecc:refactor-cleaner` | Remove duplication, dead code |
| App feels slow | `ecc:performance-optimizer` | Profile, query optimization, bundle size |
| New UI component | Magic MCP + `ecc:a11y-architect` | Design + accessibility |
| Complex feature plan | `ecc:code-architect` + `ecc:planner` | Design before build (e.g., availability engine) |
| Understand code before editing | `ecc:code-explorer` | Trace execution paths |
| Need library docs/API | `context7` MCP | Current, accurate docs |
| Build n8n workflows | `/n8n-workflow-patterns` + `/n8n-node-configuration` | Proven patterns + config |
| Integrate Midtrans | `/integrate-midtrans-payments` | Official Midtrans skill |
| UI component discovery | `/shadcn-component-discovery` + Magic MCP | shadcn ecosystem |

---

## Quick Command Reference

| Task | Command |
|---|---|
| **Start dev (Go backend)** | `cd backend && go run cmd/server/main.go` |
| **Start dev (Next.js frontend)** | `cd frontend && npm run dev` |
| **Start all services** | `docker compose up -d` |
| **Stop all services** | `docker compose down` |
| **Build backend** | `cd backend && go build -o bin/server cmd/server/main.go` |
| **Run Go tests** | `cd backend && go test ./...` |
| **Run frontend build** | `cd frontend && npm run build` |
| **Run frontend lint** | `cd frontend && npm run lint` |
| **Install n8n workflow** | Import from `n8n/workflows/` via n8n UI |
| **Update graphify** | `graphify update .` |

---

## Environment Variables

**Required in `backend/.env`:**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=courtflow
DB_PASSWORD=courtflow_secret
DB_NAME=courtflow

# JWT
JWT_SECRET=<random-64-char-string>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Midtrans (Sandbox)
MIDTRANS_SERVER_KEY=<your-server-key>
MIDTRANS_CLIENT_KEY=<your-client-key>
MIDTRANS_IS_PRODUCTION=false

# n8n
N8N_WEBHOOK_BASE_URL=http://localhost:5678/webhook
N8N_WEBHOOK_SECRET=<your-webhook-secret>

# App
APP_PORT=8080
APP_ENV=development
TZ=Asia/Jakarta
```

**Required in `frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=<your-client-key>
```

---

## Helpful Resources

- **PRD**: `prd.md` — features, scope, glossary, formulas.
- **AC**: `acceptance-criteria.md` — detailed Gherkin scenarios per feature.
- **Graph**: `graphify-out/GRAPH_REPORT.md` — architecture map (after graphify update).
- **AGENTS**: `AGENTS.md` — this file.
- **n8n Skills**: Refer to installed `n8n-workflow-patterns` + `n8n-node-configuration`.
- **Midtrans Skill**: Refer to installed `integrate-midtrans-payments`.

---

## Notes

- **InsForge Removed**: Project uses Go + Gin backend, not InsForge.
- **No Prisma**: Backend uses GORM (Go ORM), not Prisma.
- **No Supabase**: Direct PostgreSQL connection via GORM.
- **No Vercel**: Docker compose deployment (PostgreSQL + n8n + backend). Frontend via `npm run dev` atau terpisah.
- **Docker**: PostgreSQL dan n8n jalan di Docker. Backend Go bisa jalan native atau di Docker.
- **Git**: Always create new commits; never amend published commits.
- **Testing**: Critical paths (overlap, payment, auth) WAJIB punya test.

---

**Last Updated**: 2026-06-29  
**CourtFlow Version**: 1.0.0 (MVP)
