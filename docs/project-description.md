## Project Name: MiniFyn

## Description

MiniFyn is a URL shortening service designed with a clean, minimalist aesthetic. It primarily targets software developers in India but caters to a global audience. The project implements internationalization (i18n) with support for English and Hindi, and offers tiered subscription plans for enhanced features.

## Tech Stack

* **Frontend & Backend:** Next.js (React)
* **Database:** PostgreSQL (Vercel Postgres)
* **State Management:** React Hooks
* **CSS Framework:** Tailwind CSS
* **Package Manager:** pnpm
* **Deployment:** Vercel
* **Authentication:** Custom email/password
* **Payment Processing:** RazorPay
* **Database Migration:** db-migrate
* **Blog Platform:** Hashnode Headless API
* **Content Management:** Hashnode

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
* RazorPay integration for secure payment processing
* Blog with developer-focused content
* Comprehensive features page
* Clear pricing page with plan comparison

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

## Blog Implementation

* **Platform:** Hashnode Headless CMS
* **Integration:** Direct Next.js integration via GraphQL API
* **URL Structure:** /blog (integrated path)
* **Features:**
  * SEO-optimized content
  * Developer-focused articles
  * Integrated navigation
  * Category-based organization
  * Tag support
  * Author profiles
  * Responsive design
* **Content Types:**
  * Tutorials
  * Best Practices
  * API Guides
  * Use Cases
  * Product Updates

## Color Scheme

* Primary: #2C3E50 (Deep Blue-Gray)
* Secondary: #3498DB (Bright Blue)
* Light Gray: #F4F6F8
* Medium Gray: #E0E4E8
* Dark Gray: #4A4A4A
* Teal: #1ABC9C
* Coral: #E74C3C

## Environment Variables

```env
# Core
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=
JWT_SECRET=

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

## Implementation Notes

1. **Blog Integration:**
   * Uses Hashnode Headless API for content management
   * Integrated directly into Next.js routing
   * Custom styling matching MiniFyn's design
   * Fallback content for early stages

2. **SEO Considerations:**
   * Proper meta tags implementation
   * Structured data for blog posts
   * Canonical URLs
   * Optimized for social sharing

3. **Performance:**
   * Static generation with incremental updates
   * Image optimization
   * Efficient data fetching
   * Response caching