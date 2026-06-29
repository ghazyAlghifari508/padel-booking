# Sky Rally — Padel Booking Design Direction

> Bright sport-club booking UI: sky blue as primary action, stabilo yellow as highlighter, rounded but practical surfaces, court-line motifs, fast path from court discovery → time slot → booking.

**Theme:** light  
**Product:** Padel court booking app  
**Goal:** friendly local sport-center feel, not premium agency portfolio, not default shadcn dashboard.

## North Star

Padel booking UI must feel like booking a court on a sunny morning: clear, energetic, casual, fast. Design supports the job:

1. Find court.
2. Pick date/time.
3. Confirm booking.
4. Check upcoming bookings.

No decorative bloat. No generic SaaS hero fluff. No shadcn-gray sameness. Use MCP Magic / 21st inspiration when generating or refining UI; do not default to stock shadcn composition.

## Design Personality

- **Sporty:** court-line patterns, schedule lanes, compact availability chips.
- **Bright:** sky blue primary, stabilo yellow highlights.
- **Local club:** approachable, slightly playful, not luxury.
- **Functional:** booking widget visible early; slot states obvious.
- **Clean:** enough whitespace, but no over-polished agency-site drama.

## Tokens — Colors

| Name | Value | Token | Role |
| --- | --- | --- | --- |
| Sky | `#38BDF8` | `--color-sky` | Primary brand color, primary buttons, active nav, selected court/date |
| Deep Sky | `#0EA5E9` | `--color-deep-sky` | Hover/pressed primary, stronger links, focus ring |
| Highlighter | `#EFFF3A` | `--color-highlighter` | Secondary accent, available slots, promo markers, callout strokes |
| Sun | `#FDE047` | `--color-sun` | Hover/highlight variant, warning-lite accents, price badge |
| Court | `#14B8A6` | `--color-court` | Court surface accent, success/confirmed state |
| Navy | `#0F172A` | `--color-navy` | Primary text, dark panels, strong headings |
| Slate | `#475569` | `--color-slate` | Body text, secondary labels |
| Muted | `#94A3B8` | `--color-muted` | Hints, captions, disabled text |
| Line | `#D7E3EA` | `--color-line` | Borders, court-line decoration, dividers |
| Foam | `#F0F9FF` | `--color-foam` | Sky-tinted section background |
| Chalk | `#FAFEFF` | `--color-chalk` | Page canvas |
| White | `#FFFFFF` | `--color-white` | Cards, inputs, popovers |
| Danger | `#EF4444` | `--color-danger` | Cancel/error only |

### Color Rules

- Primary CTA = Sky / Deep Sky, not black.
- Highlighter = sparing emphasis, not full-page background.
- Available slot = white card + highlighter edge/fill cue.
- Confirmed/success = Court.
- Dark navy panels allowed for contrast, not full app theme.
- Avoid random gradients; if needed, use subtle `Foam → White` only.

## Typography

**Font:** Plus Jakarta Sans or DM Sans.  
Reason: friendly geometric sport-app tone, easy to read, no custom-font dependency.

| Role | Size | Weight | Line Height | Use |
| --- | ---: | ---: | ---: | --- |
| Caption | 12px | 500 | 1.4 | slot metadata, labels |
| Body | 14px | 400 | 1.55 | normal UI text |
| Body LG | 16px | 400 | 1.55 | intro copy, form text |
| Subheading | 18px | 600 | 1.35 | card titles |
| Heading | 28px | 700 | 1.2 | page titles |
| Hero | 44–52px | 750 | 1.05 | landing headline |
| Metric | 36–44px | 800 | 1.0 | stats, price emphasis |

Rules:

- No ultra-thin type.
- No huge agency 64px headline unless landing-only.
- Booking screens prioritize readable labels over dramatic display text.

## Spacing & Shape

**Base unit:** 4px  
**Density:** medium-compact

| Element | Value |
| --- | --- |
| Page max-width | 1180px |
| Section gap | 56–72px |
| Card padding | 20–24px |
| Booking widget padding | 16–20px |
| Element gap | 8–16px |
| Card radius | 20–24px |
| Compact card radius | 16px |
| Input radius | 14–16px |
| Button radius | 999px pill |
| Slot chip radius | 14px |
| Badge radius | 999px or 12px |

Rule: do not use 36px radius everywhere. Too premium-template. Keep it soft but app-like.

## Surfaces

| Level | Name | Value | Use |
| --- | --- | --- | --- |
| 1 | Canvas | `#FAFEFF` | default page |
| 2 | Foam | `#F0F9FF` | hero bands, soft sections |
| 3 | Card | `#FFFFFF` | primary cards/forms |
| 4 | Tinted Card | `#EAF7FF` | selected/active containers |
| 5 | Dark | `#0F172A` | contrast panels, footer |

Elevation:

- Cards: 1px border `#D7E3EA`, soft shadow only when interactive.
- Interactive cards: `0 12px 30px rgba(14, 165, 233, 0.10)`.
- No heavy shadows. No glassmorphism default.

## Core Components

### Primary Button

Sky fill, white text, pill radius, 14–16px medium/semi-bold, padding `10–14px 16–22px`. Hover deep sky. Focus ring deep sky + highlighter outer glow.

Use for: book now, confirm booking, sign in.

### Secondary Button

White fill, navy text, line border, pill radius. Hover foam.

Use for: view details, change date, cancel modal secondary.

### Highlighter Action

