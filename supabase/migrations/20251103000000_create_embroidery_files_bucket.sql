/*
  # Create embroidery-files storage bucket
  
  1. Storage Setup
    - Create 'embroidery-files' storage bucket if it doesn't exist
  
  Note: Storage policies must be created manually from Supabase Dashboard
  Go to Storage > Policies > embroidery-files and add the following policies:
  
  - INSERT: Allow authenticated users
  - SELECT: Allow public (for downloading)
  - UPDATE: Allow authenticated users
  - DELETE: Allow authenticated users
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('embroidery-files', 'embroidery-files', true)
ON CONFLICT (id) DO NOTHING;

