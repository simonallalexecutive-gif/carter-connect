import { MOCK_PROCESSES, STAGE_LABELS } from '@/lib/adminMockData';
import { cn } from '@/lib/utils';

const STAGE_ORDER = ['intérêt', 'entretien_logan', 'présentation', 'entretien_cabinet', 'offre', 'placé'];

const STAGE_COLORS: Record<string, string> = {
  intérêt: 'bg-muted text-foreground',
  entretien_logan: 'bg-secondary text-foreground border border-border',
  présentation: 'bg-primary/80 text-primary-foreground',
  entretien_cabinet: 'bg-primary text-primary-foreground',
  offre: 'bg-primary text-primary-foreground',
  placé: 'bg-primary text-primary-foreground',
  abandonné: 'bg-destructive/10 text-destructive',
};

const AdminProcesses = () => {
  const activeProcesses = MOCK_PROCESSES.filter((p) => p.stage !== 'placé' && p.stage !== 'abandonné');
  const completedProcesses = MOCK_PROCESSES.filter((p) => p.stage === 'placé' || p.stage === 'abandonné');

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Suivi des processus</h1>
        <p className="text-sm text-muted-foreground mt-1">{activeProcesses.length} processus actifs · {completedProcesses.length} terminés</p>
      </div>

      {/* Pipeline stages overview */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STAGE_ORDER.map((stage) => {
          const count = MOCK_PROCESSES.filter((p) => p.stage === stage).length;
          return (
            <div key={stage} className="flex-1 min-w-[100px]">
              <div className="text-center">
                <div className="font-serif text-xl font-bold text-foreground">{count}</div>
                <div className="text-[9px] font-semibold tracking-[0.06em] uppercase text-muted-foreground mt-0.5">{STAGE_LABELS[stage]}</div>
              </div>
              <div className="h-1 bg-primary/10 mt-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: count > 0 ? '100%' : '0%' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Active processes */}
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3">Processus en cours</div>
      <div className="grid gap-3 mb-8">
        {activeProcesses.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-accent transition-colors cursor-pointer">
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-foreground">{p.candidatName}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{p.candidatId} · {p.dept} → {p.cabinetName}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2.5 py-1 rounded-sm', STAGE_COLORS[p.stage])}>
                {STAGE_LABELS[p.stage]}
              </span>
              <span className="text-[10px] text-muted-foreground">MAJ {p.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Completed */}
      {completedProcesses.length > 0 && (
        <>
          <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-muted-foreground mb-3">Terminés</div>
          <div className="grid gap-3">
            {completedProcesses.map((p) => (
              <div key={p.id} className="bg-muted/30 border border-border rounded-lg p-4 flex items-center justify-between opacity-70">
                <div className="flex-1">
                  <div className="text-[12px] font-semibold text-foreground">{p.candidatName}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{p.candidatId} · {p.dept} → {p.cabinetName}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn('text-[9px] font-bold tracking-[0.06em] uppercase px-2.5 py-1 rounded-sm', STAGE_COLORS[p.stage])}>
                    {STAGE_LABELS[p.stage]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProcesses;
