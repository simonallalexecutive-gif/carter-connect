import { useCabinetStore } from '@/stores/cabinetStore';
import { cn } from '@/lib/utils';

interface CabinetStepProgressProps {
  className?: string;
}

const STEPS = [
  { n: 2, label: 'Cabinet' },
  { n: 3, label: 'Abonnement' },
  { n: 4, label: 'Validation' },
];

const CabinetStepProgress = ({ className }: CabinetStepProgressProps) => {
  const step = useCabinetStore((s) => s.step);

  if (step <= 1 || step > 4) return null;

  return (
    <div className={cn('border-b border-white/[0.08] py-3.5 px-6 md:px-12 bg-[hsl(0,0%,7%)]', className)}>
      <div className="max-w-[680px] mx-auto flex items-start">
        {STEPS.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          return (
            <div key={s.n} className="contents">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                    done && 'bg-white text-black',
                    active && 'bg-white text-black shadow-[0_0_0_3px_rgba(255,255,255,0.18)]',
                    !done && !active && 'bg-white/10 text-white/45'
                  )}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  className={cn(
                    'text-[8px] tracking-[0.06em] uppercase whitespace-nowrap',
                    active ? 'text-white font-semibold' : 'text-white/45'
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn('flex-1 h-px mt-3.5 mx-1.5 transition-colors', done ? 'bg-white' : 'bg-white/15')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CabinetStepProgress;
