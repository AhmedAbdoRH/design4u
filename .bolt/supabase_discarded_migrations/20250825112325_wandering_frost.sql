/*
  # Create banners table

  1. New Tables
    - `banners`
      - `id` (uuid, primary key)
      - `type` (text, constrained to 'image' or 'text')
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `is_active` (boolean, default false)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `banners` table
    - Add policy for authenticated users to manage banners
    - Add policy for public read access

  3. Constraints
    - Add check constraint for banner type validation
*/

-- Create the banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type = ANY (ARRAY['image'::text, 'text'::text])),
  title text,
  description text,
  image_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable full access for authenticated users"
  ON banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for everyone"
  ON banners
  FOR SELECT
  TO public
  USING (true);