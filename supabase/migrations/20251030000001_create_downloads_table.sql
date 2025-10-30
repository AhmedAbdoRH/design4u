-- Create downloads table if it doesn't exist
CREATE TABLE IF NOT EXISTS downloads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    download_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active downloads
CREATE POLICY "Everyone can view active downloads" 
    ON downloads FOR SELECT 
    USING (is_active = true);

-- Allow authenticated users to download files
CREATE POLICY "Authenticated users can download files" 
    ON downloads FOR SELECT 
    TO authenticated 
    USING (is_active = true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" 
    ON downloads FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Only file owner can update their files
CREATE POLICY "Users can update their own files" 
    ON downloads FOR UPDATE 
    TO authenticated 
    USING (auth.uid() = uploaded_by) 
    WITH CHECK (auth.uid() = uploaded_by);

-- Only file owner can delete their files
CREATE POLICY "Users can delete their own files" 
    ON downloads FOR DELETE 
    TO authenticated 
    USING (auth.uid() = uploaded_by);

-- Storage bucket policies
-- First ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('downloads', 'downloads', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload files to downloads"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'downloads');

-- Create storage policy for authenticated downloads
CREATE POLICY "Authenticated users can download files"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'downloads');

-- Create storage policy for file owners to delete
CREATE POLICY "Users can delete their own files"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'downloads' AND auth.uid()::text = owner);