/*
  # Add category foreign key to services table

  1. Changes
    - Add category_id column to services table
    - Add foreign key constraint to link services with categories
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add category_id column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'services' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE services ADD COLUMN category_id uuid REFERENCES categories(id);
  END IF;
END $$;