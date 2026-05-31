import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import AdminCandidateProfileDialog from './AdminCandidateProfileDialog';

type CandidateRow = {
  id: string;
  user_id: string;
  status: string;
  visibility: string;
  email_verified_at: string | null;
  created_at: string;
  submission_data: any;
  auth_email: string | null;
  full_name: string | null;
};

type CabinetRow = {
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
};

const STATUS_COLORS: Record<string, string> = {
  pending_email_verification: 'bg-muted text-muted-foreground border border-border',
  pending_admin_approval: 'bg-secondary text-foreground border border-border',
  approved: 'bg-primary text-primary-foreground',
  rejected: 'bg-destructive/10 text-destructive border border-destructive/30',
};

const STATUS_LABELS: Record<string, string> = {
  pending_email_verification: 'Email à confirmer',
  pending_admin_approval: 'À valider',
  approved: 'Validé',
  rejected: 'Refusé',
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const AdminProfiles = () => {
  const [tab, setTab] = useState<'candidats' | 'cabinets'>('candidats');
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [cabinets, setCabinets] = useState<CabinetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingCv, setDownloadingCv] = useState<string | null>(null);
  const [previewCandidate, setPreviewCandidate] = useState<CandidateRow | null>(null);

  const handleValidate = async (candidate: any, approved: boolean) => {
    try {
      const newStatus = approved ? 'approved' : 'rejected';
      await supabase
        .from('candidate_registrations')
        .update({ status: newStatus })
        .eq('user_id', candidate.user_id);

      await supabase.functions.invoke('notify-validation', {
        body: {
          candidateName: candidate.full_name || candidate.auth_email || 'Candidat',
          candidateEmail: candidate.auth_email || '',
          approved,
        },
      });

      toast.success(approved ? 'Candidat validé — email envoyé.' : 'Candidat refusé — email envoyé.');
      load();
    } catch (e) {
      toast.error('Erreur lors de la validation');
      console.error(e);
    }
  };

  const load = async () => {
    setLoading(true);
    const [{ data: c, error: cErr }, { data: cb, error: cbErr }] = await Promise.all([
      (supabase.rpc as any)('admin_list_candidate_registrations'),
      (supabase.rpc as any)('admin_list_cabinet_accounts'),
    ]);
    if (cErr) console.error(cErr);
    if (cbErr) console.error(cbErr);
    setCandidates((c as CandidateRow[]) || []);
    setCabinets((cb as CabinetRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDownloadCv = async (row: CandidateRow) => {
    const path = row.submission_data?.cvStoragePath;
    if (!path) {
      toast.error('Aucun CV uploadé pour ce candidat');
      return;
    }
    setDownloadingCv(row.id);
    const { data, error } = await supabase.storage
      .from('candidate-files')
      .createSignedUrl(path, 60 * 5);
    setDownloadingCv(null);
    if (error || !data?.signedUrl) {
      toast.error('Impossible de générer le lien de téléchargement');
      return;
    }
    window.open(data.signedUrl, '_blank');
  };

  const candidateStats = useMemo(() => ({
    total: candidates.length,
    pending: candidates.filter(c => c.status === 'pending_admin_approval').length,
    approved: candidates.filter(c => c.status === 'approved').length,
  }), [candidates]);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Profils inscrits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {candidateStats.total} candidat·e·s · {cabinets.length} cabinet·s
            {' · '}
            <span className="text-foreground font-semibold">{candidateStats.pending}</span> en attente de validation
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="text-xs">
          <RefreshCcw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      <div className="flex gap-2 mb-5">
        {([
          { key: 'candidats', label: `Candidats (${candidates.length})` },
          { key: 'cabinets', label: `Cabinets (${cabinets.length})` },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'text-[11px] font-semibold px-4 py-2 border rounded-sm transition-all',
              tab === t.key
                ? 'bg-foreground text-background border-foreground'
                : 'bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement…
          </div>
        ) : tab === 'candidats' ? (
          candidates.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">Aucun candidat inscrit.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Nom</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Email</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Département</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Cabinet origine</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Visibilité</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Statut</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Inscrit le</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-right">CV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c) => {
                  const data = c.submission_data || {};
                  const name = c.full_name || `${data.prenom || ''} ${data.nom || ''}`.trim() || '—';
                  const hasCv = !!data.cvStoragePath;
                  return (
                    <TableRow key={c.id} className="hover:bg-muted/30">
                      <TableCell className="text-[12px] font-semibold text-foreground">{name}</TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">{c.auth_email || data.email || '—'}</TableCell>
                      <TableCell className="text-[11px]">{data.departement || '—'}</TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">{data.cabinet || '—'}</TableCell>
                      <TableCell className="text-[11px]">{c.visibility}</TableCell>
                      <TableCell>
                        <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm', STATUS_COLORS[c.status] || STATUS_COLORS.pending_email_verification)}>
                          {STATUS_LABELS[c.status] || c.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">{formatDate(c.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {hasCv ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadCv(c)}
                            disabled={downloadingCv === c.id}
                            className="text-[11px] h-7"
                          >
                            {downloadingCv === c.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Download className="w-3 h-3 mr-1" /> CV
                              </>
                            )}
                          </Button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/60">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {c.status === 'pending_admin_approval' && (
                          <div className="flex gap-1 justify-end">
                            <Button variant="outline" size="sm" className="text-[11px] h-7 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleValidate(c, true)}>Valider</Button>
                            <Button variant="outline" size="sm" className="text-[11px] h-7 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleValidate(c, false)}>Refuser</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )
        ) : (
          cabinets.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">Aucun cabinet inscrit.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Cabinet</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Email</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Palier</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Contacts</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Recherches</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Vérifié</TableHead>
                  <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Inscrit le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cabinets.map((cb) => {
                  const contacts = Array.isArray(cb.contacts) ? cb.contacts.length : 0;
                  const searches = Array.isArray(cb.searches) ? cb.searches.length : 0;
                  return (
                    <TableRow key={cb.id} className="hover:bg-muted/30">
                      <TableCell className="text-[12px] font-semibold text-foreground">{cb.cabinet_name || '—'}</TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">{cb.auth_email || '—'}</TableCell>
                      <TableCell className="text-[11px] uppercase">{cb.palier || '—'}</TableCell>
                      <TableCell className="text-[11px]">{contacts}</TableCell>
                      <TableCell className="text-[11px]">
                        {searches > 0 ? (
                          <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                            <FileText className="w-3 h-3" /> {searches}
                          </span>
                        ) : '—'}
                      </TableCell>
                      <TableCell>
                        <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm',
                          cb.is_verified
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground border border-border'
                        )}>
                          {cb.is_verified ? 'Oui' : 'Non'}
                        </span>
                      </TableCell>
                      <TableCell className="text-[11px] text-muted-foreground">{formatDate(cb.created_at)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )
        )}
      </div>
    </div>
  );
};

export default AdminProfiles;
