-- Add strip banner type to banners table
-- This migration adds a new banner type 'strip' for banner strips that appear below the main banner

-- First, drop the existing check constraint
ALTER TABLE banners DROP CONSTRAINT IF EXISTS banners_type_check;

-- Add the new check constraint that includes 'strip' type
ALTER TABLE banners ADD CONSTRAINT banners_type_check 
CHECK (type IN ('image', 'text', 'strip'));

-- Add a new column for strip banner specific properties
ALTER TABLE banners ADD COLUMN IF NOT EXISTS strip_text_color text DEFAULT '#ffffff';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS strip_background_color text DEFAULT '#2a2a2a';
ALTER TABLE banners ADD COLUMN IF NOT EXISTS strip_position text DEFAULT 'below_main' CHECK (strip_position IN ('above_main', 'below_main'));

-- Update the comment for the table
COMMENT ON TABLE banners IS 'Banners table supporting image, text, and strip banner types';
COMMENT ON COLUMN banners.type IS 'Banner type: image, text, or strip';
COMMENT ON COLUMN banners.strip_text_color IS 'Text color for strip banners (hex color)';
COMMENT ON COLUMN banners.strip_background_color IS 'Background color for strip banners (hex color)';
COMMENT ON COLUMN banners.strip_position IS 'Position of strip banner relative to main banner';
