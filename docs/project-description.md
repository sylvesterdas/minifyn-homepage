# project-description.md
# MiniFyn - URL Shortener

## Description
MiniFyn is a URL shortening service designed with a clean, minimalist aesthetic. It primarily targets software developers in India but caters to a global audience. The project implements internationalization (i18n) for landing pages with support for English and Hindi, and offers tiered subscription plans for enhanced features.

## Tech Stack

### Core
* **Frontend & Backend:** Next.js (React)
* **Database:** PostgreSQL (Vercel Postgres)
* **State Management:** React Context + Hooks
* **Authentication:** Session-based (Vercel KV)
* **CSS Framework:** Tailwind CSS
* **Package Manager:** pnpm
* **Deployment:** Vercel

### Services
* **Database:** Vercel Postgres
* **Session Store:** Vercel KV
* **Payment Processing:** Razorpay
* **Blog Platform:** Hashnode Headless API

### Development Tools
* **Database Migration:** db-migrate
* **Content Management:** Hashnode
* **API Documentation:** Swagger UI

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

## Dashboard Features

### Implemented
* Basic dashboard layout with responsive sidebar
* Account settings management
* Session-based authentication
* User profile management
* Basic analytics view
* Subscription plans with Razorpay integration

### In Progress
* Enhanced URL Management interface
* Advanced analytics
* API key management
* Subscription management UI

## Key Features

### Core Functionality
* URL shortening with custom aliases
* QR code generation
* Custom short URL domain (mnfy.in)
* Session-based authentication
* User dashboard
* Subscription management with Razorpay

### User Experience
* Responsive design (mobile, tablet, desktop)
* Internationalized landing pages (English/Hindi)
* Clean, minimalist interface
* Dashboard with intuitive navigation
* Seamless payment flow

### Security Features
* Session-based authentication
* Secure password hashing
* Protected API endpoints
* Rate limiting on critical endpoints
* HttpOnly session cookies
* Webhook signature verification
* Payment verification

## Subscription Plans

### Free Registered Account
* Name: "LinkFree User"
* Features:
  * Personal dashboard
  * Basic link analytics
  * Limited API access
* Limits:
  * 10 URLs per day
  * 60-day link validity
  * 500 API calls per month

### Pro Account
* Name: "LinkPro User"
* Price: ₹99/month or ₹999/year
* Features:
  * All Free account features
  * Advanced link analytics
  * Custom link aliases
  * Bulk URL shortening
  * Full API access
* Limits:
  * 50 URLs per day
  * 1-year link validity
  * 10,000 API calls per month

## Payment Integration
* Razorpay subscription-based billing
* Automatic payment processing
* Webhook integration for subscription lifecycle
* Invoice generation
* Payment verification
* Subscription status management

## Environment Variables
```env
# Core
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=

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

## Development Commands
* Run development server: `pnpm run dev`
* Build for production: `pnpm run build`
* Start production server: `pnpm start`
* Run database migrations: `pnpm run migrate`

## Recent Improvements
1. Implemented Razorpay subscription integration
2. Added invoice management
3. Implemented webhook handling
4. Enhanced subscription lifecycle management
5. Added payment verification
6. Improved error handling
7. Enhanced security measures
8. Added rate limiting