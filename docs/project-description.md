## Project Name: MiniFyn

## Description

MiniFyn is a URL shortening service designed with a clean, minimalist aesthetic. It primarily targets software developers in India but caters to a global audience as well. The project implements internationalization (i18n) with support for English and Hindi, and offers tiered subscription plans for enhanced features.

## Tech Stack

* **Frontend & Backend:** Next.js (React)
* **Database:** PostgreSQL (Vercel Postgres)
* **State Management:** React Hooks
* **CSS Framework:** Tailwind CSS
* **Package Manager:** pnpm
* **Deployment:** Vercel
* **Authentication:** Implemented (email/password)
* **Payment Processing:** PayU
* **Database Migration:** db-migrate

## Key Features

* URL shortening with custom aliases
* QR code generation
* Custom short URL domain (mnfy.in)
* Responsive design (mobile, tablet, desktop)
* Internationalization (i18n) with English and Hindi support
* User authentication and account management
* Tiered subscription plans (Free, Pro)
* Detailed analytics for shortened URLs
* API access for Pro users
* PayU integration for secure payment processing

## Subscription Plans

### Free Registered Account
* Name: "LinkFree User"
* Features:
  * Personal dashboard
  * Basic link analytics
  * Limited API access
* Limits:
  * 10 URLs per hour
  * 50 URLs per day
  * 60-day link validity
  * 500 API calls per month

### Pro Account
* Name: "LinkPro User"
* Price: ₹499/month or ₹4,999/year (Save ₹989)
* Features:
  * All Free account features
  * Advanced link analytics
  * Custom link aliases
  * Bulk URL shortening
  * Full API access
* Limits:
  * 50 URLs per hour
  * 250 URLs per day
  * 1-year link validity
  * 10,000 API calls per month

## Color Scheme

* Primary: #2C3E50 (Deep Blue-Gray)
* Secondary: #3498DB (Bright Blue)
* Light Gray: #F4F6F8
* Medium Gray: #E0E4E8
* Dark Gray: #4A4A4A
* Teal: #1ABC9C
* Coral: #E74C3C

## Design Concepts

* Minimalist and clean interface
* Responsive design with a mobile-first approach
* Use of whitespace for clarity and focus
* Gradient backgrounds for visual interest (e.g., banner area)
* Subtle animations and transitions for improved user experience
* Clear typography hierarchy:
    * Headings: Bold, larger sizes
    * Body text: Regular weight, comfortable reading size
* Rounded corners on buttons and input fields
* Use of icons for visual cues and improved usability
* Consistent padding and margin for balanced layout

## Implemented Features

1. Homepage with responsive design
2. URL shortening functionality with PostgreSQL backend
3. QR code generation
4. Internationalization (i18n) setup for English and Hindi
5. SEO optimizations including meta tags and structured data
6. Mobile-friendly navigation with hamburger menu
7. User authentication (signup, login, password reset)
8. User dashboard for managing shortened URLs
9. Subscription management with PayU integration
10. Basic and advanced analytics for shortened URLs
11. API access for Pro users

## Database Structure

The project uses a PostgreSQL database with the following main tables:
* users
* short_urls
* analytics
* subscription_types
* features
* subscription_features
* subscription_limits
* user_subscriptions
* invoices

Refer to the ERD diagram for detailed relationships between these tables.

## Environment Variables

* DATABASE_URL: PostgreSQL connection string
* NEXT_PUBLIC_BASE_URL: Base URL for shortened links (e.g., 'https://mnfy.in')
* PAYU_MERCHANT_KEY: PayU merchant key for transaction processing
* PAYU_MERCHANT_SALT: PayU merchant salt for security
* PAYU_MODE: PayU mode (test or production)
* JWT_SECRET: Secret for JSON Web Token generation and verification
* NEXT_PUBLIC_API_URL: URL for the API endpoints

## Next Steps

1. Implement more advanced analytics features
2. Add social media integration for sharing shortened URLs
3. Develop a browser extension for quick URL shortening
4. Implement team collaboration features for Pro users
5. Add support for custom domains (for enterprise clients)
6. Enhance API documentation and create SDKs for popular programming languages
7. Implement A/B testing for landing pages
8. Set up automated testing and CI/CD pipeline
9. Migrate payment processing from Stripe to PayU
10. Update subscription management logic for PayU integration

## Development Commands

* Run development server: `pnpm run dev`
* Build for production: `pnpm run build`
* Start production server: `pnpm start`
* Run database migrations: `pnpm run migrate`