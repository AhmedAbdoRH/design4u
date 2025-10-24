/*
  # Add store settings table

  1. New Tables
    - `store_settings`
      - `id` (uuid, primary key)
      - `store_name` (text)
      - `store_description` (text)
      - `logo_url` (text)
      - `favicon_url` (text)
      - `og_image_url` (text)
      - `meta_title` (text)
      - `meta_description` (text)
      - `keywords` (text[])
      - `facebook_url` (text)
      - `instagram_url` (text)
      - `twitter_url` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on store_settings table
    - Add policies for authenticated users to manage settings
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text,
  store_description text,
  logo_url text,
  favicon_url text,
  og_image_url text,
  meta_title text,
  meta_description text,
  keywords text[],
  facebook_url text,
  instagram_url text,
  twitter_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for everyone"
ON store_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Enable full access for authenticated users"
ON store_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default record
INSERT INTO store_settings (id) VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;