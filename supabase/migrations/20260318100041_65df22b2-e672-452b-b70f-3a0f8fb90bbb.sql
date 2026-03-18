
CREATE TABLE public.logan_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  candidate_email text NOT NULL,
  candidate_cabinet text NOT NULL DEFAULT '',
  candidate_seniority text NOT NULL DEFAULT '',
  candidate_department text NOT NULL DEFAULT '',
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  user_id uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.logan_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all bookings" ON public.logan_bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage bookings" ON public.logan_bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert bookings" ON public.logan_bookings
  FOR INSERT TO public
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.logan_bookings;
