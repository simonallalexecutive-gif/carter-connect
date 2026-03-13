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
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Demandes en attente</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_REQUESTS.length === 0 ? (
      <div className="text-center py-16">
        <Hourglass className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Aucune demande en attente.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_REQUESTS.map((req) => {
          const offer = CANDIDATE_OFFERS.find((o) => o.id === req.offerId);
          return (
            <div key={req.id} className="border border-border rounded-lg p-6 flex items-center justify-between">
              <div>
                {/* Offer preview */}
                {offer && (
                  <div className="mb-2">
                    <div className="flex items-center gap-0 mb-1">
                      <span className="text-sm font-sans font-medium text-foreground">{shortSeniority(offer.seniority)}</span>
                      <span className="mx-2.5 w-px h-4 bg-border inline-block" />
                      <span className="text-sm font-serif font-semibold text-foreground">{offer.dept}</span>
                      {offer.ranking && (
                        <>
                          <span className="mx-2.5 w-px h-4 bg-border inline-block" />
                          <span className="text-[11px] font-bold text-foreground">{offer.natFlag} {offer.ranking}</span>
                        </>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground tracking-widest uppercase">{offer.reference}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[11px] font-medium text-foreground">{req.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CandidateRequests;
