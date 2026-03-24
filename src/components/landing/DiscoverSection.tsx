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
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-7 h-7 rounded-full bg-foreground/[0.06] flex items-center justify-center">
            <EyeOff className="w-3 h-3 text-foreground/40" />
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/35 font-medium font-sans">Profil anonymisé</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="font-sans text-base font-semibold text-foreground leading-tight">Collaborateur Mid Level</div>
            <div className="text-[10px] text-foreground/35 font-sans mt-0.5">Prestation de serment : 2020</div>
          </div>
          <div className="h-px bg-foreground/[0.06]" />
          <div className="flex items-center gap-3">
            <BarChart3 className="w-3.5 h-3.5 text-foreground/30" />
            <div>
              <div className="text-[11px] font-medium text-foreground/70 font-sans">Cabinet du Tier 2</div>
              <div className="text-[9px] text-foreground/30 font-sans">Classement Banque & Finance</div>
            </div>
          </div>
          <div className="h-px bg-foreground/[0.06]" />
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-foreground/30 uppercase tracking-[0.1em] font-sans">Rétrocession</span>
            <span className="font-sans text-sm font-semibold text-foreground">125 K€ HT</span>
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
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-7 h-7 rounded-full bg-foreground/[0.06] flex items-center justify-center">
            <Search className="w-3 h-3 text-foreground/40" />
          </div>
          <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/35 font-medium font-sans">Opportunité · Logan</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="font-sans text-base font-semibold text-foreground leading-tight">Collaborateur Sénior</div>
            <div className="text-[10px] text-foreground/45 font-sans mt-0.5">Restructuring & Contentieux</div>
          </div>
          <div className="h-px bg-foreground/[0.06]" />
          <div className="flex items-center gap-3">
            <BarChart3 className="w-3.5 h-3.5 text-foreground/30" />
            <div>
              <div className="text-[11px] font-medium text-foreground/70 font-sans">Cabinet du Tier 3</div>
              <div className="text-[9px] text-foreground/30 font-sans">Entreprises en difficulté</div>
            </div>
          </div>
          <div className="h-px bg-foreground/[0.06]" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[8px] uppercase text-foreground/25 tracking-[0.1em] font-sans mb-0.5">Rétrocession</div>
              <div className="font-sans text-sm font-semibold text-foreground">145–170 K€</div>
            </div>
            <div>
              <div className="text-[8px] uppercase text-foreground/25 tracking-[0.1em] font-sans mb-0.5">Équipe</div>
              <div className="font-sans text-sm font-semibold text-foreground">3 assoc. · 8 collabs</div>
            </div>
          </div>
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
      <div className="space-y-3">
        {[
          { label: 'Intérêt mutuel confirmé', done: true },
          { label: 'Brief de votre consultant Logan', done: true },
          { label: 'Levée de rideau & entretien', done: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0',
              s.done ? 'bg-foreground text-background' : 'border border-foreground/20 text-foreground/40'
            )}>
              {s.done ? '✓' : i + 1}
            </div>
            <span className={cn('text-sm font-sans', s.done ? 'text-foreground/70' : 'text-foreground/40')}>{s.label}</span>
          </div>
        ))}
      </div>
    ),
  },
];

