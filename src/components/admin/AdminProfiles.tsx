import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Eye, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type Registration = {
  id: string;
  user_id: string;
  status: string;
  visibility: string;
  email_verified_at: string | null;
  created_at: string;
  submission_data: any;
  auth_email?: string | null;
  full_name?: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  pending_email_verification: 'Email à vérifier',
  pending_admin_approval: 'À valider',
  approved: 'Approuvé',
  rejected: 'Refusé',
};

const STATUS_COLORS: Record<string, string> = {
  pending_email_verification: 'bg-muted text-muted-foreground',
  pending_admin_approval: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  approved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  rejected: 'bg-red-500/15 text-red-700 dark:text-red-400',
};

const AdminProfiles = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Registration | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).rpc('admin_list_candidate_registrations');
    if (error) toast.error(error.message);
    setRows((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: 'approved' | 'rejected' | 'pending_admin_approval') => {
    const { error } = await supabase
      .from('candidate_registrations')
      .update({ status })
      .eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === 'approved' ? 'Candidat validé' : status === 'rejected' ? 'Candidat refusé' : 'Statut mis à jour');
    setSelected(null);
    load();
  };

  const filtered = statusFilter === 'all' ? rows : rows.filter((r) => r.status === statusFilter);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Profils candidats</h1>
          <p className="text-sm text-muted-foreground mt-1">{rows.length} inscriptions · {rows.filter(r => r.status === 'pending_admin_approval').length} en attente</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {['all', 'pending_admin_approval', 'pending_email_verification', 'approved', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              'text-[10px] font-semibold px-3 py-1.5 border rounded-full transition-all',
              statusFilter === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground'
            )}
          >
            {s === 'all' ? 'Tous' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Nom</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Email</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Cabinet actuel</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Département</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Statut</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Inscrit le</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow><TableCell colSpan={7} className="text-[12px] text-muted-foreground py-6 text-center">Chargement…</TableCell></TableRow>
            )}
            {!loading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-[12px] text-muted-foreground py-6 text-center">Aucune inscription</TableCell></TableRow>
            )}
            {filtered.map((r) => {
              const d = r.submission_data || {};
              const name = `${d.prenom || ''} ${d.nom || ''}`.trim() || r.full_name || '—';
              const email = d.email || r.auth_email || '—';
              return (
                <TableRow key={r.id} className="hover:bg-muted/30">
                  <TableCell className="text-[12px] font-semibold text-foreground">{name}</TableCell>
                  <TableCell className="text-[11px]">{email}</TableCell>
                  <TableCell className="text-[11px]">{d.cabinet || '—'}</TableCell>
                  <TableCell className="text-[11px]">{d.departement || '—'}</TableCell>
                  <TableCell>
                    <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm', STATUS_COLORS[r.status])}>
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-[11px]" onClick={() => setSelected(r)}>
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      {r.status !== 'approved' && (
                        <Button size="sm" className="h-7 px-2 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setStatus(r.id, 'approved')}>
                          <Check className="w-3.5 h-3.5 mr-1" /> Valider
                        </Button>
                      )}
                      {r.status !== 'rejected' && (
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={() => setStatus(r.id, 'rejected')}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Profil candidat — détails complets</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-[12px]">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(selected.submission_data || {}).map(([k, v]) => (
                  <div key={k} className="border border-border rounded-sm p-2">
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k}</div>
                    <div className="text-[12px] break-words">
                      {typeof v === 'object' ? JSON.stringify(v) : String(v ?? '—')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProfiles;
