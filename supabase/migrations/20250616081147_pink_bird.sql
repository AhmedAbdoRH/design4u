/*
  # Add featured and best seller columns to services table

  1. Changes to services table
    - Add `is_featured` column (boolean, default false) - for marking products as "أحدث العروض" (Latest Offers)
    - Add `is_best_seller` column (boolean, default false) - for marking products as "الأكثر مبيعاً" (Best Sellers)
    - Add `gallery` column (text array, default empty array) - for storing additional product images

  2. Security
    - No changes to RLS policies needed as these are just additional columns
*/

-- Add is_featured column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE services ADD COLUMN is_featured boolean DEFAULT false;
  END IF;
END $$;

-- Add is_best_seller column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_best_seller'
  ) THEN
    ALTER TABLE services ADD COLUMN is_best_seller boolean DEFAULT false;
  END IF;
END $$;

-- Add gallery column if it doesn't exist (for storing additional product images)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'gallery'
  ) THEN
    ALTER TABLE services ADD COLUMN gallery text[] DEFAULT '{}';
  END IF;
END $$;