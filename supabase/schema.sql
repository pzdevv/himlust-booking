-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create trips table
create table public.trips (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  overview text,
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Challenging')),
  duration_days integer not null,
  min_pax integer default 1,
  max_pax integer default 20,
  max_altitude text,
  best_season text,
  start_point text,
  end_point text,
  status text default 'draft' check (status in ('draft', 'published')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trip images table
create table public.trip_images (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  storage_path text not null,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trip pricing table
create table public.trip_pricing (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  type text check (type in ('adult', 'child')) not null,
  price numeric(10, 2) not null,
  currency text default 'USD',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(trip_id, type)
);

-- Create trip itinerary table
create table public.trip_itinerary (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number integer not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(trip_id, day_number)
);

-- Create trip meta (highlights, included, excluded)
create table public.trip_meta (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete cascade not null,
  key text not null, -- 'highlight', 'included', 'excluded'
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  trip_id uuid references public.trips(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  adults integer default 1,
  children integer default 0,
  total_pax integer generated always as (adults + children) stored,
  total_price numeric(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.trips enable row level security;
alter table public.trip_images enable row level security;
alter table public.trip_pricing enable row level security;
alter table public.trip_itinerary enable row level security;
alter table public.trip_meta enable row level security;
alter table public.bookings enable row level security;

-- Create policies (Public Read for published trips)
create policy "Public trips are viewable by everyone." on public.trips for select using (status = 'published');
create policy "Images are viewable by everyone." on public.trip_images for select using (true);
create policy "Pricing is viewable by everyone." on public.trip_pricing for select using (true);
create policy "Itinerary is viewable by everyone." on public.trip_itinerary for select using (true);
create policy "Meta is viewable by everyone." on public.trip_meta for select using (true);

-- Create policies (Bookings insert only via service role or protected function, here allowing public insert for demo but ideally should be restricted)
create policy "Anyone can create booking." on public.bookings for insert with check (true);

-- Create Storage Bucket for images
insert into storage.buckets (id, name, public) values ('trip-images', 'trip-images', true);

-- Create Storage Policy (Public Read)
create policy "Public Access" on storage.objects for select using ( bucket_id = 'trip-images' );
