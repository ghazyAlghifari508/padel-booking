# Acceptance Criteria — CourtFlow Padel Court Booking Automation System

Scope: web-based padel court booking app for managing Users, Courts, Schedules, Bookings, Payments, n8n automations, notifications, and reporting. The system has two main roles: User and Admin. Backend uses Go. Database uses PostgreSQL. Automation is handled through n8n webhooks. Currency: IDR (Rp). Timezone: Asia/Jakarta (WIB). Design decisions such as colors, fonts, layout, spacing, and component sizing are intentionally excluded from this document.

---

## Glossary / Conventions

| Term | Meaning |
|---|---|
| User | Customer/player who books a padel court. |
| Admin | Internal operator who manages courts, schedules, bookings, payments, and automation logs. |
| Court | A padel court available for booking. |
| Slot | A bookable time range for a court, e.g. 08:00–09:00. |
| Booking | Reservation created by a user for a court at a specific date and time. |
| Active Booking | A booking that still blocks a slot. Includes `pending_payment` and `confirmed`. |
| Pending Payment | Booking has been created but payment is not yet completed or verified. |
| Confirmed | Booking is valid, approved, and blocks the selected court slot. |
| Cancelled | Booking has been cancelled by user or admin. |
| Expired | Booking is no longer valid because payment or confirmation deadline has passed. |
| Completed | Booking time has passed and the session is considered finished. |
| Payment | Payment record attached to a booking. Can be manual payment or payment gateway transaction. |
| Automation Event | Event sent from backend to n8n, such as `booking_created` or `booking_confirmed`. |
| Automation Log | Record of n8n workflow execution result. |
| Overlap | Condition where two bookings on the same court and date have conflicting time ranges. |
| Blocked Time | Court slot intentionally closed by admin for maintenance, event, or other reasons. |

---

## 1. Authentication

AC-1.1 The app requires login before a user can create a booking or view personal booking history.

AC-1.2 Public pages such as landing page and court listing may be accessible without login.

AC-1.3 A user can register using name, email, phone number, and password.

AC-1.4 Email must be unique; registering with an existing email is rejected with a clear error.

AC-1.5 Given valid credentials, the user is logged in and receives an authenticated session/token.

AC-1.6 Given invalid credentials, login is rejected with a clear error and no access is granted.

AC-1.7 A logged-in session persists until logout or token/session expiry.

AC-1.8 A logout option is available and invalidates the active session/token on the client side.

AC-1.9 Passwords must be stored as hashes; raw passwords must never be stored.

AC-1.10 Admin accounts can log in through the same authentication mechanism or a dedicated admin login route.

---

## 2. Role & Authorization

The system has two main roles: User and Admin.

AC-2.1 A User can view public court data, create bookings, view their own bookings, and cancel eligible bookings.

AC-2.2 A User cannot view, update, cancel, or delete another user's booking.

AC-2.3 An Admin can view all bookings from all users.

AC-2.4 An Admin can create, edit, deactivate, and manage courts.

AC-2.5 An Admin can approve, reject, cancel, or update booking/payment status according to operational rules.

AC-2.6 Admin-only endpoints must be protected by backend authorization checks.

AC-2.7 Frontend hiding of admin UI is not sufficient authorization; backend must reject unauthorized admin endpoint access.

AC-2.8 If a non-admin attempts to access an admin endpoint, the backend returns a forbidden response.

AC-2.9 If an unauthenticated request accesses a protected endpoint, the backend returns an unauthorized response.

---

## 3. Court Management (CRUD)

A Court has: Name, Description, Location, Price per hour, Image URL (optional), and Status.

AC-3.1 Admin can create a court with required fields: name, price per hour, and status.

AC-3.2 Admin can edit any editable field of an existing court.

AC-3.3 Admin can deactivate a court.

AC-3.4 Inactive courts are hidden from new booking selections.

AC-3.5 Historical bookings for inactive courts remain intact and visible in admin records.

AC-3.6 Court price per hour must be numeric and greater than or equal to 0.

AC-3.7 Court status is restricted to valid values such as `active` and `inactive`.

AC-3.8 Public court list only displays courts that are active.

AC-3.9 If admin deletes a court that has historical bookings, the system must preserve booking history through soft-delete or deactivation.

AC-3.10 Court data changes must affect future bookings but must not rewrite historical booking records.

---

## 4. Schedule & Availability Management

A court schedule determines which slots can be booked. Availability is calculated from operating hours, blocked times, and active bookings.

AC-4.1 Admin can define operating hours for each court.

AC-4.2 Operating hours include day of week, open time, close time, and closed status.

AC-4.3 If a court is marked closed for a day, no slots are available for that day.

AC-4.4 Admin can create blocked time for a court on a specific date and time range.

AC-4.5 Blocked time removes matching slots from user availability.

AC-4.6 The app must show available and unavailable slots based on selected court and date.

AC-4.7 A slot outside operating hours must not be bookable.

AC-4.8 A slot inside blocked time must not be bookable.

AC-4.9 A slot with an active booking must not be bookable.

AC-4.10 Cancelled, expired, or completed bookings do not block future availability.

