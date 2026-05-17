REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_email_confirmation() FROM PUBLIC, anon, authenticated;