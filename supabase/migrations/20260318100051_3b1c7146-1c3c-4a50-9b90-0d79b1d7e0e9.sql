
DROP POLICY "Anyone can insert bookings" ON public.logan_bookings;
CREATE POLICY "Authenticated users can insert own bookings" ON public.logan_bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
