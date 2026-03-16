import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Check, Sparkles, Users, Building2 } from 'lucide-react';

const PALIERS = [
  {
    key: 'starter',
    name: 'Starter',
    icon: Sparkles,
    price: '1.500',
    fee: '18',
    features: [
      '1 recherche active',
      '1 département',
      'Accès au vivier premium',
      'Support par email',
    ],
    notIncluded: ['Consultant dédié', 'Alertes prioritaires', 'Reporting mensuel'],
  },
  {
    key: 'business',
    name: 'Business',
    icon: Users,
    price: '3.000',
    fee: '15',
    badge: 'Recommandé',
    features: [
      '3 recherches actives',
      '3 départements',
      'Accès au vivier premium',
      'Consultant dédié',
      'Alertes prioritaires',
    ],
    notIncluded: ['Reporting mensuel'],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    price: 'Sur devis',
    fee: '12',
    features: [
      'Recherches illimitées',
      'Tous les départements',
      'Accès au vivier premium',
      'Consultant dédié',
      'Alertes prioritaires',
      'Reporting mensuel',
    ],
    notIncluded: [],
  },
];

const CabinetStep4Subscription = () => {
  const s = useCabinetStore();

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 4
      </div>
      <h2 className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-1">
        Restez connecté aux<br /><em className="text-muted-foreground">meilleurs talents.</em>
      </h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Un abonnement mensuel pour rester connecté au marché, et un fee de placement réduit uniquement si le candidat idéal rejoint votre cabinet.
      </p>

      {/* How it works */}
      <div className="bg-foreground rounded-md p-6 mb-8">
        <h3 className="font-serif text-lg font-bold text-white mb-3">Comment ça fonctionne</h3>
        <div className="grid grid-cols-3 gap-5">
          <div>
            <div className="font-serif text-2xl font-bold text-white/90 mb-1">1.</div>
            <div className="text-xs font-bold text-white mb-0.5">Abonnement mensuel</div>
            <p className="text-[11px] text-white/50 leading-relaxed">Accédez au vivier, restez opportuniste. Identifiez les profils avant vos concurrents.</p>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-white/90 mb-1">2.</div>
            <div className="text-xs font-bold text-white mb-0.5">Matching & approche</div>
            <p className="text-[11px] text-white/50 leading-relaxed">LOGAN approche confidentiellement les candidats alignés avec votre recherche.</p>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-white/90 mb-1">3.</div>
            <div className="text-xs font-bold text-white mb-0.5">Fee au placement</div>
            <p className="text-[11px] text-white/50 leading-relaxed">Un fee réduit (vs 20–25% marché) uniquement si le profil de vos rêves rejoint votre cabinet.</p>
          </div>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {PALIERS.map((p) => {
          const selected = s.palier === p.key;
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => s.setField('palier', p.key)}
              className={cn(
                'relative text-left rounded-md border-2 p-5 transition-all',
                selected
                  ? 'border-foreground shadow-[inset_4px_0_0_hsl(var(--foreground))] bg-secondary/50'
                  : 'border-border bg-background hover:border-foreground/40'
              )}
            >
              {p.badge && (
                <span className="absolute -top-2.5 right-3 bg-foreground text-background text-[8px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm">
                  {p.badge}
                </span>
              )}

              <Icon className="w-5 h-5 text-foreground mb-3" />
              <div className="text-sm font-bold text-foreground mb-1">{p.name}</div>

              <div className="mb-4">
                <span className="font-serif text-2xl font-bold text-foreground">
                  {p.price.includes('devis') ? '' : `${p.price} €`}
                </span>
                {p.price.includes('devis') ? (
                  <span className="text-sm font-bold text-foreground">Sur devis</span>
                ) : (
                  <span className="text-xs text-muted-foreground"> /mois</span>
                )}
              </div>

              <div className="bg-secondary rounded p-2.5 mb-4">
                <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-0.5">Fee au placement</div>
                <div className="font-serif text-xl font-bold text-foreground">{p.fee}%</div>
                <div className="text-[10px] text-muted-foreground">de la rétrocession annuelle brute</div>
              </div>

              <div className="space-y-2">
                {p.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-[11px] text-foreground">
                    <Check className="w-3 h-3 text-foreground flex-shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
                {p.notIncluded.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-[11px] text-muted-foreground/40 line-through">
                    <span className="w-3 flex-shrink-0 mt-0.5 text-center">—</span>
                    {f}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Comparison vs market */}
      <div className="border border-border rounded-md p-5 mb-6 bg-secondary/30">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-3">Comparatif — placement d'un collaborateur à 100K€ de rétrocession</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded border border-border bg-background">
            <div className="text-xs font-bold text-muted-foreground mb-1">Chasseur classique</div>
            <div className="font-serif text-2xl font-bold text-foreground">20–25K€</div>
            <p className="text-[10px] text-muted-foreground mt-1">One shot, sans accès au vivier, sans visibilité marché</p>
          </div>
          <div className="p-4 rounded border-2 border-foreground bg-background">
            <div className="text-xs font-bold text-foreground mb-1">LOGAN Business</div>
            <div className="font-serif text-2xl font-bold text-foreground">15K€ <span className="text-sm font-normal text-muted-foreground">+ abo</span></div>
            <p className="text-[10px] text-muted-foreground mt-1">Fee réduit + accès continu au vivier + consultant dédié</p>
          </div>
        </div>
      </div>

      {/* Loyalty */}
      <div className="border border-border rounded-md p-5 flex items-start gap-5 bg-secondary/50">
        <div className="flex-shrink-0 bg-foreground rounded text-center px-3.5 py-2.5">
          <div className="font-serif text-xl font-bold text-white">−15%</div>
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-white/60 mt-0.5">dès l'an 2</div>
        </div>
        <div>
          <div className="text-xs font-bold text-foreground mb-1.5">Coefficient fidélité</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les cabinets engagés dans la durée bénéficient d'une remise progressive sur l'abonnement : <strong>−10% à la 2ème année</strong>, <strong>−15% à partir de la 3ème année</strong>.
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(5)} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8 flex items-center gap-2">
          Continuer <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep4Subscription;
