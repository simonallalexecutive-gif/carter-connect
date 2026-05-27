
REVOKE EXECUTE ON FUNCTION public.admin_list_cabinet_accounts() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.admin_list_cabinet_accounts() TO authenticated;
