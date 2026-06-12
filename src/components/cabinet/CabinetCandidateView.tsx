import { useEffect, useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
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
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panneau latéral — fond blanc, plus étroit */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-white flex flex-col shadow-2xl border-l border-black/8">

        {/* Barre minimale : juste le bouton fermer */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <p className="text-[9px] uppercase tracking-[0.22em] text-black/35 font-semibold font-sans">Profil anonymisé</p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors text-black/40 hover:text-black/70"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Dark card Step6Review — compact */}
          {hydrated && (
            <div className="mx-4 mt-2 rounded-md overflow-hidden">
              <Step6Review readOnly cabinetView />
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-[10px] font-sans text-black/35 px-5 mt-3 mb-4 leading-relaxed">
            Non visible : nom, prénom, email, téléphone, nom du cabinet actuel.
          </p>
        </div>

        {/* Footer — bloc intérêt style dark card */}
        <div className="flex-shrink-0 px-4 pb-5 pt-2">
          {interestSent ? (
            <div className="flex items-center gap-3 bg-[hsl(0,0%,10%)] rounded-md px-5 py-4">
              <CheckCircle2 className="w-4 h-4 text-white/50 flex-shrink-0" />
              <div>
                <p className="text-[12px] font-sans font-medium text-white/90">Intérêt transmis à l'équipe Logan</p>
                <p className="text-[11px] font-sans text-white/45 mt-0.5">Nous vous recontacterons rapidement.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[hsl(0,0%,10%)] rounded-md px-5 py-5">
              <p className="font-serif text-[16px] text-white font-light mb-1">Ce candidat vous intéresse&nbsp;?</p>
              <p className="text-[11px] font-sans text-white/45 leading-relaxed mb-4">
                Manifestez votre intérêt pour ce candidat, Logan se charge du reste pour vous.
              </p>
              <button
                onClick={handleInterest}
                disabled={sending}
                className="w-full py-3 bg-white text-[hsl(0,0%,7%)] font-sans text-[11.5px] font-semibold tracking-[0.1em] uppercase rounded-sm hover:bg-white/90 transition-all disabled:opacity-50"
              >
                {sending ? 'Envoi en cours…' : 'Ce candidat m\'intéresse →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CabinetCandidateView;
