import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import founderPhoto from '@/assets/founder-simon.jpeg';

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
            Qui sommes-nous
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

          {/* Founder bio — side by side */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            {/* Photo */}
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-2 ring-white/10">
              <img
                src={founderPhoto}
                alt="Simon Allal"
                className="w-full h-full object-cover object-[center_30%]"
              />
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl md:text-2xl text-white font-normal mb-1 tracking-[-0.01em] text-center">
                Simon Allal
              </h3>
              <p className="text-[10px] font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-5 text-center">
                Fondateur
              </p>
              <p className="font-sans text-sm md:text-[0.95rem] text-white/60 font-light leading-relaxed mb-6">
                Fort d'un réseau établi et d'une connaissance fine du marché des avocats d'affaires, Simon Allal a fondé Logan avec l'ambition de faire émerger des rencontres décisives et de leur donner les conditions de se concrétiser pleinement.
              </p>
              <Link to="/a-propos" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors duration-300 group">
                À propos
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
