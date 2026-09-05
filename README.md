# wrapsy_love

Build a Production-Grade Full-Stack Gift Hamper E-Commerce Platform

You are a senior product architect, UX designer, UI engineer, full-stack engineer, database architect, DevOps engineer, and e-commerce expert.

Build a complete, production-ready, scalable e-commerce platform for a modern Gift Hamper Store.

The business sells:

Ready-made gift hampers

Customizable gift hampers

Budget-friendly hampers

Premium hampers

Personalized gifts

Festival/occasion-based hampers

Corporate gifting

Birthday/anniversary/wedding/reception/thank-you hampers

Custom gift boxes

Add-on products

Personalized messages/cards

The application should feel like a premium modern D2C e-commerce brand, while providing the functionality and operational capabilities expected from platforms such as Amazon/Flipkart.

Do NOT copy Amazon/Flipkart's UI. Take inspiration from their functionality, usability, search, filtering, checkout, order management, account management, and operational workflows, while creating a unique premium visual identity for the gift brand.

1. CORE PRODUCT REQUIREMENT

Create TWO major applications inside one scalable project:

A. Customer-Facing Storefront

A beautiful, fast, responsive e-commerce website where users can:

Browse products without creating an account

Search products

Filter products

Sort products

View categories

View collections

View product details

Customize hampers

Add products to cart

Modify cart

Save products

Apply coupons

Checkout

Select delivery address

Select delivery date/time where supported

Make payment

Track orders

Write reviews

Upload review photos/videos

Manage profile

View previous orders

Reorder products

Contact support

B. Admin Dashboard

A powerful business management system where administrators can control practically every aspect of the e-commerce platform.

Admin should NOT need to modify code for normal business operations.

Everything commonly required for running the store should be manageable through the admin panel.

2. IMPORTANT UX REQUIREMENT — GUEST SHOPPING

Users should be able to use the website immediately.

DO NOT force users to register/login when they first visit the website.

Guest users should be able to:

Browse products

Search

Filter

View product details

Customize hampers

Add products to cart

Add/remove wishlist items where technically possible

Continue shopping

View cart

Only require authentication when necessary, especially:

Checkout

When the user clicks:

Proceed to Checkout

show:

Continue as guest

Login/Register

If guest checkout is supported, allow the user to complete the purchase using email/phone and delivery information without creating a permanent account.

After checkout, provide the option:

"Create an account to easily track future orders."

Authentication should feel frictionless.

3. TECHNOLOGY STACK

Use a modern, production-ready TypeScript stack.

Frontend

Next.js using the latest stable version

React

TypeScript

Tailwind CSS

Modern CSS architecture

shadcn/ui or equivalent accessible component system

Framer Motion / Motion for animations

React Hook Form

Zod

TanStack Query where appropriate

Zustand or another lightweight client-state solution where appropriate

Use:

Server Components wherever beneficial

Client Components only when necessary

Server Actions where appropriate

Route Handlers/API endpoints where appropriate

Streaming/loading states

Suspense

Optimistic UI where appropriate

Backend

Use Next.js full-stack architecture initially.

Structure the backend cleanly so it can later be extracted into independent services if the business grows.

Use:

TypeScript

REST APIs and/or well-structured server actions

Service layer

Repository/data-access layer

Validation layer

Authentication layer

Authorization/RBAC layer

Centralized error handling

Logging

Rate limiting

Database

Use:

PostgreSQL

Prisma ORM

Design the database for scalability and proper relational integrity.

Authentication

Use a production-ready authentication solution.

Support:

Email/password

Google OAuth

OTP/phone authentication where practical

Guest checkout

Session management

Password reset

Email verification

Role-based access

Roles should include at minimum:

CUSTOMER

ADMIN

SUPER_ADMIN

STAFF

INVENTORY_MANAGER

ORDER_MANAGER

CONTENT_MANAGER

Permissions should be granular.

4. PROJECT ARCHITECTURE

Create a clean architecture similar to:

src/
  app/
    (storefront)/
    (auth)/
    admin/
    api/

  components/
    ui/
    layout/
    product/
    cart/
    checkout/
    reviews/
    account/
    admin/

  features/
    products/
    categories/
    cart/
    checkout/
    orders/
    payments/
    reviews/
    users/
    inventory/
    coupons/
    delivery/
    notifications/

  lib/
    auth/
    db/
    payments/
    storage/
    email/
    shipping/
    validation/
    permissions/
    analytics/

  server/
    services/
    repositories/
    actions/

  hooks/
  types/
  utils/
  config/


