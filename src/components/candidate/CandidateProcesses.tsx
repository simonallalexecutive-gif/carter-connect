import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { CANDIDATE_OFFERS } from '@/lib/candidateMockData';
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
        <p className="text-sm font-serif text-muted-foreground">Aucun processus en cours pour le moment.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_PROCESSES.map((proc) => {
          const offer = CANDIDATE_OFFERS.find((o) => o.id === proc.offerId);
          return (
            <div key={proc.id} className="rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border border-border" style={{ background: 'hsl(0 0% 96%)' }}>
              {offer && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-0 mb-1.5 flex-wrap">
                    <span className="text-[16px] font-serif tracking-[-0.01em] text-foreground leading-none">{shortSeniority(offer.seniority)}</span>
                    <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                    <span className="text-[16px] font-serif tracking-[-0.01em] text-foreground leading-none">{offer.dept}</span>
                    {offer.ranking && (
                      <>
                        <span className="mx-2.5 w-px h-5 bg-border inline-block" />
                        <span className="inline-flex items-center gap-2 text-[14px] font-serif text-foreground">
                          <span className="text-lg leading-none">{offer.natFlag}</span>
                          <span className="font-semibold">{offer.ranking}</span>
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-serif">
                      <Calendar className="w-3 h-3" />
                      <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                    </div>
                    <div className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/60 font-serif">{offer.reference}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1 mb-4">
                {STAGES.map((stage, i) => (
                  <div key={stage} className="flex items-center gap-1 flex-1">
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= proc.stageIndex ? 'bg-foreground' : 'bg-border'}`} />
                    {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground font-serif mb-4">
                {STAGES.map((stage, i) => (
                  <span key={stage} className={`${i <= proc.stageIndex ? 'text-foreground font-medium' : ''}`}>{stage}</span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[13px] font-serif text-muted-foreground leading-relaxed">{proc.note}</p>
                <span className="text-[10px] text-muted-foreground/60 font-serif shrink-0 ml-4">{new Date(proc.lastUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CandidateProcesses;
