import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
    <>
      {/* Backdrop semi-transparent */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Panneau latéral droit */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-3xl bg-[hsl(0,0%,7%)] flex flex-col shadow-2xl border-l border-white/10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 flex-shrink-0">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/50 font-semibold font-sans">Profil candidat</p>
            <p className="text-[13px] font-sans font-medium text-white/80 mt-0.5">Anonymisé</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenu — vue cabinet directement */}
        <div className="flex-1 overflow-y-auto">
          {hydrated && <Step6Review readOnly cabinetView />}
          <div className="h-8" />
        </div>
      </div>
    </>
  );
};

export default CabinetCandidateView;