Highlighter fill, navy text, pill radius, medium weight. Use rarely.

Use for: promo, “next available”, “join match” if added later.

### Court Card

White card, 20–24px radius, court image/illustration top or court-line pattern background. Show:

- court name
- indoor/outdoor
- location
- price/hour
- next available slot
- status badge
- primary CTA

Selected card: sky border + foam fill.

### Booking Widget

Most important component. Should appear on landing/dashboard above fold.

Layout:

- date picker row
- court selector
- time slot grid/timeline
- summary panel
- confirm button

Slot states:

| State | Style |
| --- | --- |
| Available | white + highlighter left/top stripe |
| Selected | sky fill + white text |
| Booked | muted gray, disabled |
| Peak hour | sun badge |
| Maintenance | dashed border + muted text |

### Time Slot Chip

Rectangular pill, 14px radius, enough tap target. Mobile min height 44px.

### Status Badge

- Available: highlighter bg + navy text.
- Confirmed: court bg + white text.
- Pending: sun bg + navy text.
- Cancelled: light red bg + danger text.

### Navbar

Sticky, white/foam translucent allowed, thin border bottom. Brand left, main nav center/right, booking CTA right. Active nav sky pill/underline. No generic shadcn gray tabs.

### Hero

Two-column on desktop:

- Left: headline + short subtext + CTA.
- Right: live-looking booking widget/card.

Hero copy should be specific:

> Book padel courts in seconds. Pick your court, grab a slot, play.

No “transform your workflow” copy.

### Dashboard

Must feel operational:

- upcoming booking card
- quick book widget
- favorite courts
- recent bookings
- simple stats if useful

No giant empty SaaS analytics charts unless data exists.

### Admin

Admin can be more table-like, but still branded:

- court management cards
- bookings table with strong status colors
- slot maintenance controls
- compact filters

Do not overbuild enterprise dashboard visual language.

## Layout Patterns

### Landing Page

1. Nav
2. Hero + booking preview
3. Quick stats / trust strip
4. Court availability preview
5. How booking works: 3 steps
6. Featured courts
7. CTA band

### Courts Page

- filter bar top
- court cards grid
- sticky/side booking summary on desktop
- bottom booking drawer on mobile

### Court Detail Page

- court header
- amenities chips
- date + slot selector
- booking summary
- related courts optional

### Confirm Booking Page

- concise booking summary
- payment/status placeholder if payment not implemented
- confirm CTA
- back/change controls

## Motion

- Hover: translateY(-1px), shadow/opacity only.
- Slot selection: quick scale `0.98 → 1`.
- Page transitions: none unless already in stack.
- Avoid animated gradients, bouncing icons, excessive reveal effects.

## Imagery & Decoration

Use:

- court-line patterns
- padel racket/ball simple line icons
- real court photos if available
- subtle blue/yellow blobs only as background accents

Avoid:

- generic 3D blobs
- random AI people photos
- fake glass cards
- oversized abstract gradients

## Accessibility

- All interactive controls min 44px touch target on mobile.
- Slot color must also have text/state labels.
- Focus ring visible: deep sky + highlighter offset.
- Highlighter text uses navy, never white.
- Disabled booked slots use clear label, not only opacity.

## Do

- Make booking path obvious above fold.
- Use sky blue for primary action and active selections.
- Use highlighter yellow for attention, available slots, promo/next slot.
- Use court-line visuals to make app feel padel-specific.
- Keep cards rounded but practical.
- Prefer native/simple controls unless design specifically benefits from custom UI.
- Use MCP Magic / 21st for UI inspiration/components when implementing.

## Don't

- Don't copy Awesomic black-white portfolio style directly.
- Don't default to shadcn gray cards/buttons/tabs.
- Don't use 36px radius everywhere.
- Don't make landing page more important than booking flow.
- Don't add decorative charts without real product value.
- Don't use yellow for destructive/warning errors; danger remains red.
- Don't hide availability behind modals.

## Implementation Prompt For MCP Magic

When generating/refining components, use this brief:

> Create a bright padel court booking UI, not default shadcn. Primary palette sky blue (`#38BDF8`, `#0EA5E9`) with stabilo yellow secondary (`#EFFF3A`, `#FDE047`). Use white/foam surfaces, navy text, rounded 20–24px cards, pill CTAs, court-line motifs, clear availability slot chips, friendly local sport-club feel. Avoid luxury agency look, heavy black CTAs, generic SaaS dashboard gray, glassmorphism, and random gradients. Booking flow clarity beats decoration.

## Quick CSS Tokens

```css
:root {
  --color-sky: #38bdf8;
  --color-deep-sky: #0ea5e9;
  --color-highlighter: #efff3a;
  --color-sun: #fde047;
  --color-court: #14b8a6;
  --color-navy: #0f172a;
  --color-slate: #475569;
  --color-muted: #94a3b8;
  --color-line: #d7e3ea;
  --color-foam: #f0f9ff;
  --color-chalk: #fafeff;
  --color-white: #ffffff;
  --color-danger: #ef4444;

  --font-sans: "Plus Jakarta Sans", "DM Sans", ui-sans-serif, system-ui, sans-serif;

  --radius-card: 24px;
  --radius-card-sm: 16px;
  --radius-input: 16px;
  --radius-pill: 999px;

  --shadow-card: 0 12px 30px rgba(14, 165, 233, 0.1);
  --border-soft: 1px solid var(--color-line);
}
```
