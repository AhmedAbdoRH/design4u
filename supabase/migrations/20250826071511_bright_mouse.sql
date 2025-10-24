/*
  # Create testimonials table

  1. New Tables
    - `testimonials`
      - `id` (uuid, primary key)
      - `image_url` (text, nullable)
      - `is_active` (boolean, default false)
      - `created_at` (timestamp with time zone, default now())

  2. Security
    - Enable RLS on `testimonials` table
    - Add policy for authenticated users to manage testimonials
    - Add policy for public users to read active testimonials
*/

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (is_active = true);