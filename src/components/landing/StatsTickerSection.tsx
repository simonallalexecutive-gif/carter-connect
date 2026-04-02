import { motion, useInView, useSpring, useTransform, useMotionValue } from 'motion/react';
import { useRef, useEffect } from 'react';
import { Shield, TrendingUp, Users, Building2, CheckCircle, FileCheck } from 'lucide-react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  inView: boolean;
}

const AnimatedCounter = ({ target, suffix = '', duration = 2, inView }: AnimatedCounterProps) => {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v: number) => `${Math.round(v).toLocaleString('fr-FR')}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (inView) motionValue.set(target);
  }, [inView, target, motionValue]);

  return <motion.span ref={ref} className="tabular-nums">{display}</motion.span>;
};

const stats = [
  { icon: Building2, value: 47, suffix: '', label: 'Cabinets partenaires', detail: 'Magic Circle, US & indépendants' },
  { icon: Users, value: 312, suffix: '', label: 'Candidats inscrits', detail: 'Profils qualifiés & vérifiés' },
  { icon: TrendingUp, value: 89, suffix: '', label: 'Placements réalisés', detail: 'Depuis le lancement' },
  { icon: Shield, value: 100, suffix: '%', label: 'Confidentiel', detail: 'Anonymat garanti à chaque étape' },
  { icon: CheckCircle, value: 48, suffix: 'h', label: 'Validation profil', detail: 'Délai moyen de vérification' },
  { icon: FileCheck, value: 100, suffix: '%', label: 'Conformité RGPD', detail: 'Protection des données personnelles' },
];

const StatsTickerSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden" style={{ background: 'hsl(0 0% 6%)' }}>
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-4">
            Logan en chiffres
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-serif font-normal text-white leading-tight tracking-[-0.02em]">
            La confiance se mesure<br />
            <em className="text-white/50 font-normal">en résultats</em>
          </h2>
        </motion.div>

        {/* Stats 3x2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-sm overflow-hidden" style={{ background: 'hsl(0 0% 10%)' }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-foreground p-10 md:p-14 text-center flex flex-col items-center justify-center group hover:bg-white/[0.06] transition-colors duration-500"
            >
              <stat.icon className="w-5 h-5 text-white/30 mb-5 group-hover:text-white/50 transition-colors duration-500" />
              <div className="font-serif text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-white/60 mb-1.5">
                {stat.label}
              </div>
              <div className="text-[10px] font-sans text-white/40 font-light leading-relaxed">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom ticker line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-10 flex items-center justify-center gap-6 text-[10px] font-sans text-white/40 tracking-[0.1em] uppercase"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            Plateforme active
          </span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Données mises à jour en temps réel</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden md:inline">Réseau confidentiel depuis 2025</span>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsTickerSection;
