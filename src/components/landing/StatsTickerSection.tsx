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
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden min-h-[80vh] bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-black/40 mb-4">
            Logan en chiffres
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-serif font-normal text-black leading-tight tracking-[-0.02em]">
            La confiance se mesure<br />
            <em className="text-black/45 font-normal">en résultats</em>
          </h2>
        </motion.div>

        {/* Stats 3x2 grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-black/10 rounded-sm overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 sm:p-10 md:p-14 text-center flex flex-col items-center justify-center group bg-white hover:bg-black/[0.025] transition-colors duration-500"
            >
              <stat.icon className="w-5 h-5 text-black/35 mb-5 group-hover:text-black/65 transition-colors duration-500" strokeWidth={1.5} />
              <div className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-black mb-3 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-black/70 mb-1.5">
                {stat.label}
              </div>
              <div className="text-[10px] font-sans text-black/45 font-light leading-relaxed">
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
          className="mt-10 flex items-center justify-center gap-6 text-[10px] font-sans text-black/45 tracking-[0.1em] uppercase"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-black/50 animate-pulse" />
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
