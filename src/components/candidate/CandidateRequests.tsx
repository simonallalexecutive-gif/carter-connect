import { Clock, Hourglass, Calendar } from 'lucide-react';
import { CANDIDATE_OFFERS } from '@/lib/candidateMockData';
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
      <p className="text-[10px] font-serif font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Demandes en attente</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_REQUESTS.length === 0 ? (
      <div className="text-center py-16">
        <Hourglass className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm font-serif text-muted-foreground">Aucune demande en attente.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_REQUESTS.map((req) => {
          const offer = CANDIDATE_OFFERS.find((o) => o.id === req.offerId);
          return (
            <div key={req.id} className="border border-border rounded-lg p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Offer preview — uniform serif */}
                  {offer && (
                    <div className="mb-2">
                      <div className="flex items-center gap-0 mb-1.5 flex-wrap">
                        <span className="text-[13px] font-serif tracking-[-0.01em] text-foreground leading-none">{shortSeniority(offer.seniority)}</span>
                        <span className="mx-2.5 w-px h-4 bg-border inline-block" />
                        <span className="text-[13px] font-serif tracking-[-0.01em] text-foreground leading-none">{offer.dept}</span>
                        {offer.ranking && (
                          <>
                            <span className="mx-2.5 w-px h-4 bg-border inline-block" />
                            <span className="inline-flex items-center gap-2 text-[12px] font-serif text-foreground">
                              <span className="text-base leading-none">{offer.natFlag}</span>
                              <span className="font-semibold">{offer.ranking}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  <p className="text-[11px] font-serif text-muted-foreground">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  {offer && <div className="mt-2 text-[9px] tracking-[0.15em] uppercase text-muted-foreground font-serif">{offer.reference}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-serif font-medium text-foreground">{req.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CandidateRequests;
