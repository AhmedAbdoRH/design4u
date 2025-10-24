/*
  # Fix Services RLS Policies

  1. Changes
    - Remove existing RLS policies for services table
    - Add new comprehensive RLS policies
      - Allow authenticated users full access (ALL operations)
      - Allow public users read-only access (SELECT operations)

  2. Security
    - Enable RLS on services table
    - Add policies for both authenticated and public users
    - Ensure proper access control based on user role
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to update services" ON services;
DROP POLICY IF EXISTS "Allow authenticated users to delete services" ON services;
DROP POLICY IF EXISTS "Allow public to read services" ON services;
DROP POLICY IF EXISTS "Allow public to view services" ON services;

-- Create new policies
CREATE POLICY "Enable read access for everyone"
ON services
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON services
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;