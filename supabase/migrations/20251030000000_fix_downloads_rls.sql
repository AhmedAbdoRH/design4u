-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Downloads are viewable by everyone" ON downloads;
DROP POLICY IF EXISTS "Uploads are insertable by authenticated users" ON downloads;

-- Create the function to handle uploaded_by
CREATE OR REPLACE FUNCTION public.handle_uploaded_by()
RETURNS TRIGGER AS $$
BEGIN
  NEW.uploaded_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_uploaded_by ON downloads;

-- Create trigger
CREATE TRIGGER set_uploaded_by
  BEFORE INSERT ON downloads
  FOR EACH ROW
  EXECUTE FUNCTION handle_uploaded_by();

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Downloads are viewable by everyone"
ON downloads FOR SELECT
USING (true);

CREATE POLICY "Uploads are insertable by authenticated users"
ON downloads FOR INSERT
WITH CHECK (auth.role() = 'authenticated');