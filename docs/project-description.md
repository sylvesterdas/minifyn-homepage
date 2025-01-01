# MiniFyn - URL Shortener

## Description

MiniFyn is a URL shortening service optimized for the Vercel free tier, targeting software developers in India while serving a global audience. The project features API-first architecture with comprehensive analytics.

## Tech Stack

### Core

* **Framework:** Next.js 14
* **Database:** Vercel Postgres (Free tier)
* **Cache:** Vercel KV (Free tier - Rate limiting, sessions, usage limits)
* **Authentication:** Session-based with Vercel KV
* **Analytics:** Google Analytics 4
* **CSS:** Tailwind CSS with shadcn/ui
* **Theme:** next-themes with dark mode by default
* **Package Manager:** pnpm
* **Deployment:** Vercel
* **Email:** Zoho SMTP with Nodemailer

### Infrastructure

* URL data caching with 1-hour TTL
* Click count buffering (update DB every 10 clicks)
* Usage limits cached for 1 minute
* KV-based rate limiting
* Efficient batch operations

### Features

* User Interface
  * Dark mode by default
  * System theme detection
  * Persistent theme preferences
  * Zero-flash theme switching
  * Responsive design
  * i18n support (English, Hindi)

* Free Plan Features
  * 15 URLs per rolling 24 hours
  * 90-day URL retention
  * Basic analytics
  * Simple dashboard
  * API access (planned)

### Analytics Implementation

* GA4 implemented on public pages
* Core event tracking:
  * Basic events (page_view, scroll, user_engagement)
  * URL shortening success/failure
  * QR code generation and downloads
  * Signup journey with source tracking
  * Login events with error tracking
  * Pricing page interactions
* Privacy-focused setup
* Dashboard analytics pending implementation

### Performance Optimization

* Theme persistence via localStorage
* Zero client/server hydration mismatch
* Unified color system for light/dark modes
* Error tracking (planned)
* Resource usage monitoring (planned)
* Alert system (planned)

## Security Features

* API key authentication (planned)
* Permission-based access
* Rate limiting
* Request validation
* SQL injection protection
* XSS protection
* CORS configuration

## Development Commands

```bash
# Development
pnpm dev           # Development server
pnpm build         # Production build
pnpm start         # Production server
pnpm migrate       # Run migrations
pnpm lint          # Run linter
```

## Environment Variables

```env
# Core
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=
VERCEL_URL=

# KV Store
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Analytics
NEXT_PUBLIC_GA_ID=

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_RECAPTCHA_SECRET_KEY=

# Email
EMAIL_USER=
EMAIL_APP_PASSWORD=
EMAIL_FROM=
```

## Resource Optimization

* Daily cleanup of expired URLs
* Analytics buffer system
* Efficient database queries
* Response caching
* Automated maintenance
* KV store optimization

## Design System

* Light/Dark color palettes
* Primary: Blues & Grays
* Surface colors: White to Dark
* Interactive elements: Consistent states
* Text hierarchy: WCAG AA compliant
* Semantic color naming
* Interactive state hierarchy
* Theme-aware component design
