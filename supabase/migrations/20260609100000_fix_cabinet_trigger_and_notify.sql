-- 1. Mise à jour du trigger handle_new_user pour créer cabinet_accounts quand user_type = 'cabinet'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Toujours créer le profil
  INSERT INTO public.profiles (user_id, full_name, avatar_url, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'candidat')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Si c'est un utilisateur cabinet, créer la ligne cabinet_accounts
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', '') = 'cabinet' THEN
    INSERT INTO public.cabinet_accounts (user_id, cabinet_name, is_verified, palier)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'cabinet_name', ''),
      false,
      'business'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- 2. Insérer manuellement Karen qui est passée entre les mailles
INSERT INTO public.cabinet_accounts (user_id, cabinet_name, is_verified, palier)
VALUES (
  '28ef7439-cfdf-4fcc-9626-48384b91ed2d',
  '',
  false,
  'business'
)
ON CONFLICT (user_id) DO NOTHING;
