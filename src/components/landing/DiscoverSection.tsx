import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Shield, Eye, EyeOff, Users, Search,
  Handshake, Building2, UserCheck, Bell, BarChart3, Clock, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Perspective = 'candidat' | 'cabinet';

interface Slide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  points: { icon: React.ReactNode; text: string }[];
  visual?: React.ReactNode;
}

const candidatSlides: Slide[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Créez votre profil confidentiel',
    subtitle: 'Inscription en 5 minutes — votre identité reste strictement protégée.',
    points: [
      { icon: <EyeOff className="w-4 h-4" />, text: 'Votre nom et votre cabinet actuel ne sont jamais révélés aux recruteurs.' },
      { icon: <UserCheck className="w-4 h-4" />, text: 'Renseignez votre expertise, séniorité, langues et aspirations.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Profil validé sous 48h par l\'équipe Logan.' },
    ],
    visual: (
      <div className="bg-foreground rounded-lg p-6 text-background max-w-sm mx-auto">
        <div className="text-[8px] tracking-[0.16em] uppercase text-background/30 mb-3">Profil anonymisé</div>
        <div className="font-serif text-lg font-bold mb-1">Collaborateur · M&A / PE</div>
        <div className="text-xs text-background/50 mb-4">5 ans PQE · Cabinet US Tier 1</div>
        <div className="flex gap-1.5 flex-wrap">
          {['M&A Industriel', 'Private Equity', 'Bilingue'].map(t => (
            <span key={t} className="text-[10px] px-2.5 py-1 rounded-full border border-background/15 text-background/60">{t}</span>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-background/10 text-[11px] text-background/40 flex items-center gap-2">
          <EyeOff className="w-3.5 h-3.5" /> Identité protégée
        </div>
      </div>
    ),
  },
  {
    icon: <Bell className="w-8 h-8" />,
    title: 'Recevez des opportunités ciblées',
    subtitle: 'Les cabinets publient leurs besoins — Logan vous présente ceux qui matchent.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Matching intelligent basé sur votre expertise, séniorité et préférences.' },
      { icon: <Eye className="w-4 h-4" />, text: 'Consultez les fiches d\'opportunité : département, taille d\'équipe, rémunération.' },
      { icon: <Shield className="w-4 h-4" />, text: 'Le cabinet ne sait pas que vous existez tant que vous n\'avez pas dit oui.' },
    ],
    visual: (
      <div className="bg-foreground rounded-lg overflow-hidden max-w-sm mx-auto">
        <div className="p-5 border-b border-background/[0.06]">
          <div className="text-[8px] tracking-[0.16em] uppercase text-background/30 mb-2">Opportunité · Présentée par LOGAN</div>
          <div className="font-serif text-base font-bold text-background mb-1">Senior · Banque & Finance</div>
          <div className="text-[11px] text-background/45">Cabinet anonyme · Tier 1</div>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[8px] uppercase text-background/30 mb-1">Rétrocession</div>
            <div className="font-serif text-sm font-bold text-background">65–80 K€</div>
          </div>
          <div>
            <div className="text-[8px] uppercase text-background/30 mb-1">Équipe</div>
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
    icon: <Handshake className="w-8 h-8" />,
    title: 'Mise en relation orchestrée',
    subtitle: 'Logan lève le rideau uniquement avec votre accord explicite.',
    points: [
      { icon: <Users className="w-4 h-4" />, text: 'Votre consultant Logan prépare l\'échange : contexte, attentes, timing.' },
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Entretien organisé — le cabinet découvre votre identité à ce moment seulement.' },
      { icon: <Shield className="w-4 h-4" />, text: '0% commission côté candidat. Toujours. Sans exception.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto space-y-3">
        {[
          { step: '1', label: 'Intérêt mutuel confirmé', done: true },
          { step: '2', label: 'Brief de votre consultant Logan', done: true },
          { step: '3', label: 'Levée de rideau & entretien', done: false },
        ].map(s => (
          <div key={s.step} className={cn(
            'flex items-center gap-4 p-4 rounded-lg border transition-all',
            s.done ? 'bg-foreground text-background border-foreground' : 'bg-secondary border-border'
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

const cabinetSlides: Slide[] = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Publiez votre recherche',
    subtitle: 'Décrivez le profil idéal — Logan cible les candidats pertinents.',
    points: [
      { icon: <Search className="w-4 h-4" />, text: 'Séniorité, expertise, taille d\'opérations, anglais, cabinet d\'origine…' },
      { icon: <Shield className="w-4 h-4" />, text: '3 niveaux de confidentialité : confidentielle, semi-confidentielle, ouverte.' },
      { icon: <Users className="w-4 h-4" />, text: 'Précisez vos cabinets prioritaires pour des alertes ciblées.' },
    ],
    visual: (
      <div className="bg-secondary rounded-lg p-6 max-w-sm mx-auto">
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
    icon: <Eye className="w-8 h-8" />,
    title: 'Consultez le vivier premium',
    subtitle: 'Accédez en temps réel aux profils anonymisés à l\'écoute du marché.',
    points: [
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Score de matching intelligent : expertise, séniorité, motivations.' },
      { icon: <Bell className="w-4 h-4" />, text: 'Alertes prioritaires dès qu\'un profil correspond à vos critères.' },
      { icon: <Clock className="w-4 h-4" />, text: 'Recrutement stratégique : identifiez les talents avant vos concurrents.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto space-y-2.5">
        {[
          { id: 'C-042', title: 'Senior Associate Finance · 5 ans', match: 92, tags: ['Financement', 'PE'], tier: 'Cabinet US Tier 1' },
          { id: 'C-057', title: 'Collaborateur M&A · 4 ans', match: 88, tags: ['M&A', 'PE'], tier: 'Cabinet FR Tier 1' },
          { id: 'C-071', title: 'Collaborateur Finance · 3 ans', match: 79, tags: ['Financement', 'Restructuring'], tier: 'Cabinet UK Tier 2' },
        ].map(p => (
          <div key={p.id} className="bg-foreground rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center text-background font-serif text-sm font-bold flex-shrink-0">
              {p.match}%
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-background truncate">{p.title}</div>
              <div className="text-[10px] text-background/40 mt-0.5">{p.tier}</div>
              <div className="flex gap-1 mt-1.5">
                {p.tags.map(t => (
                  <span key={t} className="text-[9px] px-2 py-0.5 rounded-full border border-background/15 text-background/50">{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Handshake className="w-8 h-8" />,
    title: 'Un modèle hybride gagnant',
    subtitle: 'Abonnement mensuel + fee de placement réduit vs chasseurs traditionnels.',
    points: [
      { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Starter à 1.500€/mois (fee 18%) — Business à 3.000€/mois (fee 15%) — Enterprise sur devis (fee 12%).' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'Jusqu\'à 50% d\'économie vs un chasseur classique (20–25% de fee).' },
      { icon: <Clock className="w-4 h-4" />, text: 'Accès permanent au vivier : recrutez quand l\'opportunité se présente, pas dans l\'urgence.' },
    ],
    visual: (
      <div className="max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Starter', price: '1.500€', fee: '18%' },
            { name: 'Business', price: '3.000€', fee: '15%', badge: true },
            { name: 'Enterprise', price: 'Devis', fee: '12%' },
          ].map(p => (
            <div key={p.name} className={cn(
              'rounded-lg p-4 text-center border',
              p.badge ? 'bg-foreground text-background border-foreground' : 'bg-secondary border-border'
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
        <div className="mt-4 p-3 rounded bg-secondary border border-border text-center">
          <span className="text-[11px] text-muted-foreground">Chasseur classique : </span>
          <span className="text-[11px] font-bold text-foreground line-through">20–25% fee</span>
        </div>
      </div>
    ),
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const DiscoverSection = () => {
  const [perspective, setPerspective] = useState<Perspective>('candidat');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = perspective === 'candidat' ? candidatSlides : cabinetSlides;
  const slide = slides[currentSlide];

  const switchPerspective = (p: Perspective) => {
    setPerspective(p);
    setCurrentSlide(0);
    setDirection(0);
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(c => c + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(c => c - 1);
    }
  };

  return (
    <section className="carter-section bg-background">
      <div className="carter-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4 text-center">
            Notre Approche
          </p>
          <p className="text-sm text-muted-foreground font-light max-w-md leading-relaxed mb-10 text-center mx-auto">
            Explorez le parcours Logan selon votre perspective.
          </p>

          {/* Perspective toggle */}
          <div className="inline-flex bg-secondary rounded-sm p-1 border border-border">
            {(['candidat', 'cabinet'] as Perspective[]).map(p => (
              <button
                key={p}
                onClick={() => switchPerspective(p)}
                className={cn(
                  'px-6 py-2.5 text-xs font-medium rounded-sm transition-all duration-300',
                  perspective === p
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {p === 'candidat' ? '👤 Côté Candidat' : '🏛️ Côté Cabinet'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
              className={cn(
                'h-1 rounded-full transition-all duration-500',
                i === currentSlide ? 'w-10 bg-foreground' : 'w-5 bg-border hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${perspective}-${currentSlide}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="grid md:grid-cols-2 gap-10 items-center min-h-[400px]">
              {/* Left: Content */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground">
                    {slide.icon}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
                    Étape {currentSlide + 1} / {slides.length}
                  </div>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl font-normal text-foreground mb-3 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8">
                  {slide.subtitle}
                </p>

                <div className="space-y-4">
                  {slide.points.map((point, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex gap-3 items-start"
                    >
                      <div className="w-8 h-8 rounded-md bg-secondary border border-border flex items-center justify-center flex-shrink-0 text-muted-foreground">
                        {point.icon}
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed pt-1">{point.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right: Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                {slide.visual}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
          <Button
            variant="outline"
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="text-sm rounded-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
          </Button>

          {currentSlide === slides.length - 1 ? (
            <Link to={perspective === 'candidat' ? '/inscription?start=2' : '/cabinet?start=2'}>
              <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm font-bold rounded-sm px-8">
                {perspective === 'candidat' ? 'Créer mon profil' : 'Inscrire mon cabinet'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              onClick={goNext}
              className="bg-foreground text-background hover:bg-foreground/90 text-sm font-bold rounded-sm px-8"
            >
              Suivant <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
