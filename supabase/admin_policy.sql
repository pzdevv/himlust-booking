-- Drop existing restrictive policies if necessary or just add new permissive ones
-- For simplicity in this development/admin phase without specific auth roles:

-- Allow ALL operations on trips for now (so admin form works)
create policy "Admin Insert Trips" on public.trips for insert with check (true);
create policy "Admin Update Trips" on public.trips for update using (true);

-- Allow ALL operations on trip_images
create policy "Admin Manage Images" on public.trip_images for all using (true);

-- Allow ALL operations on trip_pricing
create policy "Admin Manage Pricing" on public.trip_pricing for all using (true);

-- Allow ALL operations on trip_itinerary
create policy "Admin Manage Itinerary" on public.trip_itinerary for all using (true);

-- Allow ALL operations on trip_meta
create policy "Admin Manage Meta" on public.trip_meta for all using (true);

-- Allow Storage Uploads
create policy "Admin Upload Images" on storage.objects for insert with check ( bucket_id = 'trip-images' );
