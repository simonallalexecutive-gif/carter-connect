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
              className="rounded-lg overflow-hidden border border-white/5"
              style={{ background: 'hsl(0, 0%, 7%)' }}
            >
              <div className="p-6">
                {offer && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-0 mb-1.5 flex-wrap">
                      <span className="text-[16px] font-sans tracking-[-0.01em] text-white leading-none">{shortSeniority(offer.seniority)}</span>
                      <span className="mx-2.5 w-px h-5 bg-white/20 inline-block" />
                      <span className="text-[16px] font-sans tracking-[-0.01em] text-white leading-none">{offer.dept}</span>
                      {offer.ranking && (
                        <>
                          <span className="mx-2.5 w-px h-5 bg-white/20 inline-block" />
                          <span className="inline-flex items-center gap-2 text-[14px] font-sans text-white/70">
                            <span className="text-xs font-bold leading-none">{getOfferNatFlag(offer)}</span>
                            <span className="font-semibold">{offer.ranking}</span>
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-white/40 font-sans">
                        <Calendar className="w-3 h-3" />
                        <span>Date de publication : {formatOfferDate(offer.postedAt)}</span>
                      </div>
                      <div className="text-[9px] tracking-[0.15em] uppercase text-white/20 font-sans">{offer.reference}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {STAGES.map((stage, i) => (
                    <div key={stage} className="flex items-center gap-1 flex-1">
                      <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= proc.stageIndex ? 'bg-white' : 'bg-white/15'}`} />
                      {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-white/20 shrink-0" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-white/40 font-sans mb-4">
                  {STAGES.map((stage, i) => (
                    <span key={stage} className={`${i <= proc.stageIndex ? 'text-white font-medium' : ''}`}>{stage}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-sans text-white/60 leading-relaxed">{proc.note}</p>
                  <span className="text-[10px] text-white/30 font-sans shrink-0 ml-4">{new Date(proc.lastUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
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
