# Lumina Soaps — Direct-to-Consumer E-Commerce Application

<div align="center">
  <h2>LUMINA SOAPS</h2>
  <p><strong>Nature in Every Lather.</strong></p>
  <p>Single-Owner Handcrafted Artisanal Soapery • Handcrafted in Coimbatore, Tamil Nadu, India</p>
  <p>Currency: Indian Rupees (₹ INR) | Sole Proprietor: <strong>R. Niranjana</strong></p>
</div>

---

## 1. Project Overview & Business Model

**Lumina Soaps** is an authentic, single-owner direct-to-consumer online store selling pure, handcrafted botanical soaps directly to customers across India. It is strictly not a multi-vendor marketplace or a complex multi-layered system.

- **Brand Name**: Lumina Soaps
- **Sole Proprietor / Maker**: R. Niranjana
- **Tagline**: Nature in Every Lather.
- **Location**: Coimbatore, Tamil Nadu, India
- **Currency**: Indian Rupees (₹ INR)
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth / Storage
- **Deployment**: Render (Hosting) + GoDaddy (Custom Domain DNS)

---

## 2. Core Architecture & Simplified Owner Portal

The application maintains a strict separation of concerns:
- **Customer Storefront**: Polished, responsive soap discovery, product filtering, shopping cart, transparent INR checkout (Razorpay / Cash on Delivery), customer accounts, and order tracking.
- **Owner Portal**: A streamlined 6-section management hub designed specifically for sole proprietor **R. Niranjana**:

```text
Owner Portal (6 Core Sections)
├── 1. Dashboard         # Real-time metrics, alerts, low-stock notifications & recent orders
├── 2. Orders            # Full order review, AWB tracking, courier dispatch & printable invoices
├── 3. Products          # Full soap catalog manager (Add, Edit, Publish/Unpublish, Stock)
├── 4. Combo Offers      # Promotional bundles (Fixed-Price, Percentage, Flat ₹ Off, Buy X Get Y)
├── 5. Monthly Revenue   # Permanent 12-month historical revenue archive with CSV export
└── 6. Settings          # Store name, tagline, maker info, contact email & studio address
```

---

## 3. Zero Mock Data Policy

The application starts with an **empty product catalogue** and zero fabricated business records:
- **No dummy products** or fake inventory.
- **No fake customer reviews** presented as genuine.
- **No demo orders** or fabricated customers.
- **No hardcoded revenue numbers**.

### Empty State Handling
When no soaps are published, the storefront displays the clean, respectful empty state:
> *"Our soap collection is getting ready. Please check back soon."*

When the owner creates and publishes a real soap batch in the Owner Portal, that product **automatically appears on the customer website immediately** without touching frontend code.

---

## 4. Key Features

### 🛍️ Customer Storefront
- **Botanical Soap Discovery**: Dynamic filtering by skin type, scent profile, ingredients, and price range.
- **Product Details**: High-resolution image gallery, cold-process batch details, ingredients, usage instructions, weight, and live stock indicator.
- **Combo Offers View**: Dedicated customer section showcasing active, published combo offers with direct "Add Combo to Basket" integration.
- **Transparent Checkout**:
  - Validates stock and pricing atomically on the server before creating orders.
  - Supports Razorpay (UPI, Google Pay, PhonePe, Cards, NetBanking) and Cash on Delivery (COD).
  - Never simulates fake successful payments.
- **Customer Account & Order Tracking**:
  - Secure customer authentication.
  - Customers view only their own private orders and delivery tracking.
  - Live order timeline with India Post, Delhivery, or BlueDart AWB tracking numbers.

### 👑 Owner Portal (R. Niranjana)
- **Secure Owner Access**:
  - Accessible via Owner Portal login modal (`niranjana@luminasoaps.com`).
  - Protected by server-side authorization tokens on all privileged API endpoints.
- **Product Management**:
  - Create, edit, and publish soaps with custom SKU, slug, INR price, compare-at price, ingredients, precautions, weight, and stock levels.
  - One-click publish / unpublish toggle.
- **Dedicated Combo Offers**:
  - **Fixed-Price Combo**: Group of soaps sold together for a fixed price (e.g., Trio for ₹580).
  - **Percentage Discount**: e.g., 15% off eligible bundles.
  - **Fixed-Amount Discount**: Specified ₹ deduction from qualifying combinations.
  - **Buy X, Get Y**: Configured quantity promotion with explicit eligibility.
