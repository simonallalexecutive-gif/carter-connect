import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, EyeOff, Users, Search,
  Handshake, Building2, UserCheck, Bell, BarChart3, Clock, CheckCircle2, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Perspective = 'candidat' | 'cabinet';

interface Step {
  number: string;
  title: string;
  description: string;
  details: string[];
  visual: React.ReactNode;
}

const candidatSteps: Step[] = [
  {
    number: '01',
    title: 'Créez votre profil confidentiel',
    description: 'Inscription en 5 minutes — votre identité reste strictement protégée.',
    details: [
      'Votre nom et votre cabinet actuel ne sont jamais révélés aux recruteurs.',
      'Renseignez votre expertise, séniorité, langues et aspirations.',
      'Profil validé sous 48h par l\'équipe Logan.',
    ],
    visual: (
      <div className="bg-foreground rounded-2xl p-6 text-background w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium">Profil anonymisé</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/[0.08] border border-background/[0.06]">
              <EyeOff className="w-2.5 h-2.5 text-background/40" />
              <span className="text-[7px] tracking-[0.1em] uppercase text-background/40 font-medium">Confidentiel</span>
            </div>
          </div>

          {/* Seniority */}
          <div className="font-serif text-lg font-bold leading-tight mb-0.5">Collaborateur Mid Level</div>
          <div className="text-[10px] text-background/35 mb-5">Prestation de serment : 2020</div>

          {/* Ranking */}
          <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-background/50" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-background/80">Cabinet du Tier 2</div>
              <div className="text-[9px] text-background/35">Classement Banque & Finance</div>
            </div>
          </div>

          {/* Mini donut chart — activity split */}
          <div className="mb-5">
            <div className="text-[8px] tracking-[0.15em] uppercase text-background/25 mb-3 font-medium">Répartition d'activité</div>
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle cx="28" cy="28" r="20" fill="none" stroke="hsl(0,0%,65%)" strokeWidth="8"
                    strokeDasharray={`${0.75 * 125.66} ${0.25 * 125.66}`}
                    strokeDashoffset="31.4" strokeLinecap="round" />
                  <circle cx="28" cy="28" r="20" fill="none" stroke="hsl(0,0%,82%)" strokeWidth="8"
                    strokeDasharray={`${0.25 * 125.66} ${0.75 * 125.66}`}
                    strokeDashoffset={31.4 - 0.75 * 125.66} strokeLinecap="round" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(0,0%,65%)' }} />
                  <span className="text-[10px] text-background/55 font-medium">Financement LBO · 75%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(0,0%,82%)' }} />
                  <span className="text-[10px] text-background/55 font-medium">Financement Immo · 25%</span>
                </div>
                <div className="text-[9px] text-background/30 italic pl-4">Dominante côté prêteur</div>
              </div>
            </div>
          </div>

          {/* Rétrocession */}
          <div className="pt-4 border-t border-background/[0.08] flex items-center justify-between">
            <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium">Rétrocession</span>
            <span className="font-serif text-base font-bold text-background">125 K€ HT</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Recevez des opportunités ciblées',
    description: 'Les cabinets publient leurs besoins — Logan vous présente ceux qui matchent.',
    details: [
      'Matching intelligent basé sur votre expertise, séniorité et préférences.',
      'Consultez les fiches d\'opportunité : département, taille d\'équipe, rémunération.',
      'Le cabinet ne sait pas que vous existez tant que vous n\'avez pas dit oui.',
    ],
    visual: (
      <div className="bg-foreground rounded-xl overflow-hidden w-full">
        <div className="p-5 border-b border-background/[0.06]">
          <div className="text-[9px] tracking-[0.16em] uppercase text-background/30 mb-2">Opportunité · Présentée par LOGAN</div>
          <div className="font-serif text-base font-bold text-background mb-1">Senior · Banque & Finance</div>
          <div className="text-[11px] text-background/45">Cabinet anonyme · Tier 1</div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] uppercase text-background/30 mb-1">Rétrocession</div>
            <div className="font-serif text-sm font-bold text-background">65–80 K€</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-background/30 mb-1">Équipe</div>
            <div className="font-serif text-sm font-bold text-background">2 associés · 5 collabs</div>
          </div>
        </div>
        <div className="p-5 pt-0">
          <div className="w-full py-2.5 bg-background text-foreground font-bold text-xs rounded text-center">Je suis intéressé(e) →</div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Mise en relation orchestrée',
    description: 'Logan lève le rideau uniquement avec votre accord explicite.',
    details: [
      'Votre consultant Logan prépare l\'échange : contexte, attentes, timing.',
      'Entretien organisé — le cabinet découvre votre identité à ce moment seulement.',
      '0% commission côté candidat. Toujours. Sans exception.',
    ],
    visual: (
      <div className="w-full space-y-3">
        {[
          { step: '1', label: 'Intérêt mutuel confirmé', done: true },
          { step: '2', label: 'Brief de votre consultant Logan', done: true },
          { step: '3', label: 'Levée de rideau & entretien', done: false },
        ].map(s => (
          <div key={s.step} className={cn(
            'flex items-center gap-4 p-4 rounded-lg border transition-all',
            s.done ? 'bg-foreground text-background border-foreground' : 'bg-muted border-border'
          )}>
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              s.done ? 'bg-background text-foreground' : 'bg-foreground text-background'
            )}>{s.done ? '✓' : s.step}</div>
            <span className={cn('text-sm font-medium', s.done ? 'text-background' : 'text-foreground')}>{s.label}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const cabinetSteps: Step[] = [
  {
    number: '01',
    title: 'Publiez votre recherche',
    description: 'Décrivez le profil idéal — Logan cible les candidats pertinents.',
    details: [
      'Séniorité, expertise, taille d\'opérations, anglais, cabinet d\'origine…',
      '3 niveaux de confidentialité : confidentielle, semi-confidentielle, ouverte.',
      'Précisez vos cabinets prioritaires pour des alertes ciblées.',
    ],
    visual: (
      <div className="bg-muted rounded-xl p-6 w-full">
        <div className="text-[9px] font-bold tracking-[0.12em] uppercase text-muted-foreground mb-4">Votre recherche</div>
        <div className="space-y-3">
          {[
            { label: 'Séniorité', value: 'Mid Level · Sénior' },
            { label: 'Expertise', value: 'M&A Industriel, PE / LBO' },
            { label: 'Anglais', value: 'Courant / Bilingue' },
            { label: 'Confidentialité', value: '🔒 Confidentielle' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-baseline py-1.5 border-b border-border last:border-b-0">
              <span className="text-[11px] text-muted-foreground">{r.label}</span>
              <span className="text-xs font-medium text-foreground">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Consultez le vivier premium',
    description: 'Accédez en temps réel aux profils anonymisés à l\'écoute du marché.',
    details: [
      'Score de matching intelligent : expertise, séniorité, motivations.',
      'Alertes prioritaires dès qu\'un profil correspond à vos critères.',
      'Recrutement stratégique : identifiez les talents avant vos concurrents.',
    ],
    visual: (
      <div className="bg-foreground rounded-2xl p-6 text-background w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium">Profil anonymisé</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/[0.08] border border-background/[0.06]">
              <EyeOff className="w-2.5 h-2.5 text-background/40" />
              <span className="text-[7px] tracking-[0.1em] uppercase text-background/40 font-medium">Confidentiel</span>
            </div>
          </div>

          {/* Seniority & Expertise */}
          <div className="font-serif text-lg font-bold leading-tight mb-0.5">Collaborateur Mid Level</div>
          <div className="text-[11px] text-background/50 font-medium mb-1">Private Equity / LBO</div>

          {/* Ranking */}
          <div className="flex items-center gap-3 mb-5 mt-4 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-background/50" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-background/80">Cabinet du Tier 4</div>
              <div className="text-[9px] text-background/35">Classement Private Equity</div>
            </div>
          </div>

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
              <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1">Rétrocession</div>
              <div className="font-serif text-sm font-bold text-background">90–110 K€</div>
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
              <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1">Équipe</div>
              <div className="font-serif text-sm font-bold text-background">3 assoc. · 8 collabs</div>
            </div>
          </div>

          {/* Context */}
          <div className="pt-4 border-t border-background/[0.08] flex items-center justify-between">
            <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium">Contexte</span>
            <span className="text-[11px] font-semibold text-background/70">Renforcement d'équipe</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Un modèle hybride gagnant',
    description: 'Abonnement mensuel + fee de placement réduit vs chasseurs traditionnels.',
    details: [
      'Starter à 1.500€/mois (fee 18%) — Business à 3.000€/mois (fee 15%) — Enterprise sur devis (fee 12%).',
      'Jusqu\'à 50% d\'économie vs un chasseur classique (20–25% de fee).',
      'Accès permanent au vivier : recrutez quand l\'opportunité se présente, pas dans l\'urgence.',
    ],
    visual: (
      <div className="w-full">
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Starter', price: '1.500€', fee: '18%' },
            { name: 'Business', price: '3.000€', fee: '15%', badge: true },
            { name: 'Enterprise', price: 'Devis', fee: '12%' },
          ].map(p => (
            <div key={p.name} className={cn(
              'rounded-lg p-4 text-center border',
              p.badge ? 'bg-foreground text-background border-foreground' : 'bg-muted border-border'
            )}>
              <div className="text-[9px] font-bold tracking-[0.1em] uppercase mb-2" style={{ opacity: 0.5 }}>{p.name}</div>
              <div className="font-serif text-base font-bold mb-1">{p.price}</div>
              <div className="text-[10px]" style={{ opacity: 0.5 }}>/mois</div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: p.badge ? 'rgba(255,255,255,0.1)' : undefined }}>
                <div className="font-serif text-lg font-bold">{p.fee}</div>
                <div className="text-[9px]" style={{ opacity: 0.4 }}>fee placement</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded bg-muted border border-border text-center">
          <span className="text-[11px] text-muted-foreground">Chasseur classique : </span>
          <span className="text-[11px] font-bold text-foreground line-through">20–25% fee</span>
        </div>
      </div>
    ),
  },
];

const DiscoverSection = () => {
  const [perspective, setPerspective] = useState<Perspective>('candidat');
  const [activeStep, setActiveStep] = useState(0);

  const steps = perspective === 'candidat' ? candidatSteps : cabinetSteps;
  const step = steps[activeStep];

  const switchPerspective = (p: Perspective) => {
    setPerspective(p);
    setActiveStep(0);
  };

  return (
    <section className="py-24 md:py-32 bg-[hsl(0_0%_96%)] relative overflow-hidden">

      <div className="carter-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="text-[10px] font-sans font-medium tracking-[0.25em] uppercase text-muted-foreground mb-5">
            Notre Approche
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-normal text-foreground mb-4 tracking-[-0.02em] leading-[1.1]">
            Un parcours pensé pour <em className="italic">chaque</em> acteur
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            Explorez le parcours Logan selon votre perspective.
          </p>
        </motion.div>

        {/* Perspective toggle — pill style */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex bg-background rounded-full p-1.5 shadow-[0_1px_3px_hsl(0_0%_0%/0.08),0_1px_2px_hsl(0_0%_0%/0.06)]">
            {(['candidat', 'cabinet'] as Perspective[]).map(p => (
              <button
                key={p}
                onClick={() => switchPerspective(p)}
                className={cn(
                  'px-7 py-2.5 text-xs font-sans font-medium rounded-full transition-all duration-400 inline-flex items-center gap-2',
                  perspective === p
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p === 'candidat' ? <><UserCheck className="w-3.5 h-3.5" /> Candidat</> : <><Building2 className="w-3.5 h-3.5" /> Cabinet</>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Horizontal step selector — timeline */}
        <div className="flex justify-center mb-12 md:mb-16">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={`${perspective}-${i}`} className="flex items-center">
                <button
                  onClick={() => setActiveStep(i)}
                  className={cn(
                    'flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-400',
                    i === activeStep
                      ? 'bg-foreground text-background shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background'
                  )}
                >
                  <span className={cn(
                    'text-[10px] font-mono font-bold',
                    i === activeStep ? 'text-background/60' : 'text-muted-foreground/50'
                  )}>
                    {s.number}
                  </span>
                  <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    'w-8 md:w-12 h-px mx-1',
                    i < activeStep ? 'bg-foreground' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${perspective}-${activeStep}`}
            initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            <div className="bg-background rounded-2xl shadow-[0_4px_24px_hsl(0_0%_0%/0.06),0_1px_4px_hsl(0_0%_0%/0.04)] overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left — Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground/50 tracking-wider">
                      Étape {step.number}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-3 tracking-[-0.01em] leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
                    {step.description}
                  </p>

                  {/* Detail points */}
                  <div className="space-y-4">
                    {step.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-foreground/70 leading-relaxed">{detail}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA on last step */}
                  {activeStep === steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-10"
                    >
                      <Link to={perspective === 'candidat' ? '/inscription?start=2' : '/cabinet?start=2'}>
                        <Button className="bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-full px-8 py-5 group">
                          {perspective === 'candidat' ? 'Créer mon profil' : 'Inscrire mon cabinet'}
                          <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>

                {/* Right — Visual */}
                <div className="p-8 md:p-10 flex items-center justify-center relative overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-xs"
                  >
                    {step.visual}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                'transition-all duration-400 rounded-full',
                i === activeStep
                  ? 'w-8 h-2 bg-foreground'
                  : 'w-2 h-2 bg-foreground/20 hover:bg-foreground/40'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
