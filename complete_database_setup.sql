-- =====================================================
-- إعداد قاعدة البيانات الكاملة لموقع Designs4U
-- Complete Database Setup for Designs4U Website
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. إنشاء جدول الفئات الرئيسية (Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. إنشاء جدول الفئات الفرعية (Subcategories)
-- =====================================================
CREATE TABLE IF NOT EXISTS subcategories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_ar TEXT,
    description_en TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. إنشاء جدول المنتجات/الخدمات (Services/Products)
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    gallery TEXT[], -- Array of image URLs
    price NUMERIC,
    sale_price NUMERIC,
    has_multiple_sizes BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT UNIQUE,
    weight DECIMAL(10,2),
    dimensions TEXT, -- مثل "30x20x15 سم"
    material TEXT,
    color TEXT,
    brand TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. إنشاء جدول أحجام المنتجات (Product Sizes)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    stock_quantity INTEGER DEFAULT 0,
    sku TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. إنشاء جدول صور المنتجات (Product Images)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. إنشاء جدول البانرات (Banners)
-- =====================================================
CREATE TABLE IF NOT EXISTS banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('image', 'text', 'strip')),
    title TEXT,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    -- Strip banner specific properties
    strip_text_color TEXT,
    strip_background_color TEXT,
    strip_position TEXT CHECK (strip_position IN ('above_main', 'below_main')),
    -- Date range for banner display
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. إنشاء جدول إعدادات المتجر (Store Settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    store_name TEXT,
    store_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    og_image_url TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    -- Social Media URLs
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    snapchat_url TEXT,
    tiktok_url TEXT,
    youtube_url TEXT,
    whatsapp_url TEXT,
    -- Contact Information
    phone TEXT,
    email TEXT,
    address TEXT,
    -- Theme Settings (JSON)
    theme_settings JSONB DEFAULT '{}',
    -- Additional Settings
    show_testimonials BOOLEAN DEFAULT false,
    currency TEXT DEFAULT 'SAR',
    language TEXT DEFAULT 'ar',
    timezone TEXT DEFAULT 'Asia/Riyadh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 8. إنشاء جدول الشهادات (Testimonials)
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_image_url TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 9. إنشاء جدول المستخدمين (User Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Saudi Arabia',
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 10. إنشاء جدول الطلبات (Orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'stc_pay', 'apple_pay', 'google_pay')),
    -- Order Details
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax_amount NUMERIC NOT NULL DEFAULT 0,
    shipping_cost NUMERIC NOT NULL DEFAULT 0,
    discount_amount NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'SAR',
    -- Shipping Information
    shipping_name TEXT,
    shipping_phone TEXT,
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_notes TEXT,
    -- Additional Information
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 11. إنشاء جدول تفاصيل الطلبات (Order Items)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id),
    product_size_id UUID REFERENCES product_sizes(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 12. إنشاء جدول الكوبونات (Coupons)
-- =====================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC NOT NULL,
    minimum_amount NUMERIC,
    maximum_discount NUMERIC,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 13. إنشاء جدول مراجعات المنتجات (Product Reviews)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, user_id)
);

-- =====================================================
-- 14. إنشاء جدول المفضلة (Wishlist)
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);

-- =====================================================
-- 15. إنشاء جدول عربة التسوق (Shopping Cart)
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    product_size_id UUID REFERENCES product_sizes(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id, product_size_id)
);

