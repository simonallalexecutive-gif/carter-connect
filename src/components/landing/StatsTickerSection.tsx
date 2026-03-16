import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Shield, TrendingUp, Users, Building2, CheckCircle } from 'lucide-react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  inView: boolean;
}

const AnimatedCounter = ({ target, suffix = '', prefix = '', duration = 2, inView }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return (
    <span className="tabular-nums">
      {prefix}{count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
};

const stats = [
  { icon: Building2, value: 47, suffix: '', label: 'Cabinets partenaires', detail: 'Magic Circle, US & indépendants' },
  { icon: Users, value: 312, suffix: '', label: 'Candidats inscrits', detail: 'Profils qualifiés & vérifiés' },
  { icon: TrendingUp, value: 89, suffix: '', label: 'Placements réalisés', detail: 'Depuis le lancement' },
  { icon: Shield, value: 100, suffix: '%', label: 'Confidentiel', detail: 'Anonymat garanti à chaque étape' },
  { icon: CheckCircle, value: 48, suffix: 'h', label: 'Validation profil', detail: 'Délai moyen de vérification' },
];

const StatsTickerSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-foreground overflow-hidden">

      <div className="carter-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="w-12 h-px bg-primary-foreground/30 mx-auto mb-8" />
          <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-primary-foreground/40 mb-4">
            Logan en chiffres
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-serif font-normal text-primary-foreground leading-tight tracking-[-0.02em]">
            La confiance se mesure<br />
            <em className="text-primary-foreground/50 font-normal">en résultats</em>
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-primary-foreground/10 rounded-sm overflow-hidden">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-foreground p-6 md:p-8 text-center flex flex-col items-center justify-center group hover:bg-accent/80 transition-colors duration-500"
            >
              <stat.icon className="w-5 h-5 text-primary-foreground/30 mb-4 group-hover:text-primary-foreground/60 transition-colors duration-500" />
              <div className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-2 tracking-tight">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} inView={inView} />
              </div>
              <div className="text-[11px] font-sans font-semibold tracking-[0.1em] uppercase text-primary-foreground/60 mb-1">
                {stat.label}
              </div>
              <div className="text-[10px] font-sans text-primary-foreground/30 font-light leading-relaxed">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom ticker line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 flex items-center justify-center gap-6 text-[10px] font-sans text-primary-foreground/25 tracking-[0.1em] uppercase"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60 animate-pulse" />
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
