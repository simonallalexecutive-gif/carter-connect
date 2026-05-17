import { supabase } from '@/integrations/supabase/client';

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await (supabase.rpc as any)('has_role', {
    _user_id: userId,
    _role: 'admin',
  });

  if (error) {
    console.error('Admin role check failed', error);
    return false;
  }

  return data === true;
};