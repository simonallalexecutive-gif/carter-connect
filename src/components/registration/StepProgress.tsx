import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ['Bienvenue', 'Identité', 'Activité', 'Projet', 'Statut', 'Récapitulatif', 'Confirmation'];

const StepProgress = ({ currentStep, totalSteps = 7 }: StepProgressProps) => {
  // Only show steps 2-6
  const visibleSteps = STEP_LABELS.slice(1, 6);
  const adjustedCurrent = currentStep - 1; // offset since we start from step 2

  if (currentStep <= 1 || currentStep >= 7) return null;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between relative">
        {visibleSteps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = adjustedCurrent > stepNum;
          const isActive = adjustedCurrent === stepNum;

          return (
            <div key={i} className="flex flex-col items-center relative z-10 flex-1">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={cn(
                    "absolute top-4 right-1/2 w-full h-0.5 -z-10",
                    isCompleted || isActive ? "bg-carter-accentent" : "bg-border"
                  )}
                />
              )}
              {/* Dot */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-semibold transition-all duration-300",
                  isCompleted && "bg-cartaccentred text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-sans",
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
