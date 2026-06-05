-- Allow unauthenticated visitors (landing page) to insert bookings
DROP POLICY IF EXISTS "Authenticated users can insert own bookings" ON public.logan_bookings;

CREATE POLICY "Anyone can insert bookings" ON public.logan_bookings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
