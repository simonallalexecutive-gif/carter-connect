import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { hydrateRegistration } from '@/lib/registrationSerializer';
import { supabase } from '@/integrations/supabase/client';
import Step6Review from '@/components/registration/Step6Review';

interface Props {
  open: boolean;
  onClose: () => void;
  submissionData: any;
  candidateId: string;
}

const CabinetCandidateView = ({ open, onClose, submissionData, candidateId }: Props) => {
  const store = useRegistrationStore();
  const [hydrated, setHydrated] = useState(false);
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!open || !submissionData) return;

    // Snapshot current store state to restore on close
    const snap: Record<string, any> = {};
    Object.keys(store).forEach((k) => {
      const v = (store as any)[k];
      if (typeof v !== 'function') snap[k] = v;
    });
    setSnapshot(snap);

    store.reset();
    hydrateRegistration(submissionData, store.setField as any);

    (async () => {
      if (submissionData.photoStoragePath) {
        const { data: signed } = await supabase.storage
          .from('candidate-files')
          .createSignedUrl(submissionData.photoStoragePath, 60 * 30);
        if (signed?.signedUrl) store.setField('photoPreviewUrl', signed.signedUrl);
      }
    })();

    setHydrated(true);

    return () => {
      if (snap) Object.entries(snap).forEach(([k, v]) => store.setField(k as any, v));
      setHydrated(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidateId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(0,0%,7%)] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/20 bg-black/60 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </button>
          <div className="w-px h-4 bg-white/15" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/60 font-semibold font-sans">Profil candidat</p>
            <p className="text-[13px] font-sans font-medium text-white/70 mt-0.5">Anonymisé</p>
          </div>
        </div>
      </div>

      {/* Profile content — starts directly in cabinet view mode */}
      <div className="flex-1 overflow-y-auto">
        {hydrated && <Step6Review readOnly cabinetView />}
        <div className="h-8" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/20 bg-black/60 flex-shrink-0">
        <button
          onClick={onClose}
          className="text-xs font-sans text-white/40 hover:text-white transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default CabinetCandidateView;
