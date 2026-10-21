-- ============================================================================
-- LUMINA SOAPS — Simple & Professional Architecture Schema
-- Proprietor: R. Niranjana | Tagline: Nature in Every Lather.
-- Currency: Indian Rupee (₹ INR)
-- Sections: Dashboard, Orders, Products, Combo Offers, Monthly Revenue, Settings
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name TEXT NOT NULL DEFAULT 'Lumina Soaps',
    brand_tagline TEXT NOT NULL DEFAULT 'Nature in Every Lather.',
    owner_name TEXT NOT NULL DEFAULT 'R. Niranjana',
    contact_email TEXT NOT NULL DEFAULT 'niranjana@luminasoaps.com',
    studio_address TEXT NOT NULL DEFAULT 'Coimbatore, Tamil Nadu, India',
    currency TEXT NOT NULL DEFAULT 'INR',
    free_shipping_threshold INTEGER NOT NULL DEFAULT 499,
    standard_shipping_fee INTEGER NOT NULL DEFAULT 60,
    cod_available BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PRODUCTS (Cold-process handmade soaps)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT 'Artisanal Soaps',
    description TEXT NOT NULL DEFAULT '',
    price INTEGER NOT NULL CHECK (price >= 0),
    original_price INTEGER CHECK (original_price IS NULL OR original_price >= 0),
    weight TEXT NOT NULL DEFAULT '120g',
    ingredients TEXT NOT NULL DEFAULT '',
    usage_instructions TEXT NOT NULL DEFAULT 'Lather with warm water, apply gently, rinse clean.',
    precautions TEXT NOT NULL DEFAULT 'For external use only. Discontinue if irritation occurs.',
    image TEXT NOT NULL DEFAULT '/logo.svg',
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (is_published, is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);

-- 3. COMBO OFFERS (Dedicated promotion architecture)
-- Supports: fixed_price, percentage_discount, fixed_discount, buy_x_get_y
CREATE TABLE IF NOT EXISTS public.combo_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    banner_image TEXT NOT NULL DEFAULT '',
    offer_type TEXT NOT NULL CHECK (offer_type IN ('fixed_price', 'percentage_discount', 'fixed_discount', 'buy_x_get_y')),
    combo_price INTEGER CHECK (combo_price IS NULL OR combo_price >= 0),
    discount_percentage INTEGER CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100)),
    discount_amount INTEGER CHECK (discount_amount IS NULL OR discount_amount >= 0),
    included_soaps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {productId, productName, quantity}
    buy_quantity INTEGER DEFAULT 1,
    get_quantity INTEGER DEFAULT 1,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    usage_limit INTEGER,
    times_used INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    terms TEXT NOT NULL DEFAULT 'Valid while small-batch cured stocks last.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_combo_offers_active ON public.combo_offers (is_active, start_date, end_date);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL, -- Array of ordered soaps and combo items
    subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
    discount INTEGER NOT NULL DEFAULT 0 CHECK (discount >= 0),
    shipping_fee INTEGER NOT NULL DEFAULT 0 CHECK (shipping_fee >= 0),
    total INTEGER NOT NULL CHECK (total >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'online', 'razorpay', 'upi')),
    payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    order_status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (order_status IN ('Pending Review', 'Accepted', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled')),
    tracking_number TEXT DEFAULT '',
    carrier TEXT DEFAULT '',
    refunded_amount INTEGER NOT NULL DEFAULT 0 CHECK (refunded_amount >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (order_status, payment_status);

-- 5. MONTHLY REVENUE AUDIT ARCHIVE
CREATE TABLE IF NOT EXISTS public.monthly_revenue_archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    month_name TEXT NOT NULL,
    qualifying_orders INTEGER NOT NULL DEFAULT 0,
    gross_revenue INTEGER NOT NULL DEFAULT 0,
    total_discounts INTEGER NOT NULL DEFAULT 0,
    refunds INTEGER NOT NULL DEFAULT 0,
    net_revenue INTEGER NOT NULL DEFAULT 0,
    average_order_value INTEGER NOT NULL DEFAULT 0,
    closed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (year, month)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.combo_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_revenue_archive ENABLE ROW LEVEL SECURITY;

-- PRODUCTS:
-- Public can view active published products
CREATE POLICY "Public can view active published products"
    ON public.products FOR SELECT
    USING (is_published = true AND is_active = true);

-- Owner full access:
CREATE POLICY "Owner can manage all products"
    ON public.products FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = (SELECT contact_email FROM public.store_settings LIMIT 1) OR auth.jwt() ->> 'role' = 'owner');

-- COMBO OFFERS:
-- Public can view active offers within date bounds
CREATE POLICY "Public can view active combo offers"
    ON public.combo_offers FOR SELECT
    USING (is_active = true AND (end_date IS NULL OR end_date >= NOW()) AND start_date <= NOW());

CREATE POLICY "Owner can manage combo offers"
    ON public.combo_offers FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = (SELECT contact_email FROM public.store_settings LIMIT 1) OR auth.jwt() ->> 'role' = 'owner');

-- ORDERS:
-- Customers can view their own orders via email or user_id
CREATE POLICY "Customers can view their own orders"
    ON public.orders FOR SELECT
    USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Owner can manage all orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = (SELECT contact_email FROM public.store_settings LIMIT 1) OR auth.jwt() ->> 'role' = 'owner');

-- SETTINGS:
-- Public can view store settings
CREATE POLICY "Public can view store settings"
    ON public.store_settings FOR SELECT
    USING (true);

CREATE POLICY "Owner can update store settings"
    ON public.store_settings FOR UPDATE
    TO authenticated
    USING (auth.jwt() ->> 'email' = (SELECT contact_email FROM public.store_settings LIMIT 1) OR auth.jwt() ->> 'role' = 'owner');

-- REVENUE:
CREATE POLICY "Owner can view monthly revenue archive"
    ON public.monthly_revenue_archive FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'email' = (SELECT contact_email FROM public.store_settings LIMIT 1) OR auth.jwt() ->> 'role' = 'owner');
