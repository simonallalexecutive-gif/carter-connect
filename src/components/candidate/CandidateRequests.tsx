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
              className="rounded-lg overflow-hidden border border-black/[0.08]"
              style={{ background: 'hsl(40, 20%, 95%)' }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {offer && (
                      <>
                        <div className="flex items-center gap-0 mb-2 flex-wrap">
                          <span className="text-[14px] font-sans font-semibold text-black/90 leading-none">{shortSeniority(offer.seniority)}</span>
                          <span className="mx-2.5 w-px h-5 bg-black/20 inline-block" />
                          <span className="text-[14px] font-sans font-semibold text-black/90 leading-none">{offer.dept}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {offer.nat && <span className="text-[10px] font-sans font-bold text-black/70 leading-none border border-black/20 rounded px-2 py-1">Cabinet {offer.nat}</span>}
                          <span className="text-[10px] font-sans font-bold text-black/70 leading-none border border-black/20 rounded px-2 py-1">Chambers : {offer.chambersBand ? 'Oui' : 'Non'}</span>
                        </div>
                      </>
                    )}
                    <p className="text-[11px] font-sans text-black/55">Soumise le {new Date(req.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 bg-black/[0.06] rounded-full px-3 py-1.5">
                    <Clock className="w-3.5 h-3.5 text-black/55" />
                    <span className="text-[11px] font-sans font-bold text-black/80">{req.status}</span>
                  </div>
                </div>
                {offer && (
                  <div className="text-[9px] tracking-[0.15em] uppercase text-black/30 font-sans text-right mt-3">{offer.reference}</div>
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
