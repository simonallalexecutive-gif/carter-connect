import { motion } from 'motion/react';
import founderImg from '@/assets/founder-simon.jpeg';

const FounderSection = () => {
  return (
    <section className="py-14 md:py-20 overflow-hidden border-t border-white/[0.08]" style={{ background: 'hsl(0 0% 8%)' }}>
      <div className="carter-container">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-white/40 mb-16 md:mb-20 text-center"
          >
            Notre vision
          </motion.p>

          {/* Founder — photo beside bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center sm:items-center justify-center gap-8 sm:gap-12 mb-14 md:mb-16"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-white/10 shadow-lg flex-shrink-0">
              <img
                src={founderImg}
                alt="Simon Allal, Fondateur de Logan"
                className="w-full h-full object-cover"
                style={{ objectPosition: '50% 30%' }}
              />
            </div>

            <div className="text-center sm:text-left max-w-sm">
              <h3 className="font-serif text-2xl text-white font-normal mb-0.5 tracking-[-0.01em]">
                Simon Allal
              </h3>
              <p className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40 mb-5">
                Fondateur
              </p>
              <p className="font-sans text-[0.92rem] text-white/60 font-light leading-relaxed">
                Fort d'un réseau reconnu et d'une compréhension aiguë du marché des avocats, Simon a fondé Logan avec une conviction&nbsp;: l'expérience recrutement doit être repensée en proposant une approche plus structurée, plus confidentielle et plus exigeante.
              </p>
            </div>
          </motion.div>

          {/* Logan team quote — 30% bigger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="font-serif text-lg sm:text-xl md:text-2xl text-white/50 italic leading-relaxed mb-4 tracking-[-0.01em]">
              «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
            </p>
            <span className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-white/30">
              — L'équipe Logan
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
