import { Clock, ArrowRight } from 'lucide-react';

const MOCK_PROCESSES = [
  {
    id: 'PROC-001',
    reference: 'LGN-2026-041',
    dept: 'M&A',
    stage: 'Entretien cabinet',
    stageIndex: 2,
    totalStages: 4,
    lastUpdate: '2026-03-11',
    note: 'Second entretien prévu avec l\'associé référent.',
  },
  {
    id: 'PROC-002',
    reference: 'LGN-2026-044',
    dept: 'Fiscal',
    stage: 'Qualification Logan',
    stageIndex: 1,
    totalStages: 4,
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
        <p className="text-sm text-muted-foreground">Aucun processus en cours pour le moment.</p>
      </div>
    ) : (
      <div className="space-y-4">
        {MOCK_PROCESSES.map((proc) => (
          <div key={proc.id} className="border border-border rounded-lg p-6 hover:shadow-[var(--shadow-elevated)] transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-serif text-xl text-foreground font-medium">{proc.dept}</span>
                <span className="ml-3 text-[10px] text-muted-foreground tracking-widest uppercase">{proc.reference}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{new Date(proc.lastUpdate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</span>
            </div>

            {/* Stage progress */}
            <div className="flex items-center gap-1 mb-4">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex items-center gap-1 flex-1">
                  <div className={`h-1.5 flex-1 rounded-full transition-colors ${i <= proc.stageIndex ? 'bg-foreground' : 'bg-border'}`} />
                  {i < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-border shrink-0" />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mb-4">
              {STAGES.map((stage, i) => (
                <span key={stage} className={`${i <= proc.stageIndex ? 'text-foreground font-medium' : ''}`}>{stage}</span>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{proc.note}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CandidateProcesses;