Keep business logic separate from UI.

Do not put database queries directly throughout React components.

5. BRAND / DESIGN DIRECTION

The website should look like a premium modern gift brand.

Visual direction:

Elegant

Warm

Minimal

Premium

Emotional

Modern

Trustworthy

Festive without looking childish

Excellent whitespace

Strong typography

Beautiful product photography

Subtle gradients

Soft shadows

Rounded cards

Premium micro-interactions

Create a cohesive design system.

Define:

Typography scale

Spacing system

Border radius system

Shadows

Color tokens

Button variants

Input styles

Card styles

Badge styles

Modal styles

Toast styles

Animation tokens

Avoid excessive gradients, excessive glassmorphism, unnecessary effects, or overly flashy animations.

The design must remain professional and usable.

6. RESPONSIVE DESIGN

The entire platform must be fully responsive.

Support:

Mobile

Tablet

Laptop

Desktop

Large desktop

Mobile experience is extremely important.

Create a mobile-first navigation experience.

On mobile include:

Bottom navigation where appropriate

Sticky cart CTA where appropriate

Mobile filter drawer

Mobile search experience

Touch-friendly controls

Swipeable product galleries

Mobile-friendly checkout

Mobile-friendly admin where practical

7. ANIMATION SYSTEM

Use animations intentionally.

Do NOT animate everything.

Use subtle animations for:

Page transitions

Product cards

Product image hover

Add-to-cart

Cart drawer

Search suggestions

Filter drawer

Modal opening

Wishlist interactions

Toast notifications

Checkout steps

Order status

Skeleton loading

Dropdowns

Navigation

Review submission

Admin dashboard interactions

Examples:

Product image gently scales on hover

Add-to-cart button provides tactile feedback

Cart count animates when item count changes

Wishlist heart animates on selection

Order status timeline animates when progressing

Cards fade/slide in only when beneficial

Animations must respect:

prefers-reduced-motion.

8. STOREFRONT PAGES

Create all major pages.

Home

Sections should include:

Hero

Featured hampers

Shop by occasion

Shop by budget

Best sellers

New arrivals

Personalized hampers

Trending products

Festival collections

Customer reviews

Instagram/social-style gallery

Why choose us

Delivery information

FAQ

Newsletter

Footer

Admin should be able to reorder, enable/disable, and modify homepage sections.

9. PRODUCT CATALOG

Create a complete catalog system.

Product fields should support:

Product ID

SKU

Name

Slug

Short description

Full description

Category

Subcategory

Collections

Tags

Images

Videos

Thumbnail

Price

Compare-at price

Discount

Tax

Stock

Low-stock threshold

Weight

Dimensions

SKU/barcode where needed

Brand

Occasion

Budget range

Product type

Customizable flag

Featured flag

Bestseller flag

New arrival flag

Active/inactive status

SEO title

SEO description

SEO keywords

Structured metadata

Support product variants.

Examples:

Small / Medium / Large

₹499 / ₹999 / ₹1499

Different colors

Different packaging

Different quantities

10. CUSTOM HAMper BUILDER

This is one of the most important features.

Create a beautiful interactive:

"Build Your Own Hamper"

experience.

Users should be able to:

Select hamper size

Select base box/basket

Select products

See available products

See remaining capacity

See price update in real time

Add personalized message

Add greeting card

Choose wrapping

Choose ribbon/theme where applicable

Add name/custom text

Preview their hamper

See total price

Add customized hamper to cart

Example:

Choose your budget
₹499
₹999
₹1499
₹2499
₹4999+

Choose your occasion
Birthday
Anniversary
Wedding
Corporate
Thank You
Festival
Custom

Choose your items
Chocolate
Candle
Perfume
Dry Fruits
Teddy
Coffee
Tea
Plant
Skincare
Accessories

Personalize
Message
Card
Wrapping
Name


The pricing engine must dynamically calculate the final price.

Admin should be able to configure:

Available components

Component prices

Component categories

Maximum/minimum components

Budget ranges