AC-4.11 Availability must be recalculated when court schedule, blocked time, or booking status changes.

---

## 5. Booking Management

Each booking captures: User, Court, Booking Date, Start Time, End Time, Status, Total Price, Payment Status, Created At, Updated At, and Cancelled At if applicable.

AC-5.1 User can create a booking by selecting a court, booking date, start time, and end time.

AC-5.2 Booking date is required.

AC-5.3 Court selection is required and must reference an existing active court.

AC-5.4 Start time and end time are required.

AC-5.5 End time must be later than start time.

AC-5.6 Booking duration is calculated from start time and end time.

AC-5.7 Total price is calculated from court price per hour multiplied by booking duration.

AC-5.8 New booking status defaults to `pending_payment` unless the implementation confirms booking immediately.

AC-5.9 New booking payment status defaults to `unpaid` or `pending`, depending on payment flow.

AC-5.10 User can view their own booking list.

AC-5.11 User can view details of their own booking.

AC-5.12 User cannot view another user's booking detail.

AC-5.13 User can cancel a booking if the booking status and business rule allow cancellation.

AC-5.14 Cancelled bookings are visually/status-wise distinguishable from active bookings.

AC-5.15 Admin can view, approve, reject, cancel, and update booking status.

AC-5.16 Updating booking status must update `updated_at`.

AC-5.17 Cancelling a booking must set status to `cancelled` and populate `cancelled_at`.

AC-5.18 Completed bookings cannot be cancelled by user.

---

## 6. Booking Overlap Rule

The booking overlap rule is enforced everywhere a booking is created, approved, or updated.

AC-6.1 A court cannot have more than one active booking with overlapping time on the same date.

AC-6.2 Active booking statuses are `pending_payment` and `confirmed`.

AC-6.3 A new booking overlaps an existing booking when: new start time is before existing end time, and new end time is after existing start time.

AC-6.4 Given Court A has an active booking from 19:00 to 20:00, a new booking from 19:30 to 20:30 is rejected.

AC-6.5 Given Court A has an active booking from 19:00 to 20:00, a new booking from 20:00 to 21:00 is accepted if the slot is otherwise available.

AC-6.6 Backend must perform the final overlap validation even if frontend already disables unavailable slots.

AC-6.7 If two users attempt to book the same slot at the same time, only one booking can succeed.

AC-6.8 The system must use database validation, transaction, locking, or an equivalent mechanism to avoid race-condition double booking.

---

## 7. Payment Management

A Payment belongs to one Booking. MVP may use manual payment or Midtrans Sandbox.

AC-7.1 Each booking can have one payment record.

AC-7.2 Payment amount must match booking total price.

AC-7.3 Payment provider can be `manual`, `midtrans`, or another configured provider.

AC-7.4 Payment status is restricted to valid values such as `pending`, `paid`, `failed`, and `expired`.

AC-7.5 If manual payment is used, Admin can mark payment as paid after external verification.

AC-7.6 If payment gateway is used, backend can create a payment transaction and store the payment URL or payment reference.

AC-7.7 If payment gateway webhook reports successful payment, payment status becomes `paid`.

AC-7.8 If payment gateway webhook reports failed payment, payment status becomes `failed`.

AC-7.9 If payment gateway webhook reports expired payment, payment status becomes `expired` and the related booking may become `expired`.

AC-7.10 Payment webhook must be verified before updating payment or booking status.

AC-7.11 A booking can only become `confirmed` when payment or admin confirmation rules are satisfied.

---

## 8. Admin Dashboard

Admin dashboard summarizes operational data.

AC-8.1 Admin can view total bookings for the selected period.

AC-8.2 Admin can view pending bookings.

AC-8.3 Admin can view confirmed bookings.

AC-8.4 Admin can view cancelled or expired bookings.

AC-8.5 Admin can view total revenue based on paid or confirmed booking rules.

AC-8.6 Admin can view latest bookings.

AC-8.7 Admin can filter bookings by date, court, booking status, and payment status.

AC-8.8 Dashboard must handle empty state when no booking exists.

AC-8.9 Dashboard data must update after booking or payment status changes.

---

## 9. n8n Automation

Backend sends automation events to n8n through webhook.

AC-9.1 When a booking is created, backend sends `booking_created` event to n8n.

AC-9.2 `booking_created` payload includes booking ID, user data, court data, booking date, start time, end time, status, and total price.

AC-9.3 When a booking becomes confirmed, backend sends `booking_confirmed` event to n8n.

AC-9.4 When a booking is cancelled, backend sends `booking_cancelled` event to n8n.

AC-9.5 n8n can send an admin notification when booking is created.

AC-9.6 n8n can send confirmation email when booking is confirmed.

AC-9.7 n8n can create Google Calendar event when booking is confirmed.

AC-9.8 n8n can append booking data to Google Sheets.

AC-9.9 n8n can send reminder notification before the booking schedule.

AC-9.10 n8n can send daily or weekly report to admin.

AC-9.11 If n8n webhook request fails, the system records a failed automation log.

AC-9.12 n8n webhook must use a secret token or equivalent verification method.

---

## 10. Automation Logs

Automation logs allow Admin to inspect workflow execution results.

