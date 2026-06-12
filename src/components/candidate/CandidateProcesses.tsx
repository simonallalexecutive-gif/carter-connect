import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { CANDIDATE_OFFERS, getOfferNatFlag } from '@/lib/candidateMockData';
import { shortSeniority, formatOfferDate } from './CandidateOffers';

const MOCK_PROCESSES = [
  {
    id: 'PROC-001',
    offerId: 'OFF-C-001',
    stage: 'Entretien cabinet',
    stageIndex: 2,
    lastUpdate: '2026-03-11',
    note: 'Second entretien prévu avec l\'associé référent.',
  },
  {
    id: 'PROC-002',
    offerId: 'OFF-C-004',
    stage: 'Qualification Logan',
    stageIndex: 1,
    lastUpdate: '2026-03-12',
    note: 'Votre consultant prépare la présentation de votre profil.',
  },
];

const STAGES = ['Intérêt exprimé', 'Qualification Logan', 'Entretien cabinet', 'Offre'];

const CandidateProcesses = () => (
  <div>
    <div className="mb-8">
      <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-2">Processus en cours</p>
      <div className="w-8 h-px bg-foreground" />
    </div>

    {MOCK_PROCESSES.length === 0 ? (
      <div className="text-center py-16">
        <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-sm font-sans text-muted-foreground">Aucun processus en cours pour le moment.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_PROCESSES.map((proc) => {
          const offer = CANDIDATE_OFFERS.find((o) => o.id === proc.offerId);
          return (
            <div
              key={proc.id}
              className="rounded-lg overflow-hidden border border-border bg-card"
            >
              <div className="p-6">
                {offer && (
                  <div className="mb-4 pb-4 border-b border-border">
                    <div className="flex items-center gap-0 mb-2 flex-wrap">
                      <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{shortSeniority(offer.seniority)}</span>
                      <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                      <span className="text-[14px] font-sans font-semibold text-foreground leading-none">{offer.dept}</span>
                    </div>
                    {offer.nat && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[10px] font-sans font-bold text-foreground/70 leading-none border border-border rounded px-2 py-1">Cabinet {offer.nat}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-sans">
                        <Calendar className="w-3 h-3" />
                        <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                      </div>
                      <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50 font-sans">{offer.reference}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {STAGES.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-1 flex-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= proc.stageIndex ? 'bg-foreground/80' : 'bg-secondary'}`} />
                      {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground font-sans mb-4">
                  {STAGES.map((stage, i) => (
                    <span key={stage} className={`${i <= proc.stageIndex ? 'text-foreground/85 font-bold' : ''}`}>{stage}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-sans text-muted-foreground leading-relaxed">{proc.note}</p>
                  <span className="text-[10px] text-muted-foreground/60 font-sans shrink-0 ml-4">{new Date(proc.lastUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CandidateProcesses;
