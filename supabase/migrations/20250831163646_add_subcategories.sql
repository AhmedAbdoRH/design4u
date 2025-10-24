-- Create subcategories table
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
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add subcategory_id to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Update RLS policies if needed
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);

-- Add comments for documentation
COMMENT ON TABLE subcategories IS 'Stores subcategories that belong to main categories';
COMMENT ON COLUMN subcategories.category_id IS 'Reference to the parent category';
COMMENT ON COLUMN subcategories.slug IS 'URL-friendly version of the subcategory name for routing';

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_subcategories_updated_at
BEFORE UPDATE ON subcategories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert some example subcategories (optional)
-- INSERT INTO subcategories (name_ar, name_en, slug, category_id) VALUES
-- ('عطور رجالية', 'Men\'s Perfumes', 'mens-perfumes', (SELECT id FROM categories WHERE slug = 'perfumes')),
-- ('عطور نسائية', 'Women\'s Perfumes', 'womens-perfumes', (SELECT id FROM categories WHERE slug = 'perfumes')),
-- ('عطور عائلية', 'Family Perfumes', 'family-perfumes', (SELECT id FROM categories WHERE slug = 'perfumes')),
-- ('عطور نيش', 'Niche Perfumes', 'niche-perfumes', (SELECT id FROM categories WHERE slug = 'perfumes'));

-- Update existing products to use subcategories (example)
-- UPDATE products 
-- SET subcategory_id = (SELECT id FROM subcategories WHERE slug = 'mens-perfumes')
-- WHERE category_id = (SELECT id FROM categories WHERE slug = 'perfumes') AND gender = 'male';
