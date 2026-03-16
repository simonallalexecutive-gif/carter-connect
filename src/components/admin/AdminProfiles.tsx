import { useState } from 'react';
import { MOCK_PROFILES, STATUS_LABELS } from '@/lib/adminMockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  nouveau: 'bg-primary text-primary-foreground',
  qualifié: 'bg-accent text-accent-foreground',
  en_process: 'bg-secondary text-foreground border border-border',
  placé: 'bg-primary text-primary-foreground',
  inactif: 'bg-muted text-muted-foreground',
};

const AdminProfiles = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = statusFilter === 'all' ? MOCK_PROFILES : MOCK_PROFILES.filter((p) => p.status === statusFilter);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Profils candidats</h1>
        <p className="text-sm text-muted-foreground mt-1">{MOCK_PROFILES.length} candidats inscrits</p>
      </div>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {['all', 'nouveau', 'qualifié', 'en_process', 'placé', 'inactif'].map((s) => (
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
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">ID</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Nom</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Département</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">PQE</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Origine</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Anglais</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Statut</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} className="cursor-pointer hover:bg-muted/30">
                <TableCell className="text-[11px] font-mono text-muted-foreground">{p.id}</TableCell>
                <TableCell className="text-[12px] font-semibold text-foreground">{p.fullName}</TableCell>
                <TableCell className="text-[11px]">{p.dept}</TableCell>
                <TableCell className="text-[11px] font-semibold">{p.pqe} ans</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{p.origin}</TableCell>
                <TableCell className="text-[11px]">{p.anglais}</TableCell>
                <TableCell>
                  <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm', STATUS_COLORS[p.status])}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{p.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProfiles;
