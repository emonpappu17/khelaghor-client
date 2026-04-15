# Khelaghor API Documentation

> Bangladesh-based sports field booking platform  
> **Base URL:** `https://your-server.com/api/v1`  
> **Version:** 1.0.0  
> **Last Updated:** April 2026

---

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Standard Response Format](#standard-response-format)
5. [Error Handling](#error-handling)
6. [Pagination](#pagination)
7. [Modules](#modules)
   - [Auth](#1-auth)
   - [Users](#2-users)
   - [Hosts](#3-hosts)
   - [Fields](#4-fields)
   - [Slots](#5-slots)
   - [Map](#6-map)
   - [Bookings](#7-bookings)
   - [Payments](#8-payments)
   - [Reviews](#9-reviews)
   - [Notifications](#10-notifications)
8. [Data Models](#data-models)
9. [Enums Reference](#enums-reference)
10. [Quick Start Example](#quick-start-example)

---

## Introduction

Khelaghor is a REST API for booking sports fields (Football, Cricket, Badminton, Basketball, Tennis) in Bangladesh. It supports multi-role access (User, Host, Admin, Super Admin), SSLCommerz payment integration, Google OAuth, in-app notifications, and location-based field search via Barikoi Maps.

---

## Authentication

The API uses **JWT Bearer tokens** sent either via the `Authorization` header or as an HTTP-only cookie.

### Token Types

| Token | Storage |
|---|---|
| Access Token | `Authorization` header or `accessToken` cookie |
| Refresh Token | `refreshToken` HTTP-only cookie |

### How to Authenticate

```
Authorization: Bearer <your_access_token>
```

### Token Rotation

Refresh tokens are **rotated on every use** (stored in Redis). Reusing an old refresh token returns `403`.

---

## Rate Limiting

| Window | Max Requests per IP |
|---|---|
| 15 minutes | 100 requests |

**429 Response:**
```json
{
  "success": false,
  "message": "Too many requests from this IP. Please try again later."
}
```

---

## Standard Response Format

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { },
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

`meta` is only included on paginated responses.

---

## Error Handling

```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ]
}
```

| Status | Meaning |
|---|---|
| `400` | Bad Request / Validation Error |
| `401` | Unauthorized (no/invalid token) |
| `403` | Forbidden (wrong role, blocked/deleted account) |
| `404` | Not Found |
| `409` | Conflict |
| `429` | Rate limit exceeded |
| `500` | Internal Server Error |
| `502` | External service failed |

---

## Pagination

| Query Param | Default | Description |
|---|---|---|
| `page` | `1` | Page number |
| `limit` | `10` | Items per page |
| `sortBy` | `createdAt` | Sort field |
| `sortOrder` | `desc` | `asc` or `desc` |

---

## Modules

---

## 1. Auth

**Base path:** `/api/v1/auth`

---

### POST /auth/register

Register a new user or host.

**Auth:** None

**Body:**
```json
{
  "name": "Ahmed Karim",
  "email": "ahmed@example.com",
  "password": "secret123",
  "phone": "01712345678",
  "role": "USER",
  "business_name": "Karim Sports",
  "nid_number": "1234567890"
}
```

| Field | Required | Rules |
|---|---|---|
| `name` | ✅ | Min 2 chars |
| `email` | ✅ | Valid email |
| `password` | ✅ | Min 6 chars |
| `phone` | ❌ | — |
| `role` | ❌ | `USER` or `HOST` (default: `USER`) |
| `business_name` | ❌ | Min 2 chars — required if HOST |
| `nid_number` | ❌ | Exactly 10 chars — required if HOST |

**201 Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "id": "uuid",
    "name": "Ahmed Karim",
    "email": "ahmed@example.com",
    "role": "USER",
    "createdAt": "2026-04-11T12:00:00.000Z"
  }
}
```

**Errors:** `409` email exists · `400` validation

**cURL:**
```bash
curl -X POST https://your-server.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ahmed Karim","email":"ahmed@example.com","password":"secret123","role":"USER"}'
```

---

### POST /auth/login

Authenticate and receive tokens.

**Auth:** None

**Body:**
```json
{ "email": "ahmed@example.com", "password": "secret123" }
```

**200 Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "user": { "id": "uuid", "name": "Ahmed Karim", "email": "...", "role": "USER", "avatar": null }
  }
}
```

> Cookies `accessToken` and `refreshToken` are also set (HttpOnly).

**Errors:** `401` invalid credentials · `403` account deleted/inactive · `400` social-login account

---

### POST /auth/refresh-token

Rotate tokens using the `refreshToken` cookie.

**Auth:** None (uses cookie)

**200 Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": { "accessToken": "eyJhbGci...", "newRefreshToken": "eyJhbGci..." }
}
```

**Errors:** `401` no refresh token · `403` reused/invalid token

---

### POST /auth/change-password

**Auth:** Required

**Body:**
```json
{ "oldPassword": "secret123", "newPassword": "newSecret456" }
```

**Errors:** `400` old password incorrect

---

### POST /auth/forgot-password

Send a 6-digit OTP to the user's email. OTP expires in **2 minutes**.

**Auth:** None

**Body:** `{ "email": "ahmed@example.com" }`

**200 Response:** `{ "success": true, "message": "OTP sent to your email" }`

---

### POST /auth/verify-otp

Verify OTP and receive a `resetToken`.

**Auth:** None

**Body:**
```json
{ "email": "ahmed@example.com", "otp": 123456 }
```

**200 Response:**
```json
{
  "success": true,
  "data": { "resetToken": "eyJhbGci..." }
}
```

**Errors:** `400` OTP expired or invalid

---

### POST /auth/reset-password

Reset password using the `resetToken`.

**Auth:** None — pass `resetToken` in `Authorization` header (not Bearer-prefixed)

**Headers:** `Authorization: <resetToken>`

**Body:** `{ "email": "ahmed@example.com", "password": "newSecret456" }`

---

### POST /auth/logout

**Auth:** Required

Clears cookies and invalidates refresh token in Redis.

---

### GET /auth/google

Initiate Google OAuth. Redirects to Google consent screen.

**Query Params:** `redirect` — frontend path to return to (e.g., `/dashboard`)

---

## 2. Users

**Base path:** `/api/v1/users`

---

### GET /users/me

Get authenticated user profile.

**Auth:** Required (any role)

**200 Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Ahmed Karim",
    "email": "ahmed@example.com",
    "phone": "01712345678",
    "avatar": "https://cloudinary.com/...",
    "role": "HOST",
    "status": "ACTIVE",
    "isVerified": false,
    "createdAt": "2026-04-01T00:00:00.000Z",
    "hostProfile": {
      "id": "uuid",
      "businessName": "Karim Sports",
      "isApproved": true,
      "approvedAt": "2026-04-05T00:00:00.000Z"
    }
  }
}
```

---

### PATCH /users/me

Update profile. Supports avatar upload.

**Auth:** Required

**Content-Type:** `multipart/form-data`

| Field | Required | Rules |
|---|---|---|
| `name` | ❌ | Min 2 chars |
| `phone` | ❌ | — |
| `avatar` (file) | ❌ | Image file, max 5MB |

---

### DELETE /users/me

Soft-delete own account.

**Auth:** Required

---

### GET /users

List users with filters and pagination.

**Auth:** `ADMIN`, `SUPER_ADMIN`

**Query:** `role`, `status`, pagination params

---

### GET /users/:id

Get user by ID.

**Auth:** `ADMIN`, `SUPER_ADMIN`

---

### PATCH /users/:id/status

Update user status.

**Auth:** `ADMIN`, `SUPER_ADMIN`

**Body:** `{ "status": "SUSPENDED" }`

Allowed: `ACTIVE` | `SUSPENDED` | `BLOCKED` | `INACTIVE`

---

### PATCH /users/:id/role

Update user role. Auto-creates Host profile on `HOST` promotion.

**Auth:** `ADMIN`, `SUPER_ADMIN`

**Body:** `{ "role": "HOST" }`

---

### DELETE /users/:id

Soft-delete a user.

**Auth:** `ADMIN`, `SUPER_ADMIN`

---

## 3. Hosts

**Base path:** `/api/v1/hosts`

---

### POST /hosts/apply

Apply to be a host or update existing host profile.

**Auth:** Required

**Body:**
```json
{ "business_name": "Karim Sports Arena", "nid_number": "1234567890" }
```

---

### GET /hosts/me

Get my host profile.

**Auth:** Required

---

### PATCH /hosts/me

Update my host profile.

**Auth:** Required

**Body:** Same as apply (all optional)

---

### GET /hosts

List all hosts with pagination.

**Auth:** `ADMIN`, `SUPER_ADMIN`

**Query:** `isApproved=true|false`, pagination params

---

### GET /hosts/:id

Get a specific host by ID.

**Auth:** `ADMIN`, `SUPER_ADMIN`

---

### PATCH /hosts/:id/approve

Approve a host profile.

**Auth:** `ADMIN`, `SUPER_ADMIN`

**200 Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "isApproved": true, "approvedAt": "2026-04-11T00:00:00.000Z" }
}
```

---

## 4. Fields

**Base path:** `/api/v1/fields`

> Only **approved hosts** can create/manage fields.

---

### GET /fields

List all fields. **Public.**

**Auth:** None

**Query Params:**

| Param | Description |
|---|---|
| `sportType` | `FOOTBALL`, `CRICKET`, etc. |
| `division` | Division name |
| `district` | District name |
| `area` | Area/neighborhood |
| `status` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| pagination params | — |

**200 Response:**
```json
{
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 30 },
  "data": {
    "fields": [
      {
        "id": "uuid",
        "name": "Green Valley Football Ground",
        "sportType": "FOOTBALL",
        "description": "Premium artificial turf",
        "maxPlayers": 22,
        "facilities": ["Changing Room", "Parking", "Floodlights"],
        "images": ["https://cloudinary.com/..."],
        "division": "Dhaka",
        "district": "Dhaka",
        "address": "Mirpur-10, Dhaka",
        "area": "Mirpur",
        "latitude": 23.8103,
        "longitude": 90.4125,
        "status": "ACTIVE",
        "averageRating": 4.5,
        "totalReviews": 12
      }
    ]
  }
}
```

---

### GET /fields/:id

Get full field details with slots and host info. **Public.**

---

### POST /fields

Create a new field.

**Auth:** `HOST`

**Content-Type:** `multipart/form-data`

| Field | Required | Rules |
|---|---|---|
| `name` | ✅ | Min 2 chars |
| `sportType` | ✅ | See enums |
| `description` | ✅ | Min 10 chars |
| `maxPlayers` | ❌ | Positive int, default 10 |
| `facilities` | ❌ | String array |
| `division` | ✅ | Min 2 chars |
| `district` | ✅ | Min 2 chars |
| `address` | ✅ | Min 4 chars |
| `area` | ✅ | Min 2 chars |
| `latitude` | ✅ | Float |
| `longitude` | ✅ | Float |
| images (files) | ❌ | Max 10 files, 5MB each |

**Errors:** `403` host not found or not approved

**cURL:**
```bash
curl -X POST https://your-server.com/api/v1/fields \
  -H "Authorization: Bearer TOKEN" \
  -F "name=Green Valley Ground" \
  -F "sportType=FOOTBALL" \
  -F "description=Premium turf with floodlights" \
  -F "division=Dhaka" -F "district=Dhaka" \
  -F "address=Mirpur-10" -F "area=Mirpur" \
  -F "latitude=23.8103" -F "longitude=90.4125"
```

---

### PATCH /fields/:id

Update a field. New image uploads replace all existing images.

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

**Errors:** `403` not your field or suspended · `404` not found

---

### DELETE /fields/:id

Soft-delete field (sets `status = INACTIVE`).

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

---

## 5. Slots

**Base path:** `/api/v1/slots`

---

### GET /slots/:fieldId

Get all slots for a field. **Public.**

**Query:** `status=AVAILABLE|BOOKED|BLOCKED`

**200 Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fieldId": "uuid",
      "date": "2026-04-20T00:00:00.000Z",
      "startTime": "08:00",
      "endTime": "09:00",
      "pricePerSlot": 1500,
      "status": "AVAILABLE"
    }
  ]
}
```

---

### POST /slots/:fieldId

Bulk-create slots for a date/time range. Uses **Serializable transaction**.

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

**Body:**
```json
{
  "startDate": "2026-04-20",
  "endDate": "2026-04-30",
  "startTime": "08:00",
  "endTime": "22:00",
  "slotDurationMinutes": 60,
  "pricePerSlot": 1500
}
```

| Field | Required | Rules |
|---|---|---|
| `startDate` | ✅ | `YYYY-MM-DD`, future date |
| `endDate` | ✅ | `YYYY-MM-DD`, >= startDate |
| `startTime` | ✅ | `HH:mm` |
| `endTime` | ✅ | `HH:mm`, after startTime |
| `slotDurationMinutes` | ❌ | 15–480 min, default 60 |
| `pricePerSlot` | ✅ | Positive number (BDT) |

**201 Response:**
```json
{
  "success": true,
  "data": { "count": 14, "totalGenerated": 14, "message": "14 slots created successfully" }
}
```

**Errors:** `400` past date / invalid range · `403` not your field · `409` overlap exists

---

### PATCH /slots/:fieldId/:slotId

Update slot price or status.

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

**Body:**
```json
{ "pricePerSlot": 2000, "status": "BLOCKED" }
```

At least one field required.

**Errors:** `403` cannot change status of BOOKED slot

---

### DELETE /slots/:fieldId/:slotId

Delete a slot permanently.

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

**Errors:** `403` cannot delete BOOKED slot

---

## 6. Map

**Base path:** `/api/v1/map`

> Powered by **Barikoi Maps API** (Bangladesh).

---

### GET /map/autocomplete

Get place suggestions.

**Auth:** None

**Query:** `q` (required, min 3 chars)

```bash
curl "https://your-server.com/api/v1/map/autocomplete?q=Mirpur"
```

**Errors:** `400` query too short · `502` Barikoi API failed

---

### GET /map/reverse-geocode

Convert coordinates to address.

**Auth:** None

**Query:** `latitude`, `longitude` (both required)

```bash
curl "https://your-server.com/api/v1/map/reverse-geocode?latitude=23.8103&longitude=90.4125"
```

---

## 7. Bookings

**Base path:** `/api/v1/bookings`

> **Platform Fee:** 5% · **Expiry:** PENDING bookings expire in 30 min (cron job)

---

### POST /bookings

Create a booking and initiate SSLCommerz payment. Uses **Serializable transaction**.

**Auth:** Required (any role)

**Body:**
```json
{ "slotId": "uuid", "paymentType": "FULL" }
```

| Field | Required | Values |
|---|---|---|
| `slotId` | ✅ | UUID |
| `paymentType` | ✅ | `FULL` or `PARTIAL` (50% upfront) |

**201 Response:**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "uuid",
      "totalAmount": 1500,
      "paidAmount": 0,
      "dueAmount": 1500,
      "platformFee": 75,
      "hostAmount": 1425,
      "bookingStatus": "PENDING",
      "expiresAt": "2026-04-11T13:30:00.000Z"
    },
    "payment": {
      "id": "uuid",
      "amount": 1500,
      "transactionId": "KH-abc123-1712839200000",
      "gatewayPageURL": "https://sandbox.sslcommerz.com/..."
    },
    "paymentUrl": "https://sandbox.sslcommerz.com/..."
  }
}
```

> Redirect the user to `paymentUrl` to complete payment.

**Errors:** `404` slot not found · `409` slot already booked · `400` past slot / field inactive

**JavaScript:**
```javascript
const res = await fetch('/api/v1/bookings', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ slotId: 'uuid', paymentType: 'FULL' })
});
const { data } = await res.json();
window.location.href = data.paymentUrl; // redirect to SSLCommerz
```

---

### GET /bookings/my

Get my bookings with pagination.

**Auth:** Required (any role)

**Query:** `status`, pagination params

**200 Response:**
```json
{
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 5 },
  "data": {
    "bookings": [
      {
        "id": "uuid",
        "totalAmount": 1500,
        "paidAmount": 1500,
        "dueAmount": 0,
        "bookingStatus": "CONFIRMED",
        "slot": {
          "date": "2026-04-20T00:00:00.000Z",
          "startTime": "08:00",
          "endTime": "09:00",
          "field": { "name": "Green Valley Ground", "sportType": "FOOTBALL", "address": "Mirpur-10" }
        },
        "payments": [{ "id": "uuid", "amount": 1500, "status": "COMPLETED", "paidAt": "..." }]
      }
    ]
  }
}
```

---

### GET /bookings/host

Get bookings for the host's field.

**Auth:** `HOST`, `ADMIN`, `SUPER_ADMIN`

**Query:** `status`, pagination params

---

### GET /bookings/:bookingId

Get booking details.

**Auth:** Required — booking owner, field host, or admin

**Errors:** `403` no permission · `404` not found

---

### POST /bookings/:bookingId/cancel

Cancel a booking (owner only).

**Auth:** Required (booking owner)

**Body:**
```json
{ "reason": "Schedule conflict" }
```

| Field | Required | Rules |
|---|---|---|
| `reason` | ❌ | Max 500 chars |

**Behavior:**
- `PENDING` → cancelled immediately, slot freed
- `CONFIRMED` → cancelled, completed payments marked `REFUNDED`
- Notifications emitted to user (and host if confirmed)

**Errors:** `400` already cancelled/completed

---

## 8. Payments

**Base path:** `/api/v1/payments`

> These are **SSLCommerz callback endpoints**. No user authentication required.

---

### POST /payments/ipn

SSLCommerz IPN (server-to-server callback).

**Auth:** None

**Content-Type:** `application/x-www-form-urlencoded`

| Field | Description |
|---|---|
| `tran_id` | Transaction ID |
| `val_id` | Validation ID |
| `status` | SSLCommerz status |
| `amount` | Paid amount |
| `card_type` | Payment method |

**Behavior:**
1. Looks up payment by `tran_id`
2. Idempotency check (skips if already completed)
3. Validates with SSLCommerz using `val_id`
4. **Success** (`VALID`/`VALIDATED`): marks payment COMPLETED, updates booking, emits notifications
5. **Failure**: marks payment FAILED, cancels booking, frees slot

**Always returns 200** (SSLCommerz requirement).

---

### POST /payments/success

Browser redirect after successful payment.

**Redirects to:** `CLIENT_URL/booking/success?bookingId=<id>`

---

### POST /payments/fail

Browser redirect after failed payment. Cancels booking, frees slot.

**Redirects to:** `CLIENT_URL/booking/fail?bookingId=<id>`

---

### POST /payments/cancel

Browser redirect after user cancels payment. Cancels booking, frees slot.

**Redirects to:** `CLIENT_URL/booking/cancel?bookingId=<id>`

---

## 9. Reviews

**Base path:** `/api/v1/reviews`

**Business Rules:**
- Must have a **COMPLETED booking** for the field to review
- One review per user per field (enforced at DB level)
- Hosts cannot review their own field
- `averageRating` / `totalReviews` on Field are recalculated automatically

---

### POST /reviews

Create a review.

**Auth:** Required (any role)

**Body:**
```json
{
  "fieldId": "uuid",
  "rating": 5,
  "comment": "Excellent ground with great facilities!"
}
```

| Field | Required | Rules |
|---|---|---|
| `fieldId` | ✅ | UUID |
| `rating` | ✅ | Integer 1–5 |
| `comment` | ✅ | 10–1000 chars |

**201 Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fieldId": "uuid",
    "rating": 5,
    "comment": "Excellent ground...",
    "createdAt": "...",
    "user": { "id": "uuid", "name": "Ahmed Karim", "avatar": "..." }
  }
}
```

**Errors:** `403` no completed booking / reviewing own field · `409` already reviewed

---

### GET /reviews/field/:fieldId

Get all reviews for a field. **Public.**

**Auth:** None

**Query:** pagination params

**200 Response:**
```json
{
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 12 },
  "data": {
    "averageRating": 4.5,
    "totalReviews": 12,
    "reviews": [ ... ]
  }
}
```

---

### GET /reviews/my/:fieldId

Get my review for a field (or `null`).

**Auth:** Required

---

### PATCH /reviews/:reviewId

Update a review (owner only). Recalculates field rating.

**Auth:** Required

**Body:**
```json
{ "rating": 4, "comment": "Updated: good but needs better lighting." }
```

At least one field required.

---

### DELETE /reviews/:reviewId

Delete a review. Owner or Admin/Super Admin only.

**Auth:** Required

---

## 10. Notifications

**Base path:** `/api/v1/notifications`

> Generated automatically via EventEmitter for booking/payment events.

### Notification Types

| Type | Trigger |
|---|---|
| `BOOKING_CONFIRMED` | Booking fully paid |
| `BOOKING_CANCELLED` | User cancelled a booking |
| `BOOKING_EXPIRED` | PENDING booking expired (cron) |
| `PAYMENT_SUCCESS` | Payment completed |
| `PAYMENT_FAILED` | Payment failed |
| `NEW_BOOKING` | Host gets a new confirmed booking |
| `NEW_REVIEW` | Host gets a new review |
| `HOST_APPROVED` | Host profile approved |
| `SYSTEM` | System messages |

---

### GET /notifications

Get my notifications with pagination.

**Auth:** Required (any role)

**Query:**

| Param | Values | Description |
|---|---|---|
| `isRead` | `true`, `false` | Filter by read status |
| pagination | — | — |

**200 Response:**
```json
{
  "success": true,
  "meta": { "page": 1, "limit": 10, "total": 8 },
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "BOOKING_CONFIRMED",
        "title": "Booking Confirmed!",
        "body": "Your booking for Green Valley Ground on 2026-04-20 (08:00 - 09:00) is confirmed.",
        "metadata": { "bookingId": "uuid", "fieldId": "uuid" },
        "isRead": false,
        "readAt": null,
        "createdAt": "2026-04-11T12:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /notifications/unread-count

Get unread notification count. Optimized for polling.

**Auth:** Required

**200 Response:** `{ "data": { "unreadCount": 3 } }`

---

### PATCH /notifications/read-all

Mark all notifications as read (atomic).

**Auth:** Required

**200 Response:** `{ "data": { "markedCount": 5 } }`

---

### PATCH /notifications/:id/read

Mark a single notification as read. Idempotent.

**Auth:** Required

**Errors:** `403` not your notification · `404` not found

---

### DELETE /notifications/:id

Delete a notification (owner only).

**Auth:** Required

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `email` | String | Unique |
| `phone` | String? | Unique |
| `name` | String | — |
| `avatar` | String? | Cloudinary URL |
| `role` | UserRole | — |
| `status` | UserStatus | Default: ACTIVE |
| `isVerified` | Boolean | Default: false |
| `isDeleted` | Boolean | Soft delete |
| `createdAt` | DateTime | — |

### Field
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `hostId` | UUID | FK → Host (unique) |
| `name` | String | — |
| `sportType` | SportType | — |
| `facilities` | String[] | — |
| `images` | String[] | Cloudinary URLs |
| `division/district/area/address` | String | — |
| `latitude/longitude` | Float | — |
| `status` | FieldStatus | — |
| `averageRating` | Float | Denormalized |
| `totalReviews` | Int | Denormalized |

### Booking
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `slotId` | UUID | FK → Slot |
| `userId` | UUID | FK → User |
| `totalAmount` | Float | Full slot price |
| `paidAmount` | Float | Paid so far |
| `dueAmount` | Float | Remaining |
| `platformFee` | Float | 5% admin cut |
| `hostAmount` | Float | Host's share |
| `bookingStatus` | BookingStatus | — |
| `expiresAt` | DateTime | PENDING expiry |

### Payment
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `bookingId` | UUID | FK → Booking |
| `amount` | Float | BDT |
| `type` | PaymentType | FULL or PARTIAL |
| `status` | PaymentStatus | — |
| `transactionId` | String | Unique, SSLCommerz tran_id |
| `gatewayPageURL` | String? | SSLCommerz redirect URL |
| `valId` | String? | SSLCommerz validation ID |
| `paymentMethod` | String? | bKash, Nagad, card, etc. |
| `paidAt` | DateTime? | — |

---

## Enums Reference

| Enum | Values |
|---|---|
| `UserRole` | `USER`, `HOST`, `ADMIN`, `SUPER_ADMIN` |
| `UserStatus` | `ACTIVE`, `SUSPENDED`, `BLOCKED`, `INACTIVE` |
| `AuthProvider` | `google`, `credentials` |
| `SportType` | `FOOTBALL`, `CRICKET`, `BADMINTON`, `BASKETBALL`, `TENNIS` |
| `FieldStatus` | `ACTIVE`, `INACTIVE`, `SUSPENDED` |
| `SlotStatus` | `AVAILABLE`, `BOOKED`, `BLOCKED` |
| `BookingStatus` | `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED` |
| `PaymentType` | `FULL`, `PARTIAL` |
| `PaymentStatus` | `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`, `REFUNDED` |
| `NotificationType` | `BOOKING_CONFIRMED`, `BOOKING_CANCELLED`, `BOOKING_EXPIRED`, `PAYMENT_SUCCESS`, `PAYMENT_FAILED`, `NEW_BOOKING`, `NEW_REVIEW`, `HOST_APPROVED`, `SYSTEM` |

---

## Quick Start Example

```javascript
const BASE = 'https://your-server.com/api/v1';

// 1. Register
await fetch(`${BASE}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ahmed', email: 'ahmed@example.com', password: 'secret123', role: 'USER' })
});

// 2. Login
const { data: { accessToken } } = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'ahmed@example.com', password: 'secret123' })
}).then(r => r.json());

const headers = { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' };

// 3. Browse fields
const { data: { fields } } = await fetch(`${BASE}/fields?sportType=FOOTBALL&district=Dhaka`).then(r => r.json());

// 4. Check available slots
const slots = await fetch(`${BASE}/slots/${fields[0].id}?status=AVAILABLE`).then(r => r.json());

// 5. Create booking → redirect to payment gateway
const booking = await fetch(`${BASE}/bookings`, {
  method: 'POST', headers,
  body: JSON.stringify({ slotId: slots.data[0].id, paymentType: 'FULL' })
}).then(r => r.json());
window.location.href = booking.data.paymentUrl;

// 6. After booking completed → leave review
await fetch(`${BASE}/reviews`, {
  method: 'POST', headers,
  body: JSON.stringify({ fieldId: fields[0].id, rating: 5, comment: 'Amazing ground, great facilities!' })
});
```

---

*Documentation generated from source code — Khelaghor v1.0.0 — April 2026*
