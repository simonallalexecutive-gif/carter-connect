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
      await supabase.functions.invoke('notify-validation', {
        body: {
          candidateName: candidate.full_name || candidate.auth_email || 'Candidat',
          candidateEmail: candidate.auth_email || '',
          approved,
        },
      });
      toast.success(approved ? 'Profil validé — email envoyé.' : 'Profil refusé — email envoyé.');
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

  const isPending = candidate?.status === 'pending_admin_approval';

  if (!open || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[hsl(0,0%,7%)] flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-xs font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </button>
          <div className="w-px h-4 bg-white/15" />
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40 font-semibold font-sans">Fiche candidat</p>
            <h2 className="text-sm font-sans font-medium text-white mt-0.5">
              {candidate.full_name || candidate.auth_email || '—'}
            </h2>
          </div>
        </div>
        <span className={cn(
          'text-[9px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-sm font-sans',
          candidate.status === 'approved' ? 'bg-white text-black' :
          candidate.status === 'rejected' ? 'bg-red-900/40 text-red-300 border border-red-700/30' :
          'bg-white/10 text-white/60 border border-white/15',
        )}>{statusLabel}</span>
      </div>

      {/* Profile content */}
      <div className="flex-1 overflow-y-auto">
        {hydrated && <Step6Review readOnly />}
      </div>

      {/* Action footer */}
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-black/40 flex-shrink-0">
        <button
          onClick={() => onOpenChange(false)}
          className="text-xs font-sans text-white/40 hover:text-white transition-colors"
        >
          Fermer
        </button>
        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={submitting !== null}
              onClick={() => handleDecision(false)}
              className="rounded-sm text-xs bg-transparent text-red-400 border-red-700/40 hover:bg-red-900/20 hover:text-red-300 gap-1.5"
            >
              {submitting === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              Refuser
            </Button>
            <Button
              disabled={submitting !== null}
              onClick={() => handleDecision(true)}
              className="rounded-sm text-xs bg-white text-black hover:bg-white/90 gap-1.5"
            >
              {submitting === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Valider le profil
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCandidateProfileDialog;
