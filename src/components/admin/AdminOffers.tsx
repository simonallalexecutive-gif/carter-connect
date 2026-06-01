import { useState } from 'react';
import { CANDIDATE_OFFERS, type CandidateOffer } from '@/lib/candidateMockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminOfferDetailDialog from './AdminOfferDetailDialog';
import { cn } from '@/lib/utils';

// Map each demo offer to a synthetic cabinet name for the admin view
const OFFER_CABINETS: Record<string, string> = {
  'OFF-C-001': 'Bredin Prat',
  'OFF-C-002': 'Clifford Chance',
  'OFF-C-003': 'Darrois Villey',
  'OFF-C-004': 'Gide Loyrette Nouel',
  'OFF-C-005': 'August Debouzy',
};

const AdminOffers = () => {
  const [selected, setSelected] = useState<CandidateOffer | null>(null);
  const [open, setOpen] = useState(false);

  const openOffer = (offer: CandidateOffer) => {
    setSelected(offer);
    setOpen(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Offres cabinets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {CANDIDATE_OFFERS.length} offre{CANDIDATE_OFFERS.length > 1 ? 's' : ''} publiée{CANDIDATE_OFFERS.length > 1 ? 's' : ''} · cliquez pour consulter le détail
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Référence</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Cabinet</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Département</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Séniorité</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Nat.</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Chambers</TableHead>
              <TableHead className="text-[10px] font-semibold tracking-[0.08em] uppercase">Publiée le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CANDIDATE_OFFERS.map((o) => (
              <TableRow
                key={o.id}
                className="cursor-pointer hover:bg-muted/40"
                onClick={() => openOffer(o)}
              >
                <TableCell className="text-[11px] font-mono text-foreground/70">{o.reference}</TableCell>
                <TableCell className="text-[12px] font-semibold text-foreground">{OFFER_CABINETS[o.id] || '—'}</TableCell>
                <TableCell className="text-[11px] text-foreground">{o.dept}</TableCell>
                <TableCell className="text-[11px] text-foreground">{o.seniority}</TableCell>
                <TableCell className="text-[11px] text-foreground">{o.nat || '—'}</TableCell>
                <TableCell className="text-[11px] text-foreground">{o.chambersBand ? `Band ${o.chambersBand}` : '—'}</TableCell>
                <TableCell className="text-[11px] text-foreground/70">
                  {new Date(o.postedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AdminOfferDetailDialog
        offer={selected}
        cabinetName={selected ? OFFER_CABINETS[selected.id] : undefined}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
};

export default AdminOffers;
