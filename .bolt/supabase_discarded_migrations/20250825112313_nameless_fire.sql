/*
  # Create store_settings table

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
      - `keywords` (text array)
      - `facebook_url` (text)
      - `instagram_url` (text)
      - `twitter_url` (text)
      - `snapchat_url` (text)
      - `tiktok_url` (text)
      - `show_testimonials` (boolean, default false)
      - `theme_settings` (jsonb for storing theme configuration)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `store_settings` table
    - Add policy for authenticated users to manage settings
    - Add policy for public read access

  3. Functions
    - Create trigger function for updating `updated_at` timestamp
    - Add trigger to automatically update `updated_at` on row changes
*/

-- Create the store_settings table
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
  snapchat_url text,
  tiktok_url text,
  show_testimonials boolean DEFAULT false,
  theme_settings jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable full access for authenticated users"
  ON store_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable read access for everyone"
  ON store_settings
  FOR SELECT
  TO public
  USING (true);

-- Create or replace the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default store settings if none exist
INSERT INTO store_settings (
  store_name,
  store_description,
  meta_title,
  meta_description,
  show_testimonials,
  theme_settings
) 
SELECT 
  'متجر العطور',
  'أفضل العطور والمنتجات العالمية',
  'متجر العطور - أفضل العطور العالمية',
  'اكتشف مجموعتنا الرائعة من العطور والمنتجات العالمية بأفضل الأسعار',
  true,
  '{
    "primaryColor": "#c7a17a",
    "secondaryColor": "#fff",
    "fontFamily": "Cairo, sans-serif",
    "backgroundColor": "#000",
    "backgroundGradient": "linear-gradient(135deg, #232526 0%, #414345 100%)"
  }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM store_settings LIMIT 1);