import { Dialog, DialogContent } from '@/components/ui/dialog';
import { type CandidateOffer, getOfferNatFlag } from '@/lib/candidateMockData';
import { Calendar } from 'lucide-react';
import ActivityPieChart from '@/components/shared/ActivityPieChart';

const formatOfferDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const parseOfferSeniority = (s: string) => {
  const lower = s.toLowerCase();
  let title = 'Collaborateur';
  if (lower.includes('counsel')) title = 'Counsel';
  else if (lower.includes('associé')) title = 'Associé';
  let seniorityRange: string | null = null;
  if (title === 'Collaborateur') {
    const match = s.match(/\((\d+)/);
    const startYears = match ? parseInt(match[1], 10) : 0;
    if (startYears < 3) seniorityRange = '0/3 ans';
    else if (startYears < 6) seniorityRange = '3/6 ans';
    else seniorityRange = '6 ans+';
  }
  return { title, seniorityRange };
};

interface Props {
  offer: CandidateOffer | null;
  cabinetName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminOfferDetailDialog = ({ offer, cabinetName, open, onOpenChange }: Props) => {
  if (!offer) return null;
  const hasMultipleExpertises = offer.activitySplit && Object.keys(offer.activitySplit).length >= 2;
  const parsed = parseOfferSeniority(offer.seniority);
  const natLabel = offer.nat ? `Cabinet ${offer.nat}` : '';
  const hasChambers = !!offer.chambersBand;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-0 mb-2 flex-wrap">
            <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{parsed.title}</span>
            <span className="mx-2.5 w-px h-5 bg-border inline-block" />
            <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{offer.dept}</span>
            {parsed.seniorityRange && (
              <>
                <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{parsed.seniorityRange}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {cabinetName && (
              <span className="text-[10px] font-sans font-bold text-foreground leading-none bg-secondary rounded px-2 py-1">{cabinetName}</span>
            )}
            {natLabel && (
              <span className="text-[10px] font-sans font-bold text-foreground/70 leading-none border border-border rounded px-2 py-1">{natLabel}</span>
            )}
            <span className="text-[10px] font-sans font-bold text-foreground/70 leading-none border border-border rounded px-2 py-1">Chambers : {hasChambers ? 'Oui' : 'Non'}</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-sans">
              <Calendar className="w-3 h-3" />
              <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
            </div>
            <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 font-sans">{offer.reference}</div>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="p-6 md:p-8 bg-background text-foreground">
            {hasMultipleExpertises && offer.activitySplit && (
              <div className="mb-6 pb-5 border-b border-border">
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Répartition de l'activité</div>
                <div className="flex items-start gap-6">
                  <ActivityPieChart data={offer.activitySplit} size={120} innerRadius={28} outerRadius={52} showLegend={false} />
                  <div className="flex-1 space-y-2.5">
                    {Object.entries(offer.activitySplit).map(([name, value]) => (
                      <div key={name}>
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-xs font-medium text-foreground">{name}</span>
                          <span className="text-xs font-bold text-foreground">{value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 pb-5 border-b border-border">
              <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Description du poste</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{offer.description}</p>
            </div>

            {(offer.contexte || offer.equipe) && (
              <div className="mb-6 pb-5 border-b border-border">
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Contexte & équipe</div>
                <div className="grid grid-cols-2 gap-4">
                  {offer.contexte && (<div><div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Contexte</div><div className="text-sm font-semibold text-foreground">{offer.contexte}</div></div>)}
                  {offer.equipe && (<div><div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-1">Composition</div><div className="text-sm font-semibold text-foreground">{offer.equipe}</div></div>)}
                </div>
              </div>
            )}

            {offer.profilCriteres && offer.profilCriteres.length > 0 && (
              <div className="mb-6 pb-5 border-b border-border">
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Profil idéal</div>
                <div className="flex flex-wrap gap-1.5">
                  {offer.profilCriteres.map((c) => (
                    <span key={c} className="text-[10px] bg-secondary border border-border rounded-full px-3 py-1.5 text-foreground font-medium">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {(offer.retroStr || offer.heures || offer.tt) && (
              <div className="mb-2">
                <div className="text-[8px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Rémunération & conditions</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Rétrocession</div>
                    <div className="font-sans text-base font-bold text-foreground">{offer.retroStr || 'Confidentiel'}</div>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Heures / an</div>
                    <div className="font-sans text-base font-bold text-foreground">{offer.heures || 'Non communiqué'}</div>
                  </div>
                  <div className="bg-secondary rounded-lg p-4 text-center">
                    <div className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground mb-2">Télétravail</div>
                    <div className="font-sans text-base font-bold text-foreground">{offer.tt || '—'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminOfferDetailDialog;
