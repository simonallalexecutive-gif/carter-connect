GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_candidate_registrations() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_cabinet_accounts() TO authenticated, service_role;