Customization rules

Inventory availability

11. SEARCH

Build powerful search.

Support:

Product name search

SKU search

Category search

Tags

Occasion

Budget

Product attributes

Search UI should include:

Instant suggestions

Recent searches

Popular searches

Product previews

Categories

No-results recommendations

Optimize search architecture so it can later migrate to:

Elasticsearch

OpenSearch

Algolia

Meilisearch

without rewriting the storefront.

12. FILTERING

Product listing pages should support:

Price

Category

Occasion

Rating

Availability

Customizable

Bestseller

New arrival

Brand

Size

Color

Product type

Delivery availability

Discount

Support multiple filters simultaneously.

Filters should update the URL so pages are shareable.

Example:

/gifts?occasion=birthday&price=500-1500&rating=4


13. PRODUCT DETAILS PAGE

Create a premium product detail page.

Include:

Image gallery

Video

Product title

Rating

Review count

Price

Discount

Stock status

Delivery availability checker

Product description

Specifications

Ingredients/materials where applicable

What's included

Customization options

Quantity

Add to cart

Buy now

Wishlist

Share

Reviews

Customer images

Customer videos

Related products

Frequently bought together

Recently viewed

Recommended products

14. DELIVERY / PINCODE SYSTEM

Users should be able to enter their:

Pincode

City

State

Show:

Delivery available/unavailable

Estimated delivery date

Delivery charges

Free delivery eligibility

Same-day delivery if supported

Express delivery if supported

Design the delivery system so it can integrate with shipping providers later.

Create an abstraction such as:

ShippingProvider
  calculateShipping()
  createShipment()
  cancelShipment()
  getTracking()
  getLabel()


Do not hard-code one shipping company throughout the application.

15. CART

Create a modern cart experience.

Support:

Add/remove products

Quantity updates

Variant selection

Custom hamper items

Personalized products

Coupon

Gift wrapping

Delivery estimate

Tax

Shipping

Discounts

Final total

Use a slide-out cart drawer on desktop where appropriate.

Cart must persist between sessions.

Handle:

Guest cart

Logged-in cart

Cart merging after login

16. WISHLIST

Allow customers to:

Add/remove wishlist products

Move wishlist product to cart

View wishlist

Share wishlist where practical

Guest wishlist can use local storage.

Authenticated wishlist should persist server-side.

17. CHECKOUT

Create a very polished checkout.

Steps:

Cart
↓
Address
↓
Delivery
↓
Payment
↓
Confirmation


Support:

Guest checkout

Login

Register

Saved addresses

New address

Phone number

Email

Delivery instructions

Gift message

Coupon

Delivery method

Payment method

Order summary

Avoid unnecessary checkout fields.

Make checkout fast.

18. PAYMENT SYSTEM

Create a payment abstraction.

Support integration with payment providers such as:

Razorpay

Stripe

The architecture should allow adding another provider later.

Support:

Card

UPI

Net banking

Wallets

Cash on delivery where applicable

Implement:

Payment initiation

Payment verification

Webhook handling

Failed payments

Retry payment

Refunds

Partial refunds where supported

Payment status tracking

Idempotency

NEVER trust the client-side payment amount.

Always calculate final order totals server-side.

19. ORDER MANAGEMENT

Create complete order lifecycle management.

Statuses:

PENDING
CONFIRMED
PROCESSING
PACKED
SHIPPED
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
RETURN_REQUESTED
RETURNED
REFUNDED


Customers should see a beautiful tracking timeline.

Example:

✓ Order Placed
✓ Payment Confirmed
✓ Being Prepared
✓ Packed
✓ Shipped
→ Out for Delivery
○ Delivered


Include:

Order number

Date

Products

Quantity

Pricing

Delivery address

Payment method

Tracking number

Shipment status

Invoice

Cancel order

Return request

Refund status

Reorder

20. CUSTOMER ACCOUNT

Create:

My Account

Dashboard
Orders
Wishlist
Addresses
Profile
Reviews
Coupons
Notifications
Support
Settings
Logout


Dashboard should show:

Recent orders

Active deliveries

Wishlist count

Reward/coupon information if implemented

Recommendations

21. REVIEWS

Create a powerful review system.

Customers should be able to:

Give 1–5 stars

Write review

Upload images

Upload videos

