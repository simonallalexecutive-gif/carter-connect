import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { Shield, Sparkles, Users } from 'lucide-react';

const pillars = [
  {
    icon: Shield,
    keyword: 'Confidentiel',
    text: 'Votre identité reste protégée à chaque étape. Aucune information n\'est partagée sans votre accord.',
  },
  {
    icon: Users,
    keyword: 'Sélectif',
    text: 'Un réseau fermé de cabinets de premier plan et de profils rigoureusement qualifiés.',
  },
  {
    icon: Sparkles,
    keyword: 'Accompagné',
    text: 'Un consultant dédié orchestre chaque mise en relation pour garantir la pertinence de chaque rencontre.',
  },
];

const ValueProposition = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineWidth = useTransform(scrollYProgress, [0.15, 0.45], ['0%', '100%']);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-36 bg-background overflow-hidden">
      {/* Subtle background grain */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-10 text-center"
        >
          Notre offre
        </motion.p>

        {/* Editorial statement */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-[3.5rem] font-serif font-normal text-foreground leading-[1.12] tracking-[-0.02em] max-w-4xl mx-auto text-center"
        >
          Une plateforme de recrutement{' '}
          <em className="text-muted-foreground font-normal">d'excellence</em>
          <br className="hidden md:block" />{' '}
          soutenue par des{' '}
          <em className="text-muted-foreground font-normal">experts du marché.</em>
        </motion.h2>

        {/* Animated divider */}
        <div className="flex justify-center mt-14 mb-14">
          <motion.div className="h-px bg-border" style={{ width: lineWidth }} />
        </div>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.keyword}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative py-6 px-8 md:px-10 text-center"
            >
              {/* Vertical separator on desktop */}
              {i > 0 && (
                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-border" />
              )}
              {/* Horizontal separator on mobile */}
              {i > 0 && (
                <div className="md:hidden w-12 h-px bg-border mx-auto mb-6" />
              )}

              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-5 group-hover:border-foreground/30 transition-colors duration-500">
                <pillar.icon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-500" />
              </div>

              <h3 className="font-serif text-xl md:text-2xl text-foreground mb-3 font-normal tracking-[-0.01em]">
                {pillar.keyword}
              </h3>

              <p className="font-sans text-sm text-muted-foreground font-light leading-relaxed max-w-[260px] mx-auto">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
