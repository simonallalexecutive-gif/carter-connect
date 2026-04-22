import { useCabinetStore } from '@/stores/cabinetStore';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface CabinetStepProgressProps {
  className?: string;
}

// Cabinet flow steps (display only — does not change the underlying registration steps)
const STEPS = [
  { label: 'Cabinet' },
  { label: 'Abonnement' },
  { label: 'Validation' },
];

const CabinetStepProgress = ({ className }: CabinetStepProgressProps) => {
  const step = useCabinetStore((s) => s.step);

  // Cabinet store steps: 2 = Cabinet, 3 = Abonnement, 4 = Validation
  // Map to a 1-based index identical to StepProgress's internal logic
  const adjustedCurrent = step - 1;

  if (step <= 1 || step > 4) return null;

  return (
    <div className={cn('w-full py-8 px-4 bg-background', className)}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between relative">
          {STEPS.map((s, i) => {
            const stepNum = i + 1;
            const isCompleted = adjustedCurrent > stepNum;
            const isActive = adjustedCurrent === stepNum;

            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans transition-all duration-400',
                      isCompleted && 'bg-foreground text-background',
                      isActive && 'bg-foreground text-background ring-4 ring-foreground/15',
                      !isCompleted && !isActive && 'bg-muted text-muted-foreground border border-border'
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : <span className="text-[10px]">{stepNum}</span>}
                  </div>
                  <span
                    className={cn(
                      'mt-3 text-[11px] font-sans tracking-wide',
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground font-light'
                    )}
                  >
                    {s.label}
                  </span>
                </div>

                {/* Connecting line segment */}
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 self-start relative" style={{ top: '12px' }}>
                    <div className="h-px w-full bg-border" />
                    {adjustedCurrent > stepNum && (
                      <div className="absolute top-0 left-0 h-px bg-foreground/60 w-full" />
                    )}
                    {adjustedCurrent === stepNum && (
                      <div className="absolute top-0 left-0 h-px bg-foreground/60 w-1/2" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CabinetStepProgress;
