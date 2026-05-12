
-- 1. Grant admin role to simon.j.allal@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'simon.j.allal@gmail.com'
ON CONFLICT DO NOTHING;

-- 2. Update handle_new_user to also persist candidate_registrations from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, avatar_url, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidat')
  );

  IF COALESCE(NEW.raw_user_meta_data->>'user_type','candidat') = 'candidat'
     AND NEW.raw_user_meta_data ? 'submission_data' THEN
    INSERT INTO public.candidate_registrations (
      user_id, submission_data, visibility, no_go_cabinets, status
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->'submission_data', '{}'::jsonb),
      COALESCE(NEW.raw_user_meta_data->>'visibility', 'confidentiel'),
      COALESCE(
        ARRAY(SELECT jsonb_array_elements_text(NEW.raw_user_meta_data->'no_go_cabinets')),
        '{}'::text[]
      ),
      'pending_email_verification'
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 3. When email gets confirmed, transition candidate registration to pending_admin_approval
CREATE OR REPLACE FUNCTION public.handle_email_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    UPDATE public.candidate_registrations
    SET status = 'pending_admin_approval',
        email_verified_at = NEW.email_confirmed_at,
        updated_at = now()
    WHERE user_id = NEW.id
      AND status = 'pending_email_verification';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

-- 4. Backfill: existing candidates without registration row -> mark approved so they keep access
INSERT INTO public.candidate_registrations (user_id, submission_data, status, email_verified_at)
SELECT u.id, '{}'::jsonb, 'approved', u.email_confirmed_at
FROM auth.users u
JOIN public.profiles p ON p.user_id = u.id AND p.user_type = 'candidat'
WHERE NOT EXISTS (SELECT 1 FROM public.candidate_registrations cr WHERE cr.user_id = u.id);

-- 5. Allow admins to view & update any candidate registration (already covered by has_role checks in existing policies — verify)
-- Existing policies already allow admin via has_role(); nothing else needed.