AC-10.1 The system creates an automation log after each automation attempt.

AC-10.2 Automation log includes workflow name, event type, status, message, related booking if any, and execution time.

AC-10.3 Automation status is restricted to values such as `success` and `failed`.

AC-10.4 Admin can view automation logs.

AC-10.5 Admin can filter automation logs by status, event type, and booking.

AC-10.6 Failed automation logs must show a readable error message.

AC-10.7 User cannot access automation logs.

---

## 11. Notifications & Reminders

Notifications can be sent through email, Telegram, or another configured channel through n8n.

AC-11.1 Booking created notification is sent to Admin.

AC-11.2 Booking confirmed notification is sent to User.

AC-11.3 Booking cancelled notification is sent to User.

AC-11.4 Reminder can be sent before the scheduled booking time.

AC-11.5 Daily report can be sent to Admin.

AC-11.6 Notification content includes at minimum booking ID, user name, court name, date, time, status, and total price where relevant.

AC-11.7 Notification failure does not automatically cancel the booking.

AC-11.8 Notification failure must be recorded in automation logs.

---

## 12. Reporting

Reporting is available for admin operations and n8n daily/weekly summaries.

AC-12.1 Admin can view booking recap by day.

AC-12.2 Admin can view booking recap by week or selected date range.

AC-12.3 Admin can view revenue based on paid or confirmed bookings.

AC-12.4 Admin can view court usage count.

AC-12.5 Cancelled and expired bookings are excluded from revenue totals.

AC-12.6 Report can be used by n8n to send daily or weekly summary.

AC-12.7 Report data should be calculated from database records, not hardcoded values.

---

## 13. Master Availability & Calculation Reference

| Quantity | Formula / Rule |
|---|---|
| Booking duration | `end_time - start_time` |
| Booking total price | `court.price_per_hour × duration_in_hours` |
| Active booking | Booking with status `pending_payment` or `confirmed` |
| Slot available | Within operating hours, not blocked, and no active booking overlap |
| Slot unavailable | Outside operating hours, blocked, or overlapped by active booking |
| Overlap condition | `existing.start_time < new.end_time AND existing.end_time > new.start_time` |
| Paid revenue | Sum of booking total price where payment status is `paid` |
| Confirmed booking count | Count bookings where status is `confirmed` |
| Cancelled booking count | Count bookings where status is `cancelled` |
| Expired booking count | Count bookings where status is `expired` |

Scenario: Booking overlap

Given Court A has confirmed booking from 19:00 to 20:00  
When User attempts to book Court A from 19:30 to 20:30  
Then the booking is rejected because the time range overlaps.

Scenario: Adjacent booking

Given Court A has confirmed booking from 19:00 to 20:00  
When User attempts to book Court A from 20:00 to 21:00  
Then the booking is accepted if there is no blocked time and the court is within operating hours.

Scenario: Cancelled booking releases slot

Given Court A has cancelled booking from 19:00 to 20:00  
When another user checks availability for 19:00 to 20:00  
Then the slot is available if no other active booking exists.

---

## 14. API & Error Handling

AC-14.1 API success response uses a consistent JSON structure.

AC-14.2 API error response uses a consistent JSON structure.

AC-14.3 Validation errors clearly identify invalid fields.

AC-14.4 Unauthorized access returns an unauthorized response.

AC-14.5 Forbidden access returns a forbidden response.

AC-14.6 Missing data returns a not found response.

AC-14.7 Booking overlap returns a clear slot unavailable error.

AC-14.8 Payment mismatch returns a clear payment validation error.

AC-14.9 Unexpected errors are logged and return a safe generic error message.

---

## 15. Security & Data Integrity

AC-15.1 Passwords are hashed before storage.

AC-15.2 Authentication token secret is stored in environment variables.

AC-15.3 Database credentials are stored in environment variables.

AC-15.4 Payment gateway credentials are stored in environment variables.

AC-15.5 n8n webhook secret is stored in environment variables.

AC-15.6 User input is validated before database write.

AC-15.7 Admin endpoints require admin role.

AC-15.8 User endpoints verify booking ownership.

AC-15.9 Payment webhook is verified before updating data.

AC-15.10 Booking creation uses safe validation to prevent double booking.

---

## 16. Confirmed Decisions (resolved)

| # | Question | Decision |
|---|---|---|
| D1 | Main backend technology | Go. |
| D2 | Web framework | Gin is recommended for the backend API. |
| D3 | Database | PostgreSQL. |
| D4 | Frontend framework | Next.js with TypeScript. |
| D5 | Automation engine | n8n through webhook-based events. |
| D6 | Payment MVP | Manual payment is allowed; Midtrans Sandbox can be added. |
| D7 | Booking conflict rule | Active bookings cannot overlap on the same court and date. |
| D8 | Active booking statuses | `pending_payment` and `confirmed`. |
| D9 | Cancelled/expired slot behavior | Cancelled and expired bookings do not block slots. |
| D10 | Design ownership | Visual design decisions are excluded from this document and handled separately. |
| D11 | Currency | IDR (Rp). |
| D12 | Timezone | Asia/Jakarta (WIB). |
