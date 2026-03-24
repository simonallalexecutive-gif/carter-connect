import { motion } from 'motion/react';
import founderImg from '@/assets/founder-simon.jpeg';

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

          {/* Citation — équipe Logan */}
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

          {/* Founder presentation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/10">
                  <img
                    src={founderImg}
                    alt="Simon Allal, Fondateur de Logan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="text-center md:text-left">
                <h3 className="font-serif text-xl md:text-2xl text-white font-normal mb-1 tracking-[-0.01em]">
                  Simon Allal
                </h3>
                <p className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-white/40 mb-5">
                  Fondateur
                </p>
                <p className="font-sans text-sm text-white/55 font-light leading-relaxed mb-4">
                  Fort d'un réseau reconnu et d'une compréhension aiguë du marché des avocats, Simon a fondé Logan avec une conviction : l'expérience recrutement doit être repensée en proposant une approche plus structurée, plus confidentielle et plus exigeante.
                </p>
                <p className="font-sans text-sm text-white/55 font-light leading-relaxed">
                  Logan est né de cette ambition — créer un écosystème où chaque mise en relation est pensée, préparée et orchestrée avec la rigueur qu'exigent les meilleurs candidats et les cabinets les plus prestigieux.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
