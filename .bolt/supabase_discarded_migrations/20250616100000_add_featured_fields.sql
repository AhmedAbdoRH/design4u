-- Add is_featured and is_best_seller columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_services_best_seller ON services(is_best_seller) WHERE is_best_seller = true;

-- Update RLS policies if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Enable read access for all users') THEN
    DROP POLICY IF EXISTS "Enable read access for all users" ON services;
    CREATE POLICY "Enable read access for all users" 
    ON services
    FOR SELECT
    USING (true);
  END IF;
END $$;
