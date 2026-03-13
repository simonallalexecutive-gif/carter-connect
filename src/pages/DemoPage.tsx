import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, EyeOff, UserCheck, CheckCircle2, Shield, Search, Eye, Bell, Users, Handshake, Building2, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import heroVideo from '@/assets/hero-video-jessica.mp4';

/* ─── Types ─── */
type Perspective = 'candidat' | 'cabinet';

interface Scene {
  tag: string;
  title: string;
  description: string;
  points: { icon: React.ReactNode; text: string }[];
  visual: React.ReactNode;
}

/* ─── Scene data ─── */
const candidatScenes: Scene[] = [
  {
    tag: 'Étape 01',
    title: 'Créez votre profil\nconfidentiel',
    description: 'Inscription en 5 minutes — votre identité reste strictement protégée.',
    points: [
      { icon: <EyeOff className="w-4 h-4" />, text: 'Votre nom et cabinet ne sont jamais révélés.' },
      { icon: <UserCheck className="w-4 h-4" />, text: 'Expertise, séniorité, langues et aspirations.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Profil validé sous 48h.' },
    ],
    visual: (
      <div className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl p-8 max-w-xs w-full">
        <div className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-4 font-sans">Profil anonymisé</div>
        <div className="font-serif text-xl text-white mb-1">Collaborateur · M&A / PE</div>
        <div className="text-xs text-white/40 mb-5 font-sans">5 ans PQE · Cabinet US Tier 1</div>
        <div className="flex gap-2 flex-wrap mb-5">
          {['M&A Industriel', 'Private Equity', 'Bilingue'].map(t => (
            <span key={t} className="text-[10px] px-3 py-1.5 rounded-full border border-white/10 text-white/50 font-sans">{t}</span>
          ))}
        </div>
        <div className="pt-5 border-t border-white/[0.06] text-[11px] text-white/30 flex items-center gap-2 font-sans">
          <EyeOff className="w-3.5 h-3.5" /> Identité protégée
        </div>
      </div>
    ),
  },
  {
    tag: 'Étape 02',
    title: 'Recevez des\nopportunités ciblées',
    description: 'Les cabinets publient leurs besoins — Logan vous présente ceux qui matchent.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Matching basé sur votre expertise et préférences.' },
      { icon: <Eye className="w-4 h-4" />, text: 'Département, taille d\'équipe, rémunération.' },
      { icon: <Shield className="w-4 h-4" />, text: 'Vous restez invisible jusqu\'à votre accord.' },
    ],
    visual: (
      <div className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl overflow-hidden max-w-xs w-full">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="text-[9px] tracking-[0.2em] uppercase text-white/25 mb-3 font-sans">Opportunité · Logan</div>
          <div className="font-serif text-lg text-white mb-1">Senior · Banque & Finance</div>
          <div className="text-[11px] text-white/35 font-sans">Cabinet anonyme · Tier 1</div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4">
          <div>
            <div className="text-[9px] uppercase text-white/25 mb-1 font-sans">Rétrocession</div>
            <div className="font-serif text-base text-white">65–80 K€</div>
          </div>
          <div>
            <div className="text-[9px] uppercase text-white/25 mb-1 font-sans">Équipe</div>
            <div className="font-serif text-base text-white">2 associés · 5 collabs</div>
          </div>
        </div>
        <div className="px-6 pb-6">
          <div className="w-full py-3 bg-white text-black font-medium text-xs rounded-lg text-center font-sans">
            Je suis intéressé(e) →
          </div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Étape 03',
    title: 'Mise en relation\norchestée',
    description: 'Logan lève le rideau uniquement avec votre accord explicite.',
    points: [
      { icon: <Users className="w-4 h-4" />, text: 'Votre consultant prépare l\'échange.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Identité révélée à l\'entretien seulement.' },
      { icon: <Shield className="w-4 h-4" />, text: '0% commission côté candidat. Toujours.' },
    ],
    visual: (
      <div className="max-w-xs w-full space-y-3">
        {[
          { step: '01', label: 'Intérêt mutuel confirmé', done: true },
          { step: '02', label: 'Brief de votre consultant', done: true },
          { step: '03', label: 'Levée de rideau & entretien', done: false },
        ].map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'flex items-center gap-4 p-5 rounded-xl border transition-all',
              s.done
                ? 'bg-white/[0.06] border-white/[0.08] text-white'
                : 'bg-white/[0.03] border-white/[0.05] text-white/50'
            )}
          >
            <div className={cn(
              'w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 font-sans',
              s.done ? 'bg-white text-black' : 'bg-white/10 text-white/40'
            )}>{s.done ? '✓' : s.step}</div>
            <span className="text-sm font-sans">{s.label}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
];

