import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Building2 } from 'lucide-react';

interface CabinetRow {
  id: string;
  user_id: string;
  cabinet_name: string;
  is_verified: boolean;
  logo_url: string | null;
  palier: string | null;
  submission_data: any;
  searches: any;
  contacts: any;
  created_at: string;
  auth_email: string | null;
  full_name: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cabinet: CabinetRow | null;
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="grid grid-cols-[160px_1fr] gap-3 py-3 border-b border-black/6 last:border-0">
    <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-black/45">{label}</div>
    <div className="text-[13px] text-black">{value || <span className="text-black/30">—</span>}</div>
  </div>
);

const AdminCabinetProfileDialog = ({ open, onOpenChange, cabinet }: Props) => {
  if (!cabinet) return null;

  const contact = Array.isArray(cabinet.contacts) ? cabinet.contacts[0] : null;
  const prenom  = contact?.prenom  || '';
  const nom     = contact?.nom     || '';
  const statut  = contact?.role    || '';
  const tel     = contact?.mobile  || '';
  const email   = contact?.email   || cabinet.auth_email || '';
  const inscrit = new Date(cabinet.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] p-0 overflow-hidden flex flex-col gap-0 bg-white text-black border border-black/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-black/10">
          <div className="w-9 h-9 rounded-sm bg-black/5 border border-black/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-black/40" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/45 font-semibold">Fiche cabinet</p>
            <h2 className="text-base font-serif text-black mt-0.5">{cabinet.cabinet_name || '—'}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <Field label="Prénom"   value={prenom} />
          <Field label="Nom"      value={nom} />
          <Field label="Cabinet"  value={cabinet.cabinet_name} />
          <Field label="Statut"   value={statut} />
          <Field label="Téléphone" value={tel} />
          <Field label="Email"    value={email} />
          <Field label="Inscrit le" value={inscrit} />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-black/10">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-sm text-xs bg-white text-black border-black/20 hover:bg-black/5">
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCabinetProfileDialog;
