import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
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
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Snapshot original store state so we can restore on close
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!open || !candidate) return;
    // Snapshot current store fields (only persistable + a few we touch)
    const snap: Record<string, any> = {};
    Object.keys(store).forEach((k) => {
      const v = (store as any)[k];
      if (typeof v !== 'function') snap[k] = v;
    });
    setSnapshot(snap);

    // Reset to a clean baseline, then hydrate
    store.reset();
    const data = candidate.submission_data || {};
    hydrateRegistration(data, store.setField as any);
    if (candidate.auth_email && !data.email) store.setField('email', candidate.auth_email);
    if (candidate.visibility && !data.visibilite) store.setField('visibilite', candidate.visibility as any);

    // Resolve signed photo url
    (async () => {
      if (data.photoStoragePath) {
        const { data: signed } = await supabase.storage
          .from('candidate-files')
          .createSignedUrl(data.photoStoragePath, 60 * 30);
        if (signed?.signedUrl) {
          setPhotoUrl(signed.signedUrl);
          store.setField('photoPreviewUrl', signed.signedUrl);
        }
      }
    })();

    setHydrated(true);
    return () => {
      // Restore on close
      if (snap) {
        Object.entries(snap).forEach(([k, v]) => store.setField(k as any, v));
      }
      setHydrated(false);
      setPhotoUrl('');
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
    if (candidate.status === 'approved') return 'Profil déjà validé';
    if (candidate.status === 'rejected') return 'Profil refusé';
    if (candidate.status === 'pending_email_verification') return 'En attente de confirmation email';
    return 'En attente de validation';
  }, [candidate]);

  const isPending = candidate?.status === 'pending_admin_approval';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[92vh] p-0 overflow-hidden flex flex-col gap-0 bg-white text-black border border-black/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/60 font-semibold">Fiche candidat</p>
            <h2 className="text-base font-serif text-black mt-0.5">
              {candidate?.full_name || candidate?.auth_email || '—'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'text-[10px] font-semibold tracking-[0.08em] uppercase px-2.5 py-1 rounded-sm',
              candidate?.status === 'approved' ? 'bg-black text-white' :
              candidate?.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-black/5 text-black border border-black/15',
            )}>{statusLabel}</span>
          </div>
        </div>

        {/* Body — render Step6Review hydrated */}
        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-6">
          <div className="profile-light bg-white text-black border border-black/10 rounded-sm shadow-sm">
            {hydrated && candidate && (
              <Step6Review readOnly />
            )}
          </div>
        </div>


        {/* Action footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-black/10 bg-white">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-sm text-xs bg-white text-black border-black/20 hover:bg-black/5">
            Fermer
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={submitting !== null}
              onClick={() => handleDecision(false)}
              className="rounded-sm text-xs bg-white text-red-700 border-red-300 hover:bg-red-50 hover:text-red-700 gap-1.5"
            >
              {submitting === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
              Refuser
            </Button>
            <Button
              disabled={submitting !== null}
              onClick={() => handleDecision(true)}
              className="rounded-sm text-xs bg-black text-white hover:bg-black/85 gap-1.5"
            >
              {submitting === 'approve' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Valider le profil
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCandidateProfileDialog;
