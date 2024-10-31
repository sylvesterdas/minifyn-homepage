# MiniFyn - URL Shortener

## Description
MiniFyn is a URL shortening service optimized for the Vercel free tier, targeting software developers in India while serving a global audience. The project features API-first architecture with tiered subscription plans and comprehensive analytics.

## Tech Stack

### Core
* **Framework:** Next.js 14
* **Database:** Vercel Postgres (Free tier)
* **Cache:** Vercel KV (Free tier - Rate limiting, sessions)
* **Authentication:** Session-based with Vercel KV
* **CSS:** Tailwind CSS
* **Package Manager:** pnpm
* **Deployment:** Vercel

### API Architecture
* RESTful API with versioning (v1)
* API key authentication
* Rate limiting per subscription tier
* Feature-based permissions
* Batch operations support
* Response caching with KV store
* Comprehensive error handling

### Database Design
* PostgreSQL with proper indexing
* Efficient batch operations
* Subscription-based model
* Analytics tracking
* Data expiration management

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

### Features
* Version-controlled endpoints
* Comprehensive error handling
* Rate limiting
* Permission-based access
* Batch operations
* Analytics integration

## Subscription Plans

### Free Plan
* **API Features:**
  * Basic API access
  * Rate limit: 500 calls/month
  * Basic analytics
  * Single URL operations
* **URLs:**
  * 10 URLs per day
  * 60-day validity
  * Basic click tracking

### Pro Plan
* **Price:** ₹99/month or ₹999/year
* **API Features:**
  * Full API access
  * Rate limit: 10,000 calls/month
  * Detailed analytics
  * Batch operations
* **URLs:**
  * 50 URLs per day
  * 365-day validity
  * Comprehensive analytics

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
# Core Commands
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

## Resource Optimization
* Aggressive caching with KV store
* Batch database operations
* Response pagination
* Efficient data querying
* Minimal API payload size
* Optimized database indexes

## Recent Updates
1. Implemented API versioning
2. Added permission-based access
3. Enhanced batch operations
4. Improved error handling
5. Added detailed analytics
6. Optimized database queries
7. Enhanced security measures
8. Updated documentation