Add title

Mark review as helpful

Review UI should support:

★★★★★
4.8 / 5

██████████ 5
███████    4
██         3
█          2
█          1


Allow customers to filter reviews:

Most recent

Highest rated

Lowest rated

With photos

With videos

Admin must be able to:

Approve reviews

Reject reviews

Hide reviews

Feature reviews

Delete reviews

Respond to reviews

22. ADMIN PANEL

Create a professional enterprise-style admin dashboard.

Admin navigation:

Dashboard

Catalog
  Products
  Categories
  Collections
  Brands
  Attributes
  Product Reviews

Orders
  All Orders
  Pending
  Processing
  Shipped
  Delivered
  Returns
  Refunds

Customers
  Customers
  Customer Groups
  Addresses

Inventory
  Inventory
  Stock Movements
  Low Stock
  Suppliers

Marketing
  Coupons
  Discounts
  Campaigns
  Banners
  Promotions

Content
  Homepage
  Hero Sections
  Pages
  FAQs
  Testimonials
  Reviews
  Blog
  Media

Delivery
  Shipping Zones
  Delivery Rates
  Delivery Providers
  Tracking

Payments
  Transactions
  Refunds
  Payment Settings

Analytics
  Sales
  Revenue
  Orders
  Customers
  Products
  Conversion
  Abandoned Cart

Settings
  Store Settings
  Tax
  Payment
  Shipping
  Email
  Notifications
  SEO
  Users
  Roles
  Audit Logs


23. ADMIN DASHBOARD

Dashboard should immediately communicate business health.

Show:

Today's revenue

Today's orders

Monthly revenue

Total customers

New customers

Average order value

Conversion rate

Pending orders

Orders to ship

Delivered orders

Cancelled orders

Refunds

Low stock products

Charts:

Revenue over time

Orders over time

Sales by category

Top products

Customer acquisition

Order status distribution

Revenue by occasion

Revenue by product category

Add date filters:

Today

Yesterday

Last 7 days

Last 30 days

Last 3 months

This year

Custom

24. ADMIN PRODUCT CRUD

Admin must be able to:

Create product

Edit product

Delete product

Duplicate product

Archive product

Publish/unpublish

Manage images

Manage videos

Manage variants

Manage pricing

Manage inventory

Manage SEO

Manage categories

Manage tags

Manage attributes

Use bulk operations:

Bulk delete

Bulk update prices

Bulk update stock

Bulk publish

Bulk unpublish

Bulk category assignment

25. INVENTORY MANAGEMENT

Create proper inventory functionality.

Track:

Current stock

Reserved stock

Available stock

Sold quantity

Damaged stock

Returned stock

Low stock

Out of stock

Create inventory movement history.

Example:

Product: Premium Chocolate Hamper

Opening Stock: 100
Purchased: +50
Sold: -32
Returned: +2
Damaged: -3
Current: 117


Support inventory alerts.

26. COUPONS AND PROMOTIONS

Admin should be able to create:

Percentage discounts

Flat discounts

First-order discounts

Product-specific discounts

Category-specific discounts

Minimum-order discounts

Buy X Get Y

Limited-time offers

Festival offers

Free shipping coupons

Coupon configuration:

Code
Discount Type
Discount Value
Minimum Order
Maximum Discount
Usage Limit
Per Customer Limit
Start Date
End Date
Applicable Products
Applicable Categories


27. HOMEPAGE CMS

Admin should be able to manage homepage without developers.

Create configurable sections:

Hero

Banner

Product carousel

Category carousel

Occasion section

Budget section

Testimonials

Reviews

Promotional banner

FAQ

Instagram/social gallery

Admin should be able to:

Add section

Remove section

Edit section

Reorder sections

Enable/disable section

Schedule section

28. MEDIA MANAGEMENT

Create a media library.

Support:

Images

Videos

Product media

Review media

Homepage banners

Blog images

Store files in scalable object storage such as:

AWS S3

Cloudinary

UploadThing

Do not store large media files directly in PostgreSQL.

Include:

Compression

Responsive images

WebP/AVIF where appropriate

Lazy loading

CDN support

29. CUSTOMER MANAGEMENT

Admin should be able to:

Search customers

View customer profile

View order history

View total spend

View average order value

View wishlist

View reviews

