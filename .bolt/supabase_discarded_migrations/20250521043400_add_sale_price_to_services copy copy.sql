-- Add sale_price column to services table
ALTER TABLE services 
ADD COLUMN sale_price TEXT DEFAULT NULL;

-- Update RLS policies to include the new column
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;

-- Recreate the policies to include the new column
CREATE POLICY "Allow authenticated users to insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
