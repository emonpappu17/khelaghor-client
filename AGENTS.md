<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key differences to watch for:
- **`middleware.ts` → `proxy.ts`** — file is `src/proxy.ts`, named export `proxy`. See `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- **`next lint` → `eslint`** — `npm run lint` runs `eslint` directly, not `next lint`. `next build` no longer runs lint.
- **Turbopack is default** — use `next dev --webpack` / `next build --webpack` if needed.
- **Node.js 20.9+ required** (package.json `engines` not set, but that's the minimum).
- **`cacheComponents: true`** is set in `next.config.ts`.
- **Tailwind v4** — uses `@tailwindcss/postcss` plugin and `@import "tailwindcss"` in CSS, NOT `@tailwind` directives or `tailwind.config.*`.
- **`import "server-only"`** marks server-only modules (see `src/lib/api.ts`).
<!-- END:nextjs-agent-rules -->

# Khelaghor Client — Agent Guide

## Commands

| Script | What it runs |
|--------|-------------|
| `npm run dev` | `next dev` (Turbopack) |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run lint` | `eslint` |

No test framework is configured.

## Architecture

- **App Router** with route groups: `(public)/`, `(auth)/`, `(dashboard)/`.
- **No Route Handlers** — all mutations use Server Actions (`src/actions/`, each file is `"use server"`).
- **Server data fetching** lives in `src/queries/`, called from Server Components.
- **API client** is `src/lib/api.ts` (server-only via `import "server-only"`). Returns raw `Response` so `Set-Cookie` headers can be forwarded.
- **Auth**: JWT tokens verified in-proxy via `jsonwebtoken`. Tokens stored in HTTP-only cookies. Cookie forwarding uses `set-cookie-parser` (`src/lib/cookie.ts`).
- **Role-based routing**: `src/lib/route.config.ts` defines `ROLE_GATES` mapping URL prefixes to allowed roles (`USER`, `HOST`, `ADMIN`, `SUPER_ADMIN`). The `proxy.ts` gates access and redirects unauthorized users to their dashboard.
- **Validation**: Zod schemas in `src/zod/`. Server Actions return `ActionState` objects with `{success, message, data?, errors?, fields?}`.

## Key conventions

- **shadcn/ui style**: `"radix-nova"` (components.json). Default icon library is **hugeicons**, not lucide. Use `shadcn` skill when adding components.
- **Path alias**: `@/*` → `src/*`.
- **CSS**: Tailwind v4 (`@import "tailwindcss"` in `globals.css`) with Material 3 design tokens in `@theme`. Use `cn()` from `@/lib/utils` for class merging.
- **Dark mode**: next-themes with class strategy — root `<html>` is always `className="dark"`.
- **Maps**: `bkoi-gl` (Barikoi GL, Bangladeshi map provider).
- **Forms**: React Hook Form + Zod resolvers.

## Environment

Required vars in `.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

## Project structure

```
src/
├── actions/        # Server Actions (auth, booking, field, host)
├── app/            # App Router pages
│   ├── (auth)/     # login, register, forgot-password, verify-email, reset-password
│   ├── (dashboard)/# user/, host/, admin/, profile/, settings/
│   └── (public)/   # home, fields, about, terms
├── components/
│   ├── layout/     # AppSidebar, etc.
│   ├── modules/    # Feature-specific components
│   └── ui/         # shadcn/ui primitives
├── hooks/
├── lib/            # api.ts, cookie.ts, route.config.ts, utils.ts
├── queries/        # Server data fetchers
├── types/          # Shared TS types
└── zod/            # Zod schemas (auth, field)
proxy.ts            # Auth gating (replaces middleware.ts)
```
