-- Add subcategory_id to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_services_subcategory_id ON services(subcategory_id);

-- Add comment for documentation
COMMENT ON COLUMN services.subcategory_id IS 'Reference to the subcategory this service belongs to';


