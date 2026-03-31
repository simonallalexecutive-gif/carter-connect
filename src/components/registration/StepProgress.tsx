import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import navBg from '@/assets/nav-bg-dark.jpg';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const STEPS = [
  { label: 'Identité' },
  { label: 'Activité' },
  { label: 'Projet' },
  { label: 'Statut' },
  { label: 'Récapitulatif' },
];

const StepProgress = ({ currentStep }: StepProgressProps) => {
  const adjustedCurrent = currentStep - 1;

  if (currentStep <= 1 || currentStep >= 7) return null;

  return (
    <div className="w-full py-8 px-4 bg-cover bg-center" style={{ backgroundImage: `url(${navBg})` }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between relative">
          {STEPS.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = adjustedCurrent > stepNum;
            const isActive = adjustedCurrent === stepNum;

            return (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans transition-all duration-400",
                      isCompleted && "bg-white text-[hsl(215,30%,22%)]",
                      isActive && "bg-white text-[hsl(215,30%,22%)] ring-4 ring-white/20",
                      !isCompleted && !isActive && "bg-white/10 text-white/50 border border-white/20"
                    )}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : <span className="text-[10px]">{stepNum}</span>}
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-[11px] font-sans tracking-wide",
                      isActive ? "text-white font-medium" : "text-white/50 font-light"
                    )}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connecting line segment (between circles, not the last one) */}
                {i < STEPS.length - 1 && (
                  <div className="flex-1 mx-2 relative" style={{ top: '-10px' }}>
                    <div className="h-px w-full bg-white/20" />
                    {adjustedCurrent > stepNum && (
                      <div className="absolute top-0 left-0 h-px bg-white/70 w-full" />
                    )}
                    {adjustedCurrent === stepNum && (
                      <div className="absolute top-0 left-0 h-px bg-white/70 w-1/2" />
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

export default StepProgress;