const cabinetSteps: Step[] = [
  {
    number: '01',
    title: 'Deux leviers pour recruter',
    description: 'Publiez une recherche et/ou explorez le vivier — deux approches complémentaires.',
    details: [
      'Rôle passif : publiez votre recherche en toute confidentialité. Logan identifie et approche pour votre compte les talents correspondant à votre besoin.',
      'Rôle actif : explorez à tout moment le réseau des talents à l\'écoute du marché. Consultez les profils anonymisés (séniorité, activité, projet) et déclenchez l\'intervention de Logan sur chaque opportunité.',
      'Les deux approches se complètent : restez opportuniste tout en structurant vos recrutements prioritaires.',
    ],
    visual: (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Bell className="w-3.5 h-3.5 text-foreground/35" />
            <span className="text-[11px] font-medium text-foreground/70 font-sans">Publiez votre recherche</span>
          </div>
          <p className="text-[10px] text-foreground/35 font-sans pl-6">Logan cible et approche les candidats pour votre compte</p>
        </div>
        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-foreground/[0.06]" />
          <span className="text-[8px] font-sans font-medium tracking-[0.15em] uppercase text-foreground/25">et / ou</span>
          <div className="flex-1 h-px bg-foreground/[0.06]" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-foreground/35" />
            <span className="text-[11px] font-medium text-foreground/70 font-sans">Explorez le vivier premium</span>
          </div>
          <p className="text-[10px] text-foreground/35 font-sans pl-6">Consultez les profils anonymisés et déclenchez Logan</p>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Logan, seul intermédiaire',
    description: 'Logan orchestre chaque rapprochement en toute confidentialité.',
    details: [
      'Aucun contact direct entre le cabinet et le candidat sans validation préalable de Logan.',
      'Logan approche les candidats pour votre compte, qualifie l\'intérêt et prépare la mise en relation.',
      'Votre identité de recruteur reste protégée jusqu\'à l\'entretien confirmé.',
    ],
    visual: (
      <div className="space-y-3">
        {[
          { icon: Eye, label: 'Identification du talent', sub: 'Via recherche ou exploration' },
          { icon: Shield, label: 'Qualification par Logan', sub: 'Validation de l\'intérêt mutuel' },
          { icon: Handshake, label: 'Mise en relation orchestrée', sub: 'Identités révélées à ce stade' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-foreground/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
              <item.icon className="w-3 h-3 text-foreground/40" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-foreground/70 font-sans">{item.label}</div>
              <div className="text-[9px] text-foreground/30 font-sans">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    title: 'Un modèle hybride gagnant',
    description: 'Un modèle économique transparent et compétitif.',
    details: [
      'Rôle actif & opportuniste : explorez tout au long de l\'année la dynamique des talents de votre marché, tous départements confondus.',
      'Rôle traditionnel & confidentiel : publiez vos recherches sur Logan qui interviendra pour votre compte.',
      'Modèle économique : un abonnement trimestriel (sur devis) + un fee de placement entre 15% et 18%.',
    ],
    visual: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[8px] uppercase text-foreground/25 tracking-[0.1em] font-sans mb-1">Abonnement</div>
            <div className="font-sans text-sm font-semibold text-foreground">Trimestriel</div>
            <div className="text-[9px] text-foreground/30 font-sans mt-0.5">Sur devis</div>
          </div>
          <div>
            <div className="text-[8px] uppercase text-foreground/25 tracking-[0.1em] font-sans mb-1">Fee de placement</div>
            <div className="font-sans text-sm font-semibold text-foreground">15 – 18%</div>
            <div className="text-[9px] text-foreground/30 font-sans mt-0.5">Rétrocession brute</div>
          </div>
        </div>
        <div className="h-px bg-foreground/[0.06]" />
        <div className="space-y-2">
          {['Accès continu au vivier', 'Vivier alimenté au quotidien', 'Recherches confidentielles'].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-foreground/30 flex-shrink-0" />
              <span className="text-[10px] text-foreground/45 font-sans">{t}</span>
            </div>
          ))}
        </div>
        <div className="text-center pt-2">
          <span className="text-[9px] text-foreground/30 font-sans">Chasseur classique : </span>
          <span className="text-[9px] font-medium text-foreground/40 line-through font-sans">20–25%</span>
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
    <section className="py-20 md:py-28 bg-background relative overflow-hidden" id="notre-approche-section">
      <div className="carter-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
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

        {/* Perspective toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex bg-foreground/[0.06] rounded-full p-1">
            {(['candidat', 'cabinet'] as Perspective[]).map(p => (
              <button
                key={p}
                onClick={() => switchPerspective(p)}
                className={cn(
                  'px-7 py-2.5 text-xs font-sans font-medium rounded-full transition-all duration-300 inline-flex items-center gap-2',
                  perspective === p
                    ? 'bg-foreground text-background shadow-md'
                    : 'text-foreground/40 hover:text-foreground/70'
                )}
              >
                {p === 'candidat' ? <><UserCheck className="w-3.5 h-3.5" /> Candidat</> : <><Building2 className="w-3.5 h-3.5" /> Cabinet</>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step selector — minimal dots with labels */}
        <div className="flex justify-center mb-14">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={`${perspective}-${i}`} className="flex items-center">
                <button
                  onClick={() => setActiveStep(i)}
                  className={cn(
                    'flex items-center gap-2.5 px-5 py-2 transition-all duration-300',
                    i === activeStep
                      ? 'text-foreground'
                      : 'text-foreground/30 hover:text-foreground/60'
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300',
                    i === activeStep
                      ? 'bg-foreground text-background'
                      : 'border border-foreground/15 text-foreground/30'
                  )}>
                    {s.number}
                  </span>
                  <span className="text-xs font-medium hidden sm:inline">{s.title}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={cn(
                    'w-8 md:w-12 h-px mx-1 transition-colors duration-300',
                    i < activeStep ? 'bg-foreground/30' : 'bg-foreground/10'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active step content — clean two-column layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${perspective}-${activeStep}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-5 gap-0">
              {/* Left — Content (3/5) */}
              <div className="md:col-span-3 py-10 md:py-14 pr-8 md:pr-14 pl-2">
                <h3 className="font-serif text-2xl md:text-[1.75rem] font-normal text-foreground mb-3 tracking-[-0.01em] leading-tight">
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
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-1 h-1 rounded-full bg-foreground/25 mt-2 flex-shrink-0" />
                      <p className="text-[13px] text-foreground/55 leading-relaxed">{detail}</p>
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

              {/* Right — Visual preview (2/5) — minimal, airy */}
              <div className="md:col-span-2 py-10 md:py-14 pl-8 md:pl-10 flex items-center justify-center border-l border-foreground/[0.06]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-[260px]"
                >
                  {step.visual}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows + dots */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/30 flex items-center justify-center transition-all disabled:opacity-15 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-3.5 h-3.5 text-foreground rotate-180" />
          </button>
          <div className="flex items-center gap-2.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={cn(
                  'transition-all duration-300 rounded-full',
                  i === activeStep
                    ? 'w-6 h-1.5 bg-foreground'
                    : 'w-1.5 h-1.5 bg-foreground/15 hover:bg-foreground/30'
                )}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
            disabled={activeStep === steps.length - 1}
            className="w-9 h-9 rounded-full border border-foreground/10 hover:border-foreground/30 flex items-center justify-center transition-all disabled:opacity-15 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
