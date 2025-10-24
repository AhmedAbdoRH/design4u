/*
  # Update Categories Table RLS Policies

  1. Changes
    - Remove existing policies
    - Add new policies for authenticated users to manage categories
    - Add policy for public read access

  2. Security
    - Enable RLS on categories table
    - Add policies for CRUD operations for authenticated users
    - Add policy for public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated to manage categories" ON categories;
DROP POLICY IF EXISTS "Allow public to view categories" ON categories;

-- Create new policies
CREATE POLICY "Enable read access for all users" 
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