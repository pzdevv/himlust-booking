-- Enable FULL ACCESS for authenticated users (Admins)
-- This allows Delete, Update, and Insert on all trip-related tables.

-- 1. Trips Table
create policy "Admin Operations" on public.trips 
for all 
to authenticated 
using (true) 
with check (true);

-- 2. Trip Images
create policy "Admin Operations Images" on public.trip_images 
for all 
to authenticated 
using (true) 
with check (true);

-- 3. Trip Pricing
create policy "Admin Operations Pricing" on public.trip_pricing 
for all 
to authenticated 
using (true) 
with check (true);

-- 4. Trip Itinerary
create policy "Admin Operations Itinerary" on public.trip_itinerary 
for all 
to authenticated 
using (true) 
with check (true);

-- 5. Trip Meta
create policy "Admin Operations Meta" on public.trip_meta 
for all 
to authenticated 
using (true) 
with check (true);

-- 6. Storage (Allow Delete)
create policy "Admin Delete Images" on storage.objects 
for delete 
to authenticated 
using ( bucket_id = 'trip-images' );
