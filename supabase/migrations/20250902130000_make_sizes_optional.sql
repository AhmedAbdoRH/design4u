-- Add price and sale_price columns back to the services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS price NUMERIC,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC;

-- Add a flag to indicate if a service uses the multi-size pricing system
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS has_multiple_sizes BOOLEAN DEFAULT FALSE;

-- Add comments for new columns
COMMENT ON COLUMN public.services.price IS 'The base price of the service, used when has_multiple_sizes is false.';
COMMENT ON COLUMN public.services.sale_price IS 'The sale price of the service, used when has_multiple_sizes is false.';
COMMENT ON COLUMN public.services.has_multiple_sizes IS 'If true, prices are determined by the product_sizes table. If false, the price and sale_price columns on this table are used.';
