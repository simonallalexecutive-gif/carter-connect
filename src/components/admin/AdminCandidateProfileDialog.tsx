import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2, ArrowLeft } from 'lucide-react';
import { useRegistrationStore } from '@/stores/registrationStore';
import { hydrateRegistration } from '@/lib/registrationSerializer';
import { supabase } from '@/integrations/supabase/client';
import Step6Review from '@/components/registration/Step6Review';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: string;
    user_id: string;
    status: string;
    submission_data: any;
    auth_email: string | null;
    full_name: string | null;
    visibility?: string;
  } | null;
  onUpdated?: () => void;
}

const AdminCandidateProfileDialog = ({ open, onOpenChange, candidate, onUpdated }: Props) => {
  const store = useRegistrationStore();
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState<null | 'approve' | 'reject'>(null);
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!open || !candidate) return;
    const snap: Record<string, any> = {};
    Object.keys(store).forEach((k) => {
      const v = (store as any)[k];
      if (typeof v !== 'function') snap[k] = v;
    });
    setSnapshot(snap);
    store.reset();
    const data = candidate.submission_data || {};
    hydrateRegistration(data, store.setField as any);
    if (candidate.auth_email && !data.email) store.setField('email', candidate.auth_email);
    if (candidate.visibility && !data.visibilite) store.setField('visibilite', candidate.visibility as any);

    (async () => {
      if (data.photoStoragePath) {
        const { data: signed } = await supabase.storage
          .from('candidate-files')
          .createSignedUrl(data.photoStoragePath, 60 * 30);
        if (signed?.signedUrl) store.setField('photoPreviewUrl', signed.signedUrl);
      }
    })();

    setHydrated(true);
    return () => {
      if (snap) Object.entries(snap).forEach(([k, v]) => store.setField(k as any, v));
      setHydrated(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, candidate?.id]);

  const handleDecision = async (approved: boolean) => {
    if (!candidate) return;
    setSubmitting(approved ? 'approve' : 'reject');
    try {
      const { error } = await supabase
        .from('candidate_registrations')
        .update({ status: approved ? 'approved' : 'rejected' })
        .eq('user_id', candidate.user_id);
      if (error) throw error;
      if (approved) {
        await supabase.functions.invoke('notify-validation', {
          body: {
            candidateName: candidate.full_name || candidate.auth_email || 'Candidat',
            candidateEmail: candidate.auth_email || '',
            approved: true,
          },
        });
        toast.success('Profil validé — email envoyé.');
      } else {
        toast.success('Profil refusé.');
      }
      onUpdated?.();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setSubmitting(null);
    }
  };

  const statusLabel = useMemo(() => {
    if (!candidate) return '';
    if (candidate.status === 'approved') return 'Validé';
    if (candidate.status === 'rejected') return 'Refusé';
    if (candidate.status === 'pending_email_verification') return 'Email non confirmé';
    return 'En attente de validation';
  }, [candidate]);

  const isPending = candidate?.status !== 'approved' && candidate?.status !== 'rejected';

  if (!open || !candidate) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={() => onOpenChange(false)} />

      {/* Drawer latéral */}
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-white flex flex-col shadow-2xl border-l border-black/8">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.18em] text-black/40 font-semibold font-sans">Fiche candidat</p>
              <h2 className="text-[14px] font-sans font-semibold text-black mt-0.5">
                {candidate.full_name || candidate.auth_email || '—'}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'text-[9px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm font-sans',
              candidate.status === 'approved' ? 'bg-black text-white' :
              candidate.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' :
              'bg-black/5 text-black/60 border border-black/10',
            )}>{statusLabel}</span>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 text-black/40 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {hydrated && <Step6Review readOnly hideStepHeader />}
          <div className="h-8" />
        </div>

        {/* Action footer */}
        {isPending && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-black/10 bg-white flex-shrink-0">
            <Button
              variant="outline"
              disabled={submitting !== null}
              onClick={() => handleDecision(false)}
              className="rounded-sm text-xs bg-transparent text-red-500 border-red-200 hover:bg-red-50 gap-1.5"
            >
              {submitting === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              Refuser
            </Button>
            <Button
              disabled={submitting !== null}
              onClick={() => handleDecision(true)}
              className="rounded-sm text-xs bg-black text-white hover:bg-black/80 gap-1.5"
            >
              {submitting === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Valider le profil
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminCandidateProfileDialog;
