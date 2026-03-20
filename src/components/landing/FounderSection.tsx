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

          {/* Founder card */}
          <div className="flex flex-col items-center gap-10">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0"
            >
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-black border border-white/20 overflow-hidden">
                <img
                  src={founderPhoto}
                  alt="Simon Allal, fondateur de Logan"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '45% 25%' }}
                />
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="text-center flex-1"
            >
              <h3 className="font-serif text-2xl md:text-3xl text-white font-normal mb-2 tracking-[-0.01em]">
                Simon Allal
              </h3>
              <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/50 mb-6">
                Fondateur
              </p>
              <p className="font-sans text-sm md:text-base text-white/60 font-light leading-relaxed mb-8 max-w-lg mx-auto">
                Fort d'une expertise approfondie du marché juridique, Simon Allal a fondé Logan avec la conviction qu'une approche confidentielle, ciblée et humaine pouvait transformer le recrutement des avocats d'affaires.
              </p>
              <Link to="/a-propos" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-white/70 hover:text-white transition-colors duration-300 group">
                À propos
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
