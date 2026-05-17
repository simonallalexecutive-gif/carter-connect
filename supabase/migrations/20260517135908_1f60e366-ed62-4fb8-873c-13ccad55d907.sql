CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
      NULLIF(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ''),
      NEW.email_confirmed_at IS NOT NULL
    )
    ON CONFLICT (user_id) DO UPDATE
    SET cabinet_name = COALESCE(EXCLUDED.cabinet_name, public.cabinet_accounts.cabinet_name),
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
SET search_path TO 'public'
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