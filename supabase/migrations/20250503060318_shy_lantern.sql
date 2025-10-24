/*
  # Add Snapchat and TikTok URLs to store settings

  1. Changes
    - Add snapchat_url column to store_settings table
    - Add tiktok_url column to store_settings table
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE store_settings 
ADD COLUMN IF NOT EXISTS snapchat_url text,
ADD COLUMN IF NOT EXISTS tiktok_url text;