const cabinetScenes: Scene[] = [
  {
    tag: 'Étape 01',
    title: 'Publiez votre\nrecherche',
    description: 'Décrivez le profil idéal — Logan cible les candidats pertinents.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Séniorité, expertise, taille d\'opérations.' },
      { icon: <Shield className="w-4 h-4" />, text: '3 niveaux de confidentialité.' },
      { icon: <Users className="w-4 h-4" />, text: 'Cabinets prioritaires pour alertes ciblées.' },
    ],
    visual: (
      <div className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl p-7 max-w-xs w-full">
        <div className="text-[9px] font-medium tracking-[0.16em] uppercase text-white/25 mb-5 font-sans">Votre recherche</div>
        <div className="space-y-3">
          {[
            { label: 'Séniorité', value: 'Mid Level · Sénior' },
            { label: 'Expertise', value: 'M&A Industriel, PE / LBO' },
            { label: 'Anglais', value: 'Courant / Bilingue' },
            { label: 'Confidentialité', value: '🔒 Confidentielle' },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-baseline py-2 border-b border-white/[0.06] last:border-b-0">
              <span className="text-[11px] text-white/30 font-sans">{r.label}</span>
              <span className="text-xs font-medium text-white/70 font-sans">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: 'Étape 02',
    title: 'Consultez le\nvivier premium',
    description: 'Accédez en temps réel aux profils anonymisés à l\'écoute du marché.',
    points: [
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Score de matching intelligent.' },
      { icon: <Bell className="w-4 h-4" />, text: 'Alertes prioritaires en temps réel.' },
      { icon: <Clock className="w-4 h-4" />, text: 'Recrutement stratégique, pas dans l\'urgence.' },
    ],
    visual: (
      <div className="max-w-xs w-full space-y-2.5">
        {[
          { id: 'C-042', title: 'Senior Associate Finance · 5 ans', match: 92, tags: ['Financement', 'PE'], tier: 'Cabinet US Tier 1' },
          { id: 'C-057', title: 'Collaborateur M&A · 4 ans', match: 88, tags: ['M&A', 'PE'], tier: 'Cabinet FR Tier 1' },
          { id: 'C-071', title: 'Collaborateur Finance · 3 ans', match: 79, tags: ['Financement'], tier: 'Cabinet UK Tier 2' },
        ].map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-serif text-sm font-bold flex-shrink-0">
              {p.match}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate font-sans">{p.title}</div>
              <div className="text-[10px] text-white/30 mt-0.5 font-sans">{p.tier}</div>
              <div className="flex gap-1 mt-1.5">
                {p.tags.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full border border-white/10 text-white/40 font-sans">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Étape 03',
    title: 'Un modèle\nhybride gagnant',
    description: 'Abonnement mensuel + fee de placement réduit vs chasseurs traditionnels.',
    points: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Starter 1.500€/mois — Business 3.000€/mois — Enterprise sur devis.' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Jusqu\'à 50% d\'économie vs chasseurs classiques.' },
      { icon: <Clock className="w-4 h-4" />, text: 'Accès permanent au vivier.' },
    ],
    visual: (
      <div className="max-w-xs w-full">
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Starter', price: '1.500€', fee: '18%' },
            { name: 'Business', price: '3.000€', fee: '15%', featured: true },
            { name: 'Enterprise', price: 'Devis', fee: '12%' },
          ].map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'rounded-xl p-4 text-center border',
                p.featured
                  ? 'bg-white text-black border-white/20'
                  : 'bg-white/[0.04] border-white/[0.08] text-white'
              )}
            >
              <div className={cn('text-[9px] font-medium tracking-[0.12em] uppercase mb-2 font-sans', p.featured ? 'text-black/40' : 'text-white/30')}>{p.name}</div>
              <div className="font-serif text-base font-bold mb-0.5">{p.price}</div>
              <div className={cn('text-[10px] font-sans', p.featured ? 'text-black/40' : 'text-white/30')}>/mois</div>
              <div className={cn('mt-3 pt-3 border-t', p.featured ? 'border-black/10' : 'border-white/[0.06]')}>
                <div className="font-serif text-lg font-bold">{p.fee}</div>
                <div className={cn('text-[9px] font-sans', p.featured ? 'text-black/30' : 'text-white/25')}>fee placement</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
];

/* ─── Animations ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

/* ─── Component ─── */
const DemoPage = () => {
  const [perspective, setPerspective] = useState<Perspective>('candidat');
  const [currentScene, setCurrentScene] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scenes = perspective === 'candidat' ? candidatScenes : cabinetScenes;
  const scene = scenes[currentScene];

  const switchPerspective = (p: Perspective) => {
    setPerspective(p);
    setCurrentScene(0);
    setDirection(0);
  };

  const go = useCallback((idx: number) => {
    setDirection(idx > currentScene ? 1 : -1);
    setCurrentScene(idx);
  }, [currentScene]);

  const goNext = () => { if (currentScene < scenes.length - 1) go(currentScene + 1); };
  const goPrev = () => { if (currentScene > 0) go(currentScene - 1); };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background video — ambient */}
      <div className="fixed inset-0 z-0">
        <video
          src={heroVideo}
          autoPlay muted loop playsInline
          className="w-full h-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      {/* Fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl tracking-[-0.02em] text-white/80 hover:text-white transition-colors">
          Logan
        </Link>
        <div className="flex items-center gap-6">
          {/* Perspective toggle */}
          <div className="hidden sm:flex bg-white/[0.06] backdrop-blur-sm rounded-full p-1 border border-white/[0.08]">
            {(['candidat', 'cabinet'] as Perspective[]).map(p => (
              <button
                key={p}
                onClick={() => switchPerspective(p)}
                className={cn(
                  'px-5 py-2 text-[11px] font-medium rounded-full transition-all duration-300 font-sans',
                  perspective === p
                    ? 'bg-white text-black'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {p === 'candidat' ? 'Candidat' : 'Cabinet'}
              </button>
            ))}
          </div>
          <Link to="/inscription?espace=candidat">
            <Button size="sm" className="bg-white text-black hover:bg-white/90 text-[11px] font-medium rounded-full px-5 font-sans">
              S'inscrire <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile perspective toggle */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex bg-white/[0.06] backdrop-blur-md rounded-full p-1 border border-white/[0.08]">
        {(['candidat', 'cabinet'] as Perspective[]).map(p => (
          <button
            key={p}
            onClick={() => switchPerspective(p)}
            className={cn(
              'px-5 py-2.5 text-[11px] font-medium rounded-full transition-all duration-300 font-sans',
              perspective === p
                ? 'bg-white text-black'
                : 'text-white/40'
            )}
          >
            {p === 'candidat' ? 'Candidat' : 'Cabinet'}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-24 pb-32">
        {/* Intro title */}
        <div className="px-6 sm:px-10 lg:px-16 pt-8 pb-16 text-center">
          <motion.div
            key={perspective}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-5 font-sans">
              {perspective === 'candidat' ? 'Parcours candidat' : 'Parcours cabinet'}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.1] tracking-[-0.02em] mb-4">
              Comment ça fonctionne
            </h1>
            <p className="text-sm text-white/35 font-sans font-light max-w-md mx-auto">
              Découvrez Logan en 3 étapes — naviguez avec les flèches ou cliquez.
            </p>
          </motion.div>
        </div>

        {/* Scene progress dots */}
        <div className="flex justify-center gap-3 mb-12 px-6">
          {scenes.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="group flex items-center gap-2"
            >
              <div className={cn(
                'h-[3px] rounded-full transition-all duration-700',
                i === currentScene ? 'w-12 bg-white' : 'w-6 bg-white/15 group-hover:bg-white/30'
              )} />
            </button>
          ))}
        </div>

        {/* Scene content */}
        <div className="flex-1 flex items-center px-6 sm:px-10 lg:px-16">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`${perspective}-${currentScene}`}
              custom={direction}
              initial={{ opacity: 0, x: direction >= 0 ? 80 : -80, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction >= 0 ? -80 : 80, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-[1fr,380px] gap-16 lg:gap-24 items-center">
                {/* Left: Text */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[10px] tracking-[0.2em] uppercase text-white/25 mb-6 font-sans"
                  >
                    {scene.tag}
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-[1.12] tracking-[-0.02em] mb-5 whitespace-pre-line"
                  >
                    {scene.title}
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm text-white/40 font-sans font-light leading-relaxed max-w-md mb-10"
                  >
                    {scene.description}
                  </motion.p>

                  <div className="space-y-4">
                    {scene.points.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-4 items-start"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/40">
                          {point.icon}
                        </div>
                        <p className="text-[13px] text-white/55 leading-relaxed pt-1 font-sans">{point.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Visual mockup */}
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center justify-center"
                >
                  {scene.visual}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="px-6 sm:px-10 lg:px-16 mt-16">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button
              onClick={goPrev}
              disabled={currentScene === 0}
              className={cn(
                'flex items-center gap-2 text-[12px] font-sans font-medium transition-all duration-300',
                currentScene === 0 ? 'text-white/10 cursor-not-allowed' : 'text-white/40 hover:text-white'
              )}
            >
              ← Précédent
            </button>

            {currentScene === scenes.length - 1 ? (
              <Link to={perspective === 'candidat' ? '/inscription?start=2' : '/cabinet?start=2'}>
                <Button className="bg-white text-black hover:bg-white/90 text-[12px] font-medium rounded-full px-8 py-5 font-sans group">
                  {perspective === 'candidat' ? 'Créer mon profil' : 'Inscrire mon cabinet'}
                  <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center gap-2 text-[12px] font-sans font-medium text-white/40 hover:text-white transition-all duration-300"
              >
                Suivant →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
