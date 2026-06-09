-- Assigne automatiquement le rôle admin à l'email admin connu,
-- à la création ou mise à jour de l'utilisateur dans auth.users.
CREATE OR REPLACE FUNCTION public.assign_admin_role_if_admin_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'simonallal.executive@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_admin_role ON auth.users;
CREATE TRIGGER trg_assign_admin_role
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_admin_role_if_admin_email();

-- Applique immédiatement si l'utilisateur admin existe déjà
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'simonallal.executive@gmail.com'
ON CONFLICT DO NOTHING;
