import { supabase } from '@/integrations/supabase/client';

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle();

  if (error) {
    console.error('Admin role check failed', error);
    return false;
  }

  return data?.role === 'admin';
};