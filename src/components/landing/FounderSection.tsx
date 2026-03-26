import { motion } from 'motion/react';
import founderImg from '@/assets/founder-simon.jpeg';

const FounderSection = () => {
  return (
    <section className="py-20 md:py-28 overflow-hidden border-t border-white/[0.08]" style={{ background: 'hsl(0 0% 8%)' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-[11px] font-sans font-medium tracking-[0.25em] uppercase text-white/30 mb-16 md:mb-20"
        >
          Notre vision
        </motion.p>

        {/* Founder — photo left, bio right (wider) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-start gap-10 sm:gap-16 mb-16 md:mb-20"
        >
          {/* Left — photo */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0 mt-2">
            <img
              src={founderImg}
              alt="Simon Allal, Fondateur de Logan"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 30%' }}
            />
          </div>

          {/* Right — bio with line breaks between sentences */}
          <div className="text-left flex-1">
            <h3 className="font-serif text-2xl text-white font-normal mb-0.5 tracking-[-0.01em]">
              Simon Allal
            </h3>
            <p className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40 mb-6">
              Fondateur
            </p>
            <div className="font-sans text-[0.92rem] text-white/55 font-light leading-[1.75] space-y-4">
              <p>
                Fort d'un réseau solidement établi et d'une connaissance approfondie du marché des avocats d'affaires, Simon Allal a fondé Logan avec une ambition claire&nbsp;: créer les conditions de rencontres décisives et durables entre cabinets et candidats.
              </p>
              <p>
                Logan s'inscrit comme un espace confidentiel, structuré et exigeant, où les attentes des uns, les compétences des autres et la personnalité de chacun sont appréhendées avec précision.
              </p>
              <p>
                Cette mise en relation, fondée sur une analyse fine et un accompagnement attentif, permet de faire émerger des collaborations pleinement réussies.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quote — right aligned, hero serif font */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-end"
        >
          <div className="max-w-lg text-right">
            <p className="font-serif text-lg md:text-xl text-white/45 italic font-normal leading-[1.6] mb-4 tracking-[-0.01em]">
              «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
            </p>
            <span className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-white/25">
              — L'équipe Logan
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
