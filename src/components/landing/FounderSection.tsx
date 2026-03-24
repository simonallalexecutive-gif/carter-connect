import { motion } from 'motion/react';
import founderImg from '@/assets/founder-simon.jpeg';

const FounderSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="carter-container">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-muted-foreground mb-16 text-center"
          >
            Notre vision
          </motion.p>

          {/* Two-column layout: Founder left, Quote bottom-right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            {/* Left: Founder presentation — takes prominence */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-foreground/10 shadow-lg">
                    <img
                      src={founderImg}
                      alt="Simon Allal, Fondateur de Logan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="text-center sm:text-left">
                  <h3 className="font-serif text-2xl md:text-3xl text-foreground font-normal mb-1 tracking-[-0.01em]">
                    Simon Allal
                  </h3>
                  <p className="text-[11px] font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground mb-6">
                    Fondateur
                  </p>
                  <p className="font-sans text-[0.92rem] text-foreground/70 font-light leading-relaxed mb-4">
                    Fort d'un réseau reconnu et d'une compréhension aiguë du marché des avocats, Simon a fondé Logan avec une conviction&nbsp;: l'expérience recrutement doit être repensée en proposant une approche plus structurée, plus confidentielle et plus exigeante.
                  </p>
                  <p className="font-sans text-[0.92rem] text-foreground/70 font-light leading-relaxed">
                    Logan est né de cette ambition — créer un écosystème où chaque mise en relation est pensée, préparée et orchestrée avec la rigueur qu'exigent les meilleurs candidats et les cabinets les plus prestigieux.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right-bottom: Team quote — subtle, secondary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 lg:self-end"
            >
              <div className="border-l-2 border-foreground/10 pl-6 lg:pl-8">
                <p className="font-serif text-sm sm:text-[0.95rem] text-foreground/45 italic leading-relaxed mb-3 tracking-[-0.01em]">
                  «&nbsp;Logan se positionne comme la plateforme la plus exigeante et structurée du marché, offrant un accompagnement sur mesure, résolument confidentiel et parfaitement ciblé.&nbsp;»
                </p>
                <span className="text-[10px] font-sans font-medium tracking-[0.15em] uppercase text-muted-foreground/60">
                  — L'équipe Logan
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
