-- Allow authenticated users (admins) to view bookings
CREATE POLICY "Authenticated users can view bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated 
USING (true);
