-- Create product_sizes table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'services' AND column_name = 'id' AND data_type = 'integer') THEN
        ALTER TABLE services ALTER COLUMN id DROP DEFAULT;
        ALTER TABLE services ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());
        ALTER TABLE services ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS product_sizes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    sale_price NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE product_sizes IS 'Stores different sizes and prices for each service/product.';
COMMENT ON COLUMN product_sizes.service_id IS 'Reference to the service/product.';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_product_sizes_updated_at
BEFORE UPDATE ON product_sizes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Remove price and sale_price from services table
ALTER TABLE services
DROP COLUMN IF EXISTS price,
DROP COLUMN IF EXISTS sale_price;
