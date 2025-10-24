/*
  # Insert default store settings record

  1. New Data
    - Insert a default store_settings record with basic configuration
    - Set logo_url to null to use local fallback
    - Include default theme settings

  2. Security
    - Uses existing RLS policies for store_settings table
*/

-- Insert default store settings if none exist
INSERT INTO store_settings (
  id,
  store_name,
  store_description,
  logo_url,
  meta_title,
  meta_description,
  theme_settings
) 
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Designs4U',
  'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
  NULL, -- Use local logo fallback
  'Designs4U - خدمات الطباعة والتطريز',
  'موقع متخصص في تصميم وتنفيذ خدمات الطباعة والتطريز وشروحات برامج التطريز',
  '{
    "primaryColor": "#c7a17a",
    "secondaryColor": "#fff",
    "fontFamily": "Cairo, sans-serif",
    "backgroundColor": "#000",
    "backgroundGradient": "linear-gradient(135deg, #232526 0%, #414345 100%)"
  }'::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM store_settings WHERE id = '00000000-0000-0000-0000-000000000001'::uuid
);