import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
import { hydrateRegistration } from '@/lib/registrationSerializer';
import type { User } from '@supabase/supabase-js';

/**
 * Loads candidate registration data from the database into the Zustand store.
 * This ensures the dashboard displays profile info even when the user
 * navigates directly without going through the registration flow.
 */
export const useLoadCandidateProfile = (user: User | null) => {
  const [loaded, setLoaded] = useState(false);
  const store = useRegistrationStore();

  useEffect(() => {
    if (!user || loaded) return;

    // If store already has data (user just registered), skip DB load
    if (store.prenom && store.nom && store.departement) {
      setLoaded(true);
      return;
    }

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('candidate_registrations')
          .select('submission_data, visibility')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Failed to load candidate profile:', error);
          setLoaded(true);
          return;
        }

        if (data?.submission_data) {
          const d = data.submission_data as Record<string, any>;

          // Hydrate every persisted field in one pass
          hydrateRegistration(d, store.setField as any);

          // Default email / visibility
          if (!d.email) store.setField('email', user.email || '');
          if (data.visibility && !d.visibilite) store.setField('visibilite', data.visibility as any);

          // Resolve signed URLs for photo / CV when stored in the bucket
          if (d.photoStoragePath) {
            const { data: signed } = await supabase.storage
              .from('candidate-files')
              .createSignedUrl(d.photoStoragePath, 60 * 60);
            if (signed?.signedUrl) {
              store.setField('photoPreviewUrl', signed.signedUrl);
            }
          }
          // cvStoragePath is kept in the store via hydrate; UI can resolve on demand.
        } else {
          // Fallback: populate from user metadata
          const meta = user.user_metadata;
          if (meta?.full_name) {
            const parts = meta.full_name.split(' ');
            store.setField('prenom', parts[0] || '');
            store.setField('nom', parts.slice(1).join(' ') || '');
          }
          store.setField('email', user.email || '');
        }
      } catch (err) {
        console.error('Error loading candidate profile:', err);
      } finally {
        setLoaded(true);
      }
    };

    loadProfile();
  }, [user, loaded]);

  return { loaded };
};