-- =====================================================
-- إنشاء الفهارس (Indexes) لتحسين الأداء
-- =====================================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- Subcategories indexes
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);
CREATE INDEX IF NOT EXISTS idx_subcategories_active ON subcategories(is_active);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_subcategory_id ON services(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_best_seller ON services(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sku ON services(sku);

-- Product sizes indexes
CREATE INDEX IF NOT EXISTS idx_product_sizes_service_id ON product_sizes(service_id);

-- Product images indexes
CREATE INDEX IF NOT EXISTS idx_product_images_service_id ON product_images(service_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);

-- Banners indexes
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_type ON banners(type);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(display_order);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_service_id ON order_items(service_id);

-- Coupons indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_service_id ON product_reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved);

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_service_id ON wishlist(service_id);

-- Cart items indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_service_id ON cart_items(service_id);

-- =====================================================
-- إنشاء الدوال المساعدة (Helper Functions)
-- =====================================================

-- دالة تحديث updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- دالة إنشاء رقم طلب فريد
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    counter INTEGER;
BEGIN
    -- Get current counter from store_settings or start from 1
    SELECT COALESCE((theme_settings->>'order_counter')::INTEGER, 0) + 1 
    INTO counter 
    FROM store_settings 
    LIMIT 1;
    
    -- Generate order number with date prefix
    order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
    
    -- Update counter in store_settings
    UPDATE store_settings 
    SET theme_settings = COALESCE(theme_settings, '{}'::jsonb) || 
        jsonb_build_object('order_counter', counter)
    WHERE id = (SELECT id FROM store_settings LIMIT 1);
    
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- دالة إنشاء ملف تعريف المستخدم الجديد
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- إنشاء الـ Triggers
-- =====================================================

-- Trigger لتحديث updated_at في جميع الجداول
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
    BEFORE UPDATE ON subcategories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_sizes_updated_at
    BEFORE UPDATE ON product_sizes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger لإنشاء ملف تعريف المستخدم الجديد
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger لإنشاء رقم طلب تلقائي
CREATE OR REPLACE TRIGGER generate_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION generate_order_number();

-- =====================================================
-- تفعيل Row Level Security (RLS)
-- =====================================================

-- تفعيل RLS على جميع الجداول
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- إنشاء سياسات الأمان (Security Policies)
-- =====================================================

-- Categories policies
CREATE POLICY "Public can view active categories"
  ON categories FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Subcategories policies
CREATE POLICY "Public can view active subcategories"
  ON subcategories FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage subcategories"
  ON subcategories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Services policies
CREATE POLICY "Public can view active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage services"
  ON services FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product sizes policies
CREATE POLICY "Public can view product sizes"
  ON product_sizes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can manage product sizes"
  ON product_sizes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product images policies
CREATE POLICY "Public can view product images"
  ON product_images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can manage product images"
  ON product_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Banners policies
CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT
  TO public
  USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Authenticated can manage banners"
  ON banners FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Store settings policies
CREATE POLICY "Public can view store settings"
  ON store_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated can manage store settings"
  ON store_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials policies
CREATE POLICY "Public can view active testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  ));

-- Coupons policies
CREATE POLICY "Public can view active coupons"
  ON coupons FOR SELECT
  TO public
  USING (is_active = true AND (start_date IS NULL OR start_date <= NOW()) AND (end_date IS NULL OR end_date >= NOW()));

CREATE POLICY "Authenticated can manage coupons"
  ON coupons FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Product reviews policies
CREATE POLICY "Public can view approved reviews"
  ON product_reviews FOR SELECT
  TO public
  USING (is_approved = true);

CREATE POLICY "Users can view their own reviews"
  ON product_reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
  ON product_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON product_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated can manage reviews"
  ON product_reviews FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Wishlist policies
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cart items policies
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- إدراج البيانات الافتراضية (Default Data)
-- =====================================================

-- إدراج إعدادات المتجر الافتراضية
INSERT INTO store_settings (
    id,
    store_name,
    store_description,
    meta_title,
    meta_description,
    phone,
    whatsapp_url,
    theme_settings,
    currency,
    language,
    timezone
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Designs4U',
    'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
    'Designs4U - خدمات الطباعة والتطريز',
    'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
    '+20 100 646 4349',
    'https://wa.me/201006464349',
    '{
        "primaryColor": "#c7a17a",
        "secondaryColor": "#fff",
        "fontFamily": "Cairo, sans-serif",
        "backgroundColor": "#000",
        "backgroundGradient": "linear-gradient(135deg, #232526 0%, #414345 100%)"
    }'::jsonb,
    'EGP',
    'ar',
    'Africa/Cairo'
) ON CONFLICT (id) DO NOTHING;

-- إدراج فئات افتراضية
INSERT INTO categories (id, name, description, slug, display_order) VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, 'خدمات الطباعة', 'طباعة على جميع أنواع الأقمشة والمنسوجات', 'printing-services', 1),
    ('22222222-2222-2222-2222-222222222222'::uuid, 'خدمات التطريز', 'تطريز يدوي وآلي على الأقمشة والملابس', 'embroidery-services', 2),
    ('33333333-3333-3333-3333-333333333333'::uuid, 'شروحات البرامج', 'دروس تعليمية لبرامج التطريز والتصميم', 'software-tutorials', 3),
    ('44444444-4444-4444-4444-444444444444'::uuid, 'تصاميم جاهزة', 'تصاميم جاهزة للطباعة والتطريز', 'ready-designs', 4)