- **Order Management & Fulfillment**:
  - Filter by order status: `Pending Review`, `Accepted`, `Processing`, `Packed`, `Shipped`, `Delivered`, `Cancelled`.
  - Enter courier name (`BlueDart`, `Delhivery`, `India Post`, `DTDC`) and tracking AWB.
  - Printable HTML Packing Slip and Tax Invoice modal.
- **Monthly Revenue Archive**:
  - Permanent 12-month historical statement for any selected year.
  - **Accounting Rules**: Counts **qualifying paid orders only** (`SUCCESS` or delivered COD).
  - Deducts genuine recorded refunds.
  - Excludes unpaid COD and failed payments from gross and net collected revenue.
  - One-click CSV export of the financial report.
- **Store & Maker Settings**:
  - Store Name: `Lumina Soaps`
  - Tagline: `Nature in Every Lather.`
  - Owner / Maker: `R. Niranjana`
  - Contact Email: `niranjana@luminasoaps.com`
  - Studio Address: `Coimbatore, Tamil Nadu, India`
  - Standard delivery charge & free shipping threshold configuration.

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Recharts.
- **Backend**: Node.js, Express.js, TypeScript (`tsx`), atomic JSON persistence with Supabase PostgreSQL client integration.
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) policies.
- **Payments**: Razorpay (INR ₹) & Cash on Delivery (COD).
- **Logistics**: BlueDart, Delhivery, India Post Speed Post, DTDC.

---

## 6. Supabase Database Migration

A clean Supabase migration matching the 6-section architecture is provided:
- File: [`supabase/migrations/20261021000000_lumina_soaps_simple_schema.sql`](file:///supabase/migrations/20261021000000_lumina_soaps_simple_schema.sql)

### How to apply in Supabase:
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Go to **SQL Editor** -> **New Query**.
3. Copy the contents of `supabase/migrations/20261021000000_lumina_soaps_simple_schema.sql` and run it.
4. Go to **Storage** and create a public bucket named `product-images`.

---

## 7. Deployment Instructions

### A. Deploying on Render

The repository includes a ready-to-use [`render.yaml`](file:///render.yaml):

1. Push your repository to **GitHub**.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** -> **Blueprint**, and connect your GitHub repository.
4. Render will detect `render.yaml` and configure the web service:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check**: `/api/health`
5. Configure your production environment variables in Render:
   - `OWNER_EMAIL`: `niranjana@luminasoaps.com`
   - `OWNER_PASSWORD`: *(A strong password for R. Niranjana)*
   - `SUPABASE_URL`: *(Your Supabase project URL)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Your Supabase service role key)*
   - `RAZORPAY_KEY_ID`: *(Optional for online payments)*
   - `RAZORPAY_KEY_SECRET`: *(Optional for online payments)*

### B. Custom Domain Configuration (GoDaddy DNS)

If you have purchased a domain on GoDaddy (e.g., `luminasoaps.com`):

1. **In Render Dashboard**:
   - Go to your Web Service -> **Settings** -> **Custom Domains**.
   - Add:
     - Storefront: `shop.luminasoaps.com` (or `luminasoaps.com` / `www.luminasoaps.com`)
     - Owner Portal: `admin.luminasoaps.com`
2. **In GoDaddy DNS Management**:
   - Add a `CNAME` record:
     - **Host**: `shop` (or `www`)
     - **Points to**: `your-lumina-app.onrender.com`
     - **TTL**: 1/2 Hour (or Default)
   - Add a `CNAME` record for admin:
     - **Host**: `admin`
     - **Points to**: `your-lumina-app.onrender.com`
     - **TTL**: 1/2 Hour
3. Render automatically provisions free SSL certificates via Let's Encrypt for both hostnames.

---

## 8. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server
npm run dev
# Server will run on http://localhost:3000

# 4. Check TypeScript types
npm run lint

# 5. Production build test
npm run build
```

---

## 9. Initial Owner Account Details

- **Owner Email**: `niranjana@luminasoaps.com`
- **Initial Password**: `OwnerPassword@2026`
- **Setup Endpoint**: `POST /api/auth/owner/setup` (allows R. Niranjana to update credentials on first boot)

© Lumina Soaps • Handcrafted Cold Process Soaps • Owned & Operated by R. Niranjana.
