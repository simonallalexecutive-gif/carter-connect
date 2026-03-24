import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Target, Users, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    title: 'Précision',
    description:
      'Chaque mise en relation est le fruit d\'une analyse approfondie des attentes, des trajectoires et des ambitions — côté candidat comme côté cabinet.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidentialité',
    description:
      'L\'anonymat est garanti à chaque étape du processus. Aucune information n\'est transmise sans accord préalable et explicite.',
  },
  {
    icon: Users,
    title: 'Exigence',
    description:
      'Logan réunit exclusivement des profils et des cabinets triés sur le volet, pour des rencontres à la hauteur des standards du marché.',
  },
];

const FounderSection = () => {
  return (
    <section className="py-20 md:py-28 bg-foreground overflow-hidden">
      <div className="carter-container">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-14 text-center"
          >
            Notre vision
          </motion.p>

          {/* Citation */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto text-center mb-16 md:mb-20"
          >
            <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] text-white/60 italic leading-snug mb-3 font-[500] tracking-[-0.01em]">
              «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
            </p>
            <span className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40">
              — L'équipe Logan
            </span>
          </motion.blockquote>

          {/* Pillars grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                className="text-center"
              >
                <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center mx-auto mb-5">
                  <pillar.icon className="w-4.5 h-4.5 text-white/50" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg text-white font-normal mb-3 tracking-[-0.01em]">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-white/50 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-14"
          >
            <Link to="/a-propos" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white/60 hover:text-white transition-colors duration-300 group">
              En savoir plus
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
