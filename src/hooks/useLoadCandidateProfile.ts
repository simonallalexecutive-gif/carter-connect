import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRegistrationStore } from '@/stores/registrationStore';
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

          // Populate the store with saved data
          const fields: Array<[string, any]> = [
            ['prenom', d.prenom || ''],
            ['nom', d.nom || ''],
            ['email', d.email || user.email || ''],
            ['telephone', d.telephone || ''],
            ['photoPreviewUrl', d.photoPreviewUrl || ''],
            ['linkedinUrl', d.linkedinUrl || ''],
            ['sermentMois', d.sermentMois ?? null],
            ['sermentAnnee', d.sermentAnnee ?? null],
            ['cabinet', d.cabinet || ''],
            ['departement', d.departement || ''],
            ['retrocession', d.retrocession || ''],
            ['bonus', d.bonus || ''],
            ['hasObjectifFacturable', d.hasObjectifFacturable ?? null],
            ['objectifFacturable', d.objectifFacturable || ''],
            ['objectifFacturableReel', d.objectifFacturableReel || ''],
            ['conserverRetrocession', d.conserverRetrocession ?? null],
            ['raisonsBaisseRetro', d.raisonsBaisseRetro || []],
            ['activites', d.activites || {}],
            ['pourcentages', d.pourcentages || {}],
            ['sousActivites', d.sousActivites || {}],
            ['anglais', d.anglais || ''],
            ['typesClients', d.typesClients || []],
            ['tailleOperations', d.tailleOperations || []],
            ['clienteleFrancaise', d.clienteleFrancaise ?? 50],
            ['movePriorities', d.movePriorities || []],
            ['qualitesAppreciees', d.qualitesAppreciees || []],
            ['axesAmelioration', d.axesAmelioration || []],
            ['motivation', d.motivation || ''],
            ['cabinetsCibles', d.cabinetsCibles || []],
            ['noGoCabinets', d.noGoCabinets || []],
            ['statutEcoute', d.statutEcoute || ''],
            ['visibilite', d.visibilite || data.visibility || ''],
            ['disponibilite', d.disponibilite || ''],
            ['isAssocieOrCounsel', d.isAssocieOrCounsel || false],
            ['statutAssoc', d.statutAssoc || ''],
            ['chiffreAffairesPortable', d.chiffreAffairesPortable || ''],
            ['assocExpertiseSummary', d.assocExpertiseSummary || ''],
            ['assocAttentes', d.assocAttentes || []],
            ['assocCabTypes', d.assocCabTypes || []],
            ['processusCours', d.processusCours || ''],
            // Restructuring
            ['positionnementRestr', d.positionnementRestr || []],
            ['positionnementRestrPct', d.positionnementRestrPct || {}],
            ['clienteleRestr', d.clienteleRestr || []],
            ['clienteleRestrPct', d.clienteleRestrPct || {}],
            ['restrFinancier', d.restrFinancier ?? 0],
            // Social
            ['socialConseil', d.socialConseil ?? 50],
            ['socialRelationType', d.socialRelationType || ''],
            ['socialClientele', d.socialClientele || []],
            ['socialExpertises', d.socialExpertises || []],
            // M&A
            ['maPeFonds', d.maPeFonds ?? 50],
            ['maIndusSecteurs', d.maIndusSecteurs || []],
          ];

          for (const [key, value] of fields) {
            store.setField(key as any, value);
          }
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
