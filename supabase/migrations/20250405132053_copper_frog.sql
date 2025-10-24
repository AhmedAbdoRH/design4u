/*
  # Update services and categories schema

  1. Tables
    - Safely create `categories` if not exists
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `created_at` (timestamp)
    - Safely create `services` if not exists
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to categories)
      - `title` (text, required)
      - `description` (text)
      - `image_url` (text)
      - `price` (text)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Add policies for public users to view content
*/

-- Safe creation of categories table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'categories') THEN
    CREATE TABLE categories (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      description text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Safe creation of services table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'services') THEN
    CREATE TABLE services (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
      title text NOT NULL,
      description text,
      image_url text,
      price text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Categories policies
  DROP POLICY IF EXISTS "Allow public to view categories" ON categories;
  DROP POLICY IF EXISTS "Allow authenticated to manage categories" ON categories;
  
  -- Services policies
  DROP POLICY IF EXISTS "Allow public to view services" ON services;
  DROP POLICY IF EXISTS "Allow authenticated to manage services" ON services;
END $$;

-- Create policies
CREATE POLICY "Allow public to view categories" 
ON categories FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated to manage categories" 
ON categories FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow public to view services" 
ON services FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated to manage services" 
ON services FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);