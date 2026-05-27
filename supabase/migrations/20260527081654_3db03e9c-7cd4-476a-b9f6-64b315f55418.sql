
-- 1. Extend cabinet_accounts with rich profile data
ALTER TABLE public.cabinet_accounts
  ADD COLUMN IF NOT EXISTS submission_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS palier text DEFAULT 'business',
  ADD COLUMN IF NOT EXISTS searches jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS contacts jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Admin function to list cabinet accounts
CREATE OR REPLACE FUNCTION public.admin_list_cabinet_accounts()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  cabinet_name text,
  is_verified boolean,
  logo_url text,
  palier text,
  submission_data jsonb,
  searches jsonb,
  contacts jsonb,
  created_at timestamptz,
  auth_email text,
  full_name text
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT ca.id, ca.user_id, ca.cabinet_name, ca.is_verified, ca.logo_url, ca.palier,
         ca.submission_data, ca.searches, ca.contacts, ca.created_at,
         u.email::text AS auth_email,
         p.full_name
  FROM public.cabinet_accounts ca
  LEFT JOIN auth.users u ON u.id = ca.user_id
  LEFT JOIN public.profiles p ON p.user_id = ca.user_id
  ORDER BY ca.created_at DESC;
END;
$$;

-- 3. Storage buckets (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('candidate-files', 'candidate-files', false)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cabinet-files', 'cabinet-files', false)
  ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies — candidate-files
CREATE POLICY "Candidates can read own files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'candidate-files'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Candidates can upload own files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'candidate-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Candidates can update own files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'candidate-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Candidates can delete own files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'candidate-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 5. Storage policies — cabinet-files
CREATE POLICY "Cabinets can read own files"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cabinet-files'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Cabinets can upload own files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cabinet-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Cabinets can update own files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cabinet-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Cabinets can delete own files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cabinet-files'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
