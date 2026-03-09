import { cn } from '@/lib/utils';
import { User, Briefcase, Target, CheckCircle2, Shield } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEPS = [
  { label: 'Identité', icon: User },
  { label: 'Activité', icon: Briefcase },
  { label: 'Projet', icon: Target },
  { label: 'Statut', icon: Shield },
  { label: 'Récapitulatif', icon: CheckCircle2 },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  const adjustedCurrent = currentStep - 1; // offset since we start from step 2

  if (currentStep <= 1 || currentStep >= 7) return null;

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between relative">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = adjustedCurrent > stepNum;
          const isActive = adjustedCurrent === stepNum;
          const Icon = step.icon;

          return (
            <div key={i} className="flex flex-col items-center relative z-10 flex-1">
              {/* Connector line */}
              {i > 0 && (
                <div
                  className={cn(
                    "absolute top-4 right-1/2 w-full h-0.5 -z-10",
                    isCompleted || isActive ? "bg-carter-accent" : "bg-border"
                  )}
                />
              )}
              {/* Dot with icon */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-carter-accent text-accent-foreground",
                  isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs font-sans font-light",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
