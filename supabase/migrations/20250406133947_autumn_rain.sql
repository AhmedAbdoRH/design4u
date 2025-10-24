/*
  # Fix Categories RLS Policies

  1. Changes
    - Remove existing RLS policies for categories table
    - Add new comprehensive RLS policies for categories table
      - Allow authenticated users full access (ALL operations)
      - Allow public users read-only access (SELECT operations)

  2. Security
    - Enable RLS on categories table
    - Add policies for both authenticated and public users
    - Ensure proper access control based on user role
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;

-- Create new policies
CREATE POLICY "Enable read access for everyone"
ON categories
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;