View addresses where appropriate

Block/unblock customer

Add customer notes

View customer activity

Customer detail:

Customer
Orders
Revenue
Average Order Value
Last Order
First Order
Reviews
Returns
Coupons Used


30. RETURNS AND REFUNDS

Create a return/refund workflow.

Customer:

Order
→ Select product
→ Select reason
→ Upload evidence
→ Submit request


Admin:

Review Request
→ Approve/Reject
→ Arrange Return
→ Receive Product
→ Approve Refund


Support:

Full refund

Partial refund

Store credit

Replacement

31. NOTIFICATIONS

Create a centralized notification system.

Email notifications:

Account created

Email verification

Order placed

Payment successful

Payment failed

Order confirmed

Order shipped

Out for delivery

Delivered

Cancelled

Refund initiated

Refund completed

Review request

Also architect for:

SMS

WhatsApp

Push notifications

Use provider abstractions so providers can be changed later.

32. ABANDONED CART

Track abandoned carts.

Admin should see:

Customer

Products

Cart value

Last activity

Abandonment duration

Allow future integration with automated:

Email

SMS

WhatsApp

campaigns.

33. SEO

Build strong technical SEO.

Implement:

Metadata

Dynamic metadata

Open Graph

Twitter cards

Canonical URLs

Sitemap

Robots.txt

Product structured data

Breadcrumb structured data

Organization structured data

FAQ structured data

SEO-friendly URLs

Product URL:

/gifts/birthday/premium-chocolate-hamper


Not:

/product?id=123


34. PERFORMANCE

The storefront should be extremely fast.

Optimize:

Server rendering

Static generation where appropriate

Image optimization

CDN

Caching

Database indexes

Query optimization

Pagination

Lazy loading

Code splitting

Bundle size

API response sizes

Target excellent Core Web Vitals.

Do not load huge JavaScript bundles unnecessarily.

35. SECURITY

Implement production-grade security.

Include:

Input validation

Zod validation

SQL injection protection through ORM

XSS protection

CSRF protection where applicable

Rate limiting

Secure cookies

Password hashing

Authorization checks

RBAC

API validation

File upload validation

File size limits

MIME validation

Audit logging

Webhook signature verification

Payment verification

Server-side pricing calculations

Never trust:

Product prices from client

Coupon values from client

User roles from client

Payment success from client

Inventory quantities from client

36. DATABASE DESIGN

Create normalized, scalable schemas for at least:

User
Role
Permission
Address

Product
ProductVariant
ProductImage
ProductVideo
Category
Collection
Tag
ProductTag

Cart
CartItem
Wishlist
WishlistItem

Order
OrderItem
OrderAddress
Payment
Refund

Shipment
TrackingEvent

Review
ReviewMedia
ReviewVote

Coupon
CouponUsage

Inventory
InventoryMovement

Hamper
HamperComponent
HamperCustomization

HomepageSection
Banner
Page
FAQ
Testimonial

Notification

Media

AuditLog

StoreSetting
TaxSetting
ShippingZone
ShippingRate


Use proper:

Foreign keys

Unique constraints

Indexes

Cascading behavior

Timestamps

Soft deletion where appropriate

37. ORDER DATA INTEGRITY

Once an order is placed, preserve historical pricing.

For example, if a product later changes from ₹999 to ₹1199, an old order must still show:

Purchased price: ₹999


Do not calculate historical orders from current product prices.

Store immutable order snapshots where necessary.

38. ADMIN AUDIT LOGS

Track important admin actions:

Admin
Action
Entity
Entity ID
Old Value
New Value
IP
Timestamp


Example:

Admin Vikrant
Updated Product
Premium Hamper
Price: ₹999 → ₹1099
22 Aug 2026


39. ANALYTICS

Track events such as:

product_view
search
add_to_cart
remove_from_cart
wishlist_add
begin_checkout
payment_started
payment_success
purchase
review_submitted
coupon_applied


Build analytics architecture so it can integrate with:

Google Analytics

Meta Pixel

PostHog

Mixpanel

without tightly coupling the application.

40. ACCESSIBILITY

Follow WCAG principles.

Ensure:

Keyboard navigation

Focus states

Semantic HTML

ARIA where required

Proper labels

Contrast

Screen-reader-friendly UI

