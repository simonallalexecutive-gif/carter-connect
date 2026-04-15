import { useState } from 'react';
import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, CalendarDays } from 'lucide-react';

const CabinetStep5Validation = () => {
  const s = useCabinetStore();
  const [checks, setChecks] = useState([false, false, false]);

  const toggleCheck = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const allChecked = checks.every(Boolean);

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 3
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2.5">Validation</h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 max-w-xl">
        Confirmez votre demande d'accès et planifiez un appel avec l'équipe Logan.
      </p>

      {/* ── Planifier un appel ── */}
      <div className="bg-muted/50 border border-border rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
            <Phone className="w-4 h-4 text-background" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Planifier un appel avec Logan</div>
            <div className="text-[11px] text-muted-foreground">Un membre de l'équipe vous contactera pour finaliser votre onboarding.</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-background border border-border rounded px-4 py-3">
          <CalendarDays className="w-4 h-4 text-foreground/60 flex-shrink-0" />
          <span>Vous serez recontacté sous <strong className="text-foreground">48h</strong> après validation de votre demande.</span>
        </div>
      </div>

      {/* ── Approval banner ── */}
      <div className="bg-foreground rounded-md p-6">
        <div className="font-sans text-base font-semibold text-white mb-3.5">Confirmez votre demande d'accès</div>
        <div className="flex flex-col gap-2.5">
          {[
            "Je confirme les informations renseignées sur mon cabinet.",
            "Je comprends que les profils sont strictement anonymisés et que toute levée de confidentialité est conditionnée à l'accord du candidat, orchestrée par LOGAN.",
            "J'accepte les conditions générales d'utilisation de la plateforme LOGAN et la politique de confidentialité.",
          ].map((text, i) => (
            <button
              key={i}
              onClick={() => toggleCheck(i)}
              className={cn(
                'flex items-start gap-3 p-3 rounded border text-left transition-all',
                checks[i] ? 'bg-white/[0.07] border-white/[0.18]' : 'bg-white/[0.03] border-white/[0.08]'
              )}
            >
              <div className={cn(
                'w-[18px] h-[18px] rounded-sm border-[1.5px] flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                checks[i] ? 'bg-white border-white' : 'border-white/25'
              )}>
                {checks[i] && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-xs text-white/65 leading-relaxed">{text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(6)} disabled={!allChecked} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Soumettre ma demande →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep5Validation;
