/*
  # Add theme_settings column to store_settings table

  1. Changes
    - Add `theme_settings` column to `store_settings` table as JSONB type
    - This will allow storing flexible JSON data for theme configurations

  2. Notes
    - Column is nullable to maintain compatibility with existing data
    - JSONB type allows for efficient querying and indexing of JSON data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'store_settings' AND column_name = 'theme_settings'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN theme_settings JSONB;
  END IF;
END $$;