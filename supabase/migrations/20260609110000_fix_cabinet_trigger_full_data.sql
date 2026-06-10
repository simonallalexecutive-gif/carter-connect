-- Trigger mis à jour : crée cabinet_accounts avec toutes les données du formulaire
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  contact_json jsonb;
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

  -- Si c'est un utilisateur cabinet, créer la ligne cabinet_accounts avec toutes les données
  IF COALESCE(NEW.raw_user_meta_data->>'user_type', '') = 'cabinet' THEN
    contact_json := jsonb_build_object(
      'prenom',  COALESCE(NEW.raw_user_meta_data->>'contact_prenom', ''),
      'nom',     COALESCE(NEW.raw_user_meta_data->>'contact_nom', ''),
      'role',    COALESCE(NEW.raw_user_meta_data->>'contact_role', ''),
      'mobile',  COALESCE(NEW.raw_user_meta_data->>'contact_mobile', ''),
      'email',   COALESCE(NEW.raw_user_meta_data->>'contact_email', NEW.email, '')
    );

    INSERT INTO public.cabinet_accounts (user_id, cabinet_name, contacts, is_verified, palier)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'cabinet_name', ''),
      jsonb_build_array(contact_json),
      false,
      'business'
    )
    ON CONFLICT (user_id) DO UPDATE SET
      cabinet_name = EXCLUDED.cabinet_name,
      contacts     = EXCLUDED.contacts,
      palier       = EXCLUDED.palier;
  END IF;

  RETURN NEW;
END;
$$;
