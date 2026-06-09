import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Loader2, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminCabinetProfileDialog from './AdminCabinetProfileDialog';

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

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const AdminCabinets = () => {
  const [cabinets, setCabinets] = useState<CabinetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<CabinetRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase.rpc as any)('admin_list_cabinet_accounts');
    if (error) console.error(error);
    setCabinets((data as CabinetRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Cabinets inscrits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {cabinets.length} cabinet{cabinets.length > 1 ? 's' : ''} référencé{cabinets.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="text-xs">
          <RefreshCcw className={cn('w-3.5 h-3.5 mr-1.5', loading && 'animate-spin')} />
          Actualiser
        </Button>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Chargement…
          </div>
        ) : cabinets.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted-foreground">Aucun cabinet inscrit.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground">Cabinet</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground">Email</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground">Statut</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground">Inscrit le</TableHead>
                <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cabinets.map((cb) => {
                const contact = Array.isArray(cb.contacts) ? cb.contacts[0] : null;
                const statut = contact?.role || '—';
                return (
                  <TableRow key={cb.id} className="hover:bg-muted/30">
                    <TableCell className="text-[12px] font-semibold text-foreground">{cb.cabinet_name || '—'}</TableCell>
                    <TableCell className="text-[11px] text-foreground/80">{cb.auth_email || '—'}</TableCell>
                    <TableCell className="text-[11px] text-foreground">{statut}</TableCell>
                    <TableCell className="text-[11px] text-foreground/80">{formatDate(cb.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[11px] h-7 text-foreground gap-1"
                        onClick={() => setPreview(cb)}
                      >
                        <Eye className="w-3 h-3" /> Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <AdminCabinetProfileDialog
        open={!!preview}
        onOpenChange={(o) => { if (!o) setPreview(null); }}
        cabinet={preview}
      />
    </div>
  );
};

export default AdminCabinets;
