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
  )
  ON CONFLICT (user_id) DO NOTHING;

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

  IF COALESCE(NEW.raw_user_meta_data->>'user_type','candidat') = 'cabinet' THEN
    INSERT INTO public.cabinet_accounts (user_id, cabinet_name, is_verified)
    VALUES (
      NEW.id,
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'cabinet_name', ''), NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'Cabinet'),
      NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (user_id) DO UPDATE
    SET cabinet_name = COALESCE(NULLIF(EXCLUDED.cabinet_name, ''), public.cabinet_accounts.cabinet_name),
        is_verified = public.cabinet_accounts.is_verified OR EXCLUDED.is_verified,
        updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

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

    UPDATE public.cabinet_accounts
    SET is_verified = true,
        updated_at = now()
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_email_confirmation();

ALTER TABLE public.cabinet_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cabinet account" ON public.cabinet_accounts;
DROP POLICY IF EXISTS "Users can insert own cabinet account" ON public.cabinet_accounts;
DROP POLICY IF EXISTS "Users can update own cabinet account" ON public.cabinet_accounts;

CREATE POLICY "Users can view own cabinet account"
ON public.cabinet_accounts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own cabinet account"
ON public.cabinet_accounts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own cabinet account"
ON public.cabinet_accounts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'))
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_email_confirmation() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;