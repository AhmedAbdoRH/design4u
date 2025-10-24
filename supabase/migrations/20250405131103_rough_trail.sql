/*
  # Create services table

  1. New Tables
    - `services`
      - `id` (serial, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `price` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `services` table
    - Add policies for authenticated users to manage services
*/

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

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

CREATE POLICY "Allow authenticated users to delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow public to read services"
  ON services
  FOR SELECT
  TO anon
  USING (true);