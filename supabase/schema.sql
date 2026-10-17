-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (Public Profile)
-- Extends auth.users to store custom user data
create table if not exists public.users (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  address jsonb,
  is_admin boolean default false,
  admin_pin text default '123456',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup Row Level Security (RLS) for users
alter table public.users enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.users for select
  using ( true );

create policy "Users can insert their own profile."
  on public.users for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.users for update
  using ( auth.uid() = id );

-- Products table
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  category text not null,
  image_url text,
  images jsonb default '[]'::jsonb,
  stock_quantity integer default 0,
  glow_color text default 'rgba(35, 95, 175, 0.55)',
  display_order integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup RLS for products
alter table public.products enable row level security;

create policy "Products are viewable by everyone."
  on public.products for select
  using ( true );

-- Only admins can modify products (assuming you will handle admin roles later)
-- Only admins can modify products
create policy "Admins can insert products"
  on public.products for insert
  with check ( 
    exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Admins can update products"
  on public.products for update
  using ( 
    exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Admins can delete products"
  on public.products for delete
  using ( 
    exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

-- Orders table
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete set null,
  status text not null default 'pending', -- pending, paid, shipped, delivered, cancelled
  total_amount numeric(10, 2) not null,
  shipping_address jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup RLS for orders
alter table public.orders enable row level security;

create policy "Users can view their own orders."
  on public.orders for select
  using ( auth.uid() = user_id or exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true) );

create policy "Users can insert their own orders."
  on public.orders for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own orders (e.g. cancel)."
  on public.orders for update
  using ( auth.uid() = user_id or exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true) );

-- Order Items table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity integer not null default 1,
  unit_price numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup RLS for order items
alter table public.order_items enable row level security;

create policy "Users can view their own order items."
  on public.order_items for select
  using ( 
    exists (
      select 1 from public.orders
      where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
    ) or exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Users can insert their own order items."
  on public.order_items for insert
  with check ( 
    exists (
      select 1 from public.orders
      where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
    )
  );

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, first_name, last_name, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create the Storage Bucket for Product Images
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow public read access to product images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Allow authenticated admins to upload/modify images
create policy "Admins can upload images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images' 
    and exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Admins can update images"
  on storage.objects for update
  using (
    bucket_id = 'product-images' 
    and exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Admins can delete images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images' 
    and exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

-- Store Settings Table
create table if not exists public.store_settings (
  id integer primary key default 1,
  bank_name text,
  account_title text,
  account_number text,
  iban text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure only one row exists
alter table public.store_settings add constraint store_settings_single_row check (id = 1);

-- Insert default row if not exists
insert into public.store_settings (id, bank_name, account_title, account_number, iban)
values (1, 'Premium Global Bank', 'Orvano Official', '1234-5678-9012', 'PK36 PGBK 1234 5678 9012')
on conflict (id) do nothing;

-- Setup RLS
alter table public.store_settings enable row level security;

-- Public can read
create policy "Public can read store settings"
  on public.store_settings for select
  using ( true );

-- Only admins can update
create policy "Admins can update store settings"
  on public.store_settings for update
  using ( 
    exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

create policy "Admins can insert store settings"
  on public.store_settings for insert
  with check ( 
    exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true)
  );

-- Add site image columns to store_settings
alter table public.store_settings 
add column if not exists hero_watch_image text default '/images/watch.png',
add column if not exists hero_pants_image text default '/images/pants.png',
add column if not exists premium_box_image text default '/images/box-watch.jpeg';

-- Contact Messages Table
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  status text default 'unread', -- unread, read, replied
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Setup RLS for contact messages
alter table public.contact_messages enable row level security;

-- Public can insert messages
create policy "Public can insert contact messages"
  on public.contact_messages for insert
  with check ( true );

-- Only admins can read/update/delete messages
create policy "Admins can select contact messages"
  on public.contact_messages for select
  using ( exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true) );

create policy "Admins can update contact messages"
  on public.contact_messages for update
  using ( exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true) );

create policy "Admins can delete contact messages"
  on public.contact_messages for delete
  using ( exists (select 1 from public.users where users.id = auth.uid() and users.is_admin = true) );

-- Add social/contact columns to store_settings
alter table public.store_settings 
add column if not exists phone_number text default '+1 (800) 555-0199',
add column if not exists whatsapp_number text default '+92 300 0138707',
add column if not exists instagram_url text default 'https://instagram.com/orvano.official',
add column if not exists tiktok_url text default 'https://tiktok.com/@orvano',
add column if not exists facebook_url text default 'https://facebook.com/orvano';

-- Add display_order & glow_color columns to products table
alter table public.products 
add column if not exists display_order integer default 1,
add column if not exists glow_color text default 'rgba(35, 95, 175, 0.55)';

-- Add dedicated columns to store_settings
alter table public.store_settings 
add column if not exists hero_slides jsonb default '[]'::jsonb,
add column if not exists popup_cards jsonb default '[]'::jsonb,
add column if not exists coupons jsonb default '[]'::jsonb,
add column if not exists shipping_fee numeric(10, 2) default 0,
add column if not exists free_shipping_threshold numeric(10, 2) default 0,
add column if not exists watch_packaging_image text default '/images/box-watch.jpeg',
add column if not exists watch_packaging_desc text,
add column if not exists pants_packaging_image text default '/images/pants.png',
add column if not exists pants_packaging_desc text;

