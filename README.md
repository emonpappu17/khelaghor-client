# Khelaghor Client

The frontend application for **Khelaghor**, a sports field booking platform built for Bangladesh. This is the client-side interface through which users browse fields, book slots, and manage their activity — and through which hosts and admins manage the platform.

---

## Live Demo

[https://khelaghor-client.vercel.app](https://khelaghor-client.vercel.app)

**Backend API:** [https://khelaghor-server-m9i5.onrender.com](https://khelaghor-server-m9i5.onrender.com)

---

## Project Overview

This is the frontend counterpart to the Khelaghor server. It is built with Next.js 16 (App Router) and communicates with the backend entirely through Next.js Server Actions and server-side data fetching — keeping API calls and authentication logic on the server, away from the client.

The application supports four roles: **User**, **Host**, **Admin**, and **Super Admin**. Each role has its own dashboard and a dedicated set of pages and actions. Route access is enforced via middleware, and users are automatically redirected based on their role when they land on a protected page they are not allowed to access.

> **Note:** This is an MVP. The core features are functional and the architecture is intentional, but the codebase is actively evolving. Visual polish, performance optimization, accessibility improvements, and additional features will be added over time.

---

## Key Features

**Public Pages**
- Landing page with featured fields, sport categories, how-it-works section, and a call-to-action
- Full fields listing page with search, sport type filter, and division filter
- Individual field detail page with image gallery, field info, available slot listing, and a booking flow
- Reviews section per field with average rating display
- About page and Terms page

**Authentication**
- Email and password registration and login
- Google OAuth 2.0 sign-in
- Email OTP verification on registration
- Forgot password flow with OTP and reset form
- All forms are validated client-side with Zod and handled via Server Actions

**User Dashboard**
- View and manage personal bookings with status filtering
- View submitted reviews
- Notifications page (read/unread management)
- Profile and settings pages

**Host Dashboard**
- View and manage their field (create, update, deactivate)
- Manage time slots for the field
- View all bookings made for their field

**Admin Dashboard**
- Overview page with platform statistics
- Manage all users (view, update status and role)
- Manage host applications (view, approve)
- Manage all fields across the platform
- Manage all bookings with advanced filtering
- Manage all reviews

**Authentication & Routing**
- Middleware-level route protection with role-based access control
- Authenticated users are redirected away from auth pages
- Unauthenticated users are redirected to login with a callback URL preserved
- Users accessing a route they are not authorized for are redirected to their own dashboard

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React, HugeIcons |
| Forms | React Hook Form + Zod |
| Server Actions | Next.js Server Actions (mutations and data fetching) |
| Auth Handling | JWT verification in middleware and server-side cookies |
| Maps | Barikoi GL (bkoi-gl) |
| Notifications | Sonner (toast notifications) |
| Theming | next-themes |
| Date Utilities | date-fns |
| OTP Input | input-otp |

---

## Project Structure

```
src/
├── actions/          # Next.js Server Actions for mutations (auth, booking, field, host)
├── app/
│   ├── (auth)/       # Auth pages: login, register, forgot-password, verify-email, reset-password
│   ├── (dashboard)/  # Protected dashboard pages for user, host, and admin roles
│   └── (public)/     # Public pages: home, fields listing, field detail, about, terms
├── components/
│   ├── layout/       # App shell components (AppSidebar, etc.)
│   ├── modules/      # Feature-specific UI components grouped by domain
│   └── ui/           # Base shadcn/ui primitives
├── hooks/            # Custom React hooks
├── lib/              # API fetch helper, cookie utilities, route config, sidebar config
├── queries/          # Server-side data fetching functions (fields, bookings, reviews, etc.)
├── types/            # Shared TypeScript types
└── zod/              # Zod validation schemas
```

The dashboard is shared across roles. Navigation items and accessible routes are determined by the user's role at runtime.

---

## Installation

**Prerequisites:** Node.js 18+ and the Khelaghor backend server running locally (or pointed to a deployed instance).

```bash
# 1. Clone the repository
git clone https://github.com/emonpappu17/khelaghor-client.git
cd khelaghor-client

# 2. Install dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Backend API base URL
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1

# JWT secrets — must match the values used in the backend
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

The JWT secrets are used server-side in the middleware to verify tokens without making a network request to the backend on every page load.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## Current Status

This is an MVP. The primary goal of this first version was to build a working, end-to-end application with clean architecture and clearly separated concerns. That goal has been met.

That said, there is a clear list of things that will be improved as the project continues:

- **Performance:** Some pages can be further optimized through better caching strategies, lazy loading, and reduced bundle size
- **Code quality:** Certain components will be refactored and broken down further as the codebase grows
- **UI/UX:** The visual design is functional but will receive further refinement, better responsiveness on edge-case screen sizes, and more consistent spacing and typography
- **Accessibility:** ARIA attributes, keyboard navigation, and screen reader support are minimal at this stage and will be improved
- **Error handling:** Error boundary coverage and user-facing error messages will be made more consistent across all pages
- **Bug fixes:** Edge cases that surface during real usage will be addressed on an ongoing basis

The codebase is not presented as perfect. It is presented as a genuine, functional starting point with a clear path forward.

---

## Roadmap

Planned additions tied to the backend roadmap:

- **Real-time notifications** using Socket.IO — replacing the current polling-based notification page
- **Tournament management** interface for hosts to create and manage tournaments
- **Player matchmaking** — a UI for finding other players to fill remaining spots in a booked slot
- **Opponent/team finder** — a feature for users to post or respond to game invites
- **Payment refund interface** — admin and user-facing UI for managing refund requests

---

## Contributing

This is a personal project and not currently open for external contributions. However, feedback and suggestions are welcome via GitHub Issues.

---

## License

All rights reserved. This project is not open-source. Unauthorized use, distribution, or modification is prohibited.
