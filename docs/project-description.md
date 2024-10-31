# MiniFyn - URL Shortener

## Description
MiniFyn is a URL shortening service optimized for the Vercel free tier, targeting software developers in India while serving a global audience. The project features API-first architecture with tiered subscription plans and comprehensive analytics.

## Tech Stack

### Core
* **Framework:** Next.js 14
* **Database:** Vercel Postgres (Free tier)
* **Cache:** Vercel KV (Free tier - Rate limiting, sessions, usage limits)
* **Authentication:** Session-based with Vercel KV
* **CSS:** Tailwind CSS with shadcn/ui
* **Package Manager:** pnpm
* **Deployment:** Vercel

### Caching & Rate Limiting
* URL data caching with 1-hour TTL
* Click count buffering (update DB every 10 clicks)
* Usage limits cached for 1 minute
* KV-based rate limiting
* Efficient batch operations

### Subscription System
* Rolling 24-hour URL creation limits
* Plan-based feature restrictions
* Cached limit checks
* Automated cleanup
* Usage monitoring
* KV-based temporary storage

## Subscription Plans

### Free Plan
* **URL Features:**
  * 10 URLs per rolling 24 hours
  * 60-day URL retention
  * Basic analytics
  * Simple dashboard

### Pro Plan (₹99/month or ₹999/year)
* **URL Features:**
  * 50 URLs per rolling 24 hours
  * 365-day URL retention
  * Comprehensive analytics
  * Advanced dashboard
  * Link groups & folders
  * Custom slugs

## Implementation Details

### URL Limit Tracking
* Uses rolling 24-hour window
* Cached in KV store for performance
* Subscription type determines limits
* Real-time limit checking
* Efficient DB queries
* Automatic cache invalidation

### Database Design
* Subscription limits in dedicated table
* Efficient URL tracking
* Rolling window calculations
* Proper indexing
* Automatic cleanup

## Maintenance System
* Daily cron jobs for cleanup
* Automated session cleanup
* Analytics buffer flushing
* URL expiration management
* Database optimization

## Authentication System
* Session-based authentication (Vercel KV)
* API key management
* Feature-based permissions
* Rate limiting per subscription
* HttpOnly cookies
* Password hashing (bcrypt)
* Anti-abuse measures

## API System v1

### Core Endpoints
```
POST /api/v1/urls
- Create single/batch URLs
- Rate limited by plan
- Supports metadata

GET/DELETE /api/v1/urls/{shortCode}
- URL management
- Basic analytics included

POST /api/v1/urls/batch
- Batch operations (get/delete)
- Pro plan feature

GET /api/v1/analytics/{shortCode}
- Detailed analytics
- Plan-based data access
```

## Subscription Plans

### Free Plan
* **URL Features:**
  * 10 URLs per day
  * 60-day URL retention
  * Basic analytics
  * Simple dashboard
* **API Features:**
  * Basic API access
  * Rate limit: 500 calls/month
  * Single URL operations

### Pro Plan (₹99/month or ₹999/year)
* **URL Features:**
  * 50 URLs per day
  * 365-day URL retention
  * Comprehensive analytics
  * Advanced dashboard
* **API Features:**
  * Full API access
  * Rate limit: 10,000 calls/month
  * Batch operations
  * Priority support

## Resource Optimization
* Daily cleanup of expired URLs
* Analytics buffer system
* Efficient database queries
* Response caching
* Automated maintenance
* KV store optimization

## Security Features
* API key authentication
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

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_RECAPTCHA_SECRET_KEY=
```