import { MOCK_OFFERS } from '@/lib/adminMockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const OFFER_STATUS: Record<string, { label: string; class: string }> = {
  active: { label: 'Active', class: 'bg-primary text-primary-foreground' },
  pourvue: { label: 'Pourvue', class: 'bg-secondary text-secondary-foreground' },
  expirée: { label: 'Expirée', class: 'bg-muted text-muted-foreground' },
};

const PALIER_LABELS: Record<string, string> = {
  essentiel: 'Essentiel',
  standard: 'Standard',
  premium: 'Premium',
};

const AdminOffers = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Offres cabinets</h1>
        <p className="text-sm text-muted-foreground mt-1">{MOCK_OFFERS.length} offres enregistrées · {MOCK_OFFERS.filter((o) => o.status === 'active').length} actives</p>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">ID</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Cabinet</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Département</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Séniorité</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Abonnement</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Profils matchés</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Statut</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Créée le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_OFFERS.map((o) => (
              <TableRow key={o.id} className="cursor-pointer hover:bg-muted/30">
                <TableCell className="text-[11px] font-mono text-muted-foreground">{o.id}</TableCell>
                <TableCell className="text-[12px] font-semibold text-foreground">{o.cabinetName}</TableCell>
                <TableCell className="text-[11px]">{o.dept}</TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{o.seniority}</TableCell>
                <TableCell className="text-[11px] font-semibold">{PALIER_LABELS[o.palier]}</TableCell>
                <TableCell className="text-[11px] font-semibold text-center">{o.profilesMatched}</TableCell>
                <TableCell>
                  <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2 py-0.5 rounded-sm', OFFER_STATUS[o.status].class)}>
                    {OFFER_STATUS[o.status].label}
                  </span>
                </TableCell>
                <TableCell className="text-[11px] text-muted-foreground">{o.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOffers;
