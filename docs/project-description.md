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
* **Payment Processing:** RazorPay
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

## Dashboard Features

### Implemented
* Basic dashboard layout with responsive sidebar
* Account settings management
* Session-based authentication
* User profile management
* Basic analytics view

### In Progress
* URL Management interface
* Enhanced analytics
* API key management
* Subscription management

## Key Features

### Core Functionality
* URL shortening with custom aliases
* QR code generation
* Custom short URL domain (mnfy.in)
* Session-based authentication
* User dashboard

### User Experience
* Responsive design (mobile, tablet, desktop)
* Internationalized landing pages (English/Hindi)
* Clean, minimalist interface
* Dashboard with intuitive navigation

### Security Features
* Session-based authentication
* Secure password hashing
* Protected API endpoints
* Rate limiting on critical endpoints
* HttpOnly session cookies

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
NEXT_PUBLIC_HASHNODE_ACCESS_TOKEN=

# Payment
NEXT_RAZORPAY_KEY_ID=
NEXT_RAZORPAY_KEY_SECRET=
```

## Development Commands
* Run development server: `pnpm run dev`
* Build for production: `pnpm run build`
* Start production server: `pnpm start`
* Run database migrations: `pnpm run migrate`

## Recent Improvements
1. Implemented secure session-based authentication
2. Added dashboard layout with responsive sidebar
3. Created account settings management
4. Added user profile updates
5. Implemented proper database schema
6. Added validation utilities
7. Improved error handling
8. Enhanced security measures
