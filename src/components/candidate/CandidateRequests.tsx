import { Clock, Hourglass, Calendar } from 'lucide-react';
import { CANDIDATE_OFFERS, getOfferNatFlag } from '@/lib/candidateMockData';
import { shortSeniority, formatOfferDate } from './CandidateOffers';

const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    offerId: 'OFF-C-002',
    submittedAt: '2026-03-10',
    status: 'En cours de qualification',
  },
  {
    id: 'REQ-002',
    offerId: 'OFF-C-005',
    submittedAt: '2026-03-12',
    status: 'En attente de retour cabinet',
  },
];

const CandidateRequests = () => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Demandes en attente</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_REQUESTS.length === 0 ? (
      <div className="text-center py-16">
        <Hourglass className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm font-sans text-muted-foreground">Aucune demande en attente.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_REQUESTS.map((req) => {
          const offer = CANDIDATE_OFFERS.find((o) => o.id === req.offerId);
          return (
            <div
              key={req.id}
              className="rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {offer && (
                      <>
                        <div className="flex items-center gap-0 mb-2 flex-wrap">
                          <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{shortSeniority(offer.seniority)}</span>
                          <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                          <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{offer.dept}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {offer.nat && <span className="text-[10px] font-sans font-bold text-foreground/70 leading-none border border-border rounded px-2 py-1">Cabinet {offer.nat}</span>}
                          <span className="text-[10px] font-sans font-bold text-foreground/70 leading-none border border-border rounded px-2 py-1">Chambers : {offer.chambersBand ? 'Oui' : 'Non'}</span>
                        </div>
                      </>
                    )}
                    <p className="text-[11px] font-sans text-muted-foreground">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 bg-secondary rounded-full px-3 py-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-sans font-bold text-foreground/85">{req.status}</span>
                  </div>
                </div>
                {offer && (
                  <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 font-sans text-right mt-3">{offer.reference}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CandidateRequests;
