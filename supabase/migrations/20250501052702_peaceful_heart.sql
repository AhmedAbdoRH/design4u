/*
  # Add banner management table and policies

  1. New Tables
    - `banners`
      - `id` (uuid, primary key)
      - `type` (text) - either 'image' or 'text'
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
      - `is_active` (boolean)

  2. Security
    - Enable RLS on banners table
    - Add policies for authenticated users to manage banners
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('image', 'text')),
  title text,
  description text,
  image_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for everyone"
ON banners
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON banners
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);