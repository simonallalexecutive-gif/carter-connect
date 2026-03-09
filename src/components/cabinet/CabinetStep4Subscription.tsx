import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { PALIERS, INCLUDED_FEATURES } from '@/lib/cabinetConstants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const CabinetStep4Subscription = () => {
  const s = useCabinetStore();

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 4
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-tight mb-1">
        Un abonnement.<br /><em className="text-muted-foreground">Zéro commission.</em>
      </h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Un forfait annuel fixe, illimité pour l'ensemble de votre cabinet. Un seul critère détermine votre tarif : la taille de votre équipe à Paris.
      </p>

      {/* Economic argument */}
      <div className="bg-foreground rounded-md p-6 mb-8 flex items-center gap-7">
        <div className="flex-shrink-0 text-center min-w-[110px]">
          <div className="font-serif text-4xl font-bold text-white leading-none">25%</div>
          <div className="text-[10px] text-white/40 mt-1 tracking-[0.05em] uppercase">du salaire brut</div>
          <div className="text-[9px] text-white/25 mt-0.5">par placement · modèle actuel</div>
        </div>
        <div className="w-px h-12 bg-white/10 flex-shrink-0" />
        <p className="text-sm text-white/55 leading-relaxed font-light">
          Sur une rétrocession de <strong className="text-white/80">100K à 200K€</strong>, un cabinet paie aujourd'hui <strong className="text-white">25K à 50K€ HT par recrutement</strong> — sans visibilité continue. LOGAN remplace ce coût par un <strong className="text-white/80">forfait annuel fixe, amorti dès le premier placement.</strong>
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="mb-3">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Choisissez votre palier</div>
        <div className="grid grid-cols-3 gap-3.5">
          {PALIERS.map((p) => (
            <button
              key={p.key}
              onClick={() => s.setField('palier', p.key)}
              className={cn(
                'relative text-left border rounded-md p-6 bg-background cursor-pointer transition-all',
                s.palier === p.key
                  ? 'border-foreground border-2 shadow-[inset_4px_0_0_hsl(var(--foreground))]'
                  : 'border-border hover:border-foreground/50'
              )}
            >
              {p.recommended && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-foreground text-background text-[8px] font-bold tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-b">
                  Recommandé
                </div>
              )}
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3.5 mt-1">{p.name}</div>
              <div className="text-[9px] text-muted-foreground mb-1.5 font-medium">{p.sub}</div>
              <div className="text-xs font-semibold text-foreground mb-3.5 pb-3.5 border-b border-border">{p.size}</div>
              <div className="font-serif text-3xl font-bold text-foreground leading-none mb-0.5">{p.price}</div>
              <div className="text-[11px] text-muted-foreground mb-4">HT / an · tout le cabinet</div>
              <div className="bg-secondary border border-border rounded p-2.5 text-[11px] text-foreground leading-relaxed">
                {p.argument}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Included features */}
      <div className="bg-secondary rounded-md p-5 mb-5">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3.5">Inclus dans tous les paliers</div>
        <div className="grid grid-cols-2 gap-2">
          {INCLUDED_FEATURES.map((f) => (
            <div key={f} className="flex gap-2 text-xs text-foreground">
              <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty coefficient */}
      <div className="border-2 border-border rounded-md p-5 flex items-start gap-5 bg-secondary/50">
        <div className="flex-shrink-0 bg-foreground rounded text-center px-3.5 py-2.5">
          <div className="font-serif text-xl font-bold text-white">−15%</div>
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-white/60 mt-0.5">dès l'an 3</div>
        </div>
        <div>
          <div className="text-xs font-bold text-foreground mb-1.5">Coefficient fidélité — parce que la durée crée la valeur</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les cabinets qui s'inscrivent dans la durée bénéficient d'une remise automatique : <strong>−10% à la 2ème année</strong>, <strong>−15% à partir de la 3ème année</strong>. La remise s'applique automatiquement à chaque renouvellement.
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(5)} disabled={!s.palier} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8">
          Continuer →
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep4Subscription;
