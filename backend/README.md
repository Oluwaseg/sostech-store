# SOSTECH Store – Backend

## Overview

**SOSTECH Store** is a modern, headless e-commerce backend built to go beyond basic online store functionality. It provides a robust foundation for real-world commerce use cases such as advanced checkout logic, referral-driven promotions, dynamic shipping rates, role-based administration, real-time support chat, and a deep order lifecycle.

This project is a ground-up rebuild inspired by lessons learned from an earlier e-commerce system. While it reuses proven concepts (auth, cart, orders), it intentionally focuses on **domain depth**, **extensibility**, and **production-style architecture**, rather than just CRUD endpoints.

The system is API-first and frontend-agnostic, making it suitable for web, mobile, or admin dashboards. It is also designed to be **future-ready for multi-tenant expansion**, without enforcing full multi-tenancy at v1.

---

## Core Features

### Authentication & Roles

- User registration and login
- JWT-based authentication
- Password reset and email flows
- Role-based access control:

  - User
  - Admin
  - Moderator

Admins and moderators can manage products, orders, chats, referrals, and shipping rules.

---

### Product & Catalog Management

- Products, categories, and subcategories
- Search, filtering, and pagination
- Stock tracking (variant-ready design)
- Admin-managed catalog updates

---

### Cart & Advanced Checkout

- Add/remove/update cart items
- Server-side total calculation
- Coupon-aware checkout flow
- Shipping-aware checkout logic
- Validation before order creation

Checkout is treated as a **decision engine**, not just arithmetic.

---

### Orders & Lifecycle Management

Orders follow a realistic lifecycle:

- pending
- payment_pending
- paid
- processing
- shipped
- delivered
- cancelled
- refunded

The architecture supports future extensions such as partial shipments and partial refunds.

---

### Referral-Based Promotions

SOSTECH Store includes a **milestone-driven referral system**:

- Each user gets a referral code
- Invited users are tracked
- Referral milestones trigger rewards

Example:

- Invite 5 users → 30% off coupon (single-use)
- Invite 10 users → 35% off coupon (single-use)

Referral rewards:

- Are coupon-based (no wallet system)
- Are user-bound and non-transferable
- Expire after a configurable period

---

### Coupon & Promotion Engine

- Percentage-based discount coupons
- Single-use enforcement
- Expiration and usage tracking
- Checkout validation rules
- No coupon stacking

Coupons are generated automatically by referral milestones or admin rules.

---

### Dynamic Shipping Rates

Shipping costs are calculated dynamically at checkout based on configurable rules:

- Location-based zones
- Weight-based pricing
- Flat-rate and free-shipping thresholds
- Multiple shipping rule strategies

Admins can manage shipping rules without changing application code.

---

### Real-Time Chat & Support

- Socket-based real-time messaging
- User ↔ Admin / Moderator communication
- Support-style conversations
- Optional order-linked chats

This enables live customer support directly within the platform.

---

### Notifications & Emails

- Order confirmation emails
- Order status updates
- Password reset emails
- Referral reward notifications

Notifications are triggered via internal domain events for clean separation of concerns.

---

## Architecture Highlights

- **Headless API-first design**
- Modular domain-based structure (auth, orders, shipping, promotions, etc.)
- Event-driven internal workflows (e.g. OrderCreated, CouponIssued)
- Centralized error handling and validation
- Config-driven behavior for shipping and promotions
- Tenant-ready data modeling (single-store by default)

---

## Project Structure (High Level)

```
app.js / server entry
routes/          # API routes per domain
controllers/     # Business logic
models/          # Data models (User, Product, Order, Coupon, Referral, etc.)
middlewares/     # Auth, validation, error handling
utils/           # JWT, email, helpers, logging
sockets/         # Real-time chat logic
templates/       # Email templates
config/          # Database and environment config
logs/            # Application logs
```

---

## Typical Request Flow

User registers or logs in → browses products → adds items to cart → applies coupon → shipping is calculated dynamically → checkout → payment processed → order created → confirmation email sent → order lifecycle updates → real-time support chat if needed.

---

## What This Project Is (and Is Not)

**This project is:**

- An advanced, extensible e-commerce backend
- Designed with real production concerns in mind
- Focused on depth, not feature bloat

**This project is not:**

- A simple CRUD demo
- A full multi-tenant SaaS (yet)
- A wallet or accounting system

---

## Brand & Vision

SOSTECH Store reflects the SOSTECH brand philosophy: building systems that are practical, scalable, and engineered with long-term growth in mind. This backend is intended to demonstrate strong backend engineering fundamentals, thoughtful system design, and real-world commerce problem solving.

---

## Status

🚧 Active development – features are being implemented incrementally with a focus on correctness, clarity, and extensibility.
