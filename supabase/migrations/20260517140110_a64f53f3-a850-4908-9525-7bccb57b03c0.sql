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
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'full_name', ''), 'Cabinet'),
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

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;