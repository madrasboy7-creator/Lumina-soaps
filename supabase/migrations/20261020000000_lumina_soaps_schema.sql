-- ============================================================================
-- LUMINA SOAPS — Supabase PostgreSQL Schema Migration
-- Tagline: Nature in Every Lather.
-- Single-owner handmade soap business. Soaps only + promotional combo gifts.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'owner')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SOAP CATEGORIES (Soaps only - scent/skin/type collections)
CREATE TABLE IF NOT EXISTS public.soap_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SOAPS (The ONLY purchasable product line)
CREATE TABLE IF NOT EXISTS public.soaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.soap_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    ingredients TEXT NOT NULL DEFAULT '',
    fragrance TEXT NOT NULL DEFAULT '',
    directions TEXT NOT NULL DEFAULT 'Lather with warm water on wet skin, then rinse thoroughly.',
    warnings TEXT NOT NULL DEFAULT 'For external use only. Discontinue use if irritation occurs.',
    weight_grams INTEGER NOT NULL DEFAULT 120,
    price_paise INTEGER NOT NULL CHECK (price_paise >= 0),
    sale_price_paise INTEGER CHECK (sale_price_paise IS NULL OR sale_price_paise >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SOAP IMAGES
CREATE TABLE IF NOT EXISTS public.soap_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soap_id UUID NOT NULL REFERENCES public.soaps(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. GIFT ITEMS (Promotion-Only Inventory - NEVER independently purchasable)
CREATE TABLE IF NOT EXISTS public.gift_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    storage_path TEXT NOT NULL DEFAULT '',
    sku TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    image_path TEXT NOT NULL,
    cta_label TEXT NOT NULL DEFAULT 'Shop Soaps',
    target_url TEXT NOT NULL DEFAULT '/shop',
    sort_order INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. OFFERS (e.g. Buy 6 Soaps, Get 1 Free Gift)
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    minimum_quantity INTEGER NOT NULL DEFAULT 6 CHECK (minimum_quantity > 0),
    gifts_per_threshold INTEGER NOT NULL DEFAULT 1 CHECK (gifts_per_threshold > 0),
    max_gifts_per_order INTEGER NOT NULL DEFAULT 3 CHECK (max_gifts_per_order >= gifts_per_threshold),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. OFFER ELIGIBLE SOAPS (If empty, all active published soaps qualify)
CREATE TABLE IF NOT EXISTS public.offer_eligible_soaps (
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    soap_id UUID NOT NULL REFERENCES public.soaps(id) ON DELETE CASCADE,
    PRIMARY KEY (offer_id, soap_id)
);

-- 9. OFFER GIFTS
CREATE TABLE IF NOT EXISTS public.offer_gifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    gift_item_id UUID NOT NULL REFERENCES public.gift_items(id) ON DELETE RESTRICT,
    quantity_per_award INTEGER NOT NULL DEFAULT 1 CHECK (quantity_per_award > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address JSONB NOT NULL,
    subtotal_paise INTEGER NOT NULL CHECK (subtotal_paise >= 0),
    discount_paise INTEGER NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
    shipping_paise INTEGER NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
    tax_paise INTEGER NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
    total_paise INTEGER NOT NULL CHECK (total_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded', 'partially_refunded')),
    order_status TEXT NOT NULL DEFAULT 'Placed' CHECK (order_status IN ('Pending Payment', 'Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refund Pending', 'Refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    soap_id UUID REFERENCES public.soaps(id) ON DELETE SET NULL,
    item_name_snapshot TEXT NOT NULL,
    sku_snapshot TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price_paise INTEGER NOT NULL CHECK (unit_price_paise >= 0),
    discount_paise INTEGER NOT NULL DEFAULT 0,
    line_total_paise INTEGER NOT NULL CHECK (line_total_paise >= 0),
    is_gift BOOLEAN NOT NULL DEFAULT false,
    gift_item_id UUID REFERENCES public.gift_items(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce: if is_gift is true, line_total must be 0
    CONSTRAINT check_gift_zero_price CHECK (
        (is_gift = true AND line_total_paise = 0) OR
        (is_gift = false AND soap_id IS NOT NULL)
    )
);

-- 12. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('razorpay', 'cod')),
    provider_order_id TEXT,
    provider_payment_id TEXT UNIQUE,
    amount_paise INTEGER NOT NULL CHECK (amount_paise >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'captured', 'failed', 'refunded', 'partially_refunded')),
    provider_reference TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. REFUNDS
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE RESTRICT,
    provider_refund_id TEXT UNIQUE,
    amount_paise INTEGER NOT NULL CHECK (amount_paise > 0),
    reason TEXT DEFAULT '',
    refund_status TEXT NOT NULL DEFAULT 'pending' CHECK (refund_status IN ('pending', 'processed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. INVENTORY MOVEMENTS
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    soap_id UUID REFERENCES public.soaps(id) ON DELETE SET NULL,
    gift_item_id UUID REFERENCES public.gift_items(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('order_fulfillment', 'restock', 'damage', 'waste', 'manual_adjustment', 'order_cancellation_restore')),
    quantity_change INTEGER NOT NULL,
    reason TEXT DEFAULT '',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_inventory_target CHECK (
        (soap_id IS NOT NULL AND gift_item_id IS NULL) OR
        (soap_id IS NULL AND gift_item_id IS NOT NULL)
    )
);

-- 15. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. ORDER TRACKING
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
    carrier TEXT NOT NULL,
    tracking_number TEXT NOT NULL,
    tracking_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. EMAIL LOGS
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient TEXT NOT NULL,
    email_type TEXT NOT NULL,
    delivery_status TEXT NOT NULL CHECK (delivery_status IN ('sent', 'failed', 'pending')),
    error_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

-- 20. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_soaps_slug ON public.soaps(slug);
CREATE INDEX IF NOT EXISTS idx_soaps_category_id ON public.soaps(category_id);
CREATE INDEX IF NOT EXISTS idx_soaps_status ON public.soaps(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_inventory_soap_id ON public.inventory_movements(soap_id);
CREATE INDEX IF NOT EXISTS idx_inventory_gift_id ON public.inventory_movements(gift_item_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_eligible_soaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile; owner can read all
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Everyone can read active categories
CREATE POLICY "Public read active categories" ON public.soap_categories FOR SELECT USING (is_active = true);

-- Soaps: Everyone can read published soaps
CREATE POLICY "Public read published soaps" ON public.soaps FOR SELECT USING (status = 'published');

-- Soap Images: Everyone can read images of published soaps
CREATE POLICY "Public read soap images" ON public.soap_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.soaps WHERE soaps.id = soap_images.soap_id AND soaps.status = 'published')
);

-- Gift Items: Public read ONLY for promotion display (never purchasable catalog)
CREATE POLICY "Public read active gift items" ON public.gift_items FOR SELECT USING (is_active = true);

-- Banners: Everyone can read active banners
CREATE POLICY "Public read active banners" ON public.banners FOR SELECT USING (is_active = true);

-- Offers: Everyone can read active offers
CREATE POLICY "Public read active offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read offer eligible soaps" ON public.offer_eligible_soaps FOR SELECT USING (true);
CREATE POLICY "Public read offer gifts" ON public.offer_gifts FOR SELECT USING (true);

-- Orders: Customers can view their own orders
CREATE POLICY "Customers view own orders" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);

-- Store Settings: Public can read non-secret settings
CREATE POLICY "Public read public settings" ON public.store_settings FOR SELECT USING (
    setting_key NOT IN ('smtp_password', 'razorpay_key_secret', 'razorpay_webhook_secret')
);

-- Contact: Public can insert contact messages
CREATE POLICY "Public insert contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
