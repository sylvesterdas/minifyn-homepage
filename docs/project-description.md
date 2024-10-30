# MiniFyn - URL Shortener

## Description
MiniFyn is a URL shortening service designed with a clean, minimalist aesthetic targeting software developers in India while serving a global audience. The project implements internationalization (i18n) for landing pages and offers tiered subscription plans with a focus on API access and developer tools.

## Tech Stack

### Core
* **Frontend & Backend:** Next.js (React)
* **Database:** PostgreSQL (Vercel Postgres)
* **Cache Layer:** Vercel KV (Rate limiting, API keys, Sessions)
* **State Management:** React Context + Hooks
* **Authentication:** Session-based (Vercel KV)
* **CSS Framework:** Tailwind CSS
* **Package Manager:** pnpm
* **Deployment:** Vercel

### External Services
* **Database:** Vercel Postgres
* **Session Store:** Vercel KV
* **Payment Processing:** Razorpay (Subscriptions & Webhooks)
* **Blog Platform:** Hashnode Headless API
* **Security:** reCAPTCHA v3

### Development Tools
* **Database Migration:** db-migrate
* **Content Management:** Hashnode
* **API Documentation:** Custom Documentation
* **Package Management:** pnpm with strict dependency management

## Authentication System
* Session-based authentication using Vercel KV
* HttpOnly cookies for session management
* Session expiry after 30 days
* Automatic session cleanup
* Password hashing using bcrypt
* Email validation with regex patterns
* Strong password requirements
* Protection against brute force attacks
* Rate limiting on critical endpoints

## API System
* API key based authentication
* Rate limiting per subscription tier
* Usage tracking with KV store
* Domain verification for web requests
* Security middleware stack
* Anti-abuse measures
* Subscription-based limits
* Comprehensive error handling

## Dashboard Features

### Implemented
* Basic dashboard layout with responsive sidebar
* Account settings management
* Session-based authentication
* User profile management
* Basic analytics view
* Subscription plans with Razorpay
* API key management
* Usage monitoring

### In Progress
* Enhanced URL Management interface
* Advanced analytics
* Custom domain support
* Bulk operations

## Key Features

### Core Functionality
* URL shortening with custom aliases (Pro)
* QR code generation
* Custom short URL domain (mnfy.in)
* API access with rate limiting
* User dashboard
* Subscription management
* Usage analytics

### User Experience
* Responsive design
* Internationalized landing pages (English/Hindi)
* Clean, minimalist interface
* Intuitive dashboard navigation
* Seamless payment flow
* API documentation

### Security Features
* Session-based authentication
* Secure password hashing
* Protected API endpoints
* Rate limiting
* HttpOnly session cookies
* Webhook signature verification
* Payment verification
* Domain verification
* Malicious URL detection

## Subscription Plans

### Free Registered Account
* Name: "LinkFree User"
* Features:
  * Personal dashboard
  * Basic link analytics
  * Limited API access
  * Basic URL management
* Limits:
  * 10 URLs per day
  * 60-day link validity
  * 500 API calls per month
  * 2 API keys maximum

### Pro Account
* Name: "LinkPro User"
* Price: ₹99/month or ₹999/year
* Features:
  * All Free account features
  * Advanced link analytics
  * Custom link aliases
  * Bulk URL shortening
  * Full API access
  * Priority support
* Limits:
  * 50 URLs per day
  * 1-year link validity
  * 10,000 API calls per month
  * 5 API keys maximum

## Payment Integration
* Razorpay subscription-based billing
* Automatic payment processing
* Webhook integration for subscription lifecycle
* Invoice generation
* Payment verification
* Subscription status management
* Automatic renewal handling
* Refund processing

## Development Commands
```bash
# Development
pnpm dev           # Run development server
pnpm build         # Build for production
pnpm start         # Start production server

# Database
pnpm migrate       # Run database migrations
pnpm migrate:down  # Rollback migrations

# Testing
pnpm test         # Run tests
pnpm lint         # Run linter
```

## Environment Variables
```env
# Core
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=
VERCEL_URL=

# Session Management
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Blog
NEXT_HASHNODE_ACCESS_TOKEN=

# Payment
NEXT_RAZORPAY_KEY_ID=
NEXT_RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Security
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
NEXT_RECAPTCHA_SECRET_KEY=
```

## Recent Improvements
1. Implemented API key management
2. Added domain verification for web requests
3. Enhanced security middleware stack
4. Implemented subscription-based rate limiting
5. Added usage tracking
6. Improved error handling
7. Enhanced security measures
8. Added malicious URL detection