Accessible dialogs

Accessible dropdowns

Accessible forms

41. ERROR HANDLING

Create polished states for:

404

500

Network failure

Payment failure

Product unavailable

Out of stock

Coupon invalid

Checkout failure

Session expired

Never show raw technical errors to customers.

Create friendly error messages.

42. LOADING STATES

Every asynchronous operation should have a polished loading state.

Use:

Skeleton loaders

Shimmer where appropriate

Button loading states

Progress indicators

Optimistic updates where safe

Avoid blank screens.

43. EMPTY STATES

Design proper empty states for:

Empty cart

Empty wishlist

No orders

No reviews

No search results

No notifications

No products

No customers

No coupons

Include helpful actions.

44. ADMIN TABLE UX

Admin tables should support:

Search

Filtering

Sorting

Pagination

Column selection

Bulk selection

Bulk actions

Export CSV

Date filtering

Tables must remain usable on smaller screens.

45. API DESIGN

Create clean API/service boundaries.

Examples:

/api/products
/api/products/:id
/api/categories
/api/search
/api/cart
/api/wishlist
/api/checkout
/api/orders
/api/orders/:id
/api/payments
/api/reviews
/api/customers
/api/admin/products
/api/admin/orders
/api/admin/customers
/api/admin/inventory
/api/admin/coupons
/api/admin/analytics


Use consistent response formats.

Example:

{
  "success": true,
  "data": {},
  "message": "Product created successfully"
}


For errors:

{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}


46. SCALABILITY

The architecture must be designed so the business can grow from:

100 products
100 customers


to:

100,000+ products
1M+ customers


without requiring a complete rewrite.

Use:

Database indexes

Cursor pagination where appropriate

Caching

Redis-ready architecture

Background jobs

Queue-ready architecture

CDN

Object storage

Search abstraction

Payment abstraction

Shipping abstraction

Notification abstraction

For expensive operations, design for background processing.

Examples:

Email sending

Image processing

Invoice generation

Analytics processing

Bulk product imports

Large exports

47. ADMIN IMPORT / EXPORT

Admin should be able to:

Export products

Export orders

Export customers

Export inventory

Export reviews

Support CSV import for products.

Include validation and error reporting for imports.

48. PRODUCT RECOMMENDATION ENGINE

Initially implement rule-based recommendations.

Examples:

Frequently Bought Together
Similar Products
Customers Also Viewed
Recommended For You
Based On Occasion
Based On Budget


Architecture should allow future AI/ML recommendation integration.

49. PERSONALIZATION

The platform should understand:

User's viewed products

Search behavior

Previous purchases

Favorite categories

Budget preferences

Occasions

Use this for recommendations without compromising privacy.

50. BUSINESS FEATURES

Add support for:

Corporate Gifting

Corporate customers can:

Request bulk orders

Select quantity

Request quotation

Add company details

Upload logo

Request customization

Admin can manage corporate enquiries.

Bulk Orders

Allow:

Quantity
Customization
Budget
Delivery date
Location
Special instructions


51. ADMIN CONTENT CONTROL

Admin should control:

Store name

Logo

Favicon

Colors

Contact information

Social links

Footer

Policies

Terms

Privacy policy

Shipping policy

Return policy

Cancellation policy

52. LEGAL / TRUST PAGES

Create:

About Us
Contact
Privacy Policy
Terms & Conditions
Shipping Policy
Return & Refund Policy
Cancellation Policy
FAQ


53. CONTACT / SUPPORT

Create customer support system.

Users can:

Submit support ticket

Select order

Select issue

Add message

Upload attachment

Admin/staff can:

View tickets

Assign tickets

Change status

Respond

Add internal notes

Statuses:

OPEN
IN_PROGRESS
WAITING_FOR_CUSTOMER
RESOLVED
CLOSED


54. EMAIL TEMPLATES

Admin should be able to customize email templates.

Create templates for:

Welcome

Order confirmation

Payment confirmation

Shipment

Delivery

Cancellation

Refund

Review request

Use reusable variables:

{{customerName}}
{{orderNumber}}
{{orderTotal}}
{{trackingNumber}}
{{deliveryDate}}


55. ADMIN SETTINGS

Create a complete settings area.

Sections:

