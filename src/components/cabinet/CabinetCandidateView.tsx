import { useEffect, useState } from 'react';
import { X, Heart, CheckCircle2 } from 'lucide-react';
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
  const [interestSent, setInterestSent] = useState(false);
  const [sending, setSending] = useState(false);

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
    setInterestSent(false);

    return () => {
      if (snap) Object.entries(snap).forEach(([k, v]) => store.setField(k as any, v));
      setHydrated(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidateId]);

  const handleInterest = async () => {
    if (sending || interestSent) return;
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase.functions.invoke('notify-cabinet-interest', {
        body: { candidateId, cabinetUserId: user.id },
      });
      if (error) throw error;
      setInterestSent(true);
    } catch (err) {
      console.error('Erreur envoi intérêt:', err);
    } finally {
      setSending(false);
    }
  };

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

        {/* Footer — bouton manifester intérêt */}
        <div className="flex-shrink-0 px-6 py-5 border-t border-white/10 bg-black/40">
          {interestSent ? (
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-sm bg-white/5 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-white/60 flex-shrink-0" />
              <div>
                <p className="text-[12px] font-sans font-medium text-white/80">Intérêt transmis à l'équipe Logan</p>
                <p className="text-[11px] font-sans text-white/40 mt-0.5">Nous vous recontacterons rapidement pour la suite.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInterest}
              disabled={sending}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-white text-[hsl(0,0%,7%)] font-sans text-[12px] font-semibold tracking-[0.12em] uppercase rounded-sm hover:bg-white/90 transition-all disabled:opacity-50"
            >
              <Heart className="w-3.5 h-3.5" />
              {sending ? 'Envoi en cours…' : 'Manifester mon intérêt pour ce profil'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default CabinetCandidateView;
