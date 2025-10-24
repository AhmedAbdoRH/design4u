/*
  # Add storage bucket and policies for services

  1. Storage Setup
    - Create 'services' storage bucket if it doesn't exist
    - Enable RLS on the bucket
  
  2. Security
    - Add policy to allow authenticated users to upload files
    - Add policy to allow public read access to files
*/

-- Create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('services', 'services', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Create policy to allow authenticated users to upload files
create policy "Allow authenticated users to upload files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'services'
  and owner = auth.uid()
);

-- Create policy to allow authenticated users to update their files
create policy "Allow authenticated users to update their files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'services'
  and owner = auth.uid()
)
with check (
  bucket_id = 'services'
  and owner = auth.uid()
);

-- Create policy to allow authenticated users to delete their files
create policy "Allow authenticated users to delete their files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'services'
  and owner = auth.uid()
);

-- Create policy to allow public read access to files
create policy "Allow public read access to files"
on storage.objects for select
to public
using (bucket_id = 'services');