ON CONFLICT (id) DO NOTHING;

-- إدراج فئات فرعية افتراضية
INSERT INTO subcategories (id, name_ar, name_en, slug, category_id, display_order) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'طباعة على القماش', 'Fabric Printing', 'fabric-printing', '11111111-1111-1111-1111-111111111111'::uuid, 1),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'طباعة على الملابس', 'Clothing Printing', 'clothing-printing', '11111111-1111-1111-1111-111111111111'::uuid, 2),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'طباعة على الحقائب', 'Bag Printing', 'bag-printing', '11111111-1111-1111-1111-111111111111'::uuid, 3),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'تطريز يدوي', 'Hand Embroidery', 'hand-embroidery', '22222222-2222-2222-2222-222222222222'::uuid, 1),
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid, 'تطريز آلي', 'Machine Embroidery', 'machine-embroidery', '22222222-2222-2222-2222-222222222222'::uuid, 2),
    ('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, 'تطريز على القمصان', 'Shirt Embroidery', 'shirt-embroidery', '22222222-2222-2222-2222-222222222222'::uuid, 3),
    ('gggggggg-gggg-gggg-gggg-gggggggggggg'::uuid, 'شروحات ويلكوم', 'Wilcom Tutorials', 'wilcom-tutorials', '33333333-3333-3333-3333-333333333333'::uuid, 1),
    ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh'::uuid, 'شروحات إمبريدي', 'Embrilliance Tutorials', 'embrilliance-tutorials', '33333333-3333-3333-3333-333333333333'::uuid, 2),
    ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii'::uuid, 'تصاميم عربية', 'Arabic Designs', 'arabic-designs', '44444444-4444-4444-4444-444444444444'::uuid, 1),
    ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj'::uuid, 'تصاميم إنجليزية', 'English Designs', 'english-designs', '44444444-4444-4444-4444-444444444444'::uuid, 2)
ON CONFLICT (id) DO NOTHING;

-- إدراج بانر افتراضي
INSERT INTO banners (id, type, title, description, is_active, display_order) VALUES
    ('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk'::uuid, 'strip', 'عروض خاصة', 'خصم يصل إلى 30% على خدمات الطباعة والتطريز', true, 1)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- إنهاء الإعداد
-- =====================================================

-- إضافة تعليقات للتوثيق
COMMENT ON TABLE categories IS 'جدول الفئات الرئيسية للمنتجات';
COMMENT ON TABLE subcategories IS 'جدول الفئات الفرعية للمنتجات';
COMMENT ON TABLE services IS 'جدول المنتجات والخدمات';
COMMENT ON TABLE product_sizes IS 'جدول أحجام المنتجات المختلفة';
COMMENT ON TABLE product_images IS 'جدول صور المنتجات';
COMMENT ON TABLE banners IS 'جدول البانرات والإعلانات';
COMMENT ON TABLE store_settings IS 'جدول إعدادات المتجر';
COMMENT ON TABLE testimonials IS 'جدول شهادات العملاء';
COMMENT ON TABLE profiles IS 'جدول ملفات المستخدمين';
COMMENT ON TABLE orders IS 'جدول الطلبات';
COMMENT ON TABLE order_items IS 'جدول تفاصيل الطلبات';
COMMENT ON TABLE coupons IS 'جدول الكوبونات والخصومات';
COMMENT ON TABLE product_reviews IS 'جدول مراجعات المنتجات';
COMMENT ON TABLE wishlist IS 'جدول قائمة المفضلة';
COMMENT ON TABLE cart_items IS 'جدول عربة التسوق';

-- رسالة نجاح الإعداد
DO $$
BEGIN
    RAISE NOTICE 'تم إنشاء قاعدة البيانات بنجاح!';
    RAISE NOTICE 'تم إنشاء % جدول', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN (
            'categories', 'subcategories', 'services', 'product_sizes', 
            'product_images', 'banners', 'store_settings', 'testimonials',
            'profiles', 'orders', 'order_items', 'coupons', 'product_reviews',
            'wishlist', 'cart_items'
        )
    );
END $$;
