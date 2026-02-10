-- Add pdf_path column to trips table
ALTER TABLE trips ADD COLUMN IF NOT EXISTS pdf_path TEXT;

-- Policy to allow public read of itinerary PDFs (assuming they are in a public bucket or just a link)
-- If using storage, we need storage policies. Assuming 'trip-images' bucket is used or a new one.
-- Let's stick to 'trip-images' for simplicity or 'trip-assets'.