General
Store
Currency
Tax
Payment
Shipping
Email
Notifications
SEO
Social
Security
Users
Roles
Integrations


56. DEMO DATA

Seed the database with realistic demo data.

Create at least:

30+ products

Multiple categories

Multiple occasions

Multiple collections

Customers

Orders

Reviews

Coupons

Inventory

Admin users

Use realistic Indian e-commerce data and INR pricing.

Example categories:

Birthday Gifts
Anniversary Gifts
Wedding Gifts
Corporate Gifts
Festival Gifts
Chocolate Hampers
Self-Care Hampers
Premium Hampers
Budget Hampers
Personalized Gifts


57. MOBILE ADMIN

Make the admin panel responsive enough for administrators to:

Check orders

Update order status

View inventory

Check sales

Respond to reviews

Manage customers

from a phone.

58. DESIGN DETAILS

Use modern UX patterns such as:

Sticky navigation

Search command interface

Mega menu on desktop

Breadcrumbs

Sticky product purchase section where appropriate

Bottom mobile CTA

Toast notifications

Confirmation dialogs

Drawers

Tabs

Accordions

Carousels

Skeleton loaders

Infinite scroll where appropriate

Pagination where appropriate

Do not overuse carousels.

Prioritize discoverability and conversion.

59. HOMEPAGE EXPERIENCE

The first screen should immediately communicate:

What we sell

Gift hampers.

Why buy from us

Examples:

Budget-friendly

Customizable

Beautifully packaged

Fast delivery

Personalized

Perfect for every occasion

Main CTAs

Shop Hampers
Build Your Own Hamper


60. CONVERSION OPTIMIZATION

Implement UX patterns that improve conversion:

Clear CTA

Trust badges

Delivery estimates

Secure payment indicator

Reviews near purchase area

Stock urgency only when truthful

Discount visibility

Easy returns information

Multiple payment options

Guest checkout

Minimal checkout friction

Related products

Frequently bought together

Do NOT use deceptive dark patterns.

61. ADMIN BUSINESS AUTOMATION

Design the admin system to reduce manual work.

Examples:

Low-stock alerts

New-order notifications

Failed-payment alerts

Review moderation queue

Return request notifications

Abandoned-cart detection

Delivery delay alerts

Coupon expiration alerts

62. TESTING

Implement tests.

Unit Tests

Test:

Pricing

Discounts

Coupon validation

Cart calculations

Tax

Shipping

Hamper customization

Inventory

Permissions

Integration Tests

Test:

Checkout

Orders

Payments

Authentication

Admin CRUD

E2E Tests

Use Playwright or equivalent.

Test:

Browse → Product → Cart → Checkout → Payment → Order

Admin → Product CRUD → Inventory → Order Management

Customer → Login → Order → Review


63. CODE QUALITY

Follow:

SOLID principles

DRY

Clean architecture

Strong TypeScript typing

Small reusable components

Reusable hooks

Reusable services

Meaningful naming

No unnecessary abstractions

No giant components

No duplicated business logic

Avoid:

any


unless genuinely unavoidable.

Do not hide errors with type casting.

64. DOCUMENTATION

Create:

README.md
ARCHITECTURE.md
DATABASE.md
API.md
DEPLOYMENT.md
ENVIRONMENT.md
SECURITY.md


Document:

Setup

Environment variables

Database setup

Migration

Seeding

Authentication

Payment setup

Storage setup

Shipping integration

Deployment

Admin access

65. ENVIRONMENT VARIABLES

Use .env.example.

Never commit secrets.

Examples:

DATABASE_URL=

AUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

STRIPE_SECRET_KEY=

S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

EMAIL_API_KEY=

REDIS_URL=

NEXT_PUBLIC_APP_URL=


66. DEPLOYMENT

Make the application deployment-ready.

Recommended architecture:

Frontend / Next.js
        ↓
CDN / Edge
        ↓
Next.js Application
        ↓
PostgreSQL
        ↓
Redis / Cache
        ↓
Object Storage
        ↓
Payment Provider
        ↓
Shipping Provider
        ↓
Email/SMS Provider


Make it compatible with platforms such as:

Vercel

AWS

Docker

Do not tightly couple the project to one hosting provider.

67. FUTURE MICROSERVICE READINESS

Initially keep the project modular rather than unnecessarily splitting it into microservices.

