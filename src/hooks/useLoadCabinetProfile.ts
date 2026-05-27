import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCabinetStore } from '@/stores/cabinetStore';
import { hydrateCabinet } from '@/lib/cabinetSerializer';
import type { User } from '@supabase/supabase-js';

/**
 * Hydrates the cabinet Zustand store from `cabinet_accounts` for the signed-in user.
 * Generates a signed URL for the logo when stored in the `cabinet-files` bucket.
 */
export const useLoadCabinetProfile = (user: User | null) => {
  const [loaded, setLoaded] = useState(false);
  const setField = useCabinetStore((s) => s.setField);

  useEffect(() => {
    if (!user || loaded) return;

    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('cabinet_accounts')
          .select('cabinet_name, logo_url, palier, submission_data, contacts, searches')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Failed to load cabinet profile:', error);
        } else if (data) {
          // Resolve signed URL for logo if it is a storage path
          let resolvedLogoUrl = data.logo_url || '';
          if (resolvedLogoUrl && !resolvedLogoUrl.startsWith('http') && !resolvedLogoUrl.startsWith('data:')) {
            const { data: signed } = await supabase.storage
              .from('cabinet-files')
              .createSignedUrl(resolvedLogoUrl, 60 * 60);
            if (signed?.signedUrl) resolvedLogoUrl = signed.signedUrl;
          }
          hydrateCabinet({ ...data, logo_url: resolvedLogoUrl }, setField as any);
        }

        // Fallback to user metadata for cabinet name
        const meta = user.user_metadata;
        if (!data?.cabinet_name && meta?.full_name) {
          setField('cabinetName', meta.full_name);
        }
        if (user.email) setField('email', user.email);
      } catch (err) {
        console.error('Error loading cabinet profile:', err);
      } finally {
        setLoaded(true);
      }
    };

    load();
  }, [user, loaded, setField]);

  return { loaded };
};
