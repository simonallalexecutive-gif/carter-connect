
CREATE OR REPLACE FUNCTION public.admin_list_candidate_registrations()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  status text,
  visibility text,
  email_verified_at timestamptz,
  created_at timestamptz,
  submission_data jsonb,
  auth_email text,
  full_name text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT cr.id, cr.user_id, cr.status, cr.visibility, cr.email_verified_at,
         cr.created_at, cr.submission_data,
         u.email::text AS auth_email,
         p.full_name
  FROM public.candidate_registrations cr
  LEFT JOIN auth.users u ON u.id = cr.user_id
  LEFT JOIN public.profiles p ON p.user_id = cr.user_id
  ORDER BY cr.created_at DESC;
END;
$$;
