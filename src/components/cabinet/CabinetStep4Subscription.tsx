import { useCabinetStore } from '@/stores/cabinetStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, Shield, Users, Cpu, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const plans = [
  {
    name: 'Logan Access',
    tagline: 'Accéder au marché, en continu',
    price: '2 500',
    engagement: '3 mois',
    successFee: '5 %',
    featured: false,
  },
  {
    name: 'Logan Select',
    tagline: 'Accélérer et sécuriser ses recrutements',
    price: '4 000',
    engagement: '3 mois',
    successFee: '7 %',
    featured: true,
  },
  {
    name: 'Logan Exclusive',
    tagline: 'Mandats stratégiques et profils sensibles',
    price: '6 000',
    engagement: '3 mois',
    successFee: '10 %',
    featured: false,
  },
];

const advantages = [
  { icon: Users, text: 'Un accès continu à un vivier ultra qualifié' },
  { icon: Shield, text: 'Une approche confidentielle adaptée aux enjeux des cabinets d\'affaires' },
  { icon: Cpu, text: 'Une combinaison unique entre technologie et accompagnement humain' },
  { icon: BarChart3, text: 'Un modèle économique plus lisible et plus efficient' },
];

const CabinetStep4Subscription = () => {
  const s = useCabinetStore();

  return (
    <div className="max-w-[780px] mx-auto">
      <div className="text-[9px] font-bold text-muted-foreground tracking-[0.16em] uppercase mb-3 flex items-center gap-2">
        <span className="w-5 h-[1.5px] bg-foreground rounded-sm" />
        Étape 2 / 3
      </div>

      {/* Hero */}
      <motion.div variants={stagger} initial="hidden" animate="visible">
        <motion.p variants={fadeUp} className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground/50 mb-4">
          Modalités d'intervention
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-sans text-3xl md:text-4xl font-normal text-foreground leading-tight mb-2">
          Notre offre
        </motion.h2>
        <motion.p variants={fadeUp} className="text-sm text-muted-foreground font-light leading-relaxed mb-10 max-w-xl">
          Logan propose un modèle fondé sur un accès continu, associé à un accompagnement adapté à la nature et à la sensibilité des recherches.
        </motion.p>
      </motion.div>

      {/* Pricing cards — dark cards on white bg */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
      >
        {plans.map((plan) => (
          <button
            key={plan.name}
            onClick={() => s.setField('palier', plan.name.split(' ')[1].toLowerCase())}
            className={cn(
              'relative rounded-sm p-6 md:p-7 flex flex-col text-left transition-all border-2',
              s.palier === plan.name.split(' ')[1].toLowerCase()
                ? 'border-foreground shadow-[0_0_0_1px_hsl(var(--foreground))]'
                : 'border-transparent hover:border-foreground/20',
            )}
            style={{ background: 'hsl(0 0% 7%)' }}
          >
            {plan.featured && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-sans font-bold tracking-[0.15em] uppercase px-3 py-1 bg-white text-black rounded-sm whitespace-nowrap">
                Recommandé
              </span>
            )}

            <h3 className="font-serif text-lg text-white/90 mb-1">{plan.name}</h3>
            <p className="font-sans text-[11px] leading-[1.5] text-white/40 mb-5">{plan.tagline}</p>

            <div className="mb-5">
              <span className="font-serif text-2xl md:text-3xl font-medium text-white/85">{plan.price} €</span>
              <span className="font-sans text-xs ml-1 text-white/30">/ mois</span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-white/30">Engagement</span>
                <span className="font-sans text-xs text-white/60">{plan.engagement}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-white/30">Success fee</span>
                <span className="font-sans text-xs font-medium text-white/60">{plan.successFee}</span>
              </div>
            </div>

            {/* Selection indicator */}
            <div className={cn(
              'mt-auto pt-4 border-t border-white/[0.08] text-center font-sans text-[10px] tracking-[0.1em] uppercase transition-all',
              s.palier === plan.name.split(' ')[1].toLowerCase()
                ? 'text-white font-bold'
                : 'text-white/25'
            )}>
              {s.palier === plan.name.split(' ')[1].toLowerCase() ? '✓ Sélectionné' : 'Sélectionner'}
            </div>
          </button>
        ))}
      </motion.div>

      {/* Pourquoi Logan */}
      <div className="mb-10">
        <p className="font-sans text-[9px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50 mb-5">Pourquoi Logan</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {advantages.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="border border-white/[0.08] rounded-sm p-5 flex items-start gap-4"
              style={{ background: 'hsl(0 0% 7%)' }}
            >
              <Icon className="w-4 h-4 text-white/25 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <p className="font-sans text-[12px] leading-[1.6] text-white/55">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-11 pt-7 border-t border-border">
        <Button variant="outline" onClick={() => s.setStep(2)} className="font-sans text-sm rounded-sm">← Retour</Button>
        <Button
          onClick={() => s.setStep(4)}
          disabled={!s.palier}
          className="bg-foreground text-background hover:bg-foreground/90 font-sans text-sm font-bold rounded-sm px-8 flex items-center gap-2"
        >
          Continuer <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CabinetStep4Subscription;
