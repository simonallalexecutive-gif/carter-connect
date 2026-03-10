import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { SUBSCRIPTION_ADVANTAGES } from '@/lib/cabinetConstants';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';

const CabinetStep4Subscription = () => {
  const s = useCabinetStore();

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 3 / 4
      </div>
      <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground leading-tight mb-1">
        Restez connecté aux<br /><em className="text-muted-foreground">meilleurs talents.</em>
      </h2>
      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
        Un abonnement mensuel, sans commission, pour tout votre cabinet. Accédez en continu à notre vivier premium et reprenez le contrôle de vos recrutements.
      </p>

      {/* Hero value proposition */}
      <div className="bg-foreground rounded-md p-7 mb-8">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 mt-1">
            <Sparkles className="w-8 h-8 text-white/80" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-2">
              Le meilleur recrutement ne se fait jamais dans l'urgence.
            </h3>
            <p className="text-sm text-white/60 leading-relaxed font-light">
              En restant connecté au vivier LOGAN, vous identifiez les talents <em className="text-white/80">avant</em> d'en avoir besoin.
              Vous passez d'une logique réactive — coûteuse et imprévisible — à une approche stratégique et opportuniste.
              Quand le bon profil apparaît, vous êtes en position de force.
            </p>
          </div>
        </div>
      </div>

      {/* 3 pillars */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-border rounded-md p-5 bg-background">
          <Clock className="w-5 h-5 text-foreground mb-3" />
          <div className="text-xs font-bold text-foreground mb-1">Accès continu</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Ne manquez plus un profil. Les meilleurs candidats ne sont à l'écoute que quelques semaines — soyez là au bon moment.
          </p>
        </div>
        <div className="border border-border rounded-md p-5 bg-background">
          <Shield className="w-5 h-5 text-foreground mb-3" />
          <div className="text-xs font-bold text-foreground mb-1">Zéro commission</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Pas de pourcentage sur la rétrocession. Votre abonnement couvre tout, quel que soit le nombre de placements réalisés.
          </p>
        </div>
        <div className="border border-border rounded-md p-5 bg-background">
          <Sparkles className="w-5 h-5 text-foreground mb-3" />
          <div className="text-xs font-bold text-foreground mb-1">Tout le cabinet</div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Tous les départements, tous les associés, sans limite. Un seul abonnement pour l'ensemble de votre structure.
          </p>
        </div>
      </div>

      {/* Advantages list */}
      <div className="bg-secondary rounded-md p-6 mb-8">
        <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-4">Ce que comprend votre abonnement</div>
        <div className="grid grid-cols-2 gap-4">
          {SUBSCRIPTION_ADVANTAGES.map((adv) => (
            <div key={adv.title} className="flex gap-3">
              <span className="text-lg flex-shrink-0">{adv.icon}</span>
              <div>
                <div className="text-xs font-bold text-foreground mb-0.5">{adv.title}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing teaser */}
      <div className="border-2 border-foreground rounded-md p-6 bg-background">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground mb-1">Tarification</div>
            <h3 className="font-serif text-2xl font-bold text-foreground mb-1">Sur devis — adapté à votre cabinet</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
              Le tarif de votre abonnement mensuel est calculé en fonction de la taille de votre équipe à Paris. Un consultant LOGAN vous recontacte sous 24h pour vous proposer une offre sur mesure.
            </p>
          </div>
          <div className="flex-shrink-0 bg-foreground rounded-md text-center px-5 py-4 ml-6">
            <div className="font-serif text-3xl font-bold text-white leading-none">24h</div>
            <div className="text-[9px] text-white/50 font-bold tracking-[0.08em] uppercase mt-1">Réponse garantie</div>
          </div>
        </div>
      </div>

      {/* Loyalty coefficient */}
      <div className="mt-5 border border-border rounded-md p-5 flex items-start gap-5 bg-secondary/50">
        <div className="flex-shrink-0 bg-foreground rounded text-center px-3.5 py-2.5">
          <div className="font-serif text-xl font-bold text-white">−15%</div>
          <div className="text-[8px] font-bold tracking-[0.08em] uppercase text-white/60 mt-0.5">dès l'an 2</div>
        </div>
        <div>
          <div className="text-xs font-bold text-foreground mb-1.5">Coefficient fidélité — la durée crée la valeur</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Les cabinets engagés dans la durée bénéficient d'une remise progressive : <strong>−10% à la 2ème année</strong>, <strong>−15% à partir de la 3ème année</strong>. Appliquée automatiquement à chaque renouvellement.
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(3)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button onClick={() => s.setStep(5)} className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8 flex items-center gap-2">
          Demander mon devis <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep4Subscription;
