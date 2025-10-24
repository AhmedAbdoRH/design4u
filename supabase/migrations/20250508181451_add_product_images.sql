-- Create product_images table
create table product_images (
    id uuid default uuid_generate_v4() primary key,
    service_id integer references services(id) on delete cascade,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add index for better query performance
create index idx_product_images_service_id on product_images(service_id);
