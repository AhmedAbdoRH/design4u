-- Add has_transparent_bg column to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS has_transparent_bg boolean DEFAULT false;

-- Update RLS to include the new column
DROP POLICY IF EXISTS "Allow public to view services" ON services;
CREATE POLICY "Allow public to view services" 
ON services FOR SELECT 
TO public 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated to manage services" ON services;
CREATE POLICY "Allow authenticated to manage services" 
ON services FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);
