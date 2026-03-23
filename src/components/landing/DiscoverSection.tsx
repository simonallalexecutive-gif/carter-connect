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
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium font-sans">Profil anonymisé</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/[0.08] border border-background/[0.06]">
              <EyeOff className="w-2.5 h-2.5 text-background/40" />
              <span className="text-[7px] tracking-[0.1em] uppercase text-background/40 font-medium font-sans">Confidentiel</span>
            </div>
          </div>
          <div className="font-sans text-lg font-bold leading-tight mb-0.5">Collaborateur Mid Level</div>
          <div className="text-[10px] text-background/35 font-sans mb-5">Prestation de serment : 2020</div>
          <div className="flex items-center gap-3 mb-5 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-background/50" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-background/80 font-sans">Cabinet du Tier 2</div>
              <div className="text-[9px] text-background/35 font-sans">Classement Banque & Finance</div>
            </div>
          </div>
          <div className="mb-5">
            <div className="text-[8px] tracking-[0.15em] uppercase text-background/25 mb-3 font-medium font-sans">Répartition d'activité</div>
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
                  <span className="text-[10px] text-background/55 font-medium font-sans">Financement LBO · 75%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'hsl(0,0%,82%)' }} />
                  <span className="text-[10px] text-background/55 font-medium font-sans">Financement Immo · 25%</span>
                </div>
                <div className="text-[9px] text-background/30 italic pl-4 font-sans">Dominante côté prêteur</div>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-background/[0.08] flex items-center justify-between">
            <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium font-sans">Rétrocession</span>
            <span className="font-sans text-base font-bold text-background">125 K€ HT</span>
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
      <div className="bg-foreground rounded-2xl p-6 text-background w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium font-sans">Opportunité · Présentée par Logan</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/[0.08] border border-background/[0.06]">
              <EyeOff className="w-2.5 h-2.5 text-background/40" />
              <span className="text-[7px] tracking-[0.1em] uppercase text-background/40 font-medium font-sans">Confidentiel</span>
            </div>
          </div>
          <div className="font-sans text-lg font-bold leading-tight mb-0.5">Collaborateur Sénior</div>
          <div className="text-[11px] text-background/50 font-medium font-sans mb-1">Restructuring & Contentieux</div>
          <div className="flex items-center gap-3 mb-5 mt-4 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08] backdrop-blur-sm">
            <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-background/50" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-background/80 font-sans">Cabinet du Tier 3</div>
              <div className="text-[9px] text-background/35 font-sans">Classement Entreprises en difficulté</div>
            </div>
          </div>
          <div className="mb-5 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08]">
            <div className="text-[8px] tracking-[0.15em] uppercase text-background/25 mb-2 font-medium font-sans">Activité principale recherchée</div>
            <div className="text-[11px] font-semibold text-background/80 font-sans">Restructuring (amiable et judiciaire)</div>
            <div className="text-[9px] text-background/35 mt-1 italic font-sans">Dominante côté débiteur</div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
              <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1 font-sans">Rétrocession</div>
              <div className="font-sans text-sm font-bold text-background">145–170 K€</div>
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
              <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1 font-sans">Équipe</div>
              <div className="font-sans text-sm font-bold text-background">3 assoc. · 8 collabs</div>
            </div>
          </div>
          <div className="pt-4 border-t border-background/[0.08] flex items-center justify-between">
            <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium font-sans">Contexte</span>
            <span className="text-[11px] font-semibold text-background/70 font-sans">Départ</span>
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
    title: 'Deux leviers pour recruter',
    description: 'Publiez une recherche et/ou explorez le vivier — deux approches complémentaires, activables simultanément.',
    details: [
      'Rôle passif : publiez votre recherche en toute confidentialité. Logan identifie et approche pour votre compte les talents correspondant à votre besoin.',
      'Rôle actif : explorez à tout moment le réseau des talents à l\'écoute du marché. Consultez les profils anonymisés (séniorité, activité, projet) et déclenchez l\'intervention de Logan sur chaque opportunité.',
      'Les deux approches se complètent : restez opportuniste tout en structurant vos recrutements prioritaires.',
    ],
    visual: (
      <div className="w-full space-y-3">
        {/* Passive card */}
        <div className="bg-foreground rounded-2xl p-5 text-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-background/[0.08] flex items-center justify-center">
                <Bell className="w-3 h-3 text-background/50" />
              </div>
              <div className="text-[8px] tracking-[0.2em] uppercase text-background/40 font-medium font-sans">Rôle passif</div>
            </div>
            <div className="font-sans text-sm font-bold leading-tight mb-1">Publiez votre recherche</div>
            <div className="text-[10px] text-background/40 font-sans leading-relaxed">Logan cible et approche les candidats pour votre compte</div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {['M&A / PE', 'Mid Level', 'Confidentiel'].map(tag => (
                <span key={tag} className="text-[8px] px-2 py-0.5 rounded-full bg-background/[0.08] text-background/50 font-medium font-sans border border-background/[0.06]">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        {/* AND/OR separator */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[9px] font-sans font-bold tracking-[0.15em] uppercase text-muted-foreground/60">et / ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        {/* Active card */}
        <div className="bg-foreground rounded-2xl p-5 text-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-background/[0.08] flex items-center justify-center">
                <Search className="w-3 h-3 text-background/50" />
              </div>
              <div className="text-[8px] tracking-[0.2em] uppercase text-background/40 font-medium font-sans">Rôle actif</div>
            </div>
            <div className="font-sans text-sm font-bold leading-tight mb-1">Explorez le vivier premium</div>
            <div className="text-[10px] text-background/40 font-sans leading-relaxed">Consultez les profils anonymisés et déclenchez Logan par opportunité</div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {['Séniorité', 'Activité', 'Projet'].map(item => (
                <div key={item} className="text-center px-2 py-1.5 rounded-lg bg-background/[0.05] border border-background/[0.06]">
                  <div className="text-[8px] text-background/50 font-sans font-medium">{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Logan, seul intermédiaire',
    description: 'Quelle que soit l\'approche choisie, Logan orchestre chaque rapprochement en toute confidentialité.',
    details: [
      'Aucun contact direct entre le cabinet et le candidat sans validation préalable de Logan.',
      'Logan approche les candidats pour votre compte, qualifie l\'intérêt et prépare la mise en relation.',
      'Votre identité de recruteur reste protégée jusqu\'à l\'entretien confirmé.',
    ],
    visual: (
      <div className="bg-foreground rounded-2xl p-6 text-background w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium font-sans mb-5">Processus de rapprochement</div>
          <div className="space-y-3">
            {[
              { icon: Eye, label: 'Identification du talent', sub: 'Via recherche publiée ou exploration du vivier' },
              { icon: Shield, label: 'Qualification par Logan', sub: 'Approche confidentielle, validation de l\'intérêt mutuel' },
              { icon: Handshake, label: 'Mise en relation orchestrée', sub: 'Entretien préparé — identités révélées à ce stade uniquement' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08]">
                <div className="w-8 h-8 rounded-lg bg-background/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-background/50" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-background/80 font-sans">{item.label}</div>
                  <div className="text-[9px] text-background/35 font-sans mt-0.5">{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-background/[0.08] text-center">
            <span className="text-[9px] text-background/30 uppercase tracking-[0.12em] font-medium font-sans">Dans tous les cas, Logan est votre seul point de contact</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Un modèle hybride gagnant',
    description: 'Logan accompagne votre cabinet au quotidien avec un modèle économique transparent et compétitif.',
    details: [
      'Rôle actif & opportuniste : explorez tout au long de l\'année la dynamique des talents de votre marché, tous départements confondus. Le vivier est alimenté en continu par Logan pour vous offrir une visibilité permanente sur les meilleurs profils.',
      'Rôle traditionnel & confidentiel : publiez vos recherches sur Logan qui interviendra pour votre compte afin de vous présenter les profils correspondant à votre besoin, en toute discrétion.',
      'Modèle économique : un abonnement trimestriel (sur devis, adapté à la taille et aux besoins du cabinet) + un fee de placement compris entre 15% et 18% de la rétrocession annuelle brute, selon la formule retenue.',
    ],
    visual: (
      <div className="w-full space-y-3">
        <div className="bg-foreground rounded-2xl p-6 text-background shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border border-white/[0.06] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="text-[8px] tracking-[0.2em] uppercase text-background/30 font-medium font-sans mb-4">Votre investissement</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08]">
                <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1.5 font-sans">Abonnement</div>
                <div className="font-sans text-base font-bold text-background">Trimestriel</div>
                <div className="text-[9px] text-background/35 font-sans mt-1">Sur devis · adapté à votre cabinet</div>
              </div>
              <div className="px-4 py-3 rounded-xl bg-background/[0.06] border border-background/[0.08]">
                <div className="text-[8px] uppercase text-background/25 tracking-[0.1em] mb-1.5 font-sans">Fee de placement</div>
                <div className="font-sans text-base font-bold text-background">15 – 18%</div>
                <div className="text-[9px] text-background/35 font-sans mt-1">De la rétrocession annuelle brute</div>
              </div>
            </div>
            <div className="pt-4 border-t border-background/[0.08] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-background/40 flex-shrink-0" />
                <span className="text-[10px] text-background/50 font-sans">Accès continu au vivier — tous départements</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-background/40 flex-shrink-0" />
                <span className="text-[10px] text-background/50 font-sans">Vivier alimenté au quotidien par Logan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-background/40 flex-shrink-0" />
                <span className="text-[10px] text-background/50 font-sans">Recherches publiées en toute confidentialité</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-muted border border-border text-center">
          <span className="text-[10px] text-muted-foreground font-sans">Chasseur classique : </span>
          <span className="text-[10px] font-bold text-foreground line-through font-sans">20–25% fee · sans visibilité marché</span>
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