However, design clear boundaries for future extraction:

Catalog Service
Order Service
Payment Service
Inventory Service
Notification Service
Search Service
Recommendation Service
User Service


Do NOT create microservices just for the sake of saying the project is "scalable."

Start as a modular monolith with clear service boundaries.

68. FINAL UI QUALITY BAR

The finished application should look like a real startup/product that could be launched publicly.

It must NOT look like:

A generic CRUD dashboard

A tutorial project

A template with random components

A basic Bootstrap website

A basic AI-generated website

It should feel like a polished commercial product.

Every important screen should have:

Consistent spacing

Strong typography

Good hierarchy

Proper empty states

Loading states

Error states

Responsive behavior

Accessibility

Subtle animation

Clear CTAs

69. DEVELOPMENT PROCESS

Build this in phases.

Phase 1 — Foundation

Set up:

Next.js

TypeScript

Tailwind

UI system

Database

Prisma

Authentication

Project architecture

Environment configuration

Phase 2 — Storefront

Build:

Homepage

Categories

Product listing

Product detail

Search

Filters

Cart

Wishlist

Phase 3 — Checkout

Build:

Guest checkout

Authentication

Address

Delivery

Coupons

Payment

Order creation

Phase 4 — Customer Account

Build:

Dashboard

Orders

Tracking

Wishlist

Addresses

Reviews

Profile

Phase 5 — Admin

Build:

Dashboard

Products

Categories

Orders

Customers

Inventory

Coupons

Reviews

CMS

Analytics

Settings

Phase 6 — Advanced Features

Build:

Hamper builder

Corporate gifting

Returns

Refunds

Notifications

Abandoned carts

Recommendations

Bulk import/export

Phase 7 — Production Hardening

Implement:

Security

Performance optimization

SEO

Accessibility

Testing

Error handling

Logging

Monitoring

Documentation

70. IMPORTANT IMPLEMENTATION RULES

Before writing code:

Analyze the complete requirements.

Design the database schema.

Design the application architecture.

Define the main entities and relationships.

Define authentication and authorization.

Define API/service boundaries.

Define the design system.

Define the storefront information architecture.

Define the admin information architecture.

Create an implementation roadmap.

Then implement incrementally.

Do not generate the entire project as one giant file.

Do not create fake functionality where real functionality is required.

If an external service such as payment, shipping, email, storage, or authentication requires credentials, implement the integration cleanly and provide a mock/development provider so the application can still run locally.

71. ACCEPTANCE CRITERIA

The final application should allow this complete journey:

USER

Visit website
      ↓
Browse without login
      ↓
Search "Birthday Hamper"
      ↓
Filter ₹500–₹1500
      ↓
Open product
      ↓
Customize product
      ↓
Add to cart
      ↓
Continue shopping
      ↓
Open cart
      ↓
Apply coupon
      ↓
Checkout
      ↓
Login OR Guest Checkout
      ↓
Enter address
      ↓
Check delivery
      ↓
Select delivery option
      ↓
Pay
      ↓
Order confirmed
      ↓
Track shipment
      ↓
Receive order
      ↓
Submit photo/video review


And:

ADMIN

Login
 ↓
Dashboard
 ↓
See sales
 ↓
Create product
 ↓
Upload images
 ↓
Set price
 ↓
Set inventory
 ↓
Publish
 ↓
Customer purchases
 ↓
Admin receives order
 ↓
Process order
 ↓
Pack
 ↓
Create shipment
 ↓
Update tracking
 ↓
Customer receives order
 ↓
Review arrives
 ↓
Admin moderates review
 ↓
Analytics update


Both flows must work end-to-end.

72. MOST IMPORTANT PRINCIPLE

Treat this as a real commercial e-commerce product, not a coding demonstration.

Prioritize:

User experience

Conversion

Performance

Scalability

Security

Maintainability

Accessibility

Business usability

SEO

Reliability

The final product should be something a real gift-hamper business could launch, operate, and scale.

Start by presenting:

Complete architecture

Database ERD/schema

Folder structure

Feature breakdown

Design system

Development phases

Then begin implementation with Phase 1, keeping the architecture ready for every subsequent phase.

## Local Development

To run this project locally, ensure you have Node.js installed.

```sh
npm install
npm run dev
```

