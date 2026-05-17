REVOKE EXECUTE ON FUNCTION public.admin_list_candidate_registrations() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.admin_list_candidate_registrations() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_candidate_registrations() TO authenticated;